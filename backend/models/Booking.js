import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  propertyTitle: {
    type: String,
    required: true
  },
  propertyImage: {
    type: String,
    default: ''
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  rooms: {
    type: Number,
    required: true,
    min: 1
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  numberOfNights: {
    type: Number,
    required: true,
    min: 1
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  guestInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    country: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    bookingFor: {
      type: String,
      enum: ['myself', 'someone-else', 'business'],
      default: 'myself'
    },
    smokingPreference: {
      type: String,
      enum: ['non-smoking', 'smoking', 'no-preference'],
      default: 'non-smoking'
    },
    specialRequests: {
      type: String,
      default: ''
    },
    arrivalTime: {
      type: String,
      enum: ['', 'morning', 'afternoon', 'evening', 'late'],
      default: ''
    }
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  bookingReference: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.bookingReference = `BK${year}${month}${day}${random}`;
  }
  next();
});

// Index for efficient queries
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ 'guestInfo.email': 1 });

export default mongoose.model("Booking", bookingSchema);