import express from 'express';
import { getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getPropertiesByOwner } from '../controllers/property.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

router.use(protect);

router.post('/', authorize('ADMIN', 'OWNER'), createProperty);
router.put('/:id', authorize('ADMIN', 'OWNER'), updateProperty);
router.delete('/:id', authorize('ADMIN'), deleteProperty);
router.get('/owner/:ownerId', authorize('ADMIN', 'OWNER'), getPropertiesByOwner);

export default router;
