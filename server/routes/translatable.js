// backend/routes/translatable.js
const express = require('express');
const router = express.Router();
const TranslatableContent = require('../models/TranslatableContent');

// GET - Récupérer un contenu dans la langue demandée
router.get('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const locale = req.query.locale || 'fr';
    
    const content = await TranslatableContent.findOne({ contentId, contentType });
    
    if (!content) {
      return res.status(404).json({ error: 'Contenu non trouvé' });
    }
    
    // Trouver la traduction demandée
    let translation = content.translations.find(t => t.locale === locale);
    
    // Fallback sur le français si la traduction n'existe pas
    if (!translation) {
      translation = content.translations.find(t => t.locale === 'fr');
    }
    
    // Retourner le contenu complet
    res.json({
      id: content.contentId,
      type: content.contentType,
      data: translation?.data || {},
      metadata: content.metadata,
      media: content.media,
      locale: translation?.locale || 'fr'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer tous les contenus d'un type (avec pagination)
router.get('/:contentType', async (req, res) => {
  try {
    const { contentType } = req.params;
    const locale = req.query.locale || 'fr';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const contents = await TranslatableContent.find({ contentType })
      .skip(skip)
      .limit(limit)
      .sort({ 'metadata.createdAt': -1 });
    
    const localizedContents = contents.map(content => {
      let translation = content.translations.find(t => t.locale === locale);
      if (!translation) translation = content.translations.find(t => t.locale === 'fr');
      
      return {
        id: content.contentId,
        type: content.contentType,
        data: translation?.data || {},
        metadata: content.metadata,
        media: content.media[0] || null // Image principale
      };
    });
    
    const total = await TranslatableContent.countDocuments({ contentType });
    
    res.json({
      contents: localizedContents,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouveau contenu avec ses traductions
router.post('/:contentType', async (req, res) => {
  try {
    const { contentType } = req.params;
    const { frData, enData, metadata, media } = req.body;
    
    const contentId = `${contentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const translations = [];
    if (frData) translations.push({ locale: 'fr', data: frData });
    if (enData) translations.push({ locale: 'en', data: enData });
    
    const content = new TranslatableContent({
      contentId,
      contentType,
      translations,
      metadata: { ...metadata, createdAt: new Date(), updatedAt: new Date() },
      media
    });
    
    await content.save();
    res.status(201).json({ id: contentId, message: 'Contenu créé avec succès' });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Mettre à jour un contenu
router.put('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { frData, enData, metadata, media } = req.body;
    
    const content = await TranslatableContent.findOne({ contentId, contentType });
    if (!content) {
      return res.status(404).json({ error: 'Contenu non trouvé' });
    }
    
    // Mettre à jour les traductions
    if (frData) {
      const frTranslation = content.translations.find(t => t.locale === 'fr');
      if (frTranslation) frTranslation.data = frData;
      else content.translations.push({ locale: 'fr', data: frData });
    }
    
    if (enData) {
      const enTranslation = content.translations.find(t => t.locale === 'en');
      if (enTranslation) enTranslation.data = enData;
      else content.translations.push({ locale: 'en', data: enData });
    }
    
    // Mettre à jour les métadonnées
    if (metadata) {
      content.metadata = { ...content.metadata, ...metadata, updatedAt: new Date() };
    }
    
    if (media) content.media = media;
    
    await content.save();
    res.json({ message: 'Contenu mis à jour' });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer un contenu
router.delete('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    await TranslatableContent.findOneAndDelete({ contentId, contentType });
    res.json({ message: 'Contenu supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Traduction automatique (optionnel, avec API externe)
router.post('/auto-translate/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { targetLocale, sourceLocale = 'fr' } = req.body;
    
    const content = await TranslatableContent.findOne({ contentId, contentType });
    if (!content) {
      return res.status(404).json({ error: 'Contenu non trouvé' });
    }
    
    const sourceTranslation = content.translations.find(t => t.locale === sourceLocale);
    if (!sourceTranslation) {
      return res.status(404).json({ error: `Traduction source (${sourceLocale}) non trouvée` });
    }
    
    // Appeler un service de traduction (Google Cloud, DeepL, etc.)
    const translatedData = await translateObject(sourceTranslation.data, targetLocale);
    
    // Sauvegarder la traduction
    const existingTranslation = content.translations.find(t => t.locale === targetLocale);
    if (existingTranslation) {
      existingTranslation.data = translatedData;
    } else {
      content.translations.push({ locale: targetLocale, data: translatedData });
    }
    
    await content.save();
    res.json({ message: `Traduction vers ${targetLocale} effectuée` });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fonction utilitaire pour traduire un objet entier
async function translateObject(obj, targetLocale) {
  // Implémentation avec DeepL ou Google Cloud Translate
  const translatedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.length > 0) {
      // Appel API de traduction
      translatedObj[key] = await callTranslationAPI(value, targetLocale);
    } else if (typeof value === 'object') {
      translatedObj[key] = await translateObject(value, targetLocale);
    } else {
      translatedObj[key] = value;
    }
  }
  return translatedObj;
}

module.exports = router;