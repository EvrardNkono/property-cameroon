// backend/models/AgriculturalLand.model.js
import mongoose from 'mongoose';

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
    perHectare: Number // Prix à l'hectare (calculé automatiquement)
  },
  
  // 🌾 CARACTÉRISTIQUES AGRICOLES SPÉCIFIQUES
  agricultureDetails: {
    cropCompatibility: [{
      type: String,
      enum: ['cocoa', 'coffee', 'palm', 'banana', 'rubber', 'maize', 'cassava', 'rice']
    }],
    primaryCrop: {
      type: String,
      enum: ['cocoa', 'coffee', 'palm', 'banana', 'rubber', 'maize', 'cassava', 'rice']
    },
    soilType: {
      type: String,
      enum: ['volcanic', 'laterite', 'sandy', 'clay', 'loam', 'ferrallitic']
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
      enum: ['river', 'well', 'borehole', 'lake', 'rainfed']
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
      value: Number,
      unit: { type: String, default: 'km' }
    },
    annualRainfall: {
      value: Number,
      unit: { type: String, default: 'mm' }
    },
    averageTemperature: {
      value: Number,
      unit: { type: String, default: '°C' }
    },
    altitude: {
      value: Number,
      unit: { type: String, default: 'm' }
    },
    slope: {
      type: String,
      enum: ['flat', 'gentle', 'moderate', 'steep'],
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
    enum: ['organic', 'fair-trade', 'rainforest', 'utZ']
  }],
  isIrrigated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculer le prix à l'hectare avant sauvegarde
agriculturalLandSchema.pre('save', function(next) {
  if (this.price.amount && this.surface.value) {
    this.price.perHectare = this.price.amount / this.surface.value;
  }
  next();
});

// Index pour les recherches
agriculturalLandSchema.index({ 'location.region': 1, 'agricultureDetails.primaryCrop': 1 });
agriculturalLandSchema.index({ 'agricultureDetails.cropCompatibility': 1 });
agriculturalLandSchema.index({ matchScore: -1 });

export default mongoose.model('AgriculturalLand', agriculturalLandSchema);