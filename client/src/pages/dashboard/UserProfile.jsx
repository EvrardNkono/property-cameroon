import React from 'react';
import { User, ShieldCheck, Mail, MapPin, Camera } from 'lucide-react';

const UserProfile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER PROFIL */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-[#c5a059] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-[#0a2619]">
            E
          </div>
          <button className="absolute bottom-1 right-1 p-2 bg-[#0a2619] text-white rounded-full border-2 border-white hover:bg-slate-800 transition-colors">
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h2 className="text-3xl font-black text-[#0a2619] tracking-tighter uppercase">Evrard</h2>
            <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 mx-auto md:mx-0 w-fit">
              <ShieldCheck size={12} /> Identité Vérifiée
            </span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-1"><Mail size={14} /> evrard@example.com</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> Douala, Cameroun</span>
          </div>
        </div>
      </div>

      {/* GESTION DES RÔLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-[#0a2619] uppercase tracking-widest text-sm mb-6">Mes Rôles Actifs</h3>
          <div className="space-y-3">
            {[
              { role: "Acheteur", status: "Actif", color: "bg-blue-50 text-blue-700" },
              { role: "Propriétaire", status: "Actif", color: "bg-orange-50 text-orange-700" },
              { role: "Investisseur", status: "En attente", color: "bg-slate-100 text-slate-500" }
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-sm text-[#0a2619]">{r.role}</span>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${r.color}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-[#c5a059] mb-4 italic">Devenir Investisseur</h3>
            <p className="text-xs text-white/70 leading-relaxed mb-6">
              Pour débloquer le rôle d'investisseur et accéder aux projets de copropriété, vous devez fournir une pièce d'identité valide.
            </p>
            <button className="w-full py-3 bg-[#c5a059] text-[#0a2619] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-transform">
              Soumettre mes documents
            </button>
          </div>
          <User className="absolute -right-8 -bottom-8 text-white/5 w-40 h-40" />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;