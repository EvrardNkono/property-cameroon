import React, { useState } from 'react';
import { CloudRain, Sun, Thermometer, Map as MapIcon, ChevronRight, X, Maximize2, Eye } from 'lucide-react';

const ZONES_DATA = [
  {
    id: 1,
    name: "Sudano-Sahelian Zone",
    alias: "The Far North",
    regions: "Far-North & North Regions",
    climate: "Dry Tropical",
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
    regions: "Adamawa Region",
    climate: "High Altitude Tropical",
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
    regions: "West & North-West Regions",
    climate: "High Altitude Equatorial",
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
    regions: "Littoral & South-West Regions",
    climate: "Maritime Equatorial",
    temp: "25°C - 32°C",
    rain: "2500 - 4000 mm/year",
    soil: "Sedimentary & Volcanic",
    highlights: ["Oil Palm", "Banana", "Rubber", "Penja Pepper"],
    color: "from-blue-400 to-indigo-600",
    description: "The wettest zone in the country. Constant humidity makes it ideal for large-scale industrial perennial plantations.",
    previewImg: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Humid Forest (Bimodal)",
    alias: "The Great Southern Basin",
    regions: "Center, South & East Regions",
    climate: "Guinean Equatorial",
    temp: "24°C - 28°C",
    rain: "1500 - 2000 mm/year",
    soil: "Deep Ferralitic",
    highlights: ["Cocoa", "Cassava", "Plantain", "Timber"],
    color: "from-green-500 to-emerald-800",
    description: "The heart of cocoa production. A stable climate with two distinct rainy seasons allowing for regular agricultural cycles.",
    previewImg: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=2013&auto=format&fit=crop"
  }
];

const ZoneRadar = () => {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif text-slate-900 tracking-tighter uppercase mb-4">
              Agro-Ecological <span className="text-pc-green italic font-light">Segmentation</span>
            </h2>
            <p className="text-slate-500 font-light leading-relaxed">
              Cameroon is "Africa in miniature." Click on a zone to explore its topography and specific investment opportunities.
            </p>
          </div>
          <div className="flex items-center gap-3 text-pc-gold">
            <MapIcon size={20} />
            <span className="text-[10px] uppercase font-black tracking-widest border-b border-pc-gold pb-1">
              Interactive Exploration
            </span>
          </div>
        </div>

        {/* ZONES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ZONES_DATA.map((zone) => (
            <div 
              key={zone.id} 
              onClick={() => setSelectedZone(zone)}
              className="group cursor-pointer relative bg-slate-50 overflow-hidden border border-slate-100 hover:border-pc-green/30 transition-all duration-500"
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${zone.color}`}></div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tighter group-hover:text-pc-green transition-colors">{zone.name}</h3>
                    <p className="text-pc-gold font-serif italic text-sm">{zone.alias}</p>
                  </div>
                  <Eye size={16} className="text-slate-200 group-hover:text-pc-gold transition-all" />
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Thermometer size={14} className="text-slate-400" />
                    <span className="text-xs font-medium">{zone.temp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <CloudRain size={14} className="text-slate-400" />
                    <span className="text-xs font-medium">{zone.rain}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {zone.highlights.map((item, index) => (
                    <span key={index} className="text-[9px] bg-white border border-slate-200 px-2 py-1 rounded-sm text-slate-500 font-bold uppercase tracking-tighter">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50">
                   <span className="text-[10px] font-black uppercase text-slate-400 italic">Visualize Zone</span>
                   <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMMERSIVE PREVIEW MODAL */}
      {selectedZone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] overflow-hidden relative rounded-sm shadow-2xl flex flex-col md:flex-row">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedZone(null)}
              className="absolute top-6 right-6 z-50 p-2 bg-white/20 hover:bg-pc-gold text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Left Side: Visual */}
            <div className="md:w-2/3 h-64 md:h-full relative overflow-hidden bg-slate-800">
              <img 
                src={selectedZone.previewImg} 
                className="w-full h-full object-cover opacity-80"
                alt={selectedZone.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.4em]">Survey Data 2026</span>
                <h3 className="text-white text-4xl font-serif mt-2 italic">Territorial Perspectives</h3>
              </div>
            </div>

            {/* Right Side: Data & Action */}
            <div className="md:w-1/3 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
              <div className="mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedZone.regions}</span>
                <h2 className="text-3xl font-serif text-slate-900 mt-2">{selectedZone.name}</h2>
              </div>

              <div className="space-y-6 flex-grow">
                <p className="text-sm text-slate-500 leading-relaxed font-light italic">
                  "{selectedZone.description}"
                </p>
                
                <div className="grid grid-cols-1 gap-4 py-6 border-y border-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400">Pedology</span>
                    <span className="text-xs font-bold text-slate-800">{selectedZone.soil}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400">Average Yield</span>
                    <span className="text-xs font-bold text-pc-green">Optimal</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4">
                   <h4 className="text-[10px] font-black uppercase mb-3 text-pc-gold">Nearby Infrastructure</h4>
                   <ul className="text-[11px] space-y-2 text-slate-600 font-medium">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-pc-gold rounded-full"></span>
                        Mapped natural water sources
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-pc-gold rounded-full"></span>
                        Heavy-duty truck accessibility
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-pc-gold rounded-full"></span>
                        Stable telecom network coverage
                      </li>
                   </ul>
                </div>
              </div>

              <button 
                onClick={() => setSelectedZone(null)}
                className="mt-8 w-full py-5 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-pc-green transition-all"
              >
                Explore Available Plots
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ZoneRadar;