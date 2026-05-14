import React from 'react';
import { MapPin, ShieldCheck, Droplets, Gauge, ArrowRight, Activity } from 'lucide-react';

const LandCard = ({ land }) => {
  // Compatibility score simulation (could be calculated via selected crop)
  const matchScore = land.matchScore || 92;

  return (
    <div className="group bg-white border border-slate-100 flex flex-col md:flex-row h-full hover:shadow-2xl transition-all duration-500 overflow-hidden">
      
      {/* VISUAL SECTION */}
      <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
        <img 
          src={land.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"} 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          alt={land.title}
        />
        
        {/* Compatibility Score Badge */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 flex items-center gap-2 border border-pc-gold/30">
          <Activity size={12} className="text-pc-green animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            Match: <span className="text-pc-gold">{matchScore}%</span>
          </span>
        </div>

        {/* Legal Status Badge */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="bg-pc-green text-white text-[8px] font-black uppercase px-2 py-1 tracking-tighter shadow-lg">
            Land Title Verified
          </span>
        </div>
      </div>

      {/* DATA & SPECS SECTION */}
      <div className="md:w-3/5 p-8 flex flex-col justify-between bg-white">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              ID: {land.id || "AGR-237"}
            </span>
            <div className="flex items-center gap-1 text-pc-gold">
              <ShieldCheck size={14} />
              <span className="text-[8px] font-bold uppercase tracking-wide">PC-Audit Certified</span>
            </div>
          </div>

          <h3 className="text-2xl font-serif text-slate-900 mb-1 group-hover:text-pc-green transition-colors uppercase tracking-tighter">
            {land.title || "Sangmélima Agricultural Estate"}
          </h3>
          
          <div className="flex items-center gap-1 text-slate-400 mb-6">
            <MapPin size={12} />
            <span className="text-[10px] font-medium italic">{land.location || "South Region, Cameroon"}</span>
          </div>

          {/* TECHNICAL GRID (Soil Intelligence) */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 mb-6">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-slate-400 mb-1 flex items-center gap-1">
                <Gauge size={10} /> Soil pH
              </span>
              <span className="text-sm font-bold text-slate-800">5.8 (Slightly Acidic)</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-slate-400 mb-1 flex items-center gap-1">
                <Droplets size={10} /> Drainage
              </span>
              <span className="text-sm font-bold text-slate-800">Excellent (Gravity-fed)</span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <span className="block text-[8px] uppercase font-black text-slate-400">Total Surface Area</span>
              <span className="text-xl font-serif font-black text-slate-900">{land.size || "50 Ha"}</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] uppercase font-black text-slate-400">Initial Investment</span>
              <span className="text-xl font-black text-pc-green">{land.price || "15.5M"} FCFA</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-2">
          <button className="flex-grow py-4 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest hover:bg-pc-gold hover:text-slate-900 transition-all flex items-center justify-center gap-2 group/btn">
            Full Analysis <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <button className="px-4 border border-slate-200 hover:bg-slate-50 transition-colors">
            <Activity size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;