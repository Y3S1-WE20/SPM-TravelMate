import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['Apartment', 'Villa', 'Lodge', 'Room', 'Cottage', 'House', 'Bungalow', 'Studio']
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  features: [{
    type: String,
    enum: [
      'Breakfast',
      'Free pool access',
      'Medical staff on call',
      'Lunch included',
      'Dinner included',
      'Welcome drink',
      'Parking',
      'Free Premium Wifi',
      'Express check-in',
      'Free WiFi',
      'Air Conditioning',
      'Swimming Pool',
      'Gym',
      'Spa',
      'Pet Friendly'
    ]
  }],
  availability: [{
    date: Date,
    available: {
      type: Boolean,
      default: true
    }
  }],
  ownerName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  ownerId: {
    type: String,
    default: "temp-owner-id"
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

propertySchema.index({ city: 1, propertyType: 1, pricePerNight: 1 });
propertySchema.index({ ownerId: 1 });
propertySchema.index({ status: 1 });

export default mongoose.model("Property", propertySchema);