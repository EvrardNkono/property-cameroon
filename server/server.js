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
  const maskedUri = process.env.MONGODB_URI.replace(/\/\/(.*)@/, '//***:***@');
  console.log('MONGODB_URI (masked):', maskedUri);
}
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('====================');

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';

// IMPORT DU MIDDLEWARE DE TRADUCTION
import autoTranslate from './middleware/translateMiddleware.js';

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
import sitemapRoutes from './routes/sitemap.js';

// 🌟 ROUTES BLOG
import blogRoutes from './routes/blog.js';
import blogCategoryRoutes from './routes/blogCategories.js';

// ✅ Import des controllers upload
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

// ========== ✅ CONFIGURATION CORS CORRIGÉE ==========
// Liste des origines autorisées
const allowedOrigins = [
  'https://www.propertycameroon.com',
  'https://propertycameroon.com',
  'https://property-cameroon-frontend.vercel.app',
  'https://property-cameroon.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://localhost:8080'
];

// Middleware CORS personnalisé plus permissif
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Accepter l'origine si elle est dans la liste OU si c'est une prévisualisation Vercel
  const isAllowedOrigin = allowedOrigins.includes(origin) || 
                          (origin && origin.includes('vercel.app')) ||
                          process.env.NODE_ENV !== 'production';
  
  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-HTTP-Method-Override');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Requested-With, X-Total-Count');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  
  // Répondre immédiatement aux requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Configuration CORS avec le package cors (double sécurité)
app.use(cors({
  origin: function(origin, callback) {
    // Permettre les requêtes sans origine (comme les apps mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app') || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('⚠️ CORS blocked for origin:', origin);
      // En production, on bloque. En dev, on accepte.
      callback(null, process.env.NODE_ENV !== 'production');
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ⚠️ SUR VERCEL : NE PAS SERVIR DE FICHIERS STATIQUES
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// ========== ROUTE TEST CORS (À PLACER EN PREMIER) ==========
app.options('/api/*', (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  }
  res.status(200).end();
});

// Route de test CORS
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date()
  });
});

// ========== ROUTE DEBUG MONGO ==========
app.get('/api/debug-mongo', async (req, res) => {
  const { MongoClient } = await import('mongodb');
  const uri = process.env.MONGODB_URI;
  
  res.setHeader('Content-Type', 'text/plain');
  
  if (!uri) {
    res.send('❌ MONGODB_URI n\'est pas définie dans les variables d\'environnement');
    return;
  }
  
  res.write('🔍 DIAGNOSTIC MONGODB ATLAS - CONNEXION DIRECTE\n');
  res.write('='.repeat(60) + '\n\n');
  res.write(`URI existe: OUI\n`);
  res.write(`URI (masquée): ${uri.replace(/\/\/(.*)@/, '//***:***@')}\n\n`);
  
  try {
    res.write('🔄 Tentative de connexion directe avec MongoDB driver...\n');
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    
    const startTime = Date.now();
    await client.connect();
    const connectTime = Date.now() - startTime;
    
    res.write(`✅ CONNEXION RÉUSSIE (${connectTime}ms)\n\n`);
    
    const db = client.db('property_cameroon');
    const collections = await db.listCollections().toArray();
    res.write(`📚 Collections trouvées (${collections.length}):\n`);
    if (collections.length > 0) {
      collections.forEach(c => res.write(`   - ${c.name}\n`));
    } else {
      res.write(`   (aucune collection trouvée)\n`);
    }
    
    res.write(`\n📊 Base de données: ${db.databaseName}\n`);
    res.write('\n👋 Test terminé avec succès !\n');
    res.write('\n💡 MongoDB est CONNECTÉ. Votre site va maintenant utiliser les VRAIES données.\n');
    
    await client.close();
  } catch (error) {
    res.write(`❌ ÉCHEC DE CONNEXION\n`);
    res.write(`Message: ${error.message}\n`);
    res.write(`Type: ${error.name}\n`);
    res.write(`Code: ${error.code || 'N/A'}\n\n`);
    
    res.write('🔧 DIAGNOSTIC:\n');
    if (error.message.includes('bad auth') || error.message.includes('authentication')) {
      res.write('   → ❌ Mot de passe ou nom d\'utilisateur INCORRECT\n');
      res.write('   → Solution: Changez le mot de passe dans MongoDB Atlas\n');
    } else if (error.message.includes('timed out') || error.message.includes('timeout')) {
      res.write('   → ❌ TIMEOUT - MongoDB Atlas bloque la connexion\n');
      res.write('   → Solution: Ajoutez 0.0.0.0/0 dans Network Access\n');
    } else if (error.message.includes('ENOTFOUND')) {
      res.write('   → ❌ Cluster introuvable\n');
      res.write('   → Solution: Vérifiez le nom du cluster dans l\'URI\n');
    } else if (error.message.includes('getaddrinfo')) {
      res.write('   → ❌ DNS ERROR - Problème réseau Vercel\n');
      res.write('   → Solution: Attendez 5 minutes ou redéployez\n');
    } else {
      res.write(`   → ⚠️ Erreur non spécifique: ${error.message}\n`);
    }
    
    res.write('\n📋 ACTIONS À FAIRE:\n');
    res.write('   1. MongoDB Atlas → Network Access → Ajoutez 0.0.0.0/0\n');
    res.write('   2. MongoDB Atlas → Database Access → Réinitialisez le mot de passe\n');
    res.write('   3. Mettez à jour MONGODB_URI sur Vercel\n');
    res.write('   4. Redéployez: vercel --prod\n');
  }
  res.end();
});

// ========== ROUTE TEST REAL DATA ==========
app.get('/api/test-real-data', async (req, res) => {
  const { MongoClient } = await import('mongodb');
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return res.status(500).json({ error: 'MONGODB_URI non définie' });
  }

  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    const db = client.db('property_cameroon');
    
    const livestockCategories = await db
      .collection('livestockcategories')
      .find({ isActive: true })
      .limit(10)
      .toArray();
    
    const properties = await db
      .collection('properties')
      .find({ status: 'PUBLISHED' })
      .limit(10)
      .toArray();
    
    const users = await db
      .collection('users')
      .find({})
      .limit(5)
      .toArray();
    
    res.json({
      success: true,
      message: '✅ VRAIES données depuis MongoDB Atlas !',
      timestamp: new Date(),
      stats: {
        livestockCategories_count: livestockCategories.length,
        properties_count: properties.length,
        users_count: users.length
      },
      samples: {
        livestockCategories: livestockCategories.slice(0, 3),
        properties: properties.slice(0, 3)
      }
    });
    
    await client.close();
  } catch (error) {
    console.error('Test real data error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      type: error.name
    });
  }
});

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
  blogPosts: [
    {
      _id: "1",
      title: "Sécuriser votre Titre Foncier au Cameroun",
      slug: "securiser-titre-foncier-cameroun",
      excerpt: "Tout ce que vous devez savoir pour éviter les litiges fonciers",
      category: "Real Estate",
      featuredImage: "/uploads/blog/sample1.jpg",
      status: "published",
      publishedAt: new Date(),
      authorName: "Admin"
    },
    {
      _id: "2",
      title: "L'essor de l'Élevage Porcin au Cameroun",
      slug: "essor-elevage-porcin-cameroun",
      excerpt: "Une analyse approfondie du marché local",
      category: "Agriculture",
      featuredImage: "/uploads/blog/sample2.jpg",
      status: "published",
      publishedAt: new Date(),
      authorName: "Expert Agro"
    }
  ],
  properties: []
};

// ========== FONCTION DE CONNEXION MONGODB ==========
let connectionRetryCount = 0;
const maxRetries = 10;
let isConnecting = false;

const connectMongoDB = async () => {
  if (isConnecting) {
    console.log('⏳ Connection already in progress, waiting...');
    while (isConnecting && mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return mongoose.connection.readyState === 1;
  }

  if (!process.env.MONGODB_URI) {
    console.log('⚠️ MONGODB_URI not set, running in mock mode');
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return true;
  }

  isConnecting = true;
  
  try {
    console.log(`🔄 Connection attempt ${connectionRetryCount + 1}/${maxRetries}`);
    
    mongoose.set('bufferCommands', true);
    mongoose.set('bufferTimeoutMS', 10000);
    mongoose.set('autoIndex', false);
    mongoose.set('autoCreate', false);
    
    const mongooseOptions = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 120000,
      connectTimeoutMS: 30000,
      family: 4,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      heartbeatFrequencyMS: 10000,
    };

    console.log('🔄 Connecting Mongoose to MongoDB...');
    
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.disconnect();
      } catch(e) { /* ignore */ }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ Mongoose connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected - Will reconnect on next request');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
    
    connectionRetryCount = 0;
    isConnecting = false;
    return true;
  } catch (error) {
    console.error(`❌ Attempt ${connectionRetryCount + 1} failed:`, error.message);
    connectionRetryCount++;
    isConnecting = false;
    
    if (connectionRetryCount < maxRetries) {
      const delay = Math.min(10000, 2000 * connectionRetryCount);
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectMongoDB();
    }
    
    console.error('❌ All connection attempts failed - running in mock mode');
    return false;
  }
};

// ========== MIDDLEWARE 1 : CONNEXION MONGODB ==========
app.use('/api', async (req, res, next) => {
  const excludedPaths = ['/debug-mongo', '/test-real-data', '/health', '/diagnostic', '/cors-test'];
  if (excludedPaths.some(path => req.url.includes(path))) {
    return next();
  }
  
  if (mongoose.connection.readyState !== 1) {
    console.log(`🔄 Ensuring connection for ${req.method} ${req.url}...`);
    await connectMongoDB();
  }
  
  next();
});

// ========== MIDDLEWARE 2 : MODE DÉGRADÉ ==========
app.use('/api', (req, res, next) => {
  const excludedPaths = ['/debug-mongo', '/test-real-data', '/health', '/diagnostic', '/cors-test'];
  if (excludedPaths.some(path => req.url.includes(path))) {
    return next();
  }
  
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  
  console.log(`📦 Mock mode: ${req.method} ${req.url}`);
  
  if (req.method === 'GET') {
    if (req.url.includes('/properties')) {
      return res.json({
        success: true,
        data: MOCK_DATA.properties,
        message: "Mode dégradé - Reconnexion à la base de données en cours",
        mock: true
      });
    }
    
    if (req.url.includes('/livestock-categories')) {
      return res.json({
        success: true,
        data: MOCK_DATA.livestockCategories,
        message: "Mode dégradé - Reconnexion à la base de données en cours",
        mock: true
      });
    }
    
    if (req.url.includes('/agriculture')) {
      return res.json({
        success: true,
        data: MOCK_DATA.agricultureCategories,
        message: "Mode dégradé - Reconnexion à la base de données en cours",
        mock: true
      });
    }
    
    if (req.url.includes('/blog')) {
      if (req.url === '/blog' || req.url === '/blog/') {
        return res.json({
          success: true,
          data: MOCK_DATA.blogPosts,
          message: "Mode dégradé - Reconnexion à la base de données en cours",
          mock: true,
          pagination: { total: MOCK_DATA.blogPosts.length, page: 1, pages: 1 }
        });
      }
      if (req.url.includes('/featured')) {
        return res.json({
          success: true,
          data: MOCK_DATA.blogPosts.filter(p => p.isFeatured),
          mock: true
        });
      }
      if (req.url.includes('/admin/all')) {
        return res.json({
          success: true,
          data: MOCK_DATA.blogPosts,
          mock: true
        });
      }
    }
    
    if (req.url.includes('/blog/categories')) {
      return res.json({
        success: true,
        data: [],
        mock: true
      });
    }
    
    // ✅ AJOUT : Permettre la connexion même en mode dégradé
    if (req.url.includes('/auth/me')) {
      return res.status(401).json({
        success: false,
        message: "Session expirée ou utilisateur non authentifié",
        mock: true
      });
    }
  }
  
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // ✅ AJOUT : Permettre la connexion en mode dégradé
    if (req.url.includes('/auth/login')) {
      return next(); // Laisser passer la requête de login
    }
    
    return res.status(503).json({
      success: false,
      message: 'Service temporairement en mode dégradé. Les modifications ne sont pas disponibles.',
      mock: true
    });
  }
  
  next();
});

// ========== MIDDLEWARE 3 : TRADUCTION ==========
app.use('/api', (req, res, next) => {
  const excludedPaths = ['/debug-mongo', '/test-real-data', '/health', '/diagnostic', '/cors-test'];
  if (excludedPaths.some(path => req.url.includes(path))) {
    return next();
  }
  autoTranslate(req, res, next);
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
app.use('/', sitemapRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/blog/categories', blogCategoryRoutes);

// ========== ROUTES UPLOAD ==========
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
    mock_mode: mongoose.connection.readyState !== 1,
    translation_active: true,
    blog_routes: 'active',
    cors_configured: true
  });
});

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
    mongoose_version: mongoose.version,
    mock_mode_active: mongoose.connection.readyState !== 1,
    translation_middleware: 'active',
    blog_routes: 'active',
    routes_configured: [
      '/api/blog',
      '/api/blog/categories'
    ]
  };
  
  res.json(diagnostics);
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "Property Cameroon API is running",
    endpoints: {
      blog: "/api/blog",
      blogCategories: "/api/blog/categories",
      health: "/api/health",
      diagnostic: "/api/diagnostic",
      corsTest: "/api/cors-test"
    }
  });
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

// ========== DÉMARRAGE ==========
const startServer = async () => {
  console.log('🚀 Starting server...');
  console.log('🌐 Translation middleware enabled');
  console.log('📝 Blog routes enabled - /api/blog');
  console.log('🔓 CORS enabled for all origins');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const connected = await connectMongoDB();
  
  if (!connected && process.env.NODE_ENV === 'production') {
    console.log('📦 Running in MOCK MODE');
  } else if (connected) {
    console.log('🎉 MongoDB connected!');
  }
  
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔓 CORS Test: http://localhost:${PORT}/api/cors-test`);
    });
  }
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

export default app;