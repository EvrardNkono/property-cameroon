import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

const Hero = () => {
  // Couleurs basées sur tes variables
  const gold = '#c8a84b';
  const green = '#1a4731';
  const terracotta = '#E2725B';

  return (
    <section className="relative pt-24 md:pt-40 pb-20 px-6 lg:px-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-hidden bg-[#fcfdfc]">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -z-10 skew-x-12 transform translate-x-20" />

      {/* --- TEXT CONTENT --- */}
      <div className="flex-1 z-10 text-center lg:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Expertise Multisectorielle</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 leading-[0.9] mb-8 italic">
          Land, Wealth <br /> 
          <span style={{ color: gold }}>& Legacy.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
          De la pierre à la terre, nous sécurisons vos investissements au Cameroun : 
          <span className="font-bold text-slate-800"> Immobilier</span>, 
          <span className="font-bold text-slate-800"> Agriculture </span> 
          et <span className="font-bold text-slate-800"> Livestock</span>.
        </p>

        {/* Action Buttons Triptyque */}
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <Link to="/real-estate" className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-none font-bold uppercase text-[10px] tracking-widest hover:bg-[#E2725B] transition-all">
            Real Estate <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
          </Link>
          <Link to="/agriculture" className="group flex items-center gap-3 bg-white border border-slate-200 text-slate-900 px-8 py-5 rounded-none font-bold uppercase text-[10px] tracking-widest hover:border-green-800 transition-all">
            Agri & Livestock
          </Link>
        </div>
      </div>

      {/* --- VISUAL GRID (THE TRIPTYCH) --- */}
      <div className="flex-1 relative w-full z-10 max-w-2xl mx-auto lg:max-w-none">
        <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[500px] md:h-[650px]">
          
          {/* 1. IMMOBILIER (Large Top) */}
          <div className="col-span-12 row-span-1 relative group overflow-hidden rounded-3xl shadow-xl">
            <img 
              src="/images/heroimo.jfif" 
              alt="Real Estate" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-serif italic text-2xl">Real Estate</p>
              <div className="h-1 w-12 bg-[#c8a84b] mt-2" />
            </div>
          </div>

          {/* 2. AGRICULTURE (Small Bottom Left) */}
          <div className="col-span-6 row-span-1 relative group overflow-hidden rounded-3xl shadow-xl">
            <img 
              src="/images/heroagri.jfif" 
              alt="Agriculture" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-serif italic text-xl">Agriculture</p>
            </div>
          </div>

          {/* 3. LIVESTOCK (Small Bottom Right) */}
          <div className="col-span-6 row-span-1 relative group overflow-hidden rounded-3xl shadow-xl">
            <img 
              src="/images/lifstock.jfif" 
              alt="Livestock" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-serif italic text-xl">Livestock</p>
            </div>
          </div>

          {/* --- INFO CAPEF FLOATING BUTTON --- */}
          <Link 
            to="/agriculture/institutional-framework"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100"
            >
              <div 
                className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-[#c8a84b]"
                style={{ background: green }}
              >
                <ShieldCheck size={20} className="text-[#c8a84b] mb-1" />
                <span className="text-[10px] md:text-[11px] font-black uppercase text-white tracking-widest">Info</span>
                <span className="text-[12px] md:text-[14px] font-serif italic text-[#c8a84b]">Capef</span>
                <div className="mt-1 px-2 py-0.5 bg-white/10 rounded-full">
                  <span className="text-[6px] text-white/70 uppercase">Certifié État</span>
                </div>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default Hero;