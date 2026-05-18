// backend/models/Livestock.model.js
import mongoose from 'mongoose';

const livestockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['aquaculture', 'poultry', 'cattle', 'pigs'],
    required: true
  },
  location: {
    city: String,
    region: String,
    coordinates: { lat: Number, lng: Number }
  },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'FCFA' }
  },
  roi: { type: Number, default: 0 }, // Rendement en pourcentage
  capacity: {
    value: Number,
    unit: { type: String, default: 'heads' }
  },
  cycleDuration: { type: String }, // ex: "6 months"
  status: {
    type: String,
    enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
    default: 'AVAILABLE'
  },
  description: String,
  images: [String],
  features: {
    hasWaterSupply: Boolean,
    hasElectricity: Boolean,
    hasVeterinaryAccess: Boolean,
    hasFeedStorage: Boolean
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  certifications: [String],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Livestock', livestockSchema);