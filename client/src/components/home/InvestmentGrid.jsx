import React, { useState, useEffect, useRef } from 'react';

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

// Produits avec données multilingues
const INVESTMENTS = [
  {
    id: 1,
    title_fr: "Plantation Industrielle d'Huile de Palme",
    title_en: "Industrial Palm Oil Plantation",
    location_fr: "Région du Littoral",
    location_en: "Littoral Region",
    yield: "+22%",
    term_fr: "Cycle Court",
    term_en: "Short-Cycle",
    image: "/images/oil-palm.jpg",
    imageWebp: "/images/oil-palm.jpg",
  },
  {
    id: 2,
    title_fr: "Ananas Premium (Grade Export)",
    title_en: "Premium Pineapple (Export Grade)",
    location_fr: "Région du Centre",
    location_en: "Central Region",
    yield: "+18%",
    term_fr: "18 Mois",
    term_en: "18 Months",
    image: "/images/propertyananas.jpg",
    imageWebp: "/images/istockphoto-182513179-612x612.jpg",
  },
  {
    id: 3,
    title_fr: "Réhabilitation de Plantation de Cacao",
    title_en: "Cocoa Farm Rehabilitation",
    location_fr: "Région du Sud-Ouest",
    location_en: "South-West Region",
    yield: "+15%",
    term_fr: "Long Terme",
    term_en: "Long-Term",
    image: "/images/chocolate-cacao-tree-farm-green-600nw-2256239597.webp",
    imageWebp: "/images/chocolate-cacao-tree-farm-green-600nw-2256239597.webp",
  }
];

// Composant Image optimisé
const OptimizedImage = ({ src, webpSrc, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="absolute inset-0 w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      {inView && (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          />
        </picture>
      )}
    </div>
  );
};

const InvestmentGrid = () => {
  const [isMobile, setIsMobile] = useState(false);
  const currentLang = useCurrentLang();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Textes de l'interface
  const t = {
    fr: {
      subtitle: "Sélection rigoureuse de projets à fort potentiel gérés par nos experts terrain.",
      estimatedROI: "ROI Estimé",
      viewDetails: "Voir Détails",
      growthOpportunities: "Opportunités de Croissance",
      highYield: "Rendement Élevé",
      agricultural: "Agricoles"
    },
    en: {
      subtitle: "Rigorous selection of high-potential projects managed by our on-field experts.",
      estimatedROI: "Estimated ROI",
      viewDetails: "View Details",
      growthOpportunities: "Growth Opportunities",
      highYield: "High-Yield",
      agricultural: "Agricultural"
    }
  }[currentLang] || {
    subtitle: "Sélection rigoureuse de projets à fort potentiel gérés par nos experts terrain.",
    estimatedROI: "ROI Estimé",
    viewDetails: "Voir Détails",
    growthOpportunities: "Opportunités de Croissance",
    highYield: "Rendement Élevé",
    agricultural: "Agricoles"
  };

  // Récupérer les données traduites pour chaque investissement
  const getTranslatedInvestment = (investment) => ({
    ...investment,
    title: currentLang === 'fr' ? investment.title_fr : investment.title_en,
    location: currentLang === 'fr' ? investment.location_fr : investment.location_en,
    term: currentLang === 'fr' ? investment.term_fr : investment.term_en
  });

  const translatedInvestments = INVESTMENTS.map(getTranslatedInvestment);
  const mainInvestment = translatedInvestments[0];
  const otherInvestments = translatedInvestments.slice(1);

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto bg-white font-sans">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16">
        <div className="max-w-xl">
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-pc-gold mb-3 md:mb-4 block">
            {t.growthOpportunities}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
            {t.highYield} <br /> <span className="text-pc-green italic">{t.agricultural}</span> {currentLang === 'fr' ? "Investissements" : "Investments"}
          </h2>
        </div>
        <p className="text-slate-500 text-xs md:text-sm max-w-xs mt-6 md:mt-0 italic border-l-2 border-pc-gold pl-4">
          {t.subtitle}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Main Card (Large) */}
        <div className="md:col-span-2 relative group overflow-hidden bg-slate-200 min-h-[400px] md:h-[600px]">
          <OptimizedImage
            src={mainInvestment.image}
            webpSrc={mainInvestment.imageWebp}
            alt={mainInvestment.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="bg-pc-gold text-white text-[8px] md:text-[10px] font-black px-3 py-1 uppercase tracking-widest mb-3 md:mb-4 inline-block">
                {mainInvestment.term}
              </span>
              <h3 className="text-2xl md:text-4xl font-serif text-white leading-tight">{mainInvestment.title}</h3>
              <p className="text-white/70 text-xs mt-1 md:mt-2">{mainInvestment.location}, {currentLang === 'fr' ? "Cameroun" : "Cameroon"}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-widest">{t.estimatedROI}</p>
              <p className="text-3xl md:text-4xl font-light text-pc-gold">{mainInvestment.yield}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Stacked cards */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {otherInvestments.map((inv) => (
            <div key={inv.id} className="relative group overflow-hidden bg-slate-200 min-h-[300px] md:h-full">
              <OptimizedImage
                src={inv.image}
                webpSrc={inv.imageWebp}
                alt={inv.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-500 group-hover:opacity-80"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-serif text-white mb-1 leading-tight">{inv.title}</h3>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                  <span className="text-pc-gold font-bold text-lg">{inv.yield}</span>
                  <button className="text-[9px] text-white uppercase tracking-widest font-bold border-b border-pc-gold/50 pb-1 hover:text-pc-gold transition-colors">
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS pour désactiver les hover sur mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .group:hover .group-hover\\:scale-110 {
            transform: scale(1) !important;
          }
          .group-hover\\:opacity-80:hover {
            opacity: 0.6 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default InvestmentGrid;