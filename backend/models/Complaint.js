import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // 🔒 LOCKED DOWN: Matches the User department exactly!
  category: { 
    type: String, 
    required: true,
    enum: [
      'Roads & Traffic', 
      'Water & Sanitation', 
      'Electricity', 
      'Garbage & Sanitation', 
      'Public Safety'
    ]
  }, 
  
  // Alert Engine
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'CRITICAL'], 
    default: 'Medium' 
  },
  
  // Status Pipeline
  status: { 
    type: String, 
    enum: ['Open', 'Assigned', 'In Progress', 'Resolved_Pending_Verification', 'Closed', 'Reopened'], 
    default: 'Open' 
  },
  
  location: {
    district: { type: String, required: true },
    address: { type: String, required: true }
  },

  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },  
  department: { type: String }, // Links to the Accountability Scoreboard

  // Evidence 
  resolutionEvidence: [{ type: String }], // Array to hold Cloudinary image URLs
  citizenVerified: { type: Boolean, default: false }

}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);