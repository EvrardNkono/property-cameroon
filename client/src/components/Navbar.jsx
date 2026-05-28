// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, X, ArrowRight, Menu, User, LogIn, LogOut, UserCircle, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// LanguageSwitcher avec son propre chargement du script
const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Charge Google Translate
  useEffect(() => {
    if (document.getElementById('google-translate-script')) {
      setIsScriptLoaded(true);
      return;
    }

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'fr,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element_hidden');
        
        setIsScriptLoaded(true);
        
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang === 'en') {
          setTimeout(() => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
              select.value = 'en';
              select.dispatchEvent(new Event('change'));
            }
          }, 500);
        }
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    if (isScriptLoaded) {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    }
    
    setIsOpen(false);
  };

  // Ajouter les styles globaux pour Google Translate
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame.skiptranslate, .goog-te-gadget, iframe.skiptranslate {
        display: none !important;
      }
      body { top: 0px !important; }
      .goog-te-combo { display: none !important; }
      
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp { animation: fadeInUp 0.2s ease-out; }
      
      .shadow-glow { box-shadow: 0 0 6px currentColor; }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all group"
      >
        <Globe size={16} className="text-slate-600 group-hover:text-emerald-600 transition-colors" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
          {currentLang === 'fr' ? 'FR' : 'EN'}
        </span>
        <ChevronDown size={10} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-48 rounded-2xl overflow-hidden z-50 bg-white shadow-2xl border border-slate-100 animate-fadeInUp">
            <button
              onClick={() => changeLanguage('fr')}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                currentLang === 'fr' 
                  ? 'bg-gradient-to-r from-emerald-50 to-transparent' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">🇫🇷</span>
              <div className="flex-1 text-left">
                <div className={`text-xs font-semibold ${currentLang === 'fr' ? 'text-emerald-700' : 'text-gray-700'}`}>
                  Français
                </div>
              </div>
              {currentLang === 'fr' && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
            
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                currentLang === 'en' 
                  ? 'bg-gradient-to-r from-amber-50 to-transparent' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">🇬🇧</span>
              <div className="flex-1 text-left">
                <div className={`text-xs font-semibold ${currentLang === 'en' ? 'text-amber-600' : 'text-gray-700'}`}>
                  English
                </div>
              </div>
              {currentLang === 'en' && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        </>
      )}
      
      {/* Element caché pour Google Translate */}
      <div id="google_translate_element_hidden" style={{ display: 'none' }} />
    </div>
  );
};

// Reste de votre Navbar inchangé...
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const gold = '#c8a84b';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
    setIsProfileOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsProfileOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Real Estate', path: '/real-estate' },
    { name: 'Sourcing', path: '/global-sourcing' },
    { name: 'Journal', path: '/blog' },
  ];

  const agriLinks = [
    { name: 'Overview', path: '/agriculture' },
    { name: 'Livestock', path: '/agriculture/livestock' },
    { name: 'Agricultural Products', path: '/agriculture/products' },
    { name: 'Marketplace', path: '/agriculture/marketplace' },
  ];

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user?.name) return 'Account';
    if (user.name.length > 15) return user.name.substring(0, 15) + '...';
    return user.name;
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-[100] transition-all duration-700 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}>
        <div className={`mx-auto transition-all duration-700 px-4 md:px-6 ${
          isScrolled ? 'max-w-[95%] lg:max-w-[1100px]' : 'max-w-[1440px]'
        }`}>
          <div className={`relative flex justify-between items-center transition-all duration-700 px-4 md:px-8 ${
            isScrolled 
              ? 'bg-white/70 backdrop-blur-2xl py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#c8a84b]/20' 
              : 'bg-[#c8a84b]/10 backdrop-blur-md py-3 rounded-full border border-[#c8a84b]/15 shadow-md'
          }`}>
            
            {isScrolled && (
              <div className="absolute inset-0 rounded-full opacity-10 pointer-events-none" 
                   style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
            )}
            
            {/* LOGO */}
            <Link to="/" className="relative z-10 flex items-center gap-2 md:gap-3 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center transition-transform group-hover:rotate-6">
                <img src="/images/logo.png" alt="Logo" className="w-5 h-5 md:w-7 md:h-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-sm font-black tracking-[0.2em] text-slate-950 uppercase leading-none">Property</span>
                <span className="text-[8px] md:text-[10px] font-serif italic" style={{ color: gold }}>Cameroon</span>
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

              {/* DROPDOWN AGRICULTURE */}
              <div className="relative group/dropdown">
                <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-1 group-hover/dropdown:text-slate-950 transition-colors">
                  Agriculture 
                  <ChevronDown size={10} className="transition-transform duration-300 group-hover/dropdown:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:pointer-events-auto transition-all duration-300">
                  <div className="bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-6 w-64">
                    <div className="flex flex-col gap-2">
                      {agriLinks.map((item) => (
                        <Link 
                          key={item.name}
                          to={item.path} 
                          className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 text-slate-500 hover:text-slate-950 transition-all text-[11px] font-bold uppercase tracking-widest group/link"
                        >
                          {item.name} 
                          <ArrowRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* RIGHT ACTIONS - Desktop */}
            <div className="hidden lg:flex relative z-10 items-center gap-3">
              <LanguageSwitcher />

              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all group"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                        {getUserInitials()}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 hidden md:block">
                        {getDisplayName()}
                      </span>
                    </>
                  ) : (
                    <>
                      <UserCircle size={20} className="text-slate-600" />
                      <span className="text-[10px] font-bold text-slate-700 hidden md:block">Account</span>
                    </>
                  )}
                  <ChevronDown size={12} className={`text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <div 
                  className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 transition-all duration-200 origin-top-right ${
                    isProfileOpen 
                      ? 'opacity-100 visible scale-100' 
                      : 'opacity-0 invisible scale-95'
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                        <p className="text-[9px] text-slate-500 truncate">{user?.email}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user?.roles?.map(role => (
                            <span key={role} className="text-[7px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={handleDashboard}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User size={14} />
                        Dashboard
                      </button>
                      
                      <div className="h-px bg-slate-100" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LogIn size={14} />
                        Sign In
                      </button>
                      
                      <button
                        onClick={handleRegister}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                      >
                        <User size={14} />
                        Create Account
                      </button>
                    </>
                  )}
                </div>
              </div>

              <Link to="/experts" className="px-6 py-3 bg-slate-950 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/20">
                Contact Expert
              </Link>
            </div>

            {/* MOBILE ACTIONS */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher />
              <button 
                onClick={() => setIsOpen(true)} 
                className="p-2 text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Menu"
              >
                <Menu size={28} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[200] transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[201] flex flex-col p-6 overflow-y-auto shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <img src="/images/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[10px] font-black text-slate-950 uppercase">Property Cameroon</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[9px] text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-red-600 text-[10px] font-bold">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2.5 border border-emerald-600 text-emerald-700 rounded-xl text-[11px] font-bold"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
        
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className="text-2xl font-serif italic text-slate-800 hover:text-slate-950 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="flex flex-col gap-3 pt-2">
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: gold }}>Agriculture</span>
            <div className="flex flex-col gap-3 pl-4 border-l-2 border-slate-100">
              {agriLinks.map((sub) => (
                <Link 
                  key={sub.name} 
                  to={sub.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-serif text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link 
              to="/experts" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-3 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              Contact Expert
            </Link>
          </div>
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-100">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">Official Partner</p>
          <div className="flex items-center gap-2 text-slate-900 font-serif italic">
            <Shield style={{ color: gold }} size={16} /> CAPEF Certified
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;