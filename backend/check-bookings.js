import mongoose from 'mongoose';
import Property from './models/Property.js';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkBookingsForNimalProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get nimal's properties
    const nimalProperties = await Property.find({ ownerId: '68ce41bdf7c08356dcd433cf' });
    console.log('Nimal\'s properties:');
    nimalProperties.forEach(prop => {
      console.log(`- ${prop.title} (ID: ${prop._id})`);
    });
    
    // Check bookings for each property
    console.log('\n=== Bookings for each property ===');
    for (const property of nimalProperties) {
      const bookings = await Booking.find({ propertyId: property._id });
      console.log(`\n${property.title} (${property._id}):`);
      console.log(`  Found ${bookings.length} bookings`);
      bookings.forEach(booking => {
        console.log(`  - Booking ${booking.bookingReference}: ${booking.guestInfo.firstName} ${booking.guestInfo.lastName} (${booking.status})`);
      });
    }
    
    // Check all bookings to see what propertyIds exist
    console.log('\n=== All bookings in database ===');
    const allBookings = await Booking.find({});
    console.log(`Total bookings: ${allBookings.length}`);
    allBookings.forEach(booking => {
      console.log(`- ${booking.bookingReference}: propertyId = ${booking.propertyId}, property = ${booking.propertyTitle}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBookingsForNimalProperties();