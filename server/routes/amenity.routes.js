// backend/routes/amenity.routes.js
import express from 'express';
import {
  getAllAmenities,
  getAmenitiesNearProperty,
  createAmenity,
  updateAmenity,
  deleteAmenity
} from '../controllers/amenity.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllAmenities);
router.get('/near/:propertyId', getAmenitiesNearProperty);

// Routes protégées (admin seulement)
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', createAmenity);
router.put('/:id', updateAmenity);
router.delete('/:id', deleteAmenity);

export default router;