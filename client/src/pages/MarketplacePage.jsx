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
  canton1: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
  canton2: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=900&q=80",
  china: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=900&q=80",
  farmer: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80",
  contract: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80",
  shipping: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80",
};

// Produits de sourcing (matériel chinois)
const SOURCING_PRODUCTS = [
  { 
    id: 'sourcing-1',
    title: "Solar Irrigation Kit", 
    price: "From 249,000 FCFA", 
    img: SOURCING_IMAGES.irrigation, 
    tag: "BEST SELLER",
    desc: "Autonomous system for 1 hectare. Zero fuel. Includes 300W panel, submersible pump, PE pipes and timer. Installed in 4 hours.",
    origin: "Guangzhou, China",
    delivery: "4-6 weeks"
  },
  { 
    id: 'sourcing-2',
    title: "Compact Oil Press", 
    price: "From 450,000 FCFA", 
    img: SOURCING_IMAGES.press, 
    tag: "TOP QUALITY",
    desc: "85–92% yield. Processes palm, peanut, sesame. Capacity 50–80 kg/h. 2.2 kW single-phase motor. Food-grade stainless steel.",
    origin: "Zhejiang, China",
    delivery: "6-8 weeks"
  },
  { 
    id: 'sourcing-3',
    title: "Professional Dryer", 
    price: "From 185,000 FCFA", 
    img: SOURCING_IMAGES.dryer, 
    tag: "POST-HARVEST",
    desc: "For cocoa, coffee, maize, cassava. Adjustable temperature 40–80°C. Capacity 200 kg/cycle. 70% energy saving vs traditional solar drying.",
    origin: "Guangdong, China",
    delivery: "5-7 weeks"
  },
];

// Données mock pour les produits agricoles (à remplacer par API)
const MOCK_AGRICULTURAL_PRODUCTS = [
  {
    id: 'agri-1',
    name: "Penja White Pepper",
    category: "Spices",
    price: { amount: 12500, currency: "FCFA" },
    unit: "kg",
    origin: "Penja, Littoral",
    image: "https://images.unsplash.com/photo-1588262590626-82a6e1c6f3e0?w=600&q=80",
    description: "Certified AOP, known for its intense aroma and flavor. Grown in volcanic soils.",
    certifications: ["AOP", "BIO"],
    stock: 500,
    farmer: "Penja Cooperative"
  },
  {
    id: 'agri-2',
    name: "Foumbot Arabica Coffee",
    category: "Cereals",
    price: { amount: 8500, currency: "FCFA" },
    unit: "kg",
    origin: "Foumbot, West",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80",
    description: "High-altitude Arabica with notes of chocolate and citrus. Direct from farmers.",
    certifications: ["Fair Trade"],
    stock: 1200,
    farmer: "Foumbot Farmers Union"
  },
  {
    id: 'agri-3',
    name: "Organic Cocoa Beans",
    category: "Cereals",
    price: { amount: 3200, currency: "FCFA" },
    unit: "kg",
    origin: "Ebolowa, South",
    image: "https://images.unsplash.com/photo-1595937691574-639c682d58c2?w=600&q=80",
    description: "Premium Trinitario cocoa beans. Fermented and sun-dried. Ideal for artisanal chocolate.",
    certifications: ["BIO", "Fair Trade"],
    stock: 5000,
    farmer: "South Cocoa Cooperative"
  },
  {
    id: 'agri-4',
    name: "Plantain Chips",
    category: "Transformation",
    price: { amount: 2500, currency: "FCFA" },
    unit: "pack",
    origin: "Douala, Littoral",
    image: "https://images.unsplash.com/photo-1593025221947-5b9d2ac62d3e?w=600&q=80",
    description: "Crunchy, salted plantain chips. Made with local spices. 200g pack.",
    certifications: [],
    stock: 2000,
    farmer: "Douala Agro Processing"
  },
  {
    id: 'agri-5',
    name: "Fresh Pineapples",
    category: "Fruits",
    price: { amount: 1500, currency: "FCFA" },
    unit: "piece",
    origin: "Nkoteng, Center",
    image: "https://images.unsplash.com/photo-1589394819964-4b3f91127d68?w=600&q=80",
    description: "Sweet, juicy MD2 pineapples. Harvested at peak ripeness. Export quality.",
    certifications: ["GlobalGAP"],
    stock: 3500,
    farmer: "Center Pineapple Growers"
  }
];

// Données mock pour les livestock (à remplacer par API)
const MOCK_LIVESTOCK = [
  {
    id: 'live-1',
    title: "Broiler Poultry Farm – Douala",
    category: "Poultry",
    price: { amount: 25000000, currency: "FCFA" },
    capacity: { value: 5000, unit: "heads" },
    roi: 22,
    cycleDuration: "2 months",
    location: "Douala, Littoral",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80",
    description: "Modern broiler poultry farm with 5,000 heads capacity. Includes feeding system and veterinary access."
  },
  {
    id: 'live-2',
    title: "Village Chicken Farm – Dschang",
    category: "Poultry",
    price: { amount: 4000000, currency: "FCFA" },
    capacity: { value: 800, unit: "heads" },
    roi: 40,
    cycleDuration: "6 months",
    location: "Dschang, West",
    image: "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=600&q=80",
    description: "Free-range indigenous 'poulet bicyclette' – premium market price, low feed costs."
  },
  {
    id: 'live-3',
    title: "Modern Pig Farm – Douala",
    category: "Pigs",
    price: { amount: 25500000, currency: "FCFA" },
    capacity: { value: 300, unit: "heads" },
    roi: 18,
    cycleDuration: "6 months",
    location: "Douala, Littoral",
    image: "https://images.unsplash.com/photo-1516467504853-51623d4d5c3f?w=600&q=80",
    description: "Modern pig farm with concrete pens, ventilation, and biosecurity measures."
  },
  {
    id: 'live-4',
    title: "Cattle Feedlot – Ngaoundéré",
    category: "Cattle",
    price: { amount: 35000000, currency: "FCFA" },
    capacity: { value: 100, unit: "heads" },
    roi: 8,
    cycleDuration: "18 months",
    location: "Ngaoundéré, Adamawa",
    image: "https://images.unsplash.com/photo-1570042225831-d96fa9b0ab6b?w=600&q=80",
    description: "Modern feedlot with 100 heads of zebu cattle. Direct supply to butchers in Douala."
  },
  {
    id: 'live-5',
    title: "Goat Farm – Yaoundé",
    category: "Goats",
    price: { amount: 9000000, currency: "FCFA" },
    capacity: { value: 200, unit: "heads" },
    roi: 22,
    cycleDuration: "6 months",
    location: "Yaoundé, Center",
    image: "https://images.unsplash.com/photo-1524024974431-b39ccf726cc0?w=600&q=80",
    description: "Modern goat farm with improved breeds. High demand for chevron."
  }
];

// Catégories du marketplace
const MARKET_CATEGORIES = [
  { id: 'all', name: 'All', icon: '🌍', color: 'from-slate-600 to-slate-700' },
  { id: 'agricultural', name: 'Agricultural Products', icon: '🌾', color: 'from-emerald-600 to-teal-600' },
  { id: 'livestock', name: 'Livestock Assets', icon: '🐄', color: 'from-amber-600 to-orange-600' },
  { id: 'sourcing', name: 'Sourcing (China)', icon: '🇨🇳', color: 'from-red-600 to-rose-600' },
];

// Composant Hero par catégorie
const MarketplaceHero = ({ activeCategory }) => {
  const heroes = {
    agricultural: {
      title: "Agricultural Products",
      subtitle: "Direct from Cameroonian farmers",
      description: "From the volcanic soils of Foumbot to the shores of Kribi. Buy premium agricultural products directly from producers.",
      image: HERO_IMAGES.agricultural,
      cta: "Shop the Harvest"
    },
    livestock: {
      title: "Livestock Assets",
      subtitle: "Invest in certified production units",
      description: "High-yield livestock assets available for investment. Short cycles, secure returns, full transparency.",
      image: HERO_IMAGES.livestock,
      cta: "Invest Now"
    },
    sourcing: {
      title: "Sourcing from China",
      subtitle: "Direct factory prices",
      description: "Complete guide by our experts in Yaoundé and Canton. Secure 6-step process, equipment at factory prices.",
      image: HERO_IMAGES.sourcing,
      cta: "Source Equipment"
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
const AgriculturalProductCard = ({ product, onViewDetail }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
      onClick={() => onViewDetail(product)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; }}
        />
        <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-[9px] font-bold">
          {product.category}
        </div>
        {product.certifications?.length > 0 && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-[8px] font-bold">
            {product.certifications[0]}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">📍 {product.origin}</span>
        </div>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-emerald-700">
              {product.price.amount.toLocaleString()} <span className="text-xs">{product.price.currency}</span>
            </p>
            <p className="text-[10px] text-gray-400">per {product.unit}</p>
          </div>
          <button className="text-emerald-600 text-xs font-bold group-hover:gap-2 transition-all flex items-center gap-1">
            View <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Livestock Card
const LivestockCard = ({ asset, onViewDetail }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
      onClick={() => onViewDetail(asset)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={asset.image} 
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80'; }}
        />
        <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-[9px] font-bold">
          +{asset.roi}% ROI
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[9px] font-bold flex items-center gap-1">
          📍 {asset.location}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{asset.title}</h3>
        <div className="flex gap-3 mb-3">
          <div className="text-xs">
            <span className="text-gray-400">Capacity</span>
            <p className="font-bold">{asset.capacity.value} {asset.capacity.unit}</p>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Cycle</span>
            <p className="font-bold">{asset.cycleDuration}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-emerald-700">
              {(asset.price.amount / 1000000).toFixed(1)}M <span className="text-xs">{asset.price.currency}</span>
            </p>
          </div>
          <button className="text-emerald-600 text-xs font-bold group-hover:gap-2 transition-all flex items-center gap-1">
            Invest <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Sourcing Card
const SourcingCard = ({ product, onViewDetail }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
      onClick={() => onViewDetail(product)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.img} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; }}
        />
        <div className="absolute top-3 left-3 bg-pc-gold text-pc-green px-2 py-1 rounded-full text-[9px] font-bold">
          {product.tag}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span>🇨🇳 {product.origin}</span>
          <span>🚢 {product.delivery}</span>
        </div>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.desc}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-pc-gold">{product.price}</p>
            <p className="text-[10px] text-gray-400">ex-factory price</p>
          </div>
          <button className="text-pc-green text-xs font-bold group-hover:gap-2 transition-all flex items-center gap-1">
            Quote <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal Marketplace
const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [agriculturalProducts, setAgriculturalProducts] = useState([]);
  const [livestockAssets, setLivestockAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Tenter de charger les produits agricoles depuis l'API
        const agriRes = await api.get('/agriculture/products').catch(() => ({ products: [] }));
        setAgriculturalProducts(agriRes.products?.length > 0 ? agriRes.products : MOCK_AGRICULTURAL_PRODUCTS);
        
        // Tenter de charger les livestock depuis l'API
        const liveRes = await api.getAllLivestock({ status: 'AVAILABLE' }).catch(() => ({ livestock: [] }));
        setLivestockAssets(liveRes.livestock?.length > 0 ? liveRes.livestock : MOCK_LIVESTOCK);
      } catch (err) {
        console.error('Error fetching marketplace data:', err);
        setAgriculturalProducts(MOCK_AGRICULTURAL_PRODUCTS);
        setLivestockAssets(MOCK_LIVESTOCK);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDisplayedItems = () => {
    switch (activeCategory) {
      case 'agricultural':
        return agriculturalProducts;
      case 'livestock':
        return livestockAssets;
      case 'sourcing':
        return SOURCING_PRODUCTS;
      default:
        return [...agriculturalProducts.slice(0, 3), ...livestockAssets.slice(0, 3), ...SOURCING_PRODUCTS];
    }
  };

  const getTitleForCategory = () => {
    switch (activeCategory) {
      case 'agricultural': return 'Agricultural Products';
      case 'livestock': return 'Livestock Assets';
      case 'sourcing': return 'Sourcing Equipment';
      default: return 'All Marketplaces';
    }
  };

  const getSubtitleForCategory = () => {
    switch (activeCategory) {
      case 'agricultural': return 'Fresh from Cameroonian farms';
      case 'livestock': return 'Certified production units for investment';
      case 'sourcing': return 'Direct factory prices from China';
      default: return 'Explore all our marketplaces';
    }
  };

  const handleViewDetail = (item) => {
    setSelectedProduct(item);
    // Navigation selon le type
    if (activeCategory === 'agricultural' || (activeCategory === 'all' && item.price?.currency)) {
      // navigate(`/agriculture/products/${item.id}`);
      console.log('View agricultural product:', item);
    } else if (activeCategory === 'livestock' || (activeCategory === 'all' && item.roi)) {
      // navigate(`/agriculture/livestock/${item.category?.toLowerCase()}/${item.id}`);
      console.log('View livestock asset:', item);
    } else {
      console.log('View sourcing product:', item);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero selon catégorie active */}
      {activeCategory !== 'all' && <MarketplaceHero activeCategory={activeCategory} />}
      
      {activeCategory === 'all' && (
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">One Stop Shop</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">Marketplace</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Agricultural products, livestock assets, and sourcing from China — all in one place
            </p>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {MARKET_CATEGORIES.map((cat) => (
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
                if (activeCategory === 'agricultural' || (activeCategory === 'all' && item.price?.currency && !item.roi)) {
                  return <AgriculturalProductCard key={item.id || idx} product={item} onViewDetail={handleViewDetail} />;
                } else if (activeCategory === 'livestock' || (activeCategory === 'all' && item.roi)) {
                  return <LivestockCard key={item.id || idx} asset={item} onViewDetail={handleViewDetail} />;
                } else if (activeCategory === 'sourcing' || (activeCategory === 'all' && item.origin?.includes('China'))) {
                  return <SourcingCard key={item.id || idx} product={item} onViewDetail={handleViewDetail} />;
                }
                return null;
              })}
            </div>
          )}

          {getDisplayedItems().length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-400">No items available in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-slate-400 mb-8">
            Contact our experts for a personalized consultation
          </p>
          <Link to="/book-appointment">
            <button className="bg-pc-gold text-slate-900 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
              Book a Free Consultation →
            </button>
          </Link>
        </div>
      </section>

      <Footer />

      {/* ArrowRight icon component inline */}
      <svg style={{ display: 'none' }} />
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