import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  category: { 
    type: String, 
    enum: [
      'House',
      'Villa',
      'Duplex',
      'Apartment',
      'Studio',
      'Room',
      'Land',
      'Agricultural Land',
      'Commercial Space',
      'Office',
      'Warehouse',
      'Shop',
      'Industrial Space',
      'Parking'
    ], 
    required: true 
  },
  
  // ✅ NOUVEAU CHAMP - Type de transaction (Vente ou Location)
  listingType: { 
    type: String, 
    enum: ['sale', 'rent'], 
    default: 'sale',
    required: true
  },
  
  location: {
    city: String,
    district: String,
    region: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  surface: { 
    value: Number, 
    unit: { type: String, default: 'm²' } 
  },
  
  price: { 
    amount: Number, 
    currency: { type: String, default: 'FCFA' } 
  },
  
  status: { 
    type: String, 
    enum: ['PENDING', 'PUBLISHED', 'SOLD', 'RESERVED'], 
    default: 'PENDING' 
  },
  
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  description: String,
  images: [String],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  
  features: {
    hasElectricity: Boolean,
    hasWater: Boolean,
    hasRoad: Boolean,
    isFenced: Boolean,
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    // Pour appartements
    floor: { type: Number, default: null },
    hasElevator: { type: Boolean, default: false },
    hasBalcony: { type: Boolean, default: false },
    // Pour meublé/non meublé (chambres, appartements, maisons)
    isFurnished: { type: Boolean, default: false },
    // Pour commerces
    showWindow: { type: Boolean, default: false },
    zone: { type: String, default: '' },
    // Pour maisons
    hasParking: { type: Boolean, default: false },
    hasGarden: { type: Boolean, default: false },
    // Pour terrains
    landType: { type: String, default: '' }
  },
  
  // Amenities renseignées par le propriétaire (optionnel)
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