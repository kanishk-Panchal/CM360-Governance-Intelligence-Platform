import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Complaint from './models/Complaint.js';

// Load the database URL from your local .env file
dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Connected to MongoDB for seeding...");

    // 2. Arrays to generate randomized, realistic data
    const districts = ['South Delhi', 'North Delhi', 'New Delhi', 'East Delhi', 'West Delhi'];
    const categories = ['Roads & Traffic', 'Water & Sanitation', 'Electricity', 'Garbage & Sanitation', 'Public Safety'];
    const priorities = ['Low', 'Medium', 'High', 'CRITICAL'];
    const statuses = ['Open', 'Assigned', 'In Progress', 'Resolved_Pending_Verification', 'Closed', 'Reopened'];

    const dummyComplaints = [];
    const dummyUserId = new mongoose.Types.ObjectId(); // Generates a fake valid user ID

    // 3. Generate 30 randomized tickets
    for (let i = 0; i < 20; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const isClosed = status === 'Closed';

      dummyComplaints.push({
        title: `Dummy Grievance Test #${i + 1}`,
        description: "This is an auto-generated dummy complaint for testing the CM360 Command Center dashboard visualizations and aggregations.",
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: status,
        location: {
          district: districts[Math.floor(Math.random() * districts.length)],
          address: `Test Block ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}, Sector ${Math.floor(Math.random() * 20) + 1}`
        },
        reportedBy: dummyUserId, 
        // If it's closed, give it a 70% chance of being verified by the citizen
        citizenVerified: isClosed ? Math.random() > 0.3 : false, 
      });
    }

    // 4. Inject into the database
    await Complaint.insertMany(dummyComplaints);
    
    console.log(`✅ Success! Injected ${dummyComplaints.length} dummy complaints into the database.`);
    
    // 5. Safely close the script
    process.exit();
    
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1); // Exit with failure
  }
};

// Run the function
seedDatabase();