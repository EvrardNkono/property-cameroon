import mongoose from 'mongoose';

const livestockCategorySchema = new mongoose.Schema({
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
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    totalAssets: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    avgRoi: { type: Number, default: 0 }
  },
  
  // ✅ AJOUTER LE CACHE DE TRADUCTIONS
  translations: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
  
}, {
  timestamps: true
});

livestockCategorySchema.pre('save', function() {
  if (!this.imageUpload && !this.imageUrl) {
    this.imageType = 'url';
    this.imageUrl = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
  }
});

export default mongoose.model('LivestockCategory', livestockCategorySchema);