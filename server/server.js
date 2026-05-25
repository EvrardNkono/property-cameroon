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

// ========== DONNÉES MOCK POUR MODE DÉGRADÉ ==========
const MOCK_DATA = {
  livestockCategories: [
    { _id: "1", name: "Bovins", isActive: true, description: "Vaches, taureaux, veaux", imageUrl: "/images/cattle.jpg", count: 45 },
    { _id: "2", name: "Ovins", isActive: true, description: "Moutons, agneaux", imageUrl: "/images/sheep.jpg", count: 120 },
    { _id: "3", name: "Caprins", isActive: true, description: "Chèvres, chevreaux", imageUrl: "/images/goats.jpg", count: 67 },
    { _id: "4", name: "Volailles", isActive: true, description: "Poulets, canards, pintades", imageUrl: "/images/poultry.jpg", count: 500 },
    { _id: "5", name: "Porcins", isActive: true, description: "Porcs, cochons", imageUrl: "/images/pigs.jpg", count: 30 },
    { _id: "6", name: "Équins", isActive: true, description: "Chevaux, ânes", imageUrl: "/images/horses.jpg", count: 12 }
  ],
  agricultureCategories: [
    { _id: "1", name: "Cultures vivrières", isActive: true, description: "Manioc, maïs, igname" },
    { _id: "2", name: "Cultures de rente", isActive: true, description: "Cacao, café, hévéa" },
    { _id: "3", name: "Maraîchage", isActive: true, description: "Tomates, oignons, salades" },
    { _id: "4", name: "Arboriculture", isActive: true, description: "Mangues, oranges, avocats" }
  ],
  properties: []
};

// ========== FONCTION DE CONNEXION MONGODB POUR VERCEL ==========
const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('⚠️ MONGODB_URI not set, running in mock mode');
    return false;
  }

  try {
    // Désactiver le buffering - CRUCIAL pour Vercel serverless
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferTimeoutMS', 10000);
    
    // Configuration optimisée pour Vercel avec timeouts plus longs
    const mongooseOptions = {
      serverSelectionTimeoutMS: 60000,  // Augmenté à 60s
      socketTimeoutMS: 120000,          // Augmenté à 120s
      connectTimeoutMS: 60000,          // Augmenté à 60s
      family: 4,                        // Forcer IPv4
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 30000       // Augmenté
    };

    console.log('🔄 Connecting to MongoDB on Vercel...');
    console.log('⏱️ Timeouts: 60s selection, 120s socket, 60s connect');
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ MongoDB connected successfully');
    
    // Écouter les événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error after connect:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected - Switching to mock mode');
    });
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('   → Impossible de rejoindre MongoDB Atlas sur Vercel');
      console.error('   → Vérifiez que les IPs sont autorisées (0.0.0.0/0)');
      console.error('   → Vérifiez que l\'URI est correcte');
      console.error('   → Vérifiez le mot de passe');
    }
    return false;
  }
};

// ========== MIDDLEWARE DE FALLBACK (MODE DÉGRADÉ) ==========
// Permet au site de fonctionner même sans MongoDB
app.use('/api', (req, res, next) => {
  // Si MongoDB est connecté, on laisse passer
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  
  console.log(`📦 Mock mode: ${req.method} ${req.url}`);
  
  // Pour les requêtes GET, on retourne des données mock
  if (req.method === 'GET') {
    // Propriétés
    if (req.url.includes('/properties')) {
      return res.json({
        success: true,
        data: MOCK_DATA.properties,
        message: "Mode dégradé - Reconnexion à la base de données en cours",
        mock: true
      });
    }
    
    // Catégories livestock
    if (req.url.includes('/livestock-categories')) {
      return res.json({
        success: true,
        data: MOCK_DATA.livestockCategories,
        message: "Mode dégradé - Reconnexion à la base de données en cours",
        mock: true
      });
    }
    
    // Agriculture
    if (req.url.includes('/agriculture')) {
      return res.json({
        success: true,
        data: MOCK_DATA.agricultureCategories,
        message: "Mode dégradé - Reconnexion à la base de données en cours",
        mock: true
      });
    }
  }
  
  // Pour les requêtes POST/PUT/DELETE en mode dégradé
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return res.status(503).json({
      success: false,
      message: 'Service temporairement en mode dégradé. Les modifications ne sont pas disponibles.',
      mock: true
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
    0: 'disconnected (mock mode)',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: dbStatusText,
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    vercel_env: process.env.VERCEL === '1' ? true : false,
    mock_mode: mongoose.connection.readyState !== 1
  });
});

// Diagnostic amélioré avec test direct MongoDB
app.get('/api/diagnostic', async (req, res) => {
  const diagnostics = {
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL === '1',
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    mongoose_connection_state: mongoose.connection.readyState,
    mongoose_state_text: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[mongoose.connection.readyState] || 'unknown',
    node_version: process.version,
    mongoose_version: mongoose.version
  };
  
  // Test direct avec le driver MongoDB (sans Mongoose)
  if (process.env.MONGODB_URI) {
    const { MongoClient } = await import('mongodb');
    const uri = process.env.MONGODB_URI;
    
    diagnostics.direct_test = {
      status: 'testing',
      message: 'Test de connexion direct avec MongoDB driver...'
    };
    
    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      });
      
      const startTime = Date.now();
      await client.connect();
      const connectTime = Date.now() - startTime;
      
      const db = client.db('property_cameroon');
      const collections = await db.listCollections().toArray();
      
      diagnostics.direct_test = {
        success: true,
        connect_time_ms: connectTime,
        collections: collections.map(c => c.name),
        database_name: db.databaseName,
        message: '✅ Connexion MongoDB réussie !'
      };
      
      await client.close();
    } catch (error) {
      diagnostics.direct_test = {
        success: false,
        error: error.message,
        error_name: error.name,
        error_code: error.code || 'N/A',
        suggestion: error.message.includes('bad auth') ? '❌ Mot de passe incorrect - Vérifiez MONGODB_URI' :
                    error.message.includes('getaddrinfo') ? '❌ DNS error - Problème réseau Vercel' :
                    error.message.includes('timed out') ? '❌ Timeout - Vérifiez Network Access dans MongoDB Atlas' :
                    error.message.includes('ENOTFOUND') ? '❌ Nom de cluster incorrect' :
                    '❌ Erreur inconnue'
      };
    }
  }
  
  res.json(diagnostics);
});

app.get('/api/debug-mongo', async (req, res) => {
  const { MongoClient } = await import('mongodb');
  const uri = process.env.MONGODB_URI;
  
  res.setHeader('Content-Type', 'text/plain');
  
  if (!uri) {
    res.send('❌ MONGODB_URI n\'est pas définie dans les variables d\'environnement');
    return;
  }
  
  res.write('🔍 DIAGNOSTIC MONGODB ATLAS\n');
  res.write('=' .repeat(50) + '\n\n');
  res.write(`URI existe: OUI\n`);
  res.write(`URI (masquée): ${uri.replace(/\/\/(.*)@/, '//***:***@')}\n\n`);
  
  try {
    res.write('🔄 Tentative de connexion directe...\n');
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
    });
    
    const startTime = Date.now();
    await client.connect();
    const connectTime = Date.now() - startTime;
    
    res.write(`✅ CONNEXION RÉUSSIE (${connectTime}ms)\n\n`);
    
    const db = client.db('property_cameroon');
    const collections = await db.listCollections().toArray();
    res.write(`📚 Collections trouvées (${collections.length}):\n`);
    collections.forEach(c => res.write(`   - ${c.name}\n`));
    
    await client.close();
    res.write('\n👋 Test terminé avec succès\n');
  } catch (error) {
    res.write(`❌ ÉCHEC DE CONNEXION\n`);
    res.write(`Message: ${error.message}\n`);
    res.write(`Type: ${error.name}\n`);
    res.write(`Code: ${error.code || 'N/A'}\n\n`);
    
    if (error.message.includes('bad auth')) {
      res.write('🔧 SOLUTION: Mot de passe incorrect\n');
      res.write('   1. Allez dans MongoDB Atlas → Database Access\n');
      res.write('   2. Modifiez le mot de passe de l\'utilisateur\n');
      res.write('   3. Mettez à jour MONGODB_URI sur Vercel\n');
    } else if (error.message.includes('timed out')) {
      res.write('🔧 SOLUTION: Timeout - IP non autorisée\n');
      res.write('   1. MongoDB Atlas → Network Access\n');
      res.write('   2. Ajoutez 0.0.0.0/0\n');
      res.write('   3. Attendez 1-2 minutes\n');
    } else if (error.message.includes('ENOTFOUND')) {
      res.write('🔧 SOLUTION: Cluster introuvable\n');
      res.write('   1. Vérifiez le nom du cluster dans l\'URI\n');
      res.write('   2. Vérifiez que le cluster existe\n');
    }
  }
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
  // Essayer de se connecter à MongoDB
  const connected = await connectMongoDB();
  
  if (!connected && process.env.NODE_ENV === 'production') {
    console.log('📦 Running in MOCK MODE - API returns sample data');
    console.log('   MongoDB connection will be retried periodically');
    
    // Réessayer toutes les 30 secondes
    setInterval(async () => {
      if (mongoose.connection.readyState !== 1) {
        console.log('🔄 Retrying MongoDB connection...');
        await connectMongoDB();
      }
    }, 30000);
  }
  
  // Démarrer le serveur uniquement en développement
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Diagnostic: http://localhost:${PORT}/api/diagnostic`);
      console.log(`🛠️ Debug MongoDB: http://localhost:${PORT}/api/debug-mongo`);
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