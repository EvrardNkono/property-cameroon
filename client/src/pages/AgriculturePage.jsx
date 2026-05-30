// frontend/src/pages/AgriculturePage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { 
  Loader2, TrendingUp, Shield, Globe, Zap, Leaf, DollarSign, 
  MapPin, ArrowRight, Factory, Droplets, Sprout, Tractor, 
  Package, Truck, Users, Award, Clock, Star, ChevronRight, Flame,
  CheckCircle, Building2, Heart, Target, BarChart3, Phone, FileText
} from 'lucide-react';

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

// Données des produits agricoles avec traductions
const getAgriculturalProducts = (t) => [
  { 
    id: 'cocoa', 
    name: { fr: 'Cacao', en: 'Cocoa' }, 
    icon: '/images/propertycacao.jfif', 
    description: { fr: 'Export premium', en: 'Premium bean export' }, 
    marketPrice: '$2,850/Ton',
    globalDemand: '+12% YoY',
    return: '18-22%',
    color: '#8B4513'
  },
  { 
    id: 'coffee', 
    name: { fr: 'Café', en: 'Coffee' }, 
    icon: '/images/propertyananas.jpg', 
    description: { fr: 'Volcanique haute altitude', en: 'High altitude volcanic' }, 
    marketPrice: '$4,200/Ton',
    globalDemand: '+8% YoY',
    return: '15-18%', 
    color: '#6F4E37'
  },
  { 
    id: 'palm', 
    name: { fr: 'Huile de Palme', en: 'Palm Oil' }, 
    icon: '/images/propertyhuile.jfif', 
    description: { fr: 'Production industrielle', en: 'Industrial production' }, 
    marketPrice: '$1,150/Ton',
    globalDemand: '+15% YoY',
    return: '20-25%', 
    color: '#DAA520'
  },
  { 
    id: 'banana', 
    name: { fr: 'Banane', en: 'Banana' }, 
    icon: '/images/propertybananes.jpg', 
    description: { fr: 'Agriculture biologique', en: 'Organic farming' }, 
    marketPrice: '$650/Ton',
    globalDemand: '+6% YoY',
    return: '16-20%', 
    color: '#FFD700'
  }
];

// Données des projets d'investissement avec traductions
const getInvestmentProjects = (t) => [
  {
    id: "PROJ-001",
    title: { fr: "Unité de Transformation de Cacao - Mbalmayo", en: "Cocoa Processing Unit - Mbalmayo" },
    category: { fr: "Usine de Transformation", en: "Processing Plant" },
    shortDesc: { fr: "Transformez le cacao brut en produits chocolatés premium", en: "Transform raw cocoa into premium chocolate products" },
    description: { fr: "Installation de transformation de cacao à la pointe de la technologie. Transformez les fèves brutes en beurre de cacao, poudre et chocolat fini. Export direct vers les marchés UE/US.", en: "State-of-the-art cocoa processing facility. Convert raw beans into cocoa butter, powder, and finished chocolate. Direct export to EU/US markets." },
    image: "/images/dryingunit.jfif",
    investment: "$2,500,000",
    minTicket: "$50,000",
    expectedROI: "32-38%",
    timeline: { fr: "18 mois", en: "18 months" },
    jobsCreated: "150+",
    status: { fr: "Levée de fonds", en: "Funding Round A" },
    matchScore: 96,
    impact: "High",
    partner: "European Chocolate Association",
    benefits: [
      { fr: "Marge de 80% vs export brut", en: "80% margin vs raw export" },
      { fr: "Accès UE sans droits de douane", en: "EU tariff-free access" },
      { fr: "Contrats d'achat sécurisés", en: "Offtake agreements secured" },
      { fr: "Centre de formation inclus", en: "Training center included" }
    ],
    crop: 'cocoa',
    location: { fr: "Région du Centre", en: "Center Region" }
  },
  {
    id: "PROJ-002",
    title: { fr: "Complexe Industriel d'Huile de Palme - Kribi", en: "Palm Oil Mill Complex - Kribi" },
    category: { fr: "Usine Industrielle", en: "Industrial Mill" },
    shortDesc: { fr: "Extraction et raffinage intégré d'huile de palme", en: "Integrated palm oil extraction & refining" },
    description: { fr: "Usine complète d'huile de palme avec capacité de traitement de 30T/heure. Comprend raffinerie, usine de fractionnement et unité biodiesel. Situé près du port en eau profonde.", en: "Complete palm oil mill with FFB processing capacity of 30T/hour. Includes refinery, fractionation plant, and biodiesel unit. Located near deep-sea port." },
    image: "/images/compactoil.jfif",
    investment: "$8,500,000",
    minTicket: "$100,000",
    expectedROI: "28-35%",
    timeline: { fr: "24 mois", en: "24 months" },
    jobsCreated: "350+",
    status: { fr: "Pré-construction", en: "Pre-Construction" },
    matchScore: 94,
    impact: "Very High",
    partner: "Malaysian Palm Oil Council",
    benefits: [
      { fr: "Accès port pour export", en: "Port access for export" },
      { fr: "Unité valorisation des déchets", en: "Waste-to-energy unit" },
      { fr: "Certification RSPO prête", en: "RSPO certification ready" },
      { fr: "Plantation captive 5000Ha", en: "Captive plantation 5000Ha" }
    ],
    crop: 'palm',
    location: { fr: "Région du Sud", en: "South Region" }
  },
  {
    id: "PROJ-003",
    title: { fr: "Infrastructure d'Irrigation Intelligente - Nord", en: "Smart Irrigation Infrastructure - North Region" },
    category: { fr: "Gestion de l'Eau", en: "Water Management" },
    shortDesc: { fr: "Irrigation solaire pour 2000+ agriculteurs", en: "Solar-powered irrigation for 2000+ farmers" },
    description: { fr: "Projet d'irrigation goutte-à-goutte à grande échelle couvrant 5000Ha. Pompes solaires, réservoirs de stockage et réseau de distribution. Transformez les terres arides en zone de production toute l'année.", en: "Large-scale drip irrigation project covering 5000Ha. Solar-powered pumps, storage reservoirs, and distribution network. Transform arid land into year-round production zone." },
    image: "/images/globalirigationkit.jfif",
    investment: "$4,200,000",
    minTicket: "$25,000",
    expectedROI: "22-26%",
    timeline: { fr: "12 mois", en: "12 months" },
    jobsCreated: "500+",
    status: { fr: "Phase initiale", en: "Early Stage" },
    matchScore: 92,
    impact: "Very High",
    partner: "World Food Programme",
    benefits: [
      { fr: "3 récoltes/an", en: "Water 3 harvests/year" },
      { fr: "Crédits carbone éligibles", en: "Carbon credits eligible" },
      { fr: "Inclusion des petits exploitants", en: "Smallholder inclusion" },
      { fr: "Subvention gouvernementale 30%", en: "Government subsidy 30%" }
    ],
    crop: null,
    location: { fr: "Région du Nord", en: "North Region" }
  },
  {
    id: "PROJ-004",
    title: { fr: "Parc Industriel du Manioc - Ebolowa", en: "Cassava Industrial Park - Ebolowa" },
    category: { fr: "Parc Agro-Industriel", en: "Agro-Industrial Park" },
    shortDesc: { fr: "Hub de production d'éthanol et d'amidon de manioc", en: "Cassava-to-ethanol & starch production hub" },
    description: { fr: "Parc industriel intégré de transformation du manioc. Produisez de l'amidon industriel, du bioéthanol et des aliments pour animaux. Capacité de 200MT/jour. Anchor tenant sécurisé.", en: "Integrated cassava processing industrial park. Produce industrial starch, bio-ethanol, and animal feed. 200MT/day capacity. Anchor tenant secured." },
    image: "/images/propertymaniocs.jfif",
    investment: "$6,800,000",
    minTicket: "$75,000",
    expectedROI: "30-40%",
    timeline: { fr: "20 mois", en: "20 months" },
    jobsCreated: "400+",
    status: { fr: "Due Diligence", en: "Due Diligence" },
    matchScore: 95,
    impact: "Very High",
    partner: "Brewing Industry Association",
    benefits: [
      { fr: "Contrat d'achat d'amidon sécurisé", en: "Offtake for starch secured" },
      { fr: "Crédits d'impôt biocarburants", en: "Biofuel tax credits" },
      { fr: "Schéma d'agriculture contractuelle prêt", en: "Outgrower scheme ready" },
      { fr: "Avantages zone d'export", en: "Export zone benefits" }
    ],
    crop: 'cassava',
    location: { fr: "Région du Sud", en: "South Region" }
  },
  {
    id: "PROJ-005",
    title: { fr: "Réseau de Stations de Lavage de Café", en: "Coffee Washing Station Network" },
    category: { fr: "Infrastructure de Transformation", en: "Processing Infrastructure" },
    shortDesc: { fr: "Réseau de 15 stations de lavage de café", en: "Network of 15 coffee washing stations" },
    description: { fr: "Construire et exploiter 15 stations de lavage de café modernes dans la région de l'Ouest. Produisez du café Arabica entièrement lavé pour les marchés de spécialité. Traçabilité directe de la ferme à la tasse.", en: "Build and operate 15 modern coffee washing stations across West Region. Produce fully washed Arabica for specialty markets. Direct farm-to-cup traceability." },
    image: "/images/apt-douala.jpg",
    investment: "$1,800,000",
    minTicket: "$15,000",
    expectedROI: "25-30%",
    timeline: { fr: "10 mois", en: "10 months" },
    jobsCreated: "200+",
    status: { fr: "Prêt à Financer", en: "Funding Ready" },
    matchScore: 98,
    impact: "High",
    partner: "Specialty Coffee Association",
    benefits: [
      { fr: "Prix premium +40%", en: "Premium prices +40%" },
      { fr: "Modèle de commerce direct", en: "Direct trade model" },
      { fr: "Programme de formation agriculteurs", en: "Farmer training program" },
      { fr: "Traçabilité blockchain", en: "Blockchain traceability" }
    ],
    crop: 'coffee',
    location: { fr: "Région de l'Ouest", en: "West Region" }
  },
  {
    id: "PROJ-006",
    title: { fr: "Installation de Stockage Froid et Séchage d'Oignons", en: "Onion Cold Storage & Drying Facility" },
    category: { fr: "Post-Récolte", en: "Post-Harvest" },
    shortDesc: { fr: "Réduire les pertes post-récolte de 40% à 5%", en: "Reduce post-harvest losses from 40% to 5%" },
    description: { fr: "Installation moderne de stockage frigorifique et de séchage solaire pour oignons. Réduisez les pertes massives après récolte. Permettez un approvisionnement toute l'année sur les marchés d'Afrique centrale.", en: "Modern cold storage and solar drying facility for onions. Reduce massive post-harvest losses. Enable year-round supply to markets across Central Africa." },
    image: "/images/propertyoignons.jfif",
    investment: "$1,200,000",
    minTicket: "$10,000",
    expectedROI: "20-24%",
    timeline: { fr: "8 mois", en: "8 months" },
    jobsCreated: "80+",
    status: { fr: "Phase initiale", en: "Early Stage" },
    matchScore: 90,
    impact: "High",
    partner: "IFAD",
    benefits: [
      { fr: "Réduction de 40% des pertes", en: "Reduce 40% waste" },
      { fr: "Stabilité des prix", en: "Price stability" },
      { fr: "Export vers Tchad/RCA", en: "Export to Chad/CAR" },
      { fr: "Opération dirigée par des femmes", en: "Women-led operation" }
    ],
    crop: 'onion',
    location: { fr: "Extrême-Nord", en: "Far North" }
  }
];

// Données des opportunités foncières avec traductions
const getLandOpportunities = (t) => [
  { 
    id: "LAND-001", 
    title: { fr: "Domaine Cacaoyer de Mbalmayo", en: "Mbalmayo Cocoa Estate" }, 
    location: { fr: "Région du Centre", en: "Center Region" }, 
    size: "25 Ha", 
    price: "$12,500", 
    matchScore: 98,
    soilQuality: 85,
    waterAccess: true,
    primaryCrop: 'cocoa',
    image: "/images/propertycacao.jfif",
    description: { fr: "Plantation de cacao premium avec système d'irrigation. Rendement: 1,2T/Ha/an", en: "Premium cocoa plantation with irrigation system. Yield: 1.2T/Ha/year" },
    returnRate: "18-22%",
    minInvestment: "$5,000"
  },
  { 
    id: "LAND-002", 
    title: { fr: "Terres Volcaniques de Foumbot", en: "Foumbot Volcanic Lands" }, 
    location: { fr: "Région de l'Ouest", en: "West Region" }, 
    size: "10 Ha", 
    price: "$35,000", 
    matchScore: 92,
    soilQuality: 94,
    waterAccess: true,
    primaryCrop: 'coffee',
    image: "/images/propertyananas.jpg",
    description: { fr: "Sol volcanique riche pour café Arabica. Certification bio en cours", en: "Rich volcanic soil for Arabica coffee. Bio certification in progress" },
    returnRate: "15-18%",
    minInvestment: "$10,000"
  },
  { 
    id: "LAND-003", 
    title: { fr: "Palmeraie de Kribi", en: "Kribi Palm Plantation" }, 
    location: { fr: "Région du Sud", en: "South Region" }, 
    size: "100 Ha", 
    price: "$150,000", 
    matchScore: 88,
    soilQuality: 75,
    waterAccess: false,
    primaryCrop: 'palm',
    image: "/images/palm-plantation.jpg",
    description: { fr: "Plantation industrielle d'huile de palme près du port de Kribi pour l'export", en: "Industrial palm oil plantation near Kribi port for export" },
    returnRate: "20-25%",
    minInvestment: "$25,000"
  },
  { 
    id: "LAND-004", 
    title: { fr: "Vallée Bananière de Nkongsamba", en: "Nkongsamba Banana Valley" }, 
    location: { fr: "Région du Littoral", en: "Littoral Region" }, 
    size: "15 Ha", 
    price: "$28,000", 
    matchScore: 95,
    soilQuality: 88,
    waterAccess: true,
    primaryCrop: 'banana',
    image: "/images/propertybananes.jpg",
    description: { fr: "Plantation de bananes biologiques. Récolte toute l'année. Label Fair Trade", en: "Organic banana plantation. Year-round harvest. Fair Trade label" },
    returnRate: "16-20%",
    minInvestment: "$8,000"
  }
];

const AgriculturePage = () => {
  const currentLang = useCurrentLang();
  const [activeTab, setActiveTab] = useState('projects');
  const [activeCrop, setActiveCrop] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = {
    fr: {
      // Hero
      badge: "Opportunités Actives",
      title: "Construisez Votre",
      titleSpan: "Empire Agricole",
      subtitle: "Accès direct aux investissements agricoles les plus lucratifs du Cameroun. Du terrain brut aux usines de transformation — nous connectons les capitaux mondiaux avec la croissance africaine.",
      availableCapital: "Capital Disponible",
      activeProjects: "Projets Actifs",
      avgRoi: "ROI Moyen",
      featuredPrices: "Prix des Cultures Vedettes",
      
      // Market Intelligence
      aiTitle: "Correspondance de Cultures par IA",
      aiSubtitle: "Sélectionnez une culture pour voir les opportunités d'investissement correspondantes",
      reset: "Réinitialiser",
      
      // Tabs
      investmentProjects: "Projets d'Investissement",
      landOpportunities: "Opportunités Foncières",
      
      // Project Cards
      investment: "Investissement",
      expectedROI: "ROI Attendu",
      minTicket: "Ticket Min.",
      jobsCreated: "Emplois Créés",
      viewDetails: "Voir les Détails du Projet",
      match: "Correspondance",
      
      // Land Cards
      viewLand: "Voir le Terrain",
      minInvestment: "investissement min.",
      
      // CTA
      ctaTitle: "Prêt à Construire Votre",
      ctaTitleSpan: "Portefeuille Agricole",
      ctaSubtitle: "Rejoignez 150+ investisseurs internationaux qui génèrent déjà 20%+ de rendement moyen dans l'agriculture camerounaise.",
      scheduleCall: "Planifier un Appel Investisseur",
      downloadProspectus: "Télécharger la Brochure",
      
      // Loading
      matching: "Recherche d'opportunités...",
      loadingLand: "Chargement des opportunités foncières...",
      
      // Status
      earlyStage: "Phase initiale",
      preConstruction: "Pré-construction",
      dueDiligence: "Due Diligence",
      fundingReady: "Prêt à Financer",
      fundingRound: "Levée de fonds",
      
      // Impact
      highImpact: "Impact Élevé",
      veryHighImpact: "Impact Très Élevé"
    },
    en: {
      // Hero
      badge: "Active Opportunities",
      title: "Cultivate Your",
      titleSpan: "Agricultural Empire",
      subtitle: "Direct access to Cameroon's most lucrative agricultural investments. From raw land to processing plants — we connect global capital with African growth.",
      availableCapital: "Available Capital",
      activeProjects: "Active Projects",
      avgRoi: "Avg. ROI",
      featuredPrices: "Featured Crop Prices",
      
      // Market Intelligence
      aiTitle: "AI-Powered Crop Matching",
      aiSubtitle: "Select a crop to see matching investment opportunities",
      reset: "Reset",
      
      // Tabs
      investmentProjects: "Investment Projects",
      landOpportunities: "Land Opportunities",
      
      // Project Cards
      investment: "Investment",
      expectedROI: "Expected ROI",
      minTicket: "Min. Ticket",
      jobsCreated: "Jobs Created",
      viewDetails: "View Project Details",
      match: "Match",
      
      // Land Cards
      viewLand: "View Land",
      minInvestment: "min investment",
      
      // CTA
      ctaTitle: "Ready to Build Your",
      ctaTitleSpan: "Agricultural Portfolio",
      ctaSubtitle: "Join 150+ international investors already generating 20%+ average returns in Cameroonian agriculture.",
      scheduleCall: "Schedule Investor Call",
      downloadProspectus: "Download Prospectus",
      
      // Loading
      matching: "Matching opportunities...",
      loadingLand: "Loading land opportunities...",
      
      // Status
      earlyStage: "Early Stage",
      preConstruction: "Pre-Construction",
      dueDiligence: "Due Diligence",
      fundingReady: "Funding Ready",
      fundingRound: "Funding Round",
      
      // Impact
      highImpact: "High Impact",
      veryHighImpact: "Very High Impact"
    }
  }[currentLang] || {
    // Fallback français
    badge: "Opportunités Actives",
    title: "Construisez Votre",
    titleSpan: "Empire Agricole",
    subtitle: "Accès direct aux investissements agricoles les plus lucratifs du Cameroun. Du terrain brut aux usines de transformation — nous connectons les capitaux mondiaux avec la croissance africaine.",
    availableCapital: "Capital Disponible",
    activeProjects: "Projets Actifs",
    avgRoi: "ROI Moyen",
    featuredPrices: "Prix des Cultures Vedettes",
    aiTitle: "Correspondance de Cultures par IA",
    aiSubtitle: "Sélectionnez une culture pour voir les opportunités d'investissement correspondantes",
    reset: "Réinitialiser",
    investmentProjects: "Projets d'Investissement",
    landOpportunities: "Opportunités Foncières",
    investment: "Investissement",
    expectedROI: "ROI Attendu",
    minTicket: "Ticket Min.",
    jobsCreated: "Emplois Créés",
    viewDetails: "Voir les Détails du Projet",
    match: "Correspondance",
    viewLand: "Voir le Terrain",
    minInvestment: "investissement min.",
    ctaTitle: "Prêt à Construire Votre",
    ctaTitleSpan: "Portefeuille Agricole",
    ctaSubtitle: "Rejoignez 150+ investisseurs internationaux qui génèrent déjà 20%+ de rendement moyen dans l'agriculture camerounaise.",
    scheduleCall: "Planifier un Appel Investisseur",
    downloadProspectus: "Télécharger la Brochure",
    matching: "Recherche d'opportunités...",
    loadingLand: "Chargement des opportunités foncières...",
    earlyStage: "Phase initiale",
    preConstruction: "Pré-construction",
    dueDiligence: "Due Diligence",
    fundingReady: "Prêt à Financer",
    fundingRound: "Levée de fonds",
    highImpact: "Impact Élevé",
    veryHighImpact: "Impact Très Élevé"
  };

  const agriculturalProducts = getAgriculturalProducts(t);
  const investmentProjects = getInvestmentProjects(t);
  const landOpportunities = getLandOpportunities(t);

  const getTranslatedValue = (value, lang) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value[lang]) return value[lang];
    if (typeof value === 'object' && value.fr) return value.fr;
    return String(value);
  };

  useEffect(() => {
    setFilteredProjects(investmentProjects);
    setFilteredLands(landOpportunities);
  }, [investmentProjects, landOpportunities]);

  const handleMatchFound = (crop) => {
    setActiveCrop(crop);
    setLoading(true);
    
    setTimeout(() => {
      if (activeTab === 'projects') {
        const filtered = investmentProjects.filter(project => 
          !project.crop || project.crop === crop.id
        );
        setFilteredProjects(filtered);
      } else {
        const filtered = landOpportunities.filter(land => 
          land.primaryCrop === crop.id
        );
        setFilteredLands(filtered);
      }
      setLoading(false);
    }, 300);
  };

  const handleResetFilters = () => {
    setActiveCrop(null);
    setFilteredProjects(investmentProjects);
    setFilteredLands(landOpportunities);
  };

  const getStatusStyle = (status) => {
    const statusKey = status?.fr || status;
    if (statusKey === 'Funding Round A' || statusKey === 'Levée de fonds') 
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (statusKey === 'Pre-Construction' || statusKey === 'Pré-construction') 
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (statusKey === 'Early Stage' || statusKey === 'Phase initiale') 
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (statusKey === 'Due Diligence') 
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (statusKey === 'Funding Ready' || statusKey === 'Prêt à Financer') 
      return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar />

      {/* 🔥 EPIC HERO SECTION */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/heroagri.webp')] bg-cover bg-center opacity-20 z-0"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500 rounded-full blur-[120px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur rounded-full px-4 py-2 mb-6 border border-emerald-500/20">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">{t.badge}</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6">
                {t.title}<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{t.titleSpan}</span>
              </h1>
              <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg mb-8">
                {t.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 backdrop-blur rounded-2xl px-6 py-3 border border-white/10 hover:border-emerald-500/30 transition-all">
                  <p className="text-emerald-400 text-sm font-bold">{t.availableCapital}</p>
                  <p className="text-2xl font-black text-white">$24.8M+</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl px-6 py-3 border border-white/10 hover:border-emerald-500/30 transition-all">
                  <p className="text-emerald-400 text-sm font-bold">{t.activeProjects}</p>
                  <p className="text-2xl font-black text-white">{investmentProjects.length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl px-6 py-3 border border-white/10 hover:border-emerald-500/30 transition-all">
                  <p className="text-emerald-400 text-sm font-bold">{t.avgRoi}</p>
                  <p className="text-2xl font-black text-white">27.5%</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-emerald-900/30 to-black border border-emerald-500/20 rounded-3xl p-6 backdrop-blur">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">{t.featuredPrices}</p>
                {agriculturalProducts.slice(0,4).map((product, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0 group hover:bg-white/5 px-3 -mx-3 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition">
                        <Leaf className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-white font-medium">{getTranslatedValue(product.name, currentLang)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{product.marketPrice}</p>
                      <p className="text-emerald-400 text-xs">{product.globalDemand}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 MARKET INTELLIGENCE SECTION */}
      <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-20">
        <div className="bg-gradient-to-r from-emerald-900/20 to-black border border-emerald-500/20 rounded-3xl p-8 backdrop-blur hover:border-emerald-500/40 transition-all">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{t.aiTitle}</h3>
              <p className="text-gray-400">{t.aiSubtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {agriculturalProducts.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => handleMatchFound(crop)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeCrop?.id === crop.id
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50'
                  }`}
                >
                  {getTranslatedValue(crop.name, currentLang)}
                </button>
              ))}
              {activeCrop && (
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 transition-all"
                >
                  {t.reset}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 INVESTMENT TABS: PROJECTS vs LAND */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex gap-4 mb-10 border-b border-white/10">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-6 font-bold text-lg transition-all relative ${
              activeTab === 'projects'
                ? 'text-emerald-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              {t.investmentProjects}
            </div>
            {activeTab === 'projects' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('land')}
            className={`pb-4 px-6 font-bold text-lg transition-all relative ${
              activeTab === 'land'
                ? 'text-emerald-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t.landOpportunities}
            </div>
            {activeTab === 'land' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            )}
          </button>
        </div>

        {/* PROJECTS GRID */}
        {activeTab === 'projects' && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                <p className="text-gray-400">{t.matching}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredProjects.map((project, idx) => (
                  <div key={project.id} className="group relative animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={getTranslatedValue(project.title, currentLang)}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                          {project.matchScore}% {t.match}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <span className="inline-block bg-emerald-500/20 backdrop-blur text-emerald-400 text-xs font-bold px-2 py-1 rounded">
                            {getTranslatedValue(project.category, currentLang)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                          {getTranslatedValue(project.title, currentLang)}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">{getTranslatedValue(project.shortDesc, currentLang)}</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
                            <p className="text-emerald-400 text-xs font-bold">{t.investment}</p>
                            <p className="text-white font-bold text-lg">{project.investment}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
                            <p className="text-emerald-400 text-xs font-bold">{t.expectedROI}</p>
                            <p className="text-white font-bold text-lg">{project.expectedROI}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
                            <p className="text-emerald-400 text-xs font-bold">{t.minTicket}</p>
                            <p className="text-white text-sm">{project.minTicket}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
                            <p className="text-emerald-400 text-xs font-bold">{t.jobsCreated}</p>
                            <p className="text-white text-sm">{project.jobsCreated}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.benefits.slice(0,3).map((benefit, i) => (
                            <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> {getTranslatedValue(benefit, currentLang)}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-full text-[9px] font-bold ${getStatusStyle(project.status)} border`}>
                              {getTranslatedValue(project.status, currentLang)}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <MapPin className="w-3 h-3" />
                              {getTranslatedValue(project.location, currentLang)}
                            </div>
                          </div>
                          <div className="text-emerald-400 text-xs font-bold">
                            {project.impact === 'Very High' ? t.veryHighImpact : t.highImpact}
                          </div>
                        </div>
                        <Link to={`/agriculture/projects/${project.id}?lang=${currentLang}`}>
                          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                            {t.viewDetails} <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* LAND GRID */}
        {activeTab === 'land' && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                <p className="text-gray-400">{t.loadingLand}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredLands.map((land, idx) => (
                  <div key={land.id} className="group relative animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img src={land.image} alt={getTranslatedValue(land.title, currentLang)} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                          {land.matchScore}% {t.match}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <div className="flex gap-2">
                            <span className="text-white text-sm font-bold">{land.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition">
                          {getTranslatedValue(land.title, currentLang)}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {getTranslatedValue(land.location, currentLang)}
                        </p>
                        <p className="text-gray-400 text-sm mb-4">{getTranslatedValue(land.description, currentLang)}</p>
                        <div className="flex gap-2 mb-4">
                          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                            <Sprout className="w-3 h-3 text-emerald-400" />
                            <span className="text-white text-xs">Qualité sol: {land.soilQuality}%</span>
                          </div>
                          {land.waterAccess && (
                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                              <Droplets className="w-3 h-3 text-emerald-400" />
                              <span className="text-white text-xs">Accès eau</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <p className="text-emerald-400 text-xs font-bold">{t.investment}</p>
                            <p className="text-white font-bold text-xl">{land.price}</p>
                            <p className="text-gray-500 text-xs">{t.minInvestment}: {land.minInvestment}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 text-xs font-bold">{t.expectedROI}</p>
                            <p className="text-white font-bold text-xl">{land.returnRate}</p>
                          </div>
                        </div>
                        <Link to={`/agriculture/land/${land.id}?lang=${currentLang}`}>
                          <button className="w-full mt-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-emerald-500 hover:text-black transition-all group">
                            {t.viewLand} <ArrowRight className="w-4 h-4 inline ml-1 group-hover:translate-x-1 transition" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ⚡ CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-emerald-900/20 to-black border-t border-b border-emerald-500/20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.ctaTitle} <span className="text-emerald-400">{t.ctaTitleSpan}</span>?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/book-appointment?lang=${currentLang}`}>
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                <Phone className="w-4 h-4" /> {t.scheduleCall} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </Link>
            <Link to={`/agriculture/prospectus?lang=${currentLang}`}>
              <button className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> {t.downloadProspectus}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AgriculturePage;