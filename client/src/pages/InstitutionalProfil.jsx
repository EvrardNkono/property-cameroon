import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Globe, CheckCircle,
  ArrowRight, Landmark,
  Warehouse, Scale, Handshake,
  TrendingUp, TrendingDown, // Ajoute TrendingDown ici
  Coins, Gavel,
  X, UserPlus, FileText, Phone, Mail, MapPin,
  Leaf, Fish, Beef, Trees,
  Award, Briefcase, GraduationCap, Mic2 // Ajoute ceux-là pour le nouveau design
} from 'lucide-react'

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

const CAPEF_SECTIONS = [
  {
    title: "Agriculture",
    content: "Encadrement des filières cacao, café, coton, et cultures vivrières pour garantir la sécurité alimentaire."
  },
  {
    title: "Pêches & Aquaculture",
    content: "Modernisation des pirogues, gestion des zones de pêche et promotion de la pisciculture intensive."
  },
  {
    title: "Élevage",
    content: "Amélioration des races bovines, aviculture moderne et contrôle sanitaire des produits animaux."
  },
  {
    title: "Forêts",
    content: "Gestion durable des ressources ligneuses et promotion de la transformation locale du bois."
  }
];

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

      

      {/* ══ QUOTE BANNER ══ */}
      <section className="relative overflow-hidden" style={{ minHeight:400 }}>
        <div className="absolute inset-0 z-0">
          <img src={IMGS.meeting} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:`${G}e0` }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-24 text-center">
         
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

      {/* ══ SECTION: YOUTH EXCELLENCE PROGRAM (BENTO GRID) ══ */}
<section className="py-24 px-8" style={{ background: '#FDFCFB' }}>
  <div className="max-w-7xl mx-auto">
    
    {/* Sophisticated Header */}
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-12 bg-slate-200"></span>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black" style={{ color: GO }}>Exclusive Program</span>
        </div>
        <h2 className="text-5xl md:text-6xl italic leading-[1.1] tracking-tight" style={{ color: G }}>
          The Advantage for <span style={{ color: GO }}>YOUNG</span> <br /> 
          <span className="text-slate-800">Pioneers.</span>
        </h2>
      </div>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed italic border-l pl-6" style={{ borderColor: GO }}>
        Driving the transition toward a competitive and export-ready agro-industry.
      </p>
    </div>

    {/* Bento Grid Layout - Balanced and Airy */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* 1. Vision & Reductions (Large Card) */}
      <div className="md:col-span-8 bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8" style={{ background: `${G}10`, color: G }}>
            <Award size={24} />
          </div>
          <h3 className="text-3xl font-bold mb-6 italic" style={{ color: G }}>A Performance Catalyst</h3>
          <p className="text-lg text-slate-600 leading-relaxed mb-8" style={{ fontFamily: 'sans-serif' }}>
            The CAPEF provides privileged access to <span className="font-bold" style={{ color: GO }}>YOUNG</span> agri-preneurs through an ecosystem designed to remove structural barriers. 
            By joining, <span className="font-bold" style={{ color: GO }}>YOUNG</span> leaders benefit from a <span className="underline decoration-2 underline-offset-4" style={{ decorationColor: GO }}>50% reduction in membership and certification fees</span>, 
            along with a total waiver of processing fees for investment files.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
          <Landmark size={200} />
        </div>
      </div>

      {/* 2. Key Figure (Square Card) */}
      <div className="md:col-span-4 bg-[#1A1A1A] p-10 rounded-[3rem] flex flex-col justify-between items-start group hover:bg-black transition-all">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${GO}20`, color: GO }}>
          <TrendingDown size={28} />
        </div>
        <div>
          <div className="text-6xl font-black text-white mb-2 italic">-50%</div>
          <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">
            Registration Fees for <span style={{ color: GO }}>YOUNG</span> Founders
          </p>
        </div>
      </div>

      {/* 3. Land & Projects (Medium Card) */}
      <div className="md:col-span-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
        <div className="flex gap-4 mb-6">
          <div className="p-3 rounded-xl" style={{ background: GB, color: G }}><MapPin size={20}/></div>
          <h4 className="text-xl font-bold italic" style={{ color: G }}>Land & Projects</h4>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
          We assist <span className="font-bold" style={{ color: GO }}>YOUNG</span> producers in maturing their projects and facilitate priority access to acquiring secured agricultural land.
        </p>
      </div>

      {/* 4. Financing & Credit (Medium Card) */}
      <div className="md:col-span-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
        <div className="flex gap-4 mb-6">
          <div className="p-3 rounded-xl" style={{ background: GB, color: G }}><Coins size={20}/></div>
          <h4 className="text-xl font-bold italic" style={{ color: G }}>Institutional Guarantee</h4>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
          CAPEF acts as a guarantor for banks and international funds to help <span className="font-bold" style={{ color: GO }}>YOUNG</span> entrepreneurs secure the capital needed for expansion.
        </p>
      </div>

      {/* 5. Expertise & Advocacy (Large Horizontal Card) */}
      <div className="md:col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-all">
        <div className="flex-1">
          <h4 className="text-2xl font-bold mb-4 italic" style={{ color: G }}>Skills & Influence</h4>
          <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
            We provide specialized training in technical and marketing management for <span className="font-bold" style={{ color: GO }}>YOUNG</span> agri-preneurs, combined with direct advocacy to the government and international NGOs to defend your interests.
          </p>
        </div>
        <div className="shrink-0 flex -space-x-3">
           {[1,2,3].map(i => (
             <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
               <img src={`https://i.pravatar.cc/150?u=${i+30}`} alt="member" />
             </div>
           ))}
           <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
             +500
           </div>
        </div>
      </div>

      {/* 6. Call to Action Card */}
      <div className="md:col-span-12 lg:col-span-4 p-2 rounded-[3.2rem]" style={{ background: `linear-gradient(135deg, ${G}, ${GL})` }}>
        <div className="h-full w-full p-8 flex flex-col justify-center items-center text-center">
          <h4 className="text-xl font-bold mb-4 italic text-white text-center">Ready to transform the sector?</h4>
          <button 
            onClick={() => setModal(true)}
            className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl hover:scale-[1.02] active:scale-95 bg-white"
            style={{ color: G }}
          >
            Activate My <span style={{ color: GO }}>YOUNG</span> License
          </button>
        </div>
      </div>

    </div>
  </div>
</section>

      <section className="py-20 bg-white">
  <div className="max-w-4xl mx-auto px-8">
    <h2 className="text-3xl font-bold mb-12 italic tracking-tight" style={{ color: G }}>
      CAPEF × Frequently Asked Questions
    </h2>
    <div className="space-y-6">
      
      {/* Question 1: Mandatory for Exporters */}
      <details className="group border-b pb-6">
        <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-slate-800">
          Why is CAPEF membership essential for exporters?
          <ArrowRight size={18} className="group-open:rotate-90 transition-transform" style={{ color: GO }} />
        </summary>
        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
          As a state institution, the Chamber certifies the professional origin and quality of your products. Without their endorsement, it is extremely difficult to meet the strict certification standards required for international markets like the European Union.
        </p>
      </details>

      {/* Question 2: Investment & Land (From Audio) */}
      <details className="group border-b pb-6">
        <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-slate-800">
          How does CAPEF concretely help young people looking to invest?
          <ArrowRight size={18} className="group-open:rotate-90 transition-transform" style={{ color: GO }} />
        </summary>
        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
          The Chamber assists you in <strong>maturing your investment projects</strong>. If you are looking for agricultural space, they facilitate the process of <strong>acquiring land</strong> and help you build solid files to secure the necessary funding for your venture.
        </p>
      </details>

      {/* Question 3: Modernization & Skills (From Audio) */}
      <details className="group border-b pb-6">
        <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-slate-800">
          What specific skills can I acquire through the Chamber?
          <ArrowRight size={18} className="group-open:rotate-90 transition-transform" style={{ color: GO }} />
        </summary>
        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
          To modernize Cameroon's agricultural sector, CAPEF provides professional training focused on three pillars: <strong>technical skills</strong> for production, <strong>managerial expertise</strong> for farm management, and <strong>marketing strategies</strong> to better position your products.
        </p>
      </details>

      {/* Question 4: Institutional Voice (From Audio) */}
      <details className="group border-b pb-6">
        <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-slate-800">
          What is the Chamber's role as a "Consultative Body"?
          <ArrowRight size={18} className="group-open:rotate-90 transition-transform" style={{ color: GO }} />
        </summary>
        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
          CAPEF acts as a bridge between producers and decision-makers. It collects real-world challenges from members in the agriculture, livestock, fisheries, and forestry sectors and submits them directly to the <strong>government, international organizations, and NGOs</strong>.
        </p>
      </details>

      {/* Question 5: Economic Promotion (From Audio) */}
      <details className="group border-b pb-6">
        <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-slate-800">
          Can CAPEF help me find new markets or customers?
          <ArrowRight size={18} className="group-open:rotate-90 transition-transform" style={{ color: GO }} />
        </summary>
        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
          Yes, one of its core missions is <strong>economic promotion</strong>. The Chamber helps producers improve their output and promotes their products both within Cameroon and on the international stage to increase visibility and sales.
        </p>
      </details>

    </div>
  </div>
</section>

     {/* ══ PALM CONNECT × CAPEF ══ */}
<section className="py-24 px-8" style={{ background: GB }}>
  <div className="max-w-7xl mx-auto">
    <div className="border-l-4 p-10 md:p-14 bg-white shadow-sm" style={{ borderColor: GO }}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
        
        {/* Logos */}
        <div className="flex items-center gap-6 shrink-0">
         
          <div className="text-slate-300 font-black text-2xl">×</div>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-sm text-white" style={{ background: G }}>PC</div>
        </div>

        {/* Main Content - Focus on Youth Benefits */}
        <div className="flex-1">
          <div className="font-black text-xl mb-3 italic uppercase tracking-tight" style={{ color: G }}>
            A Strategic Gateway for Young Agri-Entrepreneurs
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <p className="text-slate-500 text-[13px] leading-relaxed">
              The CAPEF is a state institution designed to <strong>defend your interests</strong>. It serves as a vital bridge, taking the challenges faced by young producers and submitting them directly to the <strong>government, international organizations, and NGOs</strong>. Joining means your voice is heard at the highest levels.
            </p>
            <p className="text-slate-500 text-[13px] leading-relaxed">
              Accelerate your growth through professional <strong>technical, managerial, and marketing training</strong> aimed at modernizing the industry. Benefit from specialized support to <strong>secure land</strong>, mature investment projects, and access the funding necessary to scale your production.
            </p>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-200"></span>
              Agriculture
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-200"></span>
              Livestock
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-200"></span>
              Fisheries
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-200"></span>
              Forestry
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col gap-3 w-full lg:w-auto">
          <button onClick={() => setModal(true)}
            className="px-10 py-4 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90 whitespace-nowrap"
            style={{ background: G, fontFamily: 'sans-serif' }}>
            Register with CAPEF
          </button>
          <Link to="/book-appointment">
            <button className="w-full px-10 py-4 font-black uppercase text-[11px] tracking-widest border transition-all hover:bg-slate-50 whitespace-nowrap text-center"
              style={{ borderColor: G, color: G, fontFamily: 'sans-serif' }}>
              Consult an Expert
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