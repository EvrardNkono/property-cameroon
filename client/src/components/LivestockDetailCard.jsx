import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShieldCheck, Thermometer, Activity, ArrowRight, X } from 'lucide-react';
// import api from '../services/api'; // À décommenter quand backend sera prêt

// 🔥 Auto environment detection
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// Hardcoded URLs based on environment
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           // Local URL
  : 'https://property-cameroon-backend.vercel.app';  // Production URL

const LivestockDetailCard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('conditions');

  // Utility function to ensure image has correct URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/livestock/${image}`;
  };

  // Debug log (optional)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`🌍 LivestockDetailCard - Environment: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
    console.log(`🔗 LivestockDetailCard - Backend URL: ${BACKEND_URL}`);
  }

  if (!data) return null;

  // ==================== MAPPING DONNÉES BACKEND ====================
  // Supporte à la fois les données du backend et les mock data
  const backendData = {
    // Identifiants
    id: data._id || data.id,
    
    // Informations de base
    name: data.title || data.name,
    owner: data.owner?.name || data.owner || "CAPEF Certified Farm",
    category: data.category,
    type: data.category,
    
    // Description et conditions
    conditionsDesc: data.description || "Modern livestock facility with complete infrastructure. Includes training and technical support.",
    temp: data.features?.hasElectricity ? "Climate Controlled" : "Natural Ventilation",
    
    // Localisation
    location: data.location?.city || data.location || "Cameroon",
    zone: data.location?.district || data.location?.city || "Cameroon",
    locationDesc: `Located in ${data.location?.city || "Cameroon"}, ${data.location?.region || ""}. Easy access to main roads and markets.`,
    
    // Performance
    cycle: data.cycleDuration || "6-12 months",
    maturite: data.capacity?.value ? `${data.capacity.value} ${data.capacity.unit || "units"}` : "Varies by breed",
    
    // Prix
    price: data.price?.amount ? `${(data.price.amount / 1000000).toFixed(1)}M` : "Contact for pricing",
    
    // Images
    image: data.images && data.images[0] ? data.images[0] : null,
    
    // ROI
    roi: data.roi || 0,
    
    // Status
    status: data.status || 'AVAILABLE'
  };

  // Ensure image uses correct URL
  if (backendData.image && !backendData.image.startsWith('http')) {
    backendData.image = getImageUrl(backendData.image);
  }

  // Fonction pour gérer la réservation
  const handleReserve = async () => {
    // TODO: Implémenter la logique de réservation
    console.log('Reserving livestock unit:', backendData.id);
    // await api.reserveLivestock(backendData.id);
    alert(`Reservation request sent for ${backendData.name}. A representative will contact you shortly.`);
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-emerald-900/5 shadow-2xl w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* --- IMAGE --- */}
        <div className="relative h-[300px] lg:h-auto overflow-hidden">
          <img 
            src={backendData.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'} 
            alt={backendData.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
            }}
          />
          <div className="absolute top-6 left-6 bg-emerald-950 text-amber-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 backdrop-blur-md">
            {backendData.type || backendData.category}
          </div>
          
          {/* ROI Badge */}
          {backendData.roi > 0 && (
            <div className="absolute top-6 right-6 bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              +{backendData.roi}% ROI
            </div>
          )}
        </div>

        {/* --- CONTENT --- */}
        <div className="p-8 lg:p-14 bg-[#fdfcf0]/30 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-emerald-900/40 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Activity size={14} className="text-amber-600" />
              Certified Operation
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-emerald-950 mb-2">{backendData.name}</h2>
            <p className="text-emerald-900/60 font-light italic text-sm">
              Owner: <span className="text-emerald-950 font-medium not-italic">{backendData.owner}</span>
            </p>
          </div>

          {/* --- TABS --- */}
          <div className="flex gap-6 border-b border-emerald-900/10 mb-6">
            {[
              { id: 'conditions', label: 'CONDITIONS' },
              { id: 'localisation', label: 'LOCATION' },
              { id: 'rendement', label: 'PERFORMANCE' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-[9px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? 'text-emerald-950' : 'text-emerald-900/30'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabPopup" className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-600" />
                )}
              </button>
            ))}
          </div>

          {/* --- TAB CONTENT --- */}
          <div className="min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-emerald-900/70 text-sm leading-relaxed font-light"
              >
                {activeTab === 'conditions' && (
                  <div>
                    <p>{backendData.conditionsDesc}</p>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                        <Thermometer size={14} className="text-amber-600" />
                        <span className="text-[9px] font-bold uppercase text-emerald-900">{backendData.temp}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'localisation' && (
                  <div>
                    <div className="flex items-center gap-2 text-emerald-950 mb-2">
                      <MapPin size={16} className="text-amber-600" />
                      <span className="font-serif text-lg">{backendData.zone || backendData.location}</span>
                    </div>
                    <p>{backendData.locationDesc}</p>
                  </div>
                )}

                {activeTab === 'rendement' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-emerald-50">
                      <span className="block text-[7px] font-black text-emerald-900/30 uppercase mb-1">CYCLE</span>
                      <span className="text-lg font-serif text-emerald-950">{backendData.cycle}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-emerald-50">
                      <span className="block text-[7px] font-black text-emerald-900/30 uppercase mb-1">TARGET WEIGHT</span>
                      <span className="text-lg font-serif text-emerald-950">{backendData.maturite}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- CTA --- */}
          <div className="mt-10 pt-8 border-t border-emerald-900/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="block text-[8px] font-black text-emerald-900/30 uppercase">PROJECT COST</span>
              <span className="text-2xl font-serif text-amber-600">{backendData.price} <span className="text-[10px] text-emerald-900/40">XAF</span></span>
            </div>
            <button 
              onClick={handleReserve}
              className="bg-emerald-950 text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2"
            >
              Reserve this unit <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockDetailCard;