import React from 'react';

/**
 * 1. CARTE DE STATISTIQUE (AdminStatCard)
 * Utilisée dans AdminOverview et FinancialControl
 */
export const AdminStatCard = ({ title, value, subValue, icon: Icon, color }) => {
  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        {/* Icône avec fond dynamique */}
        <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110 shadow-sm`}>
          {Icon && <Icon size={22} />}
        </div>
        
        {/* Textes de données */}
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            {title}
          </span>
          <h3 className="text-2xl font-black text-[#0a2619] mt-2 tabular-nums">
            {value}
          </h3>
        </div>
      </div>
      
      {/* Footer de la carte */}
      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
          {subValue}
        </p>
        <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
};

/**
 * 2. BADGE DE STATUT (AdminStatusBadge)
 * Pour uniformiser les statuts (Validé, En attente, Rejeté)
 */
export const AdminStatusBadge = ({ status }) => {
  const styles = {
    PUBLISHED: "bg-green-50 text-green-600 border-green-100",
    PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
    SOLD: "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <span className={`px-2 py-1 rounded-md border text-[8px] font-black uppercase tracking-wider ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};

/**
 * 3. BOUTON D'ACTION (AdminActionButton)
 * Pour les icônes d'édition, suppression, etc.
 */
export const AdminActionButton = ({ icon: Icon, onClick, variant = "default" }) => {
  const variants = {
    default: "bg-white border-slate-100 text-slate-400 hover:text-[#c5a059] hover:border-[#c5a059]/30",
    danger: "bg-white border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100",
    primary: "bg-[#0a2619] text-[#c5a059] shadow-lg hover:scale-105",
  };

  return (
    <button 
      onClick={onClick}
      className={`p-2.5 border rounded-xl transition-all shadow-sm ${variants[variant]}`}
    >
      {Icon && <Icon size={16} />}
    </button>
  );
};

/**
 * 4. SECTION HEADER (AdminSectionHeader)
 * Titre de section réutilisable avec description
 */
export const AdminSectionHeader = ({ title, description }) => (
  <div className="mb-6">
    <h2 className="text-xl font-serif text-[#0a2619] italic">{title}</h2>
    {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
  </div>
);