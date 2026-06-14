import translate from 'google-translate-api-x';

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
  } catch (error) {
    console.error(`[translateText] Failed to translate "${text}" to ${targetLang}:`, error.message);
    return text;
  }
}

/**
 * Traduit les noms des amenities (écoles, commerces, stations, boulangeries)
 * @param {Object} amenities - Les amenities à traduire
 * @param {string} targetLang - Langue cible (fr, en, etc.)
 * @returns {Promise<Object>} - Amenities traduites
 */
export async function translateAmenities(amenities, targetLang) {
  // Si pas d'amenities ou langue source (en), retourner tel quel
  if (!amenities || targetLang === 'en') {
    return amenities || {
      schools: { count: 0, names: [] },
      markets: { count: 0, names: [] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    };
  }

  const categories = ['schools', 'markets', 'stations', 'bakeries'];
  const translatedAmenities = {};

  for (const category of categories) {
    const categoryData = amenities[category];
    
    if (!categoryData || !categoryData.names || categoryData.names.length === 0) {
      translatedAmenities[category] = { 
        count: categoryData?.count || 0, 
        names: [] 
      };
      continue;
    }

    // Traduire chaque nom dans la catégorie (en parallèle pour performance)
    const translatedNames = await Promise.all(
      categoryData.names.map(name => translateText(name, targetLang))
    );

    translatedAmenities[category] = {
      count: categoryData.count || 0,
      names: translatedNames
    };
  }

  return translatedAmenities;
}

/**
 * Version synchrone avec cache mémoire pour les traductions répétées
 */
export function translateAmenitiesSync(amenities, targetLang, translationsMap = {}) {
  if (!amenities || targetLang === 'en') {
    return amenities;
  }

  const categories = ['schools', 'markets', 'stations', 'bakeries'];
  const translatedAmenities = {};

  for (const category of categories) {
    const categoryData = amenities[category];
    
    if (!categoryData || !categoryData.names) {
      translatedAmenities[category] = { count: categoryData?.count || 0, names: [] };
      continue;
    }

    const translatedNames = categoryData.names.map(name => {
      const cacheKey = `${name}_${targetLang}`;
      return translationsMap[cacheKey] || name;
    });

    translatedAmenities[category] = {
      count: categoryData.count,
      names: translatedNames
    };
  }

  return translatedAmenities;
}