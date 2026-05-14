import React from 'react';
import { 
  BarChart3, 
  FileDown, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  DollarSign,
  Activity
} from 'lucide-react';

const YieldReports = () => {
  const reports = [
    { id: 1, period: "1er Trimestre 2026", date: "01 Avril 2026", yield: "+4.2%", payout: "850,000", status: "Disponible" },
    { id: 2, period: "4ème Trimestre 2025", date: "05 Janvier 2026", yield: "+3.8%", payout: "720,000", status: "Archive" },
    { id: 3, period: "3ème Trimestre 2025", date: "02 Octobre 2025", yield: "+5.1%", payout: "1,100,000", status: "Archive" },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter uppercase">Rapports de Rendement</h1>
          <p className="text-slate-500 text-sm">Suivez l'évolution de vos dividendes et la croissance de vos actifs.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={20} />
          </button>
          <button className="flex items-center gap-2 bg-[#c5a059] text-[#0a2619] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">
            <FileDown size={16} /> Exporter Tout (CSV)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRAPHIQUE SIMULÉ & RÉSUMÉ */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity size={120} />
            </div>
            <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Performance Globale</p>
            <h2 className="text-4xl font-black italic">+12.4%</h2>
            <p className="text-white/50 text-[11px] mt-4 leading-relaxed">
              Votre rendement est supérieur de <span className="text-green-400 font-bold">2.1%</span> par rapport à la moyenne du marché immobilier à Douala cette année.
            </p>
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between">
              <div>
                <p className="text-white/40 text-[9px] uppercase font-bold">Total Distribué</p>
                <p className="text-lg font-bold">2,670,000 <span className="text-[10px] text-[#c5a059]">FCFA</span></p>
              </div>
              <div className="w-12 h-12 bg-[#c5a059] rounded-2xl flex items-center justify-center text-[#0a2619]">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100">
            <h4 className="font-bold text-[#0a2619] mb-4 text-sm">Répartition des Gains</h4>
            <div className="space-y-4">
              {[
                { label: "Plus-value foncière", value: 70, color: "bg-[#c5a059]" },
                { label: "Revenus locatifs", value: 30, color: "bg-[#0a2619]" }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LISTE DES RAPPORTS TRIMESTRIELS */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Historique des Trimestres</h3>
          {reports.map((report) => (
            <div key={report.id} className="bg-white group p-5 rounded-3xl border border-slate-100 hover:border-[#c5a059]/30 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 group-hover:text-[#c5a059] transition-colors">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a2619]">{report.period}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar size={12} /> Publié le {report.date}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] text-green-600 font-black">{report.yield} Yield</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Dividendes</p>
                  <p className="font-bold text-[#0a2619]">{report.payout} FCFA</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 group-hover:bg-[#0a2619] text-slate-400 group-hover:text-white rounded-xl transition-all">
                  <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Télécharger</span>
                  <FileDown size={18} />
                </button>
              </div>
            </div>
          ))}

          <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-[#c5a059] hover:text-[#c5a059] transition-all">
            Charger les années précédentes
          </button>
        </div>

      </div>
    </div>
  );
};

export default YieldReports;