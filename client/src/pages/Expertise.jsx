import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Correction des chemins : On ajoute /agriculture/ avant /expertise/
import ExpertiseHero from '../components/agriculture/expertise/ExpertiseHero';
import TheAuditProcess from '../components/agriculture/expertise/TheAuditProcess';
import InstitutionalFramework from '../components/agriculture/expertise/InstitutionalFramework';
import YieldSimulator from '../components/agriculture/expertise/YieldSimulator';

const ExpertisePage = () => {
  return (
    <main className="bg-white">
      {/* Barre de navigation */}
      <Navbar />
      
      {/* 1. Introduction & Piliers (Legal/Agro/Finance) */}
      <ExpertiseHero />
      
      {/* 2. Le Processus d'Audit en 5 étapes */}
      <section className="py-20 border-b border-slate-50">
        <TheAuditProcess />
      </section>

      {/* 3. Cadre Institutionnel (CAPEF / MINADER) */}
      <InstitutionalFramework />

      {/* 4. Simulateur de Rendement (Interactif) */}
      <YieldSimulator />

      {/* 5. Section d'appel à l'action (CTA) */}
      <section className="bg-pc-green py-24 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-white font-serif text-4xl uppercase mb-8 tracking-tighter">
            Ready to secure your <br />
            <span className="italic font-light">agricultural future?</span>
          </h2>
          <p className="text-white/70 font-light mb-10 max-w-xl mx-auto">
            Contact our strategic desk for a personalized land audit or a full industrial business plan.
          </p>
          <button className="bg-slate-900 text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-pc-gold hover:text-slate-900 transition-all duration-300 shadow-2xl">
            Request a Technical Consultation
          </button>
        </div>
      </section>

      {/* Pied de page */}
      <Footer />
    </main>
  );
};

export default ExpertisePage;