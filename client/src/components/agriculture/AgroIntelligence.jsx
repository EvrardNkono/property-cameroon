import React, { useState, useEffect } from 'react';
import { Sprout, MapPin, Beaker, TrendingUp, Thermometer, Droplets, Clock, Target } from 'lucide-react';

// Hook personnalisé pour la détection de langue
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

// EXPERT AGRONOMIC DATABASE (BILINGUE)
const AGRO_DATABASE = {
  crops: [
    { 
      id: 'cocoa', 
      name: { fr: 'Cacao (Theobroma)', en: 'Cocoa (Theobroma)' },
      zones: { fr: ['Centre', 'Sud', 'Est', 'Sud-Ouest'], en: ['Center', 'South', 'East', 'South-West'] },
      soil: { fr: 'Profond, riche en humus, pH 5.0 - 7.5', en: 'Deep, humus-rich, pH 5.0 - 7.5' },
      climate: { fr: 'Chaud et humide (24-28°C)', en: 'Warm and humid (24-28°C)' },
      rain: { fr: '1500mm - 2500mm', en: '1500mm - 2500mm' },
      cycle: { fr: '3-5 Ans (Pleine Production)', en: '3-5 Years (Full Production)' },
      yield: { fr: '1.5 - 2.5 Tonnes/Ha', en: '1.5 - 2.5 Tons/Ha' },
      density: { fr: '1111 plants/Ha (3m x 3m)', en: '1111 plants/Ha (3m x 3m)' },
      prestige_note: { 
        fr: "Culture historique de rente, idéale pour l'investissement dans le bassin forestier.",
        en: "Historical cash crop, ideal for the forest basin investment."
      }
    },
    { 
      id: 'pepper', 
      name: { fr: 'Poivre de Penja', en: 'Penja Pepper' },
      zones: { fr: ['Littoral (Moungo)', 'Sud-Ouest'], en: ['Littoral (Moungo)', 'South-West'] },
      soil: { fr: 'Volcanique, bien drainé, riche en matière organique', en: 'Volcanic, well-drained, rich in Organic Matter' },
      climate: { fr: 'Humide, altitude < 500m', en: 'Humid, altitude < 500m' },
      rain: { fr: '2000mm - 4000mm', en: '2000mm - 4000mm' },
      cycle: { fr: '3 Ans (Première Récolte)', en: '3 Years (Initial Harvest)' },
      yield: { fr: '3 - 5 Tonnes/Ha', en: '3 - 5 Tons/Ha' },
      density: { fr: '2500 tuteurs/Ha', en: '2500 stakes/Ha' },
      prestige_note: { 
        fr: "IGP reconnue mondialement, haute valeur à l'exportation et prestige.",
        en: "Globally recognized PGI, high export value and prestige."
      }
    },
    { 
      id: 'cashew', 
      name: { fr: 'Noix de Cajou (Anacardium)', en: 'Cashew (Anacardium)' },
      zones: { fr: ['Nord', 'Extrême-Nord', 'Adamaoua'], en: ['North', 'Far-North', 'Adamaoua'] },
      soil: { fr: 'Sablo-argileux, profond, sans engorgement', en: 'Sandy-clay, deep, no waterlogging' },
      climate: { fr: 'Soudano-Sahélien (Saisonnalité marquée)', en: 'Sudano-Sahelian (Marked seasonality)' },
      rain: { fr: '800mm - 1500mm', en: '800mm - 1500mm' },
      cycle: { fr: '3 Ans (Premières Noix)', en: '3 Years (First Nuts)' },
      yield: { fr: '1 - 1.5 Tonnes/Ha', en: '1 - 1.5 Tons/Ha' },
      density: { fr: '100 - 200 arbres/Ha', en: '100 - 200 trees/Ha' },
      prestige_note: { 
        fr: "L'or gris du Nord, résilience climatique exceptionnelle.",
        en: "The gray gold of the North, exceptional climate resilience."
      }
    },
    { 
      id: 'avocado', 
      name: { fr: 'Avocatier (Hass / Geffner)', en: 'Avocado (Hass / Geffner)' },
      zones: { fr: ['Ouest', 'Nord-Ouest', 'Adamaoua'], en: ['West', 'North-West', 'Adamaoua'] },
      soil: { fr: 'Volcanique, pH 5.5 - 6.5, drainage parfait', en: 'Volcanic, pH 5.5 - 6.5, perfect drainage' },
      climate: { fr: 'Fraîche (Altitude 1000m - 2000m)', en: 'Cool (Altitude 1000m - 2000m)' },
      rain: { fr: '1200mm - 1800mm', en: '1200mm - 1800mm' },
      cycle: { fr: '3-4 Ans (Plants greffés)', en: '3-4 Years (Grafted plants)' },
      yield: { fr: '15 - 25 Tonnes/Ha', en: '15 - 25 Tons/Ha' },
      density: { fr: '200 - 400 arbres/Ha', en: '200 - 400 trees/Ha' },
      prestige_note: { 
        fr: "Demande mondiale en explosion, haute rentabilité par hectare.",
        en: "Exploding global demand, high profitability per hectare."
      }
    },
    { 
      id: 'palm', 
      name: { fr: 'Palmier à Huile (Tenera)', en: 'Oil Palm (Tenera)' },
      zones: { fr: ['Littoral', 'Sud-Ouest', 'Sud', 'Centre'], en: ['Littoral', 'South-West', 'South', 'Center'] },
      soil: { fr: 'Alluvial ou ferrallitique, profond', en: 'Alluvial or ferralitic, deep' },
      climate: { fr: 'Ensoleillement maximal (> 2000h/an)', en: 'Maximum sunshine (> 2000h/year)' },
      rain: { fr: '1800mm - 3000mm', en: '1800mm - 3000mm' },
      cycle: { fr: '3-4 Ans (Variétés précoces)', en: '3-4 Years (Early varieties)' },
      yield: { fr: '12 - 20 Tonnes (Régimes)/Ha', en: '12 - 20 Tons (Bunches)/Ha' },
      density: { fr: '143 plants/Ha (9m x 9m)', en: '143 plants/Ha (9m x 9m)' },
      prestige_note: { 
        fr: "La colonne vertébrale de la croissance agro-industrielle locale et régionale.",
        en: "The backbone of local and regional agro-industrial growth."
      }
    }
  ]
};

// ========== TRADUCTIONS UI ==========
const UI_TRANSLATIONS = {
  fr: {
    agronomicIntelligence: "Intelligence Agronomique",
    defineYour: "Définissez Votre",
    investmentTarget: "Cible d'Investissement",
    cycle: "Cycle",
    factSheet: "Fiche Technique",
    excellenceZones: "Zones d'Excellence",
    soilProperties: "Propriétés du Sol",
    thermalRequirements: "Exigences Thermiques",
    annualWaterNeeds: "Besoins en Eau Annuels",
    density: "Densité",
    estYield: "Rendement Estimé",
    selectCrop: "Sélectionnez une culture pour projeter",
    yourPerformanceIndicators: "vos indicateurs de performance.",
    technicalFactSheet: "Fiche Technique:",
    noCropSelected: "Aucune culture sélectionnée"
  },
  en: {
    agronomicIntelligence: "Agronomic Intelligence",
    defineYour: "Define Your",
    investmentTarget: "Investment Target",
    cycle: "Cycle",
    factSheet: "Fact Sheet",
    excellenceZones: "Excellence Zones",
    soilProperties: "Soil Properties",
    thermalRequirements: "Thermal Requirements",
    annualWaterNeeds: "Annual Water Needs",
    density: "Density",
    estYield: "Est. Yield",
    selectCrop: "Select a crop to project",
    yourPerformanceIndicators: "your performance indicators.",
    technicalFactSheet: "Technical Fact Sheet:",
    noCropSelected: "No crop selected"
  }
};

const AgroIntelligence = ({ onMatchFound }) => {
  const currentLang = useCurrentLang();
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Obtenir les traductions UI
  const ui = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.fr;

  // Fonction pour obtenir les données traduites d'une culture
  const getLocalizedCrop = (crop) => {
    if (!crop) return null;
    return {
      ...crop,
      name: crop.name[currentLang] || crop.name.fr,
      zones: crop.zones[currentLang] || crop.zones.fr,
      soil: crop.soil[currentLang] || crop.soil.fr,
      climate: crop.climate[currentLang] || crop.climate.fr,
      rain: crop.rain[currentLang] || crop.rain.fr,
      cycle: crop.cycle[currentLang] || crop.cycle.fr,
      yield: crop.yield[currentLang] || crop.yield.fr,
      density: crop.density[currentLang] || crop.density.fr,
      prestige_note: crop.prestige_note[currentLang] || crop.prestige_note.fr
    };
  };

  const handleCropSelect = (crop) => {
    const localizedCrop = getLocalizedCrop(crop);
    setSelectedCrop(localizedCrop);
    if (onMatchFound) onMatchFound(localizedCrop);
  };

  // Version localisée des cultures pour l'affichage
  const localizedCrops = AGRO_DATABASE.crops.map(crop => ({
    ...crop,
    displayName: crop.name[currentLang] || crop.name.fr,
    displayCycle: (crop.cycle[currentLang] || crop.cycle.fr).split(' ')[0]
  }));

  return (
    <div className="bg-white border border-slate-100 shadow-2xl p-8 md:p-12 -mt-24 relative z-20 rounded-sm">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* CROP SELECTOR (LEFT) */}
        <div className="lg:w-1/3">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-pc-gold" size={16} />
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
              {ui.agronomicIntelligence}
            </h3>
          </div>
          <p className="text-slate-900 font-serif text-3xl mb-8 leading-tight">
            {ui.defineYour} <br />
            <span className="italic text-pc-green font-light">{ui.investmentTarget}</span>
          </p>
          
          <div className="flex flex-col gap-2">
            {localizedCrops.map((crop) => (
              <button
                key={crop.id}
                onClick={() => handleCropSelect(AGRO_DATABASE.crops.find(c => c.id === crop.id))}
                className={`text-left px-6 py-5 border-l-4 transition-all duration-300 flex justify-between items-center group ${
                  selectedCrop?.id === crop.id 
                  ? 'border-pc-green bg-slate-900 text-white' 
                  : 'border-slate-100 bg-slate-50 hover:border-pc-gold hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold tracking-widest">{crop.displayName}</span>
                  <span className={`text-[8px] mt-1 ${selectedCrop?.id === crop.id ? 'text-pc-gold' : 'text-slate-400'}`}>
                    {ui.cycle}: {crop.displayCycle}
                  </span>
                </div>
                <TrendingUp size={14} className={selectedCrop?.id === crop.id ? 'text-pc-gold' : 'opacity-20'} />
              </button>
            ))}
          </div>
        </div>

        {/* TECHNICAL ANALYSIS PANEL (RIGHT) */}
        <div className="lg:w-2/3 lg:border-l lg:border-slate-100 lg:pl-12">
          {selectedCrop ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="flex items-center gap-3 mb-8">
                <Sprout className="text-pc-green" size={24} />
                <h2 className="text-3xl font-serif text-slate-900">
                  {ui.factSheet}: <span className="italic font-light">{selectedCrop.name}</span>
                </h2>
              </div>

              {/* DATA GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><MapPin size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">{ui.excellenceZones}</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.zones.join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><Beaker size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">{ui.soilProperties}</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.soil}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><Thermometer size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">{ui.thermalRequirements}</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.climate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><Droplets size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">{ui.annualWaterNeeds}</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.rain}</p>
                  </div>
                </div>
              </div>

              {/* YIELD INDICATORS */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-10">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-slate-400 mb-1">
                        <Clock size={12} />
                        <span className="text-[8px] uppercase font-bold tracking-widest">{ui.cycle}</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">{selectedCrop.cycle}</p>
                </div>
                <div className="text-center md:text-left border-x border-slate-100 px-4">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-slate-400 mb-1">
                        <Target size={12} />
                        <span className="text-[8px] uppercase font-bold tracking-widest">{ui.density}</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">{selectedCrop.density}</p>
                </div>
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-pc-green mb-1">
                        <TrendingUp size={12} />
                        <span className="text-[8px] uppercase font-bold tracking-widest">{ui.estYield}</span>
                    </div>
                    <p className="text-sm font-black text-pc-green">{selectedCrop.yield}</p>
                </div>
              </div>

              {/* PRESTIGE NOTE */}
              <div className="mt-8 p-4 bg-pc-gold/5 border-l-2 border-pc-gold italic text-xs text-slate-600 font-serif">
                "{selectedCrop.prestige_note}"
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-100 rounded-sm">
              <Sprout size={48} className="text-slate-100 mb-4" />
              <p className="text-slate-300 font-serif italic text-xl">
                {ui.selectCrop} <br />{ui.yourPerformanceIndicators}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgroIntelligence;