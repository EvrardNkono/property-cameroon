import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, ShieldCheck, 
  TrendingUp, Activity, Download, MessageCircle,
  Clock, Award, ChevronRight, FileText, Info, Loader2, AlertCircle,
  Phone, Mail, Building2, Sparkles, Star, ChevronLeft, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// Hook pour récupérer la langue actuelle
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

// 🔥 Détection automatique de l'environnement
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// Fonction pour extraire les données
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

  // ========== TRADUCTIONS UI ==========
  const t = {
    fr: {
      backToCategory: "Retour à la catégorie",
      assetId: "ID d'actif",
      projectOverview: "Aperçu du projet",
      bioSecurity: "Bio-Sécurité",
      bioSecurityDesc: "Confinement et surveillance sanitaire de pointe avec monitoring vétérinaire 24h/24 et 7j/7.",
      strategicZone: "Zone Stratégique",
      strategicZoneDesc: "Situé à {location}, Cameroun avec un climat idéal et un accès privilégié aux réseaux de distribution.",
      technicalMatrix: "Matrice Technique",
      estCycle: "Cycle estimé",
      capacity: "Capacité",
      grade: "Qualité",
      status: "Statut",
      premiumGrade: "Premium A+",
      available: "Disponible",
      requestPrice: "Demander le prix",
      contactAdvisor: "Contacter un conseiller",
      downloadProspectus: "Télécharger la brochure",
      whyInvest: "Pourquoi investir ?",
      expectedReturns: "Rendements attendus",
      riskLevel: "Niveau de risque",
      moderate: "Modéré",
      guaranteedReturns: "Rendements garantis par contrat",
      certifiedAsset: "Actif certifié CAPEF",
      loadingError: "Erreur de chargement",
      projectNotFound: "Projet non trouvé",
      backToSectors: "Retour aux secteurs",
      loadingProject: "Chargement des détails du projet...",
      unknown: "Inconnu",
      months: "mois",
      sustainablyManaged: "Géré durablement",
      bioCertified: "Bio-Certifié",
      exportReady: "Prêt à l'export",
      getInTouch: "Entrer en contact",
      name: "Nom complet",
      email: "Email",
      phone: "Téléphone",
      message: "Message",
      sendRequest: "Envoyer la demande",
      weWillContact: "Un conseiller vous contactera sous 24h",
      close: "Fermer",
      investmentOpportunity: "Opportunité d'investissement",
      requestInfo: "Demander les informations",
      roiProjection: "Projection de rendement",
      perYear: "par an",
      netReturns: "Rendements nets",
      cycleTime: "Durée du cycle"
    },
    en: {
      backToCategory: "Back to Category",
      assetId: "Asset ID",
      projectOverview: "Project Overview",
      bioSecurity: "Bio-Security",
      bioSecurityDesc: "State-of-the-art containment and health monitoring with 24/7 veterinary surveillance.",
      strategicZone: "Strategic Zone",
      strategicZoneDesc: "Located in {location}, Cameroon with ideal climate and premium distribution access.",
      technicalMatrix: "Technical Matrix",
      estCycle: "Est. Cycle",
      capacity: "Capacity",
      grade: "Grade",
      status: "Status",
      premiumGrade: "Premium A+",
      available: "Available",
      requestPrice: "Request Price",
      contactAdvisor: "Contact Advisor",
      downloadProspectus: "Download Prospectus",
      whyInvest: "Why invest?",
      expectedReturns: "Expected Returns",
      riskLevel: "Risk Level",
      moderate: "Moderate",
      guaranteedReturns: "Contractually guaranteed returns",
      certifiedAsset: "CAPEF Certified Asset",
      loadingError: "Loading Error",
      projectNotFound: "Project not found",
      backToSectors: "Back to sectors",
      loadingProject: "Loading project details...",
      unknown: "Unknown",
      months: "months",
      sustainablyManaged: "Sustainably Managed",
      bioCertified: "Bio-Certified",
      exportReady: "Export Ready",
      getInTouch: "Get in Touch",
      name: "Full name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      sendRequest: "Send request",
      weWillContact: "An advisor will contact you within 24h",
      close: "Close",
      investmentOpportunity: "Investment Opportunity",
      requestInfo: "Request information",
      roiProjection: "Return projection",
      perYear: "per year",
      netReturns: "Net Returns",
      cycleTime: "Cycle Time"
    }
  }[currentLang] || {
    backToCategory: "Back to Category",
    assetId: "Asset ID",
    projectOverview: "Project Overview",
    bioSecurity: "Bio-Security",
    bioSecurityDesc: "State-of-the-art containment and health monitoring.",
    strategicZone: "Strategic Zone",
    strategicZoneDesc: "Located in {location}, Cameroon.",
    technicalMatrix: "Technical Matrix",
    estCycle: "Est. Cycle",
    capacity: "Capacity",
    grade: "Grade",
    status: "Status",
    premiumGrade: "Premium A+",
    available: "Available",
    requestPrice: "Request Price",
    contactAdvisor: "Contact Advisor",
    downloadProspectus: "Download Prospectus",
    whyInvest: "Why invest?",
    expectedReturns: "Expected Returns",
    riskLevel: "Risk Level",
    moderate: "Moderate",
    guaranteedReturns: "Guaranteed returns",
    certifiedAsset: "Certified Asset",
    loadingError: "Loading Error",
    projectNotFound: "Project not found",
    backToSectors: "Back to sectors",
    loadingProject: "Loading...",
    unknown: "Unknown",
    months: "months",
    sustainablyManaged: "Sustainably Managed",
    bioCertified: "Bio-Certified",
    exportReady: "Export Ready",
    getInTouch: "Get in Touch",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    sendRequest: "Send request",
    weWillContact: "An advisor will contact you within 24h",
    close: "Close",
    investmentOpportunity: "Investment Opportunity",
    requestInfo: "Request information",
    roiProjection: "Return projection",
    perYear: "per year",
    netReturns: "Net Returns",
    cycleTime: "Cycle Time"
  };

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
      
      console.log(`🌐 ProjectDetailsPage - Langue demandée: ${currentLang}`);
      console.log(`🔍 Fetching livestock with id: ${id}, lang: ${currentLang}`);
      
      const livestockRes = await api.getLivestockById(id, { lang: currentLang });
      console.log('📦 API Response:', livestockRes);
      
      // Extraction correcte des données
      let livestock = null;
      if (livestockRes.livestock) {
        livestock = livestockRes.livestock;
      } else if (livestockRes.data) {
        livestock = livestockRes.data;
      } else {
        livestock = livestockRes;
      }
      
      console.log('📝 Livestock extrait:', livestock);
      console.log('📝 Titre reçu:', livestock?.title);
      console.log('📝 Description reçue:', livestock?.description?.substring(0, 100));
      
      if (!livestock || !livestock._id) {
        throw new Error('No livestock data found');
      }
      
      const mainImage = livestock.images && livestock.images[0] 
        ? getImageUrl(livestock.images[0]) 
        : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
      
      let featuresArray = [];
      if (Array.isArray(livestock.features)) {
        featuresArray = livestock.features;
      } else if (typeof livestock.features === 'string') {
        featuresArray = livestock.features.split(',').map(f => f.trim());
      } else {
        featuresArray = [t.sustainablyManaged, t.bioCertified, t.exportReady];
      }
      
      // Mettre à jour le state avec les nouvelles données
      setProject({
        id: livestock._id,
        title: livestock.title,
        description: livestock.description,
        price: livestock.price?.amount || 0,
        roi: livestock.roi || 0,
        location: livestock.location?.city || livestock.location || 'Cameroon',
        region: livestock.location?.region || '',
        cycleDuration: livestock.cycleDuration || '12 months',
        capacity: livestock.capacity?.value || 0,
        capacityUnit: livestock.capacity?.unit || 'units',
        image: mainImage,
        status: livestock.status || 'Available',
        features: featuresArray
      });
      
    } catch (err) {
      console.error('❌ Error fetching project:', err);
      setError(err.message || t.loadingError);
    } finally {
      setLoading(false);
    }
  };
  
  window.scrollTo(0, 0);
  fetchData();
}, [id, category, currentLang]); // ✅ currentLang est déjà dans les dépendances

  const formattedCycleDuration = project?.cycleDuration?.includes('month') 
    ? project.cycleDuration.replace('months', t.months).replace('month', t.months.slice(0, -1))
    : project?.cycleDuration;

  const technicalSpecs = [
    { label: t.estCycle, value: formattedCycleDuration, icon: <Clock size={18}/> },
    { label: t.capacity, value: `${project?.capacity || 0} ${project?.capacityUnit || ''}`, icon: <Activity size={18}/> },
    { label: t.grade, value: t.premiumGrade, icon: <Award size={18}/> },
    { label: t.status, value: project?.status === 'Available' ? t.available : project?.status, icon: <FileText size={18}/> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600" />
            <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 animate-pulse" />
          </div>
          <p className="text-gray-500 mt-6 text-sm animate-pulse">{t.loadingProject}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] px-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 text-red-600 p-8 rounded-3xl text-center max-w-md shadow-xl">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="font-bold text-xl mb-2">{t.loadingError}</p>
            <p className="text-sm">{error || t.projectNotFound}</p>
            <Link to="/agriculture/livestock" className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-800 transition-colors">
              <ArrowLeft size={16} /> {t.backToSectors}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCFBF7] to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <img 
            src={project.image} 
            className="w-full h-full object-cover"
            alt={project.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
            }}
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBF7] via-black/30 to-black/50" />
        
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-12 pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button 
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 bg-white/95 backdrop-blur-xl px-5 py-3 sm:px-6 sm:py-4 rounded-full mb-6 sm:mb-10 hover:bg-gray-900 hover:text-white transition-all shadow-xl"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="hidden sm:inline">{t.backToCategory}</span>
                <span className="sm:hidden">Retour</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-gray-900 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">
                  <Star size={12} /> {t.certifiedAsset}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">
                  {t.assetId}: #{project.id?.slice(-8) || t.unknown}
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif leading-[1.1] tracking-tighter">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 mt-4 text-gray-600">
                <MapPin size={16} className="text-amber-500" />
                <span className="text-sm sm:text-base">{project.location}{project.region ? `, ${project.region}` : ''}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-12 md:space-y-20">
            
            {/* Project Overview */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="h-px w-8 md:w-12 bg-amber-500/40" />
                <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-amber-600">
                  {t.projectOverview}
                </h2>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 leading-[1.4] mb-8 md:mb-10">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {project.features?.map((tag, i) => (
                  <span key={i} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gray-100 text-gray-600 text-[9px] md:text-[10px] font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Core Advantages */}
            <section className="grid sm:grid-cols-2 gap-5 md:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 mb-4 md:mb-6">
                  <ShieldCheck size={24} className="md:w-7 md:h-7" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl mb-2 md:mb-4">{t.bioSecurity}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  {t.bioSecurityDesc}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-600 mb-4 md:mb-6">
                  <MapPin size={24} className="md:w-7 md:h-7" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl mb-2 md:mb-4">{t.strategicZone}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  {t.strategicZoneDesc.replace('{location}', project.location)}
                </p>
              </motion.div>
            </section>

            {/* Technical Specs */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl lg:rounded-[3rem] p-6 md:p-10 lg:p-16 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-serif mb-8 md:mb-12">{t.technicalMatrix}</h2>
                
                <div className="grid sm:grid-cols-2 gap-4 md:gap-x-12 gap-y-2">
                  {technicalSpecs.map((item, i) => (
                    <div key={i} className="flex flex-wrap sm:flex-nowrap items-center justify-between py-4 md:py-5 border-b border-white/10 group">
                      <div className="flex items-center gap-2 md:gap-3 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] group-hover:text-amber-400 transition-colors">
                        {item.icon} 
                        <span className="hidden xs:inline">{item.label}</span>
                      </div>
                      <div className="font-bold text-base md:text-lg">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-amber-500/10 blur-[100px] rounded-full" />
            </motion.section>

            {/* Why Invest Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl md:rounded-3xl p-6 md:p-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={20} className="text-emerald-600" />
                <h3 className="font-serif text-xl md:text-2xl text-emerald-900">{t.whyInvest}</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <span className="text-2xl md:text-3xl font-bold text-emerald-600">+{project.roi}%</span>
                  <p className="text-[10px] md:text-xs text-gray-600 mt-1">{t.expectedReturns}</p>
                  <p className="text-[8px] text-gray-400">{t.perYear}</p>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <ShieldCheck size={24} className="text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs md:text-sm font-medium text-gray-800">{t.guaranteedReturns}</p>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <span className="text-xs font-bold text-amber-600 uppercase">{t.moderate}</span>
                  <p className="text-[10px] text-gray-500 mt-1">{t.riskLevel}</p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Investment Widget */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 md:top-32">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl md:rounded-3xl lg:rounded-[3rem] p-6 md:p-8 lg:p-10 border border-gray-100 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-amber-500/5 rounded-bl-full" />
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full mb-6">
                  <Sparkles size={12} className="text-amber-600" />
                  <span className="text-[9px] font-bold uppercase text-amber-700">{t.investmentOpportunity}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 md:p-5 rounded-xl md:rounded-2xl">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wide text-gray-500 block mb-1">{t.netReturns}</span>
                    <div className="text-xl md:text-2xl font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp size={16} className="md:w-5 md:h-5" /> +{project.roi}%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 md:p-5 rounded-xl md:rounded-2xl">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wide text-gray-500 block mb-1">{t.cycleTime}</span>
                    <div className="text-xl md:text-2xl font-bold text-amber-600 flex items-center gap-1">
                      <Calendar size={16} className="md:w-5 md:h-5" /> {formattedCycleDuration}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase tracking-[0.1em] text-xs md:text-sm flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                  >
                    <MessageCircle size={16} className="md:w-5 md:h-5" /> {t.contactAdvisor}
                  </button>
                  
                  <button className="w-full bg-gray-100 text-gray-800 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase tracking-[0.1em] text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                    <Download size={16} className="md:w-5 md:h-5" /> {t.downloadProspectus}
                  </button>
                </div>

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 flex items-start gap-2 md:gap-3">
                  <Info size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[8px] md:text-[9px] text-gray-400 leading-relaxed">
                    {t.requestInfo}. {t.weWillContact}
                  </p>
                </div>
              </motion.div>

              <div className="mt-6 md:mt-8 flex items-center justify-center gap-3 text-gray-400">
                <ShieldCheck size={16} className="md:w-5 md:h-5" />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{t.certifiedAsset}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl md:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-serif">{t.getInTouch}</h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-800 font-medium">{project.title}</p>
                <p className="text-xs text-amber-600 mt-1">{t.requestInfo}</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.name}</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.email}</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.phone}</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.message}</label>
                  <textarea rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder={t.message} />
                </div>
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  {t.sendRequest}
                </button>
              </form>
              
              <p className="text-center text-[10px] text-gray-400 mt-4">{t.weWillContact}</p>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;