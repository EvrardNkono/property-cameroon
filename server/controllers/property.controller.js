// backend/controllers/property.controller.js
//
// Logique de traduction :
// - Tes données en base sont en ANGLAIS (langue source)
// - Si lang=en → aucune traduction, on retourne les données brutes
// - Si lang=fr (ou autre) → on cherche d'abord dans translations.{lang} en base (cache persistant)
//   → si trouvé : on l'utilise directement (0 appel Google Translate)
//   → si absent : on traduit via google-translate-api-x, on stocke en base, on retourne le résultat
// - Les amenities (écoles, commerces, stations, boulangeries) sont maintenant traduites également

import Property from '../models/Property.model.js';
import translate from 'google-translate-api-x';

// ─────────────────────────────────────────────────────────────
// Cache mémoire (session serveur) — complète le cache MongoDB
// pour les chaînes courtes répétées (noms de villes, etc.)
// ─────────────────────────────────────────────────────────────
const memCache = new Map();

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
  if (targetLang === 'en') return text; // source déjà en anglais

  const key = `${text}_${targetLang}`;
  if (memCache.has(key)) return memCache.get(key);

  try {
    const result = await translate(text, { to: targetLang });
    memCache.set(key, result.text);
    return result.text;
  } catch {
    return text; // fallback silencieux, comme dans ton middleware
  }
}

// ─────────────────────────────────────────────────────────────
// Traduit les amenities (écoles, commerces, stations, boulangeries)
// ─────────────────────────────────────────────────────────────
async function translateAmenities(amenities, targetLang) {
  if (!amenities || targetLang === 'en') {
    return amenities || {
      schools:  { count: 0, names: [] },
      markets:  { count: 0, names: [] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    };
  }

  const categories = ['schools', 'markets', 'stations', 'bakeries'];
  const translatedAmenities = {};

  for (const category of categories) {
    const categoryData = amenities[category];
    
    if (!categoryData || !categoryData.names || categoryData.names.length === 0) {
      translatedAmenities[category] = { 
        count: categoryData?.count || 0, 
        names: [] 
      };
      continue;
    }

    // Traduire chaque nom dans la catégorie
    const translatedNames = await Promise.all(
      categoryData.names.map(name => translateText(name, targetLang))
    );

    translatedAmenities[category] = {
      count: categoryData.count || 0,
      names: translatedNames
    };
  }

  return translatedAmenities;
}

// ─────────────────────────────────────────────────────────────
// Normalise les amenities (repris de ton code original)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Fonction principale : applique la traduction avec cache MongoDB
// MAINTENANT INCLUT LES AMENITIES
// ─────────────────────────────────────────────────────────────
async function applyTranslation(property, targetLang) {
  const doc = property.toObject ? property.toObject() : { ...property };

  // Langue source = anglais → pas de traduction
  if (!targetLang || targetLang === 'en') {
    return sanitizeAmenities(doc);
  }

  // Lire le cache MongoDB (Map sérialisée en objet après toObject())
  const translationsMap = doc.translations instanceof Map
    ? Object.fromEntries(doc.translations)
    : (doc.translations || {});

  const cached = translationsMap[targetLang];

  // Cache présent et valide → retourner directement (AVEC amenities)
  if (cached && cached.title) {
    return sanitizeAmenities({
      ...doc,
      title:       cached.title,
      description: cached.description ?? doc.description,
      location:    cached.location
        ? { ...doc.location, ...cached.location }
        : doc.location,
      amenities:   cached.amenities || doc.amenities  // ← Utiliser les amenities du cache
    });
  }

  // Pas de cache → traduire les champs textuels (y compris amenities)
  try {
    console.log(`[translate] Translating property ${doc._id} to ${targetLang}...`);
    
    const [title, description, city, region, district, translatedAmenities] = await Promise.all([
      translateText(doc.title,              targetLang),
      translateText(doc.description,        targetLang),
      translateText(doc.location?.city,     targetLang),
      translateText(doc.location?.region,   targetLang),
      translateText(doc.location?.district, targetLang),
      translateAmenities(doc.amenities,     targetLang)  // ← Traduire les amenities
    ]);

    const cacheEntry = {
      title,
      description,
      location: { city, region, district },
      amenities: translatedAmenities  // ← Stocker les amenities dans le cache
    };

    // Stocker en base de façon asynchrone (ne bloque pas la réponse)
    Property.findByIdAndUpdate(
      doc._id,
      { $set: { [`translations.${targetLang}`]: cacheEntry } },
      { new: false }
    ).catch(err =>
      console.error(`[property] Cache write failed for ${doc._id}:`, err.message)
    );

    console.log(`[translate] Successfully translated property ${doc._id} to ${targetLang}`);

    return sanitizeAmenities({
      ...doc,
      title,
      description,
      location: { ...doc.location, city, region, district },
      amenities: translatedAmenities  // ← Retourner les amenities traduites
    });

  } catch (err) {
    console.error(`[translate] Translation failed for ${doc._id}:`, err.message);
    return sanitizeAmenities(doc); // fallback : données brutes
  }
}

// ─────────────────────────────────────────────────────────────
// CONTROLLERS
// ─────────────────────────────────────────────────────────────

export const getAllProperties = async (req, res) => {
  try {
    const { status, category, owner, search, lang } = req.query;
    const targetLang = lang || 'en';

    let filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (category) filter.category = category;
    if (owner) filter.owner = owner;
    if (search) {
      filter.$or = [
        { title:           { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt');

    const formattedProperties = await Promise.all(
      properties.map(p => applyTranslation(p, targetLang))
    );

    const totalValue = formattedProperties.reduce(
      (sum, p) => sum + (p.price?.amount || 0), 0
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
    const targetLang = req.query.lang || 'en';

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
    const property = await Property.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error('[createProperty]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Si le contenu textuel change, invalider le cache de traductions
    // Inclure amenities dans l'invalidation
    if (req.body.title || req.body.description || req.body.location || req.body.amenities) {
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
    const targetLang = req.query.lang || 'en';

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