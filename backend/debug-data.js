import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to check data
async function checkData() {
  try {
    console.log('=== CHECKING DATABASE ===');
    
    // Find nimal user
    console.log('\n1. Looking for nimal user...');
    const users = await User.find({
      $or: [
        { username: { $regex: /nimal/i } },
        { email: { $regex: /nimal/i } },
        { firstName: { $regex: /nimal/i } }
      ]
    });
    
    console.log(`Found ${users.length} users matching "nimal":`);
    users.forEach(user => {
      console.log(`  - ID: ${user._id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Check all properties
    console.log('\n2. Checking all properties...');
    const allProperties = await Property.find();
    console.log(`Total properties in database: ${allProperties.length}`);
    
    allProperties.forEach(property => {
      console.log(`  - ID: ${property._id}, Title: ${property.title}, OwnerID: ${property.ownerId}, Status: ${property.status}`);
    });
    
    // Check properties for the specific userId
    console.log('\n3. Checking properties for userId 68cccd662a312a37def84083...');
    const userProperties = await Property.find({ ownerId: '68cccd662a312a37def84083' });
    console.log(`Properties for this user: ${userProperties.length}`);
    
    // If no properties found, check if userId exists as _id format
    if (userProperties.length === 0) {
      console.log('\n4. Checking if properties exist with ObjectId format...');
      const objectIdProperties = await Property.find({ ownerId: new mongoose.Types.ObjectId('68cccd662a312a37def84083') });
      console.log(`Properties with ObjectId format: ${objectIdProperties.length}`);
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

checkData();