import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Fish, Bird, Database, Leaf, MapPin, Gauge, ChevronRight,
  TrendingUp, Info, Loader2, Filter, Grid3x3, List, Heart, Share2,
  DollarSign, ShieldCheck, Droplets, Sun, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// Icon mapping
const iconMap = {
  Fish: <Fish size={32} />,
  Bird: <Bird size={32} />,
  Database: <Database size={32} />,
  Leaf: <Leaf size={32} />
};

// Default colors for fallback
const categoryColorMap = {
  aquaculture: { bg: "bg-gradient-to-br from-cyan-50 to-cyan-100", color: "text-cyan-700", border: "border-cyan-200", button: "bg-cyan-600 hover:bg-cyan-700" },
  poultry: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", color: "text-emerald-700", border: "border-emerald-200", button: "bg-emerald-600 hover:bg-emerald-700" },
  cattle: { bg: "bg-gradient-to-br from-amber-50 to-amber-100", color: "text-amber-700", border: "border-amber-200", button: "bg-amber-600 hover:bg-amber-700" },
  pigs: { bg: "bg-gradient-to-br from-rose-50 to-rose-100", color: "text-rose-700", border: "border-rose-200", button: "bg-rose-600 hover:bg-rose-700" }
};

const LivestockCategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('roi');
  const [filterRoi, setFilterRoi] = useState('all');

  // Get full image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/livestock/${image}`;
  };

  // Load category and its assets
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get category info
      const catResponse = await api.getLivestockCategoryBySlug(category);
      const cat = catResponse.category;
      
      const colors = categoryColorMap[cat.slug] || categoryColorMap.poultry;
      
      // Get category image
      const categoryImage = cat.imageType === 'upload' 
        ? (cat.imageUpload ? `http://localhost:5000${cat.imageUpload}` : null)
        : cat.imageUrl;
      
      setCategoryData({
        id: cat._id,
        slug: cat.slug,
        title: cat.title,
        subtitle: cat.subtitle || cat.title,
        description: cat.description,
        icon: iconMap[cat.iconName] || <Leaf size={32} />,
        bg: colors.bg,
        color: colors.color,
        borderColor: colors.border,
        buttonColor: colors.button,
        marketDemand: cat.marketDemand || '+0% YoY',
        features: cat.features || [],
        image: categoryImage || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'
      });
      
      // Get assets for this category
      const livestockRes = await api.getLivestockByCategory(cat.slug);
      const items = livestockRes.livestock || [];
      
      // Format assets with image URLs
      const formattedItems = items.map(item => ({
        ...item,
        id: item._id,
        image: item.images && item.images[0] ? getImageUrl(item.images[0]) : null,
        location: item.location?.city || 'Cameroon'
      }));
      
      setLivestock(formattedItems);
      
    } catch (err) {
      console.error('Error fetching category data:', err);
      setError(err.message || 'Loading error');
      
      // Minimal fallback
      setCategoryData({
        slug: category,
        title: category?.charAt(0).toUpperCase() + category?.slice(1) || "Livestock",
        description: "Production units available for investment.",
        icon: <Leaf size={32} />,
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        color: "text-emerald-700",
        buttonColor: "bg-emerald-600 hover:bg-emerald-700",
        marketDemand: "+0% YoY",
        features: [],
        image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'
      });
    } finally {
      setLoading(false);
    }
  };

  // Sort and filter data
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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryData();
  }, [category]);

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
          <p className="text-gray-500 text-sm">Loading...</p>
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
            <p className="font-bold">Loading Error</p>
            <p className="text-sm mt-1">{error || "Category not found"}</p>
            <Link to="/agriculture/livestock" className="mt-4 inline-block text-emerald-600 underline text-sm">
              Back to sectors
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-32 px-4 md:px-12 max-w-[1400px] mx-auto">
        
        {/* Navigation & Back */}
        <nav className="mb-12">
          <Link 
            to="/agriculture/livestock" 
            className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-emerald-800 transition-all"
          >
            <div className="p-2 rounded-full border border-gray-200 group-hover:border-emerald-800 group-hover:-translate-x-1 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to sectors
          </Link>
        </nav>

        {/* Header Section - Hero */}
        <header className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${categoryData.bg} ${categoryData.color} mb-8`}
            >
              {categoryData.icon}
              <span className="text-xs font-bold uppercase tracking-wide">Sector Overview</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] mb-6"
            >
              {categoryData.title} <span className="text-gray-300 italic">Hub</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl font-light leading-relaxed"
            >
              {categoryData.description}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                  <TrendingUp size={20} className="text-amber-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-white/50">Market Status</span>
              </div>
              <p className="text-4xl font-serif mb-2">{categoryData.marketDemand}</p>
              <p className="text-xs text-white/40 uppercase">Current performance index</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
                <div>
                  <p className="text-[8px] uppercase text-white/40">Available Assets</p>
                  <p className="text-2xl font-bold">{filteredAndSortedLivestock.length}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-white/40">Avg ROI</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {filteredAndSortedLivestock.length > 0 
                      ? `+${(filteredAndSortedLivestock.reduce((sum, i) => sum + (i.roi || 0), 0) / filteredAndSortedLivestock.length).toFixed(1)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              {React.cloneElement(categoryData.icon, { size: 180 })}
            </div>
          </motion.div>
        </header>

        {/* Filters & Sort Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-between items-center gap-4 mb-12 pb-6 border-b border-gray-200"
        >
          <div className="flex gap-2">
            {[
              { id: 'roi', label: 'Highest ROI' },
              { id: 'price', label: 'Price' },
              { id: 'capacity', label: 'Capacity' }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${
                  sortBy === opt.id 
                    ? 'bg-emerald-800 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}>
                <Grid3x3 size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}>
                <List size={18} />
              </button>
            </div>
            <select value={filterRoi} onChange={(e) => setFilterRoi(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700">
              <option value="all">All ROI</option>
              <option value="0-15">0% - 15%</option>
              <option value="15-25">15% - 25%</option>
              <option value="25-100">25%+</option>
            </select>
          </div>
        </motion.div>

        {/* Assets Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
          >
            {filteredAndSortedLivestock.map((asset) => (
              <motion.div
                key={asset.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/agriculture/livestock/${category}/${asset.id}`)}
                className={`group cursor-pointer bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 ${viewMode === 'list' ? 'flex' : ''}`}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-72 h-48 flex-shrink-0' : 'h-64'}`}>
                  <img 
                    src={asset.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'} 
                    alt={asset.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                      <span className="text-[9px] font-bold text-gray-900 uppercase">#{asset.id?.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full">
                    <span className="text-[9px] font-bold">+{asset.roi || 0}% ROI</span>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin size={12} className="text-amber-400" />
                    <span className="text-[9px] font-bold uppercase tracking-wide text-white/90">
                      {asset.location || 'Cameroon'}
                    </span>
                  </div>
                </div>

                <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">{asset.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wide">Unit Value</p>
                      <p className="text-base font-bold text-gray-900">
                        {(asset.price?.amount / 1000000).toFixed(1)}M <span className="text-[8px] text-gray-400">FCFA</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wide">Capacity</p>
                      <p className="text-base font-bold text-gray-900">
                        {asset.capacity?.value || 0} <span className="text-[8px] text-gray-400">{asset.capacity?.unit || 'units'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wide">Cycle</p>
                      <p className="text-sm font-bold text-gray-900">{asset.cycleDuration || '12 months'}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-gray-100 transition-colors cursor-pointer">
                        <Heart size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-gray-100 transition-colors cursor-pointer">
                        <Share2 size={14} />
                      </div>
                    </div>
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wide text-white transition-all ${categoryData.buttonColor}`}>
                      View details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
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
              No production units available in this sector.
            </p>
            <Link to="/agriculture/livestock" className="text-emerald-600 text-sm font-bold underline hover:text-emerald-800">
              Explore other sectors
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LivestockCategoryPage;