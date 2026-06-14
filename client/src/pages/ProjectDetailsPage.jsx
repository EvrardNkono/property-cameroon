import React, { useState, useEffect } from 'react';
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

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  const t = {
    fr: {
      back: "Retour",
      assetId: "ID Actif",
      overview: "Aperçu",
      location: "Localisation",
      technical: "Caractéristiques techniques",
      whyInvest: "Pourquoi investir ?",
      expectedReturn: "Rendement attendu",
      annualReturn: "par an",
      riskLevel: "Niveau de risque",
      moderate: "Modéré",
      secured: "Sécurisé",
      certified: "Certifié CAPEF",
      requestInfo: "Demander les informations",
      contactAdvisor: "Contacter un conseiller",
      downloadBrochure: "Télécharger la brochure",
      contactNow: "Contacter maintenant",
      features: "Atouts",
      benefits: "Avantages exclusifs",
      investment: "Investissement",
      cycle: "Cycle",
      capacity: "Capacité",
      status: "Statut",
      available: "Disponible",
      premium: "Premium",
      share: "Partager",
      like: "J'aime",
      yourName: "Nom complet",
      yourEmail: "Email",
      yourPhone: "Téléphone",
      yourMessage: "Message",
      sendRequest: "Envoyer la demande",
      weWillContact: "Un conseiller vous contactera sous 24h",
      bioSecurity: "Bio-Sécurité",
      bioSecurityDesc: "Surveillance sanitaire de pointe avec monitoring vétérinaire 24/7.",
      strategicZone: "Zone stratégique",
      strategicZoneDesc: "Emplacement privilégié avec un accès optimal aux réseaux de distribution.",
      sustainable: "Agriculture durable",
      sustainableDesc: "Pratiques éco-responsables certifiées pour une production respectueuse.",
      logistics: "Logistique intégrée",
      logisticsDesc: "Distribution nationale et potentiel export vers les marchés internationaux.",
      customQuote: "Sur devis personnalisé",
      whatYouCanDo: "Ce que vous pouvez faire",
      investFarm: "Investir dans la ferme",
      purchaseAssets: "Acheter des actifs (matériel, cheptel)",
      farmingContract: "Contractualiser un élevage",
      directPurchase: "Achat direct de poulets",
      talkToExpert: "Parler avec un expert",
      requestCustomQuote: "Demander un devis personnalisé",
      expertWillContact: "Un expert vous recontactera sous 24h pour discuter de vos besoins spécifiques.",
      tailoredInvestment: "Investissement sur mesure",
      tailoredDesc: "Le montant exact dépend de votre projet. Contactez un expert pour un devis personnalisé.",
      consultationExpert: "Consultation Expert"
    },
    en: {
      back: "Back",
      assetId: "Asset ID",
      overview: "Overview",
      location: "Location",
      technical: "Technical specifications",
      whyInvest: "Why invest?",
      expectedReturn: "Expected return",
      annualReturn: "per year",
      riskLevel: "Risk level",
      moderate: "Moderate",
      secured: "Secured",
      certified: "CAPEF Certified",
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
      yourName: "Full name",
      yourEmail: "Email",
      yourPhone: "Phone",
      yourMessage: "Message",
      sendRequest: "Send request",
      weWillContact: "An advisor will contact you within 24h",
      bioSecurity: "Bio-Security",
      bioSecurityDesc: "State-of-the-art health monitoring with 24/7 veterinary surveillance.",
      strategicZone: "Strategic zone",
      strategicZoneDesc: "Prime location with optimal access to distribution networks.",
      sustainable: "Sustainable farming",
      sustainableDesc: "Eco-responsible certified practices for respectful production.",
      logistics: "Integrated logistics",
      logisticsDesc: "National distribution and export potential to international markets.",
      customQuote: "Custom quote",
      whatYouCanDo: "What you can do",
      investFarm: "Invest in the farm",
      purchaseAssets: "Purchase assets (equipment, livestock)",
      farmingContract: "Farming contract",
      directPurchase: "Direct chicken purchase",
      talkToExpert: "Talk to an expert",
      requestCustomQuote: "Request custom quote",
      expertWillContact: "An expert will contact you within 24h to discuss your specific needs.",
      tailoredInvestment: "Tailored investment",
      tailoredDesc: "The exact amount depends on your project. Contact an expert for a custom quote.",
      consultationExpert: "Expert Consultation"
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
        const livestockRes = await api.getLivestockById(id, { lang: currentLang });
        const livestock = extractData(livestockRes, 'livestock');
        
        if (!livestock || !livestock._id) throw new Error('No data');
        
        const mainImage = livestock.images?.[0] 
          ? getImageUrl(livestock.images[0]) 
          : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
        
        setProject({
          id: livestock._id,
          title: livestock.title,
          description: livestock.description,
          price: livestock.price?.amount || 0,
          roi: livestock.roi || 0,
          location: livestock.location?.city || 'Cameroun',
          region: livestock.location?.region || '',
          cycleDuration: livestock.cycleDuration || '12 months',
          capacity: livestock.capacity?.value || 0,
          capacityUnit: livestock.capacity?.unit || 'unités',
          image: mainImage,
          status: livestock.status || 'Available'
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchData();
  }, [id, currentLang]);

  const formatCycle = (duration) => {
    if (!duration) return '12 mois';
    const months = parseInt(duration);
    return isNaN(months) ? duration : `${months} ${currentLang === 'fr' ? 'mois' : 'months'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <div className="w-12 h-12 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4 text-sm">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <p className="text-gray-500">{error || 'Projet non trouvé'}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-full text-sm">
            Réessayer
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Élégant et raffiné */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-all text-sm"
            >
              <ArrowLeft size={16} /> {t.back}
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Badges flottants */}
              <div className="absolute -bottom-4 -right-4 flex gap-2">
                <span className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg">
                  {t.certified}
                </span>
                <span className="px-4 py-2 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-full shadow-lg">
                  +{project.roi}% ROI
                </span>
              </div>
            </motion.div>

            {/* Right - Title & Info - SANS PRIX */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-emerald-600 text-sm">
                <span className="w-8 h-px bg-emerald-600" />
                <span>{t.assetId} #{project.id?.slice(-8)}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 leading-tight">
                {project.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} className="text-amber-500" />
                <span>{project.location}{project.region ? `, ${project.region}` : ''}</span>
              </div>

              {/* Section ROI et Cycle - Sans prix */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t.expectedReturn}</p>
                  <p className="text-2xl font-bold text-amber-600">+{project.roi}% <span className="text-sm font-normal text-gray-400">{t.annualReturn}</span></p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t.cycle}</p>
                  <p className="text-xl font-semibold text-gray-800">{formatCycle(project.cycleDuration)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <MessageCircle size={16} /> {t.contactAdvisor}
                </button>
                <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center gap-2">
                  <Download size={16} /> {t.downloadBrochure}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Description */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-amber-500" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t.overview}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                {project.description}
              </p>
              
              {/* Note investissement sur mesure */}
              <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-3">
                <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-sm font-medium">
                    {t.tailoredInvestment}
                  </p>
                  <p className="text-amber-700/70 text-xs">
                    {t.tailoredDesc}
                  </p>
                </div>
              </div>
            </section>

            {/* Avantages - Grille élégante */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-amber-500" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t.benefits}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { icon: <ShieldCheck size={20} />, title: t.bioSecurity, desc: t.bioSecurityDesc, color: "emerald" },
                  { icon: <MapPin size={20} />, title: t.strategicZone, desc: t.strategicZoneDesc, color: "amber" },
                  { icon: <Leaf size={20} />, title: t.sustainable, desc: t.sustainableDesc, color: "emerald" },
                  { icon: <Truck size={20} />, title: t.logistics, desc: t.logisticsDesc, color: "amber" }
                ].map((item, i) => (
                  <div key={i} className="group p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${
                      item.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Specs */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-amber-500" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t.technical}</h2>
              </div>
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                {[
                  { label: t.cycle, value: formatCycle(project.cycleDuration) },
                  { label: t.capacity, value: `${project.capacity} ${project.capacityUnit}` },
                  { label: t.status, value: t.available },
                  { label: "ROI projeté", value: `+${project.roi}% ${t.annualReturn}` }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-4 px-6 border-b border-gray-100 last:border-0">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="text-gray-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Expert Consultation Widget (SANS PRIX) */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-amber-50 to-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown size={18} className="text-amber-500" />
                    <span className="text-amber-600 text-[10px] font-bold uppercase tracking-wider">{t.consultationExpert}</span>
                  </div>
                  <h3 className="text-xl font-serif font-light text-gray-800 mb-2">
                    {t.customQuote}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {currentLang === 'fr' 
                      ? 'Le montant exact dépend de votre objectif d\'investissement.' 
                      : 'The exact amount depends on your investment goal.'}
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  {/* Options disponibles */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {t.whatYouCanDo}
                    </p>
                    <div className="space-y-2">
                      {[
                        t.investFarm,
                        t.purchaseAssets,
                        t.farmingContract,
                        t.directPurchase
                      ].map((option, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                          <CheckCircle size={14} className="text-emerald-500" />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    {/* Lien vers experts - Version React Router comme dans la navbar */}
                    <Link
                      to="/experts"
                      className="w-full py-4 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group"
                    >
                      <MessageCircle size={18} />
                      {t.talkToExpert}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    {/* Bouton devis personnalisé (ouvre modal) */}
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      {t.requestCustomQuote}
                    </button>
                    
                    {/* Brochure */}
                    <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                      <Download size={16} />
                      {t.downloadBrochure}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[8px] text-gray-400 uppercase tracking-wider">{t.secured}</span>
                      <span className="text-[8px] text-gray-300">•</span>
                      <span className="text-[8px] text-gray-400 uppercase tracking-wider">{t.certified}</span>
                    </div>
                    <p className="text-[9px] text-gray-400 text-center leading-relaxed">
                      {t.expertWillContact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif font-light text-gray-900">{t.contactAdvisor}</h3>
                  <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-emerald-800 font-medium">{project.title}</p>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">{t.yourName}</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">{t.yourEmail}</label>
                    <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">{t.yourPhone}</label>
                    <input type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                  <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                    {t.sendRequest}
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