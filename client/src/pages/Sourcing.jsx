import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

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

/* ─────────────── UNSPLASH IMAGES ─────────────── */
const IMG = {
  hero:       "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=1800&q=80",
  canton1:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
  canton2:    "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=900&q=80",
  canton3:    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80",
  china:      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=900&q=80",
  farmer:     "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80",
  irrigation: "/images/globalirigationkit.jfif",
  press:      "/images/compactoil.jfif",
  dryer:      "/images/dryingunit.jfif",
  contract:   "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80",
  shipping:   "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80",
};

/* ─────────────── HELPERS ─────────────── */
function CountUp({ target, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick); else setVal(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Accordion({ open, onToggle, header, children, borderColor }) {
  return (
    <div
      className={`transition-all duration-400 cursor-pointer overflow-hidden border ${open ? 'shadow-xl' : 'hover:shadow-md'}`}
      style={open && borderColor ? { borderColor, borderLeftWidth: 4 } : {}}
      onClick={onToggle}
    >
      {header}
      <div className={`grid transition-all duration-500 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────── PAGE ─────────────── */
const Sourcing = () => {
  const currentLang = useCurrentLang();
  const [openStep,    setOpenStep]    = useState(0);
  const [openFair,    setOpenFair]    = useState(0);
  const [openTrap,    setOpenTrap]    = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const [period,      setPeriod]      = useState(0);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero
      heroBadge: "Approvisionnement Agricole — Guide Complet",
      heroTitle: "Achetez en",
      heroTitleChina: "Chine",
      heroTitleRiskFree: "sans risque.",
      heroDesc: "Guide complet par nos experts de Yaoundé et Canton. Processus sécurisé en 6 étapes, salons 2026, pièges à éviter, équipements à prix usine.",
      heroBtnStart: "Commencer Gratuitement",
      heroBtnView: "Voir l'Équipement ↓",
      
      // Stats
      savings: "Économies vs Europe",
      savingsSub: "sur équipement agricole",
      manufacturers: "Fabricants Audités",
      manufacturersSub: "réseau Guangdong",
      leadTime: "Délai Moyen",
      leadTimeSub: "fabrication sur mesure",
      traceability: "Traçabilité Totale",
      traceabilitySub: "avec notre accompagnement",
      
      // Products
      productsBadge: "Prix Directs d'Usine",
      productsTitle: "Équipements Vedettes",
      productsSub: "Prix indicatifs départ usine depuis la Chine. Devis personnalisé sur demande.",
      requestQuote: "Demander un Devis →",
      clickDetails: "Cliquez pour les détails",
      allEquipment: "Tous les Équipements Disponibles →",
      
      // Why China
      whyChinaBadge: "Pourquoi la Chine?",
      whyChinaTitle: "La source la plus compétitive au monde",
      whyChinaDesc: "La Chine produit 70% des équipements agricoles mondiaux. Pour les agriculteurs africains, accéder directement aux usines du Guangdong est une opportunité historique.",
      savingsVs: "Économies vs équipement européen ou japonais",
      specialized: "Fabricants spécialisés dans le Guangdong uniquement",
      customLead: "Délai de fabrication sur mesure (5 unités et plus)",
      guaranteed: "Traçabilité garantie avec notre accompagnement",
      quote: "\"La Chine est la seule économie capable de produire des commandes personnalisées en petites séries dans des délais raisonnables. Pour un agriculteur camerounais, c'est une fenêtre d'opportunité historique.\"",
      quoteAuthor: "— PALM CONNECT Team, Yaoundé",
      
      // Process
      processBadge: "Notre Méthode",
      processTitle: "6 étapes pour acheter",
      processTitleSpan: "en toute confiance",
      learnMore: "En Savoir Plus →",
      startProject: "Démarrer Mon Projet d'Import",
      
      // Fairs
      fairsBadge: "Agenda 2026",
      fairsTitle: "Les salons incontournables",
      fairsTitleSpan: "en Chine pour les agriculteurs",
      fairsSub: "Cliquez sur un salon pour en savoir plus. Palm Connect peut vous y représenter.",
      getAccompanied: "Être Accompagné à Ce Salon →",
      fairsContact: "Palm Connect assiste à la Foire de Canton (Printemps & Automne 2026).",
      fairsContactLink: "Contactez-nous pour être représenté →",
      
      // Periods
      periodsBadge: "Calendrier Stratégique",
      periodsTitle: "Quand commander depuis la Chine?",
      periodsSub: "Sélectionnez une période pour voir nos recommandations.",
      planPeriod: "Planifier pour Cette Période →",
      
      // Traps
      trapsBadge: "Risques & Vigilance",
      trapsTitle: "Les 6 pièges classiques",
      trapsTitleSpan: "que vous devez absolument connaître",
      trapsSub: "Ces erreurs coûtent des millions de FCFA aux acheteurs africains chaque année. Cliquez pour lire.",
      safeguard: "Palm Connect = votre garantie.",
      safeguardDesc: "Physiquement présents en Chine. Contrats bilingues exécutoires. Contrôle qualité avant expédition. Dédouanement au Cameroun. Nous menons chaque projet jusqu'au bout.",
      benefitProtection: "Bénéficier de Notre Protection",
      
      // Reliability
      reliabilityBadge: "Notre Fiabilité",
      reliabilityTitle: "Pourquoi faire confiance",
      reliabilityTitleSpan: "à Palm Connect?",
      
      // Final CTA
      ctaBadge: "Prêt à passer à l'action?",
      ctaTitle: "\"L'avenir appartient",
      ctaTitleLine2: "à ceux qui s'équipent",
      ctaTitleSpan: "avant les autres.\"",
      ctaDesc: "Première consultation gratuite, sans engagement. Nos experts répondent sous 24h.",
      ctaBtnBook: "Prendre Rendez-vous — Gratuit",
      ctaBtnAsk: "Poser une Question →"
    },
    en: {
      // Hero
      heroBadge: "Agricultural Sourcing — Complete Guide",
      heroTitle: "Buy from",
      heroTitleChina: "China",
      heroTitleRiskFree: "risk-free.",
      heroDesc: "Complete guide by our experts in Yaoundé and Canton. Secure 6-step process, 2026 trade fairs, pitfalls to avoid, equipment at factory prices.",
      heroBtnStart: "Get Started for Free",
      heroBtnView: "View Equipment ↓",
      
      // Stats
      savings: "Savings vs Europe",
      savingsSub: "on agricultural equipment",
      manufacturers: "Audited Manufacturers",
      manufacturersSub: "Guangdong network",
      leadTime: "Average Lead Time",
      leadTimeSub: "custom manufacturing",
      traceability: "Full Traceability",
      traceabilitySub: "with our support",
      
      // Products
      productsBadge: "Direct Factory Prices",
      productsTitle: "Featured Equipment",
      productsSub: "Indicative ex-factory prices from China. Custom quote available on request.",
      requestQuote: "Request a Quote →",
      clickDetails: "Click for details",
      allEquipment: "All Available Equipment →",
      
      // Why China
      whyChinaBadge: "Why China?",
      whyChinaTitle: "The most competitive source in the world",
      whyChinaDesc: "China produces 70% of the world's agricultural equipment. For African farmers, accessing Guangdong factories directly is a historic opportunity.",
      savingsVs: "Savings vs European or Japanese equipment",
      specialized: "Specialized manufacturers in Guangdong alone",
      customLead: "Custom manufacturing lead time (5 units and above)",
      guaranteed: "Guaranteed traceability with our support",
      quote: "\"China is the only economy capable of producing custom, small-batch orders within a reasonable timeframe. For a Cameroonian farmer, this is a historic window of opportunity.\"",
      quoteAuthor: "— PALM CONNECT Team, Yaoundé",
      
      // Process
      processBadge: "Our Method",
      processTitle: "6 steps to buy",
      processTitleSpan: "with complete confidence",
      learnMore: "Learn More →",
      startProject: "Start My Import Project",
      
      // Fairs
      fairsBadge: "2026 Agenda",
      fairsTitle: "The must-attend trade fairs",
      fairsTitleSpan: "in China for farmers",
      fairsSub: "Click on a fair to learn more. Palm Connect can represent you there.",
      getAccompanied: "Get Accompanied to This Fair →",
      fairsContact: "Palm Connect attends the Canton Fair (Spring & Autumn 2026).",
      fairsContactLink: "Contact us to be represented →",
      
      // Periods
      periodsBadge: "Strategic Timing",
      periodsTitle: "When should you order from China?",
      periodsSub: "Select a period to see our recommendations.",
      planPeriod: "Plan for This Period →",
      
      // Traps
      trapsBadge: "Risks & Vigilance",
      trapsTitle: "The 6 classic pitfalls",
      trapsTitleSpan: "you absolutely must know",
      trapsSub: "These mistakes cost African buyers millions of FCFA every year. Click to read.",
      safeguard: "Palm Connect = your safeguard.",
      safeguardDesc: "Physically present in China. Bilingual enforceable contracts. Quality inspection before shipment. Customs clearance in Cameroon. We see every project through to the end.",
      benefitProtection: "Benefit from Our Protection",
      
      // Reliability
      reliabilityBadge: "Our Reliability",
      reliabilityTitle: "Why trust",
      reliabilityTitleSpan: "Palm Connect?",
      
      // Final CTA
      ctaBadge: "Ready to take action?",
      ctaTitle: "\"The future belongs",
      ctaTitleLine2: "to those who equip themselves",
      ctaTitleSpan: "before the rest.\"",
      ctaDesc: "Free first consultation, no commitment required. Our experts respond within 24 hours.",
      ctaBtnBook: "Book an Appointment — Free",
      ctaBtnAsk: "Ask a Question →"
    }
  }[currentLang] || {
    // Fallback français
    heroBadge: "Approvisionnement Agricole — Guide Complet",
    heroTitle: "Achetez en",
    heroTitleChina: "Chine",
    heroTitleRiskFree: "sans risque.",
    heroDesc: "Guide complet par nos experts de Yaoundé et Canton. Processus sécurisé en 6 étapes, salons 2026, pièges à éviter, équipements à prix usine.",
    heroBtnStart: "Commencer Gratuitement",
    heroBtnView: "Voir l'Équipement ↓",
    savings: "Économies vs Europe",
    savingsSub: "sur équipement agricole",
    manufacturers: "Fabricants Audités",
    manufacturersSub: "réseau Guangdong",
    leadTime: "Délai Moyen",
    leadTimeSub: "fabrication sur mesure",
    traceability: "Traçabilité Totale",
    traceabilitySub: "avec notre accompagnement",
    productsBadge: "Prix Directs d'Usine",
    productsTitle: "Équipements Vedettes",
    productsSub: "Prix indicatifs départ usine depuis la Chine. Devis personnalisé sur demande.",
    requestQuote: "Demander un Devis →",
    clickDetails: "Cliquez pour les détails",
    allEquipment: "Tous les Équipements Disponibles →",
    whyChinaBadge: "Pourquoi la Chine?",
    whyChinaTitle: "La source la plus compétitive au monde",
    whyChinaDesc: "La Chine produit 70% des équipements agricoles mondiaux. Pour les agriculteurs africains, accéder directement aux usines du Guangdong est une opportunité historique.",
    savingsVs: "Économies vs équipement européen ou japonais",
    specialized: "Fabricants spécialisés dans le Guangdong uniquement",
    customLead: "Délai de fabrication sur mesure (5 unités et plus)",
    guaranteed: "Traçabilité garantie avec notre accompagnement",
    quote: "\"La Chine est la seule économie capable de produire des commandes personnalisées en petites séries dans des délais raisonnables. Pour un agriculteur camerounais, c'est une fenêtre d'opportunité historique.\"",
    quoteAuthor: "— PALM CONNECT Team, Yaoundé",
    processBadge: "Notre Méthode",
    processTitle: "6 étapes pour acheter",
    processTitleSpan: "en toute confiance",
    learnMore: "En Savoir Plus →",
    startProject: "Démarrer Mon Projet d'Import",
    fairsBadge: "Agenda 2026",
    fairsTitle: "Les salons incontournables",
    fairsTitleSpan: "en Chine pour les agriculteurs",
    fairsSub: "Cliquez sur un salon pour en savoir plus. Palm Connect peut vous y représenter.",
    getAccompanied: "Être Accompagné à Ce Salon →",
    fairsContact: "Palm Connect assiste à la Foire de Canton (Printemps & Automne 2026).",
    fairsContactLink: "Contactez-nous pour être représenté →",
    periodsBadge: "Calendrier Stratégique",
    periodsTitle: "Quand commander depuis la Chine?",
    periodsSub: "Sélectionnez une période pour voir nos recommandations.",
    planPeriod: "Planifier pour Cette Période →",
    trapsBadge: "Risques & Vigilance",
    trapsTitle: "Les 6 pièges classiques",
    trapsTitleSpan: "que vous devez absolument connaître",
    trapsSub: "Ces erreurs coûtent des millions de FCFA aux acheteurs africains chaque année. Cliquez pour lire.",
    safeguard: "Palm Connect = votre garantie.",
    safeguardDesc: "Physiquement présents en Chine. Contrats bilingues exécutoires. Contrôle qualité avant expédition. Dédouanement au Cameroun. Nous menons chaque projet jusqu'au bout.",
    benefitProtection: "Bénéficier de Notre Protection",
    reliabilityBadge: "Notre Fiabilité",
    reliabilityTitle: "Pourquoi faire confiance",
    reliabilityTitleSpan: "à Palm Connect?",
    ctaBadge: "Prêt à passer à l'action?",
    ctaTitle: "\"L'avenir appartient",
    ctaTitleLine2: "à ceux qui s'équipent",
    ctaTitleSpan: "avant les autres.\"",
    ctaDesc: "Première consultation gratuite, sans engagement. Nos experts répondent sous 24h.",
    ctaBtnBook: "Prendre Rendez-vous — Gratuit",
    ctaBtnAsk: "Poser une Question →"
  };

  // Produits avec traductions dynamiques
  const getProducts = () => [
    { 
      title: { fr: "Kit d'irrigation solaire", en: "Solar Irrigation Kit" },
      price: "From 249,000 FCFA", 
      img: IMG.irrigation, 
      tag: { fr: "MEILLEURE VENTE", en: "BEST SELLER" },
      desc: { 
        fr: "Système autonome pour 1 hectare. Zéro carburant. Inclut panneau 300W, pompe submersible, tuyaux PE et programmateur. Installé en 4 heures.",
        en: "Autonomous system for 1 hectare. Zero fuel. Includes 300W panel, submersible pump, PE pipes and timer. Installed in 4 hours."
      }
    },
    { 
      title: { fr: "Presse à huile compacte", en: "Compact Oil Press" }, 
      price: "From 450,000 FCFA", 
      img: IMG.press, 
      tag: { fr: "TOP QUALITÉ", en: "TOP QUALITY" },
      desc: { 
        fr: "Rendement 85–92%. Traite palme, arachide, sésame. Capacité 50–80 kg/h. Moteur monophasé 2,2 kW. Acier inoxydable alimentaire.",
        en: "85–92% yield. Processes palm, peanut, sesame. Capacity 50–80 kg/h. 2.2 kW single-phase motor. Food-grade stainless steel."
      }
    },
    { 
      title: { fr: "Séchoir professionnel", en: "Professional Dryer" }, 
      price: "From 185,000 FCFA", 
      img: IMG.dryer, 
      tag: { fr: "POST-RÉCOLTE", en: "POST-HARVEST" },
      desc: { 
        fr: "Pour cacao, café, maïs, manioc. Température réglable 40–80°C. Capacité 200 kg/cycle. Économie d'énergie 70% vs séchage solaire traditionnel.",
        en: "For cocoa, coffee, maize, cassava. Adjustable temperature 40–80°C. Capacity 200 kg/cycle. 70% energy saving vs traditional solar drying."
      }
    },
  ];

  const PRODUCTS = getProducts();

  // Fonction pour obtenir la valeur traduite
  const getTranslatedValue = (value, lang) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value[lang]) return value[lang];
    if (typeof value === 'object' && value.fr) return value.fr;
    return String(value);
  };

  // Steps avec traductions
  const STEPS = [
    { num:"01", icon:"📋", 
      title: { fr: "Consultation & Spécifications", en: "Consultation & Requirements Specification" },
      short: { fr: "Vous partagez vos besoins, nous les analysons.", en: "You share your needs, we analyze them." },
      full: { fr: "Vous nous fournissez vos besoins précis : type d'équipement, budget, quantités, contraintes techniques (tension, normes, dimensions). Nous produisons une fiche de spécifications détaillée et identifions les fabricants les mieux adaptés à votre exploitation.", en: "You provide us with your precise requirements: type of equipment, budget, quantities, technical constraints (voltage, standards, dimensions). We produce a detailed specification sheet and identify the manufacturers best suited to your operation." }, 
      img: IMG.farmer },
    { num:"02", icon:"🔎", 
      title: { fr: "Recherche & Vérification des fournisseurs", en: "Sourcing & Supplier Verification" },
      short: { fr: "Audit physique des usines à Guangzhou.", en: "Physical audit of factories in Guangzhou." },
      full: { fr: "Notre réseau à Guangzhou contacte directement les usines. Nous vérifions les licences commerciales, certifications ISO/CE, capacité de production et réputation. Aucun fournisseur non audité n'entre dans notre chaîne d'approvisionnement.", en: "Our network in Guangzhou contacts factories directly. We verify business licenses, ISO/CE certifications, production capacity and reputation. No unaudited supplier enters our supply chain." }, 
      img: IMG.canton1 },
    { num:"03", icon:"🤝", 
      title: { fr: "Négociation & Échantillonnage", en: "Negotiation & Sampling" },
      short: { fr: "Échantillons testés avant toute commande.", en: "Samples tested before any order is placed." },
      full: { fr: "Nous négocions les prix en votre nom — sans conflit d'intérêts. Des échantillons sont commandés, testés et photographiés. Vous approuvez avant que tout paiement de production ne soit effectué. Vous ne payez que ce que vous avez approuvé.", en: "We negotiate prices on your behalf — with no conflict of interest. Samples are ordered, tested and photographed. You approve before any production payment is made. You only pay for what you have approved." }, 
      img: IMG.canton3 },
    { num:"04", icon:"📄", 
      title: { fr: "Contractualisation & Paiement sécurisé", en: "Contracting & Secure Payment" },
      short: { fr: "Contrat bilingue EN/CN, paiement structuré.", en: "Bilingual EN/CN contract, structured payment." },
      full: { fr: "Contrat rédigé en anglais ET en mandarin avec clauses de protection de l'acheteur, garanties de conformité et pénalités de retard. Paiement par LC (lettre de crédit), séquestre ou virement par étapes.", en: "Contract drafted in both English AND Mandarin with buyer protection clauses, compliance guarantees and late delivery penalties. Payment via LC (letter of credit), escrow or milestone-based wire transfer." }, 
      img: IMG.contract },
    { num:"05", icon:"🔍", 
      title: { fr: "Contrôle qualité pré-expédition", en: "Pre-Shipment Quality Control" },
      short: { fr: "Inspecteurs tiers certifiés sur site en Chine.", en: "Certified third-party inspectors on-site in China." },
      full: { fr: "Nous mandatons des inspecteurs tiers certifiés (SGS, Bureau Veritas ou équivalent) pour valider chaque lot avant qu'il ne quitte la Chine. Rapport d'inspection avec photos fourni. Zéro surprise à l'arrivée à Douala.", en: "We commission certified third-party inspectors (SGS, Bureau Veritas or equivalent) to validate every batch before it leaves China. Inspection report with photos provided. Zero surprises upon arrival in Douala." }, 
      img: IMG.canton2 },
    { num:"06", icon:"🚢", 
      title: { fr: "Expédition & Dédouanement Cameroun", en: "Shipping & Cameroon Customs Clearance" },
      short: { fr: "Fret maritime, suivi en temps réel, livraison.", en: "Sea freight, real-time tracking, delivery." },
      full: { fr: "Coordination logistique complète : fret maritime LCL/FCL, documents douaniers (BL, certificat d'origine), suivi en temps réel. Dédouanement à Douala et transport vers Yaoundé ou votre site.", en: "Full logistics coordination: LCL/FCL sea freight, customs documents (BL, certificate of origin), real-time tracking. Customs clearance in Douala and transport to Yaoundé or your site." }, 
      img: IMG.shipping },
  ];

  // Fairs avec traductions
  const FAIRS = [
    { badge:"SPRING", color:"#c8a84b", 
      name: { fr: "Foire de Canton – Session Printemps", en: "Canton Fair – Spring Session" },
      dates: { fr: "15 Avril – 5 Mai 2026", en: "April 15 – May 5, 2026" }, 
      location: "Guangzhou, Guangdong",
      focus: { fr: "Équipements agricoles, machinerie, outils industriels", en: "Agricultural equipment, machinery, industrial tools" },
      detail: { fr: "La plus grande foire commerciale au monde. 25 000+ exposants. Section agricole massive avec démonstrations en direct. Palm Connect est présent — nous pouvons vous représenter ou vous accompagner sur place.", en: "The largest trade fair in the world. 25,000+ exhibitors. Massive agricultural section with live demonstrations. Palm Connect is present — we can represent you or accompany you on-site." }, 
      img: IMG.canton1 },
    { badge:"AUTUMN", color:"#e07b3a", 
      name: { fr: "Foire de Canton – Session Automne", en: "Canton Fair – Autumn Session" },
      dates: { fr: "15 Oct – 4 Nov 2026", en: "Oct 15 – Nov 4, 2026" }, 
      location: "Guangzhou, Guangdong",
      focus: { fr: "Outillage, produits agrochimiques, technologies post-récolte", en: "Tooling, agrochemicals, post-harvest technologies" },
      detail: { fr: "Session idéale pour négocier les prix de l'année suivante. Les fabricants font des efforts commerciaux importants en fin d'exercice fiscal. Parfait pour planifier la campagne cacao suivante.", en: "Ideal session for negotiating next year's prices. Manufacturers make significant commercial efforts at the end of their fiscal year. Perfect for planning ahead for the following cocoa season." }, 
      img: IMG.canton2 },
    { badge:"MACHINERY", color:"#4a9f6a", 
      name: { fr: "CIAME — Salon Agri Machine Chine", en: "CIAME — China Agri Machinery Exhibition" },
      dates: { fr: "Fin Octobre / Début Novembre", en: "Late October / Early November" }, 
      location: "Wuhan, Hubei",
      focus: { fr: "Machinerie agricole spécialisée, irrigation, semences", en: "Specialized agricultural machinery, irrigation, seeds" },
      detail: { fr: "Le salon le plus technique pour les équipements agricoles spécialisés. Tracteurs, moissonneuses, systèmes d'irrigation sur mesure. Idéal pour les commandes complexes ou personnalisées.", en: "The most technical trade show for specialized agricultural equipment. Tractors, harvesters, custom irrigation systems. Ideal for complex or customized orders." }, 
      img: IMG.canton3 },
    { badge:"B2B", color:"#3a6ea8", 
      name: { fr: "Exposition Internationale d'Importation de Chine (CIIE)", en: "China International Import Expo (CIIE)" },
      dates: { fr: "5–10 Novembre 2026", en: "November 5–10, 2026" }, 
      location: "Shanghai",
      focus: { fr: "Importations, partenariats B2B internationaux", en: "Imports, international B2B partnerships" },
      detail: { fr: "Un événement stratégique pour établir des partenariats à long terme. Plus axé sur le développement commercial que sur l'achat direct. Recommandé pour les entreprises cherchant des partenaires durables.", en: "A strategic event for establishing long-term partnerships. More focused on business development than direct purchasing. Recommended for companies seeking long-term partners." }, 
      img: IMG.china },
    { badge:"WHOLESALE", color:"#8a4faf", 
      name: { fr: "Foire Commerciale Internationale de Yiwu", en: "Yiwu International Trade Fair" },
      dates: { fr: "21–25 Octobre 2026", en: "October 21–25, 2026" }, 
      location: "Yiwu, Zhejiang",
      focus: { fr: "Petit équipement, consommables, fournitures en gros", en: "Small equipment, consumables, wholesale supplies" },
      detail: { fr: "La Mecque du petit équipement et des fournitures en gros. Idéal pour les revendeurs ou pour compléter une commande principale avec des accessoires à des prix imbattables.", en: "The mecca of small equipment and wholesale supplies. Ideal for resellers or to complement a main order with accessories at unbeatable prices." }, 
      img: IMG.canton1 },
  ];

  // Traps avec traductions
  const TRAPS = [
    { icon:"👻", 
      title: { fr: "Fournisseurs Fantômes", en: "Ghost Suppliers" },
      full: { fr: "Des milliers de sites web chinois (Alibaba, DHgate, Made-in-China) listent des produits sans usine réelle derrière. Sans vérification physique, vous risquez de perdre 30 à 50% du montant total. Nous auditions chaque fournisseur avant tout engagement.", en: "Thousands of Chinese websites (Alibaba, DHgate, Made-in-China) list products without a real factory behind them. Without physical verification, you risk losing 30 to 50% of the total amount. We audit every supplier before any commitment." } },
    { icon:"💸", 
      title: { fr: "Acompte sans contrat exécutoire", en: "Deposit Without Enforceable Contract" },
      full: { fr: "Un virement sans contrat bilingue vous laisse sans recours légal. En Chine, seuls les contrats rédigés en mandarin simplifié sont exécutoires. Nos contrats sont rédigés par des avocats spécialisés dans le commerce sino-africain.", en: "A wire transfer without a bilingual contract leaves you with no legal recourse. In China, only contracts written in Simplified Mandarin are enforceable. Our contracts are drafted by lawyers specializing in Sino-African trade." } },
    { icon:"📦", 
      title: { fr: "Qualité 'Export Grade' vs Réalité", en: "'Export Grade' Quality vs. Reality" },
      full: { fr: "De nombreux fournisseurs expédient des produits inférieurs aux échantillons validés une fois la production payée. Notre inspection pré-expédition (norme AQL) stoppe ce risque à la source.", en: "Many suppliers ship products inferior to the validated samples once production is paid for. Our pre-shipment inspection (AQL standard) stops this risk at the source." } },
    { icon:"🧾", 
      title: { fr: "Coûts d'importation cachés", en: "Hidden Import Costs" },
      full: { fr: "TVA, droits de douane CEMAC, frais de transit, surestaries portuaires — ces coûts peuvent atteindre 25 à 45% du prix d'achat. Nous fournissons un devis tout compris avant validation : zéro surprise.", en: "VAT, CEMAC customs duties, transit fees, port demurrage — these costs can reach 25 to 45% of the purchase price. We provide an all-inclusive quote before validation: zero surprises." } },
    { icon:"🔌", 
      title: { fr: "Barrières techniques et linguistiques", en: "Technical and Language Barriers" },
      full: { fr: "220V vs 380V, monophasé vs triphasé, norme CE vs GB/T, filetage métrique vs UNC — une mauvaise spécification peut rendre l'équipement inutilisable à l'arrivée. Nos équipes rédigent les spécifications en mandarin technique.", en: "220V vs 380V, single-phase vs three-phase, CE vs GB/T standard, metric vs UNC threading — one wrong spec can make equipment unusable upon arrival. Our teams write specifications in technical Mandarin." } },
    { icon:"⏳", 
      title: { fr: "Délais non contractualisés", en: "Non-Contractualized Delays" },
      full: { fr: "Sans pénalités de retard dans le contrat, 4 semaines annoncées peuvent devenir 16 semaines — bloquant votre capital. Nous incluons systématiquement un calendrier de production exécutoire avec pénalités.", en: "Without late penalties in the contract, 4 announced weeks can become 16 weeks — tying up your capital. We systematically include an enforceable production schedule with penalties." } },
  ];

  // Periods avec traductions
  const PERIODS = [
    { season:"Jan – Mar", 
      label: { fr: "Pré-saison des pluies", en: "Pre-rainy season" }, 
      stars:5, color:"#4a9f6a",
      tip: { fr: "Idéal pour commander l'équipement d'irrigation et les semoirs avant les plantations d'avril. Les délais de fabrication (4–8 semaines) s'alignent parfaitement avec les premières pluies camerounaises.", en: "Ideal for ordering irrigation equipment and seeders before April planting. Manufacturing lead times (4–8 weeks) align perfectly with the first Cameroonian rains." } },
    { season:"Apr – Jun", 
      label: { fr: "Post-Canton Printemps", en: "Post-Spring Canton" }, 
      stars:4, color:"#c8a84b",
      tip: { fr: "Juste après la Foire de Canton, les usines sont à pleine capacité. Bon moment pour négocier les stocks d'exposition souvent vendus à prix réduits.", en: "Right after the Canton Fair, factories are at full capacity. A good time to negotiate exhibition stock often sold at reduced prices." } },
    { season:"Jul – Sep", 
      label: { fr: "Pré-saison sèche", en: "Pre-dry season" }, 
      stars:3, color:"#e07b3a",
      tip: { fr: "Commandez l'équipement de séchage et de pressage pour la campagne cacao. Attention aux fermetures d'usines en août. Délais plus longs.", en: "Order drying and pressing equipment for the cocoa campaign. Watch out for factory closures in August. Longer lead times." } },
    { season:"Oct – Dec", 
      label: { fr: "Post-Canton Automne", en: "Post-Autumn Canton" }, 
      stars:5, color:"#3a6ea8",
      tip: { fr: "Meilleur moment de l'année. Négociez les prix pour l'année suivante. Les fabricants font des efforts commerciaux majeurs en fin d'exercice fiscal chinois.", en: "Best time of the year. Negotiate prices for the following year. Manufacturers make major commercial efforts at the end of the Chinese fiscal year." } },
  ];

  // Reliability cards avec traductions
  const RELIABILITY_CARDS = [
    { icon:"🏛", img:IMG.canton2, 
      title: { fr: "Présence Institutionnelle", en: "Institutional Presence" },
      desc: { fr: "Membre actif de la Foire de Canton. Équipes physiquement présentes lors des salons et visites d'usines. Vous n'achetez pas à l'aveugle.", en: "Active member of the Canton Fair. Teams physically present at trade fairs and factory visits. You don't buy blind." } },
    { icon:"📄", img:IMG.contract, 
      title: { fr: "Contrats Bilingues EN/CN", en: "Bilingual EN/CN Contracts" },
      desc: { fr: "Chaque transaction régie par un contrat en anglais ET en mandarin, avec clauses de protection de l'acheteur et pénalités de retard.", en: "Every transaction governed by a contract in both English AND Mandarin, with buyer protection clauses and late delivery penalties." } },
    { icon:"🔍", img:IMG.shipping, 
      title: { fr: "Contrôle Qualité Pré-Expédition", en: "Pre-Shipment Quality Control" },
      desc: { fr: "Des inspecteurs tiers certifiés (SGS, Bureau Veritas) valident chaque lot avant qu'il ne quitte la Chine. Zéro surprise à Douala.", en: "Certified third-party inspectors (SGS, Bureau Veritas) validate every batch before it leaves China. Zero surprises in Douala." } },
    { icon:"🌍", img:IMG.farmer, 
      title: { fr: "Présence Locale au Cameroun", en: "Local Presence in Cameroon" },
      desc: { fr: "Basés à Yaoundé, nous gérons le suivi post-livraison, le dédouanement et la mise en service dans votre ferme.", en: "Based in Yaoundé, we handle post-delivery follow-up, customs clearance and commissioning at your farm." } },
    { icon:"🤝", img:IMG.canton1, 
      title: { fr: "Réseau de Fournisseurs Audités", en: "Network of Audited Suppliers" },
      desc: { fr: "Chaque fournisseur visité, audité et testé. Certifications ISO, CE vérifiées. Pas d'intermédiaires inconnus.", en: "Every supplier visited, audited and tested. ISO, CE certifications verified. No unknown intermediaries." } },
    { icon:"💬", img:IMG.china, 
      title: { fr: "Accompagnement Bout-en-Bout", en: "End-to-End Support" },
      desc: { fr: "De la Foire de Canton à votre ferme. Pas de frais cachés. Communication transparente à chaque étape.", en: "From the Canton Fair to your farm. No hidden fees. Transparent communication at every step." } },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Georgia','Times New Roman',serif" }}>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative pt-32 pb-0 bg-[#0a192f] text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-25">
            <source src="/video/sourcing.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ backgroundImage:`url(${IMG.hero})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.2 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0a192f]/85 to-[#0a192f]/40" />
        </div>
        <div className="absolute inset-0 z-[1] opacity-[0.05]" style={{ backgroundImage:'linear-gradient(#c8a84b 1px,transparent 1px),linear-gradient(90deg,#c8a84b 1px,transparent 1px)', backgroundSize:'80px 80px' }} />

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-pc-gold text-[10px] uppercase tracking-[0.6em] font-bold mb-6 block" style={{ fontFamily:'sans-serif' }}>
                {t.heroBadge}
              </span>
              <h1 className="text-5xl md:text-7xl leading-[1.05] mb-8 italic">
                {t.heroTitle}<br /><span className="text-pc-gold">{t.heroTitleChina}</span>,<br />{t.heroTitleRiskFree}
              </h1>
              <p className="text-white/70 text-base max-w-lg leading-relaxed mb-10" style={{ fontFamily:'sans-serif', fontStyle:'normal' }}>
                {t.heroDesc}
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/book-appointment">
                  <button className="bg-pc-gold text-pc-green px-10 py-4 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all shadow-2xl" style={{ fontFamily:'sans-serif' }}>
                    {t.heroBtnStart}
                  </button>
                </Link>
                <a href="#products">
                  <button className="border border-white/30 text-white px-10 py-4 uppercase text-[11px] font-black tracking-widest hover:border-pc-gold hover:text-pc-gold transition-all" style={{ fontFamily:'sans-serif' }}>
                    {t.heroBtnView}
                  </button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { target:60, suffix:"%", label: t.savings, sub: t.savingsSub },
                { target:500, suffix:"+", label: t.manufacturers, sub: t.manufacturersSub },
                { target:8, suffix:" sem", label: t.leadTime, sub: t.leadTimeSub },
                { target:100, suffix:"%", label: t.traceability, sub: t.traceabilitySub },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-pc-gold transition-all">
                  <div className="text-4xl font-black text-pc-gold mb-2"><CountUp target={s.target} suffix={s.suffix} /></div>
                  <div className="font-bold text-sm mb-1">{s.label}</div>
                  <div className="text-white/40 text-[10px] uppercase tracking-wider" style={{ fontFamily:'sans-serif' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10" style={{ background:'linear-gradient(to bottom,transparent,#f8fafc)' }} />
      </section>

      {/* ══ PRODUCTS ══ */}
      <section id="products" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-3" style={{ fontFamily:'sans-serif' }}>{t.productsBadge}</span>
              <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">{t.productsTitle}</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xs md:text-right" style={{ fontFamily:'sans-serif' }}>{t.productsSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <div key={i}
                className={`bg-white cursor-pointer group transition-all duration-500 overflow-hidden ${openProduct === i ? 'shadow-2xl ring-2 ring-pc-gold' : 'shadow-md hover:shadow-xl'}`}
                onClick={() => setOpenProduct(openProduct === i ? null : i)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={p.img} alt={getTranslatedValue(p.title, currentLang)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4 bg-pc-gold text-pc-green text-[9px] font-black px-3 py-1 uppercase tracking-widest" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(p.tag, currentLang)}</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-bold text-lg leading-tight">{getTranslatedValue(p.title, currentLang)}</div>
                    <div className="text-pc-gold font-black text-base mt-1">{p.price}</div>
                  </div>
                </div>
                <div className={`grid transition-all duration-500 ${openProduct === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 border-t border-slate-100">
                      <p className="text-slate-500 text-sm leading-relaxed mb-4" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(p.desc, currentLang)}</p>
                      <Link to="/book-appointment">
                        <button className="w-full bg-pc-green text-white py-3 text-[10px] uppercase tracking-widest font-black hover:bg-pc-gold hover:text-pc-green transition-all" style={{ fontFamily:'sans-serif' }}>
                          {t.requestQuote}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex justify-between items-center border-t border-slate-50">
                  <span className="text-[10px] uppercase tracking-widest text-slate-300" style={{ fontFamily:'sans-serif' }}>{t.clickDetails}</span>
                  <span className={`text-pc-gold font-black text-xl transition-transform duration-300 ${openProduct === i ? 'rotate-45' : ''}`}>+</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/book-appointment">
              <button className="border-2 border-pc-green text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-pc-green hover:text-white transition-all" style={{ fontFamily:'sans-serif' }}>
                {t.allEquipment}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ WHY CHINA ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-3 h-[480px]">
            <div className="row-span-2 overflow-hidden">
              <img src={IMG.canton1} alt="Canton Fair" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden">
              <img src={IMG.china} alt="Guangzhou" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden">
              <img src={IMG.canton3} alt="Machinery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div>
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>{t.whyChinaBadge}</span>
            <h2 className="text-4xl md:text-5xl text-pc-green mb-6 leading-tight italic">{t.whyChinaTitle}</h2>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed" style={{ fontFamily:'sans-serif' }}>
              {t.whyChinaDesc}
            </p>
            <div className="space-y-5">
              {[
                { stat:"—60%", label: t.savingsVs },
                { stat:"500+", label: t.specialized },
                { stat:"4–8 sem", label: t.customLead },
                { stat:"100%", label: t.guaranteed },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 border-b border-slate-100 pb-5 hover:border-pc-gold transition-all">
                  <div className="text-3xl font-black text-pc-gold min-w-[90px]">{item.stat}</div>
                  <p className="text-slate-600 text-sm" style={{ fontFamily:'sans-serif' }}>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-slate-50 border-l-4 border-pc-gold p-8">
              <p className="text-slate-500 text-sm italic leading-relaxed mb-2">
                {t.quote}
              </p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-pc-green" style={{ fontFamily:'sans-serif' }}>{t.quoteAuthor}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROCESS — ACCORDION ══ */}
      <section id="process" className="py-24 px-8 bg-[#0a192f] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>{t.processBadge}</span>
            <h2 className="text-4xl md:text-5xl leading-tight italic">
              {t.processTitle}<br /><span className="text-pc-gold">{t.processTitleSpan}</span>
            </h2>
          </div>
          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <div key={i}
                className={`border transition-all duration-400 cursor-pointer overflow-hidden ${openStep === i ? 'border-pc-gold shadow-xl' : 'border-white/10 hover:border-white/30'}`}
                onClick={() => setOpenStep(openStep === i ? null : i)}
              >
                <div className="flex items-center gap-6 p-6 md:p-8">
                  <div className={`text-3xl font-black italic transition-all min-w-[56px] ${openStep === i ? 'text-pc-gold' : 'text-white/20'}`}>{step.num}</div>
                  <div className="text-2xl">{step.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm md:text-base">{getTranslatedValue(step.title, currentLang)}</div>
                    <div className="text-white/40 text-xs mt-1" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(step.short, currentLang)}</div>
                  </div>
                  <div className={`text-pc-gold font-black text-xl transition-transform duration-300 ${openStep === i ? 'rotate-45' : ''}`}>+</div>
                </div>
                <div className={`grid transition-all duration-500 ${openStep === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col md:flex-row border-t border-white/10">
                      <div className="flex-1 p-6 md:p-10">
                        <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(step.full, currentLang)}</p>
                        <Link to="/book-appointment">
                          <button className="mt-6 text-[10px] uppercase tracking-widest font-black text-pc-gold border border-pc-gold/40 px-6 py-3 hover:bg-pc-gold hover:text-pc-green transition-all" style={{ fontFamily:'sans-serif' }}>
                            {t.learnMore}
                          </button>
                        </Link>
                      </div>
                      <div className="md:w-64 h-44 md:h-auto overflow-hidden shrink-0">
                        <img src={step.img} alt={getTranslatedValue(step.title, currentLang)} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-all duration-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/book-appointment">
              <button className="bg-pc-gold text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all" style={{ fontFamily:'sans-serif' }}>
                {t.startProject}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TRADE FAIRS — ACCORDION ══ */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>{t.fairsBadge}</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">
              {t.fairsTitle}<br />{t.fairsTitleSpan}
            </h2>
            <p className="text-slate-400 text-sm mt-4" style={{ fontFamily:'sans-serif' }}>{t.fairsSub}</p>
          </div>
          <div className="space-y-3">
            {FAIRS.map((fair, i) => (
              <div key={i}
                className={`bg-white overflow-hidden cursor-pointer transition-all duration-400 border ${openFair === i ? 'shadow-2xl' : 'border-slate-100 hover:shadow-md'}`}
                style={openFair === i ? { borderLeft:`4px solid ${fair.color}`, borderColor: fair.color } : {}}
                onClick={() => setOpenFair(openFair === i ? null : i)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 md:p-8">
                  <span className="text-[9px] uppercase tracking-widest font-black px-3 py-1.5 shrink-0" style={{ background:fair.color, color:'#fff', fontFamily:'sans-serif' }}>{fair.badge}</span>
                  <div className="flex-1">
                    <div className="font-bold text-pc-green">{getTranslatedValue(fair.name, currentLang)}</div>
                    <div className="text-xs text-slate-400" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(fair.focus, currentLang)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-sm" style={{ color:fair.color }}>{getTranslatedValue(fair.dates, currentLang)}</div>
                    <div className="text-[10px] text-slate-400" style={{ fontFamily:'sans-serif' }}>📍 {fair.location}</div>
                  </div>
                  <div className={`text-slate-400 font-black text-xl transition-transform duration-300 shrink-0 ${openFair === i ? 'rotate-45' : ''}`}>+</div>
                </div>
                <div className={`grid transition-all duration-500 ${openFair === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col md:flex-row border-t border-slate-100">
                      <div className="flex-1 p-6 md:p-8">
                        <p className="text-slate-600 text-sm leading-relaxed mb-6" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(fair.detail, currentLang)}</p>
                        <Link to="/book-appointment">
                          <button className="text-[10px] uppercase tracking-widest font-black px-8 py-3 text-white hover:opacity-80 transition-all" style={{ background:fair.color, fontFamily:'sans-serif' }}>
                            {t.getAccompanied}
                          </button>
                        </Link>
                      </div>
                      <div className="md:w-72 h-48 md:h-auto overflow-hidden shrink-0">
                        <img src={fair.img} alt={getTranslatedValue(fair.name, currentLang)} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-pc-gold/10 border border-pc-gold/30 p-6 text-center">
            <p className="text-sm text-slate-700" style={{ fontFamily:'sans-serif' }}>
              <strong>Palm Connect</strong> {t.fairsContact}{' '}
              <Link to="/book-appointment" className="font-bold text-pc-green underline hover:text-pc-gold">{t.fairsContactLink}</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ══ PERIODS — SELECTOR ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>{t.periodsBadge}</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">{t.periodsTitle}</h2>
            <p className="text-slate-400 text-sm mt-4" style={{ fontFamily:'sans-serif' }}>{t.periodsSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-0">
            {PERIODS.map((p, i) => (
              <button key={i} onClick={() => setPeriod(i)}
                className={`p-5 text-left border-t-4 transition-all duration-300 ${period === i ? 'shadow-lg' : 'bg-slate-50 border-slate-200 hover:shadow-md'}`}
                style={period === i ? { borderColor:p.color, background:p.color+'14' } : {}}
              >
                <div className="text-[9px] uppercase tracking-widest font-black mb-1" style={{ color:p.color, fontFamily:'sans-serif' }}>{getTranslatedValue(p.label, currentLang)}</div>
                <div className="font-bold text-pc-green text-sm">{p.season}</div>
                <div className="mt-2 text-base" style={{ color:p.color }}>{'★'.repeat(p.stars)}{'☆'.repeat(5-p.stars)}</div>
              </button>
            ))}
          </div>
          <div className="border border-slate-100 bg-slate-50 p-8 md:p-12" style={{ borderTop:`4px solid ${PERIODS[period].color}` }}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="text-4xl font-black mb-2 italic" style={{ color:PERIODS[period].color }}>{PERIODS[period].season}</div>
                <div className="text-lg mb-4 italic text-pc-green">{getTranslatedValue(PERIODS[period].label, currentLang)}</div>
                <p className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(PERIODS[period].tip, currentLang)}</p>
              </div>
              <div className="shrink-0">
                <Link to="/book-appointment">
                  <button className="px-10 py-4 text-white text-[10px] uppercase tracking-widest font-black hover:opacity-80 transition-all" style={{ background:PERIODS[period].color, fontFamily:'sans-serif' }}>
                    {t.planPeriod}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PITFALLS — ACCORDION ══ */}
      <section className="py-24 px-8 bg-[#0a192f] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#e07b3a] text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>{t.trapsBadge}</span>
            <h2 className="text-4xl md:text-5xl leading-tight italic">
              {t.trapsTitle}<br /><span className="text-[#e07b3a]">{t.trapsTitleSpan}</span>
            </h2>
            <p className="text-white/40 text-sm mt-4 max-w-lg mx-auto" style={{ fontFamily:'sans-serif' }}>
              {t.trapsSub}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TRAPS.map((trap, i) => (
              <div key={i}
                className={`border transition-all duration-300 cursor-pointer overflow-hidden ${openTrap === i ? 'border-[#e07b3a] bg-white/10' : 'border-white/10 hover:border-white/25 bg-white/5'}`}
                onClick={() => setOpenTrap(openTrap === i ? null : i)}
              >
                <div className="flex items-center gap-5 p-6">
                  <span className="text-3xl">{trap.icon}</span>
                  <div className="flex-1 font-bold text-sm">{getTranslatedValue(trap.title, currentLang)}</div>
                  <div className={`text-[#e07b3a] font-black text-xl transition-transform duration-300 ${openTrap === i ? 'rotate-45' : ''}`}>+</div>
                </div>
                <div className={`grid transition-all duration-400 ${openTrap === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="border-t border-white/10 px-6 pb-6 pt-4">
                      <p className="text-white/60 text-xs leading-relaxed" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(trap.full, currentLang)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 border border-pc-gold/30 bg-white/5 p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="text-pc-gold font-black text-lg mb-3">{t.safeguard}</div>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>
                {t.safeguardDesc}
              </p>
            </div>
            <Link to="/book-appointment">
              <button className="shrink-0 bg-pc-gold text-pc-green px-12 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all" style={{ fontFamily:'sans-serif' }}>
                {t.benefitProtection}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ RELIABILITY — IMAGE CARDS ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>{t.reliabilityBadge}</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">{t.reliabilityTitle}<br />{t.reliabilityTitleSpan}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELIABILITY_CARDS.map((item, i) => (
              <div key={i} className="border border-slate-100 overflow-hidden group hover:shadow-xl hover:border-pc-gold transition-all duration-500">
                <div className="h-40 overflow-hidden relative">
                  <img src={item.img} alt={getTranslatedValue(item.title, currentLang)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-3xl">{item.icon}</div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-pc-green mb-2">{getTranslatedValue(item.title, currentLang)}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily:'sans-serif' }}>{getTranslatedValue(item.desc, currentLang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-32 bg-[#0a192f] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:`url(${IMG.canton2})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-transparent to-[#0a192f]" />
        <div className="max-w-3xl mx-auto px-8 relative z-10">
          <span className="text-pc-gold text-[10px] uppercase tracking-[0.5em] font-black block mb-8" style={{ fontFamily:'sans-serif' }}>{t.ctaBadge}</span>
          <h2 className="text-4xl md:text-6xl leading-tight mb-8 italic">
            {t.ctaTitle}<br />{t.ctaTitleLine2}<br /><span className="text-pc-gold">{t.ctaTitleSpan}</span>
          </h2>
          <p className="text-white/50 text-sm mb-14 leading-relaxed" style={{ fontFamily:'sans-serif' }}>
            {t.ctaDesc}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/book-appointment">
              <button className="bg-pc-gold text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all shadow-2xl" style={{ fontFamily:'sans-serif' }}>
                {t.ctaBtnBook}
              </button>
            </Link>
            <Link to="/book-appointment">
              <button className="border border-white/30 text-white px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:border-pc-gold hover:text-pc-gold transition-all" style={{ fontFamily:'sans-serif' }}>
                {t.ctaBtnAsk}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sourcing;