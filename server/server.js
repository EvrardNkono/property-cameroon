// backend/index.js

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first'); // Force IPv4

// CHARGER DOTENV EN PREMIER
import dotenv from 'dotenv';
dotenv.config();

// VÉRIFIER LES VARIABLES D'ENVIRONNEMENT AVANT TOUT
console.log('=== CONFIGURATION ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  // Masquer les identifiants pour la sécurité
  const maskedUri = process.env.MONGODB_URI.replace(/\/\/(.*)@/, '//***:***@');
  console.log('MONGODB_URI (masked):', maskedUri);
}
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('====================');

import express from 'express';
import cors from 'cors';
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
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// ========== FONCTION DE CONNEXION MONGODB AMÉLIORÉE ==========
const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('⚠️ MONGODB_URI not set, running without database');
    return false;
  }

  try {
    // Configuration avec timeouts
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000,  // Timeout de sélection du serveur (5 secondes)
      socketTimeoutMS: 45000,          // Timeout des sockets (45 secondes)
      connectTimeoutMS: 10000,         // Timeout de connexion (10 secondes)
      family: 4,                       // Forcer IPv4
    };

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('   → Vérifiez que MongoDB est en cours d\'exécution');
      console.error('   → Vérifiez l\'URI de connexion');
      console.error('   → Vérifiez votre connexion internet (si MongoDB Atlas)');
    }
    return false;
  }
};

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
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: dbStatusText,
    mongodb_uri_exists: !!process.env.MONGODB_URI
  });
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

// ========== DÉMARRAGE DU SERVEUR AMÉLIORÉ ==========
const startServer = async () => {
  // Attendre la connexion MongoDB avant de démarrer le serveur
  await connectMongoDB();
  
  // Démarrer le serveur uniquement en développement
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  }
};

// Démarrer le serveur
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;