import express from "express";
import {
  getUserBookings,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getUserBookingStats
} from "../controller/userController.js";

const router = express.Router();

// User bookings routes
router.get("/:userId/bookings", getUserBookings);
router.get("/:userId/bookings/stats", getUserBookingStats);

// User favorites routes
router.get("/:userId/favorites", getUserFavorites);
router.post("/:userId/favorites/:propertyId", addToFavorites);
router.delete("/:userId/favorites/:propertyId", removeFromFavorites);

export default router;