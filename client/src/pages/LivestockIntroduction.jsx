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

// Environment detection
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// Icon mapping
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

// Premium color schemes per category (for category cards)
const categoryCardColors = {
  aquaculture: { gradient: "from-cyan-600 to-teal-600", badge: "bg-cyan-500/20 text-cyan-300", iconBg: "bg-cyan-500/20" },
  poultry: { gradient: "from-emerald-600 to-teal-600", badge: "bg-emerald-500/20 text-emerald-300", iconBg: "bg-emerald-500/20" },
  cattle: { gradient: "from-amber-600 to-orange-600", badge: "bg-amber-500/20 text-amber-300", iconBg: "bg-amber-500/20" },
  pigs: { gradient: "from-rose-600 to-pink-600", badge: "bg-rose-500/20 text-rose-300", iconBg: "bg-rose-500/20" },
  goats: { gradient: "from-teal-600 to-emerald-600", badge: "bg-teal-500/20 text-teal-300", iconBg: "bg-teal-500/20" },
  sheep: { gradient: "from-indigo-600 to-purple-600", badge: "bg-indigo-500/20 text-indigo-300", iconBg: "bg-indigo-500/20" },
  default: { gradient: "from-emerald-600 to-teal-600", badge: "bg-emerald-500/20 text-emerald-300", iconBg: "bg-emerald-500/20" }
};

// Statistics cards data (with dynamic translations)
const getStatCards = (t) => [
  { 
    icon: <Warehouse size={24} />, 
    label: t.activeAssets, 
    key: "totalAssets",
    gradient: "from-emerald-500 to-teal-500",
    description: t.availableForInvestment
  },
  { 
    icon: <TrendingUp size={24} />, 
    label: t.averageROI, 
    key: "avgROI",
    suffix: "%",
    gradient: "from-amber-500 to-orange-500",
    description: t.projectedAnnualReturn
  },
  { 
    icon: <DollarSign size={24} />, 
    label: t.portfolioValue, 
    key: "totalValue",
    prefix: "FCFA ",
    formatter: (val) => `${(val / 1000000).toFixed(1)}M`,
    gradient: "from-emerald-600 to-teal-600",
    description: t.totalAssetsUnderMgmt
  },
  { 
    icon: <Users size={24} />, 
    label: t.activeInvestors, 
    key: "investors",
    value: 1247,
    gradient: "from-purple-500 to-pink-500",
    description: t.trustingPlatform
  }
];

// Investment opportunities data (with dynamic translations)
const getInvestmentHighlights = (t) => [
  { icon: <Zap size={20} />, title: t.shortCycles, description: "2-18 months", color: "text-amber-500" },
  { icon: <ShieldCheck size={20} />, title: t.certifiedAssets, description: "100% verified", color: "text-emerald-500" },
  { icon: <BarChart3 size={20} />, title: t.highROI, description: t.upTo, color: "text-purple-500" },
  { icon: <Globe size={20} />, title: t.exportReady, description: t.internationalMarkets, color: "text-cyan-500" },
  { icon: <Clock size={20} />, title: t.passiveIncome, description: t.monthlyPayouts, color: "text-orange-500" },
  { icon: <Building2 size={20} />, title: t.taxBenefits, description: t.legalAdvantages, color: "text-indigo-500" }
];

// Testimonials data (with dynamic translations)
const getTestimonials = (t) => [
  {
    name: "Jean-Paul N.",
    role: t.investorSince2024,
    content: t.testimonial1,
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Marie-Claire K.",
    role: t.agriEntrepreneur,
    content: t.testimonial2,
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "David E.",
    role: t.diasporaInvestor,
    content: t.testimonial3,
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

// FAQ Data (with dynamic translations)
const getFaqs = (t) => [
  { q: t.faq1_q, a: t.faq1_a },
  { q: t.faq2_q, a: t.faq2_a },
  { q: t.faq3_q, a: t.faq3_a },
  { q: t.faq4_q, a: t.faq4_a },
  { q: t.faq5_q, a: t.faq5_a }
];

const LivestockIntroduction = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const currentLang = useCurrentLang();
  
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

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero
      badge: "CAPEF Certifié • Cameroun",
      heroTitle: "Investissement",
      heroHighlight: "Élevage",
      heroDesc: "Investissez dans des actifs d'élevage certifiés à haut rendement à travers le Cameroun.",
      heroSubDesc: "Cycles courts | Rendements sécurisés | Transparence totale",
      exploreSectors: "Explorer les secteurs",
      getFreeGuide: "Guide gratuit",
      badges: ["100+ Investisseurs Actifs", "2B+ FCFA Gérés", "99% Satisfaction Client", "Support 24/7"],
      
      // Stats
      activeAssets: "Actifs Actifs",
      averageROI: "ROI Moyen",
      portfolioValue: "Valeur du Portefeuille",
      activeInvestors: "Investisseurs Actifs",
      availableForInvestment: "Disponibles pour investissement immédiat",
      projectedAnnualReturn: "Rendement annuel projeté",
      totalAssetsUnderMgmt: "Actifs totaux sous gestion",
      trustingPlatform: "Nous font confiance",
      
      // Categories section
      investmentSectors: "Secteurs d'Investissement",
      chooseYourSector: "Choisissez votre",
      sector: "Secteur",
      categoryDesc: "Parcourez les secteurs de production animale certifiés",
      assets: "Actifs",
      value: "Valeur",
      
      // Featured assets
      topOpportunities: "Opportunités Premium",
      featuredLivestockAssets: "Actifs d'Élevage",
      featured: "à la Une",
      featuredDesc: "Unités de production à haut rendement sélectionnées pour investissement immédiat",
      viewDetails: "Voir les détails",
      viewAll: "Voir toutes les opportunités d'élevage",
      
      // Investment highlights
      whyChooseUs: "Pourquoi Nous Choisir",
      investmentAdvantages: "Avantages",
      shortCycles: "Cycles Courts",
      certifiedAssets: "Actifs Certifiés",
      highROI: "ROI Élevé",
      upTo: "Jusqu'à 40%",
      exportReady: "Prêt à l'Export",
      internationalMarkets: "Marchés internationaux",
      passiveIncome: "Revenu Passif",
      monthlyPayouts: "Paiements mensuels",
      taxBenefits: "Avantages Fiscaux",
      legalAdvantages: "Avantages légaux",
      
      // How it works
      simpleProcess: "Processus Simple",
      howItWorks: "Comment ça",
      works: "marche",
      chooseSector: "Choisir un Secteur",
      chooseSectorDesc: "Sélectionnez parmi les secteurs certifiés",
      selectAsset: "Sélectionner un Actif",
      selectAssetDesc: "Choisissez des unités adaptées à vos objectifs",
      invest: "Investir",
      investDesc: "Paiement sécurisé via mobile money ou banque",
      earnReturns: "Gagner des Rendements",
      earnReturnsDesc: "Recevez vos profits en fin de cycle",
      startInvesting: "Commencer à investir aujourd'hui",
      
      // Testimonials
      successStories: "Histoires de Réussite",
      whatInvestorsSay: "Ce que disent nos",
      investorsSay: "Investisseurs",
      investorSince2024: "Investisseur depuis 2024",
      agriEntrepreneur: "Entrepreneur agricole",
      diasporaInvestor: "Investisseur diaspora",
      testimonial1: "J'ai investi 15M FCFA dans l'aviculture. Reçu 22% de ROI en 8 mois. La plateforme est transparente et fiable.",
      testimonial2: "Le projet d'aquaculture a doublé mon investissement en 10 mois. L'équipe de support est très réactive.",
      testimonial3: "J'investis depuis la France en toute confiance. Rapports mensuels et projections de ROI claires.",
      
      // FAQ
      questions: "Questions ?",
      frequentlyAsked: "Questions",
      faq1_q: "Comment fonctionne l'investissement dans l'élevage ?",
      faq1_a: "Vous achetez des parts dans des unités de production certifiées. La ferme gère les opérations et vous recevez des rendements basés sur le cycle d'investissement.",
      faq2_q: "Quel est l'investissement minimum ?",
      faq2_a: "L'investissement minimum commence à 500 000 FCFA pour certains actifs, avec une moyenne de 2 500 000 FCFA pour la plupart des catégories.",
      faq3_q: "Mes actifs sont-ils assurés ?",
      faq3_a: "Oui, tous les actifs sont couverts par une assurance bétail et des protocoles de biosécurité.",
      faq4_q: "Comment reçois-je les rendements ?",
      faq4_a: "Les rendements sont payés via mobile money (MTN/Orange Money) ou virement bancaire à la fin du cycle.",
      faq5_q: "Puis-je visiter la ferme ?",
      faq5_a: "Absolument ! Nous organisons des visites de ferme trimestrielles pour les investisseurs.",
      
      // CTA
      readyToBuild: "Prêt à Constituer Votre Portefeuille ?",
      ctaDesc: "Rejoignez plus de 1 000 investisseurs qui gagnent déjà un revenu passif grâce aux actifs d'élevage",
      createAccount: "Créer un compte gratuit",
      callAdvisor: "Appeler un conseiller",
      noCommitment: "*Sans engagement. Consultation gratuite avec notre équipe d'investissement.",
      
      // Newsletter
      freeGuide: "Guide d'investissement gratuit",
      newsletterTitle: "Guide d'Investissement 2025",
      newsletterDesc: "Recevez notre Guide d'Investissement Élevage 2025 + conseils mensuels",
      sendMeGuide: "Envoyez-moi le guide",
      thanksSubscribing: "Merci de votre inscription !",
      checkInbox: "Consultez votre boîte mail pour le guide.",
      
      // Errors
      loadingError: "Erreur de chargement",
      tryAgain: "Réessayer",
      loadingOpportunities: "Chargement des opportunités d'investissement...",
      noAssets: "Aucun actif disponible pour le moment.",
      
      // How it works steps
      step1Title: "Choisir un Secteur",
      step1Desc: "Sélectionnez parmi les secteurs d'élevage certifiés",
      step2Title: "Sélectionner un Actif",
      step2Desc: "Choisissez des unités de production adaptées à vos objectifs",
      step3Title: "Investir",
      step3Desc: "Paiement sécurisé via mobile money ou banque",
      step4Title: "Gagner",
      step4Desc: "Recevez vos bénéfices en fin de cycle",
      
      // Badges hero
      badge1: "100+ Investisseurs Actifs",
      badge2: "2B+ FCFA Gérés",
      badge3: "99% Satisfaction Client",
      badge4: "Support 24/7"
    },
    en: {
      // Hero
      badge: "CAPEF Certified • Cameroon",
      heroTitle: "Livestock",
      heroHighlight: "Investment",
      heroDesc: "Invest in certified, high-yield livestock assets across Cameroon.",
      heroSubDesc: "Short cycles | Secure returns | Full transparency",
      exploreSectors: "Explore sectors",
      getFreeGuide: "Get free guide",
      badges: ["100+ Active Investors", "2B+ FCFA Managed", "99% Client Satisfaction", "24/7 Support"],
      
      // Stats
      activeAssets: "Active Assets",
      averageROI: "Average ROI",
      portfolioValue: "Portfolio Value",
      activeInvestors: "Active Investors",
      availableForInvestment: "Available for immediate investment",
      projectedAnnualReturn: "Projected annual return",
      totalAssetsUnderMgmt: "Total assets under management",
      trustingPlatform: "Trusting our platform",
      
      // Categories section
      investmentSectors: "Investment Sectors",
      chooseYourSector: "Choose Your",
      sector: "Sector",
      categoryDesc: "Browse certified livestock production sectors",
      assets: "Assets",
      value: "Value",
      
      // Featured assets
      topOpportunities: "Top Opportunities",
      featuredLivestockAssets: "Featured Livestock",
      featured: "Assets",
      featuredDesc: "Hand-picked high-yield production units ready for immediate investment",
      viewDetails: "View details",
      viewAll: "View all livestock opportunities",
      
      // Investment highlights
      whyChooseUs: "Why Choose Us",
      investmentAdvantages: "Advantages",
      shortCycles: "Short Cycles",
      certifiedAssets: "Certified Assets",
      highROI: "High ROI",
      upTo: "Up to 40%",
      exportReady: "Export Ready",
      internationalMarkets: "International markets",
      passiveIncome: "Passive Income",
      monthlyPayouts: "Monthly payouts",
      taxBenefits: "Tax Benefits",
      legalAdvantages: "Legal advantages",
      
      // How it works
      simpleProcess: "Simple Process",
      howItWorks: "How It",
      works: "Works",
      chooseSector: "Choose Sector",
      chooseSectorDesc: "Select from certified livestock sectors",
      selectAsset: "Select Asset",
      selectAssetDesc: "Pick production units matching your goals",
      invest: "Invest",
      investDesc: "Secure payment via mobile money or bank",
      earnReturns: "Earn Returns",
      earnReturnsDesc: "Receive profits at cycle completion",
      startInvesting: "Start investing today",
      
      // Testimonials
      successStories: "Success Stories",
      whatInvestorsSay: "What",
      investorsSay: "Investors Say",
      investorSince2024: "Investor since 2024",
      agriEntrepreneur: "Agriculture entrepreneur",
      diasporaInvestor: "Diaspora investor",
      testimonial1: "Invested 15M FCFA in poultry farming. Received 22% ROI in 8 months. Platform is transparent and reliable.",
      testimonial2: "The aquaculture project doubled my investment in 10 months. Support team is very responsive.",
      testimonial3: "I invest from France with confidence. Monthly reports and clear ROI projections.",
      
      // FAQ
      questions: "Questions?",
      frequentlyAsked: "Frequently Asked",
      faq1_q: "How does livestock investment work?",
      faq1_a: "You purchase shares in certified production units. The farm manages operations, and you receive returns based on the investment cycle.",
      faq2_q: "What is the minimum investment?",
      faq2_a: "Minimum investment starts at 500,000 FCFA for some assets, with an average of 2,500,000 FCFA for most categories.",
      faq3_q: "Are my assets insured?",
      faq3_a: "Yes, all assets are covered by livestock insurance and biosecurity protocols.",
      faq4_q: "How do I receive returns?",
      faq4_a: "Returns are paid via mobile money (MTN/Orange Money) or bank transfer at cycle completion.",
      faq5_q: "Can I visit the farm?",
      faq5_a: "Absolutely! We organize quarterly farm visits for investors.",
      
      // CTA
      readyToBuild: "Ready to Build Your Portfolio?",
      ctaDesc: "Join 1,000+ investors already earning passive income from livestock assets",
      createAccount: "Create free account",
      callAdvisor: "Call advisor",
      noCommitment: "*No commitment. Free consultation with our investment team.",
      
      // Newsletter
      freeGuide: "Free Investment Guide",
      newsletterTitle: "2025 Livestock Investment Guide",
      newsletterDesc: "Get our 2025 Livestock Investment Guide + monthly insights",
      sendMeGuide: "Send me the guide",
      thanksSubscribing: "Thanks for subscribing!",
      checkInbox: "Check your inbox for the guide.",
      
      // Errors
      loadingError: "Loading Error",
      tryAgain: "Try Again",
      loadingOpportunities: "Loading investment opportunities...",
      noAssets: "No featured assets available at the moment.",
      
      // How it works steps
      step1Title: "Choose Sector",
      step1Desc: "Select from certified livestock sectors",
      step2Title: "Select Asset",
      step2Desc: "Pick production units matching your goals",
      step3Title: "Invest",
      step3Desc: "Secure payment via mobile money or bank",
      step4Title: "Earn",
      step4Desc: "Receive profits at cycle completion",
      
      // Badges hero
      badge1: "100+ Active Investors",
      badge2: "2B+ FCFA Managed",
      badge3: "99% Client Satisfaction",
      badge4: "24/7 Support"
    }
  }[currentLang] || {
    // Fallback français
    ...{} // Même structure que fr
  };

  // Mettre à jour les données traduites
  const statCards = getStatCards(t);
  const investmentHighlights = getInvestmentHighlights(t);
  const testimonials = getTestimonials(t);
  const faqs = getFaqs(t);

  // How it works steps traduits
  const howItWorksSteps = [
    { step: "01", title: t.chooseSector, desc: t.chooseSectorDesc, icon: <Globe size={24} /> },
    { step: "02", title: t.selectAsset, desc: t.selectAssetDesc, icon: <Database size={24} /> },
    { step: "03", title: t.invest, desc: t.investDesc, icon: <DollarSign size={24} /> },
    { step: "04", title: t.earnReturns, desc: t.earnReturnsDesc, icon: <TrendingUp size={24} /> }
  ];

  // Hero badges
  const heroBadges = t.badges || [
    "100+ Active Investors", "2B+ FCFA Managed", "99% Client Satisfaction", "24/7 Support"
  ];

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${BACKEND_URL}${imagePath}`;
    return `${BACKEND_URL}/uploads/${imagePath}`;
  };

  // Check scroll position for carousel
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesRes = await api.getAllLivestockCategories({ isActive: true, lang: currentLang });
      const dbCategories = categoriesRes.categories || categoriesRes || [];
      
      const livestockRes = await api.getAllLivestock({ status: 'AVAILABLE', lang: currentLang });
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
          title: cat.title, // Déjà traduit par backend
          subtitle: cat.subtitle || cat.title,
          description: cat.description, // Déjà traduit par backend
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
      setError(err.response?.data?.message || err.message || t.loadingError);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedLivestock = async () => {
    try {
      setLoadingFeatured(true);
      const response = await api.getAllLivestock({ status: 'AVAILABLE', limit: 6, lang: currentLang });
      const items = response.livestock || response || [];
      
      const formattedItems = items.slice(0, 6).map(item => ({
        ...item,
        id: item._id || item.id,
        title: item.title, // Déjà traduit par backend
        description: item.description, // Déjà traduit par backend
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

  useEffect(() => {
    fetchCategories();
    fetchFeaturedLivestock();
    const timer = setTimeout(() => {
      if (!localStorage.getItem('newsletterShown')) {
        setShowNewsletter(true);
        localStorage.setItem('newsletterShown', 'true');
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentLang]);

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
          <p className="text-gray-500 mt-6 text-sm">{t.loadingOpportunities}</p>
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
            <p className="font-bold text-lg mb-2">{t.loadingError}</p>
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

      {/* ========== HERO SECTION ========== */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full mb-8"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">{t.badge}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-[1.1]"
          >
            {currentLang === 'fr' ? t.heroTitle : t.heroTitle} <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              {currentLang === 'fr' ? t.heroHighlight : t.heroTitle}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100 max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            {t.heroDesc}
            <br />
            <span className="text-emerald-300">{t.heroSubDesc}</span>
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
              {t.exploreSectors} <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setShowNewsletter(true)}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              {t.getFreeGuide} <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/10"
          >
            {heroBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-emerald-200">
                <CheckCircle size={12} className="text-amber-400" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== STATS SECTION ========== */}
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

      {/* ========== CATEGORIES SECTION (CARROUSEL SLIDES) ========== */}
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
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">{t.investmentSectors}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.chooseYourSector} <span className="text-emerald-600">{t.sector}</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              {t.categoryDesc}
            </p>
          </motion.div>

          {/* Carousel with navigation */}
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:bg-white transition-all -ml-4"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-8 scroll-smooth hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group flex-shrink-0 w-[350px] md:w-[400px]"
                >
                  <Link to={`/agriculture/livestock/${cat.slug}`} className="block">
                    <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={cat.image} 
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className={`px-3 py-1 rounded-full ${cat.colors.badge} backdrop-blur-sm`}>
                          <span className="text-[10px] font-bold uppercase">{cat.marketDemand}</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-sm">
                          <span className="text-[10px] font-bold text-amber-300">+{cat.avgRoi.toFixed(0)}% ROI</span>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-xl ${cat.colors.iconBg} backdrop-blur-sm flex items-center justify-center text-white`}>
                            {cat.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wide">{cat.subtitle}</p>
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-xs line-clamp-2 mb-3">
                          {cat.description.substring(0, 100)}...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            <div>
                              <p className="text-[8px] font-bold uppercase text-white/50">{t.assets}</p>
                              <p className="text-base font-bold text-white">{cat.count}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase text-white/50">{t.value}</p>
                              <p className="text-base font-bold text-amber-400">
                                {(cat.totalValue / 1000000).toFixed(0)}M FCFA
                              </p>
                            </div>
                          </div>
                          <ArrowRight size={18} className="text-white/50 group-hover:text-amber-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {canScrollRight && categories.length > 2 && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:bg-white transition-all -mr-4"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>
            )}
          </div>

          {categories.length > 2 && (
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-4 h-2 rounded-full bg-amber-500" />
            </div>
          )}
        </div>
      </section>

      {/* ========== FEATURED LIVESTOCK ASSETS ========== */}
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
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">{t.topOpportunities}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.featuredLivestockAssets} <span className="text-emerald-600">{t.featured}</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              {t.featuredDesc}
            </p>
          </motion.div>

          {loadingFeatured ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="text-emerald-600 animate-spin" />
            </div>
          ) : featuredLivestock.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">{t.noAssets}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLivestock.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer"
                  onClick={() => navigate(`/agriculture/livestock/${asset.categorySlug}/${asset.id}`)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={asset.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'} 
                      alt={asset.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-[9px] font-bold">
                      +{asset.roi || 0}% ROI
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-[9px] font-bold">
                      <MapPin size={10} className="text-amber-400" />
                      {asset.location}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{asset.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{asset.description?.substring(0, 80)}...</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400">{t.invest}</p>
                        <p className="text-lg font-bold text-emerald-700">
                          {(asset.price?.amount / 1000000).toFixed(1)}M FCFA
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold group-hover:gap-2 transition-all">
                        {t.viewDetails} <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/agriculture/livestock"
              className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold hover:text-emerald-700 transition-colors"
            >
              {t.viewAll} <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== INVESTMENT HIGHLIGHTS ========== */}
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
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wide">{t.whyChooseUs}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
              {t.investmentAdvantages}
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {investmentHighlights.map((item, i) => (
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
                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
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
              <span className="text-purple-700 text-xs font-bold uppercase tracking-wide">{t.simpleProcess}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.howItWorks} <span className="text-purple-600">{t.works}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((item, i) => (
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold hover:shadow-xl transition-all"
            >
              {t.startInvesting} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
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
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">{t.successStories}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.whatInvestorsSay} <span className="text-amber-600">{t.investorsSay}</span>
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

      {/* ========== FAQ SECTION ========== */}
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
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wide">{t.questions}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {t.frequentlyAsked} <span className="text-emerald-600">{t.questions}</span>
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

      {/* ========== CTA SECTION ========== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white/5 rounded-full"
                  style={{
                    width: Math.random() * 100 + 20,
                    height: Math.random() * 100 + 20,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <BadgeCheck size={56} className="text-white/80 mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
                {t.readyToBuild}
              </h3>
              <p className="text-emerald-100 mb-8 max-w-md mx-auto">
                {t.ctaDesc}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  {t.createAccount} <ArrowRight size={18} />
                </Link>
                <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2">
                  <Phone size={16} />
                  {t.callAdvisor}
                </button>
              </div>
              <p className="text-emerald-200/60 text-xs mt-6">
                {t.noCommitment}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== NEWSLETTER MODAL ========== */}
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
                      {t.freeGuide}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {t.newsletterDesc}
                    </p>
                  </div>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      {t.sendMeGuide}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.thanksSubscribing}</h3>
                  <p className="text-gray-500 text-sm">{t.checkInbox}</p>
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