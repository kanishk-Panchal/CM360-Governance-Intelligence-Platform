import Complaint from '../models/Complaint.js';


export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, district, address } = req.body;

    // Check image was uploaded 
    let evidenceUrl = null;
    if (req.file) {
      evidenceUrl = req.file.path; 
    }

    
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
      
      resolutionEvidence: evidenceUrl ? [evidenceUrl] : [] 
    });

    res.status(201).json({
      success: true,
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
      query.department = req.user.department; 
    }
  

    // 2. Fetch from MongoDB 
    const complaints = await Complaint.find(query)
      .populate('reportedBy', 'name email')
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