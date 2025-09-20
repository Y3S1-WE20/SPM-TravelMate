import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestBooking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get a user (find any non-admin user)
    const user = await User.findOne({ role: 'user' });
    if (!user) {
      console.log('No user found');
      process.exit(1);
    }
    console.log('Found user:', user.username, user.email);
    
    // Get a property (find any approved property)
    const property = await Property.findOne({ status: 'approved' });
    if (!property) {
      console.log('No approved property found');
      process.exit(1);
    }
    console.log('Found property:', property.title);
    
    // Create a test booking
    const booking = new Booking({
      userId: user._id,
      propertyId: property._id,
      propertyTitle: property.title,
      propertyImage: property.images[0] || '',
      checkIn: new Date('2025-09-25'),
      checkOut: new Date('2025-09-27'),
      rooms: 1,
      adults: 2,
      children: 0,
      numberOfNights: 2,
      totalCost: property.pricePerNight * 2,
      guestInfo: {
        firstName: user.firstName || 'Test',
        lastName: user.lastName || 'User',
        email: user.email,
        country: 'Sri Lanka',
        phoneNumber: '0771234567',
        bookingFor: 'myself',
        arrivalTime: 'afternoon'
      },
      status: 'pending'
    });
    
    await booking.save();
    console.log('Created test booking with reference:', booking.bookingReference);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestBooking();