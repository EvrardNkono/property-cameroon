import React, { useState, useEffect } from 'react';
import { CloudRain, Thermometer, Map as MapIcon, X, Eye, ChevronRight } from 'lucide-react';
import ZoneMap from './ZoneMap';

// 🔥 Détection automatique de l'environnement
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           
  : 'https://property-cameroon-backend.vercel.app';

// Hook pour récupérer la langue actuelle (copié depuis Hero)
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

const ZONES_DATA = [
  {
    id: 1,
    name: {
      fr: "Zone Soudano-Sahélienne",
      en: "Sudano-Sahelian Zone"
    },
    alias: {
      fr: "L'Extrême Nord",
      en: "The Far North"
    },
    coordinates: [11.5, 14.5],
    zoom: 7,
    regions: {
      fr: "Régions de l'Extrême-Nord & du Nord",
      en: "Far-North & North Regions"
    },
    temp: "28°C - 45°C",
    rain: "400 - 1000 mm/year",
    soil: {
      fr: "Sablo-limoneux (Sols de plateau)",
      en: "Sandy-loam (Upland soils)"
    },
    highlights: {
      fr: ["Coton", "Oignon", "Noix de cajou", "Élevage"],
      en: ["Cotton", "Onion", "Cashew", "Livestock"]
    },
    color: "from-orange-400 to-red-500",
    description: {
      fr: "Vaste plaine dominée par une longue saison sèche. Idéale pour les cultures nécessitant peu d'eau et une exposition solaire maximale.",
      en: "A vast plain dominated by a prolonged dry season. Ideal for crops requiring low water intake and maximum solar exposure."
    },
    previewImg: "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=2074&auto=format&fit=crop"
  },
  {
    id: 2,
    name: {
      fr: "Haute Savane Guinéenne",
      en: "Guinean High Savannah"
    },
    alias: {
      fr: "Le Château d'Eau",
      en: "The Water Tower"
    },
    coordinates: [7.3, 13.5],
    zoom: 7,
    regions: {
      fr: "Région de l'Adamaoua",
      en: "Adamawa Region"
    },
    temp: "20°C - 30°C",
    rain: "1500 - 2000 mm/year",
    soil: {
      fr: "Ferralitique & Latéritique",
      en: "Ferralitic & Lateritic"
    },
    highlights: {
      fr: ["Maïs", "Pomme de terre", "Élevage bovin", "Avocat"],
      en: ["Maize", "Potato", "Cattle", "Avocado"]
    },
    color: "from-yellow-400 to-orange-500",
    description: {
      fr: "Zone de transition caractérisée par de vastes pâturages et des terres propices à la céréaliculture intensive.",
      en: "A transition zone characterized by vast pastures and lands suitable for intensive cereal cultivation."
    },
    previewImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: {
      fr: "Zone des Hautes Terres",
      en: "Highlands Zone"
    },
    alias: {
      fr: "Terres Volcaniques",
      en: "Volcanic Lands"
    },
    coordinates: [5.6, 10.4],
    zoom: 8,
    regions: {
      fr: "Régions de l'Ouest & du Nord-Ouest",
      en: "West & North-West Regions"
    },
    temp: "18°C - 25°C",
    rain: "1500 - 2500 mm/year",
    soil: {
      fr: "Volcanique (Très fertile, pH 5-6)",
      en: "Volcanic (Highly fertile, pH 5-6)"
    },
    highlights: {
      fr: ["Café Arabica", "Maraîchage", "Poivre", "Avocat"],
      en: ["Arabica Coffee", "Market Gardening", "Pepper", "Avocado"]
    },
    color: "from-emerald-400 to-teal-600",
    description: {
      fr: "Terres extrêmement fertiles. Le relief accidenté offre un drainage naturel parfait pour les cultures d'exportation à haute valeur ajoutée.",
      en: "Exceedingly fertile lands. The rugged relief provides perfect natural drainage for high-value export crops."
    },
    previewImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"
  },
  {
    id: 4,
    name: {
      fr: "Forêt Humide (Monomodale)",
      en: "Humid Forest (Monomodal)"
    },
    alias: {
      fr: "Bassin Côtier",
      en: "Coastal Basin"
    },
    coordinates: [4.1, 9.3],
    zoom: 8,
    regions: {
      fr: "Régions du Littoral & du Sud-Ouest",
      en: "Littoral & South-West Regions"
    },
    temp: "25°C - 32°C",
    rain: "2500 - 4000 mm/year",
    soil: {
      fr: "Sédimentaire & Volcanique",
      en: "Sedimentary & Volcanic"
    },
    highlights: {
      fr: ["Palmier à huile", "Banane", "Caoutchouc", "Poivre de Penja"],
      en: ["Oil Palm", "Banana", "Rubber", "Penja Pepper"]
    },
    color: "from-blue-400 to-indigo-600",
    description: {
      fr: "La zone la plus humide du pays. L'humidité constante la rend idéale pour les plantations industrielles à grande échelle.",
      en: "The wettest zone in the country. Constant humidity makes it ideal for large-scale industrial plantations."
    },
    previewImg: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: {
      fr: "Forêt Humide (Bimodale)",
      en: "Humid Forest (Bimodal)"
    },
    alias: {
      fr: "Le Grand Bassin du Sud",
      en: "The Great Southern Basin"
    },
    coordinates: [3.8, 11.5],
    zoom: 8,
    regions: {
      fr: "Régions du Centre, du Sud & de l'Est",
      en: "Center, South & East Regions"
    },
    temp: "24°C - 28°C",
    rain: "1500 - 2000 mm/year",
    soil: {
      fr: "Ferralitique Profond",
      en: "Deep Ferralitic"
    },
    highlights: {
      fr: ["Cacao", "Manioc", "Banane plantain", "Bois d'œuvre"],
      en: ["Cocoa", "Cassava", "Plantain", "Timber"]
    },
    color: "from-green-500 to-emerald-800",
    description: {
      fr: "Le cœur de la production cacaoyère. Un climat stable avec deux saisons des pluies distinctes permettant des cycles agricoles réguliers.",
      en: "The heart of cocoa production. A stable climate with two distinct rainy seasons allowing for regular agricultural cycles."
    },
    previewImg: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=2013&auto=format&fit=crop"
  }
];

const ZoneRadar = ({ lands = [] }) => {
  const [activeZone, setActiveZone] = useState(null);
  const currentLang = useCurrentLang();

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      title: "Segmentation Agro-Écologique",
      subtitle: "Le Cameroun est 'l'Afrique en miniature.' Explorez la topographie et les opportunités d'investissement de nos 5 grandes zones écologiques.",
      radarView: "Vue Radar Hybride",
      scientificSurvey: "Étude Scientifique 2026",
      pedology: "Pédologie",
      investment: "Investissement",
      optimalYield: "Rendement Optimal",
      explorePlots: "Explorer les parcelles disponibles"
    },
    en: {
      title: "Agro-Ecological Segmentation",
      subtitle: "Cameroon is 'Africa in miniature.' Explore the topography and investment opportunities of our 5 major ecological zones.",
      radarView: "Hybrid Radar View",
      scientificSurvey: "Scientific Survey 2026",
      pedology: "Pedology",
      investment: "Investment",
      optimalYield: "Optimal Yield",
      explorePlots: "Explore available plots"
    }
  }[currentLang] || {
    title: "Segmentation Agro-Écologique",
    subtitle: "Le Cameroun est 'l'Afrique en miniature.' Explorez la topographie et les opportunités d'investissement de nos 5 grandes zones écologiques.",
    radarView: "Vue Radar Hybride",
    scientificSurvey: "Étude Scientifique 2026",
    pedology: "Pédologie",
    investment: "Investissement",
    optimalYield: "Rendement Optimal",
    explorePlots: "Explorer les parcelles disponibles"
  };

  // Fonction pour obtenir les données traduites d'une zone
  const getTranslatedZone = (zone) => ({
    ...zone,
    name: zone.name[currentLang] || zone.name.fr,
    alias: zone.alias[currentLang] || zone.alias.fr,
    regions: zone.regions[currentLang] || zone.regions.fr,
    soil: zone.soil[currentLang] || zone.soil.fr,
    highlights: zone.highlights[currentLang] || zone.highlights.fr,
    description: zone.description[currentLang] || zone.description.fr
  });

  // 🔥 Debug (optionnel)
  React.useEffect(() => {
    console.log(`🌍 ZoneRadar - Environnement: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
    console.log(`🔗 ZoneRadar - Backend URL: ${BACKEND_URL}`);
    console.log(`🌐 ZoneRadar - Langue actuelle: ${currentLang}`);
  }, [currentLang]);

  // Traduire les zones pour l'affichage
  const translatedZones = ZONES_DATA.map(getTranslatedZone);
  const translatedActiveZone = activeZone ? getTranslatedZone(activeZone) : null;

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif text-slate-900 tracking-tighter uppercase mb-4">
              {t.title.replace('Agro-Écologique', '') || t.title}
              <span className="text-pc-green italic font-light"> {t.title.includes('Agro-Écologique') ? 'Agro-Écologique' : ''}</span>
            </h2>
            <p className="text-slate-500 font-light leading-relaxed">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 text-pc-gold">
            <MapIcon size={20} />
            <span className="text-[10px] uppercase font-black tracking-widest border-b border-pc-gold pb-1">
              {t.radarView}
            </span>
          </div>
        </div>

        {/* CONTAINER HYBRIDE */}
        <div className="flex flex-col lg:flex-row gap-6 h-[750px] bg-slate-50 p-2 border border-slate-100 shadow-2xl">
          
          {/* SÉLECTEUR DE ZONES (Gauche) */}
          <div className="lg:w-1/3 overflow-y-auto space-y-3 p-4 bg-white custom-scrollbar">
            {translatedZones.map((zone) => (
              <div 
                key={zone.id} 
                onClick={() => setActiveZone(zone)}
                className={`group cursor-pointer relative border transition-all duration-500 p-6 ${
                  translatedActiveZone?.id === zone.id 
                    ? 'border-pc-green shadow-md ring-1 ring-pc-green/20 scale-[1.01]' 
                    : 'border-slate-100 hover:border-pc-green/20'
                }`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${zone.color}`}></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{zone.name}</h3>
                    <p className="text-pc-gold font-serif italic text-[10px]">{zone.alias}</p>
                  </div>
                  <Eye size={14} className={translatedActiveZone?.id === zone.id ? 'text-pc-gold' : 'text-slate-200'} />
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold">
                    <Thermometer size={12} /> {zone.temp}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold">
                    <CloudRain size={12} /> {zone.rain}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {zone.highlights.map((h, i) => (
                    <span key={i} className="text-[8px] bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-slate-500 uppercase font-bold tracking-tighter">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* LA CARTE INTERACTIVE (Droite) */}
          <div className="lg:w-2/3 h-full relative overflow-hidden group">
            <ZoneMap 
              lands={lands} 
              activeCenter={translatedActiveZone?.coordinates} 
              activeZoom={translatedActiveZone?.zoom} 
            />

            {/* OVERLAY D'INFORMATION FLOATING */}
            {translatedActiveZone && (
              <div className="absolute top-6 left-6 z-[1000] max-w-sm bg-white/95 backdrop-blur p-8 shadow-2xl border-t-4 border-pc-green animate-in slide-in-from-left-4">
                <button 
                  onClick={() => setActiveZone(null)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
                <span className="text-[9px] font-black text-pc-gold uppercase tracking-[0.3em]">{t.scientificSurvey}</span>
                <h4 className="text-2xl font-serif mt-2 mb-4 italic leading-none">{translatedActiveZone.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed italic mb-6">"{translatedActiveZone.description}"</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8 py-4 border-y border-slate-50">
                  <div>
                    <span className="block text-[8px] font-black text-slate-300 uppercase mb-1">{t.pedology}</span>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter">{translatedActiveZone.soil}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-300 uppercase mb-1">{t.investment}</span>
                    <span className="text-[10px] font-bold text-pc-green uppercase tracking-widest">{t.optimalYield}</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-pc-green transition-all flex items-center justify-center gap-2">
                  {t.explorePlots} <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZoneRadar;