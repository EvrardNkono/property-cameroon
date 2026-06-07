// backend/controllers/livestock.controller.js
import Livestock from '../models/Livestock.model.js';
import LivestockCategory from '../models/LivestockCategory.model.js';
import mongoose from 'mongoose';
import translate from 'google-translate-api-x';

// ========== FONCTIONS DE TRADUCTION ==========
const memCache = new Map();

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
  if (targetLang === 'en') return text;

  const key = `${text}_${targetLang}`;
  if (memCache.has(key)) return memCache.get(key);

  try {
    const result = await translate(text, { to: targetLang });
    memCache.set(key, result.text);
    console.log(`📝 [translateText] "${text.substring(0, 30)}..." -> "${result.text.substring(0, 30)}..."`);
    return result.text;
  } catch (error) {
    console.error(`❌ [translateText] Erreur:`, error.message);
    return text;
  }
}

async function applyTranslation(livestock, targetLang) {
  const doc = livestock.toObject ? livestock.toObject() : { ...livestock };

  console.log(`🔍 [applyTranslation] Langue cible: ${targetLang}`);
  console.log(`🔍 [applyTranslation] ID: ${doc._id}`);
  console.log(`🔍 [applyTranslation] Titre original: ${doc.title?.substring(0, 50)}...`);

  if (!targetLang || targetLang === 'en') {
    console.log(`📝 [applyTranslation] Retour original (anglais)`);
    return doc;
  }

  const translationsMap = doc.translations instanceof Map
    ? Object.fromEntries(doc.translations)
    : (doc.translations || {});

  let cached = translationsMap[targetLang];

  if (cached && cached.title) {
    console.log(`✅ [applyTranslation] Cache trouvé: "${cached.title?.substring(0, 50)}..."`);
    return {
      ...doc,
      title: cached.title,
      description: cached.description ?? doc.description
    };
  }

  console.log(`🔄 [applyTranslation] Pas de cache, traduction en cours...`);
  
  try {
    const [title, description] = await Promise.all([
      translateText(doc.title, targetLang),
      translateText(doc.description, targetLang)
    ]);

    console.log(`✅ [applyTranslation] Traduction obtenue:`);
    console.log(`   Titre: "${title?.substring(0, 50)}..."`);
    console.log(`   Description: "${description?.substring(0, 50)}..."`);

    const cacheEntry = { title, description };

    await Livestock.findByIdAndUpdate(
      doc._id,
      { $set: { [`translations.${targetLang}`]: cacheEntry } }
    );
    
    console.log(`💾 [applyTranslation] Cache sauvegardé pour ${doc._id}`);

    return {
      ...doc,
      title,
      description
    };
  } catch (err) {
    console.error(`❌ [applyTranslation] Échec:`, err.message);
    return doc;
  }
}
// ========== FIN DES FONCTIONS DE TRADUCTION ==========

// ========== ENDPOINT DE TEST POUR FORCER LA TRADUCTION ==========
export const forceTranslation = async (req, res) => {
  try {
    const { id, lang = 'fr' } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }
    
    console.log(`🔄 [forceTranslation] Forcing translation for ${id} to ${lang}`);
    
    const livestock = await Livestock.findById(id);
    if (!livestock) {
      return res.status(404).json({ error: 'Livestock not found' });
    }
    
    console.log(`📝 [forceTranslation] Original title: ${livestock.title}`);
    
    const translatedTitle = await translateText(livestock.title, lang);
    const translatedDescription = await translateText(livestock.description, lang);
    
    console.log(`✅ [forceTranslation] Translated title: ${translatedTitle}`);
    
    await Livestock.findByIdAndUpdate(id, {
      $set: { [`translations.${lang}`]: { 
        title: translatedTitle, 
        description: translatedDescription 
      } }
    });
    
    const updated = await Livestock.findById(id);
    
    res.json({
      success: true,
      original: livestock.title,
      translated: translatedTitle,
      translations: updated.translations
    });
  } catch (error) {
    console.error('❌ Force translation error:', error);
    res.status(500).json({ error: error.message });
  }
};
// ========== FIN ENDPOINT DE TEST ==========

export const getAllLivestock = async (req, res) => {
  try {
    const { category, status, search, lang } = req.query;
    const targetLang = lang || 'en';
    
    console.log(`📋 [getAllLivestock] Langue: ${targetLang}`);
    
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    const livestock = await Livestock.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt');
    
    console.log(`📋 [getAllLivestock] ${livestock.length} actifs trouvés`);
    
    const translatedLivestock = await Promise.all(
      livestock.map(item => applyTranslation(item, targetLang))
    );
    
    const totalValue = translatedLivestock.reduce((sum, item) => sum + (item.price?.amount || 0), 0);
    
    res.json({
      success: true,
      count: translatedLivestock.length,
      totalValue,
      livestock: translatedLivestock
    });
  } catch (error) {
    console.error('❌ Error in getAllLivestock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    console.log(`📋 [getLivestockByCategory] Catégorie: ${category}, Langue: ${targetLang}`);
    
    const categoryExists = await LivestockCategory.findOne({ slug: category });
    if (!categoryExists) {
      return res.status(404).json({ 
        success: false, 
        message: `Category "${category}" not found` 
      });
    }
    
    const livestock = await Livestock.find({ category, status: 'AVAILABLE' })
      .populate('owner', 'name');
    
    const translatedLivestock = await Promise.all(
      livestock.map(item => applyTranslation(item, targetLang))
    );
      
    res.json({ success: true, count: translatedLivestock.length, livestock: translatedLivestock });
  } catch (error) {
    console.error('❌ Error in getLivestockByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockById = async (req, res) => {
  // 🔥 SOLUTION TEMPORAIRE : Si l'ID est "force-translation", rediriger
  if (req.params.id === 'force-translation') {
    console.log('🔄 Redirection vers forceTranslation');
    return forceTranslation(req, res);
  }
  
  try {
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    console.log(`========================================`);
    console.log(`🔍 [getLivestockById] ID: ${req.params.id}`);
    console.log(`🌐 [getLivestockById] Langue demandée: ${targetLang}`);
    
    const livestock = await Livestock.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!livestock) {
      console.log(`❌ [getLivestockById] Actif non trouvé: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    
    console.log(`📦 [getLivestockById] Titre original: ${livestock.title?.substring(0, 50)}...`);
    
    const translated = await applyTranslation(livestock, targetLang);
    
    console.log(`✅ [getLivestockById] Titre final: ${translated.title?.substring(0, 50)}...`);
    console.log(`========================================`);
    
    res.json({ success: true, livestock: translated });
  } catch (error) {
    console.error('❌ Error in getLivestockById:', error);
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
    
    const translatedLivestock = await Promise.all(
      livestock.map(item => applyTranslation(item, targetLang))
    );
      
    res.json({ success: true, count: translatedLivestock.length, livestock: translatedLivestock });
  } catch (error) {
    console.error('❌ Error in getLivestockByOwner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivestock = async (req, res) => {
  try {
    const { category } = req.body;
    
    const categoryExists = await LivestockCategory.findOne({ slug: category });
    if (!categoryExists) {
      return res.status(400).json({ 
        success: false, 
        message: `Category "${category}" does not exist.`
      });
    }
    
    const livestock = await Livestock.create({ 
      ...req.body, 
      owner: req.user._id 
    });
    
    await updateCategoryStats(category);
    
    console.log(`✅ [createLivestock] Nouvel actif créé: ${livestock._id}`);
    res.status(201).json({ success: true, livestock });
  } catch (error) {
    console.error('❌ Create livestock error:', error);
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
    
    if (category && category !== oldLivestock.category) {
      const categoryExists = await LivestockCategory.findOne({ slug: category });
      if (!categoryExists) {
        return res.status(400).json({ 
          success: false, 
          message: `Category "${category}" does not exist`
        });
      }
    }
    
    const updateData = { ...req.body };
    if (req.body.title || req.body.description) {
      updateData.translations = {};
      console.log(`🔄 [updateLivestock] Cache de traduction invalidé`);
    }
    
    const livestock = await Livestock.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (category && category !== oldLivestock.category) {
      await updateCategoryStats(oldLivestock.category);
      await updateCategoryStats(category);
    } else if (category) {
      await updateCategoryStats(category);
    }
    
    console.log(`✅ [updateLivestock] Actif mis à jour: ${livestock._id}`);
    res.json({ success: true, livestock });
  } catch (error) {
    console.error('❌ Update livestock error:', error);
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
    
    console.log(`✅ [deleteLivestock] Actif supprimé: ${req.params.id}`);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('❌ Delete livestock error:', error);
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
    
    console.log(`✅ [updateCategoryStats] Stats mises à jour pour ${categorySlug}: ${totalAssets} actifs`);
  } catch (error) {
    console.error('❌ Error updating category stats:', error);
  }
};

export const getPresentationCategories = async (req, res) => {
  try {
    const categories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    for (const category of categories) {
      await updateCategoryStats(category.slug);
    }
    
    const refreshedCategories = await LivestockCategory.find({ isActive: true }).sort('order');
    res.json({ success: true, categories: refreshedCategories });
  } catch (error) {
    console.error('❌ Error in getPresentationCategories:', error);
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
    console.error('❌ Error in getAvailableCategoryOptions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getIconForCategory = (slug) => {
  const iconMap = {
    cattle: '🐄',
    poultry: '🐔',
    pigs: '🐷',
    aquaculture: '🐟'
  };
  return iconMap[slug] || '🐄';
};