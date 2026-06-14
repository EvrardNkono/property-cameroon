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

  // Cache des traductions - MAINTENANT inclut les amenities
  // Structure: { 
  //   "fr": { 
  //     title: "Maison moderne",
  //     description: "Belle maison...",
  //     location: { city: "Douala", region: "Littoral", district: "Bonapriso" },
  //     amenities: {
  //       schools: { count: 3, names: ["Lycée Fustel", "Collège de la Salle"] },
  //       markets: { count: 2, names: ["Carrefour Market", "Super U"] },
  //       stations: { count: 1, names: ["Total"] },
  //       bakeries: { count: 2, names: ["Boulangerie des Délices", "Pain Chaud"] }
  //     }
  //   }
  // }
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