import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; 
import authRoutes from './routes/authRoutes.js'; 
import complaintRoutes from './routes/complaintRoutes.js'; 


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
// Basic 
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'CM360 API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});