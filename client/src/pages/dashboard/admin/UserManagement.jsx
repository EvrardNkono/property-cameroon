import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, UserPlus, MoreVertical, Trash2, Edit3, 
  Mail, Eye, TrendingUp, Home, FileText, User, ShieldCheck
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// Importation de tes nouveaux modals
import UserDetailModal from './users/UserDetailModal';
import UserAccessModal from './users/UserAccessModal';
import UserBanModal from './users/UserBanModal';
import UserEditModal from './users/UserEditModal';
import UserVerificationModal from './users/UserVerificationModal';

// --- SUB-COMPONENT: SMART ACTION MENU AVEC HANDLERS ---
const UserActionMenu = ({ user, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, dropUp: false });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 280; 
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldDropUp = spaceBelow < menuHeight;

      setCoords({
        top: shouldDropUp 
          ? rect.top + window.scrollY - menuHeight + 10 
          : rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 180,
        dropUp: shouldDropUp
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const close = () => setIsOpen(false);
      window.addEventListener('scroll', close);
      window.addEventListener('resize', close);
      return () => {
        window.removeEventListener('scroll', close);
        window.removeEventListener('resize', close);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && 
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSmartActions = () => {
    const actions = [{ id: 'VIEW_PROFILE', label: 'View Profile', icon: <User size={14} />, color: 'text-slate-600', tab: 'profile' }];
    
    if (user.roles.includes('OWNER')) {
      actions.push({ id: 'VIEW_PROPERTIES', label: 'View Properties', icon: <Home size={14} />, color: 'text-blue-600', tab: 'properties' });
      actions.push({ id: 'VIEW_TITLES', label: 'Land Titles', icon: <FileText size={14} />, color: 'text-orange-600', tab: 'titles' });
    }
    
    if (user.roles.includes('INVESTOR')) {
      actions.push({ id: 'VIEW_INVEST', label: 'Investments', icon: <TrendingUp size={14} />, color: 'text-emerald-600', tab: 'investments' });
    }
    
    return actions;
  };

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all relative z-10 ${
          isOpen ? 'bg-[#c5a059] text-[#0a2619] shadow-inner' : 'hover:bg-slate-100 text-slate-400'
        }`}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={menuRef}
          style={{ position: 'absolute', top: `${coords.top}px`, left: `${coords.left}px`, width: '208px' }}
          className={`bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 z-[9999] py-2 animate-in fade-in ${
            coords.dropUp ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'
          } duration-200`}
        >
          <div className="px-4 py-2 border-b border-slate-50 mb-1">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Master Actions</p>
          </div>
          
          {/* Actions Dynamiques */}
          {getSmartActions().map(action => (
            <button 
              key={action.id} 
              onClick={() => { onAction(action.id, action.tab); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left"
            >
              <span className={action.color}>{action.icon}</span>
              {action.label}
            </button>
          ))}

          <div className="h-px bg-slate-100 my-1 mx-2" />

          {/* Actions Administratives Fixes */}
          <button onClick={() => { onAction('EDIT_INFO'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 text-left">
            <Edit3 size={14} className="text-slate-400" /> Edit Member Info
          </button>
          <button onClick={() => { onAction('EDIT_ACCESS'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 text-left">
            <ShieldCheck size={14} /> Edit Access
          </button>
          <button onClick={() => { onAction('VERIFY_KYC'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 text-left">
            <ShieldCheck size={14} /> Verify KYC
          </button>
          <button onClick={() => { onAction('BAN_USER'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 text-left">
            <Trash2 size={14} /> Ban Member
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

// --- MAIN COMPONENT ---
const UserManagement = () => {
  const { activeRoles } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // ÉTATS DES MODALS
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'VIEW', 'EDIT', 'ACCESS', 'BAN', 'VERIFY'
  const [initialTab, setInitialTab] = useState('profile');

  const users = [
    { id: 1, name: "Evrard", email: "evrard@capef.cm", roles: ['ADMIN', 'OWNER'], status: 'Verified', joinDate: 'March 12, 2026' },
    { id: 2, name: "Samuel Eto'o", email: "sam@legend.com", roles: ['INVESTOR', 'OWNER'], status: 'Verified', joinDate: 'February 01, 2026' },
    { id: 3, name: "Jean Dupont", email: "j.dupont@orange.fr", roles: ['BUYER'], status: 'Pending', joinDate: 'April 05, 2026' },
    { id: 4, name: "Marie Ngo", email: "marie.ngo@test.cm", roles: ['OWNER'], status: 'Verified', joinDate: 'January 20, 2026' },
    { id: 5, name: "Basic Client", email: "test@user.com", roles: ['BUYER'], status: 'Pending', joinDate: 'April 09, 2026' },
  ];

  // Handler Centralisé pour les actions du menu
  const handleMenuAction = (user, actionType, tab = 'profile') => {
    setSelectedUser(user);
    setInitialTab(tab);
    
    if (actionType.startsWith('VIEW')) setActiveModal('VIEW');
    else if (actionType === 'EDIT_INFO') setActiveModal('EDIT');
    else if (actionType === 'EDIT_ACCESS') setActiveModal('ACCESS');
    else if (actionType === 'BAN_USER') setActiveModal('BAN');
    else if (actionType === 'VERIFY_KYC') setActiveModal('VERIFY');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || user.roles.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER & FILTERS (Inchangés) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0a2619] italic">Member Management</h1>
          <p className="text-slate-500 text-sm mt-1">Supervise access permissions and user assets.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
          <UserPlus size={16} /> Create New User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div className="lg:col-span-2 flex flex-wrap gap-2">
          {['ALL', 'OWNER', 'INVESTOR', 'BUYER', 'ADMIN'].map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-[#c5a059] text-[#0a2619] shadow-md' : 'bg-white text-slate-400 border border-slate-100'}`}>{filter}</button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search members..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* TABLE AVEC CONNEXION MENU */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
        <div className="overflow-x-auto overflow-visible">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roles</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0a2619] text-[#c5a059] rounded-xl flex items-center justify-center font-black text-xs">{user.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-[#0a2619] text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Mail size={10}/> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map(role => (
                        <span key={role} className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{role}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right overflow-visible">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => handleMenuAction(user, 'VIEW_PROFILE', 'profile')}
                        className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                      >
                        <Eye size={16}/>
                      </button>
                      {/* Injection du handler d'action */}
                      <UserActionMenu 
                        user={user} 
                        onAction={(type, tab) => handleMenuAction(user, type, tab)} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDU DES MODALS */}
      {activeModal === 'VIEW' && <UserDetailModal isOpen={true} user={selectedUser} initialTab={initialTab} onClose={() => setActiveModal(null)} />}
      {activeModal === 'EDIT' && <UserEditModal isOpen={true} user={selectedUser} onClose={() => setActiveModal(null)} onSave={(id, data) => console.log("Save", data)} />}
      {activeModal === 'ACCESS' && <UserAccessModal isOpen={true} user={selectedUser} onClose={() => setActiveModal(null)} onUpdate={(id, roles) => console.log("Roles", roles)} />}
      {activeModal === 'BAN' && <UserBanModal isOpen={true} user={selectedUser} onClose={() => setActiveModal(null)} onConfirm={(id, data) => console.log("Ban", data)} />}
      {activeModal === 'VERIFY' && <UserVerificationModal isOpen={true} user={selectedUser} onClose={() => setActiveModal(null)} onVerify={(id, data) => console.log("Verify", data)} />}

    </div>
  );
};

export default UserManagement;