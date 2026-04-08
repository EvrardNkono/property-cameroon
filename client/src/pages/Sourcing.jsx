import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Sourcing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* --- SECTION 1: THE YAOUNDÉ - CANTON AXIS (HERO) --- */}
      <section className="pt-32 pb-20 bg-[#0a192f] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="text-pc-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
                Strategic Sourcing & Business Bridge
              </span>
              <h1 className="text-4xl md:text-7xl font-serif leading-tight">
                Connecting <span className="italic">China's Industry</span> to Cameroon's <span className="text-pc-gold">Soil.</span>
              </h1>
            </div>
            <div className="pb-4">
              <div className="flex gap-4 items-center text-[10px] uppercase tracking-widest text-white/50">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Yaoundé Hub
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Canton Network
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE UNBEATABLE OFFERS (FOR FARMERS) --- */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-pc-gold text-xs uppercase tracking-[0.3em] font-black mb-4">Direct Factory Prices</h2>
            <h3 className="text-3xl font-serif text-pc-green">Essential Tools for Local Prosperity</h3>
            <p className="text-slate-500 text-sm mt-4 italic">Unbeatable rates. Tested durability. No middleman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Solar Irrigation Kit", 
                price: "From 249,000 FCFA", 
                img: "/images/globalirigationkit.jfif", // Nom réel du fichier
                desc: "Complete autonomous system for 1 hectare. Zero fuel costs." 
              },
              { 
                title: "Compact Oil Press", 
                price: "From 450,000 FCFA", 
                img: "/images/compactoil.jfif", // Nom réel du fichier
                desc: "Turn your harvest into oil instantly. High-yield extraction." 
              },
              { 
                title: "Pro Drying Unit", 
                price: "From 185,000 FCFA", 
                img: "/images/dryingunit.jfif", // Nom réel du fichier
                desc: "Preserve Cocoa, Coffee, or Fruit with industrial-grade heat control." 
              }
            ].map((product, i) => (
              <div key={i} className="bg-white border border-slate-100 group hover:shadow-2xl transition-all duration-500">
                <div className="h-64 bg-slate-200 overflow-hidden relative">
                  <div className="absolute top-4 right-4 bg-pc-gold text-pc-green text-[10px] font-black px-3 py-1 z-10 uppercase">Best Value</div>
                  <img 
                    src={product.img} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="p-8">
                  <h4 className="font-bold text-lg mb-2">{product.title}</h4>
                  <p className="text-pc-gold font-black text-xl mb-4">{product.price}</p>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">{product.desc}</p>
                  <Link to="/book-appointment" className="text-[10px] uppercase tracking-widest font-black text-pc-green border-b border-pc-green pb-1 hover:text-pc-gold hover:border-pc-gold transition-all">
                    Inquire for Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: CHINESE PARTNERS (Opportunities) --- */}
      <section className="py-24 px-8 bg-pc-green text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
          <span className="text-pc-gold text-[10px] uppercase tracking-[0.5em] font-bold">China-Cameroon Partnership</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-4 leading-tight text-white">Secure High-Yield <br/>Business Opportunities</h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { 
              title: "Prime Land Assets", 
              desc: "Legal access to strategic land reserves for industrial zones or large-scale agriculture.",
              tag: "Real Estate"
            },
            { 
              title: "Raw Material Hub", 
              desc: "Direct supply chain for high-quality Cocoa, Coffee, and Timber with full traceability.",
              tag: "Supply Chain"
            },
            { 
              title: "Strategic Compliance", 
              desc: "Comprehensive administrative and legal support for capital deployment in Cameroon.",
              tag: "Legal/Audit"
            }
          ].map((box, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-[1px] bg-pc-gold mb-8 group-hover:w-full transition-all duration-700"></div>
              <span className="text-[9px] uppercase tracking-widest text-pc-gold font-bold">{box.tag}</span>
              <h4 className="text-2xl font-serif mt-4 mb-6">{box.title}</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">{box.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 4: TRUST & STATEMENT --- */}
      <section className="py-20 bg-white border-b border-slate-100 font-sans">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-12 opacity-80">
            <img src="/images/capeflogo.jfif" alt="CAPEF" className="h-16 grayscale hover:grayscale-0 transition-all" />
            <div className="h-12 w-[1px] bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-800">Canton Fair Participant</span>
              <span className="text-[10px] text-slate-400">Spring/Autumn Sessions 2026</span>
            </div>
          </div>
          <div className="max-w-md">
            <p className="text-xs text-slate-500 italic leading-relaxed text-right">
              "We are not mere brokers. We are compliance guardians. Every Sino-Cameroonian partnership we initiate is built on absolute contractual rigor and mutual respect."
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: THE BRIDGE APPOINTMENT --- */}
      <section className="py-24 bg-slate-50 text-center relative">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-2xl md:text-4xl font-serif mb-6 text-pc-green italic leading-tight">"The Future of Investment is Interconnected."</h2>
          <p className="text-slate-500 text-sm mb-12 font-light leading-relaxed">Whether you are a farmer looking for the best equipment or a partner seeking the next great project in Cameroon, let's talk.</p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/book-appointment">
              <button className="bg-pc-gold text-pc-green px-12 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-pc-green hover:text-white transition-all shadow-xl">
                Book a Sourcing Consultation
              </button>
            </Link>
            <button className="border border-pc-green text-pc-green px-12 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-pc-green hover:text-white transition-all">
              Download Investor Guide (EN/CN)
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sourcing;