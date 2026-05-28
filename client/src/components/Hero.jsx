import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Landmark } from 'lucide-react';

const Hero = () => {
  const gold = '#c8a84b';
  const green = '#1a4731';

  // Images disponibles initiales avec liens
  const initialImages = [
    { id: 'img0', src: '/images/heroimo.webp', label: 'Real Estate', alt: 'Real Estate', link: '/real-estate' },
    { id: 'img1', src: '/images/heroagri.webp', label: 'Agriculture', alt: 'Agriculture', link: '/agriculture' },
    { id: 'img2', src: '/images/lifstock.jfif', label: 'Livestock', alt: 'Livestock', link: '/agriculture/livestock' }
  ];

  const [displayImages, setDisplayImages] = useState(initialImages);
  const [isVisible, setIsVisible] = useState({
    badge: false,
    title: false,
    description: false,
    buttons: false,
    stats: false
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [swapDirection, setSwapDirection] = useState(null);

  // Observer pour les animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(prev => ({ ...prev, badge: true })), 100);
            setTimeout(() => setIsVisible(prev => ({ ...prev, title: true })), 300);
            setTimeout(() => setIsVisible(prev => ({ ...prev, description: true })), 500);
            setTimeout(() => setIsVisible(prev => ({ ...prev, buttons: true })), 700);
            setTimeout(() => setIsVisible(prev => ({ ...prev, stats: true })), 900);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('hero-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Fonction de swap avec animation CSS
  const handleSwap = (clickedIndex) => {
    if (clickedIndex === 0 || isAnimating) return;

    setIsAnimating(true);
    const direction = clickedIndex === 1 ? 'right' : 'left';
    setSwapDirection(direction);

    setTimeout(() => {
      const updated = [...displayImages];
      const temp = updated[0];
      updated[0] = updated[clickedIndex];
      updated[clickedIndex] = temp;
      setDisplayImages(updated);
      setSwapDirection(null);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  return (
    <section id="hero-section" className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 py-20 lg:py-28 lg:px-20 overflow-hidden bg-gradient-to-br from-white via-[#fafaf9] to-[#f5f4f0]">
      
      {/* --- BACKGROUND PATTERN --- */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#c8a84b] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1a4731] rounded-full blur-[120px]" />
      </div>

      {/* --- LEFT CONTENT --- */}
      <div className="relative z-20 flex-1 max-w-2xl text-center lg:text-left pt-12 lg:pt-0 mb-12 lg:mb-0">
        {/* Badge avec animation CSS */}
        <div 
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm mb-6 lg:mb-8 transition-all duration-700 ${
            isVisible.badge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: gold }} />
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Premier Investment Gateway</span>
        </div>

        {/* Titre avec animation CSS */}
        <h1 
          className={`text-5xl md:text-7xl lg:text-[80px] font-serif text-slate-900 leading-[1.1] lg:leading-[1.05] mb-6 lg:mb-8 tracking-tighter transition-all duration-700 ${
            isVisible.title ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          Secure Your{' '}
          <span className="italic font-light relative inline-block" style={{ color: gold }}>
            Future Wealth.
            <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 2 L200 2" stroke={gold} strokeWidth="2" strokeDasharray="6 4" />
            </svg>
          </span>
        </h1>
        
        {/* Description avec animation CSS */}
        <p 
          className={`text-base md:text-xl text-slate-600 mb-10 lg:mb-12 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed transition-all duration-700 delay-200 ${
            isVisible.description ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Exclusive access to certified <span className="text-slate-900 font-semibold">Real Estate</span>, 
          prosperous <span className="text-slate-900 font-semibold">Agriculture</span>, and 
          <span className="text-slate-900 font-semibold"> Livestock</span> sectors in Cameroon.
        </p>

        {/* Boutons avec animation CSS */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6 transition-all duration-700 delay-300 ${
            isVisible.buttons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link 
            to="/real-estate" 
            className="w-full sm:w-auto group relative px-8 py-4 bg-slate-900 text-white overflow-hidden shadow-xl rounded-full text-center transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
              Explore Assets <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          
          <Link 
            to="/agriculture" 
            className="flex items-center gap-3 py-3 px-5 font-bold uppercase text-[10px] tracking-widest text-slate-700 hover:text-slate-900 transition-colors group"
          >
            <Landmark size={16} className="group-hover:rotate-12 transition-transform" /> 
            Our Legacy
          </Link>
        </div>

        {/* Stats avec animation CSS */}
        <div 
          className={`grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200 max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-500 ${
            isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center lg:text-left">
            <p className="text-2xl font-bold text-slate-900">100%</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">Secured Titles</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-2xl font-bold text-slate-900">500+</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">Hectares</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-2xl font-bold text-slate-900">24/7</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">Live Dashboard</p>
          </div>
        </div>
      </div>

      {/* --- RIGHT CONTENT WITH IMAGES --- */}
      <div className="flex-1 relative w-full flex items-center justify-center lg:justify-end">
        <div className="relative w-full max-w-[450px] md:max-w-[550px] aspect-[4/3]">
          
          {/* --- 1. IMAGE PRINCIPALE (Centre) - CLICKABLE --- */}
          <Link 
            to={displayImages[0].link}
            className={`absolute inset-0 z-10 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group transition-all duration-300 ${
              swapDirection === 'right' ? 'animate-slide-out-left' : 
              swapDirection === 'left' ? 'animate-slide-out-right' : 'animate-slide-in'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleSwap(0);
            }}
            style={{ transition: 'transform 0.3s ease-out' }}
          >
            <img 
              src={displayImages[0].src} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt={displayImages[0].alt} 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            
            {/* Badge centré */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/75 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/10 transition-all duration-300 group-hover:scale-105">
                <p className="text-white text-[11px] font-bold uppercase tracking-widest">{displayImages[0].label}</p>
              </div>
            </div>
          </Link>

          {/* --- 2. IMAGE SECONDAIRE (Haut Droite) - CLICKABLE --- */}
          <Link 
            to={displayImages[1].link}
            className="absolute z-20 -top-6 -right-4 md:-top-10 md:-right-8 w-32 md:w-44 rounded-xl overflow-hidden shadow-xl aspect-square cursor-pointer group animate-float-slow"
            onClick={(e) => {
              e.stopPropagation();
              handleSwap(1);
            }}
          >
            <img src={displayImages[1].src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={displayImages[1].alt} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md transition-all duration-300 group-hover:bg-amber-500/80">
              <p className="text-white text-[8px] font-bold uppercase tracking-wider">{displayImages[1].label}</p>
            </div>
          </Link>

          {/* --- 3. IMAGE TERTIAIRE (Bas Gauche) - CLICKABLE --- */}
          <Link 
            to={displayImages[2].link}
            className="absolute z-20 -bottom-6 -left-4 md:-bottom-10 md:-left-8 w-28 md:w-36 rounded-xl overflow-hidden shadow-xl aspect-square cursor-pointer group animate-float-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleSwap(2);
            }}
          >
            <img src={displayImages[2].src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={displayImages[2].alt} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md transition-all duration-300 group-hover:bg-amber-500/80">
              <p className="text-white text-[8px] font-bold uppercase tracking-wider">{displayImages[2].label}</p>
            </div>
          </Link>

          {/* --- CAPEF BADGE - CENTRAL (entre les 3 images) --- */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-30">
            <Link 
              to="/agriculture/institutional-framework" 
              className="group flex items-center gap-3 bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-2xl border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-[#c8a84b]/40 hover:scale-105"
            >
              <div 
                className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110" 
                style={{ backgroundColor: green }}
              >
                <ShieldCheck size={18} className="md:w-5 md:h-5" style={{ color: gold }} />
              </div>
              <div className="pr-2">
                <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                  Official Partner
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-[10px] md:text-xs font-serif font-bold text-slate-800 italic">
                    CAPEF Certified
                  </p>
                  <ArrowUpRight size={10} className="text-[#c8a84b] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* --- STYLES CSS POUR LES ANIMATIONS --- */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(6px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(4px); }
        }
        
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(0); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 7s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        
        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-out forwards;
        }
        
        .animate-slide-out-right {
          animation: slideOutRight 0.3s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;