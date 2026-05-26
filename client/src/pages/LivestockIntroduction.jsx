import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Fish, Bird, Database, Leaf, TrendingUp, ShieldCheck, 
  Warehouse, Globe, BadgeCheck, Loader2, DollarSign, Clock,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api'; // ✅ BACKEND ACTIF
// import { MOCK_LIVESTOCK, getMockLivestockStats } from '../data/mockLivestock'; // ❌ COMMENTÉ

// 🔥 Auto environment detection
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// Hardcoded URLs based on environment
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           // Local URL
  : 'https://property-cameroon-backend.vercel.app';  // Production URL

// Map des icônes par nom
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

const LivestockIntroduction = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAssets: 0,
    avgROI: 0,
    totalValue: 0
  });

  // Utility function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${BACKEND_URL}${imagePath}`;
    return `${BACKEND_URL}/uploads/${imagePath}`;
  };

  // ==================== BACKEND VERSION (ACTIVE) ====================
  const fetchCategoriesFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🌍 LivestockIntroduction - Environment: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
      console.log(`🔗 LivestockIntroduction - Backend URL: ${BACKEND_URL}`);
      
      // Fetch categories from backend
      const categoriesRes = await api.getAllLivestockCategories({ isActive: true });
      const dbCategories = categoriesRes.categories || categoriesRes || [];
      
      // Fetch all livestock
      const livestockRes = await api.getAllLivestock({ status: 'AVAILABLE' });
      const livestock = livestockRes.livestock || livestockRes || [];
      
      // Calculate stats
      const totalValue = livestock.reduce((sum, item) => sum + (item.price?.amount || 0), 0);
      const avgRoi = livestock.length > 0 
        ? livestock.reduce((sum, item) => sum + (item.roi || 0), 0) / livestock.length 
        : 0;
      
      setStats({
        totalAssets: livestock.length,
        avgROI: avgRoi,
        totalValue: totalValue
      });
      
      // Group livestock by category
      const grouped = {};
      livestock.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });
      
      // Format categories for display
      const formattedCategories = dbCategories.map(cat => {
        const categoryAssets = grouped[cat.slug] || [];
        
        // Get category image URL
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
          marketDemand: cat.marketDemand || '+0% YoY'
        };
      });
      
      setCategories(formattedCategories);
      console.log(`✅ Loaded ${formattedCategories.length} categories with ${livestock.length} total assets`);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || err.message || 'Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  // ==================== MOCK VERSION (COMMENTED OUT) ====================
  /*
  const fetchCategoriesFromMock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const livestock = MOCK_LIVESTOCK;
      const mockStats = getMockLivestockStats();
      
      setStats({
        totalAssets: mockStats.totalAssets,
        avgROI: mockStats.avgROI,
        totalValue: mockStats.totalValue
      });
      
      const grouped = {};
      livestock.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });
      
      const formattedCategories = Object.keys(CATEGORIES_CONFIG).map(catSlug => {
        const config = CATEGORIES_CONFIG[catSlug];
        const categoryAssets = grouped[catSlug] || [];
        
        return {
          id: catSlug,
          slug: catSlug,
          title: config.title,
          subtitle: config.subtitle,
          description: config.description,
          icon: iconMap[config.iconName] || <Leaf size={32} />,
          count: categoryAssets.length,
          totalValue: categoryAssets.reduce((sum, item) => sum + (item.price?.amount || 0), 0),
          image: config.imageUrl,
          marketDemand: config.marketDemand
        };
      });
      
      const activeCategories = formattedCategories.filter(cat => cat.count > 0);
      setCategories(activeCategories);
      
    } catch (err) {
      console.error('Error loading mock categories:', err);
      setError(err.message || 'Error loading categories');
    } finally {
      setLoading(false);
    }
  };
  */

  // Choose which fetch function to use - BACKEND ACTIVE
  const fetchCategories = fetchCategoriesFromBackend;

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!loading && categories.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <Leaf size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-serif text-emerald-900 mb-3">No categories available</h2>
          <p className="text-emerald-600/70 text-center max-w-md mb-6">
            Livestock categories will be available soon.
          </p>
          <Link to="/" className="text-emerald-600 text-sm font-bold underline hover:text-emerald-800">
            Back to home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-emerald-900 to-emerald-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-6"
          >
            <ShieldCheck size={14} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">CAPEF Certified • Cameroon</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Livestock Investment
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100 max-w-2xl mx-auto text-lg"
          >
            Invest in certified livestock assets with attractive returns
          </motion.p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Warehouse size={24} className="text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAssets}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Active Assets</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">+{stats.avgROI.toFixed(1)}%</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Average ROI</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign size={24} className="text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {(stats.totalValue / 1000000).toFixed(1)}M FCFA
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Portfolio Value</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <AlertCircle size={40} className="mx-auto mb-3" />
            <p className="font-bold">Loading Error</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/agriculture/livestock/${cat.slug}`} className="block">
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={cat.image} 
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white">
                          {cat.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                          <p className="text-amber-400 text-xs font-bold uppercase tracking-wide">{cat.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm line-clamp-2 mb-3">
                        {cat.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/50">Assets</p>
                            <p className="text-lg font-bold text-white">{cat.count}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/50">Value</p>
                            <p className="text-lg font-bold text-amber-400">
                              {(cat.totalValue / 1000000).toFixed(1)}M FCFA
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/50">Demand</p>
                            <p className="text-lg font-bold text-green-400">{cat.marketDemand}</p>
                          </div>
                        </div>
                        
                        <ArrowRight size={20} className="text-white/50 group-hover:text-amber-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* WHY INVEST SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Invest?</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck size={28} />, title: "Certified Assets", description: "Certified and secured production units" },
              { icon: <Clock size={28} />, title: "Short Cycles", description: "Fast return on investment" },
              { icon: <Globe size={28} />, title: "Export Ready", description: "Access to international markets" }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-10 shadow-xl">
            <BadgeCheck size={48} className="text-white/80 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Invest?</h3>
            <p className="text-emerald-100 mb-6">Schedule a consultation with our experts</p>
            <button className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors inline-flex items-center gap-2">
              Book Appointment <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LivestockIntroduction;