const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function fixClerkIdIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.name);

    console.log('\n🔍 Current indexes:');
    const indexes = await User.collection.getIndexes();
    Object.keys(indexes).forEach(indexName => {
      console.log(`   ${indexName}:`, indexes[indexName]);
    });

    // Check if clerkId index exists
    if ('clerkId_1' in indexes) {
      console.log('\n❌ Found problematic clerkId_1 index');
      console.log('🛠️  Dropping clerkId_1 index...');
      
      try {
        await User.collection.dropIndex('clerkId_1');
        console.log('✅ Successfully dropped clerkId_1 index');
      } catch (error) {
        console.log('❌ Failed to drop index:', error.message);
      }
    } else {
      console.log('\n✅ No clerkId_1 index found');
    }

    console.log('\n🔍 Updated indexes:');
    const updatedIndexes = await User.collection.getIndexes();
    Object.keys(updatedIndexes).forEach(indexName => {
      console.log(`   ${indexName}:`, updatedIndexes[indexName]);
    });

    // Test user creation again
    console.log('\n🧪 Testing user creation after index fix...');
    try {
      const testUser = new User({
        username: 'user',
        email: '3halonfdo@gmail.com',
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      });
      
      await testUser.save();
      console.log('✅ User created successfully!');
      
      // Clean up - delete the test user
      await User.findByIdAndDelete(testUser._id);
      console.log('🧹 Test user cleaned up');
      
    } catch (error) {
      console.log('❌ User creation still failing:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixClerkIdIndex();