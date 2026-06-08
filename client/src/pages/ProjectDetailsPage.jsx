import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, ShieldCheck, TrendingUp, Activity,
  Download, MessageCircle, Clock, Award, FileText, Info,
  AlertCircle, Sparkles, Star, X, Calendar, ChevronRight,
  Leaf, Truck, Droplet, Zap, Eye, Heart, Share2, CheckCircle, Gem
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const useCurrentLang = () => {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    return ['fr', 'en'].includes(finalLang) ? finalLang : 'en';
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  return lang;
};

const isDevelopment = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const BACKEND_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const ProjectDetailsPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const currentLang = useCurrentLang();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, 120]);
  const imageScale = useTransform(scrollY, [0, 600], [1, 1.12]);

  const t = {
    fr: {
      back: "Retour",
      certifiedAsset: "Actif Certifié CAPEF",
      assetId: "Réf.",
      overview: "Vue d'ensemble",
      biosecurity: "Biosécurité",
      biosecurityDesc: "Surveillance vétérinaire 24h/7j, protocoles sanitaires de pointe et monitoring en temps réel.",
      location: "Localisation stratégique",
      locationDesc: "Situé à {loc}, Cameroun — climat idéal, accès direct aux réseaux de distribution.",
      cycle: "Durée du cycle",
      capacity: "Capacité",
      grade: "Qualité",
      status: "Statut",
      premiumGrade: "Premium A+",
      available: "Disponible",
      contactAdvisor: "Contacter un conseiller",
      download: "Télécharger la brochure",
      why: "Pourquoi investir ?",
      returns: "Rendements projetés",
      risk: "Risque",
      moderate: "Modéré",
      guaranteed: "Rendements garantis par contrat",
      loadingError: "Erreur de chargement",
      notFound: "Projet introuvable",
      backToSectors: "Retour aux secteurs",
      loading: "Chargement du projet…",
      unknown: "Inconnu",
      months: "mois",
      perYear: "/ an",
      netReturns: "Rendement net",
      cycleTime: "Cycle",
      contactTitle: "Demande d'information",
      name: "Nom complet",
      email: "Email",
      phone: "Téléphone",
      message: "Message",
      send: "Envoyer la demande",
      advisor24h: "Un conseiller vous répond sous 24h",
      close: "Fermer",
      opportunity: "Opportunité d'investissement",
      tab0: "Présentation",
      tab1: "Caractéristiques",
      tab2: "Rendements",
      sustainable: "Agriculture durable",
      sustainableDesc: "Pratiques éco-responsables certifiées pour une production respectueuse de l'environnement.",
      logistics: "Logistique intégrée",
      logisticsDesc: "Distribution nationale et potentiel export vers les marchés internationaux."
    },
    en: {
      back: "Back",
      certifiedAsset: "CAPEF Certified Asset",
      assetId: "Ref.",
      overview: "Overview",
      biosecurity: "Bio-Security",
      biosecurityDesc: "24/7 veterinary surveillance, state-of-the-art health protocols and real-time monitoring.",
      location: "Strategic Location",
      locationDesc: "Located in {loc}, Cameroon — ideal climate, direct access to distribution networks.",
      cycle: "Cycle Duration",
      capacity: "Capacity",
      grade: "Grade",
      status: "Status",
      premiumGrade: "Premium A+",
      available: "Available",
      contactAdvisor: "Contact an Advisor",
      download: "Download Prospectus",
      why: "Why invest?",
      returns: "Projected Returns",
      risk: "Risk",
      moderate: "Moderate",
      guaranteed: "Contractually guaranteed returns",
      loadingError: "Loading Error",
      notFound: "Project not found",
      backToSectors: "Back to sectors",
      loading: "Loading project…",
      unknown: "Unknown",
      months: "months",
      perYear: "/ year",
      netReturns: "Net Returns",
      cycleTime: "Cycle",
      contactTitle: "Request Information",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      send: "Send Request",
      advisor24h: "An advisor will reply within 24h",
      close: "Close",
      opportunity: "Investment Opportunity",
      tab0: "Overview",
      tab1: "Features",
      tab2: "Returns",
      sustainable: "Sustainable Farming",
      sustainableDesc: "Eco-responsible certified practices for environmentally respectful production.",
      logistics: "Integrated Logistics",
      logisticsDesc: "National distribution and export potential to international markets."
    }
  }[currentLang] || {};

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/livestock/${image}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getLivestockById(id, { lang: currentLang });
        let livestock = res.livestock || res.data || res;
        if (!livestock || !livestock._id) throw new Error('No data');
        const mainImage = livestock.images?.[0]
          ? getImageUrl(livestock.images[0])
          : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1600';
        let features = Array.isArray(livestock.features)
          ? livestock.features
          : typeof livestock.features === 'string'
            ? livestock.features.split(',').map(f => f.trim())
            : [];
        setProject({
          id: livestock._id,
          title: livestock.title,
          description: livestock.description,
          roi: livestock.roi || 0,
          location: livestock.location?.city || livestock.location || 'Cameroon',
          region: livestock.location?.region || '',
          cycleDuration: livestock.cycleDuration || '12 months',
          capacity: livestock.capacity?.value || 0,
          capacityUnit: livestock.capacity?.unit || 'units',
          image: mainImage,
          status: livestock.status || 'Available',
          features,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchData();
  }, [id, category, currentLang]);

  const cycleFmt = project?.cycleDuration?.includes('month')
    ? project.cycleDuration.replace('months', t.months).replace('month', t.months?.slice(0, -1))
    : project?.cycleDuration;

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-200 animate-spin border-t-emerald-600" />
          <Leaf size={20} className="absolute inset-0 m-auto text-emerald-600 animate-pulse" />
        </div>
        <p className="text-gray-400 text-sm tracking-widest uppercase">{t.loading}</p>
      </div>
      <Footer />
    </div>
  );

  if (error || !project) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] px-6">
        <div className="max-w-sm text-center">
          <AlertCircle size={40} className="mx-auto mb-4 text-amber-500" />
          <p className="font-semibold text-gray-800 mb-2">{t.loadingError}</p>
          <p className="text-sm text-gray-500 mb-6">{error || t.notFound}</p>
          <Link to="/agriculture/livestock" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800">
            <ArrowLeft size={14} /> {t.backToSectors}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — Full-bleed cinematic image (fusion)
      ═══════════════════════════════════════════ */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
        <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 origin-center">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1600'; }}
          />
        </motion.div>

        {/* Dégradé élégant — vert → noir */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Texture subtile */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 md:left-12 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs tracking-widest uppercase z-10"
        >
          <ArrowLeft size={14} /> {t.back}
        </motion.button>

        {/* Certified badge — style inspiré du design élégant */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-24 right-6 md:right-12 flex items-center gap-2 bg-emerald-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider z-10 shadow-lg"
        >
          <Star size={10} fill="currentColor" /> {t.certifiedAsset}
        </motion.div>

        {/* Hero text — inspiré du design élégant mais avec le style cinématique */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <span className="text-amber-400 text-[10px] tracking-[0.35em] uppercase font-sans">
                {t.assetId} #{project.id?.slice(-8)}
              </span>
              <span className="text-white/30 text-xs">|</span>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <MapPin size={10} />
                {project.location}{project.region ? `, ${project.region}` : ''}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white leading-[1.1] tracking-tight mb-6 font-serif font-light"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              {project.title}
            </motion.h1>

            {/* ROI pills — fusion des deux styles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              <div className="flex items-center gap-2 bg-emerald-600/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <TrendingUp size={13} className="text-white" />
                <span className="text-white text-xs font-semibold">+{project.roi}% ROI</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <Clock size={13} className="text-white" />
                <span className="text-white text-xs font-semibold">{cycleFmt}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <ShieldCheck size={13} className="text-amber-400" />
                <span className="text-white text-xs font-semibold">{t.premiumGrade}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-12 bg-white/30" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          BODY — Design élégant avec tabs
      ═══════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-28">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-16 xl:gap-24 items-start">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Tabs élégants */}
            <div className="flex gap-0 mb-12 border-b border-gray-100">
              {[t.tab0, t.tab1, t.tab2].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-5 py-3 text-[11px] tracking-widest uppercase transition-all font-medium ${
                    activeTab === i
                      ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold -mb-px'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 0 — Overview (style élégant) */}
            {activeTab === 0 && (
              <motion.div
                key="tab0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-gray-700 leading-relaxed mb-10 text-lg font-light">
                  {project.description}
                </p>

                {/* Feature tags */}
                {project.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-12">
                    {project.features.map((f, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[10px] tracking-widest uppercase rounded-full border border-gray-100">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Avantages — 4 cartes élégantes */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: <ShieldCheck size={20} />, color: 'emerald', title: t.biosecurity, desc: t.biosecurityDesc },
                    { icon: <MapPin size={20} />, color: 'amber', title: t.location, desc: t.locationDesc?.replace('{loc}', project.location) },
                    { icon: <Leaf size={20} />, color: 'emerald', title: t.sustainable, desc: t.sustainableDesc },
                    { icon: <Truck size={20} />, color: 'amber', title: t.logistics, desc: t.logisticsDesc },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110 ${
                        card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {card.icon}
                      </div>
                      <h3 className="text-gray-800 font-semibold mb-2 text-base">{card.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 1 — Technical (style épuré) */}
            {activeTab === 1 && (
              <motion.div
                key="tab1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white"
              >
                <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase mb-8">Spécifications techniques</p>
                <div className="space-y-0 divide-y divide-gray-800">
                  {[
                    { label: t.cycle, value: cycleFmt, icon: <Clock size={15}/> },
                    { label: t.capacity, value: `${project.capacity} ${project.capacityUnit}`, icon: <Activity size={15}/> },
                    { label: t.grade, value: t.premiumGrade, icon: <Award size={15}/> },
                    { label: t.status, value: project.status === 'Available' ? t.available : project.status, icon: <FileText size={15}/> },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-5 group">
                      <div className="flex items-center gap-3 text-gray-500 text-xs tracking-wider uppercase group-hover:text-amber-400 transition-colors">
                        {row.icon} {row.label}
                      </div>
                      <span className="text-white font-semibold text-sm">{row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 2 — Returns (style fusion) */}
            {activeTab === 2 && (
              <motion.div
                key="tab2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-end gap-4 mb-10">
                  <span className="font-bold text-emerald-600 leading-none font-serif" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
                    +{project.roi}%
                  </span>
                  <div className="pb-3">
                    <p className="text-gray-800 font-semibold text-sm">{t.netReturns}</p>
                    <p className="text-gray-400 text-xs">{t.perYear}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <ShieldCheck size={20} className="text-emerald-500 mb-3" />
                    <p className="text-gray-800 text-sm font-medium">{t.guaranteed}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-1">{t.moderate}</div>
                    <p className="text-gray-500 text-xs">{t.risk}</p>
                  </div>
                </div>

                {/* Projection graph */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                  <p className="text-gray-400 text-[10px] tracking-[0.3em] uppercase mb-4">Projection sur 3 ans</p>
                  <div className="flex gap-1 items-end h-20">
                    {[35, 48, 62, 75, 85, 92, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.07, duration: 0.5 }}
                        style={{ height: `${h}%`, originY: 1 }}
                        className={`flex-1 rounded-t-sm transition-all ${
                          i === 6 ? 'bg-emerald-500' : 'bg-white/20 hover:bg-emerald-500/50'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-gray-500 text-[8px]">
                    <span>Année 1</span>
                    <span>Année 2</span>
                    <span>Année 3</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT COLUMN — Sticky Investment Card (style élégant) ── */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-8 py-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gem size={12} className="text-amber-400" />
                  <span className="text-amber-400 text-[9px] tracking-[0.3em] uppercase">{t.opportunity}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-white font-bold font-serif" style={{ fontSize: '2.8rem', lineHeight: 1 }}>
                    +{project.roi}%
                  </span>
                  <div>
                    <p className="text-emerald-200 text-xs">{t.netReturns}</p>
                    <p className="text-emerald-300/60 text-[10px]">{t.perYear}</p>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-8 py-7">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Clock size={13} /> {t.cycleTime}
                    </span>
                    <span className="text-gray-800 text-sm font-semibold">{cycleFmt}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Activity size={13} /> {t.capacity}
                    </span>
                    <span className="text-gray-800 text-sm font-semibold">{project.capacity} {project.capacityUnit}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Award size={13} /> {t.grade}
                    </span>
                    <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">{t.premiumGrade}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 mb-3 shadow-md"
                >
                  <MessageCircle size={15} /> {t.contactAdvisor}
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2">
                  <Download size={15} /> {t.download}
                </button>

                <div className="flex items-start gap-2 mt-5 pt-4 border-t border-gray-100">
                  <Info size={12} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-gray-400 leading-relaxed">{t.advisor24h}</p>
                </div>
              </div>
            </motion.div>

            {/* Like & Share + Trust badge */}
            <div className="flex items-center justify-between mt-5 px-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsLiked(!isLiked)} className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-all">
                  <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                  <span className="text-[10px]">Aimer</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-all">
                  <Share2 size={16} />
                  <span className="text-[10px]">Partager</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[8px] text-gray-400 tracking-widest uppercase">{t.certifiedAsset}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════
          CONTACT MODAL — Élégant
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-amber-400 text-[9px] tracking-[0.3em] uppercase mb-1">{t.certifiedAsset}</p>
                    <h3 className="text-white text-xl font-serif font-light">{t.contactTitle}</h3>
                  </div>
                  <button onClick={() => setShowContactModal(false)} className="text-white/60 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="px-8 py-7">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6">
                  <p className="text-emerald-800 text-sm font-medium">{project.title}</p>
                  <p className="text-emerald-600 text-xs mt-0.5">+{project.roi}% ROI · {cycleFmt}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1.5">{t.name}</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-emerald-400 transition-colors bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1.5">{t.email}</label>
                    <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-emerald-400 transition-colors bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1.5">{t.phone}</label>
                    <input type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-emerald-400 transition-colors bg-gray-50" />
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-sm tracking-wide transition-all">
                    {t.send}
                  </button>
                </div>
                <p className="text-center text-gray-400 text-[9px] mt-4">{t.advisor24h}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;