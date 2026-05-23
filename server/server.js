// backend/index.js
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer'; // ← Ajoute cette importation

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

// ========== 🔥 CONFIGURATION CORS COMPLÈTE ==========
// Liste des origines autorisées
const allowedOrigins = [
  'http://localhost:3000',                    // Frontend local (React)
  'http://localhost:5000',                    // Backend local
  'http://localhost:5173',                    // Vite local
  'https://www.propertycameroon.com',         // Ton domaine avec www
  'https://propertycameroon.com',              // Ton domaine sans www
  'https://property-cameroon-frontend.vercel.app',  // Frontend Vercel (si différent)
  'https://property-cameroon-backend.vercel.app',   // Backend Vercel lui-même
  /\.vercel\.app$/,                           // Tous les sous-domaines Vercel
  /\.propertycameroon\.com$/                  // Tous les sous-domaines de ton site
];

// Configuration CORS
app.use(cors({
  origin: function(origin, callback) {
    // Permettre les requêtes sans origin (ex: Postman, apps mobile)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origine est autorisée
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloque l'origine: ${origin}`);
      callback(null, true); // ⚠️ En développement, on accepte toutes
      // En production, décommente la ligne ci-dessous:
      // callback(new Error(`CORS policy: ${origin} not allowed`));
    }
  },
  credentials: true,                          // Permettre les cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200,                  // Pour les vieux navigateurs
  preflightContinue: false,
  maxAge: 86400                               // Cache preflight pour 24h
}));

// ✅ AJOUTER DES HEADERS DE SÉCURITÉ SUPPLÉMENTAIRES
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

// Gestion explicite des requêtes OPTIONS (preflight)
app.options('*', cors());  // Répondre à toutes les requêtes OPTIONS

// ✅ AUGMENTER LA LIMITE POUR LES GROS PAYLOADS (IMAGES)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

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
// Upload pour propriétés immobilières
app.post('/api/upload/property-images', propertyUpload.array('images', 10), handlePropertyImages);

// Upload pour livestock (animaux)
app.post('/api/upload/livestock-images', livestockUpload.array('images', 10), handleLivestockImages);

// Upload pour agriculture (produits agricoles)
app.post('/api/upload/agriculture-images', agricultureUpload.array('images', 10), handleAgricultureImages);

// Upload pour catégories livestock
app.post('/api/upload/category-image', categoryUpload.single('image'), handleCategoryImage);

// ========== ROUTES DE TEST ==========
// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: "Property Cameroon API is running" });
});

// ========== GESTION DES ERREURS ==========
// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Gestion spécifique pour payload too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      success: false, 
      message: 'Payload too large. Maximum size is 50MB.' 
    });
  }
  
  // Gestion des erreurs multer
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
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
    console.log(`📦 Max payload size: 50MB`);
    console.log(`📸 Upload endpoints:`);
    console.log(`   - /api/upload/property-images`);
    console.log(`   - /api/upload/livestock-images`);
    console.log(`   - /api/upload/agriculture-images`);
    console.log(`   - /api/upload/category-image`);
  });
}

export default app;