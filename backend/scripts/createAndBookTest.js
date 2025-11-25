import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Package from '../models/Package.js';
import PackageBooking from '../models/PackageBooking.js';
import User from '../models/User.js';

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelmate';
  console.log('Connecting to MongoDB at', mongoUri);
  await mongoose.connect(mongoUri, { autoIndex: true });

  // Ensure we have a test user
  let user = await User.findOne({ email: 'test-user@example.com' });
  if (!user) {
    user = new User({ username: 'testuser', email: 'test-user@example.com', password: 'test1234', firstName: 'Test', lastName: 'User', role: 'user' });
    await user.save();
    console.log('Created test user:', user.email, user._id.toString());
  } else {
    console.log('Found test user:', user.email, user._id.toString());
  }

  // Create a test package
  let pkg = await Package.findOne({ title: 'Test Package for Booking' });
  if (!pkg) {
    pkg = new Package({
      title: 'Test Package for Booking',
      shortDescription: 'Auto-created test package',
      description: 'This package was created by a test script to validate bookings.',
      pricePerPerson: 10,
      durationDays: 2,
      itinerary: [ { day: 1, title: 'Arrival', description: 'Arrive and relax' }, { day: 2, title: 'City Tour', description: 'Explore local sights' } ],
      addOns: [ { name: 'Guide', price: 5 }, { name: 'Meals', price: 10 } ],
      capacity: 10,
      groupBookingAllowed: true,
      status: 'published'
    });
    await pkg.save();
    console.log('Created package:', pkg._id.toString());
  } else {
    console.log('Found existing package:', pkg._id.toString());
  }

  // Create a booking
  const booking = new PackageBooking({
    packageId: pkg._id,
    userId: user._id,
    travelers: [{ name: 'Test User', age: 30 }],
    numberOfPeople: 1,
    addOnsSelected: [],
    totalPrice: pkg.pricePerPerson,
    status: 'confirmed',
    contactEmail: 'test-user@example.com',
    contactPhone: '0000000000'
  });

  await booking.save();
  console.log('Created booking:', booking._id.toString());

  // Verify booking references
  const found = await PackageBooking.findById(booking._id).populate('packageId').populate('userId');
  console.log('Booking saved with package title:', found.packageId?.title);

  await mongoose.connection.close();
  console.log('Done. Closed DB connection.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Error in createAndBookTest:', err);
  process.exit(1);
});
