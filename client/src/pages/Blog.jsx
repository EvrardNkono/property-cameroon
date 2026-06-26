// frontend/src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
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

const Blog = () => {
  const currentLang = useCurrentLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
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
      estimatedRoi: "ROI Annuel Estimé",
      potentialRoi: "ROI Potentiel",
      theJournal: "Le Journal",
      insightsExpertise: "Perspectives & Expertise",
      all: "Tous",
      realEstate: "Immobilier",
      agriculture: "Agriculture",
      sourcing: "Approvisionnement",
      lifestyle: "Mode de Vie",
      by: "Par",
      readyToInvest: "Prêt à Investir Intelligemment ?",
      talkToExpert: "Parler à un Expert",
      viewOpportunities: "Voir les Opportunités",
      readMore: "Lire la suite",
      noPosts: "Aucun article pour le moment",
      loading: "Chargement...",
      featured: "À la Une",
      performance: "Performance",
      gain: "Gain de valeur par m²",
      grossProfit: "Bénéfice brut",
      successFactors: "Pourquoi un tel succès ?",
      successDescription: "Cette appréciation de 266 % en un semestre n'est pas le fruit du hasard. Elle résulte de notre expertise dans le choix des emplacements, l'anticipation du développement urbain et la mise en valeur méthodique de nos parcelles.",
      investAdvice: "Investir dans la terre reste l'un des moyens les plus sûrs et les plus lucratifs pour bâtir un patrimoine solide au Cameroun. Vous souhaitez profiter des prochaines opportunités avant que le marché ne sature ?",
      contactUs: "Contactez Property Cameroun dès aujourd'hui pour découvrir nos prochains projets.",
      // Nouveaux labels pour les stats
      acquisitionPrice: "Prix d'acquisition (Janvier)",
      currentMarketPrice: "Prix actuel du marché (Juillet)",
      valueGain: "Gain de valeur",
      percentageGain: "Bénéfice brut",
      // Labels pour les champs
      readFullArticle: "Lire l'article complet"
    },
    en: {
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
      estimatedRoi: "Estimated Annual ROI",
      potentialRoi: "Potential ROI",
      theJournal: "The Journal",
      insightsExpertise: "Insights & Expertise",
      all: "All",
      realEstate: "Real Estate",
      agriculture: "Agriculture",
      sourcing: "Sourcing",
      lifestyle: "Lifestyle",
      by: "By",
      readyToInvest: "Ready to Invest Smartly?",
      talkToExpert: "Talk to an Expert",
      viewOpportunities: "View Opportunities",
      readMore: "Read more",
      noPosts: "No posts yet",
      loading: "Loading...",
      featured: "Featured",
      performance: "Performance",
      gain: "Gain per m²",
      grossProfit: "Gross Profit",
      successFactors: "Why such success?",
      successDescription: "This 266% appreciation in six months is no coincidence. It results from our expertise in location selection, urban development anticipation, and methodical land development.",
      investAdvice: "Investing in land remains one of the safest and most lucrative ways to build solid wealth in Cameroon. Want to seize upcoming opportunities before the market saturates?",
      contactUs: "Contact Property Cameroun today to discover our next projects.",
      // New labels for stats
      acquisitionPrice: "Acquisition Price (January)",
      currentMarketPrice: "Current Market Price (July)",
      valueGain: "Value Gain",
      percentageGain: "Gross Profit",
      // Labels for fields
      readFullArticle: "Read Full Article"
    }
  }[currentLang] || {
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
    estimatedRoi: "ROI Annuel Estimé",
    potentialRoi: "ROI Potentiel",
    theJournal: "Le Journal",
    insightsExpertise: "Perspectives & Expertise",
    all: "Tous",
    realEstate: "Immobilier",
    agriculture: "Agriculture",
    sourcing: "Approvisionnement",
    lifestyle: "Mode de Vie",
    by: "Par",
    readyToInvest: "Prêt à Investir Intelligemment ?",
    talkToExpert: "Parler à un Expert",
    viewOpportunities: "Voir les Opportunités",
    readMore: "Lire la suite",
    noPosts: "Aucun article pour le moment",
    loading: "Chargement...",
    featured: "À la Une",
    performance: "Performance",
    gain: "Gain de valeur par m²",
    grossProfit: "Bénéfice brut",
    successFactors: "Pourquoi un tel succès ?",
    successDescription: "Cette appréciation de 266 % en un semestre n'est pas le fruit du hasard. Elle résulte de notre expertise dans le choix des emplacements, l'anticipation du développement urbain et la mise en valeur méthodique de nos parcelles.",
    investAdvice: "Investir dans la terre reste l'un des moyens les plus sûrs et les plus lucratifs pour bâtir un patrimoine solide au Cameroun. Vous souhaitez profiter des prochaines opportunités avant que le marché ne sature ?",
    contactUs: "Contactez Property Cameroun dès aujourd'hui pour découvrir nos prochains projets.",
    acquisitionPrice: "Prix d'acquisition (Janvier)",
    currentMarketPrice: "Prix actuel du marché (Juillet)",
    valueGain: "Gain de valeur",
    percentageGain: "Bénéfice brut",
    readFullArticle: "Lire l'article complet"
  };

  // ========== ARTICLE EN DUR - INVESTISSEMENT IMMOBILIER +266% ==========
  const hardcodedArticle = {
    id: 'featured-performance',
    category: 'Real Estate',
    title: "Investissement Immobilier : Une Plus-Value Exceptionnelle de +266% en 6 Mois !",
    excerpt: "Le marché immobilier camerounais confirme une fois de plus son statut de valeur refuge et de moteur de croissance pour les investisseurs avisés. Chez Property Cameroun, nous venons d'en faire la démonstration concrète sur un projet de lotissement stratégique.",
    image: "/images/propertycameroun.png",
    date: currentLang === 'fr' ? "15 Juillet 2026" : "July 15, 2026",
    author: "Property Cameroun",
    slug: 'performance-immobiliere-266',
    isHardcoded: true,
    // Données de performance
    performanceData: {
      acquisitionPrice: "1 500 FCFA/m²",
      currentPrice: "5 500 FCFA/m²",
      valueGain: "4 000 FCFA/m²",
      percentageGain: "+266,6 %"
    },
    // Contenu complet pour la page de détail
    content: `
      <h2>L'Analyse de la Performance</h2>
      <p>Il y a seulement six mois, en janvier 2026, nous travaillions sur l'aménagement d'une parcelle de 4 hectares. À cette période, le prix du mètre carré était fixé à 1 500 FCFA.</p>
      <p>Aujourd'hui, en juillet 2026, la donne a radicalement changé. Grâce à notre stratégie de développement et à l'attractivité croissante de la zone, le prix du mètre carré se négocie désormais entre 5 000 FCFA et 6 000 FCFA.</p>
      
      <h3>Le Bilan Chiffré</h3>
      <p>Si l'on prend la moyenne de notre nouvelle valeur de marché (5 500 FCFA/m²), voici l'évolution de la rentabilité :</p>
      <ul>
        <li><strong>Prix d'acquisition (Janvier) :</strong> 1 500 FCFA/m²</li>
        <li><strong>Prix actuel du marché (Juillet) :</strong> 5 500 FCFA/m²</li>
        <li><strong>Gain de valeur par m² :</strong> 4 000 FCFA</li>
        <li><strong>Pourcentage de bénéfice brut :</strong> +266,6 %</li>
      </ul>
      
      <h3>Pourquoi un tel succès ?</h3>
      <p>Cette appréciation de 266 % en un semestre n'est pas le fruit du hasard. Elle résulte de notre expertise dans le choix des emplacements, l'anticipation du développement urbain et la mise en valeur méthodique de nos parcelles.</p>
      <p>Investir dans la terre reste l'un des moyens les plus sûrs et les plus lucratifs pour bâtir un patrimoine solide au Cameroun. Vous souhaitez profiter des prochaines opportunités avant que le marché ne sature ?</p>
      <p><strong>Contactez Property Cameroun dès aujourd'hui pour découvrir nos prochains projets.</strong></p>
    `
  };

  // Données par défaut (fallback si pas de données backend)
  const defaultPosts = {
    fr: [
      {
        id: 2,
        category: 'Agriculture',
        title: "L'essor de l'Élevage Porcin : Pourquoi Investir Maintenant",
        excerpt: "Une analyse approfondie du marché local et des opportunités de rentabilité pour la saison à venir...",
        image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80",
        date: "10 Avril 2026",
        author: "Expert Agro"
      },
      {
        id: 3,
        category: 'Sourcing',
        title: "Importer des Machines Chinoises : Évitez ces 5 Erreurs Courantes",
        excerpt: "Comment vérifier la fiabilité des fournisseurs et assurer le contrôle qualité avant l'expédition...",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
        date: "08 Avril 2026",
        author: "Équipe Sourcing"
      },
      {
        id: 4,
        category: 'Lifestyle',
        title: "Vivre au Cameroun : Guide de l'Expatrié",
        excerpt: "Découvrez les meilleurs quartiers, les écoles internationales et les opportunités de carrière...",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
        date: "05 Avril 2026",
        author: "Admin"
      }
    ],
    en: [
      {
        id: 2,
        category: 'Agriculture',
        title: "The Rise of Pig Farming: Why You Should Invest Now",
        excerpt: "A deep dive into the local market analysis and profitability opportunities for the upcoming season...",
        image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80",
        date: "April 10, 2026",
        author: "Agro Expert"
      },
      {
        id: 3,
        category: 'Sourcing',
        title: "Importing Chinese Machinery: Avoid These 5 Common Mistakes",
        excerpt: "How to verify supplier reliability and ensure quality control before shipment...",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
        date: "April 08, 2026",
        author: "Sourcing Team"
      },
      {
        id: 4,
        category: 'Lifestyle',
        title: "Living in Cameroon: Expat Guide",
        excerpt: "Discover the best neighborhoods, international schools, and career opportunities...",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
        date: "April 05, 2026",
        author: "Admin"
      }
    ]
  };

  const defaultOpportunities = {
    fr: [
      {
        id: 1,
        title: "Terrain Agricole Sécurisé - 5 Hectares",
        location: "Centre Cameroun",
        roi: "12% ROI Annuel Estimé"
      },
      {
        id: 2,
        title: "Projet d'Élevage Porcin Clé en Main",
        location: "Ouest Cameroun",
        roi: "18% ROI Potentiel"
      }
    ],
    en: [
      {
        id: 1,
        title: "Secured Agricultural Land - 5 Hectares",
        location: "Central Cameroon",
        roi: "12% Estimated Annual ROI"
      },
      {
        id: 2,
        title: "Turnkey Pig Farming Project",
        location: "West Cameroon",
        roi: "18% Potential ROI"
      }
    ]
  };

  // Charger les articles depuis l'API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/blog?lang=${currentLang}`);
        let apiPosts = [];
        if (response.data && response.data.success && response.data.data.length > 0) {
          apiPosts = response.data.data;
        } else {
          apiPosts = defaultPosts[currentLang] || defaultPosts.fr;
        }
        // Ajouter l'article en dur en première position
        setPosts([hardcodedArticle, ...apiPosts]);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        setPosts([hardcodedArticle, ...(defaultPosts[currentLang] || defaultPosts.fr)]);
      } finally {
        setLoading(false);
      }
    };

    // Charger les opportunités
    const fetchOpportunities = async () => {
      try {
        const response = await api.get('/opportunities?lang=' + currentLang);
        if (response.data && response.data.success && response.data.data.length > 0) {
          setOpportunities(response.data.data);
        } else {
          setOpportunities(defaultOpportunities[currentLang] || defaultOpportunities.fr);
        }
      } catch (error) {
        setOpportunities(defaultOpportunities[currentLang] || defaultOpportunities.fr);
      }
    };

    // Charger les articles à la une
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/blog/featured?lang=' + currentLang);
        if (response.data && response.data.success && response.data.data.length > 0) {
          setFeaturedPosts(response.data.data);
        }
      } catch (error) {
        console.error('Erreur chargement featured:', error);
      }
    };

    fetchPosts();
    fetchOpportunities();
    fetchFeatured();
  }, [currentLang]);

  // Catégories avec traduction
  const categories = [
    { id: 'all', label: t.all },
    { id: 'Real Estate', label: t.realEstate },
    { id: 'Agriculture', label: t.agriculture },
    { id: 'Sourcing', label: t.sourcing },
    { id: 'Lifestyle', label: t.lifestyle }
  ];

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  // Si loading, afficher un spinner
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

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-[80vh] flex items-center justify-center text-center pt-20">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
          className="absolute w-full h-full object-cover"
          alt="Cameroon Landscape"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white px-6">
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6">
            {t.heroTitle} <br /> {t.heroTitleLine2}
          </h1>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            {t.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/real-estate">
              <button className="bg-pc-gold px-6 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-900 hover:bg-pc-gold/90 transition-all">
                {t.exploreNow}
              </button>
            </Link>
            <Link to="/diaspora">
              <button className="border border-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                {t.diasporaPortal}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* CAPEF PARTNERSHIP SECTION */}
        <div className="bg-white border border-slate-100 p-10 mb-20 shadow-sm">
          <h2 className="text-3xl font-serif italic mb-4">
            {t.strategicPartnership}
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {t.capefDescription}
          </p>
          <Link to="/agriculture/institutional-framework">
            <button className="bg-pc-green text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-pc-green/90 transition-all">
              {t.learnMore}
            </button>
          </Link>
        </div>

        {/* DIASPORA SECTION */}
        <div className="bg-slate-900 text-white p-16 mb-20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-serif italic mb-6">
              {t.investFromAbroad}
            </h2>
            <p className="text-slate-300 max-w-2xl leading-relaxed">
              {t.diasporaDescription}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pc-gold opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* OPPORTUNITIES SECTION */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-serif italic">{t.currentOpportunities}</h2>
            <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {opportunities.map((op) => (
              <div key={op.id} className="border border-slate-100 p-8 group hover:border-pc-gold transition-colors duration-500">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-pc-gold transition-colors">{op.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{op.location}</p>
                <div className="flex justify-between items-center">
                    <p className="text-pc-green font-bold tracking-tighter">{op.roi}</p>
                    <Link to="/real-estate" className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                      {t.details}
                    </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOG HEADER */}
        <div className="mb-16">
          <p className="text-pc-gold text-[10px] uppercase font-bold tracking-[0.4em] mb-4">{t.theJournal}</p>
          <h2 className="text-4xl font-serif italic">{t.insightsExpertise}</h2>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex gap-4 mb-12 flex-wrap border-b border-slate-50 pb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white rounded-full'
                  : 'text-slate-400 hover:text-pc-gold'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* POSTS GRID - Avec article en dur en première position */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPosts.map((post, index) => {
              const isFeatured = post.isHardcoded || index === 0;
              return (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug || post.id}`} 
                  className={`group ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <div className={`aspect-video overflow-hidden mb-6 bg-slate-100 ${isFeatured ? 'h-96' : ''}`}>
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
                    <span className="inline-block bg-pc-gold text-slate-900 text-[8px] font-black uppercase tracking-widest px-3 py-1 mb-3">
                      {t.featured}
                    </span>
                  )}
                  
                  <p className="text-[9px] text-pc-gold uppercase font-bold tracking-widest mb-3">{post.category}</p>
                  <h3 className={`font-serif italic text-slate-900 mb-3 group-hover:text-pc-green transition-colors ${isFeatured ? 'text-3xl' : 'text-xl'} line-clamp-2`}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">{post.excerpt}</p>
                  
                  {/* Affichage des stats de performance pour l'article en dur */}
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
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{t.by} {post.author}</span>
                  </div>
                  
                  {isFeatured && (
                    <div className="mt-4">
                      <span className="text-xs font-bold text-pc-gold group-hover:underline">
                        {t.readFullArticle} →
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 italic">{t.noPosts}</p>
          </div>
        )}

        {/* FINAL CTA */}
        <div className="mt-32 bg-slate-50 p-16 text-center border border-slate-100">
          <h2 className="text-3xl font-serif italic mb-6">
            {t.readyToInvest}
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/book-appointment">
              <button className="bg-slate-900 text-white px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-pc-green transition-all">
                {t.talkToExpert}
              </button>
            </Link>
            <Link to="/real-estate">
              <button className="border border-slate-900 text-slate-900 px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                {t.viewOpportunities}
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Blog;