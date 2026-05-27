import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Fish, Bird, Database, Leaf, TrendingUp, ShieldCheck, 
  Warehouse, Globe, BadgeCheck, Loader2, DollarSign, Clock,
  AlertCircle, Zap, MapPin, Users, Award, BarChart3, ChevronRight,
  Sparkles, Star, Heart, TrendingDown, PieChart, Calendar, CheckCircle,
  Phone, Mail, MessageCircle, X, Building2, Gem, Rocket, Layers
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

// Statistics cards data
const statCards = [
  { 
    icon: <Warehouse size={24} />, 
    label: "Active Assets", 
    key: "totalAssets",
    gradient: "from-emerald-500 to-teal-500",
    description: "Available for immediate investment"
  },
  { 
    icon: <TrendingUp size={24} />, 
    label: "Average ROI", 
    key: "avgROI",
    suffix: "%",
    gradient: "from-amber-500 to-orange-500",
    description: "Projected annual return"
  },
  { 
    icon: <DollarSign size={24} />, 
    label: "Portfolio Value", 
    key: "totalValue",
    prefix: "FCFA ",
    formatter: (val) => `${(val / 1000000).toFixed(1)}M`,
    gradient: "from-emerald-600 to-teal-600",
    description: "Total assets under management"
  },
  { 
    icon: <Users size={24} />, 
    label: "Active Investors", 
    key: "investors",
    value: 1247,
    gradient: "from-purple-500 to-pink-500",
    description: "Trusting our platform"
  }
];

// Investment opportunities data
const investmentHighlights = [
  { icon: <Zap size={20} />, title: "Short Cycles", description: "2-18 months", color: "text-amber-500" },
  { icon: <ShieldCheck size={20} />, title: "Certified Assets", description: "100% verified", color: "text-emerald-500" },
  { icon: <BarChart3 size={20} />, title: "High ROI", description: "Up to 40%", color: "text-purple-500" },
  { icon: <Globe size={20} />, title: "Export Ready", description: "International markets", color: "text-cyan-500" },
  { icon: <Clock size={20} />, title: "Passive Income", description: "Monthly payouts", color: "text-orange-500" },
  { icon: <Building2 size={20} />, title: "Tax Benefits", description: "Legal advantages", color: "text-indigo-500" }
];

// Testimonials data
const testimonials = [
  {
    name: "Jean-Paul N.",
    role: "Investor since 2024",
    content: "Invested 15M FCFA in poultry farming. Received 22% ROI in 8 months. Platform is transparent and reliable.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Marie-Claire K.",
    role: "Agriculture entrepreneur",
    content: "The aquaculture project doubled my investment in 10 months. Support team is very responsive.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "David E.",
    role: "Diaspora investor",
    content: "I invest from France with confidence. Monthly reports and clear ROI projections.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

// FAQ Data
const faqs = [
  { q: "How does livestock investment work?", a: "You purchase shares in certified production units. The farm manages operations, and you receive returns based on the investment cycle." },
  { q: "What is the minimum investment?", a: "Minimum investment starts at 500,000 FCFA for some assets, with an average of 2,500,000 FCFA for most categories." },
  { q: "Are my assets insured?", a: "Yes, all assets are covered by livestock insurance and biosecurity protocols." },
  { q: "How do I receive returns?", a: "Returns are paid via mobile money (MTN/Orange Money) or bank transfer at cycle completion." },
  { q: "Can I visit the farm?", a: "Absolutely! We organize quarterly farm visits for investors." }
];

const LivestockIntroduction = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredLivestock, setFeaturedLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [error, setError] = useState(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [stats, setStats] = useState({
    totalAssets: 0,
    avgROI: 0,
    totalValue: 0
  });

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${BACKEND_URL}${imagePath}`;
    return `${BACKEND_URL}/uploads/${imagePath}`;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesRes = await api.getAllLivestockCategories({ isActive: true });
      const dbCategories = categoriesRes.categories || categoriesRes || [];
      
      const livestockRes = await api.getAllLivestock({ status: 'AVAILABLE' });
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
          title: cat.title,
          subtitle: cat.subtitle || cat.title,
          description: cat.description,
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
      setError(err.response?.data?.message || err.message || 'Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NOUVELLE FONCTION : Fetch featured livestock assets
  const fetchFeaturedLivestock = async () => {
    try {
      setLoadingFeatured(true);
      const response = await api.getAllLivestock({ status: 'AVAILABLE', limit: 6 });
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

  useEffect(() => {
    fetchCategories();
    fetchFeaturedLivestock();
    // Show newsletter modal after 10 seconds (only once)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
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
          <p className="text-gray-500 mt-6 text-sm">Loading investment opportunities...</p>
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
            <p className="font-bold text-lg mb-2">Loading Error</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Try Again
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
        {/* Animated background particles */}
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
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">CAPEF Certified • Cameroon</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-[1.1]"
          >
            Livestock <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Investment</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100 max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            Invest in certified, high-yield livestock assets across Cameroon.
            <br />
            <span className="text-emerald-300">Short cycles | Secure returns | Full transparency</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Link
              to="#categories"
              className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Explore sectors <ChevronRight size={18} />
            </Link>
            <button
              onClick={() => setShowNewsletter(true)}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              Get free guide <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/10"
          >
            {['100+ Active Investors', '2B+ FCFA Managed', '99% Client Satisfaction', '24/7 Support'].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-emerald-200">
                <CheckCircle size={12} className="text-amber-400" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== STATS SECTION (Enhanced) ========== */}
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
                  <div className="text-white">
                    {stat.icon}
                  </div>
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

      {/* ========== FEATURED LIVESTOCK ASSETS (NOUVEAU) ========== */}
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
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">Top Opportunities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Featured <span className="text-emerald-600">Livestock Assets</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Hand-picked high-yield production units ready for immediate investment
            </p>
          </motion.div>

          {loadingFeatured ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="text-emerald-600 animate-spin" />
            </div>
          ) : featuredLivestock.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No featured assets available at the moment.</p>
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
                        <p className="text-xs text-gray-400">Investment</p>
                        <p className="text-lg font-bold text-emerald-700">
                          {(asset.price?.amount / 1000000).toFixed(1)}M FCFA
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold group-hover:gap-2 transition-all">
                        View details <ArrowRight size={12} />
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
              View all livestock opportunities <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== INVESTMENT HIGHLIGHTS ========== */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <Gem size={14} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wide">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
              Investment <span className="text-emerald-600">Advantages</span>
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
                className="text-center p-4 rounded-xl bg-white hover:bg-emerald-50 transition-colors group cursor-pointer shadow-sm"
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

      {/* ========== CATEGORIES SECTION (Enhanced) ========== */}
      <section id="categories" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
              <Layers size={14} className="text-amber-600" />
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">Sectors</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Available <span className="text-emerald-600">Investment Sectors</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Choose from certified, high-yield livestock production units across Cameroon
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link to={`/agriculture/livestock/${cat.slug}`} className="block">
                  <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
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
                        <span className="text-[10px] font-bold uppercase">{cat.marketDemand} demand</span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-amber-300">+{cat.avgRoi.toFixed(0)}% avg ROI</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-xl ${cat.colors.iconBg} backdrop-blur-sm flex items-center justify-center text-white`}>
                          {cat.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                          <p className="text-amber-400 text-xs font-bold uppercase tracking-wide">{cat.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm line-clamp-2 mb-4">
                        {cat.description.substring(0, 120)}...
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[9px] font-bold uppercase text-white/50">Assets</p>
                            <p className="text-lg font-bold text-white">{cat.count}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase text-white/50">Portfolio Value</p>
                            <p className="text-lg font-bold text-amber-400">
                              {(cat.totalValue / 1000000).toFixed(1)}M FCFA
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="text-white/80 text-xs">Invest now</span>
                          <ArrowRight size={18} className="text-white/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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
              <span className="text-purple-700 text-xs font-bold uppercase tracking-wide">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              How It <span className="text-purple-600">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Choose Sector", desc: "Select from certified livestock sectors", icon: <Globe size={24} /> },
              { step: "02", title: "Select Asset", desc: "Pick production units matching your goals", icon: <Database size={24} /> },
              { step: "03", title: "Invest", desc: "Secure payment via mobile money or bank", icon: <DollarSign size={24} /> },
              { step: "04", title: "Earn Returns", desc: "Receive profits at cycle completion", icon: <TrendingUp size={24} /> }
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
              Start investing today <ArrowRight size={18} />
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
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wide">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              What <span className="text-amber-600">Investors Say</span>
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
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wide">Questions?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Frequently Asked <span className="text-emerald-600">Questions</span>
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

      {/* ========== CTA SECTION (Enhanced) ========== */}
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
                Ready to Build Your Portfolio?
              </h3>
              <p className="text-emerald-100 mb-8 max-w-md mx-auto">
                Join 1,000+ investors already earning passive income from livestock assets
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  Create free account <ArrowRight size={18} />
                </Link>
                <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2">
                  <Phone size={16} />
                  Call advisor
                </button>
              </div>
              <p className="text-emerald-200/60 text-xs mt-6">
                *No commitment. Free consultation with our investment team.
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
                      Free Investment Guide
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Get our 2025 Livestock Investment Guide + monthly insights
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
                      Send me the guide
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thanks for subscribing!</h3>
                  <p className="text-gray-500 text-sm">Check your inbox for the guide.</p>
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

export default LivestockIntroduction;