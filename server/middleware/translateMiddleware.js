// backend/middleware/translateMiddleware.js
const translate = require('google-translate-api-x'); // Installation: npm install google-translate-api-x

// Cache pour éviter de retraduire les mêmes phrases
const translationCache = new Map();

async function translateText(text, targetLang) {
  if (!text) return text;
  if (targetLang === 'fr') return text;
  
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  try {
    const result = await translate(text, { to: targetLang });
    translationCache.set(cacheKey, result.text);
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback au texte original
  }
}

// Middleware pour traduire automatiquement les réponses API
function autoTranslate(req, res, next) {
  const lang = req.query.lang || req.headers['accept-language']?.split(',')[0] || 'fr';
  req.targetLang = lang === 'en' ? 'en' : 'fr';
  
  // Sauvegarder la méthode json originale
  const originalJson = res.json;
  
  res.json = function(data) {
    // Si la langue cible est le français, ne pas traduire
    if (req.targetLang === 'fr') {
      return originalJson.call(this, data);
    }
    
    // Traduire les données si c'est un objet ou un tableau
    if (data && typeof data === 'object') {
      translateObject(data, req.targetLang).then(translatedData => {
        originalJson.call(this, translatedData);
      }).catch(err => {
        console.error('Translation error:', err);
        originalJson.call(this, data);
      });
    } else {
      originalJson.call(this, data);
    }
  };
  
  next();
}

async function translateObject(obj, targetLang) {
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLang)));
  }
  
  if (obj && typeof obj === 'object') {
    const translated = {};
    for (const [key, value] of Object.entries(obj)) {
      // Ne pas traduire les IDs, dates, nombres
      if (key === '_id' || key === 'id' || key === 'createdAt' || key === 'updatedAt' || 
          typeof value === 'number' || typeof value === 'boolean' || value === null) {
        translated[key] = value;
      } 
      // Traduire les chaînes de caractères
      else if (typeof value === 'string' && value.length > 0) {
        translated[key] = await translateText(value, targetLang);
      }
      // Traduire les objets imbriqués
      else if (typeof value === 'object') {
        translated[key] = await translateObject(value, targetLang);
      }
      else {
        translated[key] = value;
      }
    }
    return translated;
  }
  
  return obj;
}

module.exports = autoTranslate;