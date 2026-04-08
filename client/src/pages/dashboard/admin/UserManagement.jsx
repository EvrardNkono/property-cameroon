import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  ShieldAlert, 
  Filter,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const UserManagement = () => {
  const { activeRoles } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Simulation de données (À remplacer par ton API plus tard)
  const users = [
    { id: 1, name: "Evrard", email: "evrard@capef.cm", roles: ['ADMIN', 'OWNER'], status: 'Vérifié', joinDate: '12 Mars 2026' },
    { id: 2, name: "Samuel Eto'o", email: "sam@legend.com", roles: ['INVESTOR', 'OWNER'], status: 'Vérifié', joinDate: '01 Février 2026' },
    { id: 3, name: "Jean Dupont", email: "j.dupont@orange.fr", roles: ['BUYER'], status: 'En attente', joinDate: '05 Avril 2026' },
    { id: 4, name: "Marie Ngo", email: "marie.ngo@test.cm", roles: ['OWNER'], status: 'Vérifié', joinDate: '20 Janvier 2026' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || user.roles.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0a2619] italic">Gestion des Membres</h1>
          <p className="text-slate-500 text-sm mt-1">Supervision des accès et des accréditations de la plateforme.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
          <UserPlus size={16} /> Créer un Utilisateur
        </button>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div className="lg:col-span-2 flex flex-wrap gap-2">
          {['ALL', 'OWNER', 'INVESTOR', 'BUYER', 'ADMIN'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === filter 
                ? 'bg-[#c5a059] text-[#0a2619] shadow-md' 
                : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {filter === 'ALL' ? 'Tous' : filter}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un nom ou email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôles</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inscription</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vérification</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0a2619] text-[#c5a059] rounded-xl flex items-center justify-center font-black text-xs shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#0a2619] text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Mail size={10}/> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map(role => (
                        <span key={role} className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${
                          role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                    {user.joinDate}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] font-black uppercase flex items-center gap-1.5 ${
                      user.status === 'Vérifié' ? 'text-green-600' : 'text-orange-500'
                    }`}>
                      {user.status === 'Vérifié' ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-[#0a2619] rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
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

export default UserManagement;