import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadBlogImage } from '../middleware/uploadCloudinary.js';
import {
  getAllPostsAdmin,
  getAdminPost,
  getPosts,
  getFeaturedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blogController.js';

const router = express.Router();

// ── Admin (avant /:slug pour éviter les conflits) ─────────
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