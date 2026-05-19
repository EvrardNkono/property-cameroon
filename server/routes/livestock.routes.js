// backend/routes/livestock.routes.js
import express from 'express';
import {
  getAllLivestock,
  getLivestockByCategory,
  getLivestockById,
  getLivestockByOwner,
  createLivestock,
  updateLivestock,
  deleteLivestock
} from '../controllers/livestock.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllLivestock);
router.get('/category/:category', getLivestockByCategory);
router.get('/owner/:ownerId', getLivestockByOwner);
router.get('/:id', getLivestockById);

// Routes protégées - ✅ CORRECTION DES RÔLES
router.use(protect);
router.post('/', authorize('ADMIN', 'LIVESTOCK_OWNER'), createLivestock);
router.put('/:id', authorize('ADMIN', 'LIVESTOCK_OWNER'), updateLivestock);
router.delete('/:id', authorize('ADMIN', 'LIVESTOCK_OWNER'), deleteLivestock);

export default router;