// backend/index.js
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';

// Import des routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js';
import propertyRoutes from './routes/property.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import documentRoutes from './routes/document.routes.js';
import investmentRoutes from './routes/investment.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import agriculturalRoutes from './routes/agricultural.routes.js';
import amenityRoutes from './routes/amenity.routes.js';
import livestockRoutes from './routes/livestock.routes.js';
import livestockCategoryRoutes from './routes/livestockCategory.routes.js';

// Import des controllers upload
import { 
  uploadPropertyImages, 
  handlePropertyImages,
  uploadLivestockImages,
  handleLivestockImages,
  uploadAgricultureImages,
  handleAgricultureImages,
  uploadCategoryImage,
  handleCategoryImage,
  propertyUpload,
  livestockUpload,
  agricultureUpload,
  categoryUpload
} from './controllers/upload.controller.js';

dotenv.config();

const app = express();

// ========== CONFIGURATION CORS SIMPLIFIÉE ==========
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://www.propertycameroon.com',
    'https://propertycameroon.com',
    'https://property-cameroon-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ⚠️ SUR VERCEL : NE PAS SERVIR DE FICHIERS STATIQUES
// Cette ligne ne doit être active qu'en développement
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// Connexion MongoDB (seulement si URI existe)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));
} else {
  console.log('⚠️ MONGODB_URI not set, running without database');
}

// ========== ROUTES API ==========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/agriculture', agriculturalRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/livestock-categories', livestockCategoryRoutes);

// ========== ROUTES D'UPLOAD ==========
app.post('/api/upload/property-images', propertyUpload.array('images', 10), handlePropertyImages);
app.post('/api/upload/livestock-images', livestockUpload.array('images', 10), handleLivestockImages);
app.post('/api/upload/agriculture-images', agricultureUpload.array('images', 10), handleAgricultureImages);
app.post('/api/upload/category-image', categoryUpload.single('image'), handleCategoryImage);

// ========== ROUTES DE TEST ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: "Property Cameroon API is running" });
});

// ========== GESTION DES ERREURS ==========
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Payload too large. Maximum size is 50MB.' });
  }
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({ success: false, message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Démarrage du serveur (uniquement en développement)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;