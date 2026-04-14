import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ShieldCheck, Globe, CheckCircle, 
  ArrowRight, Award, Landmark, 
  Warehouse, Scale, Handshake, 
  TrendingUp, Coins, Leaf, Gavel,
  ExternalLink, BarChart3
} from 'lucide-react';

const InstitutionalProfil = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-amber-500 selection:text-white overflow-x-hidden" ref={containerRef}>
      <Navbar />

      {/* --- HERO: L'ENTRÉE SOUVERAINE --- */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background avec overlay plus profond pour le contraste */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000')] bg-cover bg-center opacity-40 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        
        <motion.div style={{ y: y1 }} className="relative z-10 text-center px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-6 py-2 border border-amber-500/30 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-8 bg-amber-500/5 backdrop-blur-sm">
              Institution Consulaire • Fondée en 1921
            </span>
            <h1 className="text-6xl md:text-[130px] font-serif text-white leading-[0.85] mb-8">
              La Voix <span className="text-amber-500">Souveraine</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-200 italic font-light text-5xl md:text-[100px]">du Monde Rural.</span>
            </h1>
            <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl font-light leading-relaxed">
              La CAPEF est le pilier institutionnel qui structure, protège et propulse les filières Agropastorales, Halieutiques et Forestières du Cameroun vers les standards mondiaux.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- SECTION 1: L'IDENTITÉ RÉGALIENNE (L'AUTORITÉ) --- */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="sticky top-32">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 bg-white rounded-2xl p-3 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                 <img src="/images/capeflogo.jfif" alt="CAPEF Official" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-white text-3xl font-serif italic">CAPEF Cameroun</h2>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Établissement Public à caractère professionnel</p>
              </div>
            </div>
            
            <h3 className="text-5xl font-serif text-white mb-10 leading-tight">L'Interface <span className="text-amber-500">État-Producteurs.</span></h3>
            
            <div className="space-y-8 text-slate-400 text-lg font-light leading-relaxed">
              <p>
                Placée sous la tutelle du <span className="text-white font-medium">Ministère de l'Agriculture</span>, la CAPEF n'est pas qu'un partenaire ; c'est votre bouclier légal et technique. Elle assure la représentation de vos intérêts auprès des pouvoirs publics et des partenaires au développement.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: <Gavel size={20}/>, title: "Mission Consultative", desc: "Conseil obligatoire du gouvernement sur les politiques rurales." },
                  { icon: <Scale size={20}/>, title: "Régulation des Filières", desc: "Structuration des interprofessions pour une juste répartition des revenus." },
                  { icon: <Handshake size={20}/>, title: "Diplomatie Économique", desc: "Représentation du Cameroun dans les chambres d'agriculture internationales." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="text-amber-500 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div>
                      <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="rounded-[4rem] overflow-hidden border border-white/10 relative h-[600px] group">
               <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=1000" alt="Agriculture Cameroun" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
               <div className="absolute bottom-10 left-10 right-10">
                 <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4 block">Vision 2035</span>
                 <h4 className="text-white font-serif text-3xl mb-4 italic">Moderniser pour Dominer.</h4>
                 <p className="text-white/60 text-sm font-light">Accompagnement dans la mutation de l'agriculture de subsistance vers une agro-industrie compétitive et exportatrice.</p>
               </div>
            </div>
            
            <div className="bg-amber-500 rounded-[3rem] p-12 text-black">
              <TrendingUp size={48} className="mb-8" />
              <h4 className="text-3xl font-serif font-bold mb-6">Chiffres Clés & Impact</h4>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-black/20 pb-4">
                  <span className="text-[10px] font-black uppercase">Sections Représentées</span>
                  <span className="font-serif text-xl">Agriculture, Pêche, Élevage, Forêt</span>
                </div>
                <div className="flex justify-between border-b border-black/20 pb-4">
                  <span className="text-[10px] font-black uppercase">Couverture Nationale</span>
                  <span className="font-serif text-xl">10 Régions du Cameroun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black uppercase">Statut Partenaire</span>
                  <span className="font-serif text-xl">Partenaire Officiel Property Cameroon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: LES 4 PILIERS DE L'APPUI CAPEF (DU LOURD) --- */}
      <section className="py-32 px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6 text-center">Services Consulaires</h2>
            <h3 className="text-6xl font-serif text-white italic">La Puissance d'un Réseau d'État.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <ShieldCheck />, 
                title: "Assistance Juridique", 
                desc: "Sécurisation des baux emphytéotiques et gestion des litiges fonciers ruraux pour les investisseurs." 
              },
              { 
                icon: <Warehouse />, 
                title: "Appui Logistique", 
                desc: "Accès aux plateformes de stockage et aux infrastructures de transformation post-récolte." 
              },
              { 
                icon: <Globe />, 
                title: "Certificats Export", 
                desc: "Délivrance et appui aux certifications nécessaires pour l'accès aux marchés européens et américains (APE, AGOA)." 
              },
              { 
                icon: <Coins />, 
                title: "Facilitation Crédit", 
                desc: "Accompagnement dans le montage de dossiers de subventions et crédits de campagne auprès des banques partenaires." 
              }
            ].map((p, i) => (
              <div key={i} className="p-10 bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 hover:border-amber-500/50 transition-all group">
                <div className="text-amber-500 mb-8 w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl group-hover:bg-amber-500 group-hover:text-black transition-all">
                  {p.icon}
                </div>
                <h4 className="text-white text-xl font-serif mb-4">{p.title}</h4>
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: L'ENGAGEMENT SND30 --- */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Politique Nationale</h2>
            <h3 className="text-5xl font-serif text-white mb-8">L'Acteur Majeur de la <br /><span className="italic text-neutral-500">Transformation Structurelle.</span></h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed mb-10">
              Dans le cadre de la <span className="text-white underline decoration-amber-500/50 underline-offset-8">SND30 (Stratégie Nationale de Développement 2020-2030)</span>, la CAPEF pilote la modernisation des outils de production. Elle ne se contente plus d'orienter, elle impulse le passage au "Made in Cameroon" industriel.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white font-serif text-xl">
                <CheckCircle className="text-amber-500" /> Développement des agro-pôles.
              </div>
              <div className="flex items-center gap-4 text-white font-serif text-xl">
                <CheckCircle className="text-amber-500" /> Promotion de l'Import-Substitution.
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="absolute inset-0 bg-amber-500/20 blur-[120px]" />
             <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12">
                <BarChart3 className="text-amber-500 mb-8" size={60} />
                <h4 className="text-white text-2xl font-serif mb-6 italic">Objectifs 2030 :</h4>
                <p className="text-slate-400 font-light mb-8">
                  Multiplier par trois la valeur ajoutée des produits agropastoraux via la transformation locale et la réduction drastique des importations alimentaires.
                </p>
                <div className="flex items-center gap-4 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                  Document Officiel <ExternalLink size={16} />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA: LE RÉSEAU DES GAGNANTS --- */}
      <section className="py-40 text-center relative overflow-hidden bg-white rounded-t-[5rem]">
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <Landmark className="mx-auto text-amber-500 w-24 h-24 mb-12" />
          <h2 className="text-5xl md:text-8xl font-serif text-slate-900 mb-8 leading-none">
            Devenez un <span className="italic text-amber-600 font-light underline decoration-amber-500/30">Agro-Entrepreneur</span> Certifié.
          </h2>
          <p className="text-slate-500 text-lg font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Rejoindre la CAPEF via Property Cameroon, c'est intégrer la plus grande plateforme d'opportunités rurales du pays. C'est passer de l'amateurisme à l'excellence institutionnelle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-black text-white px-16 py-8 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 shadow-2xl transition-all duration-500 w-full sm:w-auto flex items-center justify-center gap-3">
              Commencer l'Adhésion Officielle <ArrowRight size={16} />
            </button>
            <button className="border-2 border-slate-200 text-slate-900 px-16 py-8 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:border-amber-500 transition-all w-full sm:w-auto">
              Découvrir les Missions d'État
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InstitutionalProfil;