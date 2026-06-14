import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, UserPlus, MoreVertical, Trash2, Edit3, 
  Mail, Eye, TrendingUp, Home, FileText, User, ShieldCheck,
  Loader2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import api from '../../../services/api';

// Importation des modals (sans UserVerificationModal)
import UserDetailModal from './users/UserDetailModal';
import UserAccessModal from './users/UserAccessModal';
import UserBanModal from './users/UserBanModal';
import UserEditModal from './users/UserEditModal';
// UserVerificationModal supprimé

// --- SUB-COMPONENT: SMART ACTION MENU AVEC HANDLERS ---
const UserActionMenu = ({ user, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, dropUp: false });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 250; // Réduit car on a enlevé l'option KYC
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
    
    if (user.roles && user.roles.includes('OWNER')) {
      actions.push({ id: 'VIEW_PROPERTIES', label: 'View Properties', icon: <Home size={14} />, color: 'text-blue-600', tab: 'properties' });
      actions.push({ id: 'VIEW_TITLES', label: 'Land Titles', icon: <FileText size={14} />, color: 'text-orange-600', tab: 'titles' });
    }
    
    if (user.roles && user.roles.includes('INVESTOR')) {
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
          {/* Bouton Verify KYC SUPPRIMÉ */}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // ÉTATS DES MODALS
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [initialTab, setInitialTab] = useState('profile');

  // Charger les utilisateurs depuis le backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (activeFilter !== 'ALL') filters.role = activeFilter;
      if (searchTerm) filters.search = searchTerm;
      
      const response = await api.getUsers(filters);
      setUsers(response.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les users quand les filtres changent
  useEffect(() => {
    fetchUsers();
  }, [activeFilter, searchTerm]);

  // Handler Centralisé pour les actions du menu
  const handleMenuAction = (user, actionType, tab = 'profile') => {
    setSelectedUser(user);
    setInitialTab(tab);
    
    if (actionType.startsWith('VIEW')) setActiveModal('VIEW');
    else if (actionType === 'EDIT_INFO') setActiveModal('EDIT');
    else if (actionType === 'EDIT_ACCESS') setActiveModal('ACCESS');
    else if (actionType === 'BAN_USER') setActiveModal('BAN');
    // VERIFY_KYC supprimé
  };

  // Handlers pour les actions backend
  const handleUpdateRoles = async (userId, roles) => {
    try {
      await api.updateUserRoles(userId, roles);
      await fetchUsers();
      setActiveModal(null);
    } catch (err) {
      console.error('Error updating roles:', err);
      alert('Erreur lors de la mise à jour des rôles');
    }
  };

  const handleBanUser = async (userId, banReason) => {
    try {
      await api.banUser(userId, banReason);
      await fetchUsers();
      setActiveModal(null);
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Erreur lors du bannissement');
    }
  };

  // handleVerifyKYC SUPPRIMÉ

  const handleEditUser = async (userId, userData) => {
    try {
      await api.updateUser(userId, userData);
      await fetchUsers();
      setActiveModal(null);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleCreateUser = async () => {
    // À implémenter - ouvrir un modal de création
    console.log('Create user');
  };

  // Affichage du loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Chargement des utilisateurs...</p>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center">
          <p className="font-bold">Erreur</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0a2619] italic">Member Management</h1>
          <p className="text-slate-500 text-sm mt-1">Supervise access permissions and user assets.</p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Connecté au backend - {users.length} utilisateur{users.length > 1 ? 's' : ''} chargé{users.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          onClick={handleCreateUser}
          className="flex items-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
        >
          <UserPlus size={16} /> Create New User
        </button>
      </div>

      {/* FILTRES */}
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
              {filter}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search members..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#c5a059]/20" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-visible">
        <div className="overflow-x-auto overflow-visible">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roles</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0a2619] text-[#c5a059] rounded-xl flex items-center justify-center font-black text-xs">
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-[#0a2619] text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Mail size={10}/> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-1 flex-wrap">
                      {user.roles?.map(role => (
                        <span key={role} className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${
                          role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                      user.status === 'Verified' ? 'bg-green-100 text-green-600' :
                      user.status === 'Banned' ? 'bg-red-100 text-red-600' : 
                      user.status === 'Suspended' ? 'bg-orange-100 text-orange-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {user.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right overflow-visible">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => handleMenuAction(user, 'VIEW_PROFILE', 'profile')}
                        className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                        title="Voir le profil"
                      >
                        <Eye size={16}/>
                      </button>
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
          {users.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium italic">
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      </div>

      {/* MODALS (SANS UserVerificationModal) */}
      {activeModal === 'VIEW' && selectedUser && (
        <UserDetailModal 
          isOpen={true} 
          user={selectedUser} 
          initialTab={initialTab} 
          onClose={() => setActiveModal(null)} 
        />
      )}
      {activeModal === 'EDIT' && selectedUser && (
        <UserEditModal 
          isOpen={true} 
          user={selectedUser} 
          onClose={() => setActiveModal(null)} 
          onSave={handleEditUser} 
        />
      )}
      {activeModal === 'ACCESS' && selectedUser && (
        <UserAccessModal 
          isOpen={true} 
          user={selectedUser} 
          onClose={() => setActiveModal(null)} 
          onUpdate={handleUpdateRoles} 
        />
      )}
      {activeModal === 'BAN' && selectedUser && (
        <UserBanModal 
          isOpen={true} 
          user={selectedUser} 
          onClose={() => setActiveModal(null)} 
          onConfirm={handleBanUser} 
        />
      )}
      {/* UserVerificationModal SUPPRIMÉ */}

    </div>
  );
};

export default UserManagement;