import React, { useState } from 'react';
import { 
  TrendingUp, 
  Truck, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Container, 
  Anchor, 
  CheckCircle,
  Clock,
  Filter,
  Download
} from 'lucide-react';

const FinancialControl = () => {
  const [activeSection, setActiveSection] = useState('SOURCING'); // SOURCING ou INVEST

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0a2619] italic">Contrôle Financier</h1>
          <p className="text-slate-500 text-sm mt-1">Flux de trésorerie, dividendes CAPEF et logistique import.</p>
        </div>
        <div className="flex gap-2">
            <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-[#0a2619] transition-all shadow-sm">
                <Download size={20} />
            </button>
            <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex">
                <button 
                  onClick={() => setActiveSection('SOURCING')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeSection === 'SOURCING' ? 'bg-[#0a2619] text-[#c5a059]' : 'text-slate-400'}`}
                >
                  Sourcing
                </button>
                <button 
                  onClick={() => setActiveSection('INVEST')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeSection === 'INVEST' ? 'bg-[#0a2619] text-[#c5a059]' : 'text-slate-400'}`}
                >
                  Investissements
                </button>
            </div>
        </div>
      </div>

      {/* DYNAMIC METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liquidités Totales</p>
            <h3 className="text-2xl font-black text-[#0a2619] mt-2">128.5M <span className="text-xs font-normal">FCFA</span></h3>
            <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-2">
                <ArrowUpRight size={12} /> +15.4%
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En cours d'importation</p>
            <h3 className="text-2xl font-black text-[#0a2619] mt-2">45.2M <span className="text-xs font-normal">FCFA</span></h3>
            <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold mt-2">
                <Clock size={12} /> 03 Conteneurs
            </div>
        </div>
        <div className="bg-[#c5a059] p-6 rounded-[2rem] shadow-xl shadow-[#c5a059]/10">
            <p className="text-[10px] font-black text-[#0a2619] uppercase tracking-widest">Dividendes à Verser</p>
            <h3 className="text-2xl font-black text-[#0a2619] mt-2">12.8M <span className="text-xs font-black opacity-60">FCFA</span></h3>
            <button className="mt-3 text-[9px] font-black bg-[#0a2619] text-white px-3 py-1.5 rounded-lg uppercase">Lancer le Paiement</button>
        </div>
      </div>

      {activeSection === 'SOURCING' ? (
        /* SECTION SOURCING CHINE */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-[#0a2619] flex items-center gap-2 italic"><Container size={20} className="text-[#c5a059]" /> Suivi des Commandes Groupées</h3>
                <Filter size={18} className="text-slate-300" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">Référence Cale</th>
                            <th className="px-8 py-4">Client Principal</th>
                            <th className="px-8 py-4">Valeur Fret</th>
                            <th className="px-8 py-4">Étape Logistique</th>
                            <th className="px-8 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { ref: "CN-DLA-445", client: "Boutique Prestige", val: "4,500,000", status: "En Mer", icon: <Anchor size={14}/> },
                            { ref: "CN-YDE-102", client: "Evrard (Perso)", val: "1,200,000", status: "Dépot Guangzhou", icon: <Clock size={14}/> }
                        ].map((row, i) => (
                            <tr key={i} className="text-sm hover:bg-slate-50/80 transition-all">
                                <td className="px-8 py-5 font-bold text-[#0a2619]">{row.ref}</td>
                                <td className="px-8 py-5 text-slate-600">{row.client}</td>
                                <td className="px-8 py-5 font-black">{row.val} <span className="text-[10px] opacity-40">FCFA</span></td>
                                <td className="px-8 py-5">
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600">
                                        {row.icon} {row.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="text-[10px] font-black text-[#c5a059] uppercase hover:underline">Mettre à jour</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ) : (
        /* SECTION CAPEF INVEST */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white">
                <h3 className="font-bold text-[#c5a059] mb-6 flex items-center gap-2 italic uppercase tracking-widest text-sm">
                    <TrendingUp size={20} /> Performances Portefeuilles
                </h3>
                <div className="space-y-6">
                    {["Immobilier Kribi", "Sourcing Textiles", "Agro-Business"].map((proj, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm">{proj}</span>
                                <span className="text-xs text-green-400 font-black">+18.5%</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#c5a059] h-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#0a2619] mb-6 flex items-center gap-2 italic">
                    <Wallet size={20} className="text-[#c5a059]" /> Flux de Trésorerie
                </h3>
                <div className="space-y-4">
                    {[
                        { label: "Encaissement Terrain #45", amount: "+4,000,000", type: "IN" },
                        { label: "Paiement Dividendes T1", amount: "-2,500,000", type: "OUT" }
                    ].map((tx, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-all">
                            <div className="flex items-center gap-3">
                                {tx.type === 'IN' ? <ArrowDownLeft className="text-green-500" /> : <ArrowUpRight className="text-red-500" />}
                                <span className="text-xs font-bold text-slate-700">{tx.label}</span>
                            </div>
                            <span className={`text-xs font-black ${tx.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FinancialControl;