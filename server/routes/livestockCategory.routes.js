// backend/routes/livestockCategory.routes.js
import express from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/livestockCategory.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadCategoryImage } from '../middleware/upload.middleware.js'; // ← SEUL CHANGEMENT ICI

const router = express.Router();

// Routes publiques
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

// Routes protégées (admin seulement)
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', uploadCategoryImage.single('image'), createCategory); // ← uploadCategoryImage au lieu de upload
router.put('/:id', uploadCategoryImage.single('image'), updateCategory); // ← uploadCategoryImage au lieu de upload
router.delete('/:id', deleteCategory);

export default router;