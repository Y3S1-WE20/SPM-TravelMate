import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import dotenv from 'dotenv';

dotenv.config();

async function updatePropertyOwners() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get nimal user
    const nimal = await User.findOne({ username: 'nimal' });
    console.log('Nimal user ID:', nimal._id);
    
    // Find properties owned by "Nimal" 
    const properties = await Property.find({ ownerName: 'Nimal' });
    console.log(`Found ${properties.length} properties owned by "Nimal"`);
    
    // Update them to be owned by nimal user ID
    for (const property of properties) {
      console.log(`Updating property: ${property.title}`);
      property.ownerId = nimal._id.toString();
      await property.save();
    }
    
    console.log('All properties updated!');
    
    // Show updated properties
    const updatedProperties = await Property.find({ ownerId: nimal._id.toString() });
    console.log(`\nNimal now owns ${updatedProperties.length} properties:`);
    updatedProperties.forEach(prop => {
      console.log(`- ${prop.title} (${prop.city}) - Owner ID: ${prop.ownerId}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updatePropertyOwners();