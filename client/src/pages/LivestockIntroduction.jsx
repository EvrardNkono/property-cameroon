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
import api from '../services/api';

// Map des icônes par nom
const iconMap = {
  Fish: <Fish size={32} />,
  Bird: <Bird size={32} />,
  Database: <Database size={32} />,
  Leaf: <Leaf size={32} />
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesRes = await api.getAllLivestockCategories({ isActive: true });
      const dbCategories = categoriesRes.categories || [];
      
      const livestockRes = await api.getAllLivestock({ status: 'AVAILABLE' });
      const livestock = livestockRes.livestock || [];
      
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
        
        // Construction de l'URL de l'image
        let imageUrl = '';
        if (cat.imageType === 'upload' && cat.imageUpload) {
          imageUrl = `http://localhost:5000${cat.imageUpload}`;
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
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Erreur de chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-serif text-emerald-900 mb-3">Aucune catégorie disponible</h2>
          <p className="text-emerald-600/70 text-center max-w-md mb-6">
            Les catégories d'élevage seront bientôt disponibles.
          </p>
          <Link to="/" className="text-emerald-600 text-sm font-bold underline hover:text-emerald-800">
            Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO SECTION - plus épurée */}
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

      {/* STATS SECTION - plus claire */}
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

      {/* CATEGORIES SECTION - image plus visible */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <AlertCircle size={40} className="mx-auto mb-3" />
            <p className="font-bold">Erreur de chargement</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
            >
              Réessayer
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
                    {/* Image - pleine visibilité */}
                    <img 
                      src={cat.image} 
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                      }}
                    />
                    
                    {/* Overlay léger au survol uniquement */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Contenu - toujours visible */}
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
                            <p className="text-[10px] font-bold uppercase text-white/50">Actifs</p>
                            <p className="text-lg font-bold text-white">{cat.count}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/50">Valeur</p>
                            <p className="text-lg font-bold text-amber-400">
                              {(cat.totalValue / 1000000).toFixed(1)}M FCFA
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/50">Demande</p>
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

      {/* WHY INVEST SECTION - simplifiée */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pourquoi investir ?</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck size={28} />, title: "Actifs certifiés", description: "Unités de production certifiées et sécurisées" },
              { icon: <Clock size={28} />, title: "Cycles courts", description: "Retour sur investissement rapide" },
              { icon: <Globe size={28} />, title: "Prêt pour l'export", description: "Accès aux marchés internationaux" }
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
            <h3 className="text-2xl font-bold text-white mb-3">Prêt à investir ?</h3>
            <p className="text-emerald-100 mb-6">Programmez une consultation avec nos experts</p>
            <button className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors inline-flex items-center gap-2">
              Prendre rendez-vous <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LivestockIntroduction;