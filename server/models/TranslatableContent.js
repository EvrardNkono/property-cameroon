// backend/models/TranslatableContent.js
const mongoose = require('mongoose');

const translatableContentSchema = new mongoose.Schema({
  // Identifiant unique du contenu
  contentId: { type: String, required: true, unique: true },
  
  // Type de contenu (property, livestock, agriculturalProduct, etc.)
  contentType: { 
    type: String, 
    required: true,
    enum: ['property', 'livestock', 'agriculturalProduct', 'expert', 'blog', 'category', 'service']
  },
  
  // Traductions
  translations: [{
    locale: { type: String, required: true, enum: ['fr', 'en'] },
    data: { type: mongoose.Schema.Types.Mixed, required: true } // Stocke TOUTES les données traduites
  }],
  
  // Données non traduisibles (prix, surface, dates, etc.)
  metadata: {
    price: Number,
    surface: Number,
    rooms: Number,
    quantity: Number,
    status: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Images, vidéos (universelles)
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video'] },
    order: Number
  }]
});

// Index pour recherche rapide
translatableContentSchema.index({ contentId: 1, contentType: 1 });
translatableContentSchema.index({ 'translations.locale': 1 });

module.exports = mongoose.model('TranslatableContent', translatableContentSchema);