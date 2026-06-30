// backend/controllers/translate.controller.js
import translate from 'google-translate-api-x';

const memCache = new Map();

export const translateBatch = async (req, res) => {
  try {
    const { texts, targetLang, sourceLang = 'fr' } = req.body;

    if (!Array.isArray(texts) || !targetLang) {
      return res.status(400).json({ success: false, message: 'texts[] et targetLang requis' });
    }

    if (targetLang === sourceLang) {
      return res.json({ success: true, translations: texts });
    }

    const translations = await Promise.all(
      texts.map(async (text) => {
        if (!text || typeof text !== 'string') return text;
        const key = `${text}_${targetLang}`;
        if (memCache.has(key)) return memCache.get(key);
        try {
          const result = await translate(text, { from: sourceLang, to: targetLang });
          memCache.set(key, result.text);
          return result.text;
        } catch {
          return text;
        }
      })
    );

    res.json({ success: true, translations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};