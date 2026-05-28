// backend/models/Livestock.model.js
import mongoose from 'mongoose';

const livestockSchema = new mongoose.Schema({
  // VERSIONS FRANÇAISES (ce que l'admin écrit)
  title_fr: { type: String, required: true },
  description_fr: { type: String, default: '' },
  category_fr: { type: String, required: true, index: true },
  location_fr: {
    city: String,
    region: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  // VERSIONS ANGLAISES (traduction automatique)
  title_en: { type: String, default: '' },
  description_en: { type: String, default: '' },
  category_en: { type: String, default: '', index: true },
  location_en: {
    city: String,
    region: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  // Données communes (pas besoin de traduction)
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
  images: [String],
  features: {
    hasWaterSupply: Boolean,
    hasElectricity: Boolean,
    hasVeterinaryAccess: Boolean,
    hasFeedStorage: Boolean
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  certifications: [String]
}, { timestamps: true });

// Middleware pour auto-traduire à la sauvegarde
livestockSchema.pre('save', async function(next) {
  // Ne traduire que si le français a changé
  if (this.isModified('title_fr') || this.isModified('description_fr') || this.isModified('category_fr')) {
    try {
      // Importer dynamiquement pour éviter les dépendances circulaires
      const translate = (await import('google-translate-api-x')).default;
      
      // Traduire le titre
      if (this.title_fr && !this.title_en) {
        const titleTrans = await translate(this.title_fr, { to: 'en' });
        this.title_en = titleTrans.text;
      }
      
      // Traduire la description
      if (this.description_fr && !this.description_en) {
        const descTrans = await translate(this.description_fr, { to: 'en' });
        this.description_en = descTrans.text;
      }
      
      // Traduire la catégorie
      if (this.category_fr && !this.category_en) {
        const catTrans = await translate(this.category_fr, { to: 'en' });
        this.category_en = catTrans.text;
      }
      
      // Traduire la localisation
      if (this.location_fr?.city && !this.location_en?.city) {
        const cityTrans = await translate(this.location_fr.city, { to: 'en' });
        this.location_en = {
          ...this.location_en,
          city: cityTrans.text,
          region: this.location_fr.region ? (await translate(this.location_fr.region, { to: 'en' })).text : ''
        };
      }
      
      console.log(`✅ Auto-translated livestock: ${this.title_fr} → ${this.title_en}`);
    } catch (error) {
      console.error('Auto-translation failed:', error);
      // On continue même si la traduction échoue
    }
  }
  
  next();
});

// Méthode pour obtenir la version localisée
livestockSchema.methods.getLocalized = function(lang = 'fr') {
  const isEnglish = lang === 'en';
  
  return {
    _id: this._id,
    title: isEnglish ? this.title_en || this.title_fr : this.title_fr,
    description: isEnglish ? this.description_en || this.description_fr : this.description_fr,
    category: isEnglish ? this.category_en || this.category_fr : this.category_fr,
    location: {
      city: isEnglish ? (this.location_en?.city || this.location_fr?.city) : this.location_fr?.city,
      region: isEnglish ? (this.location_en?.region || this.location_fr?.region) : this.location_fr?.region,
      coordinates: this.location_fr?.coordinates
    },
    price: this.price,
    roi: this.roi,
    capacity: this.capacity,
    cycleDuration: this.cycleDuration,
    status: this.status,
    images: this.images,
    features: this.features,
    certifications: this.certifications,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Index pour la recherche multilingue
livestockSchema.index({ title_fr: 'text', title_en: 'text', description_fr: 'text', description_en: 'text' });

export default mongoose.model('Livestock', livestockSchema);