// Quick Admin User Creation Script
// Run this with: node createAdminQuick.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['admin', 'user', 'hotel owner'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    // Connect to MongoDB (update the URI if needed)
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelmate';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@travelmate.com' });
    if (existingAdmin) {
      console.log('🔄 Admin user already exists!');
      console.log('📧 Email: admin@travelmate.com');
      console.log('👤 Username:', existingAdmin.username);
      console.log('🎭 Role:', existingAdmin.role);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@travelmate.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin'
    });

    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@travelmate.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: admin');
    console.log('🎭 Role: admin');
    console.log('');
    console.log('🚀 You can now login to the admin portal with these credentials!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📥 Database connection closed');
    process.exit(0);
  }
};

createAdmin();