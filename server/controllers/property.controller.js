// backend/controllers/property.controller.js
//
// Logique de traduction :
// - Tes données en base sont en ANGLAIS (langue source)
// - Si lang=en → aucune traduction, on retourne les données brutes
// - Si lang=fr (ou autre) → on cherche d'abord dans translations.{lang} en base (cache persistant)
//   → si trouvé : on l'utilise directement (0 appel Google Translate)
//   → si absent : on traduit via google-translate-api-x, on stocke en base, on retourne le résultat
// - Les amenities (écoles, commerces, stations, boulangeries) sont traduites également

import Property from '../models/Property.model.js';
import translate from 'google-translate-api-x';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ─────────────────────────────────────────────────────────────
// Configuration du chemin des uploads
// ─────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(path.dirname(__dirname), 'uploads', 'properties');

// ─────────────────────────────────────────────────────────────
// Cache mémoire (session serveur) — complète le cache MongoDB
// pour les chaînes courtes répétées (noms de villes, etc.)
// ─────────────────────────────────────────────────────────────
const memCache = new Map();

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
  if (targetLang === 'en') return text;

  const key = `${text}_${targetLang}`;
  if (memCache.has(key)) return memCache.get(key);

  try {
    const result = await translate(text, { to: targetLang });
    memCache.set(key, result.text);
    return result.text;
  } catch {
    return text;
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
// Normalise les amenities
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
// Supprime les images physiquement du serveur
// ─────────────────────────────────────────────────────────────
async function deleteImageFiles(imagePaths) {
  if (!imagePaths || imagePaths.length === 0) return { deleted: [], errors: [] };
  
  const results = { deleted: [], errors: [] };
  
  for (const imagePath of imagePaths) {
    try {
      // Extraire le nom du fichier du chemin
      const filename = path.basename(imagePath);
      const filePath = path.join(UPLOAD_DIR, filename);
      
      // Vérifier si le fichier existe
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        results.deleted.push(imagePath);
        console.log(`🗑️ Deleted image: ${filename}`);
      } else {
        results.errors.push(`File not found: ${filename}`);
      }
    } catch (err) {
      results.errors.push(`Error deleting ${imagePath}: ${err.message}`);
    }
  }
  
  return results;
}

// ─────────────────────────────────────────────────────────────
// Fonction principale : applique la traduction avec cache MongoDB
// ─────────────────────────────────────────────────────────────
async function applyTranslation(property, targetLang) {
  const doc = property.toObject ? property.toObject() : { ...property };

  if (!targetLang || targetLang === 'en') {
    return sanitizeAmenities(doc);
  }

  const translationsMap = doc.translations instanceof Map
    ? Object.fromEntries(doc.translations)
    : (doc.translations || {});

  const cached = translationsMap[targetLang];

  // Cache présent et valide
  if (cached && cached.title) {

    // ✅ FIX : le cache existe mais ne contient pas les amenities
    // (propriété créée avant que la traduction des amenities soit implémentée)
    // → on les traduit maintenant et on met à jour le cache en arrière-plan
    if (!cached.amenities && doc.amenities) {
      const translatedAmenities = await translateAmenities(doc.amenities, targetLang);

      Property.findByIdAndUpdate(
        doc._id,
        { $set: { [`translations.${targetLang}.amenities`]: translatedAmenities } },
        { new: false }
      ).catch(err =>
        console.error(`[property] Amenities cache update failed for ${doc._id}:`, err.message)
      );

      return sanitizeAmenities({
        ...doc,
        title:       cached.title,
        description: cached.description ?? doc.description,
        location:    cached.location
          ? { ...doc.location, ...cached.location }
          : doc.location,
        amenities:   translatedAmenities
      });
    }

    // Cache complet → retourner directement
    return sanitizeAmenities({
      ...doc,
      title:       cached.title,
      description: cached.description ?? doc.description,
      location:    cached.location
        ? { ...doc.location, ...cached.location }
        : doc.location,
      amenities:   cached.amenities
    });
  }

  // Pas de cache → tout traduire (title, description, location, amenities)
  try {
    console.log(`[translate] Translating property ${doc._id} to ${targetLang}...`);

    const [title, description, city, region, district, translatedAmenities] = await Promise.all([
      translateText(doc.title,              targetLang),
      translateText(doc.description,        targetLang),
      translateText(doc.location?.city,     targetLang),
      translateText(doc.location?.region,   targetLang),
      translateText(doc.location?.district, targetLang),
      translateAmenities(doc.amenities,     targetLang)
    ]);

    const cacheEntry = {
      title,
      description,
      location:  { city, region, district },
      amenities: translatedAmenities
    };

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
      location:  { ...doc.location, city, region, district },
      amenities: translatedAmenities
    });

  } catch (err) {
    console.error(`[translate] Translation failed for ${doc._id}:`, err.message);
    return sanitizeAmenities(doc);
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
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Supprimer les images du serveur avant de supprimer la propriété
    if (property.images && property.images.length > 0) {
      await deleteImageFiles(property.images);
    }

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

// ─────────────────────────────────────────────────────────────
// NOUVEAU CONTROLLER : Supprimer des images d'une propriété
// ─────────────────────────────────────────────────────────────
export const deletePropertyImages = async (req, res) => {
  try {
    const { images } = req.body;
    const propertyId = req.params.id;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No images specified for deletion' 
      });
    }

    // Récupérer la propriété
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found' 
      });
    }

    // Vérifier les permissions
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete images from this property' 
      });
    }

    // Filtrer les images à supprimer qui existent vraiment dans la propriété
    const imagesToDelete = images.filter(img => property.images.includes(img));
    
    if (imagesToDelete.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'None of the specified images exist in this property' 
      });
    }

    // Supprimer les fichiers physiquement
    const deletionResult = await deleteImageFiles(imagesToDelete);

    // Mettre à jour la propriété : retirer les images supprimées
    property.images = property.images.filter(img => !imagesToDelete.includes(img));
    await property.save();

    // Si des traductions existent, les marquer pour mise à jour
    if (property.translations && Object.keys(property.translations).length > 0) {
      // On ne supprime pas les traductions, on les laisse pour le moment
      // Elles seront mises à jour lors de la prochaine requête de traduction
      console.log(`[property] Translations cache might need refresh for ${propertyId}`);
    }

    res.json({
      success: true,
      message: `Successfully deleted ${deletionResult.deleted.length} images`,
      deletedImages: deletionResult.deleted,
      errors: deletionResult.errors.length > 0 ? deletionResult.errors : undefined,
      remainingImages: property.images
    });

  } catch (error) {
    console.error('[deletePropertyImages]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// NOUVEAU CONTROLLER : Nettoyer les images orphelines
// ─────────────────────────────────────────────────────────────
export const cleanupOrphanedImages = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only admins can perform cleanup' 
      });
    }

    // Récupérer toutes les images utilisées par les propriétés
    const properties = await Property.find({}, 'images');
    const usedImages = new Set();
    properties.forEach(p => {
      p.images.forEach(img => usedImages.add(img));
    });

    // Lire le dossier d'upload
    let deletedCount = 0;
    let errors = [];

    if (fs.existsSync(UPLOAD_DIR)) {
      const files = fs.readdirSync(UPLOAD_DIR);
      
      for (const file of files) {
        // Ignorer les fichiers cachés et les dossiers
        if (file.startsWith('.')) continue;
        
        if (!usedImages.has(file)) {
          try {
            const filePath = path.join(UPLOAD_DIR, file);
            fs.unlinkSync(filePath);
            deletedCount++;
            console.log(`🧹 Cleaned up orphaned image: ${file}`);
          } catch (err) {
            errors.push(`Failed to delete ${file}: ${err.message}`);
          }
        }
      }
    }

    res.json({
      success: true,
      message: `Cleanup completed`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('[cleanupOrphanedImages]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};