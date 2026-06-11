import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Fish, Bird, Database, Leaf, MapPin, Gauge, ChevronRight,
  TrendingUp, Info, Loader2, Filter, Grid3x3, List, Heart, Share2,
  DollarSign, ShieldCheck, Droplets, Sun, AlertCircle, CheckCircle,
  Clock, Users, Award, Zap, BarChart3, Calculator, X, Plus,
  TrendingDown, Activity, Briefcase, Target, Calendar
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// Hook pour récupérer la langue actuelle - CORRIGÉ
const useCurrentLang = () => {
  const getInitialLang = () => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    return urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
  };
  
  const [lang, setLang] = useState(getInitialLang);
  
  useEffect(() => {
    const handleLangChange = () => {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      const storedLang = localStorage.getItem('preferredLanguage');
      const browserLang = navigator.language.split('-')[0];
      const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
      setLang(finalLang);
    };
    
    // Écouter les changements d'URL
    window.addEventListener('popstate', handleLangChange);
    
    // Observer les changements de localStorage
    const storageListener = (e) => {
      if (e.key === 'preferredLanguage') {
        handleLangChange();
      }
    };
    window.addEventListener('storage', storageListener);
    
    return () => {
      window.removeEventListener('popstate', handleLangChange);
      window.removeEventListener('storage', storageListener);
    };
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
  Leaf: <Leaf size={32} />
};

// Premium color schemes per category
const categoryColorMap = {
  aquaculture: { 
    bg: "bg-gradient-to-br from-cyan-50 to-cyan-100", 
    bgDark: "bg-gradient-to-br from-cyan-900 to-cyan-800",
    color: "text-cyan-700", 
    border: "border-cyan-200", 
    button: "bg-cyan-600 hover:bg-cyan-700",
    accent: "from-cyan-500 to-teal-500",
    light: "bg-cyan-50",
    badge: "bg-cyan-100 text-cyan-700"
  },
  poultry: { 
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", 
    bgDark: "bg-gradient-to-br from-emerald-900 to-emerald-800",
    color: "text-emerald-700", 
    border: "border-emerald-200", 
    button: "bg-emerald-600 hover:bg-emerald-700",
    accent: "from-emerald-500 to-teal-500",
    light: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700"
  },
  cattle: { 
    bg: "bg-gradient-to-br from-amber-50 to-amber-100", 
    bgDark: "bg-gradient-to-br from-amber-900 to-amber-800",
    color: "text-amber-700", 
    border: "border-amber-200", 
    button: "bg-amber-600 hover:bg-amber-700",
    accent: "from-amber-500 to-orange-500",
    light: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700"
  },
  pigs: { 
    bg: "bg-gradient-to-br from-rose-50 to-rose-100", 
    bgDark: "bg-gradient-to-br from-rose-900 to-rose-800",
    color: "text-rose-700", 
    border: "border-rose-200", 
    button: "bg-rose-600 hover:bg-rose-700",
    accent: "from-rose-500 to-pink-500",
    light: "bg-rose-50",
    badge: "bg-rose-100 text-rose-700"
  },
  goats: { 
    bg: "bg-gradient-to-br from-teal-50 to-teal-100", 
    bgDark: "bg-gradient-to-br from-teal-900 to-teal-800",
    color: "text-teal-700", 
    border: "border-teal-200", 
    button: "bg-teal-600 hover:bg-teal-700",
    accent: "from-teal-500 to-emerald-500",
    light: "bg-teal-50",
    badge: "bg-teal-100 text-teal-700"
  },
  sheep: { 
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100", 
    bgDark: "bg-gradient-to-br from-indigo-900 to-indigo-800",
    color: "text-indigo-700", 
    border: "border-indigo-200", 
    button: "bg-indigo-600 hover:bg-indigo-700",
    accent: "from-indigo-500 to-purple-500",
    light: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700"
  }
};

const LivestockCategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const currentLang = useCurrentLang();
  
  const [categoryData, setCategoryData] = useState(null);
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('roi');
  const [filterRoi, setFilterRoi] = useState('all');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState({ amount: 1000000, months: 12 });
  const [hoveredCard, setHoveredCard] = useState(null);

  // ========== TRADUCTIONS - CORRIGÉ avec useMemo ==========
  const t = useMemo(() => {
    const translations = {
      fr: {
        // Navigation
        backToSectors: "Retour à tous les secteurs",
        investmentSector: "Secteur d'Investissement",
        investmentHub: "Hub d'Investissement",
        marketStatus: "Statut du Marché",
        yearOverYear: "Croissance annuelle",
        availableAssets: "Actifs Disponibles",
        avgRoi: "ROI Moyen",
        totalValue: "Valeur Totale",
        minInvestment: "Investissement Min",
        calculateMyRoi: "Calculer mon ROI",
        contactUs: "Nous contacter",
        
        // Investment section
        whyInvest: "Pourquoi investir ?",
        roiExplanation: "Explication du ROI",
        taxAdvantage: "Avantage fiscal",
        keyRisks: "Risques clés",
        marketDrivers: "Moteurs du marché",
        roiRange: "Fourchette ROI",
        
        // Category specific investment data
        investWhyAquaculture: "L'aquaculture camerounaise croît de +18% par an. La demande de poisson frais dépasse l'offre de 40%.",
        roiExplanationAquaculture: "Cycle court (6-8 mois), faible taux de mortalité, demande constante des restaurants et ménages.",
        risksAquaculture: "Sensibilité à la qualité de l'eau, dépendance aux aliments importés.",
        taxAdvantageAquaculture: "Exonération de TVA sur les équipements aquacoles (filets, pompes, aérateurs).",
        marketDriver1Aqua: "Hausse des prix du poisson congelé",
        marketDriver2Aqua: "Conscience santé",
        marketDriver3Aqua: "Croissance démographique urbaine",
        
        investWhyPoultry: "La volaille est la viande la plus consommée après le poisson. Hausse de +25% de la demande locale.",
        roiExplanationPoultry: "Cycle très court (2-4 mois), rotation rapide du capital, pics de demande pendant les fêtes.",
        risksPoultry: "Sensibilité aux maladies aviaires, volatilité des prix du maïs.",
        taxAdvantagePoultry: "Crédit d'impôt pour les jeunes agriculteurs (Loi de Finances 2025).",
        marketDriver1Poultry: "Substitution aux importations",
        marketDriver2Poultry: "Culture de rue",
        marketDriver3Poultry: "Demande cérémonielle",
        
        investWhyCattle: "Les bovins sont une valeur de refuge traditionnelle. La demande de bœuf augmente avec l'urbanisation.",
        roiExplanationCattle: "Cycle long (12-18 mois) mais rendements stables. Le prix au kilo augmente annuellement.",
        risksCattle: "Sécheresse, conflits éleveurs-agriculteurs, coûts de transport élevés.",
        taxAdvantageCattle: "Subventions pour l'engraissement (programme MINEPIA).",
        marketDriver1Cattle: "Cérémonies de mariage",
        marketDriver2Cattle: "Expansion des boucheries",
        marketDriver3Cattle: "Potentiel d'export",
        
        investWhyPigs: "Le porc est la troisième viande la plus consommée au Cameroun. Très prisé dans les maquis.",
        roiExplanationPigs: "Cycle moyen (6-8 mois). Le 'porc villageois' bénéficie d'une prime de +30%.",
        risksPigs: "Peste porcine africaine (PPA), volatilité des prix des aliments.",
        taxAdvantagePigs: "Réduction de taxe foncière pour les fermes porcines modernes.",
        marketDriver1Pigs: "Culture des maquis",
        marketDriver2Pigs: "Fêtes de fin d'année",
        marketDriver3Pigs: "Protéine abordable",
        
        investWhyGoats: "Les petits ruminants sont le meilleur point d'entrée pour les petits investisseurs.",
        roiExplanationGoats: "Cycle court (5-7 mois). Les prix grimpent de +50-100% pendant la Tabaski.",
        risksGoats: "Faible (très rustique). Risque principal : le vol.",
        taxAdvantageGoats: "Exemption de patente pour les fermes de moins de 50 têtes.",
        marketDriver1Goats: "Demande Ramadan/Tabaski",
        marketDriver2Goats: "Cérémonies de dot",
        marketDriver3Goats: "Barrière d'entrée basse",
        
        // Filters
        sortByRoi: "ROI le plus élevé",
        sortByPrice: "Valeur la plus élevée",
        sortByCapacity: "Plus grande capacité",
        allRoiLevels: "Tous les niveaux de ROI",
        low: "Faible (0% - 15%)",
        medium: "Moyen (15% - 25%)",
        high: "Élevé (25%+)",
        
        // Asset card
        unitValue: "Valeur unitaire",
        capacity: "Capacité",
        cycle: "Cycle",
        water: "Eau",
        power: "Électricité",
        vet: "Vétérinaire",
        feedStorage: "Stockage aliment",
        viewDetails: "Voir détails",
        projectedWithReinvestment: "Projection avec réinvestissement",
        location: "Localisation",
        
        // Compare
        compareAssets: "Comparer les actifs",
        clearAll: "Tout effacer",
        compare: "Comparer",
        assetSelected: "actif sélectionné",
        assetsSelected: "actifs sélectionnés",
        
        // Calculator
        roiCalculator: "Calculateur de ROI",
        investmentAmount: "Montant d'investissement (FCFA)",
        investmentPeriod: "Période d'investissement (mois)",
        projectedReturn: "Rendement projeté",
        basedOnAvgRoi: "Basé sur le ROI moyen de ce secteur",
        disclaimer: "*Les performances passées ne garantissent pas les rendements futurs. Ceci est une estimation.",
        
        // Empty state
        noAssetsAvailable: "Aucun actif d'investissement disponible dans ce secteur.",
        exploreOtherSectors: "Explorer d'autres secteurs",
        
        // Loading
        loadingData: "Chargement des données du secteur...",
        loadingError: "Erreur de chargement",
        categoryNotFound: "Catégorie non trouvée",
        
        // Badges
        projected: "Projection"
      },
      en: {
        // Navigation
        backToSectors: "Back to all sectors",
        investmentSector: "Investment Sector",
        investmentHub: "Investment Hub",
        marketStatus: "Market Status",
        yearOverYear: "Year-over-Year growth",
        availableAssets: "Available Assets",
        avgRoi: "Avg ROI",
        totalValue: "Total Value",
        minInvestment: "Min Investment",
        calculateMyRoi: "Calculate my ROI",
        contactUs: "Contact Us",
        
        // Investment section
        whyInvest: "Why invest?",
        roiExplanation: "ROI explanation",
        taxAdvantage: "Tax advantage",
        keyRisks: "Key risks",
        marketDrivers: "Market Drivers",
        roiRange: "ROI Range",
        
        // Category specific investment data
        investWhyAquaculture: "Cameroon's fish farming is growing at +18% YoY. Fresh fish demand exceeds supply by 40%.",
        roiExplanationAquaculture: "Short cycle (6-8 months), low mortality rate, consistent demand from restaurants and households.",
        risksAquaculture: "Water quality sensitivity, dependency on imported feed.",
        taxAdvantageAquaculture: "VAT exemption on aquaculture equipment (nets, pumps, aerators).",
        marketDriver1Aqua: "Rising frozen fish prices",
        marketDriver2Aqua: "Health consciousness",
        marketDriver3Aqua: "Urban population growth",
        
        investWhyPoultry: "Poultry is the most consumed meat after fish. +25% surge in local chicken demand.",
        roiExplanationPoultry: "Very short cycle (2-4 months), rapid capital rotation, holiday demand spikes.",
        risksPoultry: "Avian disease susceptibility, maize price volatility.",
        taxAdvantagePoultry: "Tax credit for young farmers (2025 Finance Law).",
        marketDriver1Poultry: "Import substitution",
        marketDriver2Poultry: "Street food culture",
        marketDriver3Poultry: "Ceremony demand",
        
        investWhyCattle: "Cattle are a traditional store of value. Beef demand rises with urbanization.",
        roiExplanationCattle: "Long cycle (12-18 months) but stable returns. Price per kilo increases annually.",
        risksCattle: "Drought, farmer-herder conflicts, high transport costs.",
        taxAdvantageCattle: "Subsidies for fattening (MINEPIA program).",
        marketDriver1Cattle: "Wedding ceremonies",
        marketDriver2Cattle: "Butchery expansion",
        marketDriver3Cattle: "Export potential",
        
        investWhyPigs: "Pork is the third most consumed meat in Cameroon. Highly prized in maquis.",
        roiExplanationPigs: "Medium cycle (6-8 months). 'Village pork' commands +30% premium price.",
        risksPigs: "African Swine Fever (ASF), feed cost volatility.",
        taxAdvantagePigs: "Property tax reduction for modern pig farms.",
        marketDriver1Pigs: "Maquis culture",
        marketDriver2Pigs: "Year-end feasts",
        marketDriver3Pigs: "Affordable protein",
        
        investWhyGoats: "Small ruminants are the best entry point for small investors.",
        roiExplanationGoats: "Short cycle (5-7 months). Prices spike +50-100% during Tabaski.",
        risksGoats: "Low (high hardiness). Main risk is theft.",
        taxAdvantageGoats: "Business license exemption for farms under 50 heads.",
        marketDriver1Goats: "Ramadan/Tabaski demand",
        marketDriver2Goats: "Dowry ceremonies",
        marketDriver3Goats: "Low entry barrier",
        
        // Filters
        sortByRoi: "Highest ROI",
        sortByPrice: "Highest Value",
        sortByCapacity: "Largest Capacity",
        allRoiLevels: "All ROI levels",
        low: "Low (0% - 15%)",
        medium: "Medium (15% - 25%)",
        high: "High (25%+)",
        
        // Asset card
        unitValue: "Unit Value",
        capacity: "Capacity",
        cycle: "Cycle",
        water: "Water",
        power: "Power",
        vet: "Vet",
        feedStorage: "Feed storage",
        viewDetails: "View details",
        projectedWithReinvestment: "Projected with reinvestment",
        location: "Location",
        
        // Compare
        compareAssets: "Compare Assets",
        clearAll: "Clear all",
        compare: "Compare",
        assetSelected: "asset selected",
        assetsSelected: "assets selected",
        
        // Calculator
        roiCalculator: "ROI Calculator",
        investmentAmount: "Investment Amount (FCFA)",
        investmentPeriod: "Investment Period (months)",
        projectedReturn: "Projected Return",
        basedOnAvgRoi: "Based on average ROI for this sector",
        disclaimer: "*Past performance does not guarantee future returns. This is an estimate.",
        
        // Empty state
        noAssetsAvailable: "No investment assets available in this sector.",
        exploreOtherSectors: "Explore other sectors",
        
        // Loading
        loadingData: "Loading sector data...",
        loadingError: "Loading Error",
        categoryNotFound: "Category not found",
        
        // Badges
        projected: "Projected"
      }
    };
    
    return translations[currentLang] || translations.fr;
  }, [currentLang]);

  // ========== Fonction pour obtenir les données d'investissement traduites - CORRIGÉE ==========
  const getInvestmentData = useCallback((slug) => {
    const baseData = {
      aquaculture: {
        why: t.investWhyAquaculture,
        roiExplanation: t.roiExplanationAquaculture,
        risks: t.risksAquaculture,
        taxAdvantage: t.taxAdvantageAquaculture,
        marketDrivers: [t.marketDriver1Aqua, t.marketDriver2Aqua, t.marketDriver3Aqua],
        roiRange: "18-35%",
        minInvestment: "2,500,000 FCFA"
      },
      poultry: {
        why: t.investWhyPoultry,
        roiExplanation: t.roiExplanationPoultry,
        risks: t.risksPoultry,
        taxAdvantage: t.taxAdvantagePoultry,
        marketDrivers: [t.marketDriver1Poultry, t.marketDriver2Poultry, t.marketDriver3Poultry],
        roiRange: "22-40%",
        minInvestment: "4,000,000 FCFA"
      },
      cattle: {
        why: t.investWhyCattle,
        roiExplanation: t.roiExplanationCattle,
        risks: t.risksCattle,
        taxAdvantage: t.taxAdvantageCattle,
        marketDrivers: [t.marketDriver1Cattle, t.marketDriver2Cattle, t.marketDriver3Cattle],
        roiRange: "8-18%",
        minInvestment: "14,000,000 FCFA"
      },
      pigs: {
        why: t.investWhyPigs,
        roiExplanation: t.roiExplanationPigs,
        risks: t.risksPigs,
        taxAdvantage: t.taxAdvantagePigs,
        marketDrivers: [t.marketDriver1Pigs, t.marketDriver2Pigs, t.marketDriver3Pigs],
        roiRange: "18-30%",
        minInvestment: "9,500,000 FCFA"
      },
      goats: {
        why: t.investWhyGoats,
        roiExplanation: t.roiExplanationGoats,
        risks: t.risksGoats,
        taxAdvantage: t.taxAdvantageGoats,
        marketDrivers: [t.marketDriver1Goats, t.marketDriver2Goats, t.marketDriver3Goats],
        roiRange: "22-38%",
        minInvestment: "5,000,000 FCFA"
      }
    };
    
    return baseData[slug] || baseData.poultry;
  }, [t]);

  const getImageUrl = useCallback((image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/livestock/${image}`;
  }, []);

  // ========== FETCH CATEGORY DATA - CORRIGÉ avec useCallback ==========
  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const catResponse = await api.getLivestockCategoryBySlug(category, { lang: currentLang });
      const cat = catResponse.category || catResponse;
      
      if (!cat) throw new Error(`Category "${category}" not found`);
      
      const colors = categoryColorMap[cat.slug] || categoryColorMap.poultry;
      const investData = getInvestmentData(cat.slug);
      
      let categoryImage = null;
      if (cat.imageType === 'upload' && cat.imageUpload) {
        categoryImage = cat.imageUpload.startsWith('http') ? cat.imageUpload : `${BACKEND_URL}${cat.imageUpload}`;
      } else if (cat.imageUrl) {
        categoryImage = cat.imageUrl;
      } else {
        categoryImage = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
      }
      
      setCategoryData({
        id: cat._id,
        slug: cat.slug,
        title: cat.title,
        subtitle: cat.subtitle || cat.title,
        description: cat.description,
        icon: iconMap[cat.iconName] || <Leaf size={32} />,
        bg: colors.bg,
        bgDark: colors.bgDark,
        color: colors.color,
        borderColor: colors.border,
        buttonColor: colors.button,
        accent: colors.accent,
        badgeColor: colors.badge,
        light: colors.light,
        marketDemand: cat.marketDemand || '+0% YoY',
        features: cat.features || [],
        image: categoryImage,
        investData: investData
      });
      
      const livestockRes = await api.getLivestockByCategory(cat.slug, { lang: currentLang });
      const items = livestockRes.livestock || livestockRes || [];
      
      const formattedItems = items.map(item => ({
        ...item,
        id: item._id || item.id,
        title: item.title,
        description: item.description,
        image: item.images && item.images[0] ? getImageUrl(item.images[0]) : null,
        location: item.location?.city || item.location || 'Cameroon',
        region: item.location?.region || 'Cameroon'
      }));
      
      setLivestock(formattedItems);
      
    } catch (err) {
      console.error('Error fetching category data:', err);
      setError(err.response?.data?.message || err.message || t.loadingError);
    } finally {
      setLoading(false);
    }
  }, [category, currentLang, getInvestmentData, getImageUrl, t.loadingError]);

  const filteredAndSortedLivestock = useMemo(() => {
    let filtered = [...livestock];
    
    if (filterRoi !== 'all') {
      const [min, max] = filterRoi.split('-').map(Number);
      filtered = filtered.filter(item => (item.roi || 0) >= min && (!max || (item.roi || 0) <= max));
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'roi') return (b.roi || 0) - (a.roi || 0);
      if (sortBy === 'price') return (b.price?.amount || 0) - (a.price?.amount || 0);
      if (sortBy === 'capacity') return (b.capacity?.value || 0) - (a.capacity?.value || 0);
      return 0;
    });
    
    return filtered;
  }, [livestock, sortBy, filterRoi]);

  const handleSelectAsset = useCallback((assetId) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  }, []);

  const handleCompare = useCallback(() => {
    if (selectedAssets.length >= 2) {
      setShowCompare(true);
    }
  }, [selectedAssets.length]);

  const calculateROI = useCallback((amount, months, assetRoi) => {
    const yearlyReturn = amount * (assetRoi / 100);
    const proRatedReturn = yearlyReturn * (months / 12);
    return proRatedReturn;
  }, []);

  const avgRoi = useMemo(() => {
    if (filteredAndSortedLivestock.length === 0) return 0;
    const sum = filteredAndSortedLivestock.reduce((acc, item) => acc + (item.roi || 0), 0);
    return (sum / filteredAndSortedLivestock.length).toFixed(1);
  }, [filteredAndSortedLivestock]);

  const totalValue = useMemo(() => {
    return filteredAndSortedLivestock.reduce((sum, item) => sum + (item.price?.amount || 0), 0);
  }, [filteredAndSortedLivestock]);

  // ========== EFFECTS ==========
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryData();
  }, [fetchCategoryData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">{t.loadingData}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] px-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-md">
            <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="font-bold">{t.loadingError}</p>
            <p className="text-sm mt-1">{error || t.categoryNotFound}</p>
            <Link to="/agriculture/livestock" className="mt-4 inline-block text-emerald-600 underline text-sm">
              ← {t.backToSectors}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const comparisonAssets = livestock.filter(a => selectedAssets.includes(a.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-32 px-4 md:px-12 max-w-[1400px] mx-auto">
        
        {/* Breadcrumb & Back */}
        <nav className="mb-8">
          <Link 
            to="/agriculture/livestock" 
            className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t.backToSectors}
          </Link>
        </nav>

        {/* ========== HERO SECTION ========== */}
        <header className="grid lg:grid-cols-12 gap-8 mb-20">
          {/* Left: Title & Description */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${categoryData.bg} ${categoryData.color} mb-6`}
            >
              {categoryData.icon}
              <span className="text-xs font-bold uppercase tracking-wide">{t.investmentSector}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-6"
            >
              {categoryData.title}
              <span className="text-gray-300 block text-3xl md:text-4xl mt-2">{t.investmentHub}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl leading-relaxed"
            >
              {categoryData.description}
            </motion.p>

            {/* Features tags */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {categoryData.features?.slice(0, 5).map((feature, idx) => (
                <span key={idx} className={`text-xs px-3 py-1.5 rounded-full ${categoryData.badgeColor}`}>
                  {feature}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Stats Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`lg:col-span-5 ${categoryData.bgDark} rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                  <TrendingUp size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-white/50">{t.marketStatus}</span>
              </div>
              
              <p className="text-3xl font-bold mb-1">{categoryData.marketDemand}</p>
              <p className="text-xs text-white/40 mb-6">{t.yearOverYear}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] uppercase text-white/40">{t.availableAssets}</p>
                  <p className="text-2xl font-bold">{filteredAndSortedLivestock.length}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40">{t.avgRoi}</p>
                  <p className="text-2xl font-bold text-amber-400">+{avgRoi}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40">{t.totalValue}</p>
                  <p className="text-sm font-bold">{(totalValue / 1000000).toFixed(0)}M FCFA</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40">{t.minInvestment}</p>
                  <p className="text-sm font-bold">{categoryData.investData?.minInvestment || t.contactUs}</p>
                </div>
              </div>

              <button
                onClick={() => setShowCalculator(true)}
                className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all bg-white/10 hover:bg-white/20`}
              >
                <Calculator size={16} />
                {t.calculateMyRoi}
              </button>
            </div>
            
            <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
              {React.cloneElement(categoryData.icon, { size: 180 })}
            </div>
          </motion.div>
        </header>

        {/* ========== WHY INVEST SECTION ========== */}
        {categoryData.investData && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex gap-3">
                <div className={`p-3 rounded-xl ${categoryData.light} ${categoryData.color} h-fit`}>
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{t.whyInvest}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{categoryData.investData.why}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className={`p-3 rounded-xl ${categoryData.light} ${categoryData.color} h-fit`}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{t.roiExplanation}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{categoryData.investData.roiExplanation}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className={`p-3 rounded-xl ${categoryData.light} ${categoryData.color} h-fit`}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{t.taxAdvantage}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{categoryData.investData.taxAdvantage}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className={`p-3 rounded-xl ${categoryData.light} ${categoryData.color} h-fit`}>
                  <TrendingDown size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{t.keyRisks}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{categoryData.investData.risks}</p>
                </div>
              </div>
            </div>

            {/* Market Drivers */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-gray-400" />
                <span className="text-xs font-bold uppercase text-gray-400">{t.marketDrivers}</span>
                {categoryData.investData.marketDrivers?.map((driver, idx) => (
                  <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {driver}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-amber-500" />
                <span className="text-xs font-bold">{t.roiRange}: {categoryData.investData.roiRange}</span>
              </div>
            </div>
          </motion.section>
        )}

        {/* ========== COMPARE BAR ========== */}
        {selectedAssets.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-6"
          >
            <span className="text-white text-sm">
              {selectedAssets.length} {selectedAssets.length > 1 ? t.assetsSelected : t.assetSelected}
            </span>
            <button
              onClick={() => setSelectedAssets([])}
              className="text-gray-400 hover:text-white text-sm"
            >
              {t.clearAll}
            </button>
            {selectedAssets.length >= 2 && (
              <button
                onClick={handleCompare}
                className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${categoryData.buttonColor}`}
              >
                {t.compare} ({selectedAssets.length})
              </button>
            )}
          </motion.div>
        )}

        {/* ========== FILTERS SECTION ========== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-4 border-b border-gray-200"
        >
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'roi', label: t.sortByRoi, icon: <TrendingUp size={12} /> },
              { id: 'price', label: t.sortByPrice, icon: <DollarSign size={12} /> },
              { id: 'capacity', label: t.sortByCapacity, icon: <Users size={12} /> }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                  sortBy === opt.id 
                    ? `${categoryData.buttonColor} text-white` 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}
              >
                <Grid3x3 size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}
              >
                <List size={18} />
              </button>
            </div>
            
            <select 
              value={filterRoi} 
              onChange={(e) => setFilterRoi(e.target.value)} 
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 cursor-pointer"
            >
              <option value="all">{t.allRoiLevels}</option>
              <option value="0-15">{t.low}</option>
              <option value="15-25">{t.medium}</option>
              <option value="25-100">{t.high}</option>
            </select>
          </div>
        </motion.div>

        {/* ========== ASSETS GRID ========== */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }
          >
            {filteredAndSortedLivestock.map((asset) => (
              <motion.div
                key={asset.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCard(asset.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`group cursor-pointer bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 ${
                  viewMode === 'list' ? 'flex' : ''
                } ${selectedAssets.includes(asset.id) ? 'ring-2 ring-emerald-500 shadow-lg' : ''}`}
                onClick={() => navigate(`/agriculture/livestock/${category}/${asset.id}`)}
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-80 h-48 flex-shrink-0' : 'h-64'}`}>
                  <img 
                    src={asset.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'} 
                    alt={asset.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                      <span className="text-[9px] font-bold text-gray-900 uppercase">#{asset.id?.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <div className={`absolute top-4 right-4 ${categoryData.badgeColor} px-3 py-1 rounded-full`}>
                    <span className="text-[10px] font-bold">+{asset.roi || 0}% ROI</span>
                  </div>

                  {/* Select checkbox for comparison */}
                  <div 
                    className="absolute bottom-4 left-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAsset(asset.id);
                    }}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedAssets.includes(asset.id) 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'bg-white/80 border-white'
                    }`}>
                      {selectedAssets.includes(asset.id) && <CheckCircle size={14} className="text-white" />}
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white text-[10px] font-bold uppercase">
                    <MapPin size={10} className="text-amber-400" />
                    {asset.location}, {asset.region}
                  </div>
                </div>

                {/* Content Section */}
                <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {asset.title}
                  </h3>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-5 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">{t.unitValue}</p>
                      <p className="text-base font-bold text-gray-900">
                        {(asset.price?.amount / 1000000).toFixed(1)}M <span className="text-[8px] text-gray-400">FCFA</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">{t.capacity}</p>
                      <p className="text-base font-bold text-gray-900">
                        {asset.capacity?.value || 0} <span className="text-[8px] text-gray-400">{asset.capacity?.unit || 'heads'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">{t.cycle}</p>
                      <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-gray-400" />
                        <p className="text-xs font-bold text-gray-900">{asset.cycleDuration || '12 months'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Features indicators */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {asset.features?.hasWaterSupply && (
                      <div className="flex items-center gap-1 text-[9px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        <Droplets size={8} /> {t.water}
                      </div>
                    )}
                    {asset.features?.hasElectricity && (
                      <div className="flex items-center gap-1 text-[9px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        <Zap size={8} /> {t.power}
                      </div>
                    )}
                    {asset.features?.hasVeterinaryAccess && (
                      <div className="flex items-center gap-1 text-[9px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        <ShieldCheck size={8} /> {t.vet}
                      </div>
                    )}
                    {asset.features?.hasFeedStorage && (
                      <div className="flex items-center gap-1 text-[9px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        <Database size={8} /> {t.feedStorage}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
                        <Heart size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
                        <Share2 size={14} />
                      </div>
                    </div>
                    <button 
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wide text-white transition-all ${categoryData.buttonColor}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/agriculture/livestock/${category}/${asset.id}`);
                      }}
                    >
                      {t.viewDetails} <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Hover ROI indicator */}
                <AnimatePresence>
                  {hoveredCard === asset.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute bottom-20 right-6 ${categoryData.badgeColor} px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold`}
                    >
                      {t.projectedWithReinvestment}: +{((asset.roi || 0) * 1.15).toFixed(0)}%
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredAndSortedLivestock.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Info className="text-gray-400" size={40} />
            </div>
            <p className="text-2xl font-serif text-gray-400 italic mb-4">
              {t.noAssetsAvailable}
            </p>
            <Link to="/agriculture/livestock" className="text-emerald-600 text-sm font-bold underline hover:text-emerald-800">
              {t.exploreOtherSectors} →
            </Link>
          </motion.div>
        )}
      </main>

      {/* ========== COMPARISON MODAL ========== */}
      <AnimatePresence>
        {showCompare && comparisonAssets.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCompare(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-serif">{t.compareAssets}</h2>
                <button onClick={() => setShowCompare(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comparisonAssets.map(asset => (
                    <div key={asset.id} className="border border-gray-200 rounded-2xl p-5">
                      <img 
                        src={asset.image} 
                        alt={asset.title}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                      <h3 className="font-bold text-gray-900 mb-3">{asset.title}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">ROI</span>
                          <span className="font-bold text-emerald-600">+{asset.roi}%</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">{t.unitValue}</span>
                          <span className="font-bold">{(asset.price?.amount / 1000000).toFixed(1)}M FCFA</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">{t.capacity}</span>
                          <span className="font-bold">{asset.capacity?.value} {asset.capacity?.unit}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">{t.cycle}</span>
                          <span className="font-bold">{asset.cycleDuration}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">{t.location}</span>
                          <span className="font-bold text-sm">{asset.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== ROI CALCULATOR MODAL ========== */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCalculator(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif">{t.roiCalculator}</h2>
                  <button onClick={() => setShowCalculator(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.investmentAmount}</label>
                    <input
                      type="number"
                      value={calculatorInput.amount}
                      onChange={(e) => setCalculatorInput({...calculatorInput, amount: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="e.g., 5000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.investmentPeriod}</label>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={calculatorInput.months}
                      onChange={(e) => setCalculatorInput({...calculatorInput, months: Number(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>1 mo</span>
                      <span className="font-bold">{calculatorInput.months} months</span>
                      <span>60 mo (5 yrs)</span>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl ${categoryData.light} ${categoryData.color} text-center`}>
                    <p className="text-sm font-medium opacity-80 mb-2">{t.projectedReturn}</p>
                    <p className="text-3xl font-bold">
                      {(() => {
                        const avgReturn = calculateROI(calculatorInput.amount, calculatorInput.months, parseFloat(avgRoi));
                        return `${(avgReturn / 1000000).toFixed(2)}M FCFA`;
                      })()}
                    </p>
                    <p className="text-xs mt-2 opacity-70">
                      {t.basedOnAvgRoi}
                    </p>
                  </div>

                  <p className="text-[10px] text-gray-400 text-center">
                    {t.disclaimer}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default LivestockCategoryPage;