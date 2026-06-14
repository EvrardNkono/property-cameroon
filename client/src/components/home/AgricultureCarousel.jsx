import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, Package, ShoppingBag, ChevronLeft, ChevronRight, Star, MapPin, ArrowRight } from 'lucide-react';

// Hook pour récupérer la langue actuelle
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

const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  if (image.startsWith('/images')) return image;
  return `${BACKEND_URL}/uploads/agriculture/${image}`;
};

// Produits avec données multilingues (sans prix)
const PRODUCTS = [
  { 
    id: 1, 
    name_fr: "Fèves de Cacao Premium", 
    name_en: "Premium Cocoa Beans",
    origin_fr: "Centre, Cameroun",
    origin_en: "Centre, Cameroon",
    unit_fr: "Kg",
    unit_en: "Kg",
    img: "/images/feve-cacao-chocolat.webp",
    rating: 4.8,
    organic: true,
    season_fr: "Harvest 2024",
    season_en: "Harvest 2024"
  },
  { 
    id: 2, 
    name_fr: "Ananas Victoria", 
    name_en: "Sweet Cayenne Pineapple",
    origin_fr: "Littoral, Cameroun",
    origin_en: "Littoral, Cameroon",
    unit_fr: "Pièce",
    unit_en: "Unit",
    img: "/images/ananas-biosphoto.jpg",
    rating: 4.9,
    organic: true,
    season_fr: "Primeur",
    season_en: "Fresh"
  },
  { 
    id: 3, 
    name_fr: "Maïs Jaune (Grade A)", 
    name_en: "Yellow Corn (Grade A)",
    origin_fr: "Ouest, Cameroun",
    origin_en: "West, Cameroon",
    unit_fr: "Sac 100kg",
    unit_en: "100kg Bag",
    img: "/images/El-Bayadh-une-superficie-de-170-hectares-cultivee-en-mais-jaune.jpg",
    rating: 4.7,
    organic: false,
    season_fr: "Récolte 2024",
    season_en: "Harvest 2024"
  },
  { 
    id: 4, 
    name_fr: "Oignons Rouges", 
    name_en: "Red Onions",
    origin_fr: "Nord, Cameroun",
    origin_en: "North, Cameroon",
    unit_fr: "Sac 50kg",
    unit_en: "50kg Bag",
    img: "/images/75030664-jeune-rouge-oignon-les-plantes-croissance-dans-une-champ-photo.jpg",
    rating: 4.6,
    organic: false,
    season_fr: "Nouvelle récolte",
    season_en: "New harvest"
  }
];

const AgricultureCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  const currentLang = useCurrentLang();

  // Textes de l'interface
  const t = {
    fr: {
      marketplace: "Marché Agricole",
      currentHarvests: "Produits du Terroir",
      subtitle: "Découvrez les meilleurs produits agricoles camerounais, certifiés et traçables",
      origin: "Origine",
      contactSeller: "Contacter",
      organic: "Bio",
      conventional: "Standard",
      viewAll: "Voir tous les produits",
      season: "Saison"
    },
    en: {
      marketplace: "Agricultural Marketplace",
      currentHarvests: "Local Products",
      subtitle: "Discover the best Cameroonian agricultural products, certified and traceable",
      origin: "Origin",
      contactSeller: "Contact",
      organic: "Organic",
      conventional: "Standard",
      viewAll: "View all products",
      season: "Season"
    }
  }[currentLang] || {
    marketplace: "Marché Agricole",
    currentHarvests: "Produits du Terroir",
    subtitle: "Découvrez les meilleurs produits agricoles camerounais, certifiés et traçables",
    origin: "Origine",
    contactSeller: "Contacter",
    organic: "Bio",
    conventional: "Standard",
    viewAll: "Voir tous les produits",
    season: "Saison"
  };

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % PRODUCTS.length);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((activeIndex + 1) % PRODUCTS.length);
  const prevSlide = () => goToSlide((activeIndex - 1 + PRODUCTS.length) % PRODUCTS.length);

  const currentProduct = PRODUCTS[activeIndex];
  const currentData = {
    name: currentLang === 'fr' ? currentProduct.name_fr : currentProduct.name_en,
    origin: currentLang === 'fr' ? currentProduct.origin_fr : currentProduct.origin_en,
    unit: currentLang === 'fr' ? currentProduct.unit_fr : currentProduct.unit_en,
    season: currentLang === 'fr' ? currentProduct.season_fr : currentProduct.season_en
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-emerald-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
            <Leaf size={14} className="text-emerald-600" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-emerald-700">
              {t.marketplace}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4">
            {t.currentHarvests}
          </h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-6" />
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            {t.subtitle}
          </p>
        </div>

        {/* Carousel Principal */}
        <div 
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid md:grid-cols-2 gap-0">
            
            {/* Image Section */}
            <div className="relative h-[300px] md:h-[450px] overflow-hidden bg-emerald-900">
              <motion.img
                key={currentProduct.id}
                src={getImageUrl(currentProduct.img)}
                alt={currentData.name}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000';
                }}
              />
              
              {/* Badge Bio */}
              {currentProduct.organic && (
                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                  {t.organic}
                </div>
              )}
              
              {/* Rating */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-1 rounded-full">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-white text-xs font-bold">{currentProduct.rating}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif text-slate-800 mb-2">
                      {currentData.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <MapPin size={12} />
                      <span>{currentData.origin}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mb-1">{t.season}</div>
                    <div className="text-xs font-medium text-slate-500">{currentData.season}</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-6" />

                {/* Specs - sans prix */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Package size={16} className="text-amber-500 mx-auto mb-1" />
                    <p className="text-[8px] font-bold uppercase text-slate-500">{t.origin}</p>
                    <p className="text-[10px] font-semibold text-slate-700 truncate">{currentData.origin.split(',')[0]}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Truck size={16} className="text-amber-500 mx-auto mb-1" />
                    <p className="text-[8px] font-bold uppercase text-slate-500">Livraison</p>
                    <p className="text-[10px] font-semibold text-slate-700">Cameroun</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <ShoppingBag size={16} className="text-amber-500 mx-auto mb-1" />
                    <p className="text-[8px] font-bold uppercase text-slate-500">Unité</p>
                    <p className="text-[10px] font-semibold text-slate-700">{currentData.unit}</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  <ShoppingBag size={14} /> {t.contactSeller}
                </button>
                <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-600 hover:bg-amber-500 hover:text-white transition-all duration-300 z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-600 hover:bg-amber-500 hover:text-white transition-all duration-300 z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {PRODUCTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-8 h-1.5 bg-amber-500 rounded-full'
                  : 'w-2 h-1.5 bg-slate-300 rounded-full hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <button className="inline-flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider hover:text-amber-600 transition-colors group">
            {t.viewAll}
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default AgricultureCarousel;