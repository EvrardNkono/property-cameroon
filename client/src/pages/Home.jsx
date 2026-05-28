import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';

// Nouveaux composants modulables
import RealEstateCarousel from '../components/home/RealEstateCarousel';
import AgricultureCarousel from '../components/home/AgricultureCarousel';
import InvestmentGrid from '../components/home/InvestmentGrid';
import QuoteSection from '../components/home/QuoteSection';

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

const Home = () => {
  const currentLang = useCurrentLang();

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Sourcing Banner
      sourcingBadge: "Nouveau : Approvisionnement direct depuis",
      cantonShenzhen: "Canton & Shenzhen",
      sourcingActive: "maintenant actif",
      discoverGlobalSupply: "Découvrez notre chaîne d'approvisionnement mondiale",
      
      // CTA Section
      institutionalContact: "Contact Institutionnel",
      ctaTitle: "Prêt à sécuriser votre",
      ctaTitleHighlight: "patrimoine",
      ctaTitleEnd: "au Cameroun ?",
      ctaDescription: "Planifiez une consultation privée avec nos experts à Yaoundé ou Paris pour discuter de vos projets immobiliers et agricoles.",
      bookAppointment: "Prendre rendez-vous",
      yaounde: "Yaoundé • Bastos",
      paris: "Paris • Melun",
      
      // Quote
      quoteAuthor: "Aristote"
    },
    en: {
      // Sourcing Banner
      sourcingBadge: "New: Direct Sourcing from",
      cantonShenzhen: "Canton & Shenzhen",
      sourcingActive: "now active",
      discoverGlobalSupply: "Discover our Global Supply Chain",
      
      // CTA Section
      institutionalContact: "Institutional Contact",
      ctaTitle: "Ready to secure your",
      ctaTitleHighlight: "heritage",
      ctaTitleEnd: "in Cameroon?",
      ctaDescription: "Schedule a private consultation with our experts in Yaoundé or Paris to discuss your real estate and agricultural projects.",
      bookAppointment: "Book an Appointment",
      yaounde: "Yaoundé • Bastos",
      paris: "Paris • Melun",
      
      // Quote
      quoteAuthor: "Aristotle"
    }
  }[currentLang] || {
    // Fallback français
    sourcingBadge: "Nouveau : Approvisionnement direct depuis",
    cantonShenzhen: "Canton & Shenzhen",
    sourcingActive: "maintenant actif",
    discoverGlobalSupply: "Découvrez notre chaîne d'approvisionnement mondiale",
    institutionalContact: "Contact Institutionnel",
    ctaTitle: "Prêt à sécuriser votre",
    ctaTitleHighlight: "patrimoine",
    ctaTitleEnd: "au Cameroun ?",
    ctaDescription: "Planifiez une consultation privée avec nos experts à Yaoundé ou Paris pour discuter de vos projets immobiliers et agricoles.",
    bookAppointment: "Prendre rendez-vous",
    yaounde: "Yaoundé • Bastos",
    paris: "Paris • Melun",
    quoteAuthor: "Aristote"
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />

        {/* --- TEASER SOURCING GLOBAL --- */}
        <div className="bg-slate-50 border-y border-slate-100 py-4">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pc-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pc-gold"></span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                {t.sourcingBadge} <span className="text-pc-green font-bold">{t.cantonShenzhen}</span> {t.sourcingActive}
              </p>
            </div>
            
            <Link 
              to="/global-sourcing" 
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-pc-green hover:text-pc-gold transition-colors"
            >
              {t.discoverGlobalSupply}
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
        {/* ------------------------------ */}

        <StatsBar />

        {/* Sections de présentation des services */}
        <RealEstateCarousel />
        <AgricultureCarousel />
        <InvestmentGrid />

        {/* --- SECTION CALL-TO-ACTION --- */}
        <section className="py-24 bg-pc-green relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-pc-gold/5 -skew-x-12 transform translate-x-20"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.5em] mb-6 font-black">
              {t.institutionalContact}
            </span>
            
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 max-w-3xl leading-tight">
              {t.ctaTitle} <span className="italic">{t.ctaTitleHighlight}</span> {t.ctaTitleEnd}
            </h2>
            
            <p className="text-white/60 text-sm md:text-base max-w-xl mb-12 font-light leading-relaxed">
              {t.ctaDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Link to="/book-appointment">
                <button className="bg-pc-gold hover:bg-white text-pc-green px-10 py-4 rounded-sm transition-all duration-500 uppercase text-[11px] font-black tracking-[0.2em] shadow-2xl">
                  {t.bookAppointment}
                </button>
              </Link>
              
              <div className="flex flex-col items-start sm:items-start text-[10px] text-white/40 uppercase tracking-widest gap-1 border-l border-white/10 pl-6">
                <span>{t.yaounde}</span>
                <span>{t.paris}</span>
              </div>
            </div>
          </div>
        </section>
        
        <QuoteSection 
          text="L'excellence n'est pas un acte, c'est une habitude." 
          author={t.quoteAuthor}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Home;