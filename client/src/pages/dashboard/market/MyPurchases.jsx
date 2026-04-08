import React from 'react';
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  ChevronRight, 
  ExternalLink, 
  CreditCard,
  History
} from 'lucide-react';

const MyPurchases = () => {
  const purchases = [
    {
      id: "PC-8821",
      item: "Lotissement Ahala II - Lot 14",
      category: "Immobilier",
      date: "28 Mars 2026",
      amount: "12,500,000",
      status: "Acté",
      step: 4 // Étape finale sur 4
    },
    {
      id: "SC-4402",
      item: "Conteneur Carrelage Premium (Sourcing Chine)",
      category: "Matériaux",
      date: "02 Avril 2026",
      amount: "4,200,000",
      status: "En Transit",
      step: 2 // Étape 2 sur 4
    }
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter uppercase">Mes Acquisitions</h1>
          <p className="text-slate-500 text-sm">Historique et suivi en temps réel de vos achats sur Property Cameroon.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
          <button className="px-4 py-2 bg-[#0a2619] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Actifs</button>
          <button className="px-4 py-2 text-slate-400 hover:text-[#0a2619] rounded-xl text-[10px] font-black uppercase tracking-widest">Archives</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {purchases.map((order) => (
          <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* INFO PRODUIT */}
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                    {order.category === "Immobilier" ? <MapPin size={28} /> : <Package size={28} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/10 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{order.date}</span>
                    </div>
                    <h3 className="text-lg font-black text-[#0a2619] mt-1">{order.item}</h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                      Catégorie : <span className="text-[#0a2619] font-bold">{order.category}</span>
                    </p>
                  </div>
                </div>

                {/* PRIX ET STATUS */}
                <div className="flex md:flex-col justify-between items-end">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Montant Total</p>
                    <p className="text-xl font-black text-[#0a2619]">{order.amount} <span className="text-xs font-normal">FCFA</span></p>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-black text-[#c5a059] uppercase tracking-widest hover:translate-x-1 transition-transform">
                    Détails facture <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* BARRE DE PROGRESSION (TRACKER) */}
              <div className="mt-8 pt-8 border-t border-slate-50">
                <div className="flex justify-between mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression de l'acquisition</p>
                  <p className="text-[10px] font-black text-[#0a2619] uppercase bg-slate-100 px-3 py-1 rounded-full italic">
                    {order.status}
                  </p>
                </div>
                
                <div className="relative flex justify-between">
                  {/* Ligne de fond */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                  {/* Ligne active */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-[#c5a059] -translate-y-1/2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(order.step / 4) * 100}%` }}
                  />
                  
                  {/* Étapes */}
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s} 
                      className={`relative w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-colors duration-500 ${
                        s <= order.step ? 'bg-[#c5a059] text-[#0a2619]' : 'bg-slate-200 text-white'
                      }`}
                    >
                      {s <= order.step && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Commande</span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Paiement</span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Transit / Notaire</span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Livraison / Acte</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTION */}
      <div className="bg-slate-950 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#c5a059]">
            <History size={24} />
          </div>
          <div className="text-white">
            <h4 className="font-bold text-sm uppercase">Un problème avec un achat ?</h4>
            <p className="text-white/40 text-xs">Notre service client est disponible 24/7 pour vous assister.</p>
          </div>
        </div>
        <button className="w-full md:w-auto px-8 py-3 bg-[#c5a059] text-[#0a2619] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
          Contacter le Support
        </button>
      </div>
    </div>
  );
};

export default MyPurchases;