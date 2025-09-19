import express from "express";
import upload from "../middleware/upload.js";
import {
  createProperty,
  getProperties,
  getApprovedProperties,
  getPropertyById,
  updateProperty,
  updatePropertyStatus,
  deleteProperty,
  getPropertiesByOwner,
  getPropertyStats
} from "../Controller/propertyController.js";

const router = express.Router();

// Public routes
router.get("/public", getApprovedProperties);
router.get("/:id", getPropertyById);

// Admin routes
router.get("/", getProperties);
router.post("/", upload.array('images', 10), createProperty); // Allow up to 10 images
router.put("/:id", updateProperty);
router.patch("/:id/status", updatePropertyStatus);
router.delete("/:id", deleteProperty);
router.get("/owner/:ownerId", getPropertiesByOwner);
router.get("/stats/summary", getPropertyStats);

export default router;