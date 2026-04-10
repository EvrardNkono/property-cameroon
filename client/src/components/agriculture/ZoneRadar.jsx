import React, { useState } from 'react';
import { CloudRain, Thermometer, Map as MapIcon, X, Eye, ChevronRight } from 'lucide-react';
import ZoneMap from './ZoneMap';

const ZONES_DATA = [
  {
    id: 1,
    name: "Sudano-Sahelian Zone",
    alias: "The Far North",
    coordinates: [11.5, 14.5], // Coordonnées réelles du Nord
    zoom: 7,
    regions: "Far-North & North Regions",
    temp: "28°C - 45°C",
    rain: "400 - 1000 mm/year",
    soil: "Sandy-loam (Upland soils)",
    highlights: ["Cotton", "Onion", "Cashew", "Livestock"],
    color: "from-orange-400 to-red-500",
    description: "A vast plain dominated by a prolonged dry season. Ideal for crops requiring low water intake and maximum solar exposure.",
    previewImg: "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=2074&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Guinean High Savannah",
    alias: "The Water Tower",
    coordinates: [7.3, 13.5], // Adamaoua
    zoom: 7,
    regions: "Adamawa Region",
    temp: "20°C - 30°C",
    rain: "1500 - 2000 mm/year",
    soil: "Ferralitic & Lateritic",
    highlights: ["Maize", "Potato", "Cattle", "Avocado"],
    color: "from-yellow-400 to-orange-500",
    description: "A transition zone characterized by vast pastures and lands suitable for intensive cereal cultivation.",
    previewImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Highlands Zone",
    alias: "Volcanic Lands",
    coordinates: [5.6, 10.4], // Ouest
    zoom: 8,
    regions: "West & North-West Regions",
    temp: "18°C - 25°C",
    rain: "1500 - 2500 mm/year",
    soil: "Volcanic (Highly fertile, pH 5-6)",
    highlights: ["Arabica Coffee", "Market Gardening", "Pepper", "Avocado"],
    color: "from-emerald-400 to-teal-600",
    description: "Exceedingly fertile lands. The rugged relief provides perfect natural drainage for high-value export crops.",
    previewImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Humid Forest (Monomodal)",
    alias: "Coastal Basin",
    coordinates: [4.1, 9.3], // Littoral / Sud-Ouest
    zoom: 8,
    regions: "Littoral & South-West Regions",
    temp: "25°C - 32°C",
    rain: "2500 - 4000 mm/year",
    soil: "Sedimentary & Volcanic",
    highlights: ["Oil Palm", "Banana", "Rubber", "Penja Pepper"],
    color: "from-blue-400 to-indigo-600",
    description: "The wettest zone in the country. Constant humidity makes it ideal for large-scale industrial plantations.",
    previewImg: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Humid Forest (Bimodal)",
    alias: "The Great Southern Basin",
    coordinates: [3.8, 11.5], // Centre / Sud / Est
    zoom: 8,
    regions: "Center, South & East Regions",
    temp: "24°C - 28°C",
    rain: "1500 - 2000 mm/year",
    soil: "Deep Ferralitic",
    highlights: ["Cocoa", "Cassava", "Plantain", "Timber"],
    color: "from-green-500 to-emerald-800",
    description: "The heart of cocoa production. A stable climate with two distinct rainy seasons allowing for regular agricultural cycles.",
    previewImg: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=2013&auto=format&fit=crop"
  }
];

const ZoneRadar = ({ lands = [] }) => {
  const [activeZone, setActiveZone] = useState(null);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif text-slate-900 tracking-tighter uppercase mb-4">
              Agro-Ecological <span className="text-pc-green italic font-light">Segmentation</span>
            </h2>
            <p className="text-slate-500 font-light leading-relaxed">
              Cameroon is "Africa in miniature." Explore the topography and investment opportunities of our 5 major ecological zones.
            </p>
          </div>
          <div className="flex items-center gap-3 text-pc-gold">
            <MapIcon size={20} />
            <span className="text-[10px] uppercase font-black tracking-widest border-b border-pc-gold pb-1">
              Hybrid Radar View
            </span>
          </div>
        </div>

        {/* CONTAINER HYBRIDE */}
        <div className="flex flex-col lg:flex-row gap-6 h-[750px] bg-slate-50 p-2 border border-slate-100 shadow-2xl">
          
          {/* SÉLECTEUR DE ZONES (Gauche) */}
          <div className="lg:w-1/3 overflow-y-auto space-y-3 p-4 bg-white custom-scrollbar">
            {ZONES_DATA.map((zone) => (
              <div 
                key={zone.id} 
                onClick={() => setActiveZone(zone)}
                className={`group cursor-pointer relative border transition-all duration-500 p-6 ${
                  activeZone?.id === zone.id 
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
                  <Eye size={14} className={activeZone?.id === zone.id ? 'text-pc-gold' : 'text-slate-200'} />
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
              activeCenter={activeZone?.coordinates} 
              activeZoom={activeZone?.zoom} 
            />

            {/* OVERLAY D'INFORMATION FLOATING */}
            {activeZone && (
              <div className="absolute top-6 left-6 z-[1000] max-w-sm bg-white/95 backdrop-blur p-8 shadow-2xl border-t-4 border-pc-green animate-in slide-in-from-left-4">
                <button 
                  onClick={() => setActiveZone(null)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
                <span className="text-[9px] font-black text-pc-gold uppercase tracking-[0.3em]">Scientific Survey 2026</span>
                <h4 className="text-2xl font-serif mt-2 mb-4 italic leading-none">{activeZone.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed italic mb-6">"{activeZone.description}"</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8 py-4 border-y border-slate-50">
                  <div>
                    <span className="block text-[8px] font-black text-slate-300 uppercase mb-1">Pedology</span>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter">{activeZone.soil}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-300 uppercase mb-1">Investment</span>
                    <span className="text-[10px] font-bold text-pc-green uppercase tracking-widest">Optimal Yield</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-pc-green transition-all flex items-center justify-center gap-2">
                  Explore available plots <ChevronRight size={14} />
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