import mongoose from 'mongoose';

const livestockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    index: true
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
  roi: { type: Number, default: 0 },
  capacity: {
    value: Number,
    unit: { type: String, default: 'heads' }
  },
  cycleDuration: { type: String },
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
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  certifications: [String],
  
  // ✅ AJOUTER LE CACHE DE TRADUCTIONS (comme dans Property)
  translations: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
  
}, { timestamps: true });

export default mongoose.model('Livestock', livestockSchema);