import React from 'react';
import { 
  Users, 
  Wallet, 
  Map, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AdminStatCard } from '../../../components/admin/AdminComponents.jsx';

const AdminOverview = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em]">Console Maître</span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#0a2619] mt-1 italic">État de la plateforme</h1>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400 border border-slate-200 px-4 py-2 rounded-full">
          Live: 08 Avril 2026
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Membres Totaux" 
          value="1,284" 
          subValue="+12% ce mois" 
          icon={Users} 
          color="bg-blue-50 text-blue-600"
        />
        <AdminStatCard 
          title="Fonds Investis" 
          value="450M FCFA" 
          subValue="+85M cette semaine" 
          icon={Wallet} 
          color="bg-green-50 text-green-600"
        />
        <AdminStatCard 
          title="Terrains en Vente" 
          value="84" 
          subValue="12 nouveaux lots" 
          icon={Map} 
          color="bg-orange-50 text-orange-600"
        />
        <AdminStatCard 
          title="Taux de Conversion" 
          value="14.2%" 
          subValue="Acheteurs vérifiés" 
          icon={TrendingUp} 
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ALERTES / VALIDATIONS EN ATTENTE */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#0a2619] flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" /> Validations Requises
            </h3>
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded">4 urgences</span>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 font-bold text-[#0a2619]">S</div>
                  <div>
                    <p className="text-sm font-bold text-[#0a2619]">Samuel Eto'o</p>
                    <p className="text-[10px] text-slate-400">Nouveau Titre Foncier à valider</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-[#c5a059] group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* DERNIÈRES TRANSACTIONS */}
        <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white shadow-xl">
          <h3 className="font-bold text-[#c5a059] mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
            <ShieldCheck size={18} /> Activité Récente
          </h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Investissement CAPEF</span>
                  <span className="text-[10px] text-white/40">Yassa, Douala</span>
                </div>
                <span className="text-sm font-black text-[#c5a059]">+15,000,000 FCFA</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;