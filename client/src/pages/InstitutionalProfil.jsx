import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, FileText, Globe, CheckCircle } from 'lucide-react';

// Mise à jour du nom de la fonction pour correspondre à l'import de App.js
const InstitutionalProfil = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 bg-pc-green text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
              Institutional <span className="text-pc-gold italic">Integrity</span> & Compliance.
            </h1>
            <p className="text-white/70 text-lg font-light">
              Property Cameroon operates under strict legal frameworks to ensure security for local farmers and international investors.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
            <img src="/images/logo.png" alt="" className="w-full h-full object-contain grayscale" />
        </div>
      </section>

      {/* --- SECTION 1: LEGAL IDENTITY --- */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">Corporate Identity</span>
            <h2 className="text-3xl font-serif text-pc-green mb-8">Official Registration & Tax Status</h2>
            <p className="text-slate-600 font-light leading-relaxed mb-10">
              For transparency and accountability, Property Cameroon is fully registered with the relevant authorities in the Republic of Cameroon. These credentials serve as our primary identification for all banking and international trade operations.
            </p>

            <div className="space-y-4">
              {[
                { label: "Trade Register (RCCM)", value: "RC/YAO/20XX/B/XXXX" },
                { label: "Taxpayer ID (NIU)", value: "MXXXXXXXXXXXXX" },
                { label: "Headquarters", value: "Bastos, Yaoundé - Cameroon" },
                { label: "International Branch", value: "Melun, Paris - France" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b border-slate-100 py-4">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">{item.label}</span>
                  <span className="text-sm font-serif text-pc-green">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-8 flex flex-col justify-center items-center text-center">
                <ShieldCheck className="text-pc-gold w-10 h-10 mb-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Anti-Fraud</h4>
                <p className="text-[10px] text-slate-400">Strict KYC protocols for all transactions.</p>
             </div>
             <div className="bg-pc-green p-8 flex flex-col justify-center items-center text-center text-white">
                <Globe className="text-pc-gold w-10 h-10 mb-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Export Ready</h4>
                <p className="text-[10px] text-white/50">Full compliance with CEMAC trade laws.</p>
             </div>
             <div className="col-span-2 bg-slate-100 h-48 overflow-hidden relative">
                <img src="/images/heroimo.png" alt="Corporate" className="w-full h-full object-cover opacity-50 grayscale" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-[0.5em] font-black text-pc-green">Certified Excellence</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE CAPEF COLLABORATION --- */}
      <section className="py-24 bg-slate-50 px-8 border-y border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/3">
            <div className="bg-white p-12 shadow-2xl rounded-sm text-center border-t-4 border-pc-gold">
               <img src="/images/capeflogo.jfif" alt="CAPEF Logo" className="h-24 mx-auto mb-6" />
               <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Strategic Partner</p>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-pc-gold text-xs uppercase tracking-[0.4em] font-black mb-6">Institutional Collaboration</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-pc-green mb-8 leading-tight">
              Bridging the Gap with <span className="italic">CAPEF</span>
            </h3>
            <p className="text-slate-600 font-light leading-relaxed mb-6">
              Our collaboration with the <strong>Chambre d'Agriculture, des Pêches, de l'Élevage et des Forêts du Cameroun (CAPEF)</strong> is a testament to our commitment to the national economy. 
            </p>
            <p className="text-slate-600 font-light leading-relaxed mb-8">
              Through this institutional synergy, Property Cameroon ensures that every agricultural project we initiate is aligned with the development goals set by the Republic.
            </p>
            <div className="flex items-center gap-4 text-pc-green font-bold text-[11px] uppercase tracking-widest">
              <CheckCircle size={16} className="text-pc-gold" /> Official Technical Assistance
              <span className="text-slate-200">|</span>
              <CheckCircle size={16} className="text-pc-gold" /> Certified Land Verification
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: DATA ROOM --- */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <FileText size={48} className="mx-auto text-pc-gold mb-8 opacity-50" />
          <h2 className="text-3xl font-serif text-pc-green mb-6">Due Diligence Access</h2>
          <p className="text-slate-500 font-light mb-12">
            Are you an institutional investor? Request access to our full corporate documentation.
          </p>
          <button className="bg-pc-green text-white px-12 py-5 uppercase text-[10px] font-black tracking-widest hover:bg-pc-gold transition-all shadow-xl">
            Request Private Data Room Access
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Exportation synchronisée avec le nom du fichier et l'import App.js
export default InstitutionalProfil;