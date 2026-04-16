import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();

const app = express();

// Middlewares
// Conseil : En production, tu peux restreindre le CORS à l'URL de ton frontend
app.use(cors());
app.use(express.json());

// Routes Modulaires
app.use('/api/chat', chatRoutes);

// Route de santé pour vérifier que le backend répond
app.get('/', (req, res) => {
  res.status(200).json({ status: "Property Cameroon API is running" });
});

// Gestion du démarrage du serveur
// On ne lance app.listen que si on n'est PAS sur Vercel (développement local)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// CRUCIAL pour Vercel : Exporter l'application
export default app;