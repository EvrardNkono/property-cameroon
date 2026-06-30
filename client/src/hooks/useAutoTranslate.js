// frontend/src/hooks/useAutoTranslate.js
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const CACHE_KEY = 'pc_translation_cache_v1';

const loadCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
  catch { return {}; }
};
const saveCache = (cache) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
};

/**
 * Traduit un tableau de textes source (langue par défaut: fr) vers targetLang,
 * avec cache localStorage pour éviter de re-traduire à chaque visite.
 * Retourne le tableau traduit dans le même ordre (fallback = texte source
 * le temps que la traduction arrive).
 */
export function useAutoTranslate(texts, targetLang, sourceLang = 'fr') {
  const [translated, setTranslated] = useState(texts);
  const cacheRef = useRef(loadCache());

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    if (targetLang === sourceLang) {
      setTranslated(texts);
      return;
    }

    const cache = cacheRef.current;
    const missing = [];
    const result = texts.map((t) => {
      const key = `${t}__${targetLang}`;
      if (cache[key]) return cache[key];
      missing.push(t);
      return t; // fallback temporaire pendant la traduction
    });

    setTranslated(result);

    if (missing.length === 0) return;

    api.post('/translate/batch', { texts: missing, targetLang, sourceLang })
      .then((res) => {
        if (!res?.success) return;
        let i = 0;
        const updated = texts.map((t) => {
          const key = `${t}__${targetLang}`;
          if (cache[key]) return cache[key];
          const value = res.translations[i++];
          cache[key] = value;
          return value;
        });
        saveCache(cache);
        setTranslated(updated);
      })
      .catch(() => setTranslated(texts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts, targetLang, sourceLang]);

  return translated;
}