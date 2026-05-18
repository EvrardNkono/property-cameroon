// backend/controllers/livestockCategory.controller.js
import LivestockCategory from '../models/LivestockCategory.model.js';
import Livestock from '../models/Livestock.model.js';
import fs from 'fs';
import path from 'path';

// Obtenir toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const { isActive } = req.query;
    let filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const categories = await LivestockCategory.find(filter).sort('order');
    
    // Mettre à jour les statistiques pour chaque catégorie
    for (const category of categories) {
      const livestock = await Livestock.find({ 
        category: category.slug, 
        status: 'AVAILABLE' 
      });
      
      category.stats.totalAssets = livestock.length;
      category.stats.totalValue = livestock.reduce((sum, l) => sum + (l.price?.amount || 0), 0);
      category.stats.avgRoi = livestock.length > 0 
        ? livestock.reduce((sum, l) => sum + (l.roi || 0), 0) / livestock.length 
        : 0;
      
      await category.save();
    }
    
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir une catégorie par slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await LivestockCategory.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir une catégorie par ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await LivestockCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Créer une catégorie
export const createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body };
    
    // Gérer l'upload d'image si un fichier a été envoyé
    if (req.file) {
      categoryData.imageType = 'upload';
      categoryData.imageUpload = `/uploads/categories/${req.file.filename}`;
      categoryData.imageUrl = '';
    }
    
    const category = await LivestockCategory.create(categoryData);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const category = await LivestockCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    const updateData = { ...req.body };
    
    // Gérer l'upload d'image
    if (req.file) {
      // Supprimer l'ancienne image uploadée si elle existe
      if (category.imageUpload && category.imageType === 'upload') {
        const oldImagePath = path.join(process.cwd(), category.imageUpload);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageType = 'upload';
      updateData.imageUpload = `/uploads/categories/${req.file.filename}`;
      updateData.imageUrl = '';
    } else if (req.body.imageType === 'url') {
      updateData.imageType = 'url';
      updateData.imageUrl = req.body.imageUrl;
      updateData.imageUpload = '';
    }
    
    const updatedCategory = await LivestockCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const category = await LivestockCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // Supprimer l'image uploadée
    if (category.imageUpload && category.imageType === 'upload') {
      const imagePath = path.join(process.cwd(), category.imageUpload);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};