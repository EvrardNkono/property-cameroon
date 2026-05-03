import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, X, ShoppingBag, ArrowRight, Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const gold = '#c8a84b';
  const cartCount = 3;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Real Estate', path: '/real-estate' },
    { name: 'Sourcing', path: '/global-sourcing' },
  ];

  const agriLinks = [
    { name: 'Overview', path: '/agriculture/overview' },
    { name: 'Livestock', path: '/agriculture/livestock' },
    { name: 'Marketplace', path: '/agriculture/marketplace' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-700 ${
      isScrolled ? 'py-4' : 'py-8'
    }`}>
      <div className={`mx-auto transition-all duration-700 px-6 ${
        isScrolled ? 'max-w-[90%] lg:max-w-[1100px]' : 'max-w-[1440px]'
      }`}>
        <div className={`relative flex justify-between items-center transition-all duration-700 px-8 ${
          isScrolled 
            ? 'bg-white/70 backdrop-blur-2xl py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#c8a84b]/20' 
            : 'bg-transparent py-0'
        }`}>
          
          {isScrolled && (
            <div className="absolute inset-0 rounded-full opacity-10 pointer-events-none" 
                 style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
          )}
          
          {/* LOGO */}
          <Link to="/" className="relative z-10 flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center transition-transform group-hover:rotate-6">
               <img src="/images/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-[0.2em] text-slate-950 uppercase leading-none">Property</span>
              <span className="text-[10px] font-serif italic" style={{ color: gold }}>Cameroon</span>
            </div>
          </Link>
          
          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center space-x-12 relative z-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="relative text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 hover:text-slate-950 transition-colors group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full" style={{ backgroundColor: gold }} />
              </Link>
            ))}

            {/* DROPDOWN AGRICULTURE (DESKTOP) */}
            <div className="relative group">
              <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-1 group-hover:text-slate-950 transition-colors">
                Agriculture <ChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500">
                <div className="bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-6 w-64">
                  <div className="flex flex-col gap-2">
                    {agriLinks.map((item) => (
                      <Link 
                        key={item.name}
                        to={item.path} 
                        className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 text-slate-500 hover:text-slate-950 transition-all text-[11px] font-bold uppercase tracking-widest group/item"
                      >
                        {item.name} <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative cursor-pointer group p-2">
              <ShoppingBag className="w-5 h-5 text-slate-950 transition-transform group-hover:-rotate-12" strokeWidth={1.5} />
              <span className="absolute top-0 right-0 bg-slate-950 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </div>

            <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-slate-950">
              <Menu size={24} strokeWidth={1.5} />
            </button>

            <Link to="/contact" className="hidden lg:block px-6 py-3 bg-slate-950 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/20">
              Contact Expert
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/98 backdrop-blur-2xl z-[200] flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Menu</span>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-10">
              {/* Liens Directs */}
              {['Real Estate', 'Sourcing', 'Journal'].map((name) => (
                <Link key={name} to={`/${name.toLowerCase().replace(' ', '-')}`} onClick={() => setIsOpen(false)}
                      className="text-4xl font-serif italic text-slate-900">
                  {name}
                </Link>
              ))}

              {/* Section Agriculture (Mobile) */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black tracking-widest text-pc-gold uppercase" style={{ color: gold }}>Agriculture</span>
                <div className="flex flex-col gap-4 pl-4 border-l border-slate-100">
                  {agriLinks.map((sub) => (
                    <Link key={sub.name} to={sub.path} onClick={() => setIsOpen(false)}
                          className="text-2xl font-serif text-slate-600 italic hover:text-slate-950">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="mt-12 pt-10 border-t border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Official Partner</p>
               <div className="flex items-center gap-4 text-slate-900 font-serif italic text-xl">
                  <Shield style={{ color: gold }} /> CAPEF Certified
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;