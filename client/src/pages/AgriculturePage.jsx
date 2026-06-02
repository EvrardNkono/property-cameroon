import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgroIntelligence from '../components/agriculture/AgroIntelligence';
import ZoneRadar from '../components/agriculture/ZoneRadar';
import LandCard from '../components/agriculture/LandCard';

// Hook pour récupérer la langue (à mutualiser dans un fichier utils!)
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

const AgriculturePage = () => {
  const currentLang = useCurrentLang();
  const [activeCrop, setActiveCrop] = useState(null);
  const [filteredLands, setFilteredLands] = useState([]);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero section
      heroBadge: "Portail d'Investissement",
      heroTitle: "Cultivez Votre",
      heroTitleLegacy: "Héritage",
      heroSubtitle: "Accédez à une sélection rigoureuse de terres agricoles certifiées au Cameroun, analysées par nos experts en sols et sécurisées juridiquement pour les investisseurs internationaux.",
      
      // Listing section
      availableOpportunities: "Opportunités",
      availableTagline: "Disponibles",
      selectCropHint: "Sélectionnez une culture ci-dessus pour affiner vos résultats.",
      totalAssets: "Actifs",
      
      // CTA section
      ctaTitle: "Vous ne trouvez pas la parcelle idéale ?",
      ctaSubtitle: "Notre équipe peut effectuer une recherche personnalisée basée sur vos besoins techniques et objectifs culturaux.",
      ctaButton: "Lancer un Mandat de Recherche",
      
      // Land data
      lands: [
        { id: "LAND-001", title: "Domaine Cacaoyer de Mbalmayo", location: "Région du Centre", size: "25 Ha", price: "12,500,000", matchScore: 98 },
        { id: "LAND-002", title: "Terres Volcaniques de Foumbot", location: "Région de l'Ouest", size: "10 Ha", price: "35,000,000", matchScore: 85 },
        { id: "LAND-003", title: "Zone Industrielle de Kribi", location: "Région du Sud", size: "100 Ha", price: "150,000,000", matchScore: 75 }
      ]
    },
    en: {
      // Hero section
      heroBadge: "Investment Gateway",
      heroTitle: "Cultivate Your",
      heroTitleLegacy: "Legacy",
      heroSubtitle: "Access a rigorous selection of certified agricultural lands in Cameroon, analyzed by our soil experts and legally secured for international investors.",
      
      // Listing section
      availableOpportunities: "Available",
      availableTagline: "Opportunities",
      selectCropHint: "Select a crop above to refine your search results.",
      totalAssets: "Assets",
      
      // CTA section
      ctaTitle: "Can't find the perfect plot?",
      ctaSubtitle: "Our team can conduct a custom land search based on your specific technical requirements and crop goals.",
      ctaButton: "Launch a Search Mandate",
      
      // Land data
      lands: [
        { id: "LAND-001", title: "Mbalmayo Cocoa Estate", location: "Center Region", size: "25 Ha", price: "12,500,000", matchScore: 98 },
        { id: "LAND-002", title: "Foumbot Volcanic Lands", location: "West Region", size: "10 Ha", price: "35,000,000", matchScore: 85 },
        { id: "LAND-003", title: "Kribi Industrial Extension", location: "South Region", size: "100 Ha", price: "150,000,000", matchScore: 75 }
      ]
    }
  }[currentLang] || {
    // Fallback français
    heroBadge: "Portail d'Investissement",
    heroTitle: "Cultivez Votre",
    heroTitleLegacy: "Héritage",
    heroSubtitle: "Accédez à une sélection rigoureuse de terres agricoles certifiées au Cameroun...",
    availableOpportunities: "Opportunités",
    availableTagline: "Disponibles",
    selectCropHint: "Sélectionnez une culture ci-dessus pour affiner vos résultats.",
    totalAssets: "Actifs",
    ctaTitle: "Vous ne trouvez pas la parcelle idéale ?",
    ctaSubtitle: "Notre équipe peut effectuer une recherche personnalisée...",
    ctaButton: "Lancer un Mandat de Recherche",
    lands: MOCK_AGRICULTURAL_LANDS_FR // À définir
  };

  // Mettre à jour filteredLands quand la langue change
  useEffect(() => {
    setFilteredLands(t.lands);
  }, [currentLang, t.lands]);

  const handleMatchFound = (crop) => {
    setActiveCrop(crop);
    console.log("Filtering lands for:", crop.name);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-pc-green selection:text-white">
      <Navbar />

      <section className="relative pt-48 pb-40 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-pc-gold"></span>
              <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.5em]">
                {t.heroBadge}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter mb-8">
              {t.heroTitle} <br />
              <span className="text-pc-green italic font-light underline decoration-pc-gold/20">
                {t.heroTitleLegacy}
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 relative -mt-20">
        <AgroIntelligence onMatchFound={handleMatchFound} />
      </section>

      <ZoneRadar />

      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-serif text-slate-900 uppercase tracking-tighter">
                {t.availableOpportunities} <span className="text-pc-green italic font-light">{t.availableTagline}</span>
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {activeCrop 
                  ? `Optimized lands for growing: ${activeCrop.name}` // À traduire aussi
                  : t.selectCropHint}
              </p>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 mt-4 md:mt-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {t.totalAssets}: {filteredLands.length}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredLands.map((land) => (
              <LandCard key={land.id} land={land} />
            ))}
          </div>

          <div className="mt-20 p-12 bg-slate-900 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-pc-green opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <h3 className="text-white text-2xl font-serif mb-4">{t.ctaTitle}</h3>
            <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto italic">
              {t.ctaSubtitle}
            </p>
            <button className="px-10 py-4 border border-pc-gold text-pc-gold text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pc-gold hover:text-slate-900 transition-all">
              {t.ctaButton}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgriculturePage;