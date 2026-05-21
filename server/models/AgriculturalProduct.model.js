// backend/models/AgriculturalProduct.model.js
import mongoose from 'mongoose';

const agriculturalProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Maraîcher', 'Livestock', 'Spices', 'Transformation', 'Cereals', 'Fruits', 'Vegetables', 'Processed'],
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'FCFA'
    }
  },
  unit: {
    type: String,
    default: 'Kg'
  },
  origin: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0
  },
  description: String,
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PUBLISHED', 'SOLD_OUT', 'DISCONTINUED'],
    default: 'PENDING'
  },
  certifications: [{
    type: String,
    enum: ['organic', 'fair-trade', 'rainforest', 'utZ']
  }],
  harvestDate: Date,
  expiryDate: Date
}, {
  timestamps: true
});

// ✅ Supprimer quantity si vous ne l'utilisez pas, ou le rendre optionnel
// Si quantity existe dans votre base, ajoutez ceci :
agriculturalProductSchema.add({
  quantity: {
    value: { type: Number, default: 0 },
    unit: { type: String, default: 'Kg' }
  }
});

export default mongoose.model('AgriculturalProduct', agriculturalProductSchema);