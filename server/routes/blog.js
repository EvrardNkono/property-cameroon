import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadBlogImage } from '../middleware/uploadCloudinary.js';
import {
  getAllPostsAdmin, getAdminPost, getPosts,
  getFeaturedPosts, getPost, createPost, updatePost, deletePost,
} from '../controllers/blogController.js';
import {
  getCategories, createCategory, updateCategory, deleteCategory
} from '../controllers/blogCategoryController.js';

const router = express.Router();

// ── Catégories ────────────────────────────────────────────
router.get('/categories', getCategories);
router.post('/categories', protect, authorize('admin', 'editor'), createCategory);
router.put('/categories/:id', protect, authorize('admin', 'editor'), updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);

// ── Admin ─────────────────────────────────────────────────
router.get('/admin/all', protect, authorize('admin', 'editor'), getAllPostsAdmin);
router.get('/admin/post/:id', protect, authorize('admin', 'editor'), getAdminPost);

// ── Publiques ─────────────────────────────────────────────
router.get('/featured', getFeaturedPosts);
router.get('/', getPosts);
router.get('/:slug', getPost);

// ── CRUD admin ────────────────────────────────────────────
router.post('/', protect, authorize('admin', 'editor'), uploadBlogImage.single('featuredImage'), createPost);
router.put('/:id', protect, authorize('admin', 'editor'), uploadBlogImage.single('featuredImage'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

export default router;