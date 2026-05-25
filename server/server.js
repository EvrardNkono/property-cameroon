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

// ========== CONFIGURATION CORS POUR VERCEL ==========
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://www.propertycameroon.com',
    'https://propertycameroon.com',
    'https://property-cameroon-frontend.vercel.app',
    'https://property-cameroon.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  
  // Autoriser l'origine si elle est dans la liste ou si c'est Vercel
  if (allowedOrigins.includes(origin) || (origin && origin.includes('vercel.app')) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  
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

// ========== FONCTION DE CONNEXION MONGODB POUR VERCEL ==========
const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('⚠️ MONGODB_URI not set, running without database');
    return false;
  }

  try {
    // Désactiver le buffering - CRUCIAL pour Vercel serverless
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferTimeoutMS', 10000);
    
    // Configuration optimisée pour Vercel
    const mongooseOptions = {
      serverSelectionTimeoutMS: 30000,  // Augmenté à 30s pour Vercel
      socketTimeoutMS: 60000,           // Augmenté à 60s
      connectTimeoutMS: 30000,          // Augmenté à 30s
      family: 4,                        // Forcer IPv4
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 5,                   // Limiter pour serverless
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000
    };

    console.log('🔄 Connecting to MongoDB on Vercel...');
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ MongoDB connected successfully');
    
    // Écouter les événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error after connect:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('   → Impossible de rejoindre MongoDB Atlas sur Vercel');
      console.error('   → Vérifiez que les IPs sont autorisées (0.0.0.0/0)');
      console.error('   → Vérifiez que l\'URI est correcte');
    }
    return false;
  }
};

// Middleware pour vérifier MongoDB avant les routes
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Base de données en cours de connexion. Veuillez réessayer.',
      readyState: mongoose.connection.readyState
    });
  }
  next();
});

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
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    vercel_env: process.env.VERCEL === '1' ? true : false
  });
});

app.get('/api/diagnostic', async (req, res) => {
  const diagnostics = {
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL === '1',
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    mongodb_connection_state: mongoose.connection.readyState,
    mongodb_connection_state_text: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[mongoose.connection.readyState],
    node_version: process.version,
    mongoose_version: mongoose.version
  };
  
  // Tenter de se reconnecter si déconnecté
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    diagnostics.reconnecting = true;
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 20000,
      });
      diagnostics.reconnect_result = 'success';
      diagnostics.mongodb_connection_state = mongoose.connection.readyState;
    } catch (error) {
      diagnostics.reconnect_result = 'failed';
      diagnostics.reconnect_error = error.message;
    }
  }
  
  res.json(diagnostics);
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

// ========== DÉMARRAGE DU SERVEUR POUR VERCEL ==========
const startServer = async () => {
  // Essayer de se connecter à MongoDB (ne pas bloquer le démarrage)
  const connected = await connectMongoDB();
  
  if (!connected && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Server starting without MongoDB connection');
    console.warn('   Les routes renverront des erreurs 503 jusqu\'à reconnexion');
    
    // Réessayer après 10 secondes
    setTimeout(async () => {
      console.log('🔄 Retrying MongoDB connection...');
      await connectMongoDB();
    }, 10000);
  }
  
  // Démarrer le serveur uniquement en développement
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Diagnostic: http://localhost:${PORT}/api/diagnostic`);
    });
  }
};

// Démarrer le serveur
startServer().catch(err => {
  console.error('Failed to start server:', err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

export default app;