import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  // Booking reference
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // User who made the payment
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Guest bookings might not have userId
  },
  
  // Property owner who receives the payment
  propertyOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Property reference
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  
  // Payment amount
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'LKR']
  },
  
  // PayPal transaction details
  paypalOrderId: {
    type: String,
    required: true,
    unique: true
  },
  
  paypalPayerId: {
    type: String
  },
  
  paypalPaymentId: {
    type: String
  },
  
  // Payment status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Guest information (for non-logged-in users)
  guestEmail: {
    type: String
  },
  
  guestName: {
    type: String
  },
  
  // Payment metadata
  paymentMethod: {
    type: String,
    default: 'PayPal'
  },
  
  paymentDate: {
    type: Date
  },
  
  // Commission/Fee tracking (optional)
  platformFee: {
    type: Number,
    default: 0
  },
  
  ownerPayout: {
    type: Number
  },
  
  // Transaction notes
  notes: {
    type: String,
    default: ''
  },
  
  // Full PayPal response for debugging
  paypalResponse: {
    type: mongoose.Schema.Types.Mixed
  }
  
}, {
  timestamps: true
});

// Indexes for efficient queries
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ propertyOwnerId: 1 });
// paypalOrderId already has unique: true, no need for separate index
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Calculate owner payout (85% to owner, 15% platform fee)
paymentSchema.pre('save', function(next) {
  if (this.isModified('amount') && !this.ownerPayout) {
    this.platformFee = this.amount * 0.15; // 15% platform fee
    this.ownerPayout = this.amount * 0.85; // 85% to owner
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);
