// backend/controllers/livestock.controller.js
import Livestock from '../models/Livestock.model.js';
import LivestockCategory from '../models/LivestockCategory.model.js';
import mongoose from 'mongoose';
import translate from 'google-translate-api-x';

// ========== FONCTIONS DE TRADUCTION (copiées de property.controller.js) ==========
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

async function applyTranslation(livestock, targetLang) {
  const doc = livestock.toObject ? livestock.toObject() : { ...livestock };

  if (!targetLang || targetLang === 'en') {
    return doc;
  }

  const translationsMap = doc.translations instanceof Map
    ? Object.fromEntries(doc.translations)
    : (doc.translations || {});

  const cached = translationsMap[targetLang];

  if (cached && cached.title) {
    return {
      ...doc,
      title: cached.title,
      description: cached.description ?? doc.description
    };
  }

  try {
    const [title, description] = await Promise.all([
      translateText(doc.title, targetLang),
      translateText(doc.description, targetLang)
    ]);

    const cacheEntry = { title, description };

    // Sauvegarde en cache asynchrone
    Livestock.findByIdAndUpdate(
      doc._id,
      { $set: { [`translations.${targetLang}`]: cacheEntry } },
      { new: false }
    ).catch(err => console.error(`[livestock] Cache write failed:`, err.message));

    return {
      ...doc,
      title,
      description
    };
  } catch (err) {
    console.error(`[livestock] Translation failed:`, err.message);
    return doc;
  }
}
// ========== FIN DES FONCTIONS DE TRADUCTION ==========

export const getAllLivestock = async (req, res) => {
  try {
    const { category, status, search, lang } = req.query;
    const targetLang = lang || 'en';
    
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    const livestock = await Livestock.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt');
    
    // Appliquer la traduction
    const translatedLivestock = await Promise.all(
      livestock.map(item => applyTranslation(item, targetLang))
    );
    
    res.json({ success: true, count: translatedLivestock.length, livestock: translatedLivestock });
  } catch (error) {
    console.error('Error in getAllLivestock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    // Vérifier que la catégorie existe dans LivestockCategory
    const categoryExists = await LivestockCategory.findOne({ slug: category });
    if (!categoryExists) {
      return res.status(404).json({ 
        success: false, 
        message: `Category "${category}" not found` 
      });
    }
    
    const livestock = await Livestock.find({ category, status: 'AVAILABLE' })
      .populate('owner', 'name');
    
    // Appliquer la traduction
    const translatedLivestock = await Promise.all(
      livestock.map(item => applyTranslation(item, targetLang))
    );
      
    res.json({ success: true, count: translatedLivestock.length, livestock: translatedLivestock });
  } catch (error) {
    console.error('Error in getLivestockByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockById = async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    const livestock = await Livestock.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!livestock) return res.status(404).json({ success: false, message: 'Not found' });
    
    const translated = await applyTranslation(livestock, targetLang);
    res.json({ success: true, livestock: translated });
  } catch (error) {
    console.error('Error in getLivestockById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ success: false, message: 'Invalid owner ID' });
    }
    
    const livestock = await Livestock.find({ owner: ownerId })
      .populate('owner', 'name email')
      .sort('-createdAt');
    
    // Appliquer la traduction
    const translatedLivestock = await Promise.all(
      livestock.map(item => applyTranslation(item, targetLang))
    );
      
    res.json({ success: true, count: translatedLivestock.length, livestock: translatedLivestock });
  } catch (error) {
    console.error('Error in getLivestockByOwner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivestock = async (req, res) => {
  try {
    const { category } = req.body;
    
    // Vérifier que la catégorie existe dans LivestockCategory
    const categoryExists = await LivestockCategory.findOne({ slug: category });
    if (!categoryExists) {
      return res.status(400).json({ 
        success: false, 
        message: `Category "${category}" does not exist. Please ask the administrator to create it first.`
      });
    }
    
    const livestock = await Livestock.create({ 
      ...req.body, 
      owner: req.user._id 
    });
    
    // Mettre à jour les statistiques de la catégorie
    await updateCategoryStats(category);
    
    res.status(201).json({ success: true, livestock });
  } catch (error) {
    console.error('Create livestock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLivestock = async (req, res) => {
  try {
    const { category } = req.body;
    const oldLivestock = await Livestock.findById(req.params.id);
    
    if (!oldLivestock) {
      return res.status(404).json({ success: false, message: 'Livestock not found' });
    }
    
    // Si la catégorie change, vérifier que la nouvelle existe
    if (category && category !== oldLivestock.category) {
      const categoryExists = await LivestockCategory.findOne({ slug: category });
      if (!categoryExists) {
        return res.status(400).json({ 
          success: false, 
          message: `Category "${category}" does not exist`
        });
      }
    }
    
    // Invalider le cache de traduction si le titre ou la description change
    const updateData = { ...req.body };
    if (req.body.title || req.body.description) {
      updateData.translations = {};
    }
    
    const livestock = await Livestock.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    // Mettre à jour les statistiques
    if (category && category !== oldLivestock.category) {
      await updateCategoryStats(oldLivestock.category);
      await updateCategoryStats(category);
    } else if (category) {
      await updateCategoryStats(category);
    }
    
    res.json({ success: true, livestock });
  } catch (error) {
    console.error('Update livestock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id);
    if (!livestock) return res.status(404).json({ success: false, message: 'Not found' });
    
    const category = livestock.category;
    await Livestock.findByIdAndDelete(req.params.id);
    
    await updateCategoryStats(category);
    
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete livestock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== FONCTIONS UTILITAIRES ==========

const updateCategoryStats = async (categorySlug) => {
  try {
    const category = await LivestockCategory.findOne({ slug: categorySlug });
    if (!category) return;
    
    const livestock = await Livestock.find({ 
      category: categorySlug, 
      status: 'AVAILABLE' 
    });
    
    const totalAssets = livestock.length;
    const totalValue = livestock.reduce((sum, item) => sum + (item.price?.amount || 0), 0);
    const avgRoi = totalAssets > 0 
      ? livestock.reduce((sum, item) => sum + (item.roi || 0), 0) / totalAssets 
      : 0;
    
    category.stats = { totalAssets, totalValue, avgRoi };
    await category.save();
    
    console.log(`✅ Stats updated for ${categorySlug}: ${totalAssets} assets, ${totalValue.toLocaleString()} FCFA`);
  } catch (error) {
    console.error('Error updating category stats:', error);
  }
};

export const getPresentationCategories = async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    const categories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    for (const category of categories) {
      await updateCategoryStats(category.slug);
    }
    
    const refreshedCategories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    // Appliquer la traduction aux catégories
    const translatedCategories = await Promise.all(
      refreshedCategories.map(cat => applyCategoryTranslation(cat, targetLang))
    );
    
    res.json({ success: true, categories: translatedCategories });
  } catch (error) {
    console.error('Error in getPresentationCategories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableCategoryOptions = async (req, res) => {
  try {
    const categories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    const options = categories.map(cat => ({
      value: cat.slug,
      label: cat.title,
      icon: getIconForCategory(cat.slug)
    }));
    
    res.json({ success: true, categories: options });
  } catch (error) {
    console.error('Error in getAvailableCategoryOptions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fonction de traduction pour les catégories
async function applyCategoryTranslation(category, targetLang) {
  const doc = category.toObject ? category.toObject() : { ...category };

  if (!targetLang || targetLang === 'en') {
    return doc;
  }

  const translationsMap = doc.translations instanceof Map
    ? Object.fromEntries(doc.translations)
    : (doc.translations || {});

  const cached = translationsMap[targetLang];

  if (cached && cached.title) {
    return {
      ...doc,
      title: cached.title,
      subtitle: cached.subtitle ?? doc.subtitle,
      description: cached.description ?? doc.description
    };
  }

  try {
    const [title, subtitle, description] = await Promise.all([
      translateText(doc.title, targetLang),
      translateText(doc.subtitle, targetLang),
      translateText(doc.description, targetLang)
    ]);

    const cacheEntry = { title, subtitle, description };

    LivestockCategory.findByIdAndUpdate(
      doc._id,
      { $set: { [`translations.${targetLang}`]: cacheEntry } },
      { new: false }
    ).catch(err => console.error(`[category] Cache write failed:`, err.message));

    return {
      ...doc,
      title,
      subtitle,
      description
    };
  } catch (err) {
    console.error(`[category] Translation failed:`, err.message);
    return doc;
  }
}

const getIconForCategory = (slug) => {
  const iconMap = {
    cattle: '🐄',
    poultry: '🐔',
    pigs: '🐷',
    aquaculture: '🐟'
  };
  return iconMap[slug] || '🐄';
};