import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  activities: [{ type: String }]
}, { _id: false });

const addOnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String }
}, { _id: false });

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String },
  description: { type: String },
  pricePerPerson: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1 },
  itinerary: [itinerarySchema],
  addOns: [addOnSchema],
  capacity: { type: Number, default: 10 },
  groupBookingAllowed: { type: Boolean, default: true },
  images: [{ type: String }],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft','published','archived'], default: 'draft' }
}, { timestamps: true });

packageSchema.index({ title: 'text', shortDescription: 'text', description: 'text' });

export default mongoose.model('Package', packageSchema);
