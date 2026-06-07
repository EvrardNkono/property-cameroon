import mongoose from 'mongoose';

const livestockCategorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    index: true
  },
  subtitle: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
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
  iconName: {
    type: String,
    enum: ['Fish', 'Bird', 'Database', 'Leaf'],
    default: 'Leaf'
  },
  color: {
    main: { type: String, default: 'emerald' },
    light: { type: String, default: 'emerald-50' },
    dark: { type: String, default: 'emerald-900' }
  },
  marketDemand: {
    type: String,
    default: '+0% YoY'
  },
  features: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  stats: {
    totalAssets: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    avgRoi: { type: Number, default: 0 }
  },
  
  // ✅ Cache des traductions (comme dans Property)
  // Stocke les traductions déjà effectuées pour éviter de rappeler Google Translate
  // Structure: { "fr": { title, subtitle, description }, "en": { title, subtitle, description } }
  translations: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composite pour les recherches fréquentes
livestockCategorySchema.index({ isActive: 1, order: 1 });
livestockCategorySchema.index({ slug: 1, isActive: 1 });

// Virtual pour l'image complète
livestockCategorySchema.virtual('imageFullUrl').get(function() {
  if (this.imageType === 'upload' && this.imageUpload) {
    return this.imageUpload;
  }
  return this.imageUrl;
});

// Virtual pour le nombre d'actifs formaté
livestockCategorySchema.virtual('formattedTotalAssets').get(function() {
  return this.stats.totalAssets.toLocaleString();
});

// Virtual pour la valeur totale formatée
livestockCategorySchema.virtual('formattedTotalValue').get(function() {
  return `${(this.stats.totalValue / 1000000).toFixed(1)}M FCFA`;
});

// Middleware pre-save
livestockCategorySchema.pre('save', function(next) {
  // Image par défaut si aucune n'est définie
  if (!this.imageUpload && !this.imageUrl) {
    this.imageType = 'url';
    this.imageUrl = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
  }
  
  // Nettoyer le slug
  if (this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  next();
});

// Middleware pre-update pour maintenir la cohérence
livestockCategorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.slug) {
    update.slug = update.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export default mongoose.model('LivestockCategory', livestockCategorySchema);