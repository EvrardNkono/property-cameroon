import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Landmark, ChevronRight } from 'lucide-react';

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

const Hero = () => {
  const gold = '#c8a84b';
  const green = '#1a4731';
  const currentLang = useCurrentLang();
  const [hoveredImage, setHoveredImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1); // Index central par défaut

  // Textes traduits
  const t = {
    fr: {
      badge: "Premier Investment Gateway",
      title: "Sécurisez votre",
      titleHighlight: "Avenir Financier.",
      description: "Accès exclusif aux secteurs certifiés de l'",
      realEstate: "Immobilier",
      agriculture: "Agriculture",
      livestock: "Élevage",
      and: "et",
      atCameroon: "au Cameroun.",
      exploreAssets: "Explorer les actifs",
      ourLegacy: "Notre héritage",
      securedTitles: "Titres Sécurisés",
      hectares: "Hectares",
      liveDashboard: "Dashboard en direct",
      officialPartner: "Partenaire Officiel",
      capefCertified: "CAPEF Certifié"
    },
    en: {
      badge: "Premier Investment Gateway",
      title: "Secure Your",
      titleHighlight: "Future Wealth.",
      description: "Exclusive access to certified",
      realEstate: "Real Estate",
      agriculture: "Agriculture",
      livestock: "Livestock",
      and: "and",
      atCameroon: "sectors in Cameroon.",
      exploreAssets: "Explore Assets",
      ourLegacy: "Our Legacy",
      securedTitles: "Secured Titles",
      hectares: "Hectares",
      liveDashboard: "Live Dashboard",
      officialPartner: "Official Partner",
      capefCertified: "CAPEF Certified"
    }
  }[currentLang] || {};

  // Images avec liens
  const images = [
    { 
      id: 'realestate', 
      src: '/images/heroimo.webp', 
      label_fr: "Immobilier", 
      label_en: "Real Estate",
      link: "/real-estate",
      color: "from-amber-600/80 to-amber-800/80"
    },
    { 
      id: 'agriculture', 
      src: '/images/heroagri.webp', 
      label_fr: "Agriculture", 
      label_en: "Agriculture",
      link: "/agriculture",
      color: "from-emerald-600/80 to-emerald-800/80"
    },
    { 
      id: 'livestock', 
      src: '/images/lifstock.jfif', 
      label_fr: "Élevage", 
      label_en: "Livestock",
      link: "/agriculture/livestock",
      color: "from-teal-600/80 to-teal-800/80"
    }
  ];

  const getLabel = (img) => currentLang === 'fr' ? img.label_fr : img.label_en;

  // Rotation des images (carrousel circulaire)
  const rotateLeft = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const rotateRight = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  // Obtenir les indices avec effet de profondeur
  const getImagePosition = (index) => {
    const diff = (index - activeIndex + images.length) % images.length;
    if (diff === 0) return 'center';
    if (diff === 1 || diff === - (images.length - 1)) return 'right';
    if (diff === 2 || diff === - (images.length - 2)) return 'far-right';
    if (diff === images.length - 1 || diff === -1) return 'left';
    if (diff === images.length - 2 || diff === -2) return 'far-left';
    return 'hidden';
  };

  return (
    <section id="hero-section" className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 py-20 lg:py-28 lg:px-20 overflow-hidden bg-gradient-to-br from-white via-[#fafaf9] to-[#f5f4f0]">
      
      {/* --- BACKGROUND PATTERN --- */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#c8a84b] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1a4731] rounded-full blur-[120px]" />
      </div>

      {/* --- LEFT CONTENT --- */}
      <div className="relative z-20 flex-1 max-w-xl text-center lg:text-left pt-12 lg:pt-0 mb-12 lg:mb-0">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm mb-6 lg:mb-8">
          <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: gold }} />
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{t.badge}</span>
        </div>

        {/* Titre */}
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-serif text-slate-900 leading-[1.1] lg:leading-[1.05] mb-6 lg:mb-8 tracking-tighter">
          {t.title}{' '}
          <span className="italic font-light relative inline-block" style={{ color: gold }}>
            {t.titleHighlight}
            <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
              <path d="M0 2 L200 2" stroke={gold} strokeWidth="2" strokeDasharray="6 4" />
            </svg>
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-base md:text-xl text-slate-600 mb-10 lg:mb-12 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
          {t.description} <span className="text-slate-900 font-semibold">{t.realEstate}</span>, 
          {t.agriculture} <span className="text-slate-900 font-semibold">{t.agriculture}</span>, {t.and}
          <span className="text-slate-900 font-semibold"> {t.livestock}</span> {t.atCameroon}
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
          <Link 
            to="/real-estate" 
            className="w-full sm:w-auto group relative px-8 py-4 bg-slate-900 text-white overflow-hidden shadow-xl rounded-full text-center transition-all hover:scale-105"
          >
            <span className="relative z-10 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
              {t.exploreAssets} <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          
          <Link 
            to="/agriculture" 
            className="flex items-center gap-3 py-3 px-5 font-bold uppercase text-[10px] tracking-widest text-slate-700 hover:text-slate-900 transition-colors group"
          >
            <Landmark size={16} className="group-hover:rotate-12 transition-transform" /> 
            {t.ourLegacy}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200 max-w-md mx-auto lg:mx-0">
          <div className="text-center lg:text-left">
            <p className="text-2xl font-bold text-slate-900">100%</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">{t.securedTitles}</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-2xl font-bold text-slate-900">500+</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">{t.hectares}</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-2xl font-bold text-slate-900">24/7</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">{t.liveDashboard}</p>
          </div>
        </div>
      </div>

      {/* --- RIGHT CONTENT WITH 3D CAROUSEL --- */}
      <div className="flex-1 relative w-full flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
        
        {/* Flèche gauche */}
        <button
          onClick={rotateLeft}
          className="absolute left-0 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-slate-600 hover:bg-amber-500 hover:text-white transition-all duration-300"
          aria-label="Previous"
        >
          <ChevronRight size={20} className="rotate-180" />
        </button>

        {/* Container des images en 3D */}
        <div className="relative w-full max-w-[500px] h-[400px] md:h-[500px] flex items-center justify-center">
          {images.map((img, idx) => {
            const position = getImagePosition(idx);
            
            // Styles selon la position
            const positionStyles = {
              center: {
                zIndex: 30,
                scale: 1,
                x: 0,
                y: 0,
                opacity: 1,
                width: '280px',
                height: '380px',
                filter: 'brightness(1)',
                ring: true
              },
              left: {
                zIndex: 20,
                scale: 0.85,
                x: '-120%',
                y: '20px',
                opacity: 0.7,
                width: '220px',
                height: '300px',
                filter: 'brightness(0.7)',
                ring: false
              },
              right: {
                zIndex: 20,
                scale: 0.85,
                x: '120%',
                y: '20px',
                opacity: 0.7,
                width: '220px',
                height: '300px',
                filter: 'brightness(0.7)',
                ring: false
              },
              'far-left': {
                zIndex: 10,
                scale: 0.7,
                x: '-220%',
                y: '40px',
                opacity: 0.4,
                width: '180px',
                height: '250px',
                filter: 'brightness(0.5)',
                ring: false
              },
              'far-right': {
                zIndex: 10,
                scale: 0.7,
                x: '220%',
                y: '40px',
                opacity: 0.4,
                width: '180px',
                height: '250px',
                filter: 'brightness(0.5)',
                ring: false
              },
              hidden: {
                zIndex: 0,
                scale: 0.5,
                x: '300%',
                opacity: 0,
                width: '0px',
                height: '0px'
              }
            };

            const style = positionStyles[position] || positionStyles.hidden;

            if (position === 'hidden') return null;

            return (
              <Link
                key={img.id}
                to={`${img.link}${currentLang === 'en' ? '?lang=en' : ''}`}
                className={`absolute transition-all duration-500 ease-out cursor-pointer group block ${
                  position === 'center' ? 'hover:scale-105' : 'hover:scale-90'
                }`}
                style={{
                  zIndex: style.zIndex,
                  transform: `translateX(${style.x}) translateY(${style.y}) scale(${style.scale})`,
                  opacity: style.opacity,
                  width: style.width,
                  height: style.height,
                  filter: style.filter
                }}
                onMouseEnter={() => setHoveredImage(img.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={img.src} 
                    alt={img.label_fr}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${img.color} opacity-60 group-hover:opacity-40 transition-opacity`} />
                  
                  {/* Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`bg-black/70 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-white/20 transform transition-all duration-300 ${
                      hoveredImage === img.id ? 'scale-110' : ''
                    }`}>
                      <p className="text-white text-sm md:text-base font-bold uppercase tracking-wider">
                        {getLabel(img)}
                      </p>
                    </div>
                  </div>

                  {/* Indicateur de lien */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Flèche droite */}
        <button
          onClick={rotateRight}
          className="absolute right-0 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-slate-600 hover:bg-amber-500 hover:text-white transition-all duration-300"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>

        {/* --- CAPEF BADGE CENTRAL --- */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-40">
          <Link 
            to={`/agriculture/institutional-framework${currentLang === 'en' ? '?lang=en' : ''}`}
            className="group flex items-center gap-3 bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-2xl border border-slate-100 transition-all duration-300 hover:shadow-lg hover:border-[#c8a84b]/40 hover:-translate-y-1"
          >
            <div 
              className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110" 
              style={{ backgroundColor: green }}
            >
              <ShieldCheck size={18} className="md:w-5 md:h-5" style={{ color: gold }} />
            </div>
            <div className="pr-2">
              <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                {t.officialPartner}
              </p>
              <div className="flex items-center gap-1">
                <p className="text-[10px] md:text-xs font-serif font-bold text-slate-800 italic">
                  {t.capefCertified}
                </p>
                <ArrowUpRight size={10} className="text-[#c8a84b] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;