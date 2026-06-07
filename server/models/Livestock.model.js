import mongoose from 'mongoose';

const livestockSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Le titre est requis'],
    trim: true
  },
  category: { 
    type: String, 
    required: [true, 'La catégorie est requise'],
    index: true
  },
  location: {
    city: { type: String, default: '' },
    region: { type: String, default: '' },
    coordinates: { 
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    }
  },
  price: {
    amount: { type: Number, required: [true, 'Le prix est requis'], default: 0 },
    currency: { type: String, default: 'FCFA' }
  },
  roi: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  },
  capacity: {
    value: { type: Number, default: 0 },
    unit: { type: String, default: 'heads' }
  },
  cycleDuration: { 
    type: String, 
    default: '12 months'
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
    default: 'AVAILABLE'
  },
  description: { 
    type: String, 
    default: ''
  },
  images: [{ type: String }],
  features: {
    hasWaterSupply: { type: Boolean, default: false },
    hasElectricity: { type: Boolean, default: false },
    hasVeterinaryAccess: { type: Boolean, default: false },
    hasFeedStorage: { type: Boolean, default: false }
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Le propriétaire est requis']
  },
  certifications: [{ type: String }],
  
  // ✅ Cache des traductions (comme dans Property)
  // Stocke les traductions déjà effectuées pour éviter de rappeler Google Translate
  // Structure: { "fr": { title, description }, "en": { title, description } }
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

// Index pour les recherches
livestockSchema.index({ title: 'text', description: 'text' });
livestockSchema.index({ category: 1, status: 1 });
livestockSchema.index({ 'location.city': 1, 'location.region': 1 });

// Virtual pour le prix formaté
livestockSchema.virtual('formattedPrice').get(function() {
  return `${this.price.amount.toLocaleString()} ${this.price.currency}`;
});

// Virtual pour le ROI formaté
livestockSchema.virtual('formattedRoi').get(function() {
  return `+${this.roi}%`;
});

// Middleware pre-save pour nettoyer les données
livestockSchema.pre('save', function(next) {
  if (this.price.amount < 0) this.price.amount = 0;
  if (this.roi < 0) this.roi = 0;
  if (this.roi > 100) this.roi = 100;
  if (this.capacity.value < 0) this.capacity.value = 0;
  next();
});

export default mongoose.model('Livestock', livestockSchema);