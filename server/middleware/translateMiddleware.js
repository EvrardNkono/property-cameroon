// backend/middleware/translateMiddleware.js
const translate = require('google-translate-api-x');

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
    return text;
  }
}

async function translateObject(obj, targetLang) {
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLang)));
  }
  
  if (obj && typeof obj === 'object') {
    const translated = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id' || key === 'id' || key === 'createdAt' || key === 'updatedAt' || 
          typeof value === 'number' || typeof value === 'boolean' || value === null) {
        translated[key] = value;
      } 
      else if (typeof value === 'string' && value.length > 0) {
        translated[key] = await translateText(value, targetLang);
      }
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

// Middleware CORRIGÉ pour préserver les headers CORS
function autoTranslate(req, res, next) {
  const lang = req.query.lang || req.headers['accept-language']?.split(',')[0] || 'fr';
  req.targetLang = lang === 'en' ? 'en' : 'fr';
  
  // Sauvegarder les headers CORS existants
  const originalJson = res.json;
  const originalSetHeader = res.setHeader;
  
  // Capturer les headers CORS avant modification
  let corsHeaders = {};
  
  // Intercepter setHeader pour capturer les headers CORS
  res.setHeader = function(name, value) {
    if (name.toLowerCase().startsWith('access-control-allow-')) {
      corsHeaders[name] = value;
    }
    return originalSetHeader.call(this, name, value);
  };
  
  res.json = function(data) {
    // Restaurer les headers CORS avant d'envoyer la réponse
    Object.entries(corsHeaders).forEach(([name, value]) => {
      originalSetHeader.call(this, name, value);
    });
    
    // Si la langue cible est le français, ne pas traduire
    if (req.targetLang === 'fr') {
      return originalJson.call(this, data);
    }
    
    // Traduire les données
    if (data && typeof data === 'object') {
      translateObject(data, req.targetLang)
        .then(translatedData => {
          originalJson.call(this, translatedData);
        })
        .catch(err => {
          console.error('Translation error:', err);
          originalJson.call(this, data);
        });
    } else {
      originalJson.call(this, data);
    }
  };
  
  next();
}

module.exports = autoTranslate;