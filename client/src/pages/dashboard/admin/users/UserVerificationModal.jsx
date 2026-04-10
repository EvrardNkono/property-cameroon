import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, XCircle, ZoomIn, Download, AlertCircle } from 'lucide-react';

const UserVerificationModal = ({ isOpen, onClose, user, onVerify }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewMode, setViewMode] = useState('review'); // 'review' or 'reject'

  if (!isOpen || !user) return null;

  const handleAction = async (status) => {
    setIsProcessing(true);
    // Simulation API (Approuvé ou Rejeté)
    setTimeout(() => {
      onVerify(user.id, { status, reason: rejectionReason });
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a2619]/50 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-[#0a2619]">Identity Verification</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">KYC Review: {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Document Preview Area */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Submitted Document</h3>
            <div className="relative group aspect-video bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
              {/* Simulation d'une image de CNI ou Passeport */}
              <div className="text-center p-10">
                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">National ID Card (Front)</p>
              </div>
              
              {/* Overlay d'action sur l'image */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="p-4 bg-white rounded-2xl text-[#0a2619] hover:scale-110 transition-transform"><ZoomIn size={20}/></button>
                <button className="p-4 bg-white rounded-2xl text-[#0a2619] hover:scale-110 transition-transform"><Download size={20}/></button>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-[2rem] border border-amber-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
              <AlertCircle size={20} />
            </div>
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              Ensure the name on the document matches <span className="font-bold text-[#0a2619] uppercase">"{user.name}"</span> and the expiration date is valid.
            </p>
          </div>

          {/* Conditional Rejection Input */}
          {viewMode === 'reject' && (
            <div className="animate-in slide-in-from-top-4 duration-300">
               <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-1">Reason for Rejection</label>
               <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Image is blurry, name mismatch, document expired..."
                className="w-full mt-2 h-24 p-4 rounded-2xl border-2 border-red-100 focus:border-red-500 outline-none text-sm text-slate-600 resize-none font-medium"
               />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
          {viewMode === 'review' ? (
            <>
              <button 
                onClick={() => setViewMode('reject')}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 border-2 border-red-100 hover:bg-red-50 transition-all"
              >
                Reject Document
              </button>
              <button 
                onClick={() => handleAction('verified')}
                disabled={isProcessing}
                className="flex-[2] py-4 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> {isProcessing ? 'Verifying...' : 'Approve Member'}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setViewMode('review')}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Back to Review
              </button>
              <button 
                onClick={() => handleAction('rejected')}
                disabled={!rejectionReason || isProcessing}
                className="flex-[2] py-4 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200 text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all"
              >
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserVerificationModal;