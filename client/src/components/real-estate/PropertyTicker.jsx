// frontend/src/components/real-estate/PropertyTicker.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, X } from 'lucide-react';

// Hook pour la langue
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  return lang;
};

// Détection environnement
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const PropertyTicker = ({ properties, interval = 10000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextProperty, setNextProperty] = useState(null);
  const currentLang = useCurrentLang();
  const timerRef = useRef(null);

  // Traductions
  const t = {
    fr: { discover: "Découvrir" },
    en: { discover: "Discover" }
  }[currentLang] || { discover: "Découvrir" };

  // Filtrer les propriétés publiées
  const publishedProperties = properties?.filter(p => p.status === 'PUBLISHED') || [];
  
  if (!publishedProperties.length) return null;

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/properties/${image}`;
  };

  const currentProperty = publishedProperties[currentIndex];
  const imageUrl = getImageUrl(currentProperty.images?.[0] || currentProperty.image);
  const isSale = currentProperty.listingType === 'sale';
  const price = currentProperty.price?.amount?.toLocaleString() || 0;
  const location = currentProperty.location?.city || '';

  // Changer de bien avec animation
  const changeProperty = useCallback(() => {
    const nextIndex = (currentIndex + 1) % publishedProperties.length;
    setNextProperty(publishedProperties[nextIndex]);
    setIsAnimating(true);
    
    // Après l'animation de sortie, changer l'index
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setNextProperty(null);
      setIsAnimating(false);
    }, 500);
  }, [currentIndex, publishedProperties]);

  // Timer pour changer automatiquement
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      changeProperty();
    }, interval);
  }, [changeProperty, interval]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-0 sm:bottom-6 z-50">
      {/* Conteneur du ticker avec animation de glissement */}
      <div className="relative overflow-hidden">
        
        {/* Bandeau principal - avec animation de sortie */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isAnimating 
              ? 'translate-x-full opacity-0' 
              : 'translate-x-0 opacity-100'
          }`}
        >
          <Link
            to={`/real-estate/${currentProperty._id || currentProperty.id}`}
            className="block"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-l-xl sm:rounded-l-2xl shadow-2xl border border-slate-100 border-r-0 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
              
              {/* Bouton de fermeture */}
              <button
                onClick={handleClose}
                className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-100 hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 z-10"
                aria-label="Fermer"
              >
                <X size={8} className="sm:w-[10px] sm:h-[10px]" />
              </button>

              <div className="flex items-center gap-2 sm:gap-3 p-2 pr-5 sm:p-3 sm:pr-8">
                {/* Mini image */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={currentProperty.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                    {currentProperty.title.length > 30 
                      ? currentProperty.title.substring(0, 30) + '...' 
                      : currentProperty.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                    <span className={`text-[10px] sm:text-xs font-bold ${isSale ? 'text-pc-gold' : 'text-pc-green'}`}>
                      {price} FCFA {!isSale && <span className="text-[7px] sm:text-[9px]">/mois</span>}
                    </span>
                    {location && (
                      <>
                        <span className="text-slate-300 text-[6px] sm:text-[8px] hidden sm:inline">•</span>
                        <div className="flex items-center gap-0.5">
                          <MapPin size={6} className="sm:w-2 sm:h-2 text-slate-400" />
                          <span className="text-[7px] sm:text-[9px] text-slate-500 truncate max-w-[60px] sm:max-w-[100px]">
                            {location.length > 15 ? location.substring(0, 15) + '...' : location}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-0.5 sm:mt-1">
                    <span className={`text-[6px] sm:text-[7px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isSale ? 'bg-pc-gold/10 text-pc-gold' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isSale ? 'VENTE' : 'LOCATION'}
                    </span>
                  </div>
                </div>

                {/* Flèche */}
                <div className="text-slate-300 group-hover:text-pc-gold transition-colors -mr-1 sm:mr-0">
                  <ChevronRight size={12} className="sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Prochain bandeau (pré-chargé pour l'animation d'entrée) */}
        {nextProperty && (
          <div
            className={`absolute top-0 right-0 transition-all duration-500 ease-in-out ${
              isAnimating 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-full opacity-0'
            }`}
            style={{ width: '100%' }}
          >
            <Link
              to={`/real-estate/${nextProperty._id || nextProperty.id}`}
              className="block"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-l-xl sm:rounded-l-2xl shadow-2xl border border-slate-100 border-r-0 overflow-hidden relative">
                <div className="flex items-center gap-2 sm:gap-3 p-2 pr-5 sm:p-3 sm:pr-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={getImageUrl(nextProperty.images?.[0] || nextProperty.image)}
                      alt={nextProperty.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                      {nextProperty.title.length > 30 ? nextProperty.title.substring(0, 30) + '...' : nextProperty.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                      <span className={`text-[10px] sm:text-xs font-bold ${nextProperty.listingType === 'sale' ? 'text-pc-gold' : 'text-pc-green'}`}>
                        {nextProperty.price?.amount?.toLocaleString() || 0} FCFA
                      </span>
                    </div>
                  </div>
                  <div className="text-slate-300">
                    <ChevronRight size={12} className="sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTicker;