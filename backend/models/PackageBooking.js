import mongoose from 'mongoose';

const travellerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	age: { type: Number },
	passportNumber: { type: String }
}, { _id: false });

const packageBookingSchema = new mongoose.Schema({
	packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	travelers: [travellerSchema],
	numberOfPeople: { type: Number, required: true, min: 1 },
	addOnsSelected: [{ name: String, price: Number }],
	totalPrice: { type: Number, required: true, min: 0 },
	status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
	paymentInfo: { type: Object },
	contactEmail: { type: String },
	contactPhone: { type: String }
}, { timestamps: true });

packageBookingSchema.index({ packageId: 1, userId: 1 });

export default mongoose.model('PackageBooking', packageBookingSchema);

