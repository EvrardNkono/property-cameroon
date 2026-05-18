// backend/models/Amenity.model.js
import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['school', 'market', 'station', 'bakery', 'hospital', 'bank', 'restaurant'],
    required: true
  },
  location: {
    city: String,
    district: String,
    region: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  address: String,
  phone: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  distanceToProperty: {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    distance: Number, // en km
    duration: Number // en minutes
  }
}, { timestamps: true });

// Index pour les recherches géographiques
amenitySchema.index({ 'location.city': 1, type: 1 });
amenitySchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('Amenity', amenitySchema);