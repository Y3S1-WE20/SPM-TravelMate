import Package from '../models/Package.js';
import PackageBooking from '../models/PackageBooking.js';

export const createPackage = async (req, res) => {
  try {
    const data = req.body;
    data.ownerId = req.user?._id || data.ownerId;
    const pkg = await Package.create(data);
    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: list all packages (optional ownerId filter)
export const getAllPackages = async (req, res) => {
  try {
    const { page = 1, limit = 50, ownerId, status } = req.query;
    const filter = {};
    if (ownerId) filter.ownerId = ownerId;
    if (status) filter.status = status;

    const packages = await Package.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Package.countDocuments(filter);
    res.json({ success: true, data: packages, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPackageBooking = async (req, res) => {
  try {
    // route uses '/:id/book' so the param is `id`
    const packageId = req.params.packageId || req.params.id;
    if (!packageId) {
      console.warn('Booking attempt with no package id in route params. req.params=', req.params);
      return res.status(400).json({ success: false, message: 'Missing package id in request' });
    }

    const { travelers, numberOfPeople, addOnsSelected, contactEmail, contactPhone, totalPrice, paymentInfo } = req.body;
    const userId = req.user?._id || req.body.userId;

    // Require a user for booking (prevent Mongoose validation error when userId missing)
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to make a booking. Please log in.' });
    }

    // Basic validation
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      console.warn(`Booking attempted for missing packageId=${packageId}. Req body:`, { body: req.body });
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    if (numberOfPeople > pkg.capacity) return res.status(400).json({ success: false, message: 'Exceeds package capacity' });

    const booking = await PackageBooking.create({
      packageId,
      userId,
      travelers,
      numberOfPeople,
      addOnsSelected,
      totalPrice,
      paymentInfo,
      contactEmail,
      contactPhone,
      status: paymentInfo ? 'confirmed' : 'pending'
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    // Handle Mongoose validation errors with 400 so client sees actionable message
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPackageBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await PackageBooking.find({ packageId: id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: list all package bookings (with optional status filter)
export const getAllPackageBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, email } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (email) filter.contactEmail = new RegExp(email, 'i');

    const bookings = await PackageBooking.find(filter)
      .populate('packageId', 'title')
      .populate('userId', 'username email')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await PackageBooking.countDocuments(filter);
    res.json({ success: true, data: bookings, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPackageBookingById = async (req, res) => {
  try {
    const booking = await PackageBooking.findById(req.params.bookingId)
      .populate('packageId')
      .populate('userId');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePackageBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const booking = await PackageBooking.findByIdAndUpdate(req.params.bookingId, { status, adminNotes: adminNotes || '' }, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: `Booking ${status} successfully`, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
