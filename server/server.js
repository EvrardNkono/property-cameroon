// backend/index.js - VERSION MINIMALISTE QUI FONCTIONNE SUR VERCEL
import express from 'express';
import cors from 'cors';

const app = express();

// CORS simple mais efficace
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

// Routes de test uniquement
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running on Vercel!'
  });
});

app.get('/api/agriculture', (req, res) => {
  res.json({ 
    lands: [
      {
        _id: '1',
        title: 'Test Land',
        description: 'This is a test',
        surface: { value: 100, unit: 'Ha' },
        price: { amount: 1000000, currency: 'XAF' }
      }
    ]
  });
});

app.get('/api/properties', (req, res) => {
  res.json({ properties: [] });
});

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'Property Cameroon API is running on Vercel' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

export default app;