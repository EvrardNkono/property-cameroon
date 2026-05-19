import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Land', 'Real Estate', 'Commercial'], required: true },
  location: {
    city: String,
    district: String,
    region: String,
    coordinates: { lat: Number, lng: Number }
  },
  surface: { value: Number, unit: { type: String, default: 'm²' } },
  price: { amount: Number, currency: { type: String, default: 'FCFA' } },
  status: { type: String, enum: ['PENDING', 'PUBLISHED', 'SOLD', 'RESERVED'], default: 'PENDING' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  images: [String],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  features: {
    hasElectricity: Boolean,
    hasWater: Boolean,
    hasRoad: Boolean,
    isFenced: Boolean,
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 }
  },
  // ✅ Amenities renseignées par le propriétaire (optionnel)
  amenities: {
    schools: {
      count: { type: Number, default: 0 },
      names: [{ type: String }]
    },
    markets: {
      count: { type: Number, default: 0 },
      names: [{ type: String }]
    },
    stations: {
      count: { type: Number, default: 0 },
      names: [{ type: String }]
    },
    bakeries: {
      count: { type: Number, default: 0 },
      names: [{ type: String }]
    }
  },
  views: { type: Number, default: 0 },
  soldAt: Date,
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);