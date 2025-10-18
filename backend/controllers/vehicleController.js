import Vehicle from '../models/Vehicle.js';
import VehicleReservation from '../models/VehicleReservation.js';

// Create a vehicle (admin)
export const createVehicle = async (req, res) => {
  try {
    const files = req.files || [];
    const images = files.map(f => `/uploads/${f.filename}`);

    const data = {
      ...req.body,
      images
    };

    const vehicle = new Vehicle(data);
    await vehicle.save();
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// List vehicles (with optional query filters)
export const listVehicles = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, status } = req.query;
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (status) filter.status = status;
    if (minPrice) filter.pricePerDay = { ...(filter.pricePerDay || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.pricePerDay = { ...(filter.pricePerDay || {}), $lte: Number(maxPrice) };

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, vehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single vehicle
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a reservation
export const reserveVehicle = async (req, res) => {
  try {
    const { vehicleId, pickUpDate, dropOffDate, totalDays, totalCost, guestInfo } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    // Basic availability check (can be expanded)
    const existing = await VehicleReservation.findOne({ vehicleId, pickUpDate: { $lt: new Date(dropOffDate) }, dropOffDate: { $gt: new Date(pickUpDate) }, status: { $in: ['pending', 'confirmed'] } });
    if (existing) return res.status(409).json({ success: false, message: 'Vehicle is already reserved for the selected dates' });

    const reservation = new VehicleReservation({ vehicleId, vehicleTitle: vehicle.title, pickUpDate, dropOffDate, totalDays, totalCost, guestInfo });
    await reservation.save();
    res.json({ success: true, reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin: get all reservations
export const listReservations = async (req, res) => {
  try {
    const reservations = await VehicleReservation.find().sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin: update reservation status
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const reservation = await VehicleReservation.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
