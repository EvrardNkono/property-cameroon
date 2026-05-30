import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// ============================================
// CONFIGURATION & IMAGES
// ============================================
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

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

// Images pour les héros des catégories
const HERO_IMAGES = {
  agricultural: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800&q=80",
  livestock: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1800&q=80",
  sourcing: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1800&q=80"
};

// Images pour les produits en sourcing
const SOURCING_IMAGES = {
  irrigation: "/images/globalirigationkit.jfif",
  press: "/images/compactoil.jfif",
  dryer: "/images/dryingunit.jfif",
};

// Produits de sourcing (matériel chinois) - avec versions traduites
const getSourcingProducts = (t) => [
  { 
    id: 'sourcing-1',
    title: { fr: "Kit d'irrigation solaire", en: "Solar Irrigation Kit" },
    price: "From 249,000 FCFA", 
    img: SOURCING_IMAGES.irrigation, 
    tag: { fr: "MEILLEURE VENTE", en: "BEST SELLER" },
    desc: { 
      fr: "Système autonome pour 1 hectare. Zéro carburant. Inclut panneau 300W, pompe submersible, tuyaux PE et programmateur. Installé en 4 heures.",
      en: "Autonomous system for 1 hectare. Zero fuel. Includes 300W panel, submersible pump, PE pipes and timer. Installed in 4 hours."
    },
    origin: { fr: "Guangzhou, Chine", en: "Guangzhou, China" },
    delivery: { fr: "4-6 semaines", en: "4-6 weeks" }
  },
  { 
    id: 'sourcing-2',
    title: { fr: "Presse à huile compacte", en: "Compact Oil Press" }, 
    price: "From 450,000 FCFA", 
    img: SOURCING_IMAGES.press, 
    tag: { fr: "TOP QUALITÉ", en: "TOP QUALITY" },
    desc: { 
      fr: "Rendement 85–92%. Traite palme, arachide, sésame. Capacité 50–80 kg/h. Moteur monophasé 2,2 kW. Acier inoxydable alimentaire.",
      en: "85–92% yield. Processes palm, peanut, sesame. Capacity 50–80 kg/h. 2.2 kW single-phase motor. Food-grade stainless steel."
    },
    origin: { fr: "Zhejiang, Chine", en: "Zhejiang, China" },
    delivery: { fr: "6-8 semaines", en: "6-8 weeks" }
  },
  { 
    id: 'sourcing-3',
    title: { fr: "Séchoir professionnel", en: "Professional Dryer" }, 
    price: "From 185,000 FCFA", 
    img: SOURCING_IMAGES.dryer, 
    tag: { fr: "POST-RÉCOLTE", en: "POST-HARVEST" },
    desc: { 
      fr: "Pour cacao, café, maïs, manioc. Température réglable 40–80°C. Capacité 200 kg/cycle. Économie d'énergie 70% vs séchage solaire traditionnel.",
      en: "For cocoa, coffee, maize, cassava. Adjustable temperature 40–80°C. Capacity 200 kg/cycle. 70% energy saving vs traditional solar drying."
    },
    origin: { fr: "Guangdong, Chine", en: "Guangdong, China" },
    delivery: { fr: "5-7 semaines", en: "5-7 weeks" }
  },
];

// Données mock pour les produits agricoles (à remplacer par API) - versions traduites
const getMockAgriculturalProducts = (t) => [
  {
    id: 'agri-1',
    name: { fr: "Poivre blanc de Penja", en: "Penja White Pepper" },
    category: { fr: "Épices", en: "Spices" },
    price: { amount: 12500, currency: "FCFA" },
    unit: { fr: "kg", en: "kg" },
    origin: { fr: "Penja, Littoral", en: "Penja, Littoral" },
    image: "https://images.unsplash.com/photo-1588262590626-82a6e1c6f3e0?w=600&q=80",
    description: { 
      fr: "AOP certifié, reconnu pour son arôme et sa saveur intenses. Cultivé dans des sols volcaniques.",
      en: "Certified AOP, known for its intense aroma and flavor. Grown in volcanic soils."
    },
    certifications: ["AOP", "BIO"],
    stock: 500,
    farmer: { fr: "Coopérative de Penja", en: "Penja Cooperative" }
  },
  {
    id: 'agri-2',
    name: { fr: "Café Arabica de Foumbot", en: "Foumbot Arabica Coffee" },
    category: { fr: "Céréales", en: "Cereals" },
    price: { amount: 8500, currency: "FCFA" },
    unit: { fr: "kg", en: "kg" },
    origin: { fr: "Foumbot, Ouest", en: "Foumbot, West" },
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80",
    description: { 
      fr: "Arabica de haute altitude aux notes de chocolat et d'agrumes. Directement des agriculteurs.",
      en: "High-altitude Arabica with notes of chocolate and citrus. Direct from farmers."
    },
    certifications: ["Fair Trade"],
    stock: 1200,
    farmer: { fr: "Union des agriculteurs de Foumbot", en: "Foumbot Farmers Union" }
  },
  {
    id: 'agri-3',
    name: { fr: "Fèves de cacao bio", en: "Organic Cocoa Beans" },
    category: { fr: "Céréales", en: "Cereals" },
    price: { amount: 3200, currency: "FCFA" },
    unit: { fr: "kg", en: "kg" },
    origin: { fr: "Ebolowa, Sud", en: "Ebolowa, South" },
    image: "https://images.unsplash.com/photo-1595937691574-639c682d58c2?w=600&q=80",
    description: { 
      fr: "Fèves de cacao Trinitario premium. Fermentées et séchées au soleil. Idéales pour le chocolat artisanal.",
      en: "Premium Trinitario cocoa beans. Fermented and sun-dried. Ideal for artisanal chocolate."
    },
    certifications: ["BIO", "Fair Trade"],
    stock: 5000,
    farmer: { fr: "Coopérative Cacao du Sud", en: "South Cocoa Cooperative" }
  },
  {
    id: 'agri-4',
    name: { fr: "Chips de plantain", en: "Plantain Chips" },
    category: { fr: "Transformation", en: "Transformation" },
    price: { amount: 2500, currency: "FCFA" },
    unit: { fr: "paquet", en: "pack" },
    origin: { fr: "Douala, Littoral", en: "Douala, Littoral" },
    image: "https://images.unsplash.com/photo-1593025221947-5b9d2ac62d3e?w=600&q=80",
    description: { 
      fr: "Chips de plantain croustillantes et salées. Fabriquées avec des épices locales. Sachet de 200g.",
      en: "Crunchy, salted plantain chips. Made with local spices. 200g pack."
    },
    certifications: [],
    stock: 2000,
    farmer: { fr: "Douala Agro Processing", en: "Douala Agro Processing" }
  },
  {
    id: 'agri-5',
    name: { fr: "Ananas frais", en: "Fresh Pineapples" },
    category: { fr: "Fruits", en: "Fruits" },
    price: { amount: 1500, currency: "FCFA" },
    unit: { fr: "pièce", en: "piece" },
    origin: { fr: "Nkoteng, Centre", en: "Nkoteng, Center" },
    image: "https://images.unsplash.com/photo-1589394819964-4b3f91127d68?w=600&q=80",
    description: { 
      fr: "Ananas MD2 sucrés et juteux. Récoltés à maturité maximale. Qualité export.",
      en: "Sweet, juicy MD2 pineapples. Harvested at peak ripeness. Export quality."
    },
    certifications: ["GlobalGAP"],
    stock: 3500,
    farmer: { fr: "Producteurs d'ananas du Centre", en: "Center Pineapple Growers" }
  }
];

// Données mock pour les livestock (à remplacer par API) - versions traduites
const getMockLivestock = (t) => [
  {
    id: 'live-1',
    title: { fr: "Élevage de poulets de chair – Douala", en: "Broiler Poultry Farm – Douala" },
    category: { fr: "Volaille", en: "Poultry" },
    price: { amount: 25000000, currency: "FCFA" },
    capacity: { value: 5000, unit: { fr: "têtes", en: "heads" } },
    roi: 22,
    cycleDuration: { fr: "2 mois", en: "2 months" },
    location: { fr: "Douala, Littoral", en: "Douala, Littoral" },
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80",
    description: { 
      fr: "Élevage moderne de poulets de chair d'une capacité de 5 000 têtes. Système d'alimentation et accès vétérinaire inclus.",
      en: "Modern broiler poultry farm with 5,000 heads capacity. Includes feeding system and veterinary access."
    }
  },
  {
    id: 'live-2',
    title: { fr: "Élevage de poulets villageois – Dschang", en: "Village Chicken Farm – Dschang" },
    category: { fr: "Volaille", en: "Poultry" },
    price: { amount: 4000000, currency: "FCFA" },
    capacity: { value: 800, unit: { fr: "têtes", en: "heads" } },
    roi: 40,
    cycleDuration: { fr: "6 mois", en: "6 months" },
    location: { fr: "Dschang, Ouest", en: "Dschang, West" },
    image: "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=600&q=80",
    description: { 
      fr: "Poulet bicyclette élevé en plein air – prix premium sur le marché, faibles coûts d'alimentation.",
      en: "Free-range indigenous 'poulet bicyclette' – premium market price, low feed costs."
    }
  },
  {
    id: 'live-3',
    title: { fr: "Élevage porcin moderne – Douala", en: "Modern Pig Farm – Douala" },
    category: { fr: "Porcs", en: "Pigs" },
    price: { amount: 25500000, currency: "FCFA" },
    capacity: { value: 300, unit: { fr: "têtes", en: "heads" } },
    roi: 18,
    cycleDuration: { fr: "6 mois", en: "6 months" },
    location: { fr: "Douala, Littoral", en: "Douala, Littoral" },
    image: "https://images.unsplash.com/photo-1516467504853-51623d4d5c3f?w=600&q=80",
    description: { 
      fr: "Élevage porcin moderne avec enclos en béton, ventilation et mesures de biosécurité.",
      en: "Modern pig farm with concrete pens, ventilation, and biosecurity measures."
    }
  },
  {
    id: 'live-4',
    title: { fr: "Parc d'engraissement bovin – Ngaoundéré", en: "Cattle Feedlot – Ngaoundéré" },
    category: { fr: "Bovins", en: "Cattle" },
    price: { amount: 35000000, currency: "FCFA" },
    capacity: { value: 100, unit: { fr: "têtes", en: "heads" } },
    roi: 8,
    cycleDuration: { fr: "18 mois", en: "18 months" },
    location: { fr: "Ngaoundéré, Adamaoua", en: "Ngaoundéré, Adamawa" },
    image: "https://images.unsplash.com/photo-1570042225831-d96fa9b0ab6b?w=600&q=80",
    description: { 
      fr: "Parc d'engraissement moderne de 100 têtes de zébus. Approvisionnement direct aux bouchers de Douala.",
      en: "Modern feedlot with 100 heads of zebu cattle. Direct supply to butchers in Douala."
    }
  },
  {
    id: 'live-5',
    title: { fr: "Élevage caprin – Yaoundé", en: "Goat Farm – Yaoundé" },
    category: { fr: "Chèvres", en: "Goats" },
    price: { amount: 9000000, currency: "FCFA" },
    capacity: { value: 200, unit: { fr: "têtes", en: "heads" } },
    roi: 22,
    cycleDuration: { fr: "6 mois", en: "6 months" },
    location: { fr: "Yaoundé, Centre", en: "Yaoundé, Center" },
    image: "https://images.unsplash.com/photo-1524024974431-b39ccf726cc0?w=600&q=80",
    description: { 
      fr: "Élevage caprin moderne avec races améliorées. Forte demande pour la viande de chèvre.",
      en: "Modern goat farm with improved breeds. High demand for chevron."
    }
  }
];

// 🔥 FONCTION POUR OBTENIR L'URL CORRECTE DES IMAGES
const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/livestock/${image}`;
};

// Fonction utilitaire pour obtenir la valeur traduite d'un objet ou d'une string
const getTranslatedValue = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value[lang]) return value[lang];
  if (typeof value === 'object' && value.fr) return value.fr;
  return String(value);
};

// Fonction utilitaire pour afficher une location (objet ou string) avec traduction
const formatLocation = (location, lang) => {
  if (!location) return getTranslatedValue({ fr: 'Cameroun', en: 'Cameroon' }, lang);
  if (typeof location === 'string') return location;
  if (typeof location === 'object') {
    if (location.city && location.region) {
      const city = getTranslatedValue(location.city, lang);
      const region = getTranslatedValue(location.region, lang);
      return `${city}, ${region}`;
    }
    if (location.city) return getTranslatedValue(location.city, lang);
    if (location.region) return getTranslatedValue(location.region, lang);
  }
  return getTranslatedValue({ fr: 'Cameroun', en: 'Cameroon' }, lang);
};

// Composant Hero par catégorie
const MarketplaceHero = ({ activeCategory, t }) => {
  const heroes = {
    agricultural: {
      title: t.hero.agricultural.title,
      subtitle: t.hero.agricultural.subtitle,
      description: t.hero.agricultural.description,
      image: HERO_IMAGES.agricultural,
      cta: t.hero.agricultural.cta
    },
    livestock: {
      title: t.hero.livestock.title,
      subtitle: t.hero.livestock.subtitle,
      description: t.hero.livestock.description,
      image: HERO_IMAGES.livestock,
      cta: t.hero.livestock.cta
    },
    sourcing: {
      title: t.hero.sourcing.title,
      subtitle: t.hero.sourcing.subtitle,
      description: t.hero.sourcing.description,
      image: HERO_IMAGES.sourcing,
      cta: t.hero.sourcing.cta
    }
  };

  const data = heroes[activeCategory] || heroes.agricultural;

  return (
    <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={data.image} alt={data.title} className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />
      </div>
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#c8a84b 1px,transparent 1px),linear-gradient(90deg,#c8a84b 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">
              {data.subtitle}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6">
              {data.title}
            </h1>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md mb-10">
              {data.description}
            </p>
            <button className="bg-pc-gold text-slate-900 px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">
              {data.cta} →
            </button>
          </div>

          <div className="relative">
            <div className="aspect-square relative z-10 border border-pc-gold/20 p-4 bg-black/20 backdrop-blur-sm">
              <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Product Card pour les produits agricoles
const AgriculturalProductCard = ({ product, onViewDetail, t, lang }) => {
  const displayOrigin = getTranslatedValue(product.origin, lang);
  const displayName = getTranslatedValue(product.name, lang);
  const displayCategory = getTranslatedValue(product.category, lang);
  const displayDescription = getTranslatedValue(product.description, lang);
  const displayUnit = getTranslatedValue(product.unit, lang);
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
      onClick={() => onViewDetail(product)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; }}
        />
        <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-[9px] font-bold">
          {displayCategory}
        </div>
        {product.certifications?.length > 0 && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-[8px] font-bold">
            {product.certifications[0]}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{displayName}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">📍 {displayOrigin}</span>
        </div>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{displayDescription}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-emerald-700">
              {product.price.amount.toLocaleString()} <span className="text-xs">{product.price.currency}</span>
            </p>
            <p className="text-[10px] text-gray-400">{t.per} {displayUnit}</p>
          </div>
          <button className="text-emerald-600 text-xs font-bold group-hover:gap-2 transition-all flex items-center gap-1">
            {t.view} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Livestock Card
const LivestockCard = ({ asset, onViewDetail, t, lang }) => {
  const displayLocation = formatLocation(asset.location, lang);
  const displayTitle = getTranslatedValue(asset.title, lang);
  const displayDescription = getTranslatedValue(asset.description, lang);
  const displayCategory = getTranslatedValue(asset.category, lang);
  const displayCycle = getTranslatedValue(asset.cycleDuration, lang);
  const displayUnit = getTranslatedValue(asset.capacity?.unit, lang);
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
      onClick={() => onViewDetail(asset)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={asset.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80'} 
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { 
            e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80';
          }}
        />
        <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-[9px] font-bold">
          +{asset.roi}% ROI
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[9px] font-bold flex items-center gap-1">
          📍 {displayLocation}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{displayTitle}</h3>
        <div className="flex gap-3 mb-3">
          <div className="text-xs">
            <span className="text-gray-400">{t.capacity}</span>
            <p className="font-bold">{asset.capacity?.value} {displayUnit}</p>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">{t.cycle}</span>
            <p className="font-bold">{displayCycle}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-emerald-700">
              {(asset.price?.amount / 1000000).toFixed(1)}M <span className="text-xs">{asset.price?.currency}</span>
            </p>
          </div>
          <button className="text-emerald-600 text-xs font-bold group-hover:gap-2 transition-all flex items-center gap-1">
            {t.invest} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Sourcing Card
const SourcingCard = ({ product, onViewDetail, t, lang }) => {
  const displayOrigin = getTranslatedValue(product.origin, lang);
  const displayTitle = getTranslatedValue(product.title, lang);
  const displayTag = getTranslatedValue(product.tag, lang);
  const displayDesc = getTranslatedValue(product.desc, lang);
  const displayDelivery = getTranslatedValue(product.delivery, lang);
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
      onClick={() => onViewDetail(product)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.img} 
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; }}
        />
        <div className="absolute top-3 left-3 bg-pc-gold text-pc-green px-2 py-1 rounded-full text-[9px] font-bold">
          {displayTag}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{displayTitle}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span>🇨🇳 {displayOrigin}</span>
          <span>🚢 {displayDelivery}</span>
        </div>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{displayDesc}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-pc-gold">{product.price}</p>
            <p className="text-[10px] text-gray-400">{t.exFactoryPrice}</p>
          </div>
          <button className="text-pc-green text-xs font-bold group-hover:gap-2 transition-all flex items-center gap-1">
            {t.quote} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal Marketplace
const MarketplacePage = () => {
  const currentLang = useCurrentLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [agriculturalProducts, setAgriculturalProducts] = useState([]);
  const [livestockAssets, setLivestockAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Navigation & Labels
      oneStopShop: "One Stop Shop",
      marketplace: "Marketplace",
      marketplaceDesc: "Produits agricoles, actifs d'élevage et approvisionnement depuis la Chine — tout en un seul endroit",
      
      // Categories
      all: "Tous",
      agriculturalProducts: "Produits Agricoles",
      livestockAssets: "Actifs d'Élevage",
      sourcingChina: "Approvisionnement (Chine)",
      
      // Hero
      hero: {
        agricultural: {
          title: "Produits Agricoles",
          subtitle: "Directement des agriculteurs camerounais",
          description: "Des sols volcaniques de Foumbot aux rives de Kribi. Achetez des produits agricoles premium directement des producteurs.",
          cta: "Découvrir la Récolte"
        },
        livestock: {
          title: "Actifs d'Élevage",
          subtitle: "Investissez dans des unités de production certifiées",
          description: "Actifs d'élevage à haut rendement disponibles pour investissement. Cycles courts, rendements sécurisés, transparence totale.",
          cta: "Investir Maintenant"
        },
        sourcing: {
          title: "Approvisionnement de Chine",
          subtitle: "Prix directs d'usine",
          description: "Accompagnement complet par nos experts de Yaoundé et Canton. Processus sécurisé en 6 étapes, équipements à prix usine.",
          cta: "Sourcer du Matériel"
        }
      },
      
      // Cards
      capacity: "Capacité",
      cycle: "Cycle",
      per: "par",
      view: "Voir",
      invest: "Investir",
      quote: "Devis",
      exFactoryPrice: "prix départ usine",
      
      // Section titles
      allMarketplaces: "Tous les Marketplaces",
      freshFromFarms: "Frais des fermes camerounaises",
      certifiedUnits: "Unités de production certifiées pour l'investissement",
      directFactoryPrices: "Prix directs d'usine depuis la Chine",
      exploreAll: "Explorez tous nos marketplaces",
      
      // CTA Section
      readyToStart: "Prêt à commencer votre aventure ?",
      contactExperts: "Contactez nos experts pour une consultation personnalisée",
      bookFreeConsultation: "Réserver une Consultation Gratuite →",
      
      // Empty states
      noItems: "Aucun article disponible dans cette catégorie.",
      
      // Loading
      loading: "Chargement..."
    },
    en: {
      // Navigation & Labels
      oneStopShop: "One Stop Shop",
      marketplace: "Marketplace",
      marketplaceDesc: "Agricultural products, livestock assets, and sourcing from China — all in one place",
      
      // Categories
      all: "All",
      agriculturalProducts: "Agricultural Products",
      livestockAssets: "Livestock Assets",
      sourcingChina: "Sourcing (China)",
      
      // Hero
      hero: {
        agricultural: {
          title: "Agricultural Products",
          subtitle: "Direct from Cameroonian farmers",
          description: "From the volcanic soils of Foumbot to the shores of Kribi. Buy premium agricultural products directly from producers.",
          cta: "Shop the Harvest"
        },
        livestock: {
          title: "Livestock Assets",
          subtitle: "Invest in certified production units",
          description: "High-yield livestock assets available for investment. Short cycles, secure returns, full transparency.",
          cta: "Invest Now"
        },
        sourcing: {
          title: "Sourcing from China",
          subtitle: "Direct factory prices",
          description: "Complete guide by our experts in Yaoundé and Canton. Secure 6-step process, equipment at factory prices.",
          cta: "Source Equipment"
        }
      },
      
      // Cards
      capacity: "Capacity",
      cycle: "Cycle",
      per: "per",
      view: "View",
      invest: "Invest",
      quote: "Quote",
      exFactoryPrice: "ex-factory price",
      
      // Section titles
      allMarketplaces: "All Marketplaces",
      freshFromFarms: "Fresh from Cameroonian farms",
      certifiedUnits: "Certified production units for investment",
      directFactoryPrices: "Direct factory prices from China",
      exploreAll: "Explore all our marketplaces",
      
      // CTA Section
      readyToStart: "Ready to start your journey?",
      contactExperts: "Contact our experts for a personalized consultation",
      bookFreeConsultation: "Book a Free Consultation →",
      
      // Empty states
      noItems: "No items available in this category.",
      
      // Loading
      loading: "Loading..."
    }
  }[currentLang] || {
    // Fallback français
    oneStopShop: "One Stop Shop",
    marketplace: "Marketplace",
    marketplaceDesc: "Produits agricoles, actifs d'élevage et approvisionnement depuis la Chine — tout en un seul endroit",
    all: "Tous",
    agriculturalProducts: "Produits Agricoles",
    livestockAssets: "Actifs d'Élevage",
    sourcingChina: "Approvisionnement (Chine)",
    hero: {
      agricultural: {
        title: "Produits Agricoles",
        subtitle: "Directement des agriculteurs camerounais",
        description: "Des sols volcaniques de Foumbot aux rives de Kribi. Achetez des produits agricoles premium directement des producteurs.",
        cta: "Découvrir la Récolte"
      },
      livestock: {
        title: "Actifs d'Élevage",
        subtitle: "Investissez dans des unités de production certifiées",
        description: "Actifs d'élevage à haut rendement disponibles pour investissement. Cycles courts, rendements sécurisés, transparence totale.",
        cta: "Investir Maintenant"
      },
      sourcing: {
        title: "Approvisionnement de Chine",
        subtitle: "Prix directs d'usine",
        description: "Accompagnement complet par nos experts de Yaoundé et Canton. Processus sécurisé en 6 étapes, équipements à prix usine.",
        cta: "Sourcer du Matériel"
      }
    },
    capacity: "Capacité",
    cycle: "Cycle",
    per: "par",
    view: "Voir",
    invest: "Investir",
    quote: "Devis",
    exFactoryPrice: "prix départ usine",
    allMarketplaces: "Tous les Marketplaces",
    freshFromFarms: "Frais des fermes camerounaises",
    certifiedUnits: "Unités de production certifiées pour l'investissement",
    directFactoryPrices: "Prix directs d'usine depuis la Chine",
    exploreAll: "Explorez tous nos marketplaces",
    readyToStart: "Prêt à commencer votre aventure ?",
    contactExperts: "Contactez nos experts pour une consultation personnalisée",
    bookFreeConsultation: "Réserver une Consultation Gratuite →",
    noItems: "Aucun article disponible dans cette catégorie.",
    loading: "Chargement..."
  };

  // Catégories du marketplace avec traduction
  const marketCategories = [
    { id: 'all', name: t.all, icon: '🌍', color: 'from-slate-600 to-slate-700' },
    { id: 'agricultural', name: t.agriculturalProducts, icon: '🌾', color: 'from-emerald-600 to-teal-600' },
    { id: 'livestock', name: t.livestockAssets, icon: '🐄', color: 'from-amber-600 to-orange-600' },
    { id: 'sourcing', name: t.sourcingChina, icon: '🇨🇳', color: 'from-red-600 to-rose-600' },
  ];

  const sourcingProducts = getSourcingProducts(t);

  // 🔥 Fonction pour normaliser les données livestock
  const normalizeLivestockData = (items, lang) => {
    if (!items || items.length === 0) return [];
    return items.map(item => ({
      ...item,
      id: item._id || item.id,
      title: item.title,
      location: item.location,
      description: item.description,
      category: item.category,
      cycleDuration: item.cycleDuration,
      image: item.images && item.images[0] 
        ? getImageUrl(item.images[0]) 
        : (item.image || getMockLivestock(t).find(m => m.id === item.id)?.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80'),
    }));
  };

  // Fonction pour normaliser les données agricoles
  const normalizeAgriculturalData = (items, lang) => {
    if (!items || items.length === 0) return [];
    return items.map(item => ({
      ...item,
      id: item._id || item.id,
      name: item.name,
      origin: item.origin,
      description: item.description,
      category: item.category,
      unit: item.unit,
      image: item.images && item.images[0] 
        ? (item.images[0].startsWith('http') ? item.images[0] : `${BACKEND_URL}${item.images[0]}`)
        : (item.image || getMockAgriculturalProducts(t).find(m => m.id === item.id)?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'),
    }));
  };

  // Charger les données depuis l'API
  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // Produits agricoles — skip si 401, utiliser mock directement
      let agriData = getMockAgriculturalProducts(null);
      try {
        const agriRes = await api.get(`/agriculture/products?lang=${currentLang}`);
        if (agriRes.products?.length > 0) {
          agriData = agriRes.products;
        }
      } catch (agriErr) {
        // 401 ou autre erreur → mock déjà assigné, on continue
      }
      setAgriculturalProducts(normalizeAgriculturalData(agriData, currentLang));

      // Livestock
      let liveData = getMockLivestock(null);
      try {
        const liveRes = await api.get(`/livestock?status=AVAILABLE&lang=${currentLang}`);
        if (liveRes.livestock?.length > 0) {
          liveData = liveRes.livestock;
        }
      } catch (liveErr) {
        // 401 ou autre erreur → mock déjà assigné
      }
      const normalizedLive = normalizeLivestockData(liveData, currentLang);
      setLivestockAssets(normalizedLive);

      console.log(`📦 Marketplace loaded - Lang: ${currentLang}`);
      console.log('Livestock loaded:', normalizedLive.length);

    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [currentLang]); // ← UNIQUEMENT currentLang, jamais t

  const getDisplayedItems = () => {
    switch (activeCategory) {
      case 'agricultural':
        return agriculturalProducts;
      case 'livestock':
        return livestockAssets;
      case 'sourcing':
        return sourcingProducts;
      default:
        return [...agriculturalProducts.slice(0, 3), ...livestockAssets.slice(0, 3), ...sourcingProducts];
    }
  };

  const getTitleForCategory = () => {
    switch (activeCategory) {
      case 'agricultural': return t.agriculturalProducts;
      case 'livestock': return t.livestockAssets;
      case 'sourcing': return t.sourcingChina;
      default: return t.allMarketplaces;
    }
  };

  const getSubtitleForCategory = () => {
    switch (activeCategory) {
      case 'agricultural': return t.freshFromFarms;
      case 'livestock': return t.certifiedUnits;
      case 'sourcing': return t.directFactoryPrices;
      default: return t.exploreAll;
    }
  };

  const handleViewDetail = (item) => {
    setSelectedProduct(item);
    if (activeCategory === 'agricultural' || (activeCategory === 'all' && item.price?.currency && !item.roi)) {
      console.log('View agricultural product:', item);
    } else if (activeCategory === 'livestock' || (activeCategory === 'all' && item.roi)) {
      console.log('View livestock asset:', item);
    } else {
      console.log('View sourcing product:', item);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {activeCategory !== 'all' && <MarketplaceHero activeCategory={activeCategory} t={t} />}
      
      {activeCategory === 'all' && (
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">{t.oneStopShop}</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">{t.marketplace}</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              {t.marketplaceDesc}
            </p>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {marketCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-serif text-gray-900">{getTitleForCategory()}</h2>
            <p className="text-gray-500 mt-2">{getSubtitleForCategory()}</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDisplayedItems().map((item, idx) => {
                const isAgricultural = item.price?.currency && !item.roi && item.unit;
                const isLivestock = item.roi !== undefined && item.capacity;
                const isSourcing = item.origin && (typeof item.origin === 'object' || item.origin?.includes('China') || item.delivery);
                
                if (activeCategory === 'agricultural' || (activeCategory === 'all' && isAgricultural)) {
                  return <AgriculturalProductCard key={item.id || idx} product={item} onViewDetail={handleViewDetail} t={t} lang={currentLang} />;
                } else if (activeCategory === 'livestock' || (activeCategory === 'all' && isLivestock)) {
                  return <LivestockCard key={item.id || idx} asset={item} onViewDetail={handleViewDetail} t={t} lang={currentLang} />;
                } else if (activeCategory === 'sourcing' || (activeCategory === 'all' && isSourcing)) {
                  return <SourcingCard key={item.id || idx} product={item} onViewDetail={handleViewDetail} t={t} lang={currentLang} />;
                }
                return null;
              })}
            </div>
          )}

          {getDisplayedItems().length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-400">{t.noItems}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            {t.readyToStart}
          </h2>
          <p className="text-slate-400 mb-8">
            {t.contactExperts}
          </p>
          <Link to="/book-appointment">
            <button className="bg-pc-gold text-slate-900 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
              {t.bookFreeConsultation}
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Composant ArrowRight local
const ArrowRight = ({ size = 12, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default MarketplacePage;