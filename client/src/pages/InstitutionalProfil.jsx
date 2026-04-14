import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Globe, CheckCircle,
  ArrowRight, Landmark,
  Warehouse, Scale, Handshake,
  TrendingUp, Coins, Gavel,
  X, UserPlus, FileText, Phone, Mail, MapPin,
  Leaf, Fish, Beef, Trees
} from 'lucide-react';

const G  = '#1a4731';
const GL = '#2d6e4e';
const GO = '#c8a84b';
const GB = '#f0f7f2';

const IMGS = {
  hero:    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1800&q=80",
  agri1:   "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80",
  agri2:   "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=900&q=80",
  agri3:   "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&q=80",
  fishing: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
  forest:  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80",
  meeting: "https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?w=900&q=80",
};

const InstitutionalProfil = () => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', city:'', email:'', sector:'' });
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    alert("Membership application submitted! Our team will contact you within 48 hours.");
    setModal(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#f7fbf8', fontFamily:"'Georgia','Times New Roman',serif" }}>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: G }}>
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage:`url(${IMGS.hero})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.25 }} />
          <div className="absolute inset-0" style={{ background:`linear-gradient(160deg, ${G} 30%, ${GL}88 100%)` }} />
        </motion.div>
        <div className="absolute inset-0 z-[1] opacity-[0.06]" style={{ backgroundImage:'radial-gradient(circle, #c8a84b 1px, transparent 1px)', backgroundSize:'60px 60px' }} />

        <div className="relative z-10 text-center px-8 max-w-6xl mx-auto pt-32 pb-20">
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9 }}>
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-3 shadow-2xl w-20 h-20 flex items-center justify-center">
                <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-full h-full object-contain" />
              </div>
            </div>
            <span className="inline-block px-6 py-2 border text-[10px] font-black uppercase tracking-[0.5em] mb-6" style={{ borderColor:`${GO}66`, color:GO, fontFamily:'sans-serif' }}>
              Professional Public Establishment • Founded in 1921
            </span>
            <h1 className="text-5xl md:text-8xl text-white leading-[0.9] mb-6">
              CAPEF<br />
              <span className="italic font-light text-3xl md:text-5xl" style={{ color:GO }}>
                Chamber of Agriculture, Fisheries,<br />Livestock &amp; Forestry of Cameroon
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-white/70 text-lg leading-relaxed mb-12 mt-8" style={{ fontFamily:'sans-serif', fontStyle:'normal' }}>
              The institutional pillar that structures, protects, and propels Cameroon's Agropastoral,
              Fisheries, and Forestry sectors toward global standards.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => setModal(true)}
                className="flex items-center gap-3 px-12 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:scale-105 shadow-2xl"
                style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
                <UserPlus size={18} /> Join CAPEF Now
              </button>
              <Link to="/book-appointment">
                <button className="flex items-center gap-3 px-12 py-5 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                  style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                  <Phone size={18} style={{ color:GO }} /> Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }} className="mt-20">
            <div className="w-px h-16 mx-auto" style={{ background:`linear-gradient(to bottom, ${GO}, transparent)` }} />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 md:grid-cols-4">
          {[
            { icon:<Leaf size={20}/>, label:"Agriculture" },
            { icon:<Fish size={20}/>, label:"Fisheries & Aquaculture" },
            { icon:<Beef size={20}/>, label:"Livestock" },
            { icon:<Trees size={20}/>, label:"Forestry" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-center gap-3 py-5 text-white/80 hover:text-white transition-all"
              style={{ background: i%2===0 ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.25)', fontFamily:'sans-serif', fontSize:11 }}>
              <span style={{ color:GO }}>{s.icon}</span>
              <span className="font-black uppercase tracking-widest text-[10px]">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INSTITUTIONAL MISSION ══ */}
      <section className="py-28 px-8" style={{ background:'white' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-2 gap-4 h-[520px]">
            <div className="row-span-2 overflow-hidden rounded-2xl">
              <img src={IMGS.agri1} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={IMGS.fishing} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={IMGS.forest} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Institutional Mission</span>
            <h2 className="text-4xl md:text-5xl leading-tight mb-6 italic" style={{ color:G }}>
              The legal interface between<br />the State and the Producer.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10" style={{ fontFamily:'sans-serif' }}>
              Under the technical supervision of the Ministry of Agriculture and Rural Development,
              CAPEF is your legal and technical shield. It is not a simple partner —
              it is your institutional representative recognized by the Cameroonian State.
            </p>
            <div className="space-y-4">
              {[
                { icon:<Gavel size={18}/>, title:"Consultative Mission", desc:"Mandatory government advisor on rural and agricultural policies." },
                { icon:<Scale size={18}/>, title:"Sector Regulation", desc:"Structuring inter-professions for a fair distribution of income." },
                { icon:<Globe size={18}/>, title:"Economic Diplomacy", desc:"Representing Cameroon in international chambers." },
                { icon:<Handshake size={18}/>, title:"Member Protection", desc:"Legal, land, and contractual assistance for all members." },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-5 border border-slate-100 rounded-xl hover:border-green-200 hover:shadow-md transition-all group cursor-default">
                  <div className="mt-1 shrink-0 p-2 rounded-lg" style={{ color:G, background:GB }}>{item.icon}</div>
                  <div>
                    <div className="font-bold text-sm mb-1" style={{ color:G }}>{item.title}</div>
                    <div className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily:'sans-serif' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-4">
              <button onClick={() => setModal(true)}
                className="px-10 py-4 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90"
                style={{ background:G, fontFamily:'sans-serif' }}>
                Join CAPEF →
              </button>
              <Link to="/book-appointment">
                <button className="px-10 py-4 font-black uppercase text-[11px] tracking-widest border transition-all hover:bg-slate-50"
                  style={{ borderColor:G, color:G, fontFamily:'sans-serif' }}>
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ KEY FIGURES ══ */}
      <section className="py-24 px-8" style={{ background:G }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Institutional Weight</span>
            <h2 className="text-4xl md:text-5xl text-white italic">CAPEF by the Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background:'rgba(255,255,255,0.1)' }}>
            {[
              { num:"4",    label:"Represented Sections",  sub:"Agri · Fisheries · Livestock · Forestry" },
              { num:"10",   label:"Regions Covered",       sub:"Full national presence" },
              { num:"1921", label:"Year Founded",          sub:"Over a century of institution" },
              { num:"100%", label:"State Legitimacy",      sub:"Ministry of Agriculture oversight" },
            ].map((s, i) => (
              <div key={i} className="p-10 text-center" style={{ background:G }}>
                <div className="text-5xl font-black mb-3" style={{ color:GO }}>{s.num}</div>
                <div className="text-white font-bold text-sm mb-1">{s.label}</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider" style={{ fontFamily:'sans-serif' }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={() => setModal(true)}
              className="px-14 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white hover:text-black"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              Become an Official CAPEF Member →
            </button>
          </div>
        </div>
      </section>

      {/* ══ 4 SERVICE PILLARS ══ */}
      <section className="py-28 px-8" style={{ background:GB }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Consular Services</span>
            <h2 className="text-4xl md:text-6xl italic" style={{ color:G }}>The power of a State network.</h2>
            <p className="text-slate-400 text-sm mt-4 max-w-xl mx-auto" style={{ fontFamily:'sans-serif' }}>
              By joining CAPEF through Palm Connect, you gain access to all of these institutional services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:<ShieldCheck size={28}/>, title:"Legal Assistance",     desc:"Securing rural leases and managing land disputes. Defense of your interests before institutional bodies." },
              { icon:<Warehouse size={28}/>, title:"Logistics Support",      desc:"Access to CAPEF-certified storage platforms and processing infrastructure." },
              { icon:<Globe size={28}/>,     title:"Export Certificates",    desc:"Issuance and support for EU/US certifications (EPA, AGOA). Opening international markets." },
              { icon:<Coins size={28}/>,     title:"Credit Facilitation",    desc:"Assistance preparing grant applications with partner banks and agricultural development funds." },
            ].map((p, i) => (
              <div key={i} className="bg-white p-10 border border-slate-100 hover:border-green-300 hover:shadow-xl transition-all group cursor-default">
                <div className="w-14 h-14 flex items-center justify-center mb-8 rounded-xl" style={{ background:GB, color:G }}>{p.icon}</div>
                <h4 className="font-bold text-lg mb-4 italic" style={{ color:G }}>{p.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-6" style={{ fontFamily:'sans-serif' }}>{p.desc}</p>
                <button onClick={() => setModal(true)}
                  className="text-[10px] uppercase tracking-widest font-black border-b-2 pb-1 transition-all hover:pb-2"
                  style={{ color:G, borderColor:GO, fontFamily:'sans-serif' }}>
                  Access this service →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUOTE BANNER ══ */}
      <section className="relative overflow-hidden" style={{ minHeight:400 }}>
        <div className="absolute inset-0 z-0">
          <img src={IMGS.meeting} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:`${G}e0` }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-24 text-center">
          <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-16 h-16 object-contain mx-auto mb-8 rounded-xl bg-white p-2" />
          <blockquote className="text-2xl md:text-4xl text-white italic leading-relaxed mb-8">
            "Structuring, protecting, and developing Cameroon's rural world — since 1921."
          </blockquote>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black" style={{ color:GO, fontFamily:'sans-serif' }}>
            CAPEF — Chamber of Agriculture, Fisheries, Livestock &amp; Forestry of Cameroon
          </span>
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
            <button onClick={() => setModal(true)}
              className="px-12 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white hover:text-black"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              Join Now →
            </button>
            <Link to="/book-appointment">
              <button className="px-12 py-5 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                Book an Appointment
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MEMBERSHIP BENEFITS ══ */}
      <section className="py-28 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Why Join?</span>
            <h2 className="text-4xl md:text-5xl italic mb-8 leading-tight" style={{ color:G }}>
              What CAPEF membership<br />concretely changes for you.
            </h2>
            <div className="space-y-4">
              {[
                "Official recognition as a player in Cameroon's agricultural sector",
                "Priority access to public markets and agricultural tenders",
                "Free legal assistance in case of land or contractual disputes",
                "National network of 10 regions: partners, buyers, suppliers",
                "Export support and international certifications",
                "Easier access to agricultural credit and development funds",
                "Institutional representation in national negotiations",
                "Ongoing training and agricultural technology transfer",
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-slate-50 hover:border-green-200 hover:bg-green-50/50 transition-all rounded-lg">
                  <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color:G }} />
                  <span className="text-slate-600 text-sm" style={{ fontFamily:'sans-serif' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl h-72">
              <img src={IMGS.agri2} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-10 rounded-2xl text-white" style={{ background:G }}>
              <TrendingUp size={40} className="mb-6" style={{ color:GO }} />
              <h4 className="text-2xl italic mb-4">Cameroon Vision 2035</h4>
              <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily:'sans-serif' }}>
                Supporting the transformation from subsistence farming to a competitive,
                export-oriented agro-industry. CAPEF is the institutional engine of this ambition.
              </p>
              <button onClick={() => setModal(true)}
                className="text-[10px] uppercase tracking-widest font-black border-b-2 pb-1 transition-all hover:pb-2"
                style={{ color:GO, borderColor:GO, fontFamily:'sans-serif' }}>
                Join this movement →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PALM CONNECT × CAPEF ══ */}
      <section className="py-24 px-8" style={{ background:GB }}>
        <div className="max-w-7xl mx-auto">
          <div className="border-l-4 p-10 md:p-14 bg-white shadow-sm" style={{ borderColor:GO }}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
              <div className="flex items-center gap-6 shrink-0">
                <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-100 p-1" />
                <div className="text-slate-300 font-black text-2xl">×</div>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-sm" style={{ background:G, color:'white' }}>PC</div>
              </div>
              <div className="flex-1">
                <div className="font-black text-xl mb-2 italic" style={{ color:G }}>Palm Connect is an official CAPEF partner.</div>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>
                  By joining CAPEF through Palm Connect, you benefit from personalized guidance,
                  a dedicated file manager, and simultaneous access to our China sourcing services
                  alongside your institutional integration.
                </p>
              </div>
              <div className="shrink-0 flex flex-col gap-3">
                <button onClick={() => setModal(true)}
                  className="px-10 py-4 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ background:G, fontFamily:'sans-serif' }}>
                  Join via Palm Connect
                </button>
                <Link to="/book-appointment">
                  <button className="w-full px-10 py-4 font-black uppercase text-[11px] tracking-widest border transition-all hover:bg-slate-50 whitespace-nowrap text-center"
                    style={{ borderColor:G, color:G, fontFamily:'sans-serif' }}>
                    Ask a Question
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-32 text-center relative overflow-hidden" style={{ background:G }}>
        <div className="absolute inset-0" style={{ backgroundImage:`url(${IMGS.agri3})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }} />
        <div className="absolute inset-0" style={{ background:`linear-gradient(to bottom, ${G}, transparent, ${G})` }} />
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white p-2 shadow-xl" />
          <span className="text-[10px] uppercase tracking-[0.5em] font-black block mb-6" style={{ color:GO, fontFamily:'sans-serif' }}>Join Cameroon's agricultural elite</span>
          <h2 className="text-4xl md:text-7xl text-white leading-tight mb-8 italic">
            Become a Certified<br />
            <span style={{ color:GO }}>Agro-Entrepreneur</span><br />
            with CAPEF.
          </h2>
          <p className="text-white/50 text-sm mb-14 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily:'sans-serif' }}>
            Joining CAPEF through Palm Connect means integrating Cameroon's largest
            rural opportunity platform. First consultation is free.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => setModal(true)}
              className="flex items-center justify-center gap-3 px-14 py-6 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white shadow-2xl"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              <UserPlus size={18} /> Start My Official Membership
            </button>
            <Link to="/book-appointment">
              <button className="flex items-center justify-center gap-3 px-14 py-6 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                <Phone size={18} style={{ color:GO }} /> Speak to an Advisor
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MEMBERSHIP MODAL ══ */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale:0.92, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.92, opacity:0 }}
              className="relative bg-white w-full max-w-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{ borderTop:`6px solid ${G}` }}>
              <button onClick={() => setModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black transition-colors z-10">
                <X size={28} />
              </button>
              <div className="p-10 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-12 h-12 rounded-lg object-contain border border-slate-100 p-1" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color:GO, fontFamily:'sans-serif' }}>Official Membership</span>
                    <h3 className="text-2xl italic" style={{ color:G }}>Become a CAPEF Member</h3>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>First Name *</label>
                      <input required name="firstName" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Last Name *</label>
                      <input required name="lastName" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Phone Number *</label>
                    <input required name="phone" onChange={handleChange} type="tel"
                      className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                      style={{ fontFamily:'sans-serif' }}
                      onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>City *</label>
                      <input required name="city" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Email</label>
                      <input name="email" onChange={handleChange} type="email"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Sector of Activity *</label>
                    <select required name="sector" onChange={handleChange}
                      className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 bg-transparent"
                      style={{ fontFamily:'sans-serif' }}
                      onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
                      <option value="">— Select —</option>
                      <option>Agriculture</option>
                      <option>Fisheries &amp; Aquaculture</option>
                      <option>Livestock</option>
                      <option>Forestry &amp; Timber</option>
                      <option>Agri-Food Processing</option>
                    </select>
                  </div>
                  <div className="pt-6">
                    <button type="submit"
                      className="w-full py-5 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90"
                      style={{ background:G, fontFamily:'sans-serif' }}>
                      Submit My Membership Application
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4" style={{ fontFamily:'sans-serif' }}>
                      Our team will contact you within 48 hours to finalize your file.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default InstitutionalProfil;