import express from 'express';
import upload from '../middleware/upload.js';
import {
  createVehicle,
  listVehicles,
  getVehicle,
  reserveVehicle,
  listReservations,
  updateReservationStatus
} from '../controllers/vehicleController.js';

const router = express.Router();

// Public routes
router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/:id/reserve', reserveVehicle);

// Admin routes
router.post('/', upload.array('images', 6), createVehicle);
router.get('/reservations/all', listReservations);
router.put('/reservations/:id/status', updateReservationStatus);

export default router;
