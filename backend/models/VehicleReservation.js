import mongoose from 'mongoose';

const vehicleReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicleTitle: { type: String, required: true },
  pickUpDate: { type: Date, required: true },
  dropOffDate: { type: Date, required: true },
  totalDays: { type: Number, required: true, min: 1 },
  totalCost: { type: Number, required: true, min: 0 },
  guestInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

vehicleReservationSchema.index({ vehicleId: 1, userId: 1, status: 1 });

export default mongoose.model('VehicleReservation', vehicleReservationSchema);
