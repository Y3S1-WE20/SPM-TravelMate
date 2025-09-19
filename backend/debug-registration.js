const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Test script to debug registration issues
async function testRegistration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Test data - same as what would come from frontend
    const testUserData = {
      username: 'testuser123',
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };

    const testHotelOwnerData = {
      username: 'testowner123',
      email: 'testowner@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Owner',
      role: 'hotel owner'
    };

    console.log('Testing user registration...');
    
    // Test user registration
    try {
      const user = new User(testUserData);
      await user.save();
      console.log('✅ User registration successful:', user.username, user.role);
    } catch (error) {
      console.log('❌ User registration failed:', error.message);
      console.log('Full error:', error);
    }

    console.log('\nTesting hotel owner registration...');
    
    // Test hotel owner registration
    try {
      const hotelOwner = new User(testHotelOwnerData);
      await hotelOwner.save();
      console.log('✅ Hotel owner registration successful:', hotelOwner.username, hotelOwner.role);
    } catch (error) {
      console.log('❌ Hotel owner registration failed:', error.message);
      console.log('Full error:', error);
    }

  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testRegistration();