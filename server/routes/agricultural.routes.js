// backend/routes/agricultural.routes.js
import express from 'express';
import {
  getAllAgriculturalLands,
  getAgriculturalLandById,
  createAgriculturalLand,
  updateAgriculturalLand,
  deleteAgriculturalLand,
  filterByCrop,
  getRegionStats
} from '../controllers/agricultural.controller.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/agriculturalProduct.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// ========== LAND ROUTES ==========
// Routes publiques
router.get('/', getAllAgriculturalLands);
router.get('/:id', getAgriculturalLandById);
router.get('/filter/crop/:crop', filterByCrop);
router.get('/stats/regions', getRegionStats);

// Routes protégées (admin et owner)
router.use(protect);

router.post('/', authorize('ADMIN', 'OWNER'), createAgriculturalLand);
router.put('/:id', authorize('ADMIN', 'OWNER'), updateAgriculturalLand);
router.delete('/:id', authorize('ADMIN'), deleteAgriculturalLand);

// ========== PRODUCT ROUTES ==========
// Routes publiques pour les produits
router.get('/products', getAllProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);

// Routes protégées pour les produits
router.post('/products', authorize('ADMIN', 'OWNER'), createProduct);
router.put('/products/:id', authorize('ADMIN', 'OWNER'), updateProduct);
router.delete('/products/:id', authorize('ADMIN'), deleteProduct);

export default router;