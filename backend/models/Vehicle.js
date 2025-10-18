import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
	date: { type: Date, required: true },
	available: { type: Boolean, default: true }
});

const vehicleSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, default: '' },
	make: { type: String },
	model: { type: String },
	year: { type: Number },
	seats: { type: Number, default: 4 },
	transmission: { type: String, enum: ['auto', 'manual', 'other'], default: 'auto' },
	fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid', 'other'], default: 'petrol' },
	pricePerDay: { type: Number, required: true, min: 0 },
	images: [{ type: String }],
	availability: [availabilitySchema],
	location: { type: String, default: '' },
	ownerId: { type: String, default: 'admin' },
	status: { type: String, enum: ['available', 'unavailable', 'maintenance'], default: 'available' },
	createdAt: { type: Date, default: Date.now }
});

vehicleSchema.index({ pricePerDay: 1, status: 1, location: 1 });

export default mongoose.model('Vehicle', vehicleSchema);
