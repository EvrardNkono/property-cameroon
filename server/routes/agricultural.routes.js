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

// ========== LAND ROUTES (PUBLIC) ==========
router.get('/', getAllAgriculturalLands);
router.get('/filter/crop/:crop', filterByCrop);
router.get('/stats/regions', getRegionStats);

// ========== PRODUCT ROUTES ==========
// ✅ AJOUTER protect sur les routes GET pour avoir req.user
router.get('/products', getAllProducts);                    // ← Ajouter protect
router.get('/products/category/:category', protect, getProductsByCategory);  // ← Ajouter protect
router.get('/products/:id', protect, getProductById);                // ← Ajouter protect

// Routes protégées pour les produits
router.post('/products', protect, authorize('ADMIN', 'OWNER', 'AGRICULTURE_OWNER'), createProduct);
router.put('/products/:id', protect, authorize('ADMIN', 'OWNER', 'AGRICULTURE_OWNER'), updateProduct);
router.delete('/products/:id', protect, authorize('ADMIN'), deleteProduct);

// ========== LAND ROUTES (DYNAMIC) ==========
router.get('/:id', getAgriculturalLandById);

// Routes protégées pour les terres
router.use(protect);
router.post('/', authorize('ADMIN', 'OWNER', 'AGRICULTURE_OWNER'), createAgriculturalLand);
router.put('/:id', authorize('ADMIN', 'OWNER', 'AGRICULTURE_OWNER'), updateAgriculturalLand);
router.delete('/:id', authorize('ADMIN'), deleteAgriculturalLand);

export default router;