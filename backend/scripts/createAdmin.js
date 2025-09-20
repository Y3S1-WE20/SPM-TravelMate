import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@travelmate.com' });
    if (existingAdmin) {
      console.log('Admin user already exists with email: admin@travelmate.com');
      console.log('Admin details:', {
        email: existingAdmin.email,
        username: existingAdmin.username,
        role: existingAdmin.role
      });
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@travelmate.com',
      password: 'admin123', // This will be hashed automatically by the pre-save hook
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin'
    });

    console.log('Creating admin user...');
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@travelmate.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('');
    console.log('You can now use these credentials to log in to the admin portal.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.log('Admin user might already exist. Check your database.');
    }
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run the script
createAdminUser();