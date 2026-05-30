import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero
      heroTitle: "Investissez au Cameroun",
      heroTitleLine2: "Sans compromis",
      heroSubtitle: "Immobilier, Agriculture et Approvisionnement international — une approche sécurisée et rentable pour l'investisseur moderne.",
      exploreNow: "Explorer Maintenant",
      diasporaPortal: "Portail Diaspora",
      
      // CAPEF Section
      strategicPartnership: "Partenariat Stratégique avec le CAPEF",
      capefDescription: "Nous travaillons en étroite collaboration avec la Chambre d'Agriculture, des Pêches, de l'Élevage et des Forêts (CAPEF) pour garantir des investissements agricoles sécurisés et rentables, gérés par des experts locaux certifiés.",
      learnMore: "En Savoir Plus",
      
      // Diaspora Section
      investFromAbroad: "Investissez depuis l'Étranger en Toute Confiance",
      diasporaDescription: "Nous gérons, sécurisons et développons vos investissements au Cameroun. En exploitant notre expertise locale : vous investissez, nous exécutons.",
      
      // Opportunities Section
      currentOpportunities: "Opportunités Actuelles",
      details: "Détails →",
      estimatedRoi: "ROI Annuel Estimé",
      potentialRoi: "ROI Potentiel",
      
      // Blog Header
      theJournal: "Le Journal",
      insightsExpertise: "Perspectives & Expertise",
      
      // Categories
      all: "Tous",
      realEstate: "Immobilier",
      agriculture: "Agriculture",
      sourcing: "Approvisionnement",
      lifestyle: "Mode de Vie",
      
      // Post labels
      by: "Par",
      
      // Final CTA
      readyToInvest: "Prêt à Investir Intelligemment ?",
      talkToExpert: "Parler à un Expert",
      viewOpportunities: "Voir les Opportunités",
      
      // SEO / Meta
      pageTitle: "Blog | Investir au Cameroun",
      pageDescription: "Conseils d'experts sur l'immobilier, l'agriculture et l'approvisionnement au Cameroun",
      
      // Placeholders
      readMore: "Lire la suite"
    },
    en: {
      // Hero
      heroTitle: "Invest in Cameroon",
      heroTitleLine2: "Without Compromise",
      heroSubtitle: "Real Estate, Agriculture, and International Sourcing — a secure and profitable approach for the modern investor.",
      exploreNow: "Explore Now",
      diasporaPortal: "Diaspora Portal",
      
      // CAPEF Section
      strategicPartnership: "Strategic Partnership with CAPEF",
      capefDescription: "We work closely with the Chamber of Agriculture, Fisheries, Livestock and Forests (CAPEF) to guarantee secured and profitable agricultural investments, managed by certified local experts.",
      learnMore: "Learn More",
      
      // Diaspora Section
      investFromAbroad: "Invest from Abroad with Confidence",
      diasporaDescription: "We manage, secure, and develop your investments in Cameroon. Leveraging our local expertise: you invest, we execute.",
      
      // Opportunities Section
      currentOpportunities: "Current Opportunities",
      details: "Details →",
      estimatedRoi: "Estimated Annual ROI",
      potentialRoi: "Potential ROI",
      
      // Blog Header
      theJournal: "The Journal",
      insightsExpertise: "Insights & Expertise",
      
      // Categories
      all: "All",
      realEstate: "Real Estate",
      agriculture: "Agriculture",
      sourcing: "Sourcing",
      lifestyle: "Lifestyle",
      
      // Post labels
      by: "By",
      
      // Final CTA
      readyToInvest: "Ready to Invest Smartly?",
      talkToExpert: "Talk to an Expert",
      viewOpportunities: "View Opportunities",
      
      // SEO / Meta
      pageTitle: "Blog | Invest in Cameroon",
      pageDescription: "Expert insights on real estate, agriculture, and sourcing in Cameroon",
      
      // Placeholders
      readMore: "Read more"
    }
  }[currentLang] || {
    // Fallback français
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
    pageTitle: "Blog | Investir au Cameroun",
    pageDescription: "Conseils d'experts sur l'immobilier, l'agriculture et l'approvisionnement au Cameroun",
    readMore: "Lire la suite"
  };

  // Catégories avec traduction
  const categories = [
    { id: 'all', label: t.all },
    { id: 'Real Estate', label: t.realEstate },
    { id: 'Agriculture', label: t.agriculture },
    { id: 'Sourcing', label: t.sourcing },
    { id: 'Lifestyle', label: t.lifestyle }
  ];

  // Posts avec versions traduites
  const getPosts = (lang) => {
    const posts = {
      fr: [
        {
          id: 1,
          category: 'Real Estate',
          title: "Sécuriser votre Titre Foncier au Cameroun : Le Guide Complet 2026",
          excerpt: "Tout ce que vous devez savoir pour éviter les litiges fonciers et investir en toute sérénité...",
          image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80",
          date: "12 Avril 2026",
          author: "Admin"
        },
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
        }
      ],
      en: [
        {
          id: 1,
          category: 'Real Estate',
          title: "Securing Your Land Title in Cameroon: The 2026 Comprehensive Guide",
          excerpt: "Everything you need to know to avoid land disputes and invest with complete peace of mind...",
          image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80",
          date: "April 12, 2026",
          author: "Admin"
        },
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
        }
      ]
    };
    return posts[lang] || posts.fr;
  };

  const posts = getPosts(currentLang);

  // Opportunities avec versions traduites
  const getOpportunities = (lang) => {
    const opportunities = {
      fr: [
        {
          id: 1,
          title: "Terrain Agricole Sécurisé - 5 Hectares",
          location: "Centre Cameroun",
          roi: "12% ROI Annuel Estimé",
          roiLabel: "estimatedRoi"
        },
        {
          id: 2,
          title: "Projet d'Élevage Porcin Clé en Main",
          location: "Ouest Cameroun",
          roi: "18% ROI Potentiel",
          roiLabel: "potentialRoi"
        }
      ],
      en: [
        {
          id: 1,
          title: "Secured Agricultural Land - 5 Hectares",
          location: "Central Cameroon",
          roi: "12% Estimated Annual ROI",
          roiLabel: "estimatedRoi"
        },
        {
          id: 2,
          title: "Turnkey Pig Farming Project",
          location: "West Cameroon",
          roi: "18% Potential ROI",
          roiLabel: "potentialRoi"
        }
      ]
    };
    return opportunities[lang] || opportunities.fr;
  };

  const opportunities = getOpportunities(currentLang);

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(post => post.category === activeCategory);

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

        {/* POSTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group">
              <div className="aspect-video overflow-hidden mb-6 bg-slate-100">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
              </div>
              <p className="text-[9px] text-pc-gold uppercase font-bold tracking-widest mb-3">{post.category}</p>
              <h3 className="text-xl font-serif italic text-slate-900 mb-3 group-hover:text-pc-green transition-colors">{post.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                <span>{post.date}</span>
                <span>•</span>
                <span>{t.by} {post.author}</span>
              </div>
            </Link>
          ))}
        </div>

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