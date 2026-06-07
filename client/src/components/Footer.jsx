import React from 'react';
import { Link } from 'react-router-dom';

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = React.useState(() => {
    if (typeof window === 'undefined') return 'en';
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    return ['fr', 'en'].includes(finalLang) ? finalLang : 'en';
  });
  
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

const Footer = () => {
  const currentLang = useCurrentLang();

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Brand
      brandVision: "Construire un héritage, cultiver un patrimoine.",
      brandDesc: "L'excellence foncière au service de la diaspora et des investisseurs locaux.",
      
      // Real Estate Division
      realEstateDiv: "Division Immobilière",
      luxuryResidences: "Résidences de Luxe",
      landVerification: "Vérification Titre Foncier",
      siteManagement: "Gestion de Sites",
      
      // Agricultural Division
      agriDiv: "Division Agricole",
      investmentProjects: "Projets d'Investissement",
      agroMechanization: "Agro-Mécanisation",
      exportLogistics: "Export & Logistique",
      
      // Headquarters
      headquarters: "Notre Siège",
      yaounde: "Yaoundé, Cameroun",
      address: "Tongolo, en face du Centre Yannick Noah",
      bookAppointment: "Prendre RDV",
      
      // Bottom
      copyright: "Sérieux Institutionnel",
      legalMentions: "Mentions Légales",
      privacyPolicy: "Confidentialité",
      madeForExcellence: "Fait pour l'Excellence"
    },
    en: {
      // Brand
      brandVision: "Building a legacy, cultivating a heritage.",
      brandDesc: "Land excellence at the service of the diaspora and local investors.",
      
      // Real Estate Division
      realEstateDiv: "Real Estate Division",
      luxuryResidences: "Luxury Residences",
      landVerification: "Land Title Verification",
      siteManagement: "Site Management",
      
      // Agricultural Division
      agriDiv: "Agricultural Division",
      investmentProjects: "Investment Projects",
      agroMechanization: "Agro-Mechanization",
      exportLogistics: "Export & Logistics",
      
      // Headquarters
      headquarters: "Our Headquarters",
      yaounde: "Yaoundé, Cameroon",
      address: "Tongolo, opposite Yannick Noah Center",
      bookAppointment: "Book an Appointment",
      
      // Bottom
      copyright: "Institutional Seriousness",
      legalMentions: "Legal Mentions",
      privacyPolicy: "Privacy Policy",
      madeForExcellence: "Made for Excellence"
    }
  }[currentLang] || {
    // Fallback anglais
    brandVision: "Building a legacy, cultivating a heritage.",
    brandDesc: "Land excellence at the service of the diaspora and local investors.",
    realEstateDiv: "Real Estate Division",
    luxuryResidences: "Luxury Residences",
    landVerification: "Land Title Verification",
    siteManagement: "Site Management",
    agriDiv: "Agricultural Division",
    investmentProjects: "Investment Projects",
    agroMechanization: "Agro-Mechanization",
    exportLogistics: "Export & Logistics",
    headquarters: "Our Headquarters",
    yaounde: "Yaoundé, Cameroon",
    address: "Tongolo, opposite Yannick Noah Center",
    bookAppointment: "Book an Appointment",
    copyright: "Institutional Seriousness",
    legalMentions: "Legal Mentions",
    privacyPolicy: "Privacy Policy",
    madeForExcellence: "Made for Excellence"
  };

  return (
    <footer className="bg-pc-green text-white pt-24 pb-12 border-t-2 border-pc-gold/30">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* COLUMN 1: BRAND & VISION */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col gap-6 mb-8 group cursor-pointer">
              <img 
                src="/images/logo.png" 
                alt="Property Cameroon" 
                className="w-30 h-30 object-contain grayscale brightness-200 group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="text-2xl font-black tracking-tighter uppercase leading-none">
                PROPERTY<br />
                <span className="text-pc-gold italic font-serif font-light lowercase text-lg">Cameroon</span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed font-light italic">
              "{t.brandVision}" <br />
              {t.brandDesc}
            </p>
          </div>

          {/* COLUMN 2: REAL ESTATE (GOLD) */}
          <div>
            <h4 className="text-pc-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-80">
              {t.realEstateDiv}
            </h4>
            <ul className="space-y-4 text-sm text-slate-300 font-light">
              <li><Link to="/real-estate" className="hover:text-pc-gold transition-colors italic">{t.luxuryResidences}</Link></li>
              <li><Link to="/agriculture/expertise" className="hover:text-pc-gold transition-colors italic">{t.landVerification}</Link></li>
              <li><a href="#" className="hover:text-pc-gold transition-colors italic">{t.siteManagement}</a></li>
            </ul>
          </div>

          {/* COLUMN 3: AGRICULTURE (GREEN) */}
          <div>
            <h4 className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-8">
              {t.agriDiv}
            </h4>
            <ul className="space-y-4 text-sm text-slate-300 font-light">
              <li><Link to="/agriculture" className="hover:text-white transition-colors italic">{t.investmentProjects}</Link></li>
              <li><Link to="/agriculture/expertise" className="hover:text-white transition-colors italic">{t.agroMechanization}</Link></li>
              <li><Link to="/agriculture/marketplace" className="hover:text-white transition-colors italic">{t.exportLogistics}</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & HEADQUARTERS */}
          <div>
            <h4 className="text-pc-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-80">
              {t.headquarters}
            </h4>
            <address className="not-italic text-sm text-slate-300 space-y-4 font-light">
              <p>
                📍 <span className="text-white font-medium">{t.yaounde}</span> <br />
                <span className="text-xs text-slate-400 block mt-1">{t.address}</span>
              </p>
              
              <div className="pt-4">
                <Link to="/book-appointment">
                  <button className="border border-white/20 px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest hover:bg-white hover:text-pc-green transition-all">
                    {t.bookAppointment}
                  </button>
                </Link>
              </div>
            </address>
          </div>
        </div>

        {/* BOTTOM LINE (COPYRIGHT & PARTNERS) */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-medium">
              © 2026 PropertyCameroon — {t.copyright}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-8 text-[9px] uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-white transition-colors">{t.legalMentions}</a>
            <a href="#" className="hover:text-white transition-colors">{t.privacyPolicy}</a>
            <span className="text-pc-gold/50 tracking-normal italic font-serif">{t.madeForExcellence}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;