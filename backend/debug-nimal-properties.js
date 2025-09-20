import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugNimalProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get nimal user
    const nimal = await User.findOne({ username: 'nimal' });
    console.log('Nimal user:');
    console.log('- ID:', nimal._id.toString());
    console.log('- Username:', nimal.username);
    console.log('- Role:', nimal.role);
    
    // Check properties owned by nimal
    console.log('\n=== Properties owned by Nimal ===');
    const properties = await Property.find({ ownerId: nimal._id.toString() });
    console.log(`Found ${properties.length} properties:`);
    properties.forEach(prop => {
      console.log(`- ${prop.title}: ownerId = ${prop.ownerId}`);
    });
    
    // Check if there's a mismatch
    console.log('\n=== All properties with ownerId type ===');
    const allProps = await Property.find({});
    allProps.forEach(prop => {
      console.log(`${prop.title}: ownerId = "${prop.ownerId}" (type: ${typeof prop.ownerId})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugNimalProperties();