import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createNimalUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if nimal user exists
    let nimal = await User.findOne({ username: 'nimal' });
    
    if (nimal) {
      console.log('User "nimal" already exists, updating role to hotel owner...');
      nimal.role = 'hotel owner';
      await nimal.save();
      console.log('Updated nimal to hotel owner!');
    } else {
      console.log('Creating new user "nimal" as hotel owner...');
      
      const hashedPassword = await bcrypt.hash('nimal123', 12);
      
      nimal = new User({
        username: 'nimal',
        email: 'nimal@travelmate.com',
        password: hashedPassword,
        firstName: 'Nimal',
        lastName: 'Perera',
        role: 'hotel owner'
      });
      
      await nimal.save();
      console.log('Created nimal user as hotel owner!');
    }
    
    // Also check the existing properties and update owner if needed
    console.log(`\nNimal user details:`);
    console.log(`ID: ${nimal._id}`);
    console.log(`Username: ${nimal.username}`);
    console.log(`Email: ${nimal.email}`);
    console.log(`Role: ${nimal.role}`);
    console.log(`Name: ${nimal.firstName} ${nimal.lastName}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createNimalUser();