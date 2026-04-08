import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'real-estate',
    location: 'yaounde',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rendez-vous envoyé:", formData);
    // Ici tu lieras ton futur backend Node.js
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row border border-pc-gold/20">
          
          {/* CÔTÉ GAUCHE : INFOS DE CONTACT */}
          <div className="md:w-1/3 bg-pc-green p-10 text-white">
            <h2 className="text-2xl font-serif mb-6 italic">Private Consultation</h2>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-10">
              Our experts accompany you in the realization of your heritage projects in Cameroon.
            </p>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-pc-gold text-[10px] uppercase tracking-widest font-bold mb-2">Yaoundé</h4>
                <p className="text-sm font-light">Bastos, Avenue Charles de Gaulle</p>
              </div>
              <div>
                <h4 className="text-pc-gold text-[10px] uppercase tracking-widest font-bold mb-2">Paris</h4>
                <p className="text-sm font-light">Melun, Région Parisienne</p>
              </div>
            </div>
          </div>

          {/* CÔTÉ DROIT : FORMULAIRE */}
          <div className="md:w-2/3 p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-slate-200 py-2 focus:border-pc-gold outline-none transition-colors text-sm"
                    placeholder="Evrard ..."
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full border-b border-slate-200 py-2 focus:border-pc-gold outline-none transition-colors text-sm"
                    placeholder="example@domain.com"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Interest</label>
                <select 
                  className="w-full border-b border-slate-200 py-2 focus:border-pc-gold outline-none transition-colors text-sm bg-transparent"
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                >
                  <option value="real-estate">Real Estate Investment</option>
                  <option value="agriculture">Agricultural Development</option>
                  <option value="legal">Land Title Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Preferred Location</label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="loc" value="yaounde" className="accent-pc-gold" defaultChecked onChange={() => setFormData({...formData, location: 'yaounde'})} /> 
                    Yaoundé
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="loc" value="paris" className="accent-pc-gold" onChange={() => setFormData({...formData, location: 'paris'})} /> 
                    Paris
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Project Description</label>
                <textarea 
                  rows="4" 
                  className="w-full border border-slate-100 p-4 rounded-sm focus:border-pc-gold outline-none transition-colors text-sm mt-2"
                  placeholder="Tell us about your investment goals..."
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button className="w-full bg-slate-900 text-white py-4 rounded-sm hover:bg-pc-gold transition-all duration-500 uppercase text-[11px] font-black tracking-[0.2em]">
                Confirm Request
              </button>
            </form>
          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Appointment;