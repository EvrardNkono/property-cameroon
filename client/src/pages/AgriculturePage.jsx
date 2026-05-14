import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgroIntelligence from '../components/agriculture/AgroIntelligence';
import ZoneRadar from '../components/agriculture/ZoneRadar';
import LandCard from '../components/agriculture/LandCard';

// Simulated MERN backend data
const MOCK_AGRICULTURAL_LANDS = [
  { 
    id: "LAND-001", 
    title: "Mbalmayo Cocoa Estate", 
    location: "Center Region", 
    size: "25 Ha", 
    price: "12,500,000", 
    matchScore: 98,
    image: "https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: "LAND-002", 
    title: "Foumbot Volcanic Lands", 
    location: "West Region", 
    size: "10 Ha", 
    price: "35,000,000", 
    matchScore: 85,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop" 
  },
  { 
    id: "LAND-003", 
    title: "Kribi Industrial Extension", 
    location: "South Region", 
    size: "100 Ha", 
    price: "150,000,000", 
    matchScore: 75,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop" 
  }
];

const AgriculturePage = () => {
  const [activeCrop, setActiveCrop] = useState(null);
  const [filteredLands, setFilteredLands] = useState(MOCK_AGRICULTURAL_LANDS);

  // Filtering logic when a crop is selected
  const handleMatchFound = (crop) => {
    setActiveCrop(crop);
    // API Call placeholder: fetch(`/api/lands/filter?crop=${crop.id}`)
    console.log("Filtering lands for:", crop.name);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-pc-green selection:text-white">
      <Navbar />

      {/* --- AGRO HERO SECTION --- */}
      <section className="relative pt-48 pb-40 bg-slate-900 overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <span className="h-[1px] w-12 bg-pc-gold"></span>
              <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.5em]">Investment Gateway</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              Cultivate Your <br />
              <span className="text-pc-green italic font-light underline decoration-pc-gold/20">Legacy</span>.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
              Access a rigorous selection of certified agricultural lands in Cameroon, 
              analyzed by our soil experts and legally secured for international investors.
            </p>
          </div>
        </div>
      </section>

      {/* --- INTELLIGENCE SECTION (Matching Tool) --- */}
      <section className="max-w-7xl mx-auto px-8 relative -mt-20">
        <AgroIntelligence onMatchFound={handleMatchFound} />
      </section>

      {/* --- ZONES SECTION (Territorial Exploration) --- */}
      <ZoneRadar />

      {/* --- LISTING SECTION (Matching Results) --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-serif text-slate-900 uppercase tracking-tighter">
                Available <span className="text-pc-green italic font-light">Opportunities</span>
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {activeCrop 
                  ? `Optimized lands for growing: ${activeCrop.name}` 
                  : "Select a crop above to refine your search results."}
              </p>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 mt-4 md:mt-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {filteredLands.length} Assets</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredLands.map((land) => (
              <LandCard key={land.id} land={land} />
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-20 p-12 bg-slate-900 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-pc-green opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <h3 className="text-white text-2xl font-serif mb-4">Can't find the perfect plot?</h3>
            <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto italic">
              Our team can conduct a custom land search based on your specific technical requirements and crop goals.
            </p>
            <button className="px-10 py-4 border border-pc-gold text-pc-gold text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pc-gold hover:text-slate-900 transition-all">
              Launch a Search Mandate
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgriculturePage;