import express from 'express';
import { 
  createComplaint, 
  getComplaints, 
  updateComplaintStatus 
} from '../controllers/complaintController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(protect, getComplaints)
  .post(protect, upload.single('image'), createComplaint);

router.route('/:id/status')
  .put(protect, upload.single('image'), updateComplaintStatus);

export default router;