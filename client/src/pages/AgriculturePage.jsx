import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgroIntelligence from '../components/agriculture/AgroIntelligence';
import ZoneRadar from '../components/agriculture/ZoneRadar';
import LandCard from '../components/agriculture/LandCard';
import { Loader2 } from 'lucide-react';
import api from '../services/api';

const AgriculturePage = () => {
  const [activeCrop, setActiveCrop] = useState(null);
  const [filteredLands, setFilteredLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allAgriculturalLands, setAllAgriculturalLands] = useState([]);
  const [regionStats, setRegionStats] = useState([]);

  // Load all agricultural lands from API
  const fetchAgriculturalLands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getAgriculturalLands({ status: 'PUBLISHED' });
      const lands = response.lands || [];
      
      // Transform data for LandCard format
      const formattedLands = lands.map(land => ({
        id: land._id,
        title: land.title,
        location: `${land.location?.city || ''}, ${land.location?.region || ''}`,
        size: `${land.surface?.value || 0} ${land.surface?.unit || 'Ha'}`,
        price: land.price?.amount?.toLocaleString() || '0',
        matchScore: land.matchScore || calculateMatchScore(land, activeCrop),
        image: land.images?.[0] || 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop',
        description: land.description,
        agricultureDetails: land.agricultureDetails,
        soilQuality: land.agricultureDetails?.soilQuality || 0,
        waterAccess: land.agricultureDetails?.waterAccess || false,
        primaryCrop: land.agricultureDetails?.primaryCrop
      }));
      
      setAllAgriculturalLands(formattedLands);
      setFilteredLands(formattedLands);
      
      // Load regional statistics
      const statsResponse = await api.getAgricultureRegionStats();
      setRegionStats(statsResponse.stats || []);
      
    } catch (err) {
      console.error('Error fetching agricultural lands:', err);
      setError(err.message || 'Error loading agricultural lands');
      
      // Fallback data
      const fallbackLands = [
        { 
          id: "LAND-001", 
          title: "Mbalmayo Cocoa Estate", 
          location: "Center Region", 
          size: "25 Ha", 
          price: "12,500,000", 
          matchScore: 98,
          soilQuality: 85,
          waterAccess: true,
          primaryCrop: 'cocoa',
          image: "https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop" 
        },
        { 
          id: "LAND-002", 
          title: "Foumbot Volcanic Lands", 
          location: "West Region", 
          size: "10 Ha", 
          price: "35,000,000", 
          matchScore: 85,
          soilQuality: 90,
          waterAccess: true,
          primaryCrop: 'coffee',
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop" 
        },
        { 
          id: "LAND-003", 
          title: "Kribi Industrial Extension", 
          location: "South Region", 
          size: "100 Ha", 
          price: "150,000,000", 
          matchScore: 75,
          soilQuality: 60,
          waterAccess: false,
          primaryCrop: 'palm',
          image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop" 
        }
      ];
      setAllAgriculturalLands(fallbackLands);
      setFilteredLands(fallbackLands);
    } finally {
      setLoading(false);
    }
  };

  // Calculate match score between land and crop
  const calculateMatchScore = (land, crop) => {
    if (!crop) return land.matchScore || 75;
    
    let score = land.soilQuality || 70;
    
    // Compatibility bonuses
    if (land.agricultureDetails?.cropCompatibility?.includes(crop.id)) score += 15;
    if (land.primaryCrop === crop.id) score += 10;
    if (land.waterAccess) score += 10;
    
    // Geographic bonuses
    if (crop.id === 'cocoa' && land.location?.includes('Center')) score += 10;
    if (crop.id === 'coffee' && land.location?.includes('West')) score += 10;
    if (crop.id === 'palm' && parseInt(land.size) >= 50) score += 10;
    
    return Math.min(100, Math.max(40, score));
  };

  // Filter lands by selected crop
  const handleMatchFound = async (crop) => {
    setActiveCrop(crop);
    setLoading(true);
    
    try {
      const response = await api.filterAgriculturalByCrop(crop.id);
      const lands = response.lands || [];
      
      const formattedLands = lands.map(land => ({
        id: land._id,
        title: land.title,
        location: `${land.location?.city || ''}, ${land.location?.region || ''}`,
        size: `${land.surface?.value || 0} ${land.surface?.unit || 'Ha'}`,
        price: land.price?.amount?.toLocaleString() || '0',
        matchScore: land.matchScore || calculateMatchScore(land, crop),
        image: land.images?.[0] || 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop',
        description: land.description,
        soilQuality: land.agricultureDetails?.soilQuality || 0,
        waterAccess: land.agricultureDetails?.waterAccess || false,
        primaryCrop: land.agricultureDetails?.primaryCrop
      })).sort((a, b) => b.matchScore - a.matchScore);
      
      setFilteredLands(formattedLands);
      
    } catch (err) {
      console.error('Error filtering lands:', err);
      // Local fallback filtering
      const filtered = allAgriculturalLands.filter(land => {
        if (crop.id === 'cocoa') return land.primaryCrop === 'cocoa' || land.location?.includes('Center');
        if (crop.id === 'coffee') return land.primaryCrop === 'coffee' || land.location?.includes('West');
        if (crop.id === 'palm') return land.primaryCrop === 'palm' || parseInt(land.size) >= 50;
        return true;
      });
      setFilteredLands(filtered);
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveCrop(null);
    setFilteredLands(allAgriculturalLands);
  };

  useEffect(() => {
    fetchAgriculturalLands();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-pc-green selection:text-white">
      <Navbar />

      {/* --- AGRO HERO SECTION --- */}
      <section className="relative pt-48 pb-40 bg-slate-900 overflow-hidden">
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
      <ZoneRadar regionStats={regionStats} />

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
              <p className="text-xs text-green-600 mt-1">
                ✅ Connected to dedicated agricultural API
              </p>
            </div>
            <div className="flex gap-3">
              {activeCrop && (
                <button 
                  onClick={handleResetFilters}
                  className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Reset Filters
                </button>
              )}
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total: {filteredLands.length} Assets
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 size={48} className="text-pc-green animate-spin" />
              <p className="text-slate-500 text-sm">Loading opportunities...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
              <p className="font-bold">Loading Error</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={fetchAgriculturalLands}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {filteredLands.map((land) => (
                <LandCard key={land.id} land={land} />
              ))}
            </div>
          )}

          {!loading && !error && filteredLands.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 font-medium">No agricultural lands match your criteria</p>
              <button 
                onClick={handleResetFilters}
                className="mt-4 text-pc-green font-bold text-sm hover:underline"
              >
                View all opportunities
              </button>
            </div>
          )}

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