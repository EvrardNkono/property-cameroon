// backend/controllers/livestock.controller.js
import Livestock from '../models/Livestock.model.js';
import LivestockCategory from '../models/LivestockCategory.model.js';
import mongoose from 'mongoose';

export const getAllLivestock = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    const livestock = await Livestock.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt');
    res.json({ success: true, count: livestock.length, livestock });
  } catch (error) {
    console.error('Error in getAllLivestock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // ✅ Vérifier que la catégorie existe dans LivestockCategory
    const categoryExists = await LivestockCategory.findOne({ slug: category });
    if (!categoryExists) {
      return res.status(404).json({ 
        success: false, 
        message: `Category "${category}" not found` 
      });
    }
    
    const livestock = await Livestock.find({ category, status: 'AVAILABLE' })
      .populate('owner', 'name');
      
    res.json({ success: true, count: livestock.length, livestock });
  } catch (error) {
    console.error('Error in getLivestockByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockById = async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id)
      .populate('owner', 'name email phone');
    if (!livestock) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, livestock });
  } catch (error) {
    console.error('Error in getLivestockById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestockByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ success: false, message: 'Invalid owner ID' });
    }
    
    const livestock = await Livestock.find({ owner: ownerId })
      .populate('owner', 'name email')
      .sort('-createdAt');
      
    res.json({ success: true, count: livestock.length, livestock });
  } catch (error) {
    console.error('Error in getLivestockByOwner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivestock = async (req, res) => {
  try {
    const { category } = req.body;
    
    // ✅ Vérifier que la catégorie existe dans LivestockCategory
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
    
    // ✅ Mettre à jour les statistiques de la catégorie
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
    
    // ✅ Si la catégorie change, vérifier que la nouvelle existe
    if (category && category !== oldLivestock.category) {
      const categoryExists = await LivestockCategory.findOne({ slug: category });
      if (!categoryExists) {
        return res.status(400).json({ 
          success: false, 
          message: `Category "${category}" does not exist`
        });
      }
    }
    
    const livestock = await Livestock.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    // ✅ Mettre à jour les statistiques
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
    const categories = await LivestockCategory.find({ isActive: true }).sort('order');
    
    for (const category of categories) {
      await updateCategoryStats(category.slug);
    }
    
    const refreshedCategories = await LivestockCategory.find({ isActive: true }).sort('order');
    res.json({ success: true, categories: refreshedCategories });
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

const getIconForCategory = (slug) => {
  const iconMap = {
    cattle: '🐄',
    poultry: '🐔',
    pigs: '🐷',
    aquaculture: '🐟'
  };
  return iconMap[slug] || '🐄';
};