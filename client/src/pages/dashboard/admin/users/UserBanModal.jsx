import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Info, Lock, Unlock } from 'lucide-react';

const UserBanModal = ({ isOpen, onClose, user, onConfirm }) => {
  const [banReason, setBanReason] = useState('');
  const [duration, setDuration] = useState('permanent');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !user) return null;

  const handleAction = async () => {
    setIsProcessing(true);
    // Simulation API
    setTimeout(() => {
      onConfirm(user.id, { reason: banReason, duration });
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Overlay avec un flou plus prononcé pour l'aspect critique */}
      <div className="absolute inset-0 bg-red-950/20 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header - Alerte Rouge */}
        <div className="p-8 border-b border-red-50 flex justify-between items-center bg-red-50/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-red-900">Security Action</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Restricting: {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Warning Message */}
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <AlertTriangle className="text-red-600 shrink-0" size={20} />
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              This action will immediately revoke <span className="font-black uppercase text-red-600">Access</span> to the dashboard for this member. 
            </p>
          </div>

          {/* Duration Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ban Duration</label>
            <div className="grid grid-cols-2 gap-2">
              {['24 Hours', '7 Days', '30 Days', 'Permanent'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d.toLowerCase())}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                    duration === d.toLowerCase()
                      ? 'border-red-600 bg-red-50 text-red-600 shadow-sm'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reason for restriction</label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Ex: Suspicious activity, failed KYC, non-payment..."
              className="w-full h-24 p-4 rounded-2xl border-2 border-slate-100 focus:border-red-600 outline-none text-sm text-slate-600 placeholder:text-slate-300 transition-all resize-none font-medium"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-0 flex flex-col gap-3">
          <button 
            onClick={handleAction}
            disabled={isProcessing || !banReason}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${
              isProcessing || !banReason
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <Lock size={14} /> Confirm Restriction
              </>
            )}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBanModal;