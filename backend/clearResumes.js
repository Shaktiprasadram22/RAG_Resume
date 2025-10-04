// /**
//  * Script to clear all resumes from MongoDB
//  * Keeps user credentials intact (they're in localStorage)
//  */

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Resume from './models/Resume.js';

// dotenv.config();

// const clearResumes = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ Connected to MongoDB');

//     // Count resumes before deletion
//     const countBefore = await Resume.countDocuments();
//     console.log(`📊 Found ${countBefore} resumes in database`);

//     // Delete all resumes
//     const result = await Resume.deleteMany({});
//     console.log(`🗑️  Deleted ${result.deletedCount} resumes`);

//     // Verify deletion
//     const countAfter = await Resume.countDocuments();
//     console.log(`✅ Remaining resumes: ${countAfter}`);

//     console.log('\n✨ Database cleared! User credentials are safe in localStorage.');
    
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error clearing resumes:', error.message);
//     process.exit(1);
//   }
// };

// clearResumes();
