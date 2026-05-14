import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

const UserAccessModal = ({ isOpen, onClose, user, onUpdate }) => {
  // État local pour gérer les rôles avant de sauvegarder
  const [selectedRoles, setSelectedRoles] = useState(user?.roles || []);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !user) return null;

  const rolesConfig = [
    { id: 'ADMIN', label: 'Super Administrator', desc: 'Full access to all system settings and user management.', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'OWNER', label: 'Property Owner', desc: 'Can list properties, manage land titles, and view tenant data.', color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'INVESTOR', label: 'Investor', desc: 'Access to financial portfolios, ROI tracking, and new opportunities.', color: 'text-[#0a2619]', bg: 'bg-slate-100' },
    { id: 'BUYER', label: 'Simple Buyer', desc: 'Standard access to browse and purchase properties or sourcing.', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const handleToggleRole = (roleId) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(r => r !== roleId) 
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation d'appel API
    setTimeout(() => {
      onUpdate(user.id, selectedRoles);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a2619]/40 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-[#0a2619]">Access Control</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Managing: {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-8 space-y-4">
          {rolesConfig.map((role) => {
            const isActive = selectedRoles.includes(role.id);
            return (
              <button
                key={role.id}
                onClick={() => handleToggleRole(role.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-3xl border-2 transition-all duration-300 text-left ${
                  isActive 
                    ? `border-[#c5a059] bg-[#c5a059]/5 shadow-sm` 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#c5a059] border-[#c5a059]' : 'border-slate-200'
                }`}>
                  {isActive && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-black uppercase tracking-widest ${role.color}`}>
                      {role.label}
                    </span>
                    {isActive && (
                      <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Active</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {role.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Warning Note */}
        <div className="mx-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-center">
          <AlertCircle size={18} className="text-amber-600 shrink-0" />
          <p className="text-[10px] text-amber-700 font-medium">
            Careful: Granting <span className="font-black uppercase">Admin</span> rights allows the user to modify other members and financial data.
          </p>
        </div>

        {/* Actions */}
        <div className="p-8 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${
              isSaving 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-[#0a2619] text-[#c5a059] hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSaving ? 'Updating...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccessModal;