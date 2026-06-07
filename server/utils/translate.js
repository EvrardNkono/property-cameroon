// backend/utils/translate.js
//
// Utilitaire de traduction partagé.
// Il appelle Claude Haiku (déjà utilisé dans le projet via ANTHROPIC_API_KEY).
// Si tu préfères DeepL ou Google Translate, remplace simplement la fonction
// callTranslationAPI() ci-dessous — le reste du code n'a pas à changer.

// Cache en mémoire pour éviter de re-traduire les mêmes chaînes dans la même
// session serveur (complément du cache MongoDB qui persiste entre sessions).
const memoryCache = new Map();

/**
 * Traduit un texte d'une langue source vers une langue cible.
 * Retourne le texte original en cas d'erreur ou si les langues sont identiques.
 *
 * @param {string} text       - Texte à traduire
 * @param {string} fromLang   - Code langue source : 'fr' | 'en'
 * @param {string} toLang     - Code langue cible  : 'fr' | 'en'
 * @returns {Promise<string>}
 */
export async function translateText(text, fromLang, toLang) {
  if (!text || typeof text !== 'string' || text.trim() === '') return text;
  if (fromLang === toLang) return text;

  const cacheKey = `${fromLang}:${toLang}:${text}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const result = await callTranslationAPI(text, fromLang, toLang);
    memoryCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('[translate] Error translating text:', err.message);
    return text; // fallback : texte original
  }
}

/**
 * Traduit plusieurs champs d'un objet en une seule fois (batch).
 * Plus efficace que plusieurs appels séparés pour un même bien.
 *
 * @param {Object} fields   - ex: { title: '...', description: '...', city: '...' }
 * @param {string} fromLang
 * @param {string} toLang
 * @returns {Promise<Object>} - même structure avec les valeurs traduites
 */
export async function translateFields(fields, fromLang, toLang) {
  if (fromLang === toLang) return fields;

  // Filtrer les champs non-vides
  const entries = Object.entries(fields).filter(([, v]) => v && typeof v === 'string' && v.trim() !== '');
  if (entries.length === 0) return fields;

  // Vérifier le cache mémoire pour chaque champ
  const toTranslate = [];
  const result = { ...fields };

  for (const [key, value] of entries) {
    const cacheKey = `${fromLang}:${toLang}:${value}`;
    if (memoryCache.has(cacheKey)) {
      result[key] = memoryCache.get(cacheKey);
    } else {
      toTranslate.push({ key, value });
    }
  }

  if (toTranslate.length === 0) return result;

  // Traduction en batch via un seul appel API
  try {
    const translated = await callBatchTranslationAPI(toTranslate, fromLang, toLang);
    for (const { key, value, translation } of translated) {
      result[key] = translation;
      const cacheKey = `${fromLang}:${toLang}:${value}`;
      memoryCache.set(cacheKey, translation);
    }
  } catch (err) {
    console.error('[translate] Batch translation failed:', err.message);
    // En cas d'erreur, garder les valeurs originales pour les champs non traduits
  }

  return result;
}

// ─────────────────────────────────────────────
// Implémentations internes — modifier ici si tu
// changes de fournisseur de traduction
// ─────────────────────────────────────────────

async function callTranslationAPI(text, fromLang, toLang) {
  const langNames = { fr: 'French', en: 'English' };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Translate the following text from ${langNames[fromLang]} to ${langNames[toLang]}. Return ONLY the translated text, with no explanation, no quotes, no preamble:\n\n${text}`
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text?.trim() || text;
}

async function callBatchTranslationAPI(items, fromLang, toLang) {
  const langNames = { fr: 'French', en: 'English' };

  // Construire un prompt batch pour traduire plusieurs champs en un seul appel
  const numbered = items.map((item, i) => `${i + 1}. ${item.value}`).join('\n');

  const prompt = `Translate the following ${items.length} items from ${langNames[fromLang]} to ${langNames[toLang]}.
Return ONLY a numbered list with the same numbering, one translation per line, no explanation:

${numbered}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Batch translation API error: ${response.status}`);
  }

  const data = await response.json();
  const lines = (data.content?.[0]?.text || '').trim().split('\n');

  return items.map((item, i) => {
    // Parser "1. Texte traduit" → "Texte traduit"
    const line = lines[i] || '';
    const translation = line.replace(/^\d+\.\s*/, '').trim();
    return {
      key: item.key,
      value: item.value,
      translation: translation || item.value // fallback si parsing échoue
    };
  });
}