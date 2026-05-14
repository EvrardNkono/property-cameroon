// File: src/components/agriculture/ZonePreviewModal.jsx
import React from 'react';
import { X, Maximize2, Map as MapIcon } from 'lucide-react';

const ZonePreviewModal = ({ zone, isOpen, onClose }) => {
  if (!isOpen || !zone) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative shadow-2xl">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-10 p-2 bg-slate-900/20 hover:bg-slate-900/40 text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          
          {/* VISUAL SIDE (Images/Map) */}
          <div className="lg:w-2/3 bg-slate-200 relative h-[400px] lg:h-[600px]">
            {/* Zone landscape preview with fallback */}
            <img 
              src={`/images/zones/${zone.id}-landscape.jpg`} 
              className="w-full h-full object-cover"
              alt={`${zone.name} landscape`}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop";
              }}
            />
            <div className="absolute bottom-6 left-6 bg-slate-900/80 p-4 text-white backdrop-blur-md border-l-2 border-pc-gold">
              <p className="text-[10px] uppercase tracking-widest font-bold mb-1 text-pc-gold">Precise Location</p>
              <p className="text-sm italic font-serif">{zone.regions}</p>
            </div>
          </div>

          {/* DATA SIDE */}
          <div className="lg:w-1/3 p-10 overflow-y-auto bg-white">
            <span className="text-[10px] text-pc-gold font-black uppercase tracking-widest">Territorial Details</span>
            <h2 className="text-3xl font-serif text-slate-900 mt-2 mb-6 leading-tight">{zone.name}</h2>
            
            <div className="space-y-8">
              {/* Topography Section */}
              <div>
                <h4 className="text-[11px] font-black uppercase text-slate-400 mb-3 tracking-tighter flex items-center gap-2">
                   <Maximize2 size={12}/> Relief & Topography
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed italic font-serif">
                  Plateaus rising to an average altitude of 1100m. Ideal for natural gravity-fed drainage for perennial crops.
                </p>
              </div>

              {/* Infrastructure Section */}
              <div>
                <h4 className="text-[11px] font-black uppercase text-slate-400 mb-3 tracking-tighter flex items-center gap-2">
                   <MapIcon size={12}/> Key Infrastructure
                </h4>
                <ul className="text-sm text-slate-800 font-bold space-y-3">
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-pc-green rounded-full"></span>
                     Proximity to Major Axis (N3 Highway)
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-pc-green rounded-full"></span>
                     Permanent water sources within 500m
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-pc-green rounded-full"></span>
                     Operational 4G/LTE Connectivity
                   </li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-12 py-4 bg-pc-green text-white text-[10px] uppercase font-bold tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-pc-green/10">
              Explore Titled Land Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonePreviewModal;