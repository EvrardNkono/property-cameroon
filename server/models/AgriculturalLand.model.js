// backend/models/AgriculturalLand.model.js
import mongoose from 'mongoose';

// Liste complète des cultures (60+)
const cropEnumValues = [
  // Céréales
  'maize', 'rice', 'wheat', 'sorghum', 'millet', 'barley', 'fonio',
  // Cultures de rente
  'cocoa', 'coffee', 'palm', 'rubber', 'cotton', 'cashew', 'shea', 'tea', 'tobacco', 'sugarcane',
  // Tubercules
  'cassava', 'yam', 'sweet potato', 'potato', 'taro', 'cocoyam', 'ginger', 'turmeric',
  // Légumes
  'tomato', 'onion', 'garlic', 'shallot', 'leek', 'chili', 'pepper', 'eggplant', 'cucumber',
  'zucchini', 'pumpkin', 'squash', 'cabbage', 'cauliflower', 'broccoli', 'spinach', 'lettuce', 'carrot',
  // Légumineuses
  'beans', 'soybean', 'peanut', 'cowpea', 'lentil', 'chickpea', 'green bean', 'pea',
  // Fruits
  'banana', 'plantain', 'mango', 'pineapple', 'orange', 'lemon', 'grapefruit', 'papaya',
  'avocado', 'guava', 'passion fruit', 'watermelon', 'coconut', 'date', 'fig', 'grape',
  // Épices et aromates
  'vanilla', 'cinnamon', 'pepper black', 'clove', 'nutmeg', 'cardamom', 'basil', 'thyme',
  'rosemary', 'mint', 'parsley', 'coriander', 'ginger', 'turmeric',
  // Autres
  'sunflower', 'sesame', 'jatropha', 'bamboo', 'moringa', 'neem', 'eucalyptus'
];

const agriculturalLandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  location: {
    region: {
      type: String,
      enum: ['Center', 'South', 'West', 'North-West', 'Littoral', 'Adamawa', 'North', 'Far-North', 'East'],
      required: true
    },
    city: String,
    district: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  surface: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'Ha'
    }
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'FCFA'
    },
    perHectare: Number
  },
  
  // 📈 METRICS D'INVESTISSEMENT
  expectedRoi: {
    type: Number,
    default: 0
  },
  annualYield: {
    type: Number,
    default: 0
  },
  
  // 🌾 CARACTÉRISTIQUES AGRICOLES
  agricultureDetails: {
    cropCompatibility: [{
      type: String,
      enum: cropEnumValues
    }],
    primaryCrop: {
      type: String,
      enum: [...cropEnumValues, '']  // Permettre valeur vide
    },
    soilType: {
      type: String,
      enum: ['volcanic', 'laterite', 'sandy', 'clay', 'loam', 'ferrallitic', 'peat', 'silt', ''],
      default: ''
    },
    soilQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    waterAccess: {
      type: Boolean,
      default: false
    },
    waterSource: {
      type: String,
      enum: ['river', 'well', 'borehole', 'lake', 'rainfed', 'spring', 'dam', ''],
      default: ''
    },
    electricityAccess: {
      type: Boolean,
      default: false
    },
    roadAccess: {
      type: String,
      enum: ['paved', 'unpaved', 'trail', 'none'],
      default: 'unpaved'
    },
    distanceToMarket: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'km' }
    },
    annualRainfall: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'mm' }
    },
    averageTemperature: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: '°C' }
    },
    altitude: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'm' }
    },
    slope: {
      type: String,
      enum: ['flat', 'gentle', 'moderate', 'steep', 'mountainous', ''],
      default: 'gentle'
    }
  },
  
  // 📊 STATUT ET MÉTADONNÉES
  status: {
    type: String,
    enum: ['PENDING', 'PUBLISHED', 'SOLD', 'RESERVED'],
    default: 'PENDING'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [String],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  views: {
    type: Number,
    default: 0
  },
  certifications: [{
    type: String,
    enum: ['organic', 'fair-trade', 'rainforest', 'utZ', 'bio-certified', 'global-gap', '']
  }],
  isIrrigated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ✅ CORRECTION ICI - Version sans next (recommandée pour Mongoose 6+)
agriculturalLandSchema.pre('save', function() {
  if (this.price && this.price.amount && this.surface && this.surface.value) {
    this.price.perHectare = this.price.amount / this.surface.value;
  }
  // Ne pas appeler next() - Mongoose 6+ gère automatiquement
});

// Index pour les recherches
agriculturalLandSchema.index({ 'location.region': 1, 'agricultureDetails.primaryCrop': 1 });
agriculturalLandSchema.index({ 'agricultureDetails.cropCompatibility': 1 });
agriculturalLandSchema.index({ matchScore: -1 });

export default mongoose.model('AgriculturalLand', agriculturalLandSchema);