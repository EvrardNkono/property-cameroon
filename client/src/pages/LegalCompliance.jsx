import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Landmark, FileText, CheckCircle, Shield, Target, 
  Award, MapPin, Scale, Gavel, Building2, 
  ShieldCheck, FileCheck, Briefcase, Globe, ArrowRight
} from 'lucide-react';

const LegalCompliancePage = () => {
  const partners = [
    { name: "MINADER", full: "Ministry of Agriculture and Rural Development", role: "Technical Supervision & Strategy" },
    { name: "CAPEF", full: "Chamber of Agriculture, Fisheries, Livestock and Forestry", role: "Consular Framework & Certification" },
    { name: "MINDCAF", full: "Ministry of State Property, Surveys and Land Tenure", role: "Land Securitization & Titles" },
    { name: "IRAD", full: "Institute of Agricultural Research for Development", role: "Innovation & Input Quality" }
  ];

  const legalPillars = [
    {
      icon: <Scale className="text-pc-gold" size={32} />,
      title: "1974 Land Ordinance",
      desc: "The pivot of property ownership in Cameroon. We ensure every plot is cleared of all customary rights before being listed for sale."
    },
    {
      icon: <ShieldCheck className="text-pc-gold" size={32} />,
      title: "Investment Code",
      desc: "Optimization of customs and tax incentives for our agro-industrial investors under the 2013 incentive regime."
    },
    {
      icon: <Gavel className="text-pc-gold" size={32} />,
      title: "Strict Notarial Framework",
      desc: "Zero hand-to-hand transactions. All deeds are signed in the presence of Notaries registered with the National Chamber of Notaries."
    }
  ];

  return (
    <main className="bg-white pt-20">
      <Navbar />

      {/* HERO SECTION - MASSIVE & AUTHORITATIVE */}
      <section className="bg-[#0a0f1a] py-32 relative overflow-hidden border-b-8 border-pc-gold">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 bg-pc-gold"></span>
              <span className="text-pc-gold font-black text-xs uppercase tracking-[0.4em]">Legal Department & Compliance</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white uppercase tracking-tighter mb-10 leading-[0.85]">
              The Legal <br /> 
              <span className="italic font-light text-pc-green">Framework</span>
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-2xl border-l-4 border-pc-green pl-8">
              Investing in Cameroon requires absolute rigor. Property Cameroon aligns every project with the **SND30** (National Development Strategy) to guarantee security, sovereignty, and profitability.
            </p>
          </div>
        </div>
        <Landmark className="absolute right-[-10%] bottom-[-10%] text-white/5 w-[600px] h-[600px] -rotate-12" />
      </section>

      {/* CAPEF SECTION - THE CONSULAR POWER */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
             <div className="absolute -top-10 -left-10 w-32 h-32 bg-pc-gold/10 rounded-full blur-3xl"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-8 mb-12">
                   <img src="/images/capeflogo.jfif" alt="CAPEF Logo" className="w-32 h-32 object-contain drop-shadow-2xl" />
                   <div className="h-20 w-[1px] bg-slate-200"></div>
                   <h2 className="text-4xl font-serif uppercase tracking-tighter leading-none">Prime <br/><span className="text-pc-gold">Partner</span></h2>
                </div>
                <div className="space-y-8 text-slate-600 text-lg font-light leading-relaxed">
                  <p>
                    The <strong>CAPEF</strong> is the supreme regulatory and promotional body for the rural sector. As a consular chamber, it validates the authenticity of actors and projects.
                  </p>
                  <div className="bg-slate-50 p-8 rounded-2xl border-l-8 border-pc-green italic mb-8">
                    "Our collaboration ensures that every investor receives their **Certified Producer Card**, the essential gateway to state subsidies."
                  </div>
                  
                  {/* SPECIFIC CALL TO ACTION FOR CAPEF */}
                  <Link 
                    to="/agriculture/institutional-framework" 
                    className="inline-flex items-center gap-3 bg-pc-gold text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-slate-900 transition-all group"
                  >
                    Learn more about CAPEF <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
             <Building2 className="absolute top-[-20px] right-[-20px] text-white/5 w-40 h-40" />
             <h3 className="text-white font-serif text-2xl mb-10 uppercase italic">Partner Ecosystem</h3>
             <div className="space-y-6">
                {partners.map((p, idx) => (
                  <div key={idx} className="group border-b border-white/10 pb-6 hover:border-pc-gold transition-colors">
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="text-pc-gold font-black text-lg">{p.name}</h4>
                          <p className="text-white/40 text-[10px] uppercase tracking-widest">{p.full}</p>
                       </div>
                       <span className="text-[10px] text-pc-green font-bold border border-pc-green/30 px-3 py-1 rounded-full">{p.role}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* CHAMBER SERVICES SECTION - DENSE GRID */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-center text-4xl font-serif uppercase mb-20 tracking-tighter">Services & <span className="text-pc-green italic">Chamber Missions</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Briefcase/>, title: "Representation", desc: "Advocating for investor interests at the governmental level." },
              { icon: <Award/>, title: "Certification", desc: "Issuance of technical approvals and professional identification cards." },
              { icon: <Target/>, title: "SND30 Audit", desc: "Verification of strategic alignment for all agricultural projects." },
              { icon: <Globe/>, title: "Global Market", desc: "Promotion through Geographical Indications (e.g., Penja Pepper)." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-2 transition-all">
                <div className="text-pc-gold mb-6">{item.icon}</div>
                <h5 className="font-bold uppercase text-sm mb-4 tracking-tighter">{item.title}</h5>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGAL SECTION - JURIDICAL RIGOR */}
      <section className="py-24 max-w-5xl mx-auto px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-serif uppercase tracking-widest inline-block border-b-2 border-pc-gold pb-4">Juridical Security</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {legalPillars.map((pillar, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-6">{pillar.icon}</div>
              <h4 className="text-sm font-black uppercase mb-4 tracking-tighter">{pillar.title}</h4>
              <p className="text-[13px] text-slate-500 font-light leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-pc-green py-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-white">
            <h4 className="text-3xl font-serif uppercase italic mb-2">Total Transparency</h4>
            <p className="font-light opacity-80 uppercase text-xs tracking-widest">Every file is subject to strict oversight by competent authorities.</p>
          </div>
          <button className="bg-pc-gold text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-white hover:text-pc-gold transition-all">
            Consult Legal Guide
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default LegalCompliancePage;