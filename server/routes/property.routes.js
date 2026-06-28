// backend/routes/property.routes.js

import express from 'express';
import { 
  getAllProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty, 
  getPropertiesByOwner,
  deletePropertyImages,
  cleanupOrphanedImages
} from '../controllers/property.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Routes protégées
router.use(protect);

// Routes propriétaire/admin
router.post('/', authorize('ADMIN', 'OWNER'), createProperty);
router.put('/:id', authorize('ADMIN', 'OWNER'), updateProperty);

// ⚠️ IMPORTANT : Les routes spécifiques DOIVENT être avant les routes génériques
// Route pour supprimer des images d'une propriété
router.delete('/:id/images', authorize('ADMIN', 'OWNER'), deletePropertyImages);

// Route générique pour supprimer toute la propriété
router.delete('/:id', authorize('ADMIN', 'OWNER'), deleteProperty);

router.get('/owner/:ownerId', authorize('ADMIN', 'OWNER'), getPropertiesByOwner);

// Route de nettoyage des images orphelines (admin uniquement)
router.post('/cleanup/images', authorize('ADMIN'), cleanupOrphanedImages);

export default router;