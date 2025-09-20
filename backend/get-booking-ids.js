import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

async function getBookingIds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const nimalPropertyIds = [
      '68ce2a812e6b0e9a6493481b', // Jetwing sea
      '68ce397216092744941088dd'  // Suriya Resort
    ];
    
    for (const propertyId of nimalPropertyIds) {
      const bookings = await Booking.find({ propertyId });
      console.log(`\nBookings for property ${propertyId}:`);
      bookings.forEach(booking => {
        console.log(`- MongoDB ID: ${booking._id}`);
        console.log(`  Reference: ${booking.bookingReference}`);
        console.log(`  Status: ${booking.status}`);
        console.log(`  Guest: ${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getBookingIds();