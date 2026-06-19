import Complaint from '../models/Complaint.js';
import User from '../models/User.js'; // MUST IMPORT USER MODEL FOR ROUTING

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, district, address } = req.body;

    // Check image was uploaded 
    let evidenceUrl = null;
    if (req.file) {
      evidenceUrl = req.file.path; 
    }

    // --- MAGIC ROUTING START ---
    // Look in the database for an Officer assigned to this exact district
    const matchingOfficer = await User.findOne({ 
      role: 'Officer', 
      district: district 
    });
    // --- MAGIC ROUTING END ---
    
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'Medium',
      location: {
        district,
        address
      },
      reportedBy: req.user._id, 
      resolutionEvidence: evidenceUrl ? [evidenceUrl] : [],
      
      // Assign the specific officer if found, otherwise null
      assignedTo: matchingOfficer ? matchingOfficer._id : null,
      
      // Instantly bump status if an officer was successfully matched!
      status: matchingOfficer ? 'Assigned' : 'Open'
    });

    res.status(201).json({
      success: true,
      message: matchingOfficer ? "Complaint automatically routed to district officer." : "Complaint filed (Unassigned).",
      data: complaint
    });

  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};



export const getComplaints = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Citizen') {
      query.reportedBy = req.user._id; 
    } else if (req.user.role === 'Officer') {
      // UPDATED: Now officers only see tickets specifically assigned to them!
      query.assignedTo = req.user._id; 
    }
  
    // Fetch from MongoDB 
    const complaints = await Complaint.find(query)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name phone department') // Also populate officer details
      .sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (status === 'Resolved_Pending_Verification' && req.user.role === 'Officer') {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'Anti-Corruption Alert: Photo evidence is strictly required to resolve a ticket.' 
        });
      }
      complaint.resolutionEvidence.push(req.file.path); 
      complaint.status = status;
    }
  
    else if (status === 'Closed' && req.user.role === 'Citizen') {
      complaint.status = 'Closed';
      complaint.citizenVerified = true;
    }
    else if (status === 'Reopened' && req.user.role === 'Citizen') {
      complaint.status = 'Reopened';
      complaint.citizenVerified = false;
    }
    else {
      complaint.status = status;
    }

    await complaint.save();

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    // 1. Active Complaints (Open, Assigned, or In Progress)
    const activeComplaints = await Complaint.countDocuments({
      status: { $in: ['Open', 'Assigned', 'In Progress'] }
    });

    // 2. Critical Alerts & Immediate Action
    const criticalAlerts = await Complaint.countDocuments({ 
      priority: 'CRITICAL',
      status: { $in: ['Open', 'Assigned'] } // Only unresolved criticals
    });

    // 3. Reopened Complaints (Citizen rejected the fix)
    const reopenedComplaints = await Complaint.countDocuments({ 
      status: 'Reopened' 
    });

    // 4. Citizen Trust Index (Percentage of closed tickets verified by citizens)
    const closedComplaints = await Complaint.countDocuments({ status: 'Closed' });
    const verifiedComplaints = await Complaint.countDocuments({ 
      status: 'Closed', 
      citizenVerified: true 
    });
    
    const citizenTrustIndex = closedComplaints === 0 
      ? 0 
      : Math.round((verifiedComplaints / closedComplaints) * 100);

    // 5. Accountability Score (Percentage of total tickets resolved)
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ 
      status: { $in: ['Resolved_Pending_Verification', 'Closed'] } 
    });
    
    const accountabilityScore = totalComplaints === 0 
      ? 0 
      : Math.round((resolvedComplaints / totalComplaints) * 100);

    // 6. District Hotspot Analysis (MongoDB Aggregation Pipeline)
   // 6. District Hotspot Analysis (MongoDB Aggregation Pipeline)
    const districtHotspots = await Complaint.aggregate([
      { 
        $group: { 
          _id: "$location.district", // Group by district name
          count: { $sum: 1 }         // Count how many in each district
        } 
      },
      { $sort: { count: -1 } }       // Sort highest to lowest
    ]);

    // Send the massive data payload back to the CM Dashboard
    res.status(200).json({
      success: true,
      data: {
        activeComplaints,
        criticalAlerts,
        reopenedComplaints,
        citizenTrustIndex,
        accountabilityScore,
        districtHotspots,
        totalComplaints
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};