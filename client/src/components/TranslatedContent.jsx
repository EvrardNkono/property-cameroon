// frontend/src/components/TranslatedText.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Service de traduction côté frontend (utilise une API gratuite)
const translateText = async (text, targetLang) => {
  if (!text || text.trim() === '') return text;
  
  // Utiliser l'API gratuite MyMemory
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.responseData.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

const TranslatedText = ({ text, className, as: Component = 'span' }) => {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentLang = i18n.language;
    
    // Si langue = français, afficher le texte original
    if (currentLang === 'fr') {
      setTranslatedText(text);
      return;
    }
    
    // Si langue = anglais, traduire
    const translate = async () => {
      setLoading(true);
      const translated = await translateText(text, 'en');
      setTranslatedText(translated);
      setLoading(false);
    };
    
    translate();
  }, [text, i18n.language]);

  return (
    <Component className={className}>
      {loading ? text : translatedText}
    </Component>
  );
};

export default TranslatedText;