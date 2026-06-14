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

const PropertyTicker = ({ properties, interval = 10000 }) => { // 10 secondes par défaut
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
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

  // Changement automatique toutes les X secondes
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % publishedProperties.length);
    }, interval);
  }, [publishedProperties.length, interval]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // Fermer le ticker
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    // Arrêter le timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Réouvrir (optionnel - si besoin plus tard)
  const handleReopen = () => {
    setIsVisible(true);
    startTimer();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Bandeau flottant */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <Link
          to={`/real-estate/${currentProperty._id || currentProperty.id}`}
          className="block"
        >
          {/* Bandeau compact */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 max-w-sm relative">
            {/* Bouton de fermeture */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-100 hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 z-10"
              aria-label="Fermer"
            >
              <X size={10} />
            </button>

            <div className="flex items-center gap-3 p-3 pr-8">
              {/* Mini image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
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
                {/* Titre défilant (de droite à gauche) */}
                <div className="overflow-hidden">
                  <div className="animate-slide whitespace-nowrap">
                    <h4 className="text-sm font-semibold text-slate-800 inline-block">
                      {currentProperty.title}
                    </h4>
                  </div>
                </div>

                {/* Prix et localisation */}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold ${isSale ? 'text-pc-gold' : 'text-pc-green'}`}>
                    {price} FCFA {!isSale && <span className="text-[9px]">/mois</span>}
                  </span>
                  {location && (
                    <>
                      <span className="text-slate-300 text-[8px]">•</span>
                      <div className="flex items-center gap-0.5">
                        <MapPin size={8} className="text-slate-400" />
                        <span className="text-[9px] text-slate-500 truncate max-w-[100px]">{location}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Badge */}
                <div className="mt-1">
                  <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isSale ? 'bg-pc-gold/10 text-pc-gold' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSale ? 'À VENDRE' : 'À LOUER'}
                  </span>
                </div>
              </div>

              {/* Flèche */}
              <div className="text-slate-300 group-hover:text-pc-gold transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideRightToLeft {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-slide {
          animation: slideRightToLeft 10s linear infinite;
          display: inline-block;
          padding-right: 100%;
        }
      `}</style>
    </>
  );
};

export default PropertyTicker;