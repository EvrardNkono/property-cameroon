import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/blogCategoryController.js';

const router = express.Router();

// Routes publiques
router.get('/', getCategories);

// Routes admin (protégées)
router.post('/', protect, authorize('admin', 'editor'), createCategory);
router.put('/:id', protect, authorize('admin', 'editor'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;