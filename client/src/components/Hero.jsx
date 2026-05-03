import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Landmark } from 'lucide-react';

const Hero = () => {
  const gold = '#c8a84b';
  const green = '#1a4731';

  return (
    <section className="relative min-h-fit lg:min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:py-28 lg:px-24 overflow-hidden bg-[#fafaf9]">
      
      {/* --- BACKGROUND TEXTURE --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a4731' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      {/* --- LEFT CONTENT --- */}
      <div className="relative z-20 flex-1 max-w-2xl text-center lg:text-left pt-12 lg:pt-0 mb-10 lg:mb-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm mb-6 lg:mb-8"
        >
          <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: gold }} />
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Premium Investment Hub</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-7xl lg:text-[85px] font-serif text-slate-950 leading-[1.1] lg:leading-[0.9] mb-6 lg:mb-8 tracking-tighter"
        >
          Secure Your <br className="hidden md:block" />
          <span className="italic font-light" style={{ color: gold }}>Future Wealth.</span>
        </motion.h1>
        
        <motion.p 
          className="text-sm md:text-xl text-slate-600 mb-8 lg:mb-10 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed"
        >
          Exclusive access to certified <span className="text-slate-900 font-semibold italic">Real Estate</span> and 
          prosperous <span className="text-slate-900 font-semibold italic">Agricultural</span> sectors in Cameroon.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
          <Link to="/real-estate" className="w-full sm:w-auto group relative px-8 py-4 lg:py-5 bg-slate-950 text-white overflow-hidden shadow-xl text-center">
            <span className="relative z-10 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
              Get Started <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link to="/agriculture" className="flex items-center gap-3 py-2 px-4 font-bold uppercase text-[10px] tracking-widest text-slate-800">
            <Landmark size={16} /> Our Legacy
          </Link>
        </div>
      </div>

      {/* --- RIGHT CONTENT: COMPACT COMPOSITION --- */}
      <div className="flex-1 relative w-full h-[380px] md:h-[500px] lg:h-[600px] flex items-center justify-center lg:ml-10">
        
        <div className="relative w-full max-w-[320px] md:max-w-[450px] aspect-square flex items-center justify-center">
            
            {/* Décorations (cachées sur très petits écrans pour gagner de l'espace) */}
            <div className="absolute inset-0 border border-slate-100 rounded-full animate-[spin_60s_linear_infinite] hidden sm:block" />

            {/* 1. MAIN CIRCLE */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-20 w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden border-[6px] md:border-[8px] border-white shadow-2xl"
            >
              <img src="/images/heroimo.jfif" className="w-full h-full object-cover" alt="Real Estate" />
            </motion.div>

            {/* 2. SECOND CIRCLE */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute z-30 -top-4 -right-4 md:-top-10 md:-right-10 w-32 h-32 md:w-56 md:h-56 rounded-full overflow-hidden border-[4px] md:border-[6px] border-white shadow-xl"
            >
              <img src="/images/heroagri.jfif" className="w-full h-full object-cover" alt="Agriculture" />
            </motion.div>

            {/* 3. THIRD CIRCLE */}
            <motion.div 
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute z-10 -bottom-4 -left-4 md:-bottom-10 md:-left-10 w-28 h-28 md:w-52 md:h-52 rounded-full overflow-hidden border-[4px] border-white shadow-lg"
            >
              <img src="/images/lifstock.jfif" className="w-full h-full object-cover" alt="Livestock" />
            </motion.div>
{/* --- BOUTON DE CERTIFICATION CAPEF --- */}
<motion.div
  animate={{ x: [0, 5, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  className="absolute -bottom-8 right-0 md:bottom-10 md:right-0 z-40"
>
  <Link 
    to="/agriculture/institutional-framework" 
    className="group flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl shadow-2xl border border-slate-50 transition-all duration-300 hover:shadow-gold/20 hover:border-[#c8a84b]/30 hover:-translate-y-1"
  >
    {/* Icône avec effet de pulsation au hover */}
    <div 
      className="p-1.5 md:p-2 rounded-lg transition-colors duration-300 group-hover:bg-[#c8a84b]" 
      style={{ backgroundColor: green }}
    >
      <ShieldCheck 
        size={16} 
        className="md:w-5 md:h-5 transition-colors duration-300 group-hover:text-white" 
        style={{ color: gold }} 
      />
    </div>

    {/* Texte informatif */}
    <div className="pr-2">
      <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-tighter">
        Official Partner
      </p>
      <div className="flex items-center gap-1">
        <p className="text-[10px] md:text-xs font-serif font-bold text-slate-900 italic">
          About CAPEF
        </p>
        <ArrowUpRight size={10} className="text-[#c8a84b] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
      </div>
    </div>

    {/* Effet de reflet brillant au survol */}
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
  </Link>
</motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;