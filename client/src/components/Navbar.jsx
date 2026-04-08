import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Simulation du nombre d'articles (à lier avec ton futur CartContext)
  const cartCount = 3;

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-pc-gold/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex justify-between items-center relative z-[101]">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            <img 
              src="/images/logo.png" 
              alt="Property Cameroon Logo" 
              className="w-full h-full object-contain transition-transform duration-700 group-hover:rotate-[5deg] group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col border-l border-slate-200 pl-4 py-1">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 leading-none">
              PROPERTY
            </span>
            <span className="text-pc-gold italic font-serif font-light text-sm md:text-base lowercase leading-none mt-1">
              Cameroon
            </span>
          </div>
        </Link>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center space-x-8 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
          <Link to="/real-estate" className="hover:text-pc-gold transition-colors relative group">
            Real Estate
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pc-gold transition-all group-hover:w-full"></span>
          </Link>
          
          <Link to="/agriculture" className="hover:text-pc-green transition-colors relative group">
            Agriculture
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pc-green transition-all group-hover:w-full"></span>
          </Link>

          {/* AJOUT SOURCING (Synchronisé avec App.js) */}
          <Link to="/global-sourcing" className="hover:text-pc-gold transition-colors relative group">
            Sourcing
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pc-gold transition-all group-hover:w-full"></span>
          </Link>

          <Link to="/agriculture/marketplace" className="hover:text-slate-900 transition-colors relative group flex items-center gap-1.5">
            <span className="w-1 h-1 bg-pc-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-slate-900 transition-all group-hover:w-full"></span>
          </Link>

          {/* CORRECTION DU LIEN INSTITUTIONNEL (Synchronisé avec App.js) */}
          <Link to="/agriculture/institutional-framework" className="hover:text-pc-green transition-colors relative group">
            Compliance
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pc-green transition-all group-hover:w-full"></span>
          </Link>
          
          <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>

          {/* DESKTOP CART */}
          <Link to="/cart" className="relative p-2 group transition-all duration-300">
            <div className="relative">
              <svg className="w-5 h-5 text-slate-900 group-hover:text-pc-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-pc-green text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in fade-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          <Link to="/dashboard" className="hover:text-pc-green transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-pc-green rounded-full animate-pulse"></span>
            Dashboard
          </Link>
          
          <button className="bg-slate-900 text-white px-8 py-3 rounded-sm hover:bg-pc-gold transition-all duration-500 shadow-sm uppercase text-[9px] tracking-widest">
            Contact Us
          </button>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex lg:hidden items-center gap-6">
          <Link to="/cart" className="relative p-2 group">
            <svg className="w-6 h-6 text-slate-900 group-hover:text-pc-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-0 w-4 h-4 bg-pc-green text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setIsOpen(true)}
            className="flex flex-col justify-center items-end w-8 h-8 space-y-1.5 group"
            aria-label="Open Menu"
          >
            <span className="block w-8 h-0.5 bg-slate-900 group-hover:bg-pc-gold transition-all"></span>
            <span className="block w-6 h-0.5 bg-pc-gold"></span>
            <span className="block w-8 h-0.5 bg-pc-green"></span>
          </button>
        </div>
      </div>

      {/* FULL SCREEN MOBILE OVERLAY */}
      <div className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-[105] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center z-[110]"
        >
          <div className="relative w-6 h-6">
            <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-slate-900 rotate-45"></span>
            <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-slate-900 -rotate-45"></span>
          </div>
        </button>

        <div className="flex flex-col items-center justify-center h-full w-full space-y-8 px-8">
          <div className="flex flex-col items-center gap-4">
            <img src="/images/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
            <div className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              PROPERTY<span className="text-pc-gold italic font-serif font-light ml-1">Cameroon</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6 w-full text-center">
            <Link to="/real-estate" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-slate-900">Real Estate</Link>
            <Link to="/agriculture" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-slate-900">Agriculture</Link>
            <Link to="/global-sourcing" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-slate-900">Sourcing</Link>
            <Link to="/agriculture/marketplace" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-pc-gold underline decoration-pc-gold/30 underline-offset-8">Marketplace</Link>
            
            {/* CORRECTION DU LIEN INSTITUTIONNEL MOBILE */}
            <Link to="/agriculture/institutional-framework" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-pc-green">Institutional Compliance</Link>
            
            <Link to="/agriculture/expertise" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-[0.3em] font-bold text-slate-900">Expertise</Link>
            
            <div className="w-12 h-[1px] bg-slate-100 my-2"></div>

            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-pc-green text-sm uppercase tracking-[0.3em] font-bold flex items-center gap-3">
              <span className="w-2 h-2 bg-pc-green rounded-full animate-pulse"></span> 
              Dashboard
            </Link>
            
            <button className="w-full max-w-xs bg-slate-900 text-white py-5 rounded-sm shadow-2xl text-[10px] uppercase tracking-[0.2em] font-bold mt-4">
              Get in Touch
            </button>
          </div>

          <div className="absolute bottom-10 text-[10px] text-slate-400 uppercase tracking-widest opacity-50 text-center px-4">
            Institutional Seriousness — 2026
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pc-gold/50 to-transparent opacity-50"></div>
    </nav>
  );
};

export default Navbar;