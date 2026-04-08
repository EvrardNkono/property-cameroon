import React from 'react';

import { ArrowUpRight, ShieldCheck, TrendingUp, Map, Clock, Truck } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';

const Overview = () => {
  const { activeRoles } = useOutletContext();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em]">Tableau de Bord</span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#0a2619] mt-1 italic">Résumé de votre activité</h1>
        </div>
        <div className="text-sm text-slate-400 flex items-center gap-2">
           <Clock size={14} /> Dernière mise à jour: Aujourd'hui, 14:30
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeRoles.includes('OWNER') && (
          <div className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Map size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Patrimoine Foncier</h3>
                <p className="text-3xl font-bold text-[#0a2619] mt-2">02 Terrains</p>
                <Link to="/dashboard/properties" className="mt-6 flex items-center gap-2 text-xs font-black text-[#c5a059] uppercase tracking-widest group-hover:gap-4 transition-all">
                    Gérer mes actifs <ArrowUpRight size={14} />
                </Link>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}

        {activeRoles.includes('INVESTOR') && (
          <div className="group bg-[#0a2619] p-8 rounded-[2rem] text-white shadow-xl hover:shadow-[#0a2619]/20 transition-all duration-500 relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-[#c5a059]/20 text-[#c5a059] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                </div>
                <h3 className="text-sm font-black text-[#c5a059] uppercase tracking-widest">Investissements</h3>
                <p className="text-3xl font-bold mt-2">+12.4% <span className="text-xs font-normal text-white/50">ROI</span></p>
                <Link to="/dashboard/invest" className="mt-6 flex items-center gap-2 text-xs font-black text-[#c5a059] uppercase tracking-widest group-hover:gap-4 transition-all">
                    Opportunités CAPEF <ArrowUpRight size={14} />
                </Link>
             </div>
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rotate-45 translate-x-10 -translate-y-10"></div>
          </div>
        )}

        {activeRoles.includes('BUYER') && (
          <div className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck size={24} />
             </div>
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Sourcing Global</h3>
             <p className="text-3xl font-bold text-[#0a2619] mt-2">04 Commandes</p>
             <Link to="/dashboard/sourcing" className="mt-6 flex items-center gap-2 text-xs font-black text-[#c5a059] uppercase tracking-widest group-hover:gap-4 transition-all">
                Suivre l'expédition <ArrowUpRight size={14} />
             </Link>
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY / COMPLIANCE BLOC */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm">
         <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={20} /></div>
            <h2 className="text-xl font-serif text-[#0a2619] italic">Statut de Conformité</h2>
         </div>
         
         <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Vérification du Titre Foncier N°455/LIT</p>
                        <p className="text-xs text-slate-400 mt-1">Dossier approuvé par le cadre institutionnel</p>
                    </div>
                </div>
                <button className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest text-[#c5a059]">Détails</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Overview;