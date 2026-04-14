import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Landmark, ChevronDown, X, ShoppingBag, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);
  const cartCount = 3;

  // Fonction de scroll personnalisée pour un mouvement organique
  const smoothScrollTo = (target, duration) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const change = target - start;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      
      // Easing function: easeInOutQuad (accélération et décélération douces)
      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      container.scrollTop = easeInOutQuad(progress, start, change, duration);

      if (progress < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation de "découverte" (Peek Scroll)
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      // 1. On attend que la sidebar finisse de glisser (700ms)
      const timer = setTimeout(() => {
        // Descente très profonde (450px) et très lente (1.5s)
        smoothScrollTo(450, 1500);

        // 2. Remontée après une pause de lecture (1s)
        setTimeout(() => {
          // Remontée un peu plus rapide pour rendre la main à l'utilisateur (1s)
          smoothScrollTo(0, 1000);
        }, 2200); // 1500ms (scroll) + 700ms (pause)
      }, 800); 

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md py-2 shadow-sm' : 'bg-white py-4'
    } border-b border-pc-gold/10`}>
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative w-9 h-9 md:w-12 md:h-12">
            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col tracking-[0.2em]">
            <span className="text-sm md:text-lg font-black text-slate-900 leading-none uppercase">Property</span>
            <span className="text-pc-gold font-serif italic text-[10px] lowercase">Cameroon</span>
          </div>
        </Link>
        
        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-10 text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400">
          <Link to="/real-estate" className="hover:text-pc-gold transition-colors">Real Estate</Link>
          <div className="relative group cursor-pointer py-2">
            <span className="hover:text-pc-green flex items-center gap-1">Agriculture <ChevronDown size={10} /></span>
          </div>
          <Link to="/global-sourcing" className="hover:text-pc-gold">Sourcing</Link>
          <Link to="/agriculture/marketplace" className="hover:text-slate-900">Shop</Link>
          <Link to="/blog" className="text-pc-gold">Journal</Link>
          <div className="flex items-center gap-6 pl-4">
             <ShoppingBag className="w-5 h-5 text-slate-900" strokeWidth={1.5} />
          </div>
        </div>

        {/* MOBILE TRIGGER */}
        <button onClick={() => setIsOpen(true)} className="lg:hidden flex flex-col gap-1.5 p-2 items-end group">
          <span className="w-8 h-[1px] bg-slate-900 transition-all group-hover:w-6"></span>
          <span className="w-5 h-[1px] bg-pc-gold"></span>
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeMenu}>
        <div 
          className={`absolute right-0 top-0 w-full md:max-w-md h-full bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 flex justify-between items-center border-b border-slate-50">
            <span className="text-xs font-black text-slate-900 tracking-[0.3em]">EXPLORE</span>
            <button onClick={closeMenu} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900">
                <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          
          {/* ZONE SCROLLABLE - On enlève scroll-smooth pour gérer l'animation en JS */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-10 py-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex flex-col space-y-20 pb-20"> 
              
              <div className="space-y-10">
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase">Core Business</p>
                <div className="flex flex-col space-y-10 text-4xl font-serif italic text-slate-900">
                  <Link to="/real-estate" onClick={closeMenu}>Real Estate</Link>
                  <Link to="/global-sourcing" onClick={closeMenu}>Global Sourcing</Link>
                  <Link to="/agriculture" onClick={closeMenu} className="text-pc-green">Agriculture</Link>
                </div>
              </div>

              <div className="bg-slate-50/70 p-8 rounded-[2.5rem] space-y-8">
                <p className="text-[10px] text-pc-green font-bold tracking-[0.4em] uppercase">Ecosystem</p>
                <div className="flex flex-col space-y-6">
                  <Link to="/agriculture/livestock" onClick={closeMenu} className="text-slate-600 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-between">
                    Livestock <span className="w-1.5 h-[1px] bg-slate-300"></span>
                  </Link>
                  <Link to="/agriculture/marketplace" onClick={closeMenu} className="text-slate-600 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-between">
                    Marketplace <span className="w-1.5 h-[1px] bg-slate-300"></span>
                  </Link>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-pc-gold/10 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-pc-gold/5 flex items-center justify-center text-pc-gold">
                        <Shield size={22} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[12px] font-black uppercase tracking-widest text-slate-900">Legal Safety</span>
                        <span className="text-[10px] text-slate-400 font-serif italic">Institutional Guarantees</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                 <div className="flex flex-col">
                    <p className="text-[10px] text-pc-gold font-bold tracking-[0.4em] uppercase mb-3">Publication</p>
                    <Link to="/blog" onClick={closeMenu} className="text-4xl font-serif italic text-slate-900">The Journal</Link>
                 </div>
                 <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-300">
                    <ArrowRight size={20}/>
                 </div>
              </div>

              <div className="border-t border-slate-100 pt-10">
                 <p className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase mb-6">Expertise</p>
                 <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <div className="p-5 bg-slate-50 rounded-2xl">INVESTMENT</div>
                    <div className="p-5 bg-slate-50 rounded-2xl">STRATEGY</div>
                 </div>
              </div>

            </div>
          </div>

          {/* Fixed Actions */}
          <div className="p-8 bg-white border-t border-slate-50 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl active:scale-[0.97] transition-all">
              Contact an Expert
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;