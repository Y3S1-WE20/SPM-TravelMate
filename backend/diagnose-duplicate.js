const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function diagnoseDuplicateIssue() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.name);
    console.log('📍 Connection string:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));

    const testUsername = 'user';
    const testEmail = '3halonfdo@gmail.com';

    console.log('\n🔍 Testing exact queries used in registration...');
    
    // Test the exact same query used in auth.js
    console.log('\n1. Testing $or query (same as auth.js):');
    const existingUser = await User.findOne({
      $or: [{ email: testEmail }, { username: testUsername }]
    });
    
    if (existingUser) {
      console.log('❌ Found conflicting user with $or query:');
      console.log('   ID:', existingUser._id);
      console.log('   Username:', existingUser.username);
      console.log('   Email:', existingUser.email);
      console.log('   Role:', existingUser.role);
    } else {
      console.log('✅ No conflicts found with $or query');
    }

    // Test individual queries
    console.log('\n2. Testing individual queries:');
    
    const userByEmail = await User.findOne({ email: testEmail });
    console.log('   Email query result:', userByEmail ? 'FOUND' : 'NOT FOUND');
    if (userByEmail) {
      console.log('     Found user:', userByEmail.username, userByEmail.email);
    }
    
    const userByUsername = await User.findOne({ username: testUsername });
    console.log('   Username query result:', userByUsername ? 'FOUND' : 'NOT FOUND');
    if (userByUsername) {
      console.log('     Found user:', userByUsername.username, userByUsername.email);
    }

    // Test case-insensitive queries
    console.log('\n3. Testing case-insensitive queries:');
    
    const userByEmailCI = await User.findOne({ 
      email: { $regex: new RegExp(`^${testEmail}$`, 'i') }
    });
    console.log('   Case-insensitive email:', userByEmailCI ? 'FOUND' : 'NOT FOUND');
    
    const userByUsernameCI = await User.findOne({ 
      username: { $regex: new RegExp(`^${testUsername}$`, 'i') }
    });
    console.log('   Case-insensitive username:', userByUsernameCI ? 'FOUND' : 'NOT FOUND');

    // Show all users
    console.log('\n4. All users in database:');
    const allUsers = await User.find({});
    console.log(`   Total users: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. "${user.username}" / "${user.email}" / "${user.role}"`);
    });

    // Test creating the user directly
    console.log('\n5. Testing direct user creation:');
    try {
      const testUser = new User({
        username: testUsername,
        email: testEmail,
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      });
      
      // Don't save, just validate
      await testUser.validate();
      console.log('✅ User validation passed - no schema issues');
      
      // Try to save (this will trigger the actual duplicate check)
      await testUser.save();
      console.log('✅ User created successfully!');
      
      // Clean up - delete the test user
      await User.findByIdAndDelete(testUser._id);
      console.log('🧹 Test user cleaned up');
      
    } catch (error) {
      console.log('❌ User creation failed:', error.message);
      if (error.code === 11000) {
        console.log('   This is a MongoDB duplicate key error');
        console.log('   Duplicate field:', error.keyPattern);
        console.log('   Duplicate value:', error.keyValue);
      }
    }

    // Check indexes
    console.log('\n6. Checking database indexes:');
    const indexes = await User.collection.getIndexes();
    console.log('   Indexes:');
    Object.keys(indexes).forEach(indexName => {
      console.log(`     ${indexName}:`, indexes[indexName]);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

diagnoseDuplicateIssue();