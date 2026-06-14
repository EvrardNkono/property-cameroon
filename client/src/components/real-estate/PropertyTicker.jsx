// frontend/src/components/real-estate/PropertyTicker.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, X } from 'lucide-react';

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

const isDevelopment = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

const BACKEND_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/properties/${image}`;
};

const PropertyCard = ({ property, onClose, showClose = false }) => {
  const isSale = property.listingType === 'sale';
  const price = property.price?.amount?.toLocaleString() || 0;
  const location = property.location?.city || '';
  const imageUrl = getImageUrl(property.images?.[0] || property.image);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-l-xl sm:rounded-l-2xl shadow-2xl border border-slate-100 border-r-0 overflow-hidden relative">
      {showClose && onClose && (
        <button
          onClick={onClose}
          className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-100 hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 z-10"
          aria-label="Fermer"
        >
          <X size={8} />
        </button>
      )}

      <div className="flex items-center gap-2 sm:gap-3 p-2 pr-5 sm:p-3 sm:pr-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
          {imageUrl && (
            <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
            {property.title.length > 30 ? property.title.substring(0, 30) + '...' : property.title}
          </h4>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            <span className={`text-[10px] sm:text-xs font-bold ${isSale ? 'text-pc-gold' : 'text-pc-green'}`}>
              {price} FCFA {!isSale && <span className="text-[7px] sm:text-[9px]">/mois</span>}
            </span>
            {location && (
              <div className="flex items-center gap-0.5">
                <MapPin size={6} className="text-slate-400" />
                <span className="text-[7px] sm:text-[9px] text-slate-500 truncate max-w-[80px]">
                  {location.length > 15 ? location.substring(0, 15) + '...' : location}
                </span>
              </div>
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

        <div className="text-slate-300">
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};

const PropertyTicker = ({ properties, interval = 20000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex]       = useState(null);
  const [sliding, setSliding]           = useState(false);
  const [isVisible, setIsVisible]       = useState(true);
  const timerRef    = useRef(null);
  const cardRef     = useRef(null);
  const [cardHeight, setCardHeight]     = useState('auto');

  const publishedProperties = properties?.filter(p => p.status === 'PUBLISHED') || [];

  // Mesurer la vraie hauteur de la carte pour le clip horizontal
  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [currentIndex, publishedProperties.length]);

  const startSlide = useCallback(() => {
    if (publishedProperties.length < 2 || sliding) return;
    const next = (currentIndex + 1) % publishedProperties.length;
    setNextIndex(next);
    setSliding(true);

    setTimeout(() => {
      setCurrentIndex(next);
      setNextIndex(null);
      setSliding(false);
    }, 500);
  }, [currentIndex, publishedProperties.length, sliding]);

  useEffect(() => {
    if (!isVisible || publishedProperties.length < 2) return;
    timerRef.current = setInterval(startSlide, interval);
    return () => clearInterval(timerRef.current);
  }, [startSlide, interval, isVisible, publishedProperties.length]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    clearInterval(timerRef.current);
  };

  if (!isVisible || !publishedProperties.length) return null;

  const current = publishedProperties[currentIndex];
  const next    = nextIndex !== null ? publishedProperties[nextIndex] : null;

  return (
    <div
      className="fixed bottom-4 right-0 sm:bottom-6 z-50"
      style={{
        width: 300,
        // Clip uniquement horizontal — on laisse la hauteur s'auto-ajuster
        clipPath: `inset(0 0 0 0)`,
        overflow: 'hidden',
      }}
    >
      {/*
        Conteneur qui fait glisser les deux cartes ensemble.
        En idle  : translateX(0)   → carte actuelle visible
        En slide : translateX(-50%) → carte actuelle sort à gauche, suivante entre à droite
        Les deux cartes sont côte à côte dans un flex de largeur 200%.
      */}
      <div
        style={{
          display: 'flex',
          width: '200%',
          transform: sliding ? 'translateX(-50%)' : 'translateX(0%)',
          transition: sliding ? 'transform 500ms ease-in-out' : 'none',
        }}
      >
        {/* Carte actuelle — occupe 50% du flex = 100% de la largeur visible */}
        <div style={{ width: '50%' }} ref={cardRef}>
          <Link to={`/real-estate/${current._id || current.id}`} className="block">
            <PropertyCard property={current} onClose={handleClose} showClose={true} />
          </Link>
        </div>

        {/* Carte suivante — pré-rendue à droite */}
        <div style={{ width: '50%' }}>
          {next ? (
            <Link to={`/real-estate/${next._id || next.id}`} className="block">
              <PropertyCard property={next} />
            </Link>
          ) : (
            // Placeholder vide pour maintenir la structure flex
            <div style={{ width: '100%' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyTicker;