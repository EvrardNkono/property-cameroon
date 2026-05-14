import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe,
  Briefcase,
  Calendar
} from 'lucide-react';

const Portfolio = () => {
  // Données simulées du portefeuille de l'investisseur
  const stats = [
    { label: "Capital Investi", value: "25,500,000", unit: "FCFA", icon: <Wallet size={20} />, trend: "+12%", up: true },
    { label: "Valeur Actuelle", value: "28,750,000", unit: "FCFA", icon: <TrendingUp size={20} />, trend: "+3.2M", up: true },
    { label: "Rendement Moyen", value: "14.5", unit: "%", icon: <PieChart size={20} />, trend: "Annuel", up: true },
  ];

  const investments = [
    {
      id: 1,
      name: "Projet Kribi Marina",
      type: "Copropriété",
      amount: "10,000,000",
      gain: "+18%",
      status: "En cours",
      date: "Oct 2025"
    },
    {
      id: 2,
      name: "Extension Douala-Lendi",
      type: "Achat-Revente",
      amount: "15,500,000",
      gain: "+8%",
      status: "Sécurisé",
      date: "Jan 2026"
    }
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter uppercase">Mon Portefeuille</h1>
          <p className="text-slate-500 text-sm">Analyse de vos performances immobilières au Cameroun.</p>
        </div>
        <button className="bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
          <Briefcase size={16} /> Nouvel Investissement
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="w-10 h-10 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[#c5a059] mb-4 shadow-inner">
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-2xl font-black text-[#0a2619]">{stat.value}</h2>
                <span className="text-[10px] font-bold text-slate-400">{stat.unit}</span>
              </div>
              <div className={`mt-3 flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LISTE DES INVESTISSEMENTS ACTIFS */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-[#0a2619] flex items-center gap-2">
            <Globe size={18} className="text-[#c5a059]" />
            Actifs Déténus
          </h3>
          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 uppercase">
            {investments.length} PROJETS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Projet</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-[#0a2619] text-sm">{inv.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Calendar size={10} /> Acquis en {inv.date}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded-lg">
                      {inv.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-sm text-[#0a2619]">{inv.amount} FCFA</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1 text-green-600 font-black text-sm">
                      <ArrowUpRight size={14} /> {inv.gain}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-[#c5a059] uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-[#c5a059] group-hover:text-[#0a2619] transition-all">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;