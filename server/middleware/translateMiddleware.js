// backend/middleware/translateMiddleware.js
import translate from 'google-translate-api-x'; // ✅ import ESM

const translationCache = new Map();

async function translateText(text, targetLang) {
  if (!text || targetLang === 'fr') return text;
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
      const skip = ['_id','id','createdAt','updatedAt'].includes(key)
        || typeof value === 'number'
        || typeof value === 'boolean'
        || value === null;
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

// ✅ Middleware corrigé — wrapper async propre
function autoTranslate(req, res, next) {
  const lang = req.query.lang
    || req.headers['accept-language']?.split(',')[0]?.split('-')[0]
    || 'fr';
  req.targetLang = lang === 'en' ? 'en' : 'fr';

  if (req.targetLang === 'fr') return next(); // ✅ Pas de traduction si français

  const originalJson = res.json.bind(res);

  // ✅ Remplacement synchrone, exécution async interne
  res.json = function (data) {
    res.json = originalJson; // ✅ Évite toute récursion
    if (!data || typeof data !== 'object') {
      return originalJson(data);
    }
    translateObject(data, req.targetLang)
      .then(translated => originalJson(translated))
      .catch(() => originalJson(data)); // ✅ Fallback propre
  };

  next();
}

export default autoTranslate; // ✅ export ESM