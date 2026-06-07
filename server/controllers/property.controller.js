// backend/controllers/property.controller.js

import Property from '../models/Property.model.js';
import { translateFields } from '../utils/translate.js';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Normalise la structure des amenities pour éviter les undefined.
 */
function sanitizeAmenities(property) {
  if (!property.amenities) {
    property.amenities = {
      schools:  { count: 0, names: [] },
      markets:  { count: 0, names: [] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    };
  } else {
    ['schools', 'markets', 'stations', 'bakeries'].forEach(type => {
      if (!property.amenities[type] || typeof property.amenities[type] !== 'object') {
        property.amenities[type] = { count: 0, names: [] };
      }
      if (!property.amenities[type].count) property.amenities[type].count = 0;
      if (!property.amenities[type].names) property.amenities[type].names = [];
    });
  }
  return property;
}

/**
 * Applique la traduction à un document Property.
 *
 * Logique :
 *  1. Si targetLang === sourceLang → retourner les données brutes (pas de traduction)
 *  2. Si une traduction est déjà en cache dans le document MongoDB → l'utiliser
 *  3. Sinon → traduire les champs textuels, stocker le résultat en base
 *
 * @param {mongoose.Document} property  - Document Mongoose
 * @param {string} targetLang           - 'fr' | 'en'
 * @returns {Promise<Object>}
 */
async function applyTranslation(property, targetLang) {
  const doc = property.toObject ? property.toObject() : { ...property };
  const sourceLang = doc.sourceLang || 'fr';

  // Cas 1 : même langue, rien à faire
  if (targetLang === sourceLang) {
    return sanitizeAmenities(doc);
  }

  // Cas 2 : traduction déjà en cache dans le document MongoDB
  // Les Maps Mongoose sont sérialisées en Object après toObject()
  const translationsMap = doc.translations instanceof Map
    ? Object.fromEntries(doc.translations)
    : (doc.translations || {});

  const cached = translationsMap[targetLang];
  if (cached && cached.title) {
    return sanitizeAmenities({
      ...doc,
      title:       cached.title,
      description: cached.description ?? doc.description,
      location:    cached.location
        ? { ...doc.location, ...cached.location }
        : doc.location,
      translations: translationsMap // garder pour éviter la perte lors du spread
    });
  }

  // Cas 3 : traduction absente → traduire + mettre en cache
  try {
    // Construire les champs à traduire en batch (un seul appel API)
    const fieldsToTranslate = {};
    if (doc.title)                fieldsToTranslate.title       = doc.title;
    if (doc.description)          fieldsToTranslate.description = doc.description;
    if (doc.location?.city)       fieldsToTranslate.city        = doc.location.city;
    if (doc.location?.region)     fieldsToTranslate.region      = doc.location.region;
    if (doc.location?.district)   fieldsToTranslate.district    = doc.location.district;

    const translated = await translateFields(fieldsToTranslate, sourceLang, targetLang);

    // Construire l'objet à stocker en cache
    const cacheEntry = {
      title:       translated.title       ?? doc.title,
      description: translated.description ?? doc.description,
      location: {
        city:     translated.city     ?? doc.location?.city,
        region:   translated.region   ?? doc.location?.region,
        district: translated.district ?? doc.location?.district
      }
    };

    // Sauvegarder en base de façon asynchrone (ne pas bloquer la réponse)
    Property.findByIdAndUpdate(
      doc._id,
      { $set: { [`translations.${targetLang}`]: cacheEntry } },
      { new: false }
    ).catch(err =>
      console.error(`[property] Failed to cache translation for ${doc._id}:`, err.message)
    );

    return sanitizeAmenities({
      ...doc,
      title:       cacheEntry.title,
      description: cacheEntry.description,
      location: {
        ...doc.location,
        ...cacheEntry.location
      }
    });

  } catch (err) {
    console.error(`[property] Translation error for ${doc._id}:`, err.message);
    // Fallback : données brutes sans traduction
    return sanitizeAmenities(doc);
  }
}

// ─────────────────────────────────────────────────────────────
// CONTROLLERS
// ─────────────────────────────────────────────────────────────

export const getAllProperties = async (req, res) => {
  try {
    const { status, category, owner, search, lang } = req.query;

    // Langue demandée par le frontend — défaut 'fr'
    const targetLang = ['fr', 'en'].includes(lang) ? lang : 'fr';

    let filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (category) filter.category = category;
    if (owner) filter.owner = owner;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt');

    // Appliquer la traduction sur chaque propriété (avec cache)
    const formattedProperties = await Promise.all(
      properties.map(p => applyTranslation(p, targetLang))
    );

    const totalValue = formattedProperties.reduce(
      (sum, p) => sum + (p.price?.amount || 0),
      0
    );

    res.json({
      success: true,
      count: formattedProperties.length,
      totalValue,
      properties: formattedProperties
    });

  } catch (error) {
    console.error('[getAllProperties]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLang = ['fr', 'en'].includes(lang) ? lang : 'fr';

    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const translated = await applyTranslation(property, targetLang);

    res.json({ success: true, property: translated });

  } catch (error) {
    console.error('[getPropertyById]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    // Le champ sourceLang doit être envoyé par le frontend lors de la création
    // Si absent, on essaie de le détecter — sinon on laisse le défaut du modèle ('fr')
    const propertyData = {
      ...req.body,
      owner: req.user._id,
      // S'assurer que sourceLang est valide
      sourceLang: ['fr', 'en'].includes(req.body.sourceLang)
        ? req.body.sourceLang
        : 'fr'
    };

    const property = await Property.create(propertyData);
    res.status(201).json({ success: true, property });

  } catch (error) {
    console.error('[createProperty]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    // Si le titre ou la description changent, invalider le cache de traduction
    const updateData = { ...req.body };
    if (req.body.title || req.body.description || req.body.location) {
      // Réinitialiser les traductions cachées car le contenu source a changé
      updateData.translations = {};
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, property });

  } catch (error) {
    console.error('[updateProperty]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('[deleteProperty]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertiesByOwner = async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLang = ['fr', 'en'].includes(lang) ? lang : 'fr';

    const properties = await Property.find({ owner: req.params.ownerId })
      .sort('-createdAt');

    const formattedProperties = await Promise.all(
      properties.map(p => applyTranslation(p, targetLang))
    );

    res.json({ success: true, properties: formattedProperties });

  } catch (error) {
    console.error('[getPropertiesByOwner]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};