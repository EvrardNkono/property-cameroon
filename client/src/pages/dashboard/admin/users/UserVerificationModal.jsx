import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, ZoomIn, Download, AlertCircle } from 'lucide-react';

const UserVerificationModal = ({ isOpen, onClose, user, onVerify }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewMode, setViewMode] = useState('review');

  if (!isOpen || !user) return null;

  const handleAction = async (status) => {
  console.log('🔍 handleAction called with status:', status); // 👈 AJOUTEZ CETTE LIGNE
  
  if (!user._id) {
    console.error('User ID is missing');
    alert('User ID is missing');
    return;
  }
  
  setIsProcessing(true);
  try {
    const kycStatus = status === 'verified' ? 'Verified' : 'Rejected';
    console.log('📤 Sending kycStatus:', kycStatus); // 👈 AJOUTEZ CETTE LIGNE
    await onVerify(user._id, kycStatus);
    onClose();
  } catch (error) {
    console.error('Error verifying KYC:', error);
    alert('Error during verification');
  } finally {
    setIsProcessing(false);
  }
};

  const getDocumentUrl = () => {
    if (user.kycDocuments && user.kycDocuments.length > 0) {
      return `http://localhost:5000${user.kycDocuments[0].url}`;
    }
    return null;
  };

  const documentUrl = getDocumentUrl();

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a2619]/50 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal container - responsive */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header - sticky */}
        <div className="p-4 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl">
              <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif italic text-[#0a2619]">Identity Verification</h2>
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">KYC Review: {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
          
          {/* Document Preview */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Submitted Document</h3>
            <div className="relative group aspect-video bg-slate-100 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
              {documentUrl ? (
                <img 
                  src={documentUrl} 
                  alt="KYC Document" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 sm:p-10">
                  <FileText size={32} className="sm:w-12 sm:h-12 mx-auto text-slate-300 mb-3 sm:mb-4" />
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">No document uploaded yet</p>
                  <p className="text-[8px] sm:text-[9px] text-slate-400 mt-1 sm:mt-2">User needs to upload an identity document</p>
                </div>
              )}
              
              {documentUrl && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 sm:gap-4">
                  <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl text-[#0a2619] hover:scale-110 transition-transform">
                    <ZoomIn size={16} className="sm:w-5 sm:h-5" />
                  </a>
                  <a href={documentUrl} download className="p-2 sm:p-4 bg-white rounded-xl sm:rounded-2xl text-[#0a2619] hover:scale-110 transition-transform">
                    <Download size={16} className="sm:w-5 sm:h-5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
              <AlertCircle size={16} className="sm:w-5 sm:h-5" />
            </div>
            <p className="text-[10px] sm:text-xs text-amber-800 font-medium leading-relaxed">
              Ensure the name on the document matches <span className="font-bold text-[#0a2619] uppercase">"{user.name}"</span> and the expiration date is valid.
            </p>
          </div>

          {/* Conditional Rejection Input */}
          {viewMode === 'reject' && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-red-400 ml-1">Reason for Rejection</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Image is blurry, name mismatch, document expired..."
                className="w-full mt-2 h-20 sm:h-24 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-red-100 focus:border-red-500 outline-none text-xs sm:text-sm text-slate-600 resize-none font-medium"
              />
            </div>
          )}
        </div>

        {/* Footer Actions - sticky en bas */}
        <div className="p-4 sm:p-8 bg-slate-50/50 border-t border-slate-100 flex-shrink-0">
          {viewMode === 'review' ? (
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => setViewMode('reject')}
                className="w-full sm:flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-red-600 border-2 border-red-100 hover:bg-red-50 transition-all"
              >
                Reject Document
              </button>
              <button 
                onClick={() => handleAction('verified')}
                disabled={isProcessing}
                className="w-full sm:flex-[2] py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 size={14} className="sm:w-4 sm:h-4" /> 
                {isProcessing ? 'Verifying...' : 'Approve Member'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => setViewMode('review')}
                className="w-full sm:flex-1 py-3 sm:py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
              >
                Back to Review
              </button>
              <button 
                onClick={() => handleAction('rejected')}
                disabled={!rejectionReason || isProcessing}
                className="w-full sm:flex-[2] py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200 text-[10px] sm:text-[11px] font-black uppercase tracking-widest disabled:opacity-50 transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserVerificationModal;