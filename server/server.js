import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import des routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js';
import propertyRoutes from './routes/property.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import documentRoutes from './routes/document.routes.js';
import investmentRoutes from './routes/investment.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import agriculturalRoutes from './routes/agricultural.routes.js'; // 👈 NOUVEAU
import amenityRoutes from './routes/amenity.routes.js';
import livestockRoutes from './routes/livestock.routes.js';
import livestockCategoryRoutes from './routes/livestockCategory.routes.js';

// Votre route chat existante (décommentez si vous avez le fichier)
// import chatRoutes from './routes/chat.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/agriculture', agriculturalRoutes); // 👈 NOUVEAU
app.use('/api/amenities', amenityRoutes);
app.use('/api/livestock', livestockRoutes);
// Votre route chat existante (décommentez si vous l'avez)
// app.use('/api/chat', chatRoutes);
app.use('/api/livestock-categories', livestockCategoryRoutes);
// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: "Property Cameroon API is running" });
});

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