import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from './models/userModel.js';

dotenv.config();

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users without userType
    const usersWithoutType = await UserModel.find({ userType: { $exists: false } });
    console.log(`Found ${usersWithoutType.length} users without userType`);

    if (usersWithoutType.length === 0) {
      console.log('No users need migration');
      return;
    }

    // Update all users to have userType as 'student' by default
    // You can modify this logic based on your needs
    const updatePromises = usersWithoutType.map(user => {
      console.log(`Migrating user: ${user.srn} (${user.email})`);
      return UserModel.findByIdAndUpdate(user._id, { userType: 'student' });
    });

    await Promise.all(updatePromises);
    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUsers();
}

export default migrateUsers; 