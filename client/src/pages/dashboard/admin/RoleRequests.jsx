// frontend/src/pages/dashboard/admin/RoleRequests.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, User, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const RoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const { user, token } = useAuth();

  // 🔍 LOG DE DÉBOGAGE - Vérification des données utilisateur
  useEffect(() => {
    console.log('🔍 RoleRequests - User:', user);
    console.log('🔍 RoleRequests - Token exists:', !!token);
    console.log('🔍 RoleRequests - User roles:', user?.roles);
  }, [user, token]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📡 Fetching role requests with status: ${statusFilter}`);
      console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const res = await api.request(`/role-requests?status=${statusFilter}`);
      console.log('✅ Response received:', res);
      setRequests(res.requests || []);
    } catch (err) {
      console.error('❌ Error fetching role requests:', err);
      console.error('❌ Error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRequests(); 
  }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      setActionId(id);
      console.log(`✅ Approving request: ${id}`);
      await api.request(`/role-requests/${id}/approve`, { method: 'PUT' });
      await fetchRequests();
    } catch (err) {
      console.error('❌ Error approving:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'approbation');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionId(id);
      console.log(`❌ Rejecting request: ${id}`, { adminNote });
      await api.request(`/role-requests/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ adminNote })
      });
      setRejectingId(null);
      setAdminNote('');
      await fetchRequests();
    } catch (err) {
      console.error('❌ Error rejecting:', err);
      setError(err.response?.data?.message || 'Erreur lors du rejet');
    } finally {
      setActionId(null);
    }
  };

  const roleBadge = (role) => (
    <span key={role} className="px-2 py-0.5 bg-[#c5a059]/10 text-[#0a2619] text-[8px] font-black rounded-full uppercase">
      {role}
    </span>
  );

  const statusColors = {
    PENDING:  'text-yellow-600 bg-yellow-50',
    APPROVED: 'text-green-600 bg-green-50',
    REJECTED: 'text-red-600 bg-red-50'
  };

  // 🔍 Rendu de débogage pour vérifier que le composant s'affiche
  console.log('🔄 Rendering RoleRequests component');

  // Afficher un message si l'utilisateur n'est pas admin
  if (user && !user.roles?.includes('ADMIN')) {
    return (
      <div className="p-8 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-center gap-3 text-yellow-700">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-bold">Accès limité</h3>
            <p className="text-sm">Vous devez avoir le rôle ADMIN pour accéder à cette page.</p>
            <p className="text-xs mt-2">Vos rôles actuels : {user.roles?.join(', ') || 'Aucun'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Gestion de l'erreur
  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-2xl border-2 border-red-200">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-bold">Erreur</h3>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchRequests}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0a2619] uppercase tracking-tight">
          Demandes de Rôle
          <span className="ml-3 text-sm font-normal text-slate-400 lowercase">
            ({requests.length} demandes)
          </span>
        </h2>
        <div className="flex gap-2">
          {['PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                statusFilter === s ? 'bg-[#0a2619] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-[#c5a059]"/>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Clock size={48} className="mx-auto mb-4 opacity-30"/>
          <p className="text-sm">Aucune demande {statusFilter.toLowerCase()}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059] flex items-center justify-center text-[#0a2619] font-black text-sm">
                    {req.user?.name?.charAt(0)?.toUpperCase() || <User size={16}/>}
                  </div>
                  <div>
                    <p className="font-black text-[#0a2619] text-sm">{req.user?.name || 'Utilisateur inconnu'}</p>
                    <p className="text-[10px] text-slate-500">{req.user?.email || 'Email non disponible'}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${statusColors[req.status]}`}>
                  {req.status}
                </span>
              </div>

              {/* Rôles */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Actuels :</span>
                  {req.currentRoles?.length > 0 ? req.currentRoles.map(roleBadge) : 
                    <span className="text-[10px] text-slate-400">Aucun</span>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Demandés :</span>
                  {req.requestedRoles?.length > 0 ? req.requestedRoles.map(roleBadge) : 
                    <span className="text-[10px] text-slate-400">Aucun</span>}
                </div>
              </div>

              {/* Raison utilisateur */}
              {req.reason && (
                <p className="text-[11px] text-slate-500 italic bg-slate-50 px-4 py-2 rounded-xl">
                  "{req.reason}"
                </p>
              )}

              {/* Note admin (rejet) */}
              {req.adminNote && (
                <p className="text-[11px] text-red-500 italic bg-red-50 px-4 py-2 rounded-xl">
                  Note admin : "{req.adminNote}"
                </p>
              )}

              <p className="text-[10px] text-slate-400">
                {new Date(req.createdAt).toLocaleString()}
                {req.reviewedBy && ` · Revu par ${req.reviewedBy.name}`}
              </p>

              {/* Actions */}
              {req.status === 'PENDING' && (
                rejectingId === req._id ? (
                  <div className="space-y-2">
                    <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
                      placeholder="Raison du rejet (optionnel)..."
                      rows={2}
                      className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 resize-none focus:outline-none focus:border-red-300"/>
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(req._id)} disabled={!!actionId}
                        className="flex-1 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1">
                        {actionId === req._id ? <Loader2 size={12} className="animate-spin"/> : <XCircle size={12}/>}
                        Confirmer le rejet
                      </button>
                      <button onClick={() => { setRejectingId(null); setAdminNote(''); }}
                        className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(req._id)} disabled={!!actionId}
                      className="flex-1 py-2.5 bg-[#0a2619] text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5">
                      {actionId === req._id ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle2 size={12}/>}
                      Approuver
                    </button>
                    <button onClick={() => setRejectingId(req._id)} disabled={!!actionId}
                      className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5">
                      <XCircle size={12}/> Rejeter
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleRequests;