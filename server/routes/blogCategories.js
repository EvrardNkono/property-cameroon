import express from 'express';
import BlogCategory from '../models/BlogCategory.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// ========== ROUTES PUBLIQUES ==========

// GET /api/blog/categories - Liste des catégories
router.get('/', async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ displayOrder: 1, name: 1 });
    
    const formatted = categories.map(cat => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      isActive: cat.isActive,
      displayOrder: cat.displayOrder,
      metaTitle: cat.metaTitle,
      metaDescription: cat.metaDescription
    }));
    
    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ========== ROUTES ADMIN (protégées) ==========

// POST /api/blog/categories - Créer une catégorie
router.post('/', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const { name, slug, description, icon, color, isActive, displayOrder, metaTitle, metaDescription } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Le nom est requis' });
    }
    
    const finalSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(name);
    
    const existing = await BlogCategory.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Ce slug existe déjà' });
    }
    
    const category = await BlogCategory.create({
      name,
      slug: finalSlug,
      description: description || '',
      icon: icon || '🏷️',
      color: color || '#c5a059',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || ''
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
        isActive: category.isActive,
        displayOrder: category.displayOrder,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/blog/categories/:id - Mettre à jour une catégorie
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
    }
    
    const { name, slug, description, icon, color, isActive, displayOrder, metaTitle, metaDescription } = req.body;
    
    if (name) category.name = name;
    
    if (slug && slug.trim()) {
      const finalSlug = generateSlug(slug);
      if (finalSlug !== category.slug) {
        const existing = await BlogCategory.findOne({ slug: finalSlug, _id: { $ne: category._id } });
        if (existing) {
          return res.status(400).json({ success: false, message: 'Ce slug existe déjà' });
        }
        category.slug = finalSlug;
      }
    }
    
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;
    if (isActive !== undefined) category.isActive = isActive;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (metaTitle !== undefined) category.metaTitle = metaTitle;
    if (metaDescription !== undefined) category.metaDescription = metaDescription;
    
    await category.save();
    
    res.json({
      success: true,
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
        isActive: category.isActive,
        displayOrder: category.displayOrder,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/blog/categories/:id - Supprimer une catégorie
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
    }
    
    await category.deleteOne();
    
    res.json({ success: true, message: 'Catégorie supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;