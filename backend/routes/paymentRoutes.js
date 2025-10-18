import express from "express";
import {
  createPayPalOrder,
  capturePayPalPayment,
  completePayment,
  getPayment,
  getUserPayments,
  getOwnerPayments
} from "../controller/paymentController.js";

const router = express.Router();

// Create PayPal order
router.post("/create-order", createPayPalOrder);

// Capture PayPal payment
router.post("/capture/:orderId", capturePayPalPayment);

// Frontend notifies backend of completed payment
router.post('/complete', completePayment);

// Get payment details
router.get("/:paymentId", getPayment);

// Get user's payment history
router.get("/user/:userId", getUserPayments);

// Get property owner's received payments
router.get("/owner/:ownerId", getOwnerPayments);

export default router;
