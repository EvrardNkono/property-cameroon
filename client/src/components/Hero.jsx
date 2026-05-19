import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Landmark } from 'lucide-react';

const Hero = () => {
  const gold = '#c8a84b';
  const green = '#1a4731';

  // Images disponibles initiales
  const initialImages = [
    { id: 'img0', src: '/images/heroimo.jfif', label: 'Real Estate', alt: 'Real Estate' },
    { id: 'img1', src: '/images/heroagri.jfif', label: 'Agriculture', alt: 'Agriculture' },
    { id: 'img2', src: '/images/lifstock.jfif', label: 'Livestock', alt: 'Livestock' }
  ];

  // Gestion propre des positions par état (Centre, Haut Droite, Bas Gauche)
  const [displayImages, setDisplayImages] = useState(initialImages);

  // Fonction de swap purement React : On passe l'image cliquée au premier index (index 0 = Centre)
  const handleSwap = (clickedIndex) => {
    if (clickedIndex === 0) return; // Déjà au centre

    const updated = [...displayImages];
    // Échange standard de tableau
    const temp = updated[0];
    updated[0] = updated[clickedIndex];
    updated[clickedIndex] = temp;

    setDisplayImages(updated);
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 py-20 lg:py-28 lg:px-20 overflow-hidden bg-gradient-to-br from-white via-[#fafaf9] to-[#f5f4f0]">
      
      {/* --- BACKGROUND PATTERN --- */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#c8a84b] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1a4731] rounded-full blur-[120px]" />
      </div>

      {/* --- LEFT CONTENT --- */}
      <div className="relative z-20 flex-1 max-w-2xl text-center lg:text-left pt-12 lg:pt-0 mb-12 lg:mb-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm mb-6 lg:mb-8"
        >
          <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: gold }} />
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Premier Investment Gateway</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-7xl lg:text-[80px] font-serif text-slate-900 leading-[1.1] lg:leading-[1.05] mb-6 lg:mb-8 tracking-tighter"
        >
          Secure Your{' '}
          <span className="italic font-light relative inline-block" style={{ color: gold }}>
            Future Wealth.
            <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 2 L200 2" stroke={gold} strokeWidth="2" strokeDasharray="6 4" />
            </svg>
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-xl text-slate-600 mb-10 lg:mb-12 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed"
        >
          Exclusive access to certified <span className="text-slate-900 font-semibold">Real Estate</span>, 
          prosperous <span className="text-slate-900 font-semibold">Agriculture</span>, and 
          <span className="text-slate-900 font-semibold"> Livestock</span> sectors in Cameroon.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
          <Link 
            to="/real-estate" 
            className="w-full sm:w-auto group relative px-8 py-4 bg-slate-900 text-white overflow-hidden shadow-xl rounded-full text-center transition-all hover:scale-105"
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

        {/* Stats miniatures */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200 max-w-md mx-auto lg:mx-0"
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
        </motion.div>
      </div>

      {/* --- RIGHT CONTENT WITH IMAGES --- */}
      <div className="flex-1 relative w-full flex items-center justify-center lg:justify-end">
        <div className="relative w-full max-w-[450px] md:max-w-[550px] aspect-[4/3]">
          
          {/* AnimatePresence pour animer fluidement les transitions lors des changements de place */}
          <AnimatePresence mode="popLayout">
            
            {/* --- 1. IMAGE PRINCIPALE (Centre) - z-10 (Dessous les autres) --- */}
            <motion.div 
              key={displayImages[0].id}
              layoutId={displayImages[0].id}
              className="absolute inset-0 z-10 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => handleSwap(0)}
            >
              <img src={displayImages[0].src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={displayImages[0].alt} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              
              {/* REPOSITIONNÉ : Badge de l'image centrale parfaitement centré au milieu de sa carte */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/75 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/10">
                  <p className="text-white text-[11px] font-bold uppercase tracking-widest">{displayImages[0].label}</p>
                </div>
              </div>
            </motion.div>

            {/* --- 2. IMAGE SECONDAIRE (Haut Droite) - z-20 (Au-dessus) --- */}
            <motion.div 
              key={displayImages[1].id}
              layoutId={displayImages[1].id}
              animate={{ y: [0, -10, 0] }}
              transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 } }}
              className="absolute z-20 -top-6 -right-4 md:-top-10 md:-right-8 w-32 md:w-44 rounded-xl overflow-hidden shadow-xl aspect-square cursor-pointer group"
              onClick={() => handleSwap(1)}
            >
              <img src={displayImages[1].src} className="w-full h-full object-cover" alt={displayImages[1].alt} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                <p className="text-white text-[8px] font-bold uppercase tracking-wider">{displayImages[1].label}</p>
              </div>
            </motion.div>

            {/* --- 3. IMAGE TERTIAIRE (Bas Gauche) - z-20 (Maintenant AU-DESSUS) --- */}
            <motion.div 
              key={displayImages[2].id}
              layoutId={displayImages[2].id}
              animate={{ x: [0, 6, 0] }}
              transition={{ x: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
              className="absolute z-20 -bottom-6 -left-4 md:-bottom-10 md:-left-8 w-28 md:w-36 rounded-xl overflow-hidden shadow-xl aspect-square cursor-pointer group"
              onClick={() => handleSwap(2)}
            >
              <img src={displayImages[2].src} className="w-full h-full object-cover" alt={displayImages[2].alt} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                <p className="text-white text-[8px] font-bold uppercase tracking-wider">{displayImages[2].label}</p>
              </div>
            </motion.div>

          </AnimatePresence>

          {/* --- CAPEF BADGE (Bottom Right) --- */}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 right-0 md:-bottom-6 md:right-0 z-30"
          >
            <Link 
              to="/agriculture/institutional-framework" 
              className="group flex items-center gap-3 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 transition-all duration-300 hover:shadow-lg hover:border-[#c8a84b]/40 hover:-translate-y-1"
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
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;