import mongoose from 'mongoose';
import Property from './models/Property.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkPropertyOwners() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const properties = await Property.find({});
    console.log(`\nFound ${properties.length} properties:`);
    
    properties.forEach(property => {
      console.log(`Title: ${property.title}`);
      console.log(`City: ${property.city}`);
      console.log(`Owner Name: ${property.ownerName}`);
      console.log(`Owner ID: ${property.ownerId}`);
      console.log(`Status: ${property.status}`);
      console.log('---');
    });
    
    // Get unique owner names
    const ownerNames = [...new Set(properties.map(p => p.ownerName))];
    console.log('\nUnique owner names:', ownerNames);
    
    // Get unique owner IDs
    const ownerIds = [...new Set(properties.map(p => p.ownerId))];
    console.log('Unique owner IDs:', ownerIds);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPropertyOwners();