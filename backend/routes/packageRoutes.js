import express from 'express';
import {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  createPackageBooking,
  getPackageBookings,
  getAllPackages,
  getAllPackageBookings,
  getPackageBookingById,
  updatePackageBookingStatus
} from '../controller/packageController.js';

const router = express.Router();

// Public
router.get('/', getPackages);

// Package booking management (place before parameterized routes)
router.get('/bookings/all', getAllPackageBookings);
router.get('/bookings/:bookingId', getPackageBookingById);
router.patch('/bookings/:bookingId/status', updatePackageBookingStatus);

// Admin: get all packages (include optional ownerId)
router.get('/all', getAllPackages);

router.get('/:id', getPackageById);

// Admin / Owner actions
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

// Book a package (supports group booking)
router.post('/:id/book', createPackageBooking);
router.get('/:id/bookings', getPackageBookings);

export default router;
