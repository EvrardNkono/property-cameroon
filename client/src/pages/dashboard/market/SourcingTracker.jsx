import React from 'react';
import { Truck, Anchor, ShieldCheck, Box, MapPin, AlertCircle, Phone } from 'lucide-react';

const SourcingTracker = () => {
  const shipments = [
    {
      id: "SHIP-CN-237-01",
      item: "Sanitaires & Robinetterie Luxe",
      origin: "Foshan, Chine",
      destination: "Douala Port (DIT)",
      status: "En mer",
      eta: "15 Mai 2026",
      progress: 65,
      currentLocation: "Océan Indien (proche Afrique du Sud)"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter uppercase">Suivi Sourcing & Logistique</h1>
        <p className="text-slate-500 text-sm">Traçabilité complète de vos importations depuis l'Asie.</p>
      </div>

      {shipments.map((ship) => (
        <div key={ship.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CARTE DE SUIVI PRINCIPALE */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 bg-[#0a2619] text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.2em]">Expédition active</span>
                <h2 className="text-xl font-bold">{ship.item}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase font-bold">ID Tracking</p>
                <p className="font-mono text-[#c5a059]">{ship.id}</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* VOYAGE */}
              <div className="flex justify-between items-center relative">
                <div className="z-10 bg-white p-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0a2619] border border-slate-100">
                    <Box size={24} />
                  </div>
                  <p className="text-[10px] font-black mt-2 uppercase text-center">{ship.origin}</p>
                </div>

                <div className="flex-1 h-[2px] bg-slate-100 relative mx-[-10px]">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#c5a059] transition-all duration-1000" 
                    style={{ width: `${ship.progress}%` }} 
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{ left: `${ship.progress}%` }}
                  >
                    <Anchor size={20} className="text-[#c5a059] bg-white rounded-full p-1 border border-[#c5a059] -mt-1" />
                  </div>
                </div>

                <div className="z-10 bg-white p-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                    <MapPin size={24} />
                  </div>
                  <p className="text-[10px] font-black mt-2 uppercase text-center">{ship.destination}</p>
                </div>
              </div>

              {/* DETAILS LOGISTIQUES */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Position Actuelle</p>
                  <p className="text-xs font-bold text-[#0a2619] mt-1 italic">{ship.currentLocation}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Arrivée Estimée (ETA)</p>
                  <p className="text-xs font-bold text-[#c5a059] mt-1">{ship.eta}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Statut Douane</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span className="text-xs font-bold text-green-600">Documents Pré-validés</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS & CONTACT */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="font-bold text-[#0a2619]">Besoin d'aide ?</h3>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Des questions sur les frais de douane ou le dédouanement au Port de Douala ?
              </p>
              <button className="w-full mt-6 py-3 bg-[#0a2619] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Phone size={14} /> Contacter l'agent
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SourcingTracker;