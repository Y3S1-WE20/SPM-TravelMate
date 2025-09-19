import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  getBookingsByProperty
} from "../controller/bookingController.js";

const router = express.Router();

// Public routes
router.post("/", createBooking);

// Admin routes
router.get("/", getBookings);
router.get("/stats/summary", getBookingStats);
router.get("/property/:propertyId", getBookingsByProperty);
router.get("/:id", getBookingById);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;