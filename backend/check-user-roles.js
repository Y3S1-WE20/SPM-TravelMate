import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log('\n=== ALL USERS ===');
    users.forEach(user => {
      console.log(`ID: ${user._id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log('---');
    });
    
    // Update nimal to hotel owner if exists
    const nimal = await User.findOne({ $or: [{ username: 'nimal' }, { email: /nimal/i }] });
    if (nimal && nimal.role !== 'hotel owner') {
      console.log(`\nUpdating ${nimal.username} to hotel owner...`);
      nimal.role = 'hotel owner';
      await nimal.save();
      console.log('Updated successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();