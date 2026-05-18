// backend/models/LivestockCategory.model.js
import mongoose from 'mongoose';

const livestockCategorySchema = new mongoose.Schema({
  // Informations de base
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  
  // Image (deux méthodes)
  imageType: {
    type: String,
    enum: ['url', 'upload'],
    default: 'url'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageUpload: {
    type: String,
    default: ''
  },
  
  // Icône
  iconName: {
    type: String,
    enum: ['Fish', 'Bird', 'Database', 'Leaf'],
    default: 'Leaf'
  },
  
  // Couleurs et style
  color: {
    main: { type: String, default: 'emerald' },
    light: { type: String, default: 'emerald-50' },
    dark: { type: String, default: 'emerald-900' }
  },
  
  // Statistiques marché
  marketDemand: {
    type: String,
    default: '+0% YoY'
  },
  
  // Features spécifiques à la catégorie
  features: [{
    type: String
  }],
  
  // Métadonnées
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistiques calculées
  stats: {
    totalAssets: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    avgRoi: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Mettre à jour les statistiques avant sauvegarde
livestockCategorySchema.pre('save', function(next) {
  if (!this.imageUpload && !this.imageUrl) {
    this.imageType = 'url';
    this.imageUrl = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
  }
  next();
});

export default mongoose.model('LivestockCategory', livestockCategorySchema);