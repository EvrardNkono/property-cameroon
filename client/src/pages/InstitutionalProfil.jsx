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

/* ── PALETTE CAPEF : vert institutionnel + or ── */
const G = '#1a4731';   // vert foncé CAPEF
const GL = '#2d6e4e';  // vert moyen
const GO = '#c8a84b';  // or CAPEF
const GB = '#f0f7f2';  // vert très clair bg

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
    alert("Demande d'adhésion envoyée ! Notre équipe vous contacte sous 48h.");
    setModal(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background:'#f7fbf8', fontFamily:"'Georgia','Times New Roman',serif" }}>
      <Navbar />

      {/* ══════════════════════════════════════
          HERO — VERT CAPEF
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: G }}>
        {/* Image fond */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage:`url(${IMGS.hero})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.25 }} />
          <div className="absolute inset-0" style={{ background:`linear-gradient(160deg, ${G} 30%, ${GL}88 100%)` }} />
        </motion.div>

        {/* Motif feuilles décoratif */}
        <div className="absolute inset-0 z-[1] opacity-[0.06]" style={{
          backgroundImage:'radial-gradient(circle, #c8a84b 1px, transparent 1px)',
          backgroundSize:'60px 60px'
        }} />

        <div className="relative z-10 text-center px-8 max-w-6xl mx-auto pt-32 pb-20">
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9 }}>
            {/* Badge CAPEF */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-3 shadow-2xl w-20 h-20 flex items-center justify-center">
                <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-full h-full object-contain" />
              </div>
            </div>

            <span className="inline-block px-6 py-2 border text-[10px] font-black uppercase tracking-[0.5em] mb-6" style={{ borderColor:`${GO}66`, color:GO, fontFamily:'sans-serif' }}>
              Établissement Public Professionnel • Fondé en 1921
            </span>

            <h1 className="text-5xl md:text-8xl text-white leading-[0.9] mb-6">
              CAPEF<br />
              <span className="italic font-light text-3xl md:text-5xl" style={{ color:GO }}>
                Chambre d'Agriculture, des Pêches,<br />de l'Élevage et des Forêts du Cameroun
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-white/70 text-lg leading-relaxed mb-12 mt-8" style={{ fontFamily:'sans-serif', fontStyle:'normal' }}>
              Pilier institutionnel qui structure, protège et propulse les secteurs Agropastoraux, 
              Halieutiques et Forestiers du Cameroun vers les standards mondiaux.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => setModal(true)}
                className="flex items-center gap-3 px-12 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:scale-105 shadow-2xl"
                style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
                <UserPlus size={18} /> Adhérer à la CAPEF
              </button>
              <Link to="/book-appointment">
                <button className="flex items-center gap-3 px-12 py-5 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                  style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                  <Phone size={18} style={{ color:GO }} /> Nous contacter
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Flèche scroll */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
            className="mt-20">
            <div className="w-px h-16 mx-auto" style={{ background:`linear-gradient(to bottom, ${GO}, transparent)` }} />
          </motion.div>
        </div>

        {/* Bandeau 4 secteurs */}
        <div className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 md:grid-cols-4">
          {[
            { icon:<Leaf size={20}/>, label:"Agriculture" },
            { icon:<Fish size={20}/>, label:"Pêches & Aquaculture" },
            { icon:<Beef size={20}/>, label:"Élevage" },
            { icon:<Trees size={20}/>, label:"Forêts" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-center gap-3 py-5 text-white/80 hover:text-white transition-all"
              style={{ background: i%2===0 ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.25)', fontFamily:'sans-serif', fontSize:11 }}>
              <span style={{ color:GO }}>{s.icon}</span>
              <span className="font-black uppercase tracking-widest text-[10px]">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          MISSION INSTITUTIONNELLE
      ══════════════════════════════════════ */}
      <section className="py-28 px-8" style={{ background:'white' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Mosaïque images */}
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
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Mission Institutionnelle</span>
            <h2 className="text-4xl md:text-5xl leading-tight mb-6 italic" style={{ color:G }}>
              L'interface légale entre<br />l'État et le Producteur.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10" style={{ fontFamily:'sans-serif' }}>
              Sous la tutelle technique du Ministère de l'Agriculture et du Développement Rural, 
              la CAPEF est votre bouclier juridique et technique. Elle n'est pas un simple partenaire — 
              elle est votre représentant institutionnel reconnu par l'État camerounais.
            </p>

            <div className="space-y-4">
              {[
                { icon:<Gavel size={18}/>, title:"Mission Consultative", desc:"Conseiller obligatoire du gouvernement sur les politiques rurales et agricoles." },
                { icon:<Scale size={18}/>, title:"Régulation Sectorielle", desc:"Structuration des inter-professions pour une juste répartition des revenus." },
                { icon:<Globe size={18}/>, title:"Diplomatie Économique", desc:"Représentation du Cameroun dans les chambres internationales." },
                { icon:<Handshake size={18}/>, title:"Protection des Membres", desc:"Assistance juridique, foncière et contractuelle pour tous les adhérents." },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-5 border border-slate-100 rounded-xl hover:border-green-200 hover:shadow-md transition-all group cursor-default">
                  <div className="mt-1 shrink-0 p-2 rounded-lg" style={{ color:G, background:GB }}>
                    {item.icon}
                  </div>
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
                Rejoindre la CAPEF →
              </button>
              <Link to="/book-appointment">
                <button className="px-10 py-4 font-black uppercase text-[11px] tracking-widest border transition-all hover:bg-slate-50"
                  style={{ borderColor:G, color:G, fontFamily:'sans-serif' }}>
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CHIFFRES CLÉS
      ══════════════════════════════════════ */}
      <section className="py-24 px-8" style={{ background:G }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Poids Institutionnel</span>
            <h2 className="text-4xl md:text-5xl text-white italic">La CAPEF en chiffres</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background:'rgba(255,255,255,0.1)' }}>
            {[
              { num:"4", label:"Sections représentées", sub:"Agri · Pêche · Élevage · Forêt" },
              { num:"10", label:"Régions couvertes", sub:"Présence nationale complète" },
              { num:"1921", label:"Année de fondation", sub:"Plus d'un siècle d'institution" },
              { num:"100%", label:"Légitimité d'État", sub:"Tutelle Ministère Agriculture" },
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
              Devenir membre officiel de la CAPEF →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4 PILIERS DE SERVICES
      ══════════════════════════════════════ */}
      <section className="py-28 px-8" style={{ background:GB }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Services Consulaires</span>
            <h2 className="text-4xl md:text-6xl italic" style={{ color:G }}>La puissance d'un réseau d'État.</h2>
            <p className="text-slate-400 text-sm mt-4 max-w-xl mx-auto" style={{ fontFamily:'sans-serif' }}>
              En adhérant à la CAPEF via Palm Connect, vous accédez à l'ensemble de ces services institutionnels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:<ShieldCheck size={28}/>, title:"Assistance Juridique", desc:"Sécurisation des baux ruraux et gestion des conflits fonciers. Défense de vos intérêts devant les instances." },
              { icon:<Warehouse size={28}/>, title:"Appui Logistique", desc:"Accès aux plateformes de stockage et aux infrastructures de transformation agréées CAPEF." },
              { icon:<Globe size={28}/>, title:"Certificats d'Export", desc:"Délivrance et accompagnement pour les certifications UE/USA (EPA, AGOA). Ouverture de marchés internationaux." },
              { icon:<Coins size={28}/>, title:"Facilitation du Crédit", desc:"Assistance à la constitution de dossiers de subvention auprès des banques partenaires et des fonds agricoles." },
            ].map((p, i) => (
              <div key={i} className="bg-white p-10 border border-slate-100 hover:border-green-300 hover:shadow-xl transition-all group cursor-default">
                <div className="w-14 h-14 flex items-center justify-center mb-8 transition-all group-hover:text-white rounded-xl"
                  style={{ background:GB, color:G }}>
                  {p.icon}
                </div>
                <h4 className="font-bold text-lg mb-4 italic" style={{ color:G }}>{p.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-6" style={{ fontFamily:'sans-serif' }}>{p.desc}</p>
                <button onClick={() => setModal(true)}
                  className="text-[10px] uppercase tracking-widest font-black border-b-2 pb-1 transition-all hover:pb-2"
                  style={{ color:G, borderColor:GO, fontFamily:'sans-serif' }}>
                  Accéder à ce service →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PHOTO + CITATION CAPEF
      ══════════════════════════════════════ */}
      <section className="py-0 relative overflow-hidden" style={{ minHeight:400 }}>
        <div className="absolute inset-0 z-0">
          <img src={IMGS.meeting} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:`${G}e0` }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-24 text-center">
          <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-16 h-16 object-contain mx-auto mb-8 rounded-xl bg-white p-2" />
          <blockquote className="text-2xl md:text-4xl text-white italic leading-relaxed mb-8">
            "Structurer, protéger et valoriser le monde rural camerounais — depuis 1921."
          </blockquote>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black" style={{ color:GO, fontFamily:'sans-serif' }}>
            CAPEF — Chambre d'Agriculture, des Pêches, de l'Élevage et des Forêts du Cameroun
          </span>
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
            <button onClick={() => setModal(true)}
              className="px-12 py-5 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white hover:text-black"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              Adhérer maintenant →
            </button>
            <Link to="/book-appointment">
              <button className="px-12 py-5 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                Prendre rendez-vous
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          AVANTAGES ADHÉSION
      ══════════════════════════════════════ */}
      <section className="py-28 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ color:GO, fontFamily:'sans-serif' }}>Pourquoi adhérer ?</span>
            <h2 className="text-4xl md:text-5xl italic mb-8 leading-tight" style={{ color:G }}>
              Ce que l'adhésion CAPEF<br />change concrètement.
            </h2>
            <div className="space-y-4">
              {[
                "Reconnaissance officielle comme acteur du secteur agricole camerounais",
                "Accès prioritaire aux marchés publics et appels d'offres agricoles",
                "Assistance juridique gratuite en cas de litige foncier ou contractuel",
                "Réseau national de 10 régions : partenaires, acheteurs, fournisseurs",
                "Accompagnement à l'export et certifications internationales",
                "Accès facilité au crédit agricole et aux fonds de développement",
                "Représentation institutionnelle dans les négociations nationales",
                "Formation continue et transfert de technologies agricoles",
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
              <h4 className="text-2xl italic mb-4">Vision Cameroun 2035</h4>
              <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily:'sans-serif' }}>
                Soutenir la transformation de l'agriculture de subsistance vers une agro-industrie 
                compétitive et orientée vers l'export. La CAPEF est le moteur institutionnel de cette ambition.
              </p>
              <button onClick={() => setModal(true)}
                className="text-[10px] uppercase tracking-widest font-black border-b-2 pb-1 transition-all hover:pb-2"
                style={{ color:GO, borderColor:GO, fontFamily:'sans-serif' }}>
                Rejoindre ce mouvement →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PALM CONNECT × CAPEF
      ══════════════════════════════════════ */}
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
                <div className="font-black text-xl mb-2 italic" style={{ color:G }}>Palm Connect est partenaire officiel CAPEF.</div>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>
                  En passant par Palm Connect pour votre adhésion CAPEF, vous bénéficiez d'un 
                  accompagnement personnalisé, d'un suivi de dossier dédié et d'un accès aux 
                  services de sourcing Chine en même temps que votre intégration institutionnelle.
                </p>
              </div>
              <div className="shrink-0 flex flex-col gap-3">
                <button onClick={() => setModal(true)}
                  className="px-10 py-4 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ background:G, fontFamily:'sans-serif' }}>
                  Adhérer via Palm Connect
                </button>
                <Link to="/book-appointment">
                  <button className="w-full px-10 py-4 font-black uppercase text-[11px] tracking-widest border transition-all hover:bg-slate-50 whitespace-nowrap text-center"
                    style={{ borderColor:G, color:G, fontFamily:'sans-serif' }}>
                    Poser une question
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <section className="py-32 text-center relative overflow-hidden" style={{ background:G }}>
        <div className="absolute inset-0" style={{ backgroundImage:`url(${IMGS.agri3})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }} />
        <div className="absolute inset-0" style={{ background:`linear-gradient(to bottom, ${G}, transparent, ${G})` }} />
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <img src="/images/capeflogo.jfif" alt="CAPEF" className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white p-2 shadow-xl" />
          <span className="text-[10px] uppercase tracking-[0.5em] font-black block mb-6" style={{ color:GO, fontFamily:'sans-serif' }}>Rejoignez l'élite agricole camerounaise</span>
          <h2 className="text-4xl md:text-7xl text-white leading-tight mb-8 italic">
            Devenez un<br />
            <span style={{ color:GO }}>Agro-Entrepreneur</span><br />
            Certifié CAPEF.
          </h2>
          <p className="text-white/50 text-sm mb-14 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily:'sans-serif' }}>
            Rejoindre la CAPEF via Palm Connect, c'est intégrer la plus grande plateforme 
            d'opportunités rurales du Cameroun. Premier entretien gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => setModal(true)}
              className="flex items-center justify-center gap-3 px-14 py-6 font-black uppercase text-[11px] tracking-widest transition-all hover:bg-white shadow-2xl"
              style={{ background:GO, color:G, fontFamily:'sans-serif' }}>
              <UserPlus size={18} /> Démarrer mon adhésion officielle
            </button>
            <Link to="/book-appointment">
              <button className="flex items-center justify-center gap-3 px-14 py-6 font-black uppercase text-[11px] tracking-widest border text-white hover:bg-white/10 transition-all"
                style={{ borderColor:'rgba(255,255,255,0.3)', fontFamily:'sans-serif' }}>
                <Phone size={18} style={{ color:GO }} /> Parler à un conseiller
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MODAL ADHÉSION
      ══════════════════════════════════════ */}
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
                    <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color:GO, fontFamily:'sans-serif' }}>Adhésion Officielle</span>
                    <h3 className="text-2xl italic" style={{ color:G }}>Devenir Membre CAPEF</h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Prénom *</label>
                      <input required name="firstName" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G}
                        onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Nom *</label>
                      <input required name="lastName" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G}
                        onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Téléphone *</label>
                    <input required name="phone" onChange={handleChange} type="tel"
                      className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                      style={{ fontFamily:'sans-serif' }}
                      onFocus={e => e.target.style.borderColor=G}
                      onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Ville *</label>
                      <input required name="city" onChange={handleChange} type="text"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G}
                        onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Email</label>
                      <input name="email" onChange={handleChange} type="email"
                        className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 transition-colors bg-transparent"
                        style={{ fontFamily:'sans-serif' }}
                        onFocus={e => e.target.style.borderColor=G}
                        onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block" style={{ fontFamily:'sans-serif' }}>Secteur d'activité *</label>
                    <select required name="sector" onChange={handleChange}
                      className="w-full border-b-2 border-slate-200 py-3 focus:outline-none text-slate-800 bg-transparent"
                      style={{ fontFamily:'sans-serif' }}
                      onFocus={e => e.target.style.borderColor=G}
                      onBlur={e => e.target.style.borderColor='#e2e8f0'}>
                      <option value="">— Choisir —</option>
                      <option>Agriculture</option>
                      <option>Pêches & Aquaculture</option>
                      <option>Élevage</option>
                      <option>Forêts & Bois</option>
                      <option>Transformation Agroalimentaire</option>
                    </select>
                  </div>

                  <div className="pt-6">
                    <button type="submit"
                      className="w-full py-5 font-black uppercase text-[11px] tracking-widest text-white transition-all hover:opacity-90"
                      style={{ background:G, fontFamily:'sans-serif' }}>
                      Soumettre ma demande d'adhésion
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4" style={{ fontFamily:'sans-serif' }}>
                      Notre équipe vous contacte sous 48h pour finaliser votre dossier.
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