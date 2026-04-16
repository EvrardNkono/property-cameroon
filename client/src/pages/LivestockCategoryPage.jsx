import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Fish, Bird, Database, 
  Leaf, MapPin, Gauge, ChevronRight 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import de tes nouvelles données
import { LIVESTOCK_CATEGORIES, LIVESTOCK_ASSETS } from '../data/livestockData';

const LivestockCategoryPage = () => {
  const { category } = useParams();

  // Mapping des icônes pour correspondre aux catégories
  const icons = {
    aquaculture: <Fish size={44} />,
    poultry: <Bird size={44} />,
    cattle: <Database size={44} />,
    pigs: <Leaf size={44} />
  };

  // Récupération des infos de la catégorie
  const info = LIVESTOCK_CATEGORIES[category] || LIVESTOCK_CATEGORIES.aquaculture;
  const currentIcon = icons[category] || <Fish size={44} />;

  // Filtrage des 5 assets spécifiques à cette catégorie
  const filteredAssets = useMemo(() => {
    return LIVESTOCK_ASSETS.filter(asset => asset.category === category);
  }, [category]);

  // Scroll en haut de page lors du changement de catégorie
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  return (
    <div className="min-h-screen bg-[#fdfcf0] selection:bg-emerald-800 selection:text-amber-200">
      <Navbar />
      
      <main className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
        {/* Fil d'ariane / Retour */}
        <Link 
          to="/agriculture/livestock" 
          className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/40 hover:text-amber-600 transition-colors mb-12 group"
        >
          <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-2 transition-transform" />
          Livestock Sectors
        </Link>

        {/* Header de la Catégorie */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-24 h-24 ${info.bg} ${info.color} flex items-center justify-center rounded-[2rem] mb-8 shadow-xl shadow-emerald-900/5`}
            >
              {currentIcon}
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl md:text-8xl font-serif text-emerald-950 mb-6"
            >
              {info.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-emerald-900/60 font-light text-xl leading-relaxed italic max-w-xl"
            >
              {info.description}
            </motion.p>
          </div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-emerald-950 p-8 rounded-[3rem] flex items-center gap-8 shadow-2xl border-b-4 border-amber-500"
          >
             <div>
                <p className="text-[10px] font-black uppercase text-amber-500/60 mb-2 tracking-widest">Market Demand</p>
                <p className="text-4xl font-serif text-white">{info.marketDemand}</p>
             </div>
             <div className="w-px h-12 bg-white/10" />
             <div className="bg-amber-500/10 p-4 rounded-2xl">
                <Gauge className="text-amber-500" size={32} />
             </div>
          </motion.div>
        </header>

        {/* Grille des Assets (Les 5 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredAssets.map((asset, index) => (
            <motion.div 
              key={asset.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[3rem] p-4 border border-emerald-900/5 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500"
            >
              {/* Image de l'Asset */}
              <div className="aspect-[4/5] rounded-[2.5rem] mb-8 overflow-hidden relative">
                <img 
                  src={asset.image} 
                  alt={asset.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full shadow-xl">
                  <p className="text-[10px] font-black uppercase text-emerald-900 tracking-tighter">
                    REF: #LS-{asset.id}
                  </p>
                </div>
              </div>

              {/* Détails de l'Asset */}
              <div className="px-6 pb-8">
                <div className="flex items-center text-amber-600 mb-3">
                  <MapPin size={14} className="mr-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{asset.location}, Cameroon</span>
                </div>
                
                <h3 className="text-3xl font-serif text-emerald-950 mb-6 leading-tight group-hover:text-amber-700 transition-colors">
                  {asset.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-emerald-900/5 mb-8">
                  <div>
                    <p className="text-[9px] font-black uppercase text-emerald-900/30 mb-1 tracking-widest">Asset Value</p>
                    <p className="text-xl font-bold text-emerald-950">{asset.price} <span className="text-[10px] font-light italic">XAF</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-emerald-900/30 mb-1 tracking-widest">Target ROI</p>
                    <p className="text-xl font-bold text-emerald-700">+{asset.roi}</p>
                  </div>
                </div>

                <button className="w-full bg-[#fdfcf0] group-hover:bg-emerald-950 group-hover:text-amber-200 text-emerald-950 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 border border-emerald-900/10">
                  Technical File <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* État vide si aucune donnée n'est trouvée */}
        {filteredAssets.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-emerald-900/30 italic font-serif text-2xl">
              No production units currently available in this sector.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LivestockCategoryPage;