// backend/controllers/livestock.controller.js
import Livestock from '../models/Livestock.model.js';
import LivestockCategory from '../models/LivestockCategory.model.js';
import mongoose from 'mongoose';

// ✅ Helper pour obtenir la version localisée
const getLocalizedData = (livestock, lang) => {
  if (!livestock) return null;
  
  const isEnglish = lang === 'en';
  const livestockObj = livestock.toObject ? livestock.toObject() : livestock;
  
  return {
    ...livestockObj,
    title: isEnglish ? (livestockObj.title_en || livestockObj.title_fr) : livestockObj.title_fr,
    description: isEnglish ? (livestockObj.description_en || livestockObj.description_fr) : livestockObj.description_fr,
    category: isEnglish ? (livestockObj.category_en || livestockObj.category_fr) : livestockObj.category_fr,
    location: {
      city: isEnglish ? (livestockObj.location_en?.city || livestockObj.location_fr?.city) : livestockObj.location_fr?.city,
      region: isEnglish ? (livestockObj.location_en?.region || livestockObj.location_fr?.region) : livestockObj.location_fr?.region,
      coordinates: livestockObj.location_fr?.coordinates
    },
    // Garder les versions originales pour référence
    _original_fr: {
      title: livestockObj.title_fr,
      description: livestockObj.description_fr,
      category: livestockObj.category_fr
    }
  };
};

// ✅ Récupérer tous les animaux (avec support langue)
export const getAllLivestock = async (req, res) => {
  try {
    const { category, status, search, lang = 'fr' } = req.query;
    let filter = {};
    
    if (category) {
      // Chercher dans les deux langues
      filter.$or = [
        { category_fr: category },
        { category_en: category }
      ];
    }
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title_fr: { $regex: search, $options: 'i' } },
        { title_en: { $regex: search, $options: 'i' } },
        { description_fr: { $regex: search, $options: 'i' } },
        { description_en: { $regex: search, $options: 'i' } }
      ];
    }
    
    const livestock = await Livestock.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt');
    
    // ✅ Localiser les données selon la langue
    const localizedLivestock = livestock.map(item => getLocalizedData(item, lang));
    
    res.json({ 
      success: true, 
      count: localizedLivestock.length, 
      livestock: localizedLivestock,
      lang: lang
    });
  } catch (error) {
    console.error('Error in getAllLivestock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Récupérer par catégorie (avec support langue)
export const getLivestockByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { lang = 'fr' } = req.query;
    
    // Vérifier que la catégorie existe (dans les deux langues)
    const categoryExists = await LivestockCategory.findOne({ 
      $or: [
        { slug: category },
        { slug_en: category }
      ]
    });
    
    if (!categoryExists) {
      return res.status(404).json({ 
        success: false, 
        message: `Category "${category}" not found` 
      });
    }
    
    const livestock = await Livestock.find({ 
      $or: [
        { category_fr: category },
        { category_en: category }
      ],
      status: 'AVAILABLE' 
    })
      .populate('owner', 'name');
    
    const localizedLivestock = livestock.map(item => getLocalizedData(item, lang));
    
    res.json({ 
      success: true, 
      count: localizedLivestock.length, 
      livestock: localizedLivestock,
      lang: lang
    });
  } catch (error) {
    console.error('Error in getLivestockByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Récupérer par ID (avec support langue)
export const getLivestockById = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    
    const livestock = await Livestock.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!livestock) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    
    const localizedLivestock = getLocalizedData(livestock, lang);
    
    res.json({ success: true, livestock: localizedLivestock, lang: lang });
  } catch (error) {
    console.error('Error in getLivestockById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Récupérer par propriétaire (avec support langue)
export const getLivestockByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { lang = 'fr' } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ success: false, message: 'Invalid owner ID' });
    }
    
    const livestock = await Livestock.find({ owner: ownerId })
      .populate('owner', 'name email')
      .sort('-createdAt');
    
    const localizedLivestock = livestock.map(item => getLocalizedData(item, lang));
    
    res.json({ 
      success: true, 
      count: localizedLivestock.length, 
      livestock: localizedLivestock,
      lang: lang
    });
  } catch (error) {
    console.error('Error in getLivestockByOwner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Créer un animal (l'admin écrit en français, l'anglais est auto-généré)
export const createLivestock = async (req, res) => {
  try {
    const { category, title, description, location, ...otherData } = req.body;
    
    // Vérifier que la catégorie existe
    const categoryExists = await LivestockCategory.findOne({ 
      $or: [
        { slug: category },
        { slug_en: category }
      ]
    });
    
    if (!categoryExists) {
      return res.status(400).json({ 
        success: false, 
        message: `Category "${category}" does not exist. Please ask the administrator to create it first.`
      });
    }
    
    // ✅ Créer avec les champs français (l'admin écrit en français)
    const livestockData = {
      title_fr: title,
      description_fr: description || '',
      category_fr: category,
      location_fr: location || { city: '', region: '' },
      ...otherData,
      owner: req.user._id
    };
    
    const livestock = await Livestock.create(livestockData);
    
    // La traduction anglaise se fait automatiquement dans le pre-save hook du modèle
    
    // Mettre à jour les statistiques
    await updateCategoryStats(category);
    
    res.status(201).json({ 
      success: true, 
      livestock: getLocalizedData(livestock, 'fr'),
      message: "Créé avec succès (la version anglaise sera générée automatiquement)"
    });
  } catch (error) {
    console.error('Create livestock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mettre à jour un animal
export const updateLivestock = async (req, res) => {
  try {
    const { category, title, description, location, ...otherData } = req.body;
    const { lang = 'fr' } = req.query;
    
    const oldLivestock = await Livestock.findById(req.params.id);
    
    if (!oldLivestock) {
      return res.status(404).json({ success: false, message: 'Livestock not found' });
    }
    
    // Si la catégorie change, vérifier que la nouvelle existe
    if (category && category !== oldLivestock.category_fr) {
      const categoryExists = await LivestockCategory.findOne({ 
        $or: [
          { slug: category },
          { slug_en: category }
        ]
      });
      if (!categoryExists) {
        return res.status(400).json({ 
          success: false, 
          message: `Category "${category}" does not exist`
        });
      }
    }
    
    // ✅ Préparer les données de mise à jour
    const updateData = {
      ...otherData
    };
    
    if (title) updateData.title_fr = title;
    if (description !== undefined) updateData.description_fr = description;
    if (category) updateData.category_fr = category;
    if (location) updateData.location_fr = location;
    
    const livestock = await Livestock.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    // Mettre à jour les statistiques
    if (category && category !== oldLivestock.category_fr) {
      await updateCategoryStats(oldLivestock.category_fr);
      await updateCategoryStats(category);
    } else if (category) {
      await updateCategoryStats(category);
    }
    
    res.json({ 
      success: true, 
      livestock: getLocalizedData(livestock, lang),
      lang: lang
    });
  } catch (error) {
    console.error('Update livestock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Supprimer un animal
export const deleteLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id);
    if (!livestock) return res.status(404).json({ success: false, message: 'Not found' });
    
    const category = livestock.category_fr;
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
    const category = await LivestockCategory.findOne({ 
      $or: [
        { slug: categorySlug },
        { slug_en: categorySlug }
      ]
    });
    if (!category) return;
    
    const livestock = await Livestock.find({ 
      $or: [
        { category_fr: categorySlug },
        { category_en: categorySlug }
      ],
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
    const { lang = 'fr' } = req.query;
    const categories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    for (const category of categories) {
      await updateCategoryStats(category.slug);
    }
    
    const refreshedCategories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    // ✅ Localiser les catégories
    const localizedCategories = refreshedCategories.map(cat => ({
      ...cat.toObject(),
      title: lang === 'en' ? (cat.title_en || cat.title) : cat.title,
      description: lang === 'en' ? (cat.description_en || cat.description) : cat.description
    }));
    
    res.json({ success: true, categories: localizedCategories, lang: lang });
  } catch (error) {
    console.error('Error in getPresentationCategories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableCategoryOptions = async (req, res) => {
  try {
    const { lang = 'fr' } = req.query;
    const categories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    const options = categories.map(cat => ({
      value: cat.slug,
      label: lang === 'en' ? (cat.title_en || cat.title) : cat.title,
      icon: getIconForCategory(cat.slug)
    }));
    
    res.json({ success: true, categories: options, lang: lang });
  } catch (error) {
    console.error('Error in getAvailableCategoryOptions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getIconForCategory = (slug) => {
  const iconMap = {
    cattle: '🐄',
    poultry: '🐔',
    pigs: '🐷',
    aquaculture: '🐟',
    bovins: '🐄',
    volailles: '🐔',
    porcins: '🐷'
  };
  return iconMap[slug] || '🐄';
};