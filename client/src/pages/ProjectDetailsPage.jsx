import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft, MapPin, ShieldCheck, TrendingUp, Activity,
  Download, MessageCircle, Clock, Award, FileText, Info,
  AlertCircle, Sparkles, Star, X, Calendar, ChevronRight
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
      location: "Localisation",
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
      tab1: "Technique",
      tab2: "Rendements",
    },
    en: {
      back: "Back",
      certifiedAsset: "CAPEF Certified Asset",
      assetId: "Ref.",
      overview: "Overview",
      biosecurity: "Bio-Security",
      biosecurityDesc: "24/7 veterinary surveillance, state-of-the-art health protocols and real-time monitoring.",
      location: "Location",
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
      tab1: "Technical",
      tab2: "Returns",
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

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-stone-200 animate-spin border-t-amber-500" />
          <Sparkles size={20} className="absolute inset-0 m-auto text-amber-500 animate-pulse" />
        </div>
        <p className="text-stone-400 text-sm tracking-widest uppercase">{t.loading}</p>
      </div>
      <Footer />
    </div>
  );

  // ── Error ──
  if (error || !project) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] px-6">
        <div className="max-w-sm text-center">
          <AlertCircle size={40} className="mx-auto mb-4 text-red-400" />
          <p className="font-semibold text-stone-800 mb-2">{t.loadingError}</p>
          <p className="text-sm text-stone-500 mb-6">{error || t.notFound}</p>
          <Link to="/agriculture/livestock" className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-800">
            <ArrowLeft size={14} /> {t.backToSectors}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  // ── Page ──
  return (
    <div className="min-h-screen bg-[#F7F5F0]" style={{ fontFamily: "'Georgia', serif" }}>
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — Full-bleed cinematic image
      ═══════════════════════════════════════════ */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 origin-center">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1600'; }}
          />
        </motion.div>

        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
        {/* Side grain texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs tracking-widest uppercase"
        >
          <ArrowLeft size={14} /> {t.back}
        </motion.button>

        {/* Certified badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-8 right-6 md:right-12 flex items-center gap-2 bg-amber-400/90 backdrop-blur-sm text-stone-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
        >
          <Star size={10} fill="currentColor" /> {t.certifiedAsset}
        </motion.div>

        {/* Hero text — bottom left, editorial */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-5xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-amber-400 text-[10px] tracking-[0.35em] uppercase mb-3 font-sans"
            >
              {t.assetId} #{project.id?.slice(-8)}
              <span className="mx-3 text-white/20">|</span>
              <MapPin size={10} className="inline mr-1" />
              {project.location}{project.region ? `, ${project.region}` : ''}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white leading-[1.05] tracking-tight mb-6"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
                fontFamily: "'Georgia', serif",
                fontStyle: 'italic',
              }}
            >
              {project.title}
            </motion.h1>

            {/* ROI pill strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <TrendingUp size={13} className="text-emerald-400" />
                <span className="text-white text-xs font-semibold font-sans">+{project.roi}% ROI</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Clock size={13} className="text-amber-400" />
                <span className="text-white text-xs font-sans">{cycleFmt}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <ShieldCheck size={13} className="text-sky-400" />
                <span className="text-white text-xs font-sans">{t.premiumGrade}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BODY
      ═══════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-28">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-16 xl:gap-24 items-start">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Tabs */}
            <div className="flex gap-0 mb-12 border-b border-stone-200 font-sans">
              {[t.tab0, t.tab1, t.tab2].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-5 py-3 text-xs tracking-widest uppercase transition-all ${
                    activeTab === i
                      ? 'border-b-2 border-stone-800 text-stone-900 font-bold -mb-px'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 0 — Overview */}
            {activeTab === 0 && (
              <motion.div
                key="tab0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Pull quote */}
                <blockquote
                  className="text-stone-800 leading-relaxed mb-10 pl-6 border-l-2 border-amber-400"
                  style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.6rem)', fontStyle: 'italic', lineHeight: 1.5 }}
                >
                  {project.description}
                </blockquote>

                {/* Feature tags */}
                {project.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-12 font-sans">
                    {project.features.map((f, i) => (
                      <span key={i} className="px-3 py-1.5 bg-stone-100 text-stone-600 text-[10px] tracking-widest uppercase rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Two advantage cards */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    {
                      icon: <ShieldCheck size={20} />,
                      color: 'text-emerald-600',
                      bg: 'bg-emerald-50',
                      title: t.biosecurity,
                      desc: t.biosecurityDesc,
                    },
                    {
                      icon: <MapPin size={20} />,
                      color: 'text-amber-600',
                      bg: 'bg-amber-50',
                      title: t.location,
                      desc: t.locationDesc?.replace('{loc}', project.location),
                    },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-7 border border-stone-100 hover:shadow-lg transition-shadow"
                    >
                      <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color} mb-5`}>
                        {card.icon}
                      </div>
                      <h3 className="text-stone-900 font-semibold mb-2 font-sans text-base">{card.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed font-sans">{card.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 1 — Technical */}
            {activeTab === 1 && (
              <motion.div
                key="tab1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-stone-900 rounded-3xl p-8 md:p-12 text-white font-sans"
              >
                <p className="text-stone-500 text-[10px] tracking-[0.3em] uppercase mb-8">Données techniques</p>
                <div className="space-y-0 divide-y divide-stone-800">
                  {[
                    { label: t.cycle, value: cycleFmt, icon: <Clock size={15}/> },
                    { label: t.capacity, value: `${project.capacity} ${project.capacityUnit}`, icon: <Activity size={15}/> },
                    { label: t.grade, value: t.premiumGrade, icon: <Award size={15}/> },
                    { label: t.status, value: project.status === 'Available' ? t.available : project.status, icon: <FileText size={15}/> },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-5 group">
                      <div className="flex items-center gap-3 text-stone-500 text-xs tracking-wider uppercase group-hover:text-amber-400 transition-colors">
                        {row.icon} {row.label}
                      </div>
                      <span className="text-white font-semibold text-sm">{row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 2 — Returns */}
            {activeTab === 2 && (
              <motion.div
                key="tab2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-sans"
              >
                {/* Big ROI display */}
                <div className="flex items-end gap-4 mb-10">
                  <span
                    className="font-bold text-emerald-600 leading-none"
                    style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', fontFamily: "'Georgia', serif" }}
                  >
                    +{project.roi}%
                  </span>
                  <div className="pb-3">
                    <p className="text-stone-800 font-semibold text-sm">{t.netReturns}</p>
                    <p className="text-stone-400 text-xs">{t.perYear}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-stone-100">
                    <ShieldCheck size={20} className="text-emerald-500 mb-3" />
                    <p className="text-stone-800 text-sm font-medium">{t.guaranteed}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-stone-100">
                    <div className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-1">{t.moderate}</div>
                    <p className="text-stone-500 text-xs">{t.risk}</p>
                  </div>
                </div>

                {/* Horizon bar */}
                <div className="mt-8 bg-gradient-to-r from-stone-900 to-stone-700 rounded-2xl p-6 text-white">
                  <p className="text-stone-400 text-[10px] tracking-[0.3em] uppercase mb-4">Projection sur 3 ans</p>
                  <div className="flex gap-1 items-end h-16">
                    {[40, 55, 70, 80, 88, 95, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: `${h}%`, originY: 1 }}
                        className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-amber-400' : 'bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT COLUMN — sticky card ── */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-xl"
            >
              {/* Card header strip */}
              <div className="bg-stone-900 px-8 py-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} className="text-amber-400" />
                  <span className="text-amber-400 text-[9px] tracking-[0.3em] uppercase font-sans">{t.opportunity}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-white font-bold" style={{ fontSize: '2.8rem', lineHeight: 1, fontFamily: "'Georgia', serif" }}>
                    +{project.roi}%
                  </span>
                  <div>
                    <p className="text-stone-300 text-xs font-sans">{t.netReturns}</p>
                    <p className="text-stone-500 text-[10px] font-sans">{t.perYear}</p>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-8 py-7 font-sans">
                {/* Cycle */}
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <span className="text-stone-400 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Clock size={13} /> {t.cycleTime}
                  </span>
                  <span className="text-stone-800 text-sm font-semibold">{cycleFmt}</span>
                </div>
                {/* Capacity */}
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <span className="text-stone-400 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Activity size={13} /> {t.capacity}
                  </span>
                  <span className="text-stone-800 text-sm font-semibold">{project.capacity} {project.capacityUnit}</span>
                </div>
                {/* Grade */}
                <div className="flex items-center justify-between py-3 mb-6">
                  <span className="text-stone-400 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award size={13} /> {t.grade}
                  </span>
                  <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">{t.premiumGrade}</span>
                </div>

                {/* CTA buttons */}
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <MessageCircle size={15} /> {t.contactAdvisor}
                </button>
                <button className="w-full bg-stone-50 hover:bg-stone-100 text-stone-700 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2">
                  <Download size={15} /> {t.download}
                </button>

                <div className="flex items-start gap-2 mt-5 text-stone-400">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed">{t.advisor24h}</p>
                </div>
              </div>
            </motion.div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 mt-5 text-stone-400 font-sans">
              <ShieldCheck size={14} />
              <span className="text-[10px] tracking-widest uppercase">{t.certifiedAsset}</span>
            </div>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════
          CONTACT MODAL
      ═══════════════════════════════════════════ */}
      {showContactModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-stone-900 px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-amber-400 text-[9px] tracking-[0.3em] uppercase font-sans mb-1">{t.certifiedAsset}</p>
                <h3 className="text-white text-xl" style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic' }}>
                  {t.contactTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-stone-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-8 py-7 font-sans">
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
                <p className="text-amber-800 text-sm font-medium">{project.title}</p>
                <p className="text-amber-600 text-xs mt-0.5">+{project.roi}% ROI · {cycleFmt}</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: t.name, type: 'text' },
                  { label: t.email, type: 'email' },
                  { label: t.phone, type: 'tel' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-stone-400 transition-colors bg-stone-50"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5">{t.message}</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-stone-400 transition-colors bg-stone-50 resize-none"
                  />
                </div>
                <button className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-xl font-semibold text-sm tracking-wide transition-all">
                  {t.send}
                </button>
              </div>
              <p className="text-center text-stone-400 text-[10px] mt-4">{t.advisor24h}</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;