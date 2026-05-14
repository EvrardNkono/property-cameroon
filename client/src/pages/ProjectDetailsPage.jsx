import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, ShieldCheck, 
  TrendingUp, Activity, Download, MessageCircle,
  Clock, Award, ChevronRight, FileText, Info
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LIVESTOCK_ASSETS } from '../data/livestockData';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Recherche du projet par ID avec fallback
  const project = LIVESTOCK_ASSETS.find(item => item.id.toString() === id) || LIVESTOCK_ASSETS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-emerald-950 selection:bg-amber-200 selection:text-emerald-950">
      <Navbar />

      {/* Hero Section Dynamic */}
      <section className="relative h-[65vh] md:h-[80vh] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <img 
            src={project.image} 
            className="w-full h-full object-cover"
            alt={project.title}
          />
        </motion.div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-transparent to-[#FCFBF7]" />
        <div className="absolute inset-0 bg-emerald-950/10" />
        
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button 
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-full mb-10 hover:bg-emerald-950 hover:text-white transition-all shadow-2xl"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Return to Category
              </button>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-bold uppercase tracking-widest mb-4">
                Asset ID: #LS-00{project.id}
              </span>
              <h1 className="text-5xl md:text-9xl font-serif leading-[0.85] tracking-tight">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid lg:grid-cols-12 gap-20">
          
          {/* Left Column: Deep Dive */}
          <div className="lg:col-span-7 space-y-20">
            
            {/* Project Vision */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-amber-500/30" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600 flex items-center gap-3">
                   Project Overview
                </h2>
              </div>
              <p className="text-3xl md:text-4xl font-light text-emerald-900 leading-[1.4] mb-10">
                {project.fullDescription || `A premier ${project.category} unit optimized for high-yield production in ${project.location}.`}
              </p>
              <div className="flex flex-wrap gap-4">
                {['Sustainably Managed', 'Bio-Certified', 'Export Ready'].map((tag, i) => (
                  <span key={i} className="px-5 py-2 rounded-full border border-emerald-900/10 text-[10px] font-bold uppercase tracking-widest text-emerald-900/50">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Core Advantages Grid */}
            <section className="grid md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2.5rem] border border-emerald-900/5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="font-serif text-2xl mb-4 text-emerald-950">Bio-Security</h3>
                <p className="text-sm text-emerald-900/60 leading-relaxed font-medium">
                  State-of-the-art containment and health monitoring. Every unit undergoes strict 24/7 veterinary surveillance to ensure zero-risk production.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2.5rem] border border-emerald-900/5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                  <MapPin size={28} />
                </div>
                <h3 className="font-serif text-2xl mb-4 text-emerald-950">Strategic Zone</h3>
                <p className="text-sm text-emerald-900/60 leading-relaxed font-medium">
                  Located in {project.location}, Cameroon. This region provides the ideal climate and direct access to primary distribution arteries.
                </p>
              </motion.div>
            </section>

            {/* Technical Specs Data Sheet */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-emerald-950 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-3xl font-serif mb-12 flex items-center gap-4">
                   Technical Matrix <span className="text-white/20 italic text-xl">v2.0</span>
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-x-16 gap-y-2">
                  {[
                    { label: "Est. Cycle", value: "6 - 12 Months", icon: <Clock size={16}/> },
                    { label: "Density", value: "2,500 units/ha", icon: <Activity size={16}/> },
                    { label: "Grade", value: "Premium A+", icon: <Award size={16}/> },
                    { label: "Framework", value: "Smart-Farm IoT", icon: <FileText size={16}/> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-6 border-b border-white/10 group">
                      <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-amber-400 transition-colors">
                        {item.icon} {item.label}
                      </div>
                      <div className="font-bold text-lg">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </motion.section>
          </div>

          {/* Right Column: Investment Widget */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[3.5rem] p-12 border border-emerald-900/10 shadow-3xl relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2725B]/5 rounded-bl-[100px]" />

                <div className="mb-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/30 block mb-4">Investment Capital Required</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold tracking-tighter">{project.price}</span>
                    <span className="text-xl font-serif italic text-emerald-900/40">XAF</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-900/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-900/40 block mb-2">Net Returns</span>
                    <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                      <TrendingUp size={20} /> +{project.roi}
                    </div>
                  </div>
                  <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-900/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-900/40 block mb-2">Cycle Time</span>
                    <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                      <Calendar size={20} /> 12 Mo.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-emerald-950 text-amber-300 py-7 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-950/20">
                    <MessageCircle size={20} /> Connect with Advisor
                  </button>
                  
                  <button className="w-full bg-[#FCFBF7] text-emerald-950 py-7 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border border-emerald-900/10 flex items-center justify-center gap-3 hover:bg-white hover:border-emerald-950 transition-all">
                    <Download size={20} /> Download Prospectus
                  </button>
                </div>

                <div className="mt-12 pt-8 border-t border-emerald-900/5 flex items-start gap-4">
                  <div className="p-2 bg-emerald-900/5 rounded-lg text-emerald-900/30">
                    <Info size={16} />
                  </div>
                  <p className="text-[10px] text-emerald-900/40 leading-relaxed uppercase font-bold tracking-tighter">
                    Pricing excludes VAT. All agricultural investments involve risks. Please consult our <span className="text-emerald-950 underline cursor-pointer">risk disclosure agreement</span> before proceeding.
                  </p>
                </div>
              </motion.div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center justify-center gap-4 text-emerald-900/30">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Signature Verified Asset</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;