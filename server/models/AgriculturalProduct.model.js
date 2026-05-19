import mongoose from 'mongoose';

const agriculturalProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['crops', 'livestock', 'dairy', 'poultry', 'other']
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'FCFA'
    }
  },
  quantity: {
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'litre', 'piece', 'dozen', 'ton', 'bunch']
    }
  },
  description: String,
  origin: {
    region: {
      type: String,
      enum: ['Center', 'South', 'West', 'North-West', 'Littoral', 'Adamawa', 'North', 'Far-North', 'East']
    },
    city: String
  },
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PUBLISHED', 'SOLD', 'RESERVED'],
    default: 'PENDING'
  },
  certifications: [{
    type: String,
    enum: ['organic', 'fair-trade', 'rainforest']
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  harvestDate: Date,
  expiryDate: Date
}, {
  timestamps: true
});

// Index pour les recherches
agriculturalProductSchema.index({ name: 'text', description: 'text' });
agriculturalProductSchema.index({ category: 1, status: 1 });

export default mongoose.model('AgriculturalProduct', agriculturalProductSchema);