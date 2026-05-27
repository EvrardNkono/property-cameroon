// Composant LanguageSwitcher.jsx
import { useEffect } from 'react';

const LanguageSwitcher = () => {
  useEffect(() => {
    // Ajoute le script Google Translate
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',  // Langue d'origine de votre site
          includedLanguages: 'fr,en',  // Seulement FR et EN
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      };
    };
    
    addScript();
  }, []);
  
  return <div id="google_translate_element"></div>;
};

export default LanguageSwitcher;