import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, ShieldCheck, 
  TrendingUp, Activity, Download, MessageCircle,
  Clock, Award, FileText, Info, Loader2, AlertCircle,
  Sparkles, Star, X, ChevronRight, Building2, 
  Droplet, Zap, Truck, Leaf, Heart, Share2,
  CheckCircle, Phone, Mail, Send, User, Lock,
  Eye, ThumbsUp, Coffee, Sun, Wind, TreePine,
  Gem, Crown, BadgeDollarSign, ChartNoAxesCombined
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
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const extractData = (response, key) => {
  if (!response) return null;
  if (response[key]) return response[key];
  if (response.data && response.data[key]) return response.data[key];
  return response;
};

const ProjectDetailsPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const currentLang = useCurrentLang();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.97]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);

  const t = {
    fr: {
      back: "Retour",
      assetId: "ID Actif",
      overview: "Vue d'ensemble",
      location: "Localisation",
      technical: "Spécifications techniques",
      whyInvest: "Pourquoi investir ?",
      expectedReturn: "Rendement attendu",
      annualReturn: "Rendement annuel",
      riskLevel: "Niveau de risque",
      moderate: "Modéré",
      secured: "Sécurisé",
      certified: "Certifié",
      requestInfo: "Demander les informations",
      contactAdvisor: "Contacter un conseiller",
      downloadBrochure: "Télécharger la brochure",
      contactNow: "Contacter maintenant",
      features: "Caractéristiques",
      benefits: "Avantages exclusifs",
      investment: "Investissement",
      cycle: "Cycle",
      capacity: "Capacité",
      status: "Statut",
      available: "Disponible",
      premium: "Premium",
      share: "Partager",
      like: "J'aime",
      yourName: "Votre nom",
      yourEmail: "Votre email",
      yourPhone: "Votre téléphone",
      yourMessage: "Votre message",
      sendRequest: "Envoyer la demande",
      weWillContact: "Un conseiller vous recontactera sous 24h"
    },
    en: {
      back: "Back",
      assetId: "Asset ID",
      overview: "Overview",
      location: "Location",
      technical: "Technical specifications",
      whyInvest: "Why invest?",
      expectedReturn: "Expected return",
      annualReturn: "Annual return",
      riskLevel: "Risk level",
      moderate: "Moderate",
      secured: "Secured",
      certified: "Certified",
      requestInfo: "Request information",
      contactAdvisor: "Contact advisor",
      downloadBrochure: "Download brochure",
      contactNow: "Contact now",
      features: "Features",
      benefits: "Exclusive benefits",
      investment: "Investment",
      cycle: "Cycle",
      capacity: "Capacity",
      status: "Status",
      available: "Available",
      premium: "Premium",
      share: "Share",
      like: "Like",
      yourName: "Your name",
      yourEmail: "Your email",
      yourPhone: "Your phone",
      yourMessage: "Your message",
      sendRequest: "Send request",
      weWillContact: "An advisor will contact you within 24h"
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
        
        const livestockRes = await api.getLivestockById(id, { lang: currentLang });
        const livestock = extractData(livestockRes, 'livestock');
        
        if (!livestock || !livestock._id) throw new Error('No livestock data found');
        
        const mainImage = livestock.images?.[0] 
          ? getImageUrl(livestock.images[0]) 
          : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
        
        const featuresArray = Array.isArray(livestock.features) 
          ? livestock.features 
          : ['Géré durablement', 'Bio-Certifié', 'Prêt à l\'export'];
        
        setProject({
          id: livestock._id,
          title: livestock.title,
          description: livestock.description,
          price: livestock.price?.amount || 0,
          roi: livestock.roi || 0,
          location: livestock.location?.city || livestock.location || 'Cameroun',
          region: livestock.location?.region || '',
          cycleDuration: livestock.cycleDuration || '12 months',
          capacity: livestock.capacity?.value || 0,
          capacityUnit: livestock.capacity?.unit || 'unités',
          image: mainImage,
          status: livestock.status || 'Available',
          features: featuresArray
        });
        
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    window.scrollTo(0, 0);
    fetchData();
  }, [id, currentLang]);

  const formatCycleDuration = (duration) => {
    if (!duration) return '12 mois';
    const months = parseInt(duration);
    return isNaN(months) ? duration : `${months} mois`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <div className="relative">
            <div className="w-20 h-20 border-2 border-amber-500/30 rounded-full animate-spin border-t-amber-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gem size={24} className="text-amber-500 animate-pulse" />
            </div>
          </div>
          <p className="text-white/50 mt-6 text-sm tracking-wider">CHARGEMENT</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle size={40} className="text-red-400" />
            </div>
            <p className="text-white/60 text-lg">{error || 'Projet non trouvé'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-3 bg-amber-500 text-black rounded-full font-medium hover:bg-amber-400 transition-all"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero Section - Luxe */}
      <section ref={heroRef} className="relative h-[85vh] overflow-hidden">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="w-full h-full"
        >
          <img 
            src={project.image} 
            className="w-full h-full object-cover"
            alt={project.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30" />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-all mb-8 text-sm tracking-wide"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {t.back}
              </button>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  <Star size={10} /> {t.certified}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/60 text-[10px] font-bold uppercase tracking-wider">
                  {t.assetId}: #{project.id?.slice(-8)}
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tighter text-white leading-[1.1] max-w-4xl">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 mt-6 text-white/50">
                <MapPin size={16} className="text-amber-500" />
                <span className="text-sm tracking-wide">{project.location}{project.region ? `, ${project.region}` : ''}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-12 bg-white/30" />
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Description */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-amber-500/50" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-500">{t.overview}</h2>
              </div>
              <p className="text-white/70 text-lg leading-relaxed font-light">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {project.features.map((tag, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wide hover:border-amber-500/30 hover:text-amber-400 transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Features Grid - Luxe */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-amber-500/50" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-500">{t.benefits}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <ShieldCheck size={20} />, title: "Bio-Sécurité avancée", desc: "Protocoles stricts et monitoring 24/7" },
                  { icon: <MapPin size={20} />, title: "Zone stratégique", desc: `Situé à ${project.location}, Cameroun` },
                  { icon: <Leaf size={20} />, title: "Agriculture durable", desc: "Pratiques éco-responsables certifiées" },
                  { icon: <Truck size={20} />, title: "Logistique intégrée", desc: "Distribution nationale et export" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-white font-medium mb-2">{item.title}</h3>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Technical Specs */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-amber-500/50" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-500">{t.technical}</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                {[
                  { label: t.cycle, value: formatCycleDuration(project.cycleDuration), icon: <Clock size={16} /> },
                  { label: t.capacity, value: `${project.capacity} ${project.capacityUnit}`, icon: <Activity size={16} /> },
                  { label: t.status, value: t.available, icon: <CheckCircle size={16} /> },
                  { label: t.investment, value: `${(project.price / 1000000).toFixed(1)}M FCFA`, icon: <BadgeDollarSign size={16} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-5 px-6 border-b border-white/10 last:border-0">
                    <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-wider">
                      {item.icon} {item.label}
                    </div>
                    <div className="text-white font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ROI Section */}
            <section className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-3xl p-8 border border-amber-500/20">
              <div className="flex items-center gap-4 flex-wrap justify-between">
                <div>
                  <p className="text-amber-500 text-[10px] font-bold uppercase tracking-wider mb-2">{t.expectedReturn}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-light text-white">+{project.roi}%</span>
                    <span className="text-white/40 text-sm">{t.annualReturn}</span>
                  </div>
                </div>
                <div className="w-px h-12 bg-white/10 hidden sm:block" />
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">{t.riskLevel}</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span className="text-white font-medium">{t.moderate}</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-amber-500 text-black rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all">
                  {t.requestInfo}
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Investment Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-8 border-b border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Gem size={16} className="text-amber-500" />
                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider">{t.investment}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-light text-white">
                      {project.price >= 10000000 
                        ? `${(project.price / 1000000).toFixed(0)}M` 
                        : `${(project.price / 1000000).toFixed(1)}M`}
                    </span>
                    <span className="text-white/40">FCFA</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">
                        <TrendingUp size={12} /> ROI
                      </div>
                      <div className="text-2xl font-light text-white">+{project.roi}%</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">
                        <Calendar size={12} /> {t.cycle}
                      </div>
                      <div className="text-2xl font-light text-white">{formatCycleDuration(project.cycleDuration)}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-bold text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} /> {t.contactAdvisor}
                    </button>
                    
                    <button className="w-full py-4 bg-white/5 border border-white/10 text-white/80 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      <Download size={18} /> {t.downloadBrochure}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex items-center gap-2 text-white/40 hover:text-rose-500 transition-all"
                    >
                      <Heart size={18} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                      <span className="text-xs">{t.like}</span>
                    </button>
                    <button 
                      onClick={() => setShowSharePopup(!showSharePopup)}
                      className="flex items-center gap-2 text-white/40 hover:text-amber-500 transition-all"
                    >
                      <Share2 size={18} />
                      <span className="text-xs">{t.share}</span>
                    </button>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-6 bg-white/5 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <Lock size={14} className="text-white/30 mt-0.5" />
                    <p className="text-[9px] text-white/30 leading-relaxed">
                      {t.weWillContact}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal - Luxe */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <Gem size={20} className="text-amber-500" />
                    <h3 className="text-xl font-light text-white">{t.contactAdvisor}</h3>
                  </div>
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={18} className="text-white/60" />
                  </button>
                </div>
                
                <div className="mb-8 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <p className="text-sm text-amber-400 font-medium">{project.title}</p>
                  <p className="text-xs text-white/40 mt-1">{t.requestInfo}</p>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">{t.yourName}</label>
                    <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">{t.yourEmail}</label>
                    <input type="email" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">{t.yourPhone}</label>
                    <input type="tel" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">{t.yourMessage}</label>
                    <textarea rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white resize-none" />
                  </div>
                  <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-bold text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2">
                    <Send size={16} /> {t.sendRequest}
                  </button>
                </form>
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