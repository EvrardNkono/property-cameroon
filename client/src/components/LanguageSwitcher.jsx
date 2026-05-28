// frontend/src/components/LanguageSwitcher.jsx
import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Alternative plus fiable : utiliser une URL de redirection ou i18n
  // Solution 1: Redirection vers les versions traduites (si disponibles)
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // Option 1: Recharger la page avec le paramètre de langue
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all group"
      >
        <Globe size={16} className="text-slate-600 group-hover:text-emerald-600 transition-colors" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
          {currentLang === 'fr' ? 'FR' : 'EN'}
        </span>
        <ChevronDown size={10} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-48 rounded-2xl overflow-hidden z-50 bg-white shadow-2xl border border-slate-100 animate-fadeInUp">
            <button
              onClick={() => changeLanguage('fr')}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                currentLang === 'fr' 
                  ? 'bg-gradient-to-r from-emerald-50 to-transparent' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">🇫🇷</span>
              <div className="flex-1 text-left">
                <div className={`text-xs font-semibold ${currentLang === 'fr' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  Français
                </div>
              </div>
              {currentLang === 'fr' && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
            
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                currentLang === 'en' 
                  ? 'bg-gradient-to-r from-amber-50 to-transparent' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">🇬🇧</span>
              <div className="flex-1 text-left">
                <div className={`text-xs font-semibold ${currentLang === 'en' ? 'text-amber-600' : 'text-gray-700'}`}>
                  English
                </div>
              </div>
              {currentLang === 'en' && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;