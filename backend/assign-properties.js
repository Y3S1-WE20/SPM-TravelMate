import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to assign properties to the logged-in user
async function assignProperties() {
  try {
    console.log('=== ASSIGNING PROPERTIES ===');
    
    const targetUserId = '68cccd662a312a37def84083'; // The logged-in HotelOwner
    
    // Find properties that have temp-owner-id and assign 2-3 of them to our user
    const tempProperties = await Property.find({ ownerId: 'temp-owner-id' }).limit(3);
    
    console.log(`Found ${tempProperties.length} properties with temp-owner-id`);
    
    for (const property of tempProperties) {
      console.log(`Assigning property "${property.title}" to user ${targetUserId}`);
      await Property.findByIdAndUpdate(property._id, { ownerId: targetUserId });
    }
    
    // Verify the assignment
    console.log('\n=== VERIFICATION ===');
    const userProperties = await Property.find({ ownerId: targetUserId });
    console.log(`User ${targetUserId} now owns ${userProperties.length} properties:`);
    
    userProperties.forEach(property => {
      console.log(`  - ${property.title} (ID: ${property._id})`);
    });
    
    mongoose.disconnect();
    console.log('\nProperty assignment completed!');
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

assignProperties();