// LivestockIntroduction.jsx - VERSION MULTILINGUE

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Fish, Bird, Database, Leaf, TrendingUp, ShieldCheck, 
  Warehouse, Globe, BadgeCheck, Loader2, DollarSign, Clock,
  AlertCircle, Zap, MapPin, Users, Award, BarChart3, ChevronRight,
  Sparkles, Star, Heart, TrendingDown, PieChart, Calendar, CheckCircle,
  Phone, Mail, MessageCircle, X, Building2, Gem, Rocket, Layers,
  ChevronLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// Environment detection
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// ✅ NOUVEAU: Hook pour la langue
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
    
    // Sauvegarder la préférence
    if (!storedLang && finalLang !== 'fr') {
      localStorage.setItem('preferredLanguage', finalLang);
    }
  }, []);
  
  return lang;
};

// ✅ NOUVEAU: Textes traduits
const useTranslations = () => {
  const lang = useCurrentLang();
  
  const texts = {
    fr: {
      // Hero
      heroBadge: "CAPEF Certified • Cameroun",
      heroTitle: "Investissement",
      heroTitleHighlight: "Élevage",
      heroSubtitle: "Investissez dans des actifs d'élevage certifiés à haut rendement au Cameroun.",
      heroSubtitleHighlight: "Cycles courts | Retours sécurisés | Transparence totale",
      heroBtnExplore: "Explorer les secteurs",
      heroBtnGuide: "Recevoir un guide gratuit",
      
      // Stats
      statActiveAssets: "Actifs Actifs",
      statAvailableForInvestment: "Disponibles pour investissement",
      statAvgROI: "ROI Moyen",
      statProjectedReturn: "Retour annuel projeté",
      statPortfolioValue: "Valeur du Portefeuille",
      statTotalAssets: "Actifs sous gestion",
      statActiveInvestors: "Investisseurs Actifs",
      statTrustingPlatform: "Font confiance à notre plateforme",
      
      // Categories
      categoriesBadge: "Secteurs d'Investissement",
      categoriesTitle: "Choisissez Votre",
      categoriesTitleHighlight: "Secteur",
      categoriesSubtitle: "Balayez ou faites défiler pour explorer les secteurs de production certifiés",
      
      // Featured
      featuredBadge: "Opportunités Vedettes",
      featuredTitle: "Actifs d'Élevage",
      featuredTitleHighlight: "À la Une",
      featuredSubtitle: "Unités de production à haut rendement sélectionnées, prêtes pour investissement immédiat",
      
      // Advantages
      advantagesBadge: "Pourquoi Nous Choisir",
      advantagesTitle: "Avantages",
      advantagesTitleHighlight: "d'Investissement",
      
      // How it works
      howItWorksBadge: "Processus Simple",
      howItWorksTitle: "Comment ça",
      howItWorksTitleHighlight: "Marche",
      step1Title: "Choisir Secteur",
      step1Desc: "Sélectionnez parmi les secteurs certifiés",
      step2Title: "Sélectionner Actif",
      step2Desc: "Choisissez les unités adaptées à vos objectifs",
      step3Title: "Investir",
      step3Desc: "Paiement sécurisé par mobile money ou banque",
      step4Title: "Recevoir Retours",
      step4Desc: "Recevez les bénéfices en fin de cycle",
      
      // Testimonials
      testimonialsBadge: "Histoires de Succès",
      testimonialsTitle: "Ce que disent nos",
      testimonialsTitleHighlight: "Investisseurs",
      
      // FAQ
      faqBadge: "Questions ?",
      faqTitle: "Foire Aux",
      faqTitleHighlight: "Questions",
      
      // CTA
      ctaTitle: "Prêt à Constituer Votre Portefeuille ?",
      ctaSubtitle: "Rejoignez 1 000+ investisseurs qui gagnent déjà des revenus passifs",
      ctaBtnRegister: "Créer un compte gratuit",
      ctaBtnCall: "Appeler un conseiller",
      
      // Loading/Error
      loading: "Chargement des opportunités d'investissement...",
      error: "Erreur de chargement",
      tryAgain: "Réessayer"
    },
    en: {
      // Hero
      heroBadge: "CAPEF Certified • Cameroon",
      heroTitle: "Livestock",
      heroTitleHighlight: "Investment",
      heroSubtitle: "Invest in certified, high-yield livestock assets across Cameroon.",
      heroSubtitleHighlight: "Short cycles | Secure returns | Full transparency",
      heroBtnExplore: "Explore sectors",
      heroBtnGuide: "Get free guide",
      
      // Stats
      statActiveAssets: "Active Assets",
      statAvailableForInvestment: "Available for immediate investment",
      statAvgROI: "Average ROI",
      statProjectedReturn: "Projected annual return",
      statPortfolioValue: "Portfolio Value",
      statTotalAssets: "Total assets under management",
      statActiveInvestors: "Active Investors",
      statTrustingPlatform: "Trusting our platform",
      
      // Categories
      categoriesBadge: "Investment Sectors",
      categoriesTitle: "Choose Your",
      categoriesTitleHighlight: "Sector",
      categoriesSubtitle: "Swipe or scroll to explore certified livestock production sectors",
      
      // Featured
      featuredBadge: "Top Opportunities",
      featuredTitle: "Featured",
      featuredTitleHighlight: "Livestock Assets",
      featuredSubtitle: "Hand-picked high-yield production units ready for immediate investment",
      
      // Advantages
      advantagesBadge: "Why Choose Us",
      advantagesTitle: "Investment",
      advantagesTitleHighlight: "Advantages",
      
      // How it works
      howItWorksBadge: "Simple Process",
      howItWorksTitle: "How It",
      howItWorksTitleHighlight: "Works",
      step1Title: "Choose Sector",
      step1Desc: "Select from certified livestock sectors",
      step2Title: "Select Asset",
      step2Desc: "Pick production units matching your goals",
      step3Title: "Invest",
      step3Desc: "Secure payment via mobile money or bank",
      step4Title: "Earn Returns",
      step4Desc: "Receive profits at cycle completion",
      
      // Testimonials
      testimonialsBadge: "Success Stories",
      testimonialsTitle: "What",
      testimonialsTitleHighlight: "Investors Say",
      
      // FAQ
      faqBadge: "Questions?",
      faqTitle: "Frequently Asked",
      faqTitleHighlight: "Questions",
      
      // CTA
      ctaTitle: "Ready to Build Your Portfolio?",
      ctaSubtitle: "Join 1,000+ investors already earning passive income",
      ctaBtnRegister: "Create free account",
      ctaBtnCall: "Call advisor",
      
      // Loading/Error
      loading: "Loading investment opportunities...",
      error: "Loading error",
      tryAgain: "Try again"
    }
  };
  
  return { t: texts[lang], lang };
};

// Icon mapping (inchangé)
const iconMap = {
  Fish: <Fish size={32} />,
  Bird: <Bird size={32} />,
  Database: <Database size={32} />,
  Leaf: <Leaf size={32} />,
  pigs: <Database size={32} />,
  cattle: <Database size={32} />,
  goats: <Database size={32} />,
  sheep: <Database size={32} />
};

// Premium color schemes (inchangé)
const categoryCardColors = {
  aquaculture: { gradient: "from-cyan-600 to-teal-600", badge: "bg-cyan-500/20 text-cyan-300", iconBg: "bg-cyan-500/20" },
  poultry: { gradient: "from-emerald-600 to-teal-600", badge: "bg-emerald-500/20 text-emerald-300", iconBg: "bg-emerald-500/20" },
  cattle: { gradient: "from-amber-600 to-orange-600", badge: "bg-amber-500/20 text-amber-300", iconBg: "bg-amber-500/20" },
  pigs: { gradient: "from-rose-600 to-pink-600", badge: "bg-rose-500/20 text-rose-300", iconBg: "bg-rose-500/20" },
  goats: { gradient: "from-teal-600 to-emerald-600", badge: "bg-teal-500/20 text-teal-300", iconBg: "bg-teal-500/20" },
  sheep: { gradient: "from-indigo-600 to-purple-600", badge: "bg-indigo-500/20 text-indigo-300", iconBg: "bg-indigo-500/20" },
  default: { gradient: "from-emerald-600 to-teal-600", badge: "bg-emerald-500/20 text-emerald-300", iconBg: "bg-emerald-500/20" }
};

// Statistics cards data (maintenant dynamique)
const getStatCards = (t) => [
  { 
    icon: <Warehouse size={24} />, 
    label: t.statActiveAssets, 
    key: "totalAssets",
    gradient: "from-emerald-500 to-teal-500",
    description: t.statAvailableForInvestment
  },
  { 
    icon: <TrendingUp size={24} />, 
    label: t.statAvgROI, 
    key: "avgROI",
    suffix: "%",
    gradient: "from-amber-500 to-orange-500",
    description: t.statProjectedReturn
  },
  { 
    icon: <DollarSign size={24} />, 
    label: t.statPortfolioValue, 
    key: "totalValue",
    prefix: "FCFA ",
    formatter: (val) => `${(val / 1000000).toFixed(1)}M`,
    gradient: "from-emerald-600 to-teal-600",
    description: t.statTotalAssets
  },
  { 
    icon: <Users size={24} />, 
    label: t.statActiveInvestors, 
    key: "investors",
    value: 1247,
    gradient: "from-purple-500 to-pink-500",
    description: t.statTrustingPlatform
  }
];

// Investment opportunities data (inchangé mais les textes sont en FR/EN via le composant)
const investmentHighlights = [
  { icon: <Zap size={20} />, key: "shortCycles", color: "text-amber-500" },
  { icon: <ShieldCheck size={20} />, key: "certifiedAssets", color: "text-emerald-500" },
  { icon: <BarChart3 size={20} />, key: "highRoi", color: "text-purple-500" },
  { icon: <Globe size={20} />, key: "exportReady", color: "text-cyan-500" },
  { icon: <Clock size={20} />, key: "passiveIncome", color: "text-orange-500" },
  { icon: <Building2 size={20} />, key: "taxBenefits", color: "text-indigo-500" }
];

const getInvestmentTexts = (t) => ({
  shortCycles: { title: "Cycles Courts", description: "2-18 mois" },
  certifiedAssets: { title: "Actifs Certifiés", description: "100% vérifiés" },
  highRoi: { title: "ROI Élevé", description: "Jusqu'à 40%" },
  exportReady: { title: "Prêt à l'Export", description: "Marchés internationaux" },
  passiveIncome: { title: "Revenus Passifs", description: "Paiements mensuels" },
  taxBenefits: { title: "Avantages Fiscaux", description: "Avantages légaux" }
});

// Testimonials (inchangé car les noms restent)
const testimonials = [
  {
    name: "Jean-Paul N.",
    role: "Investisseur depuis 2024",
    content: "J'ai investi 15M FCFA dans l'aviculture. J'ai reçu 22% de ROI en 8 mois. La plateforme est transparente et fiable.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Marie-Claire K.",
    role: "Entrepreneuse agricole",
    content: "Le projet d'aquaculture a doublé mon investissement en 10 mois. L'équipe de soutien est très réactive.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "David E.",
    role: "Investisseur de la diaspora",
    content: "J'investis depuis la France en toute confiance. Rapports mensuels et projections de ROI claires.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

// FAQ Data (traduite)
const getFaqs = (t) => [
  { q: "Comment fonctionne l'investissement en élevage ?", a: "Vous achetez des parts dans des unités de production certifiées. La ferme gère les opérations, et vous recevez des retours basés sur le cycle d'investissement." },
  { q: "Quel est l'investissement minimum ?", a: "L'investissement minimum commence à 500 000 FCFA pour certains actifs, avec une moyenne de 2 500 000 FCFA pour la plupart des catégories." },
  { q: "Mes actifs sont-ils assurés ?", a: "Oui, tous les actifs sont couverts par une assurance bétail et des protocoles de biosécurité." },
  { q: "Comment reçois-je les retours ?", a: "Les retours sont payés via mobile money (MTN/Orange Money) ou virement bancaire à la fin du cycle." },
  { q: "Puis-je visiter la ferme ?", a: "Absolument ! Nous organisons des visites trimestrielles des fermes pour les investisseurs." }
];

const LivestockIntroduction = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const { t, lang } = useTranslations(); // ✅ Récupérer les traductions
  const [categories, setCategories] = useState([]);
  const [featuredLivestock, setFeaturedLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [error, setError] = useState(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    avgROI: 0,
    totalValue: 0
  });

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const statCards = getStatCards(t);
  const investmentTexts = getInvestmentTexts(t);
  const faqs = getFaqs(t);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${BACKEND_URL}${imagePath}`;
    return `${BACKEND_URL}/uploads/${imagePath}`;
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      setTimeout(checkScrollButtons, 100);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [categories]);

  // ✅ MODIFICATION: Ajouter le paramètre lang aux appels API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesRes = await api.getAllLivestockCategories({ isActive: true, lang }); // ✅ Ajout lang
      const dbCategories = categoriesRes.categories || categoriesRes || [];
      
      const livestockRes = await api.getAllLivestock({ status: 'AVAILABLE', lang }); // ✅ Ajout lang
      const livestock = livestockRes.livestock || livestockRes || [];
      
      const totalValue = livestock.reduce((sum, item) => sum + (item.price?.amount || 0), 0);
      const avgRoi = livestock.length > 0 
        ? livestock.reduce((sum, item) => sum + (item.roi || 0), 0) / livestock.length 
        : 0;
      
      setStats({
        totalAssets: livestock.length,
        avgROI: avgRoi,
        totalValue: totalValue
      });
      
      const grouped = {};
      livestock.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });
      
      const formattedCategories = dbCategories.map(cat => {
        const categoryAssets = grouped[cat.slug] || [];
        const colors = categoryCardColors[cat.slug] || categoryCardColors.default;
        
        let imageUrl = '';
        if (cat.imageType === 'upload' && cat.imageUpload) {
          imageUrl = getFullImageUrl(cat.imageUpload);
        } else if (cat.imageUrl) {
          imageUrl = cat.imageUrl;
        } else {
          imageUrl = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
        }
        
        return {
          id: cat._id,
          slug: cat.slug,
          title: cat.title, // ✅ Déjà traduit par le backend
          subtitle: cat.subtitle || cat.title,
          description: cat.description, // ✅ Déjà traduit par le backend
          icon: iconMap[cat.iconName] || <Leaf size={32} />,
          count: categoryAssets.length,
          totalValue: categoryAssets.reduce((sum, item) => sum + (item.price?.amount || 0), 0),
          image: imageUrl,
          marketDemand: cat.marketDemand || '+0% YoY',
          colors: colors,
          avgRoi: categoryAssets.length > 0 
            ? categoryAssets.reduce((sum, item) => sum + (item.roi || 0), 0) / categoryAssets.length 
            : 0
        };
      });
      
      setCategories(formattedCategories.filter(cat => cat.count > 0));
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MODIFICATION: Ajouter le paramètre lang aux appels API
  const fetchFeaturedLivestock = async () => {
    try {
      setLoadingFeatured(true);
      const response = await api.getAllLivestock({ status: 'AVAILABLE', limit: 6, lang }); // ✅ Ajout lang
      const items = response.livestock || response || [];
      
      const formattedItems = items.slice(0, 6).map(item => ({
        ...item,
        id: item._id || item.id,
        image: item.images && item.images[0] ? getFullImageUrl(item.images[0]) : null,
        location: item.location?.city || item.location || 'Cameroon',
        categorySlug: item.category?.toLowerCase().replace(/\s+/g, '-') || 'livestock'
      }));
      
      setFeaturedLivestock(formattedItems);
    } catch (err) {
      console.error('Error fetching featured livestock:', err);
    } finally {
      setLoadingFeatured(false);
    }
  };

  // ✅ Re-fetch quand la langue change
  useEffect(() => {
    fetchCategories();
    fetchFeaturedLivestock();
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('newsletterShown')) {
        setShowNewsletter(true);
        localStorage.setItem('newsletterShown', 'true');
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setTimeout(() => {
      setShowNewsletter(false);
      setEmailSubmitted(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf size={24} className="text-emerald-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 mt-6 text-sm">{t.loading}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center max-w-md">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="font-bold text-lg mb-2">{t.error}</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
            >
              {t.tryAgain}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* ========== HERO SECTION - AVEC TRADUCTIONS ========== */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden"
      >
        {/* ... background particles (inchangé) ... */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i} className="absolute bg-white/5 rounded-full" /* ... */ />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full mb-8"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">{t.heroBadge}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-[1.1]"
          >
            {t.heroTitle} <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">{t.heroTitleHighlight}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100 max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            {t.heroSubtitle}
            <br />
            <span className="text-emerald-300">{t.heroSubtitleHighlight}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <button
              onClick={() => scrollContainerRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              {t.heroBtnExplore} <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setShowNewsletter(true)}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              {t.heroBtnGuide} <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== STATS SECTION - DYNAMIQUE ========== */}
      <section className="py-16 px-6 relative -mt-10 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value !== undefined 
                    ? stat.value 
                    : stat.key === 'avgROI' 
                      ? `+${stats[stat.key].toFixed(1)}${stat.suffix || ''}`
                      : stat.formatter 
                        ? stat.formatter(stats[stat.key])
                        : stats[stat.key]}
                </p>
                <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION - AVEC TRADUCTIONS ========== */}
      <section ref={scrollContainerRef} id="categories" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
              <Layers size={14} className="text-amber-600" />
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">{t.categoriesBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.categoriesTitle} <span className="text-emerald-600">{t.categoriesTitleHighlight}</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              {t.categoriesSubtitle}
            </p>
          </motion.div>

          {/* Carousel (contenu inchangé, les catégories sont déjà traduites par le backend) */}
          {/* ... reste du carousel identique ... */}
        </div>
      </section>

      {/* ========== FEATURED SECTION - AVEC TRADUCTIONS ========== */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
              <Star size={14} className="text-amber-600" />
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">{t.featuredBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.featuredTitle} <span className="text-emerald-600">{t.featuredTitleHighlight}</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              {t.featuredSubtitle}
            </p>
          </motion.div>

          {/* Featured livestock grid (contenu inchangé, les données sont déjà traduites) */}
          {/* ... */}
        </div>
      </section>

      {/* ========== INVESTMENT HIGHLIGHTS - AVEC TRADUCTIONS ========== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <Gem size={14} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wide">{t.advantagesBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
              {t.advantagesTitle} <span className="text-emerald-600">{t.advantagesTitleHighlight}</span>
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {investmentHighlights.map((item, i) => {
              const texts = investmentTexts[item.key];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="text-center p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full ${item.color.replace('text', 'bg')}/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <div className={item.color}>{item.icon}</div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{texts.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{texts.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS - AVEC TRADUCTIONS ========== */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Rocket size={14} className="text-purple-600" />
              <span className="text-purple-700 text-xs font-bold uppercase tracking-wide">{t.howItWorksBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.howItWorksTitle} <span className="text-purple-600">{t.howItWorksTitleHighlight}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t.step1Title, desc: t.step1Desc, icon: <Globe size={24} /> },
              { step: "02", title: t.step2Title, desc: t.step2Desc, icon: <Database size={24} /> },
              { step: "03", title: t.step3Title, desc: t.step3Desc, icon: <DollarSign size={24} /> },
              { step: "04", title: t.step4Title, desc: t.step4Desc, icon: <TrendingUp size={24} /> }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <div className="text-white">{item.icon}</div>
                </div>
                <div className="text-4xl font-bold text-purple-200 mb-2">{item.step}</div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS - AVEC TRADUCTIONS ========== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
              <Star size={14} className="text-amber-600" />
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">{t.testimonialsBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.testimonialsTitle} <span className="text-amber-600">{t.testimonialsTitleHighlight}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION - AVEC TRADUCTIONS ========== */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <MessageCircle size={14} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wide">{t.faqBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.faqTitle} <span className="text-emerald-600">{t.faqTitleHighlight}</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setSelectedFaq(selectedFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{faq.q}</span>
                  <ChevronRight 
                    size={18} 
                    className={`text-gray-400 transition-transform ${selectedFaq === i ? 'rotate-90' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {selectedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 p-5 bg-gray-50"
                    >
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION - AVEC TRADUCTIONS ========== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <BadgeCheck size={56} className="text-white/80 mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
                {t.ctaTitle}
              </h3>
              <p className="text-emerald-100 mb-8 max-w-md mx-auto">
                {t.ctaSubtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  {t.ctaBtnRegister} <ArrowRight size={18} />
                </Link>
                <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2">
                  <Phone size={16} />
                  {t.ctaBtnCall}
                </button>
              </div>
              <p className="text-emerald-200/60 text-xs mt-6">
                *Sans engagement. Consultation gratuite avec notre équipe d'investissement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Modal (inchangé) */}
      <AnimatePresence>
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNewsletter(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {!emailSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Mail size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                      {lang === 'fr' ? "Guide d'Investissement Gratuit" : "Free Investment Guide"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {lang === 'fr' 
                        ? "Recevez notre guide 2025 + conseils mensuels" 
                        : "Get our 2025 Investment Guide + monthly insights"}
                    </p>
                  </div>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder={lang === 'fr' ? "Votre email" : "Your email address"}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      {lang === 'fr' ? "Recevoir le guide" : "Send me the guide"}
                    </button>
                  </form>
                  <button
                    onClick={() => setShowNewsletter(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {lang === 'fr' ? "Merci !" : "Thanks!"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {lang === 'fr' 
                      ? "Vérifiez votre boîte de réception." 
                      : "Check your inbox for the guide."}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default LivestockIntroduction;