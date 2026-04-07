import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Landmark, FileText, CheckCircle, Shield, Target, Award, MapPin } from 'lucide-react';

// ON SUPPRIME L'IMPORT ICI CAR L'IMAGE EST DANS /PUBLIC
// import CapefLogo from '../images/capeflogo.jfif'; 

const InstitutionalPage = () => {
  const partners = [
    { name: "MINADER", full: "Ministry of Agriculture", role: "National Agricultural Policy" },
    { name: "CAPEF", full: "Chamber of Agriculture", role: "Consular Representation & Norms" },
    { name: "MINDCAF", full: "Ministry of Land Tenure", role: "Land Title & Cadastral Audit" },
    { name: "IRAD", full: "Institute of Agronomic Research", role: "Elite Seed Certification" }
  ];

  const capefActivities = [
    {
      icon: <FileText className="text-pc-gold" size={24} />,
      title: "Consular Representation",
      description: "Acting as the official voice of Cameroon's rural sector professionals to the government and international bodies, ensuring their interests shape national policy."
    },
    {
      icon: <Award className="text-pc-gold" size={24} />,
      title: "Professional Certification",
      description: "Issuing official professional farmer cards, which are essential for accessing specialized training, inputs, and government support programs."
    },
    {
      icon: <Target className="text-pc-gold" size={24} />,
      title: "SND30 Alignment",
      description: "Auditing and validating large-scale agricultural projects to ensure strict compliance with Cameroon's National Development Strategy (SND30), focusing on structural transformation."
    },
    {
      icon: <MapPin className="text-pc-gold" size={24} />,
      title: "Geographical Indications",
      description: "Leading the process to certify and promote unique Cameroonian products like Penja Pepper and Oku Honey, leveraging geographical indications for premium market access."
    }
  ];

  return (
    <main className="bg-white pt-20">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-[10px] font-black text-pc-gold uppercase tracking-[0.5em] mb-6">
              Official Compliance
            </h1>
            <h2 className="text-5xl md:text-6xl font-serif text-white uppercase tracking-tighter mb-8 leading-none">
              The <span className="italic font-light text-pc-green">Institutional</span> <br /> Framework
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              Property Cameroon operates within the legal boundaries defined by the State of Cameroon. 
              We bridge the gap between private investment and national development strategies.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-pc-gold/5 skew-x-12 translate-x-20"></div>
      </section>

      {/* CAPEF FOCUS SECTION */}
<section className="py-24 max-w-7xl mx-auto px-8 border-b border-slate-100">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-16">
    <div>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
        
        {/* LOGO LIBÉRÉ : Taille augmentée et suppression du cercle restrictif */}
        <div className="flex-shrink-0 w-40 h-40 flex items-center justify-center">
          <img 
            src="/images/capeflogo.jfif" 
            alt="CAPEF Official Logo" 
            className="w-full h-full object-contain filter drop-shadow-xl" 
          />
        </div>

        <div className="text-center md:text-left pt-6">
          <h3 className="text-4xl md:text-5xl font-serif text-slate-900 uppercase tracking-tighter leading-none mb-4">
            Institutional Spotlight: <br />
            <span className="text-pc-gold italic">CAPEF</span>
          </h3>
          <p className="text-pc-green text-sm font-bold uppercase tracking-[0.2em] max-w-md">
            Chamber of Agriculture, Fisheries, Livestock and Forestry of Cameroon
          </p>
        </div>
      </div>
      
      <div className="space-y-6 text-slate-600 font-light leading-relaxed">
        <p>
          The <strong>Chamber of Agriculture, Fisheries, Livestock and Forestry (CAPEF)</strong> is the supreme consular institution for the rural sector in Cameroon. It is a public, professional body designed to coordinate and stimulate the growth of Cameroon’s primary economy.
        </p>
        <p>
          Operating under the technical supervision of MINADER and MINEPIA, CAPEF serves as a vital interlocutor, ensuring that private agricultural investments align with the <strong>SND30</strong> (National Development Strategy).
        </p>
      </div>
    </div>

    <div className="bg-slate-900 p-12 relative rounded-lg shadow-2xl">
        <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-pc-gold"></div>
        <h4 className="text-white font-serif text-2xl mb-8 uppercase italic tracking-tight">Institutional Partners Ecosystem</h4>
        <div className="space-y-8">
          {partners.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-pc-gold font-black text-xs block">{p.name}</span>
                <span className="text-white text-[10px] uppercase opacity-60 tracking-widest">{p.full}</span>
              </div>
              <span className="text-[9px] text-pc-green font-bold uppercase border border-pc-green/30 px-2 py-1 rounded">{p.role}</span>
            </div>
          ))}
        </div>
    </div>
  </div>

  {/* CAPEF ACTIVITIES GRID */}
  <div className="mb-16">
      <h4 className="text-3xl font-serif text-slate-900 uppercase tracking-tighter mb-12 text-center">
          Key <span className="text-pc-green italic">CAPEF</span> Activities & Services
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capefActivities.map((activity, index) => (
              <div key={index} className="bg-slate-50 p-10 border border-slate-100 rounded-xl shadow-sm hover:border-pc-gold/50 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6 mb-6">
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          {activity.icon}
                      </div>
                      <h5 className="font-serif text-xl text-slate-900 uppercase tracking-tight">{activity.title}</h5>
                  </div>
                  <p className="text-base text-slate-600 font-light leading-relaxed">{activity.description}</p>
              </div>
          ))}
      </div>
  </div>

  {/* DATA SUB-SECTION */}
  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-10 border border-slate-100 rounded-xl">
      <div className="flex items-start gap-5">
          <Shield className="text-pc-green mt-1 flex-shrink-0" size={24} />
          <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase mb-3 tracking-wider">Market Intelligence & Official Pricing</h4>
              <p className="text-xs text-slate-500 font-light leading-relaxed">CAPEF maintains official price indexes for key commodities like cocoa, coffee, and timber, providing essential market transparency for global investors.</p>
          </div>
      </div>
      <div className="flex items-start gap-5">
          <CheckCircle className="text-pc-green mt-1 flex-shrink-0" size={24} />
          <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase mb-3 tracking-wider">Regulatory Norms & Certifications</h4>
              <p className="text-xs text-slate-500 font-light leading-relaxed">We leverage CAPEF's framework to provide investors with clear pathways to official farmer cards, ensuring all projects meet national regulatory standards.</p>
          </div>
      </div>
  </div>
</section>

      {/* LEGAL SECURITY SECTION */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-8 text-center mb-16">
          <h3 className="text-4xl font-serif text-slate-900 uppercase tracking-tighter">
            The <span className="text-pc-green italic">Legal Path</span> to Ownership
          </h3>
          <p className="text-slate-400 mt-4 uppercase text-[10px] tracking-[0.3em] font-bold">Safe & Transparent Land Acquisition</p>
        </div>

        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FileText className="text-pc-gold" size={20} />
            </div>
            <h5 className="font-bold uppercase text-xs tracking-widest">Land Ordinance 1974</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">The fundamental law governing land tenure in Cameroon.</p>
          </div>
          <div className="space-y-4">
             <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Shield className="text-pc-gold" size={20} />
            </div>
            <h5 className="font-bold uppercase text-xs tracking-widest">Investment Code</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">Customs and tax incentives for agricultural projects.</p>
          </div>
          <div className="space-y-4">
             <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <CheckCircle className="text-pc-gold" size={20} />
            </div>
            <h5 className="font-bold uppercase text-xs tracking-widest">Notarial Escrow</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">All funds are held in licensed Notary Escrow accounts.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default InstitutionalPage;