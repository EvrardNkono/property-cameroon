import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, User, Loader2 } from 'lucide-react';
import api from '../../services/api';

const RoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.request(`/role-requests?status=${statusFilter}`);
      setRequests(res.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      setActionId(id);
      await api.request(`/role-requests/${id}/approve`, { method: 'PUT' });
      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionId(id);
      await api.request(`/role-requests/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ adminNote })
      });
      setRejectingId(null);
      setAdminNote('');
      await fetchRequests();
    } catch (err) {
      console.error(err);
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
    APPROVED: 'text-green-600  bg-green-50',
    REJECTED: 'text-red-600    bg-red-50'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0a2619] uppercase tracking-tight">Role Requests</h2>
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
        <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-[#c5a059]"/></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Clock size={48} className="mx-auto mb-4 opacity-30"/>
          <p className="text-sm">No {statusFilter.toLowerCase()} requests</p>
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
                    <p className="font-black text-[#0a2619] text-sm">{req.user?.name}</p>
                    <p className="text-[10px] text-slate-500">{req.user?.email}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${statusColors[req.status]}`}>
                  {req.status}
                </span>
              </div>

              {/* Rôles */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Current :</span>
                  {req.currentRoles?.map(roleBadge)}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Requested :</span>
                  {req.requestedRoles?.map(roleBadge)}
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
                  Admin note : "{req.adminNote}"
                </p>
              )}

              <p className="text-[10px] text-slate-400">
                {new Date(req.createdAt).toLocaleString()}
                {req.reviewedBy && ` · Reviewed by ${req.reviewedBy.name}`}
              </p>

              {/* Actions */}
              {req.status === 'PENDING' && (
                rejectingId === req._id ? (
                  <div className="space-y-2">
                    <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
                      placeholder="Reason for rejection (optional)..."
                      rows={2}
                      className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 resize-none focus:outline-none focus:border-red-300"/>
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(req._id)} disabled={!!actionId}
                        className="flex-1 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1">
                        {actionId === req._id ? <Loader2 size={12} className="animate-spin"/> : <XCircle size={12}/>}
                        Confirm Reject
                      </button>
                      <button onClick={() => { setRejectingId(null); setAdminNote(''); }}
                        className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(req._id)} disabled={!!actionId}
                      className="flex-1 py-2.5 bg-[#0a2619] text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5">
                      {actionId === req._id ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle2 size={12}/>}
                      Approve
                    </button>
                    <button onClick={() => setRejectingId(req._id)} disabled={!!actionId}
                      className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5">
                      <XCircle size={12}/> Reject
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