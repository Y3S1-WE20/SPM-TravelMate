const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkDuplicateUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const username = 'user';
    const email = '3halonfdo@gmail.com';

    // Check for existing users
    console.log('\n🔍 Checking for existing users...');
    
    const existingByUsername = await User.findOne({ username });
    const existingByEmail = await User.findOne({ email });

    console.log('\n📊 Results:');
    
    if (existingByUsername) {
      console.log('❌ Username conflict found:');
      console.log('   Username:', existingByUsername.username);
      console.log('   Email:', existingByUsername.email);
      console.log('   Role:', existingByUsername.role);
      console.log('   Created:', existingByUsername.createdAt);
      console.log('   ID:', existingByUsername._id);
    } else {
      console.log('✅ No user found with username:', username);
    }

    if (existingByEmail) {
      console.log('❌ Email conflict found:');
      console.log('   Username:', existingByEmail.username);
      console.log('   Email:', existingByEmail.email);
      console.log('   Role:', existingByEmail.role);
      console.log('   Created:', existingByEmail.createdAt);
      console.log('   ID:', existingByEmail._id);
    } else {
      console.log('✅ No user found with email:', email);
    }

    // Show all users for reference
    console.log('\n👥 All users in database:');
    const allUsers = await User.find({}, 'username email role createdAt').sort({ createdAt: -1 });
    
    if (allUsers.length === 0) {
      console.log('   No users found in database');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.role} - ${user.createdAt.toISOString()}`);
      });
    }

    console.log('\n🛠️  To fix this issue:');
    console.log('1. Use a different username (not "user")');
    console.log('2. Use a different email address');
    console.log('3. Or delete the conflicting user from the database');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkDuplicateUsers();