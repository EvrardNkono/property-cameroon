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
    bedrooms:    { type: Number,  default: 0 },
    bathrooms:   { type: Number,  default: 0 },
    floor:       { type: Number,  default: null },
    hasElevator: { type: Boolean, default: false },
    hasBalcony:  { type: Boolean, default: false },
    isFurnished: { type: Boolean, default: false },
    showWindow:  { type: Boolean, default: false },
    zone:        { type: String,  default: '' },
    hasParking:  { type: Boolean, default: false },
    hasGarden:   { type: Boolean, default: false },
    landType:    { type: String,  default: '' }
  },

  amenities: {
    schools:  { count: { type: Number, default: 0 }, names: [{ type: String }] },
    markets:  { count: { type: Number, default: 0 }, names: [{ type: String }] },
    stations: { count: { type: Number, default: 0 }, names: [{ type: String }] },
    bakeries: { count: { type: Number, default: 0 }, names: [{ type: String }] }
  },

  // ✅ Cache des traductions persisté en base MongoDB
  // Tes données source sont en anglais (EN).
  // Ce champ stocke les traductions déjà effectuées pour éviter de rappeler Google Translate.
  // Structure : { "fr": { title, description, location: { city, region, district } }, "de": {...} }
  // Peuplé automatiquement par le controller à la première requête dans chaque langue.
  // Invalidé automatiquement si title/description/location sont modifiés (voir updateProperty).
  translations: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },

  views:  { type: Number, default: 0 },
  soldAt: Date,
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

export default mongoose.model('Property', propertySchema);