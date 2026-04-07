import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterBar from '../components/real-estate/FilterBar';
import PropertyCard from '../components/real-estate/PropertyCard';

// Full Catalog - 20 Professional Listings for Yaoundé & Cameroon
const MOCK_PROPERTIES = [
  { id: 1, title: "Ambassadorial Villa - Bastos", type: "house", category: "Villa", status: "sale", price: "750,000,000", location: "Bastos (Secure Zone), Yaoundé", beds: 8, baths: 7, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, title: "Penthouse Horizon - Golf Club View", type: "apartment", category: "Penthouse", status: "lease", price: "1,500,000", location: "Golf, Yaoundé", beds: 4, baths: 4, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop" },
  { id: 3, title: "Modern Duplex - Santa Barbara", type: "house", category: "Duplex", status: "sale", price: "420,000,000", location: "Santa Barbara, Yaoundé", beds: 5, baths: 5, image: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, title: "Family Compound - Odza", type: "house", category: "Residence", status: "sale", price: "185,000,000", location: "Odza (Petit-Paris), Yaoundé", beds: 5, baths: 3, image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop" },
  { id: 5, title: "Titled Land - Near Airport", type: "land", category: "Building Plot", status: "sale", price: "35,000,000", location: "Nsimalen, Yaoundé", size: "1,000", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop" },
  { id: 6, title: "Furnished Apartment - Biyem-Assi", type: "apartment", category: "Furnished", status: "lease", price: "450,000", location: "Biyem-Assi (Acacias), Yaoundé", beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" },
  { id: 7, title: "Corporate HQ - Kennedy Avenue", type: "office", category: "Building", status: "lease", price: "5,000,000", location: "Avenue Kennedy, Yaoundé", size: "800", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
  { id: 8, title: "Street Front Store - Mvan", type: "shop", category: "Retail", status: "lease", price: "300,000", location: "Mvan (Main Road), Yaoundé", size: "60", image: "https://images.unsplash.com/photo-1555529669-2269763671c0?q=80&w=1974&auto=format&fit=crop" },
  { id: 9, title: "Industrial Warehouse - Magzi Zone", type: "office", category: "Warehouse", status: "sale", price: "850,000,000", location: "Magzi (Industrial Zone), Yaoundé", size: "2,500", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" },
  { id: 10, title: "Modern Studio - Ngousso", type: "studio", category: "Studio", status: "lease", price: "135,000", location: "Ngousso (Near CHU), Yaoundé", beds: 1, baths: 1, image: "https://images.unsplash.com/photo-1536376074432-af7158d15fe4?q=80&w=2070&auto=format&fit=crop" },
  { id: 11, title: "Student Residence - Soa", type: "house", category: "Hostel", status: "sale", price: "120,000,000", location: "Soa (University District)", beds: 12, baths: 12, image: "https://images.unsplash.com/photo-1555854817-2b22603c76de?q=80&w=2071&auto=format&fit=crop" },
  { id: 12, title: "Cozy Room - Emana", type: "studio", category: "Room", status: "lease", price: "60,000", location: "Emana, Yaoundé", beds: 1, baths: 1, image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=2070&auto=format&fit=crop" },
  { id: 13, title: "Cocoa Plantation - Fertile Soil", type: "field", category: "Farmland", status: "sale", price: "25,000,000", location: "Obala (Lékié)", size: "50,000", image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop" },
  { id: 14, title: "Maize Field - Seasonal Lease", type: "field", category: "Agricultural", status: "lease", price: "2,000,000", location: "Soa (Rural Zone)", size: "20,000", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop" },
  { id: 15, title: "Livestock Farm - Ready to Use", type: "field", category: "Farm", status: "sale", price: "85,000,000", location: "Okola, Centre", size: "15,000", image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2073&auto=format&fit=crop" },
  { id: 16, title: "Beachfront Plot - Kribi", type: "land", category: "Seaside Plot", status: "sale", price: "95,000,000", location: "Lobe, Kribi", size: "1,200", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" },
  { id: 17, title: "Luxury Loft - Akwa", type: "apartment", category: "Loft", status: "lease", price: "900,000", location: "Akwa, Douala", beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop" },
  { id: 18, title: "Secured Mini-Villa - Mendong", type: "house", category: "Mini-Villa", status: "sale", price: "75,000,000", location: "Mendong, Yaoundé", beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop" },
  { id: 19, title: "Executive Office - Warda", type: "office", category: "Office Suite", status: "lease", price: "600,000", location: "Warda (Business District)", size: "85", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" },
  { id: 20, title: "Commercial Warehouse - Douala Port", type: "office", category: "Logistics", status: "sale", price: "1,200,000,000", location: "Port Area, Douala", size: "5,000", image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=2070&auto=format&fit=crop" }
];

const RealEstatePage = () => {
  const [activeMode, setActiveMode] = useState('all'); 

  // Filtering Logic
  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    if (activeMode === 'all') return true;
    return property.status === activeMode;
  });

  const handleFilter = (filters) => {
    console.log("Deep filtering triggered:", filters);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/patterns/grid.svg')]"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 uppercase tracking-tighter">
            Our <span className="text-pc-gold italic font-light">Elite</span> Portfolio
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-10 font-light tracking-wide">
            Discover verified institutional-grade assets across Cameroon's primary strategic hubs. 
            From luxury residences to agricultural frontiers.
          </p>

          {/* GLOBAL TOGGLE (Sale vs Lease) */}
          <div className="flex justify-center mb-4">
            <div className="bg-white/5 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
              {['all', 'sale', 'lease'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-8 py-2 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                    activeMode === mode 
                      ? 'bg-pc-gold text-white shadow-lg shadow-pc-gold/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'all' ? 'All Assets' : `For ${mode}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <div className="px-8">
        <FilterBar onSearch={handleFilter} />
      </div>

      {/* 3. LISTING GRID */}
      <main className="max-w-7xl mx-auto px-8 py-24">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-100 pb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif text-slate-900 uppercase">Featured Opportunities</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-2 font-black">
               {activeMode === 'all' ? 'Institutional Grade Inventory' : `Verified Assets for ${activeMode}`}
            </p>
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold bg-slate-50 px-3 py-1 rounded-full">
            {filteredProperties.length} Results Found
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-slate-400 font-serif italic text-xl">No assets currently match your selection.</p>
            <button onClick={() => setActiveMode('all')} className="mt-4 text-pc-gold text-[10px] uppercase font-bold tracking-widest">Reset View</button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RealEstatePage;