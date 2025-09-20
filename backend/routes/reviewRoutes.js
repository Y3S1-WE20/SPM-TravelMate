import express from "express";
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getReviewStats
} from "../controller/reviewController.js";

const router = express.Router();

// Review CRUD routes
router.post("/", createReview);
router.get("/property/:propertyId", getPropertyReviews);
router.get("/user/:userId", getUserReviews);
router.get("/stats/:propertyId", getReviewStats);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

// Review interaction routes
router.post("/:reviewId/helpful", markReviewHelpful);

export default router;