// backend/routes/livestock.routes.js
import express from 'express';
import {
  getAllLivestock,
  getLivestockByCategory,
  getLivestockById,
  createLivestock,
  updateLivestock,
  deleteLivestock
} from '../controllers/livestock.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllLivestock);
router.get('/category/:category', getLivestockByCategory);
router.get('/:id', getLivestockById);

// Routes protégées
router.use(protect);
router.post('/', authorize('ADMIN', 'OWNER'), createLivestock);
router.put('/:id', authorize('ADMIN', 'OWNER'), updateLivestock);
router.delete('/:id', authorize('ADMIN'), deleteLivestock);

export default router;