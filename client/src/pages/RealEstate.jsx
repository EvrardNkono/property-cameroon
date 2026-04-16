import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterBar from '../components/real-estate/FilterBar';
import PropertyCard from '../components/real-estate/PropertyCard';
import { MOCK_PROPERTIES } from '../data/properties'; // IMPORTATION DU FICHIER DATA

const RealEstatePage = () => {
  const [activeMode, setActiveMode] = useState('all'); 

  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    if (activeMode === 'all') return true;
    return property.status === activeMode;
  });

  const handleFilter = (filters) => {
    console.log("Deep filtering triggered:", filters);
    // Logique de filtrage par prix/type à ajouter ici
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 uppercase tracking-tighter">
            Our <span className="text-pc-gold italic font-light">Elite</span> Portfolio
          </h1>
          <div className="flex justify-center mb-4">
            <div className="bg-white/5 p-1 rounded-sm border border-white/10">
              {['all', 'sale', 'lease'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-8 py-2 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${
                    activeMode === mode ? 'bg-pc-gold text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'all' ? 'All Assets' : `For ${mode}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="px-8">
        <FilterBar onSearch={handleFilter} />
      </div>

      <main className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-slate-100 pb-8">
          <h2 className="text-2xl font-serif text-slate-900 uppercase">Featured Opportunities</h2>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            {filteredProperties.length} Results Found
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProperties.map((property) => (
            /* PropertyCard reçoit les données simplifiées mais possède le bouton vers le détail */
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RealEstatePage;