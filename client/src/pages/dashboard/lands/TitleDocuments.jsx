import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  Eye, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

const TitleDocuments = () => {
  // Liste simulée des documents officiels
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Titre Foncier n°1234/LITTORAL",
      type: "PDF",
      date: "12 Mars 2026",
      status: "Approuvé",
      property: "Terrain Ngali - Kribi"
    },
    {
      id: 2,
      name: "Certificat d'Urbanisme",
      type: "JPG",
      date: "05 Avril 2026",
      status: "En révision",
      property: "Lotissement Logbessou"
    }
  ]);

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter">DOCUMENTS FONCIERS</h1>
          <p className="text-slate-500 text-sm">Espace sécurisé pour la gestion de vos titres et justificatifs officiels.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
          <ShieldCheck className="text-green-600" size={20} />
          <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Stockage Chiffré</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : ZONE D'UPLOAD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-[#c5a059] transition-colors group cursor-pointer text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#c5a059]/10 transition-colors">
              <UploadCloud className="text-slate-400 group-hover:text-[#c5a059]" size={32} />
            </div>
            <h3 className="font-bold text-[#0a2619]">Déposer un document</h3>
            <p className="text-xs text-slate-400 mt-2">PDF, JPG ou PNG (Max. 10MB)</p>
            <button className="mt-4 px-6 py-2 bg-[#0a2619] text-white text-[10px] font-black uppercase rounded-xl">
              Parcourir
            </button>
          </div>

          <div className="bg-[#0a2619] p-6 rounded-[2rem] text-white">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-[#c5a059]" size={24} />
              <h4 className="font-bold italic">Note Importante</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-white/70">
              Tous les documents téléchargés sont soumis à une vérification par nos experts fonciers avant d'être marqués comme "Vérifiés" sur la marketplace.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE : LISTE DES DOCUMENTS */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Documents Récents</h3>
          
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#c5a059]">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a2619] text-sm">{doc.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">{doc.date}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-bold">{doc.type}</span>
                  </div>
                  <p className="text-[10px] text-[#c5a059] font-bold mt-1 uppercase tracking-tighter italic">
                    {doc.property}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`mr-4 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                  doc.status === "Approuvé" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {doc.status === "Approuvé" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {doc.status}
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0a2619]" title="Voir">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0a2619]" title="Télécharger">
                    <Download size={18} />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500" title="Supprimer">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// Petit composant local pour l'icône Clock manquante dans les imports directs
const Clock = ({size}) => <ClockIcon size={size} />;
import { Clock as ClockIcon } from 'lucide-react';

export default TitleDocuments;