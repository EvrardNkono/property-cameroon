// backend/controllers/livestockCategory.controller.js
import LivestockCategory from '../models/LivestockCategory.model.js';
import Livestock from '../models/Livestock.model.js';
import fs from 'fs';
import path from 'path';
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

async function applyTranslation(category, targetLang) {
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

    // Sauvegarde en cache asynchrone
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
// ========== FIN DES FONCTIONS DE TRADUCTION ==========

// Obtenir toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const { isActive, lang } = req.query;
    const targetLang = lang || 'en';
    let filter = {};
    
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const categories = await LivestockCategory.find(filter).sort('order');
    
    // Appliquer la traduction
    const translatedCategories = await Promise.all(
      categories.map(cat => applyTranslation(cat, targetLang))
    );
    
    res.json({ success: true, count: translatedCategories.length, categories: translatedCategories });
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir une catégorie par slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    const category = await LivestockCategory.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    const translated = await applyTranslation(category, targetLang);
    res.json({ success: true, category: translated });
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir une catégorie par ID
export const getCategoryById = async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLang = lang || 'en';
    
    const category = await LivestockCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    const translated = await applyTranslation(category, targetLang);
    res.json({ success: true, category: translated });
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Créer une catégorie
export const createCategory = async (req, res) => {
  try {
    console.log('📝 Creating category...');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    // Extraire les données du formulaire
    const { slug, title, subtitle, description, iconName, marketDemand, features, order, isActive, imageType, imageUrl } = req.body;
    
    // Parser features si c'est une string JSON
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = features.split(',').map(f => f.trim());
      }
    }
    
    const categoryData = {
      slug,
      title,
      subtitle: subtitle || '',
      description,
      iconName: iconName || 'Leaf',
      marketDemand: marketDemand || '+0% YoY',
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
      order: parseInt(order) || 0,
      isActive: isActive === 'true' || isActive === true,
      imageType: imageType || 'url',
      imageUrl: imageUrl || '',
      imageUpload: '',
      translations: new Map() // Initialiser le cache de traductions
    };
    
    // Gérer l'upload d'image
    if (req.file) {
      categoryData.imageType = 'upload';
      categoryData.imageUpload = `/uploads/categories/${req.file.filename}`;
      categoryData.imageUrl = '';
    }
    
    const category = await LivestockCategory.create(categoryData);
    console.log(`✅ Category created: ${category.title}`);
    
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Error in createCategory:', error);
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
    
    const { slug, title, subtitle, description, iconName, marketDemand, features, order, isActive, imageType, imageUrl } = req.body;
    
    // Parser features
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = features.split(',').map(f => f.trim());
      }
    }
    
    const updateData = {
      slug: slug || category.slug,
      title: title || category.title,
      subtitle: subtitle !== undefined ? subtitle : category.subtitle,
      description: description || category.description,
      iconName: iconName || category.iconName,
      marketDemand: marketDemand || category.marketDemand,
      features: Array.isArray(parsedFeatures) ? parsedFeatures : category.features,
      order: order !== undefined ? parseInt(order) : category.order,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : category.isActive,
      imageType: imageType || category.imageType,
      imageUrl: imageUrl || category.imageUrl
    };
    
    // Invalider le cache de traduction si le titre, sous-titre ou description change
    if (title || subtitle || description) {
      updateData.translations = {};
    }
    
    // Gérer l'upload d'image
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (category.imageUpload && category.imageType === 'upload') {
        const oldImagePath = path.join(process.cwd(), category.imageUpload);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageType = 'upload';
      updateData.imageUpload = `/uploads/categories/${req.file.filename}`;
      updateData.imageUrl = '';
    }
    
    const updatedCategory = await LivestockCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log(`✅ Category updated: ${updatedCategory.title}`);
    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error('Error in updateCategory:', error);
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
    console.log(`✅ Category deleted: ${category.title}`);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour les statistiques d'une catégorie (calculées automatiquement)
export const updateCategoryStats = async (req, res) => {
  try {
    const categories = await LivestockCategory.find({});
    
    for (const category of categories) {
      const livestock = await Livestock.find({ 
        category: category.slug, 
        status: 'AVAILABLE' 
      });
      
      category.stats = {
        totalAssets: livestock.length,
        totalValue: livestock.reduce((sum, l) => sum + (l.price?.amount || 0), 0),
        avgRoi: livestock.length > 0 
          ? livestock.reduce((sum, l) => sum + (l.roi || 0), 0) / livestock.length 
          : 0
      };
      
      await category.save();
    }
    
    res.json({ success: true, message: 'Stats updated' });
  } catch (error) {
    console.error('Error in updateCategoryStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};