// backend/middleware/translateMiddleware.js
import translate from 'google-translate-api-x';

const translationCache = new Map();

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
  
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);
  
  try {
    const result = await translate(text, { to: targetLang });
    translationCache.set(cacheKey, result.text);
    return result.text;
  } catch {
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
      const skip = ['_id','id','createdAt','updatedAt','status','listingType','category','currency','unit','email','sourceUrl'].includes(key)
        || typeof value === 'number'
        || typeof value === 'boolean'
        || value === null
        || value === undefined;
      if (skip) {
        translated[key] = value;
      } else if (typeof value === 'string' && value.length > 0) {
        translated[key] = await translateText(value, targetLang);
      } else if (typeof value === 'object') {
        translated[key] = await translateObject(value, targetLang);
      } else {
        translated[key] = value;
      }
    }
    return translated;
  }
  return obj;
}

function autoTranslate(req, res, next) {
  // Détecter la langue demandée
  const lang = req.query.lang
    || req.headers['accept-language']?.split(',')[0]?.split('-')[0]
    || 'en';

  req.targetLang = lang;

  // ✅ Vos données sont en anglais → ne traduire QUE si la langue demandée N'EST PAS l'anglais
  if (req.targetLang === 'en') return next();

  const originalJson = res.json.bind(res);

  res.json = function (data) {
    res.json = originalJson;
    if (!data || typeof data !== 'object') return originalJson(data);
    translateObject(data, req.targetLang)
      .then(translated => originalJson(translated))
      .catch(() => originalJson(data));
  };

  next();
}

export default autoTranslate;