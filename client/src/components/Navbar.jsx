import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = 3;

  // Effet de scroll pour alléger la barre au mouvement
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md py-2 shadow-sm' : 'bg-white py-4'
    } border-b border-pc-gold/10`}>
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* LOGO SECTION - Plus aéré */}
        <Link to="/" className="flex items-center gap-6 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="hidden sm:flex flex-col tracking-[0.2em]">
            <span className="text-lg font-black text-slate-900 leading-none">PROPERTY</span>
            <span className="text-pc-gold font-serif italic text-xs lowercase">Cameroon</span>
          </div>
        </Link>
        
        {/* DESKTOP NAV - Regroupée pour respirer */}
        <div className="hidden lg:flex items-center space-x-10 text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400">
          <Link to="/real-estate" className="hover:text-pc-gold transition-colors">Real Estate</Link>
          
          {/* Menu Dropdown pour l'Agro (Évite l'effet "trop de boutons") */}
          <div className="relative group cursor-pointer py-2">
            <span className="hover:text-pc-green flex items-center gap-1">Agriculture <span className="text-[8px] opacity-50">▼</span></span>
            <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-slate-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 flex flex-col gap-4">
              <Link to="/agriculture" className="hover:text-pc-green">Overview</Link>
              <Link to="/agriculture/livestock" className="hover:text-pc-green">Livestock</Link>
              <Link to="/agriculture/institutional-framework" className="hover:text-pc-green">Compliance</Link>
            </div>
          </div>

          <Link to="/global-sourcing" className="hover:text-pc-gold transition-colors">Sourcing</Link>
          <Link to="/agriculture/marketplace" className="hover:text-slate-900 transition-colors">Shop</Link>
          
          <div className="h-4 w-[1px] bg-slate-100"></div>

          {/* Icons Group */}
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative group">
              <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-pc-green text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cartCount}</span>}
            </Link>
            
            <Link to="/dashboard" className="text-pc-green flex items-center gap-2">
              <span className="w-1 h-1 bg-pc-green rounded-full"></span> Dashboard
            </Link>
          </div>

          <button className="border border-slate-900 text-slate-900 px-6 py-3 hover:bg-slate-900 hover:text-white transition-all duration-500 text-[9px]">
            Contact
          </button>
        </div>

        {/* MOBILE TRIGGER */}
        <button onClick={() => setIsOpen(true)} className="lg:hidden flex flex-col gap-1.5 p-2">
          <span className="w-6 h-0.5 bg-slate-900"></span>
          <span className="w-4 h-0.5 bg-pc-gold self-end"></span>
        </button>
      </div>

      {/* SIDEBAR MOBILE - LUXURY RE-ORGANIZED */}
      <div className={`fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[110] transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}>
        <div 
          className={`absolute right-0 top-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 p-10 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => setIsOpen(false)} className="self-end text-slate-400 hover:text-slate-900 mb-12 uppercase text-[10px] tracking-widest">Close ✕</button>
          
          <div className="flex flex-col space-y-8">
            <div className="mb-8">
              <p className="text-[10px] text-pc-gold font-bold tracking-[0.3em] uppercase mb-2">Navigation</p>
              <div className="flex flex-col space-y-4 text-xl font-serif italic text-slate-900">
                <Link to="/real-estate" onClick={() => setIsOpen(false)}>Real Estate</Link>
                <Link to="/agriculture" onClick={() => setIsOpen(false)}>Agriculture</Link>
                <Link to="/global-sourcing" onClick={() => setIsOpen(false)}>Sourcing</Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-pc-green font-bold tracking-[0.3em] uppercase mb-4">E-Services</p>
              <div className="flex flex-col space-y-4 text-sm font-bold uppercase tracking-widest text-slate-500">
                <Link to="/agriculture/marketplace" onClick={() => setIsOpen(false)}>Marketplace</Link>
                <Link to="/agriculture/livestock" onClick={() => setIsOpen(false)}>Livestock</Link>
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex justify-between">Cart <span>({cartCount})</span></Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-pc-green underline underline-offset-8">Dashboard</Link>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full bg-slate-900 text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold">
              Start a Project
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;