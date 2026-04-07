import React from 'react';
import { Link } from 'react-router-dom'; // Import important

const Hero = () => (
  <section className="relative pt-24 md:pt-32 pb-16 px-6 lg:px-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 overflow-hidden bg-slate-50/30">
    
    {/* Connection Gradient */}
    <div className="absolute top-0 left-0 w-full h-32 md:h-40 bg-gradient-to-b from-white to-transparent -z-10"></div>

    <div className="flex-1 z-10 text-center lg:text-left">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-slate-900 leading-tight mb-6 md:mb-8">
        Land as a <br className="hidden md:block" /> 
        <span className="text-pc-gold italic">legacy</span> & <span className="text-pc-green italic font-light">heritage.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
        Real Estate Excellence <span className="text-pc-gold">●</span> Agricultural Future <span className="text-pc-green">●</span> Land Security.
      </p>

      {/* Responsive Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <Link to="/real-estate" className="w-full sm:w-auto bg-pc-gold text-white px-8 py-4 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-slate-900 transition shadow-lg shadow-pc-gold/20 text-center">
          Explore Real Estate
        </Link>
        <Link to="/agriculture" className="w-full sm:w-auto bg-pc-green text-white px-8 py-4 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-slate-900 transition shadow-lg shadow-pc-green/20 text-center">
          Discover Agriculture
        </Link>
      </div>
    </div>

    {/* Visual Grid */}
    <div className="flex-1 relative w-full z-10 max-w-2xl mx-auto lg:max-w-none">
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-2xl bg-white">
        
        {/* REAL ESTATE BLOCK */}
        <div className="h-56 md:h-72 bg-slate-200 relative group overflow-hidden">
           <img 
             src="/images/heroimo.png" 
             alt="Cameroon Real Estate" 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
           />
           <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-sm border-l-4 border-pc-gold">
              <p className="text-[8px] md:text-[9px] font-bold uppercase text-pc-gold tracking-widest">Real Estate Division</p>
           </div>
        </div>

        {/* AGRICULTURE BLOCK */}
        <div className="h-56 md:h-72 bg-pc-green/10 relative group overflow-hidden border-t-4 border-white">
           <img 
             src="/images/heroagri.png" 
             alt="Cameroon Agriculture" 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
           />
           <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-sm border-l-4 border-pc-green">
              <p className="text-[8px] md:text-[9px] font-bold uppercase text-pc-green tracking-widest">Agricultural Division</p>
           </div>
           
           {/* CAPEF Badge - TRANSFORMÉ EN LIEN */}
           <Link 
             to="/agriculture/institutional-framework" 
             className="absolute bottom-4 right-4 bg-pc-green text-white p-4 rounded-full shadow-2xl flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border-2 border-pc-gold transform hover:rotate-12 hover:scale-110 transition-all cursor-pointer z-20 group/badge"
           >
              <span className="text-[7px] md:text-[8px] font-black uppercase group-hover/badge:text-pc-gold transition-colors">CAPEF</span>
              <div className="h-[1px] w-6 bg-pc-gold my-1"></div>
              <span className="text-[7px] md:text-[8px] font-light italic">Certified</span>
           </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;