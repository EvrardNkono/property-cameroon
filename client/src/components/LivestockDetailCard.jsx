import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShieldCheck, Thermometer, Activity, ArrowRight, X } from 'lucide-react';

const LivestockDetailCard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('conditions');

  if (!data) return null;

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-emerald-900/5 shadow-2xl w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* --- IMAGE --- */}
        <div className="relative h-[300px] lg:h-auto overflow-hidden">
          <img 
            src={data.image} 
            alt={data.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 bg-emerald-950 text-amber-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 backdrop-blur-md">
            {data.type || data.category}
          </div>
        </div>

        {/* --- CONTENU --- */}
        <div className="p-8 lg:p-14 bg-[#fdfcf0]/30 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-emerald-900/40 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Activity size={14} className="text-amber-600" />
              Exploitation Certifiée
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-emerald-950 mb-2">{data.name}</h2>
            <p className="text-emerald-900/60 font-light italic text-sm">
              Propriétaire : <span className="text-emerald-950 font-medium not-italic">{data.owner}</span>
            </p>
          </div>

          {/* --- TABS --- */}
          <div className="flex gap-6 border-b border-emerald-900/10 mb-6">
            {['conditions', 'localisation', 'rendement'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[9px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-emerald-950' : 'text-emerald-900/30'
                }`}
              >
                {tab}
                {activeTab === tab && (
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
                    <p>{data.conditionsDesc}</p>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                        <Thermometer size={14} className="text-amber-600" />
                        <span className="text-[9px] font-bold uppercase text-emerald-900">{data.temp}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'localisation' && (
                  <div>
                    <div className="flex items-center gap-2 text-emerald-950 mb-2">
                      <MapPin size={16} className="text-amber-600" />
                      <span className="font-serif text-lg">{data.zone || data.location}</span>
                    </div>
                    <p>{data.locationDesc}</p>
                  </div>
                )}

                {activeTab === 'rendement' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-emerald-50">
                      <span className="block text-[7px] font-black text-emerald-900/30 uppercase mb-1">Cycle</span>
                      <span className="text-lg font-serif text-emerald-950">{data.cycle}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-emerald-50">
                      <span className="block text-[7px] font-black text-emerald-900/30 uppercase mb-1">Poids Cible</span>
                      <span className="text-lg font-serif text-emerald-950">{data.maturite}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- CTA --- */}
          <div className="mt-10 pt-8 border-t border-emerald-900/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="block text-[8px] font-black text-emerald-900/30 uppercase">Coût du projet</span>
              <span className="text-2xl font-serif text-amber-600">{data.price} <span className="text-[10px] text-emerald-900/40">XAF</span></span>
            </div>
            <button className="bg-emerald-950 text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2">
              Réserver cette unité <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockDetailCard;