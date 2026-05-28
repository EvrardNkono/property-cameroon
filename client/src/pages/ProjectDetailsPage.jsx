import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, ShieldCheck, 
  TrendingUp, Activity, Download, MessageCircle,
  Clock, Award, ChevronRight, FileText, Info, Loader2, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
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

// URLs en dur selon l'environnement
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           // URL locale
  : 'https://property-cameroon-backend.vercel.app';  // URL de production

const ProjectDetailsPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const currentLang = useCurrentLang();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState(null);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Navigation
      backToCategory: "Retour à la catégorie",
      assetId: "ID d'actif",
      
      // Hero
      projectOverview: "Aperçu du projet",
      
      // Core Advantages
      bioSecurity: "Bio-Sécurité",
      bioSecurityDesc: "Confinement et surveillance sanitaire de pointe avec surveillance vétérinaire 24h/24 et 7j/7.",
      strategicZone: "Zone Stratégique",
      strategicZoneDesc: "Situé à {location}, Cameroun avec un climat idéal et un accès à la distribution.",
      
      // Technical Matrix
      technicalMatrix: "Matrice Technique",
      estCycle: "Cycle estimé",
      capacity: "Capacité",
      grade: "Qualité",
      status: "Statut",
      premiumGrade: "Premium A+",
      available: "Disponible",
      
      // Investment Widget
      investmentCapitalRequired: "Capital d'investissement requis",
      netReturns: "Rendements nets",
      cycleTime: "Durée du cycle",
      connectWithAdvisor: "Contacter un conseiller",
      downloadProspectus: "Télécharger la brochure",
      riskDisclaimer: "Prix hors TVA. Tous les investissements agricoles comportent des risques. Veuillez consulter notre ",
      riskAgreement: "accord de divulgation des risques",
      beforeProceeding: " avant de procéder.",
      signatureVerifiedAsset: "Actif à signature vérifiée",
      
      // Errors
      loadingError: "Erreur de chargement",
      projectNotFound: "Projet non trouvé",
      backToSectors: "Retour aux secteurs",
      loadingProject: "Chargement des détails du projet...",
      
      // Placeholders
      unknown: "Inconnu",
      months: "mois",
      
      // Features fallback
      sustainablyManaged: "Géré durablement",
      bioCertified: "Bio-Certifié",
      exportReady: "Prêt à l'export"
    },
    en: {
      // Navigation
      backToCategory: "Back to Category",
      assetId: "Asset ID",
      
      // Hero
      projectOverview: "Project Overview",
      
      // Core Advantages
      bioSecurity: "Bio-Security",
      bioSecurityDesc: "State-of-the-art containment and health monitoring with 24/7 veterinary surveillance.",
      strategicZone: "Strategic Zone",
      strategicZoneDesc: "Located in {location}, Cameroon with ideal climate and distribution access.",
      
      // Technical Matrix
      technicalMatrix: "Technical Matrix",
      estCycle: "Est. Cycle",
      capacity: "Capacity",
      grade: "Grade",
      status: "Status",
      premiumGrade: "Premium A+",
      available: "Available",
      
      // Investment Widget
      investmentCapitalRequired: "Investment Capital Required",
      netReturns: "Net Returns",
      cycleTime: "Cycle Time",
      connectWithAdvisor: "Connect with Advisor",
      downloadProspectus: "Download Prospectus",
      riskDisclaimer: "Pricing excludes VAT. All agricultural investments involve risks. Please consult our ",
      riskAgreement: "risk disclosure agreement",
      beforeProceeding: " before proceeding.",
      signatureVerifiedAsset: "Signature Verified Asset",
      
      // Errors
      loadingError: "Loading Error",
      projectNotFound: "Project not found",
      backToSectors: "Back to sectors",
      loadingProject: "Loading project details...",
      
      // Placeholders
      unknown: "Unknown",
      months: "months",
      
      // Features fallback
      sustainablyManaged: "Sustainably Managed",
      bioCertified: "Bio-Certified",
      exportReady: "Export Ready"
    }
  }[currentLang] || {
    // Fallback français
    backToCategory: "Retour à la catégorie",
    assetId: "ID d'actif",
    projectOverview: "Aperçu du projet",
    bioSecurity: "Bio-Sécurité",
    bioSecurityDesc: "Confinement et surveillance sanitaire de pointe.",
    strategicZone: "Zone Stratégique",
    strategicZoneDesc: "Situé à {location}, Cameroun.",
    technicalMatrix: "Matrice Technique",
    estCycle: "Cycle estimé",
    capacity: "Capacité",
    grade: "Qualité",
    status: "Statut",
    premiumGrade: "Premium A+",
    available: "Disponible",
    investmentCapitalRequired: "Capital d'investissement requis",
    netReturns: "Rendements nets",
    cycleTime: "Durée du cycle",
    connectWithAdvisor: "Contacter un conseiller",
    downloadProspectus: "Télécharger la brochure",
    riskDisclaimer: "Prix hors TVA. Tous les investissements agricoles comportent des risques.",
    riskAgreement: "accord de divulgation des risques",
    beforeProceeding: " avant de procéder.",
    signatureVerifiedAsset: "Actif à signature vérifiée",
    loadingError: "Erreur de chargement",
    projectNotFound: "Projet non trouvé",
    backToSectors: "Retour aux secteurs",
    loadingProject: "Chargement...",
    unknown: "Inconnu",
    months: "mois",
    sustainablyManaged: "Géré durablement",
    bioCertified: "Bio-Certifié",
    exportReady: "Prêt à l'export"
  };

  // 🔥 Fonction getImageUrl mise à jour avec BACKEND_URL dynamique
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
        
        // 🔥 Console.log pour debug (optionnel)
        console.log(`🌍 ProjectDetailsPage - Environnement: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
        console.log(`🔗 ProjectDetailsPage - Backend URL: ${BACKEND_URL}`);
        console.log(`🌐 Current language: ${currentLang}`);
        
        // Get livestock details with language parameter
        const livestockRes = await api.getLivestockById(id, { lang: currentLang });
        const livestock = livestockRes.livestock;
        
        // Get category info for styling
        const catRes = await api.getLivestockCategoryBySlug(category, { lang: currentLang });
        const cat = catRes.category;
        
        // Format images
        const mainImage = livestock.images && livestock.images[0] 
          ? getImageUrl(livestock.images[0]) 
          : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
        
        // ✅ Ensure features is always an array
        let featuresArray = [];
        if (Array.isArray(livestock.features)) {
          featuresArray = livestock.features;
        } else if (typeof livestock.features === 'string') {
          featuresArray = livestock.features.split(',').map(f => f.trim());
        } else {
          featuresArray = [t.sustainablyManaged, t.bioCertified, t.exportReady];
        }
        
        setProject({
          id: livestock._id,
          title: livestock.title,
          description: livestock.description,
          shortDescription: livestock.shortDescription || livestock.description,
          price: livestock.price?.amount || 0,
          roi: livestock.roi || 0,
          location: livestock.location?.city || livestock.location || 'Cameroon',
          cycleDuration: livestock.cycleDuration || '12 months',
          capacity: livestock.capacity?.value || 0,
          capacityUnit: livestock.capacity?.unit || 'units',
          images: livestock.images || [],
          image: mainImage,
          category: livestock.category,
          status: livestock.status || 'Available',
          features: featuresArray
        });
        
        setCategoryData({
          title: cat.title,
          slug: cat.slug,
          iconName: cat.iconName,
          color: cat.color
        });
        
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message || t.loadingError);
      } finally {
        setLoading(false);
      }
    };
    
    window.scrollTo(0, 0);
    fetchData();
  }, [id, category, currentLang]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">{t.loadingProject}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] px-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-md">
            <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="font-bold">{t.loadingError}</p>
            <p className="text-sm mt-1">{error || t.projectNotFound}</p>
            <Link to="/agriculture/livestock" className="mt-4 inline-block text-emerald-600 underline text-sm">
              {t.backToSectors}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format cycle duration with translation
  const formattedCycleDuration = project.cycleDuration?.includes('month') 
    ? project.cycleDuration.replace('months', t.months).replace('month', t.months.slice(0, -1))
    : project.cycleDuration;

  // Technical specs data with translations
  const technicalSpecs = [
    { label: t.estCycle, value: formattedCycleDuration, icon: <Clock size={16}/> },
    { label: t.capacity, value: `${project.capacity} ${project.capacityUnit}`, icon: <Activity size={16}/> },
    { label: t.grade, value: t.premiumGrade, icon: <Award size={16}/> },
    { label: t.status, value: project.status === 'Available' ? t.available : project.status, icon: <FileText size={16}/> },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-gray-900">
      <Navbar />

      {/* Hero Section */}
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
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
            }}
          />
        </motion.div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FCFBF7]" />
        
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button 
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-full mb-10 hover:bg-gray-900 hover:text-white transition-all shadow-2xl"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                {t.backToCategory}
              </button>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-amber-400 text-gray-900 text-[10px] font-bold uppercase tracking-wide mb-4">
                {t.assetId}: #{project.id?.slice(-8) || t.unknown}
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
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-20">
            
            {/* Project Overview */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-amber-500/30" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600">
                  {t.projectOverview}
                </h2>
              </div>
              <p className="text-3xl md:text-4xl font-light text-gray-900 leading-[1.4] mb-10">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-4">
                {Array.isArray(project.features) && project.features.length > 0 ? (
                  project.features.map((tag, i) => (
                    <span key={i} className="px-5 py-2 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      {tag}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-5 py-2 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      {t.sustainablyManaged}
                    </span>
                    <span className="px-5 py-2 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      {t.bioCertified}
                    </span>
                    <span className="px-5 py-2 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      {t.exportReady}
                    </span>
                  </>
                )}
              </div>
            </motion.section>

            {/* Core Advantages */}
            <section className="grid md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="font-serif text-2xl mb-4">{t.bioSecurity}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {t.bioSecurityDesc}
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                  <MapPin size={28} />
                </div>
                <h3 className="font-serif text-2xl mb-4">{t.strategicZone}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {t.strategicZoneDesc.replace('{location}', project.location)}
                </p>
              </motion.div>
            </section>

            {/* Technical Specs */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-3xl font-serif mb-12">{t.technicalMatrix}</h2>
                
                <div className="grid sm:grid-cols-2 gap-x-16 gap-y-2">
                  {technicalSpecs.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-6 border-b border-white/10 group">
                      <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-amber-400 transition-colors">
                        {item.icon} {item.label}
                      </div>
                      <div className="font-bold text-lg">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </motion.section>
          </div>

          {/* Right Column - Investment Widget */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2725B]/5 rounded-bl-[100px]" />

                <div className="mb-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">{t.investmentCapitalRequired}</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold tracking-tighter">
                      {(project.price / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-xl font-serif italic text-gray-400">FCFA</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-gray-100">
                    <span className="text-[9px] font-black uppercase tracking-wide text-gray-400 block mb-2">{t.netReturns}</span>
                    <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                      <TrendingUp size={20} /> +{project.roi}%
                    </div>
                  </div>
                  <div className="bg-amber-50/50 p-6 rounded-3xl border border-gray-100">
                    <span className="text-[9px] font-black uppercase tracking-wide text-gray-400 block mb-2">{t.cycleTime}</span>
                    <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                      <Calendar size={20} /> {formattedCycleDuration}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-gray-900 text-amber-300 py-7 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-900/20">
                    <MessageCircle size={20} /> {t.connectWithAdvisor}
                  </button>
                  
                  <button className="w-full bg-[#FCFBF7] text-gray-900 py-7 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border border-gray-200 flex items-center justify-center gap-3 hover:bg-white hover:border-gray-900 transition-all">
                    <Download size={20} /> {t.downloadProspectus}
                  </button>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Info size={16} />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold">
                    {t.riskDisclaimer}<span className="text-gray-900 underline cursor-pointer">{t.riskAgreement}</span>{t.beforeProceeding}
                  </p>
                </div>
              </motion.div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.signatureVerifiedAsset}</span>
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