// frontend/src/pages/Blog.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, User, Loader2, AlertCircle, BookOpen, Sparkles, ChevronRight,
  ShieldCheck, CheckCircle, X, Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

// ─────────────────────────────────────────────────────────────
// Hook de langue — calcule la valeur dès le premier rendu
// (lazy initializer), évite le flash FR→EN et le double fetch
// ─────────────────────────────────────────────────────────────
const useCurrentLang = () => {
  const [lang] = useState(() => {
    if (typeof window === 'undefined') return 'fr';
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    return ['fr', 'en'].includes(finalLang) ? finalLang : 'fr';
  });
  return lang;
};

const Blog = () => {
  const currentLang = useCurrentLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // ========== TRADUCTIONS UI (textes fixes de l'interface) ==========
  const t = {
    fr: {
      heroBadge: "Le Journal",
      heroTitle: "Investissez au Cameroun",
      heroTitleLine2: "Sans compromis",
      heroSubtitle: "Immobilier, Agriculture et Approvisionnement international — une approche sécurisée et rentable pour l'investisseur moderne.",
      exploreNow: "Explorer Maintenant",
      diasporaPortal: "Portail Diaspora",
      strategicPartnership: "Partenariat Stratégique avec le CAPEF",
      capefDescription: "Nous travaillons en étroite collaboration avec la Chambre d'Agriculture, des Pêches, de l'Élevage et des Forêts (CAPEF) pour garantir des investissements agricoles sécurisés et rentables, gérés par des experts locaux certifiés.",
      learnMore: "En Savoir Plus",
      investFromAbroad: "Investissez depuis l'Étranger en Toute Confiance",
      diasporaDescription: "Nous gérons, sécurisons et développons vos investissements au Cameroun. En exploitant notre expertise locale : vous investissez, nous exécutons.",
      currentOpportunities: "Opportunités Actuelles",
      details: "Détails →",
      theJournal: "Le Journal",
      insightsExpertise: "Perspectives & Expertise",
      all: "Tous",
      realEstate: "Immobilier",
      agriculture: "Agriculture",
      sourcing: "Approvisionnement",
      lifestyle: "Mode de Vie",
      by: "Par",
      noPosts: "Aucun article pour le moment",
      loading: "Chargement...",
      featured: "À la Une",
      readFullArticle: "Lire l'article complet",
      acquisitionPrice: "Prix d'acquisition",
      currentMarketPrice: "Prix actuel du marché",
      valueGain: "Gain de valeur",
      percentageGain: "Bénéfice brut",
      newsletterDesc: "Recevez nos derniers articles et opportunités d'investissement",
      emailPlaceholder: "Votre adresse email",
      subscribe: "S'abonner",
      thanksSubscribing: "Merci !",
      checkInbox: "Consultez votre boîte mail.",
      freeGuide: "Guide Gratuit",
      readyToInvest: "Prêt à Investir Intelligemment ?",
      talkToExpert: "Parler à un Expert",
      viewOpportunities: "Voir les Opportunités",
      errorLoading: "Erreur de chargement",
      tryAgain: "Réessayer",
    },
    en: {
      heroBadge: "The Journal",
      heroTitle: "Invest in Cameroon",
      heroTitleLine2: "Without Compromise",
      heroSubtitle: "Real Estate, Agriculture, and International Sourcing — a secure and profitable approach for the modern investor.",
      exploreNow: "Explore Now",
      diasporaPortal: "Diaspora Portal",
      strategicPartnership: "Strategic Partnership with CAPEF",
      capefDescription: "We work closely with the Chamber of Agriculture, Fisheries, Livestock and Forests (CAPEF) to guarantee secured and profitable agricultural investments, managed by certified local experts.",
      learnMore: "Learn More",
      investFromAbroad: "Invest from Abroad with Confidence",
      diasporaDescription: "We manage, secure, and develop your investments in Cameroon. Leveraging our local expertise: you invest, we execute.",
      currentOpportunities: "Current Opportunities",
      details: "Details →",
      theJournal: "The Journal",
      insightsExpertise: "Insights & Expertise",
      all: "All",
      realEstate: "Real Estate",
      agriculture: "Agriculture",
      sourcing: "Sourcing",
      lifestyle: "Lifestyle",
      by: "By",
      noPosts: "No posts yet",
      loading: "Loading...",
      featured: "Featured",
      readFullArticle: "Read Full Article",
      acquisitionPrice: "Acquisition Price",
      currentMarketPrice: "Current Market Price",
      valueGain: "Value Gain",
      percentageGain: "Gross Profit",
      newsletterDesc: "Receive our latest articles and investment opportunities",
      emailPlaceholder: "Your email address",
      subscribe: "Subscribe",
      thanksSubscribing: "Thanks!",
      checkInbox: "Check your inbox.",
      freeGuide: "Free Guide",
      readyToInvest: "Ready to Invest Smartly?",
      talkToExpert: "Talk to an Expert",
      viewOpportunities: "View Opportunities",
      errorLoading: "Loading error",
      tryAgain: "Try Again",
    }
  }[currentLang];

  // ========== DONNÉES EN DUR — SOURCE UNIQUE EN FRANÇAIS ==========
  // Plus besoin de dupliquer manuellement en fr/en : useAutoTranslate
  // appelle le backend (/translate/batch, même logique que blogController.js)
  // et met en cache la traduction en localStorage.
  const hardcodedArticleFr = {
    id: 'featured-performance',
    category: 'Real Estate',
    title: "Investissement Immobilier : Une Plus-Value Exceptionnelle de +266% en 6 Mois !",
    excerpt: "Le marché immobilier camerounais confirme une fois de plus son statut de valeur refuge et de moteur de croissance pour les investisseurs avisés. Chez Property Cameroun, nous venons d'en faire la démonstration concrète sur un projet de lotissement stratégique.",
    image: "/images/propertycameroun.png",
    date: "15 Janvier 2026",
    author: "Property Cameroun",
    slug: 'performance-immobiliere-266',
    isHardcoded: true,
    performanceData: {
      acquisitionPrice: "1 500 FCFA/m²",
      currentPrice: "5 500 FCFA/m²",
      valueGain: "4 000 FCFA/m²",
      percentageGain: "+266,6 %"
    }
  };

  const defaultPostsFr = [
    {
      id: 2, category: 'Agriculture',
      title: "L'essor de l'Élevage Porcin : Pourquoi Investir Maintenant",
      excerpt: "Une analyse approfondie du marché local et des opportunités de rentabilité pour la saison à venir...",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80",
      date: "10 Mars 2026", author: "Expert Agro", slug: 'essor-elevage-porcin'
    },
    {
      id: 3, category: 'Sourcing',
      title: "Importer des Machines Chinoises : Évitez ces 5 Erreurs Courantes",
      excerpt: "Comment vérifier la fiabilité des fournisseurs et assurer le contrôle qualité avant l'expédition...",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
      date: "22 Février 2026", author: "Équipe Sourcing", slug: 'importer-machines-chinoises'
    },
    {
      id: 4, category: 'Real Estate',
      title: "Les Quartiers Émergents de Douala : Où Investir en 2026",
      excerpt: "Découvrez les zones à fort potentiel de croissance immobilière dans la capitale économique du Cameroun.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      date: "5 Mai 2026", author: "Expert Immobilier", slug: 'quartiers-emergents-douala'
    },
    {
      id: 5, category: 'Agriculture',
      title: "La Révolution Agricole au Cameroun : Opportunités pour 2026",
      excerpt: "Comment les nouvelles politiques agricoles ouvrent la voie à des investissements rentables dans le secteur.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
      date: "15 Avril 2026", author: "Agro Expert", slug: 'revolution-agricole-cameroun'
    },
    {
      id: 6, category: 'Lifestyle',
      title: "Vivre à Douala : Guide du Parfait Expatrié Investisseur",
      excerpt: "Conseils pratiques pour s'installer et investir dans la capitale économique camerounaise.",
      image: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80",
      date: "1 Mai 2026", author: "Property Cameroun", slug: 'vivre-douala-guide-expatrie'
    }
  ];

  const defaultOpportunitiesFr = [
    { id: 1, title: "Terrain Agricole Sécurisé - 5 Hectares", location: "Centre Cameroun", roi: "12% ROI Annuel Estimé" },
    { id: 2, title: "Projet d'Élevage Porcin Clé en Main", location: "Ouest Cameroun", roi: "18% ROI Potentiel" },
    { id: 3, title: "Villa de Standing - Bastos", location: "Yaoundé", roi: "15% ROI Annuel" }
  ];

  // ── Traduction auto des données en dur (source = FR) ──
  // On regroupe tous les champs texte à traduire dans un seul tableau,
  // pour ne faire qu'un seul appel /translate/batch.
  const hardcodedTexts = useMemo(() => [
    hardcodedArticleFr.title,
    hardcodedArticleFr.excerpt,
    ...defaultPostsFr.flatMap(p => [p.title, p.excerpt]),
    ...defaultOpportunitiesFr.flatMap(o => [o.title, o.location, o.roi]),
  ], []);

  const translatedTexts = useAutoTranslate(hardcodedTexts, currentLang, 'fr');

  const hardcodedArticle = useMemo(() => ({
    ...hardcodedArticleFr,
    title: translatedTexts[0],
    excerpt: translatedTexts[1],
    date: currentLang === 'en' ? 'January 15, 2026' : hardcodedArticleFr.date,
  }), [translatedTexts, currentLang]);

  const defaultPosts = useMemo(() => {
    let i = 2; // les 2 premiers slots sont pris par hardcodedArticle
    return defaultPostsFr.map((p) => {
      const title = translatedTexts[i++];
      const excerpt = translatedTexts[i++];
      return { ...p, title, excerpt };
    });
  }, [translatedTexts]);

  const defaultOpportunities = useMemo(() => {
    let i = 2 + defaultPostsFr.length * 2;
    return defaultOpportunitiesFr.map((o) => {
      const title = translatedTexts[i++];
      const location = translatedTexts[i++];
      const roi = translatedTexts[i++];
      return { ...o, title, location, roi };
    });
  }, [translatedTexts]);

  const categories = [
    { id: 'all', label: t.all },
    { id: 'Real Estate', label: t.realEstate },
    { id: 'Agriculture', label: t.agriculture },
    { id: 'Sourcing', label: t.sourcing },
    { id: 'Lifestyle', label: t.lifestyle }
  ];

  // Charger les articles
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/blog?lang=${currentLang}`);
        let apiPosts = [];
        if (response && response.success && response.data && response.data.length > 0) {
          apiPosts = response.data;
        } else {
          apiPosts = defaultPosts;
        }
        setPosts([hardcodedArticle, ...apiPosts]);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        setPosts([hardcodedArticle, ...defaultPosts]);
      } finally {
        setLoading(false);
      }
    };

    const fetchOpportunities = async () => {
      try {
        const response = await api.get('/opportunities?lang=' + currentLang);
        if (response && response.success && response.data && response.data.length > 0) {
          setOpportunities(response.data);
        } else {
          setOpportunities(defaultOpportunities);
        }
      } catch (error) {
        setOpportunities(defaultOpportunities);
      }
    };

    fetchPosts();
    fetchOpportunities();

    const timer = setTimeout(() => {
      if (!localStorage.getItem('blogNewsletterShown')) {
        setShowNewsletter(true);
        localStorage.setItem('blogNewsletterShown', 'true');
      }
    }, 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang, hardcodedArticle, defaultPosts, defaultOpportunities]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setTimeout(() => {
      setShowNewsletter(false);
      setEmailSubmitted(false);
    }, 2000);
  };

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-2 border-pc-gold border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-500">{t.loading}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center max-w-md">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="font-bold text-lg mb-2">{t.errorLoading}</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
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
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
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
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">{t.heroBadge}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif italic mb-6"
          >
            {t.heroTitle} <br /> <span className="text-amber-400">{t.heroTitleLine2}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 mb-8 max-w-xl mx-auto"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/real-estate">
              <button className="bg-pc-gold px-6 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-900 hover:bg-pc-gold/90 transition-all rounded-full">
                {t.exploreNow}
              </button>
            </Link>
            <Link to="/diaspora">
              <button className="border border-white/50 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all rounded-full">
                {t.diasporaPortal}
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* CAPEF */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-100 p-10 mb-20 shadow-sm rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={24} className="text-pc-gold" />
            <h2 className="text-3xl font-serif italic">{t.strategicPartnership}</h2>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">{t.capefDescription}</p>
          <Link to="/agriculture/institutional-framework">
            <button className="bg-pc-green text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-pc-green/90 transition-all rounded-full">
              {t.learnMore}
            </button>
          </Link>
        </motion.div>

        {/* DIASPORA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 text-white p-16 mb-20 relative overflow-hidden rounded-3xl"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-serif italic mb-6">{t.investFromAbroad}</h2>
            <p className="text-slate-300 max-w-2xl leading-relaxed">{t.diasporaDescription}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pc-gold opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </motion.div>

        {/* OPPORTUNITIES */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-serif italic">{t.currentOpportunities}</h2>
            <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {opportunities.map((op) => (
              <motion.div 
                key={op.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-slate-100 p-8 group hover:border-pc-gold transition-colors duration-500 rounded-2xl"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-pc-gold transition-colors">{op.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{op.location}</p>
                <div className="flex justify-between items-center">
                  <p className="text-pc-green font-bold tracking-tighter">{op.roi}</p>
                  <Link to="/real-estate" className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                    {t.details}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BLOG HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-pc-gold text-[10px] uppercase font-bold tracking-[0.4em] mb-4">{t.theJournal}</p>
          <h2 className="text-4xl font-serif italic">{t.insightsExpertise}</h2>
        </motion.div>

        {/* CATEGORY FILTER */}
        <div className="flex gap-4 mb-12 flex-wrap border-b border-slate-50 pb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-full ${
                activeCategory === cat.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-pc-gold'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* POSTS GRID */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPosts.map((post, index) => {
              const isFeatured = post.isHardcoded || index === 0;
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <Link to={`/blog/${post.slug || post.id}`} className="block h-full">
                    <div className={`aspect-video overflow-hidden mb-6 bg-slate-100 rounded-2xl ${isFeatured ? 'h-96' : ''}`}>
                      <img 
                        src={post.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={post.title} 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000';
                        }}
                      />
                    </div>
                    
                    {isFeatured && (
                      <span className="inline-block bg-pc-gold text-slate-900 text-[8px] font-black uppercase tracking-widest px-3 py-1 mb-3 rounded-full">
                        {t.featured}
                      </span>
                    )}
                    
                    <p className="text-[9px] text-pc-gold uppercase font-bold tracking-widest mb-3">{post.category}</p>
                    <h3 className={`font-serif italic text-slate-900 mb-3 group-hover:text-pc-green transition-colors ${isFeatured ? 'text-3xl' : 'text-xl'} line-clamp-2`}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">{post.excerpt}</p>
                    
                    {post.isHardcoded && post.performanceData && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50 p-4 rounded-xl">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-bold">{t.acquisitionPrice}</p>
                          <p className="text-sm font-bold text-slate-800">{post.performanceData.acquisitionPrice}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-bold">{t.currentMarketPrice}</p>
                          <p className="text-sm font-bold text-pc-gold">{post.performanceData.currentPrice}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-bold">{t.valueGain}</p>
                          <p className="text-sm font-bold text-emerald-600">{post.performanceData.valueGain}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase font-bold">{t.percentageGain}</p>
                          <p className="text-sm font-bold text-emerald-600">{post.performanceData.percentageGain}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                      <span>•</span>
                      <User size={12} />
                      <span>{t.by} {post.author}</span>
                    </div>
                    
                    {isFeatured && (
                      <div className="mt-4">
                        <span className="text-xs font-bold text-pc-gold group-hover:underline inline-flex items-center gap-1">
                          {t.readFullArticle} <ChevronRight size={14} />
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 italic">{t.noPosts}</p>
          </div>
        )}

        {/* FINAL CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-to-r from-slate-900 to-slate-800 p-16 text-center rounded-3xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/5 rounded-full"
                style={{
                  width: Math.random() * 80 + 20,
                  height: Math.random() * 80 + 20,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10">
            <BookOpen size={48} className="text-pc-gold mx-auto mb-4" />
            <h2 className="text-3xl font-serif mb-6">{t.readyToInvest}</h2>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/book-appointment">
                <button className="bg-pc-gold text-slate-900 px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-pc-gold/90 transition-all rounded-full">
                  {t.talkToExpert}
                </button>
              </Link>
              <Link to="/real-estate">
                <button className="border border-white/30 text-white px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 transition-all rounded-full">
                  {t.viewOpportunities}
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      {/* NEWSLETTER MODAL */}
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
              className="bg-white rounded-3xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {!emailSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pc-gold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Mail size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{t.freeGuide}</h3>
                    <p className="text-gray-500 text-sm">{t.newsletterDesc}</p>
                  </div>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder={t.emailPlaceholder}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pc-gold focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-pc-gold text-slate-900 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      {t.subscribe}
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
    </div>
  );
};

export default Blog;