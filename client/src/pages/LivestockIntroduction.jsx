import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Fish, Bird, Database, Leaf, TrendingUp, ShieldCheck, 
  Warehouse, Globe, BadgeCheck, Loader2, Users, DollarSign, Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';


// Map des icônes par nom
const iconMap = {
  Fish: <Fish size={40} />,
  Bird: <Bird size={40} />,
  Database: <Database size={40} />,
  Leaf: <Leaf size={40} />
};

// Couleurs par défaut
const defaultColors = {
  aquaculture: { bg: "from-cyan-900/80", lightBg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  poultry: { bg: "from-emerald-900/80", lightBg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  cattle: { bg: "from-amber-900/80", lightBg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  pigs: { bg: "from-rose-900/80", lightBg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" }
};

const LivestockIntroduction = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalInvestors: 0,
    avgROI: 0,
    totalValue: 0
  });

  // Charger les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer toutes les catégories actives
      const categoriesRes = await api.getAllLivestockCategories({ isActive: true });
      const dbCategories = categoriesRes.categories || [];
      
      // Récupérer tous les assets pour les stats
      const livestockRes = await api.getAllLivestock({ status: 'AVAILABLE' });
      const livestock = livestockRes.livestock || [];
      
      // Calculer les statistiques globales
      const totalValue = livestock.reduce((sum, item) => sum + (item.price?.amount || 0), 0);
      const avgRoi = livestock.length > 0 
        ? livestock.reduce((sum, item) => sum + (item.roi || 0), 0) / livestock.length 
        : 0;
      
      setStats({
        totalAssets: livestock.length,
        totalInvestors: Math.floor(livestock.length * 2.5),
        avgROI: avgRoi,
        totalValue: totalValue
      });
      
      // Grouper les assets par catégorie
      const grouped = {};
      livestock.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });
      
      // Formater les catégories avec leurs données
      const formattedCategories = dbCategories.map(cat => {
        const categoryAssets = grouped[cat.slug] || [];
        const colors = defaultColors[cat.slug] || defaultColors.poultry;
        
        // Récupérer l'image (upload ou URL)
        const imageUrl = cat.imageType === 'upload' ? cat.imageUpload : cat.imageUrl;
        
        return {
          id: cat._id,
          slug: cat.slug,
          title: cat.title,
          subtitle: cat.subtitle || cat.title,
          description: cat.description,
          icon: iconMap[cat.iconName] || <Leaf size={40} />,
          color: colors.bg,
          bgColor: colors.lightBg,
          textColor: colors.text,
          borderColor: colors.border,
          count: categoryAssets.length,
          totalValue: categoryAssets.reduce((sum, item) => sum + (item.price?.amount || 0), 0),
          image: imageUrl,
          marketDemand: cat.marketDemand,
          features: cat.features || []
        };
      });
      
      setCategories(formattedCategories);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const statVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 200 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcf0] via-white to-[#f8f7ee] selection:bg-emerald-800 selection:text-amber-200">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 backdrop-blur-md rounded-full border border-amber-500/30 mb-8"
          >
            <ShieldCheck size={14} className="text-amber-400" />
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">CAPEF Certified • Cameroon</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-6"
          >
            Livestock <br /> 
            <span className="text-amber-400 italic font-light">The Living Economy.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-100/80 max-w-2xl mx-auto text-base md:text-lg font-light italic"
          >
            Transform your land into CAPEF-certified production units. 
            Invest in the cycle of life, fuel the emergence of Cameroon's agricultural sovereignty.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-16 px-6 bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div variants={statVariants} className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Warehouse size={24} className="text-emerald-700" />
              </div>
              <p className="text-2xl md:text-3xl font-black text-emerald-900">{stats.totalAssets}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Assets</p>
            </motion.div>
            
            <motion.div variants={statVariants} className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-amber-700" />
              </div>
              <p className="text-2xl md:text-3xl font-black text-emerald-900">{stats.totalInvestors}+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Investors</p>
            </motion.div>
            
            <motion.div variants={statVariants} className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={24} className="text-emerald-700" />
              </div>
              <p className="text-2xl md:text-3xl font-black text-emerald-900">+{stats.avgROI.toFixed(1)}%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Avg. ROI</p>
            </motion.div>
            
            <motion.div variants={statVariants} className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <DollarSign size={24} className="text-amber-700" />
              </div>
              <p className="text-2xl md:text-3xl font-black text-emerald-900">
                {(stats.totalValue / 1000000).toFixed(0)}M
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Portfolio Value</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- LIVESTOCK PILLARS --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
            <p className="text-emerald-600/60 text-sm">Loading investment opportunities...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
            <p className="font-bold">Erreur de chargement</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {categories.map((cat) => (
              <motion.div 
                key={cat.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group relative h-[480px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
              >
                <Link to={`/agriculture/livestock/${cat.slug}`} className="block h-full">
                  {/* Background Image */}
                  <img 
                    src={cat.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'} 
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} to-emerald-950/95`} />
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </div>
                      <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-3 block">
                        {cat.subtitle}
                      </span>
                      <h3 className="text-4xl font-serif text-white mb-4">{cat.title}</h3>
                      <p className="text-emerald-100/70 text-sm font-light leading-relaxed max-w-sm">
                        {cat.description}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-6">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Assets</p>
                            <p className="text-xl font-bold text-white">{cat.count}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Portfolio Value</p>
                            <p className="text-xl font-bold text-amber-400">
                              {(cat.totalValue / 1000000).toFixed(1)}M <span className="text-xs text-white/40">FCFA</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                        Discover Assets <ArrowRight size={16} className="text-amber-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* --- WHY INVEST SECTION --- */}
      <section className="py-24 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
              Why CAPEF Livestock
            </span>
            <h2 className="text-4xl md:text-5xl font-serif italic mb-4">A Living, Breathing Economy</h2>
            <div className="w-20 h-1 bg-amber-400 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck size={32} />, title: "Certified Assets", description: "All production units are veterinary-certified and legally secured." },
              { icon: <Clock size={32} />, title: "Short Cycles", description: "From 6 months to 24 months, rapid ROI on your investment." },
              { icon: <Globe size={32} />, title: "Export Ready", description: "Access to CEMAC and international markets through CAPEF network." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-400">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-emerald-200/60 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-3xl p-12 shadow-xl"
          >
            <BadgeCheck size={48} className="text-emerald-600 mx-auto mb-6" />
            <h3 className="text-3xl font-serif text-emerald-900 mb-4">Ready to Invest in Living Assets?</h3>
            <p className="text-emerald-700/70 max-w-md mx-auto mb-8">Schedule a consultation with our livestock investment advisors.</p>
            <button className="px-8 py-4 bg-emerald-800 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all inline-flex items-center gap-2 group">
              Schedule a Call <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LivestockIntroduction;