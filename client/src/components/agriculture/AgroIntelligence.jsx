import React, { useState } from 'react';
import { Sprout, MapPin, Beaker, TrendingUp, Thermometer, Droplets, Clock, Target } from 'lucide-react';

// EXPERT AGRONOMIC DATABASE
const AGRO_DATABASE = {
  crops: [
    { 
      id: 'cocoa', 
      name: 'Cocoa (Theobroma)', 
      zones: ['Center', 'South', 'East', 'South-West'], 
      soil: 'Deep, humus-rich, pH 5.0 - 7.5', 
      climate: 'Warm and humid (24-28°C)',
      rain: '1500mm - 2500mm', 
      cycle: '3-5 Years (Full Production)',
      yield: '1.5 - 2.5 Tons/Ha',
      density: '1111 plants/Ha (3m x 3m)',
      prestige_note: "Historical cash crop, ideal for the forest basin investment."
    },
    { 
      id: 'pepper', 
      name: 'Penja Pepper', 
      zones: ['Littoral (Moungo)', 'South-West'], 
      soil: 'Volcanic, well-drained, rich in Organic Matter', 
      climate: 'Humid, altitude < 500m',
      rain: '2000mm - 4000mm', 
      cycle: '3 Years (Initial Harvest)',
      yield: '3 - 5 Tons/Ha',
      density: '2500 stakes/Ha',
      prestige_note: "Globally recognized PGI, high export value and prestige."
    },
    { 
      id: 'cashew', 
      name: 'Cashew (Anacardium)', 
      zones: ['North', 'Far-North', 'Adamaoua'], 
      soil: 'Sandy-clay, deep, no waterlogging', 
      climate: 'Sudano-Sahelian (Marked seasonality)',
      rain: '800mm - 1500mm', 
      cycle: '3 Years (First Nuts)',
      yield: '1 - 1.5 Tons/Ha',
      density: '100 - 200 trees/Ha',
      prestige_note: "The gray gold of the North, exceptional climate resilience."
    },
    { 
      id: 'avocado', 
      name: 'Avocado (Hass / Geffner)', 
      zones: ['West', 'North-West', 'Adamaoua'], 
      soil: 'Volcanic, pH 5.5 - 6.5, perfect drainage', 
      climate: 'Cool (Altitude 1000m - 2000m)',
      rain: '1200mm - 1800mm', 
      cycle: '3-4 Years (Grafted plants)',
      yield: '15 - 25 Tons/Ha',
      density: '200 - 400 trees/Ha',
      prestige_note: "Exploding global demand, high profitability per hectare."
    },
    { 
      id: 'palm', 
      name: 'Oil Palm (Tenera)', 
      zones: ['Littoral', 'South-West', 'South', 'Center'], 
      soil: 'Alluvial or ferralitic, deep', 
      climate: 'Maximum sunshine (> 2000h/year)',
      rain: '1800mm - 3000mm', 
      cycle: '3-4 Years (Early varieties)',
      yield: '12 - 20 Tons (Bunches)/Ha',
      density: '143 plants/Ha (9m x 9m)',
      prestige_note: "The backbone of local and regional agro-industrial growth."
    }
  ]
};

const AgroIntelligence = ({ onMatchFound }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    if (onMatchFound) onMatchFound(crop);
  };

  return (
    <div className="bg-white border border-slate-100 shadow-2xl p-8 md:p-12 -mt-24 relative z-20 rounded-sm">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* CROP SELECTOR (LEFT) */}
        <div className="lg:w-1/3">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-pc-gold" size={16} />
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
              Agronomic Intelligence
            </h3>
          </div>
          <p className="text-slate-900 font-serif text-3xl mb-8 leading-tight">
            Define Your <br />
            <span className="italic text-pc-green font-light">Investment Target</span>
          </p>
          
          <div className="flex flex-col gap-2">
            {AGRO_DATABASE.crops.map((crop) => (
              <button
                key={crop.id}
                onClick={() => handleCropSelect(crop)}
                className={`text-left px-6 py-5 border-l-4 transition-all duration-300 flex justify-between items-center group ${
                  selectedCrop?.id === crop.id 
                  ? 'border-pc-green bg-slate-900 text-white' 
                  : 'border-slate-100 bg-slate-50 hover:border-pc-gold hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold tracking-widest">{crop.name}</span>
                  <span className={`text-[8px] mt-1 ${selectedCrop?.id === crop.id ? 'text-pc-gold' : 'text-slate-400'}`}>
                    Cycle: {crop.cycle.split(' ')[0]}
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
                  Fact Sheet: <span className="italic font-light">{selectedCrop.name}</span>
                </h2>
              </div>

              {/* DATA GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><MapPin size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">Excellence Zones</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.zones.join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><Beaker size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">Soil Properties</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.soil}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><Thermometer size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">Thermal Requirements</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.climate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-full text-pc-gold shrink-0"><Droplets size={18} /></div>
                  <div>
                    <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">Annual Water Needs</h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedCrop.rain}</p>
                  </div>
                </div>
              </div>

              {/* YIELD INDICATORS */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-10">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-slate-400 mb-1">
                        <Clock size={12} />
                        <span className="text-[8px] uppercase font-bold tracking-widest">Cycle</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">{selectedCrop.cycle}</p>
                </div>
                <div className="text-center md:text-left border-x border-slate-100 px-4">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-slate-400 mb-1">
                        <Target size={12} />
                        <span className="text-[8px] uppercase font-bold tracking-widest">Density</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">{selectedCrop.density}</p>
                </div>
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-pc-green mb-1">
                        <TrendingUp size={12} />
                        <span className="text-[8px] uppercase font-bold tracking-widest">Est. Yield</span>
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
                Select a crop to project <br />your performance indicators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgroIntelligence;