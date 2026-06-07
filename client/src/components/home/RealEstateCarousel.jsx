// frontend/src/components/home/RealEstateCarousel.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Maximize, Bed, Bath, Star } from 'lucide-react';

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

// Composant d'image lazy loadé
const LazyImage = ({ src, alt, isActive }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
    }
  }, [src, isActive]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {!loaded && isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
      )}
      {isActive && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
        />
      )}
    </div>
  );
};

const RealEstateCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const currentLang = useCurrentLang();
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  // Propriétés avec données multilingues
  const properties = [
    {
      id: 1,
      images: ['/images/a (1).jpg', '/images/a (2).jpg', '/images/a (3).jpg'],
      title_fr: "Villa d'Exception",
      title_en: "Exceptional Villa",
      location_fr: "",
      location_en: "",
      price: "",
      specs: { beds: 5, baths: 4, area: 450 },
      tag_fr: "Exclusivité",
      tag_en: "Exclusive",
      rating: 4.9
    },
    {
      id: 2,
      images: ['/images/a (2).jpg', '/images/a (3).jpg', '/images/a (1).jpg'],
      title_fr: "Appartement de Luxe",
      title_en: "Luxury Apartment",
      location_fr: "",
      location_en: "",
      price: "",
      specs: { beds: 3, baths: 2, area: 180 },
      tag_fr: "Nouveauté",
      tag_en: "New",
      rating: 4.8
    },
    {
      id: 3,
      images: ['/images/a (3).jpg', '/images/a (1).jpg', '/images/a (2).jpg'],
      title_fr: "Propriété Prestige",
      title_en: "Prestige Property",
      location_fr: "",
      location_en: "",
      price: "",
      specs: { beds: 6, baths: 5, area: 650 },
      tag_fr: "Premium",
      tag_en: "Premium",
      rating: 5.0
    }
  ];

  // Textes interface
  const t = {
    fr: {
      curatedPortfolio: "Portefeuille Curationné",
      premier: "Premier",
      realEstate: "Immobilier",
      viewDetails: "Découvrir",
      beds: "CHAMBRES",
      baths: "S. DE BAIN",
      area: "SUPERFICIE",
      from: "À PARTIR DE"
    },
    en: {
      curatedPortfolio: "Curated Portfolio",
      premier: "Premier",
      realEstate: "Real Estate",
      viewDetails: "Discover",
      beds: "BEDS",
      baths: "BATHS",
      area: "AREA",
      from: "FROM"
    }
  }[currentLang] || {
    curatedPortfolio: "Portefeuille Curationné",
    premier: "Premier",
    realEstate: "Immobilier",
    viewDetails: "Découvrir",
    beds: "CHAMBRES",
    baths: "S. DE BAIN",
    area: "SUPERFICIE",
    from: "À PARTIR DE"
  };

  const currentProperty = properties[activeIndex];
  const currentData = {
    title: currentLang === 'fr' ? currentProperty.title_fr : currentProperty.title_en,
    location: currentLang === 'fr' ? currentProperty.location_fr : currentProperty.location_en,
    tag: currentLang === 'fr' ? currentProperty.tag_fr : currentProperty.tag_en
  };

  // Auto-play
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % properties.length);
    }, 5000);
  }, [properties.length]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoPlaying) startAutoPlay();
    return () => stopAutoPlay();
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

  const goToSlide = (index) => {
    stopAutoPlay();
    setActiveIndex(index);
    setTimeout(() => {
      if (isAutoPlaying) startAutoPlay();
    }, 10000);
  };

  const nextSlide = () => goToSlide((activeIndex + 1) % properties.length);
  const prevSlide = () => goToSlide((activeIndex - 1 + properties.length) % properties.length);

  // Gestion tactile
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) diff > 0 ? prevSlide() : nextSlide();
    setTouchStart(null);
  };

  return (
    <section 
      ref={containerRef}
      className="py-20 md:py-28 bg-white overflow-hidden"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={() => isAutoPlaying && startAutoPlay()}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 md:w-12 h-px bg-amber-500" />
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold text-amber-600">
                {t.curatedPortfolio}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-slate-900 leading-tight">
              {t.premier}{' '}
              <span className="text-emerald-700 italic relative inline-block">
                {t.realEstate}
                <svg className="absolute -bottom-2 left-0 w-full" height="3" viewBox="0 0 200 3">
                  <path d="M0 1.5 L200 1.5" stroke="#c8a84b" strokeWidth="2" strokeDasharray="4 3" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="group w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-amber-500 hover:bg-amber-500 transition-all duration-300"
              aria-label="Previous"
            >
              <ChevronLeft size={18} className="text-slate-400 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="group w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-amber-500 hover:bg-amber-500 transition-all duration-300"
              aria-label="Next"
            >
              <ChevronRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Carousel principal */}
        <div 
          className="relative rounded-3xl overflow-hidden bg-slate-900"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Images Container */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            {properties.map((property, idx) => (
              <div
                key={property.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  idx === activeIndex 
                    ? 'opacity-100 translate-x-0 z-10' 
                    : idx < activeIndex 
                      ? 'opacity-0 -translate-x-full z-0' 
                      : 'opacity-0 translate-x-full z-0'
                }`}
              >
                <LazyImage 
                  src={property.images[0]} 
                  alt={property.title_fr}
                  isActive={idx === activeIndex}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Tag */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="px-3 py-1.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-lg">
                    {currentData.tag}
                  </div>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 text-white">
                  <div className="max-w-2xl">
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif mb-2">
                      {currentData.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={14} className="text-amber-400" />
                      <span className="text-sm md:text-base text-white/80">{currentData.location}</span>
                      <div className="flex items-center gap-1 ml-4">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{currentProperty.rating}</span>
                      </div>
                    </div>
                    
                    {/* Specs */}
                    <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <Bed size={16} className="text-amber-400" />
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-white/50">{t.beds}</p>
                          <p className="text-sm font-bold">{currentProperty.specs.beds}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath size={16} className="text-amber-400" />
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-white/50">{t.baths}</p>
                          <p className="text-sm font-bold">{currentProperty.specs.baths}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize size={16} className="text-amber-400" />
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-white/50">{t.area}</p>
                          <p className="text-sm font-bold">{currentProperty.specs.area} m²</p>
                        </div>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-white/50">{t.from}</p>
                        <p className="text-2xl md:text-3xl font-bold text-amber-400">
                          {currentProperty.price} <span className="text-sm text-white/50"></span>
                        </p>
                      </div>
                      <button className="group px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-white hover:bg-amber-500 hover:text-white transition-all duration-300">
                        {t.viewDetails}
                        <ChevronRight size={12} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {properties.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-8 h-1.5 bg-amber-500 rounded-full'
                    : 'w-4 h-1.5 bg-white/40 hover:bg-white/60 rounded-full'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Miniatures */}
        <div className="flex justify-center gap-3 mt-6">
          {properties.map((property, idx) => (
            <button
              key={property.id}
              onClick={() => goToSlide(idx)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                idx === activeIndex 
                  ? 'ring-2 ring-amber-500 scale-105' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={property.images[0]} 
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default RealEstateCarousel;