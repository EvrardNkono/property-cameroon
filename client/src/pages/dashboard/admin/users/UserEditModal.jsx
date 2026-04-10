import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';

const UserEditModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+237 ',
    location: user?.location || 'Yaoundé, Cameroon',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation API
    setTimeout(() => {
      onSave(user.id, formData);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a2619]/40 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-[#0a2619]">Edit Member Profile</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {user.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            
            {/* Avatar Section (Placeholder) */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-[#0a2619] text-3xl font-black border-4 border-white shadow-md">
                  {formData.name.charAt(0)}
                </div>
                <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-400 hover:text-[#c5a059] transition-all">
                  <Camera size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <InputField 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                icon={<User size={16} />} 
              />
              
              {/* Email */}
              <InputField 
                label="Email Address" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                icon={<Mail size={16} />} 
              />

              {/* Phone */}
              <InputField 
                label="Phone Number" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                icon={<Phone size={16} />} 
              />

              {/* Location */}
              <InputField 
                label="Primary Location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                icon={<MapPin size={16} />} 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 bg-slate-50/50 flex gap-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex-[2] py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${
                isSubmitting 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#0a2619] text-[#c5a059] hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isSubmitting ? 'Updating...' : <><Save size={14} /> Update Member Info</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper Input Component
const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#c5a059] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
      />
    </div>
  </div>
);

export default UserEditModal;