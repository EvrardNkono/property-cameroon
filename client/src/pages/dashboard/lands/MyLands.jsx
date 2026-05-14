import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, MapPin, Maximize2, CheckCircle2, Clock, MoreVertical, Search } from 'lucide-react';

const MyLands = () => {
  const { activeRoles } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Données de test (Simulées)
  const [lands] = useState([
    {
      id: 1,
      title: "Terrain Balnéaire - Ngali",
      location: "Kribi, Sud",
      surface: 500,
      price: "15,000,000",
      status: "Vérifié",
      type: "Titre Foncier Global"
    },
    {
      id: 2,
      title: "Lotissement Logbessou",
      location: "Douala V, Littoral",
      surface: 300,
      price: "7,500,000",
      status: "En attente",
      type: "Mutation Totale"
    }
  ]);

  return (
    <div className="space-y-8">
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter">MES BIENS IMMOBILIERS</h1>
          <p className="text-slate-500 text-sm">Gérez vos propriétés et suivez l'état de vos titres fonciers.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-[#c5a059] text-[#0a2619] font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-[#b08d4a] transition-all transform hover:scale-105 text-sm">
          <Plus size={20} /> AJOUTER UN BIEN
        </button>
      </div>

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un terrain (ville, quartier...)" 
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* GRILLE DES BIENS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lands.map((land) => (
          <div key={land.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            {/* Image Placeholder */}
            <div className="h-48 bg-slate-200 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  land.status === "Vérifié" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {land.status === "Vérifié" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {land.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xl font-black">{land.price} <span className="text-xs font-normal">FCFA</span></p>
              </div>
            </div>

            {/* Détails */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#0a2619] text-lg leading-tight">{land.title}</h3>
                <button className="text-slate-400 hover:text-[#0a2619]"><MoreVertical size={20} /></button>
              </div>
              
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                <MapPin size={14} className="text-[#c5a059]" />
                {land.location}
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#c5a059]">
                    <Maximize2 size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{land.surface} m²</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#c5a059]">
                    <FileCheck size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase leading-none">{land.type}</span>
                </div>
              </div>

              <button className="w-full mt-2 py-3 bg-[#0a2619] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                Voir les documents
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Import manquant pour l'icône de document dans la carte
const FileCheck = ({size}) => <FileCheckLucide size={size} />;
import { FileCheck as FileCheckLucide } from 'lucide-react';

export default MyLands;