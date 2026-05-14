import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Fish, Bird, Database, 
  Leaf, MapPin, Gauge, ChevronRight,
  TrendingUp, Info
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LIVESTOCK_CATEGORIES, LIVESTOCK_ASSETS } from '../data/livestockData';

const LivestockCategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // Mappage des icônes par catégorie
  const icons = {
    aquaculture: <Fish size={32} />,
    poultry: <Bird size={32} />,
    cattle: <Database size={32} />,
    pigs: <Leaf size={32} />
  };

  // Récupération sécurisée des infos de la catégorie
  const info = useMemo(() => {
    return LIVESTOCK_CATEGORIES[category] || LIVESTOCK_CATEGORIES.aquaculture;
  }, [category]);

  // Filtrage des assets correspondant à la catégorie actuelle
  const filteredAssets = useMemo(() => {
    return LIVESTOCK_ASSETS.filter(asset => asset.category === category);
  }, [category]);

  // Scroll en haut de page lors du changement de catégorie
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  // Variantes pour les animations Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] selection:bg-emerald-900 selection:text-white text-emerald-950">
      <Navbar />
      
      <main className="pt-32 md:pt-44 pb-32 px-4 md:px-12 max-w-[1400px] mx-auto">
        
        {/* Navigation & Back */}
        <nav className="mb-12 md:mb-20">
          <Link 
            to="/agriculture/livestock" 
            className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-900/50 hover:text-emerald-950 transition-all"
          >
            <div className="p-2 rounded-full border border-emerald-900/10 group-hover:border-emerald-950 group-hover:-translate-x-1 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Sectors
          </Link>
        </nav>

        {/* Header Section */}
        <header className="grid lg:grid-cols-12 gap-8 items-end mb-16 md:mb-24">
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${info.bg} ${info.color} mb-8`}
            >
              {icons[category] || icons.aquaculture}
              <span className="text-xs font-black uppercase tracking-widest">Industry Overview</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-serif leading-[0.9] mb-8"
            >
              {info.title} <span className="text-emerald-900/20 italic">Hub</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-emerald-900/70 max-w-2xl font-light leading-relaxed"
            >
              {info.description}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 bg-emerald-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Gauge size={20} className="text-amber-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Market Status</span>
              </div>
              <p className="text-4xl font-serif mb-2">{info.marketDemand}</p>
              <p className="text-xs text-white/40 uppercase tracking-tighter">Current Sector Performance Index</p>
            </div>
            {/* Background Icon Decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               {React.cloneElement(icons[category] || icons.aquaculture, { size: 160 })}
            </div>
          </motion.div>
        </header>

        {/* Assets Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredAssets.map((asset) => (
            <motion.div
              key={asset.id}
              variants={cardVariants}
              onClick={() => navigate(`/agriculture/livestock/${category}/${asset.id}`)}
              className="group cursor-pointer bg-white border border-emerald-900/5 rounded-[3rem] overflow-hidden hover:shadow-3xl hover:shadow-emerald-900/10 transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-[340px] m-4 overflow-hidden rounded-[2.2rem]">
                <img 
                  src={asset.image} 
                  alt={asset.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Floating Tags */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                    <span className="text-[10px] font-black text-emerald-950 uppercase tracking-tighter">#LS-{asset.id}</span>
                  </div>
                  <div className="bg-emerald-950 text-amber-400 p-3 rounded-2xl shadow-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <TrendingUp size={18} />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={12} className="text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{asset.location}, CM</span>
                  </div>
                  <h3 className="text-2xl font-serif leading-tight">{asset.title}</h3>
                </div>
              </div>

              {/* Data Section */}
              <div className="px-8 pb-8 pt-2 flex flex-col flex-grow">
                <div className="grid grid-cols-2 gap-6 mb-8 border-b border-emerald-900/5 pb-6">
                  <div>
                    <span className="block text-[9px] font-bold text-emerald-900/30 uppercase tracking-[0.2em] mb-2">Unit Value</span>
                    <p className="text-xl font-bold">
                      {asset.price} <span className="text-[10px] font-normal text-emerald-900/40">XAF</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-bold text-emerald-900/30 uppercase tracking-[0.2em] mb-2">Projected ROI</span>
                    <p className={`text-xl font-bold ${info.color}`}>+{asset.roi}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between group/btn">
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-900/40 group-hover/btn:text-emerald-950 transition-colors">
                    View Project Details
                  </span>
                  <div className="w-10 h-10 rounded-full border border-emerald-900/10 flex items-center justify-center group-hover/btn:bg-emerald-950 group-hover/btn:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAssets.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-900/5 flex items-center justify-center mb-6">
              <Info className="text-emerald-900/20" size={40} />
            </div>
            <p className="text-2xl font-serif text-emerald-900/40 italic">
              No production units currently available in this sector.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LivestockCategoryPage;