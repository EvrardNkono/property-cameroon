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

// Map des icônes
const iconMap = {
  Fish: <Fish size={32} />,
  Bird: <Bird size={32} />,
  Database: <Database size={32} />,
  Leaf: <Leaf size={32} />
};

// Couleurs par défaut pour le fallback
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

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/livestock/${image}`;
  };

  // Charger la catégorie et ses assets
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les infos de la catégorie
      const catResponse = await api.getLivestockCategoryBySlug(category);
      const cat = catResponse.category;
      
      const colors = categoryColorMap[cat.slug] || categoryColorMap.poultry;
      
      // Récupérer l'image de la catégorie
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
      
      // Récupérer les assets de cette catégorie
      const livestockRes = await api.getLivestockByCategory(cat.slug);
      const items = livestockRes.livestock || [];
      
      // Formater les assets avec les URLs d'images
      const formattedItems = items.map(item => ({
        ...item,
        id: item._id,
        image: item.images && item.images[0] ? getImageUrl(item.images[0]) : null,
        location: item.location?.city || 'Cameroun'
      }));
      
      setLivestock(formattedItems);
      
    } catch (err) {
      console.error('Error fetching category data:', err);
      setError(err.message || 'Erreur de chargement');
      
      // Fallback minimal
      setCategoryData({
        slug: category,
        title: category?.charAt(0).toUpperCase() + category?.slice(1) || "Livestock",
        description: "Unités de production disponibles pour l'investissement.",
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

  // Trier et filtrer les données
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
      <div className="min-h-screen bg-gradient-to-br from-[#fdfcf0] via-white to-[#f8f7ee]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
          <p className="text-emerald-600/60 text-sm">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdfcf0] via-white to-[#f8f7ee]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen px-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-md">
            <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="font-bold">Erreur de chargement</p>
            <p className="text-sm mt-1">{error || "Catégorie non trouvée"}</p>
            <Link to="/agriculture/livestock" className="mt-4 inline-block text-emerald-600 underline text-sm">
              Retour aux secteurs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcf0] via-white to-[#f8f7ee]">
      <Navbar />
      
      <main className="pt-32 pb-32 px-4 md:px-12 max-w-[1400px] mx-auto">
        
        {/* Navigation & Back */}
        <nav className="mb-12">
          <Link 
            to="/agriculture/livestock" 
            className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-900/50 hover:text-emerald-800 transition-all"
          >
            <div className="p-2 rounded-full border border-emerald-900/10 group-hover:border-emerald-800 group-hover:-translate-x-1 transition-all">
              <ArrowLeft size={16} />
            </div>
            Retour aux secteurs
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
              <span className="text-xs font-black uppercase tracking-widest">Aperçu du secteur</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] mb-6"
            >
              {categoryData.title} <span className="text-emerald-900/20 italic">Hub</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-emerald-800/70 max-w-2xl font-light leading-relaxed"
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Statut du marché</span>
              </div>
              <p className="text-4xl font-serif mb-2">{categoryData.marketDemand}</p>
              <p className="text-xs text-white/40 uppercase tracking-tighter">Indice de performance actuel</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
                <div>
                  <p className="text-[8px] uppercase text-white/40">Actifs disponibles</p>
                  <p className="text-2xl font-bold">{filteredAndSortedLivestock.length}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-white/40">ROI moyen</p>
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
          className="flex flex-wrap justify-between items-center gap-4 mb-12 pb-6 border-b border-emerald-100"
        >
          <div className="flex gap-2">
            {[
              { id: 'roi', label: 'ROI le plus élevé' },
              { id: 'price', label: 'Prix' },
              { id: 'capacity', label: 'Capacité' }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  sortBy === opt.id 
                    ? 'bg-emerald-800 text-white' 
                    : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <div className="flex gap-1 bg-white rounded-xl border border-emerald-100 p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-800' : 'text-emerald-400'}`}>
                <Grid3x3 size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-800' : 'text-emerald-400'}`}>
                <List size={18} />
              </button>
            </div>
            <select value={filterRoi} onChange={(e) => setFilterRoi(e.target.value)} className="px-4 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700">
              <option value="all">Tous les ROI</option>
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
                className={`group cursor-pointer bg-white border border-emerald-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 ${viewMode === 'list' ? 'flex' : ''}`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                      <span className="text-[9px] font-black text-emerald-900 uppercase">#{asset.id?.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-amber-500 text-emerald-950 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-black">+{asset.roi || 0}% ROI</span>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin size={12} className="text-amber-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">
                      {asset.location?.city || asset.location || 'Cameroun'}
                    </span>
                  </div>
                </div>

                <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-xl font-serif text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors">{asset.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-emerald-50">
                    <div>
                      <p className="text-[8px] font-black uppercase text-emerald-400 tracking-wider">Valeur unitaire</p>
                      <p className="text-base font-bold text-emerald-900">
                        {(asset.price?.amount / 1000000).toFixed(1)}M <span className="text-[8px] text-emerald-400">FCFA</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-emerald-400 tracking-wider">Capacité</p>
                      <p className="text-base font-bold text-emerald-900">
                        {asset.capacity?.value || 0} <span className="text-[8px] text-emerald-400">{asset.capacity?.unit || 'têtes'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-emerald-400 tracking-wider">Cycle</p>
                      <p className="text-sm font-bold text-emerald-900">{asset.cycleDuration || '12 mois'}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-emerald-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors cursor-pointer">
                        <Heart size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors cursor-pointer">
                        <Share2 size={14} />
                      </div>
                    </div>
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white transition-all ${categoryData.buttonColor}`}>
                      Voir détails <ChevronRight size={14} />
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
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <Info className="text-emerald-400" size={40} />
            </div>
            <p className="text-2xl font-serif text-emerald-800/40 italic mb-4">
              Aucune unité de production disponible dans ce secteur.
            </p>
            <Link to="/agriculture/livestock" className="text-emerald-600 text-sm font-bold underline hover:text-emerald-800">
              Explorer d'autres secteurs
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LivestockCategoryPage;