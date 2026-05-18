import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ArrowUpRight, X, TrendingUp, Loader2 } from 'lucide-react';
import LivestockDetailCard from './LivestockDetailCard';
import api from '../../services/api';

const PopularLivestock = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [cheapestLivestock, setCheapestLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les 10 livestock les moins chers
  const fetchCheapestLivestock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer tous les livestock disponibles
      const response = await api.getAllLivestock({ status: 'AVAILABLE' });
      const livestock = response.livestock || [];
      
      // Trier par prix (du moins cher au plus cher)
      const sorted = [...livestock].sort((a, b) => {
        const priceA = a.price?.amount || 0;
        const priceB = b.price?.amount || 0;
        return priceA - priceB;
      });
      
      // Prendre les 10 premiers (les moins chers)
      const cheapest = sorted.slice(0, 10);
      
      // Transformer les données pour le composant
      const formattedData = cheapest.map(item => ({
        id: item._id,
        name: item.title,
        title: item.title,
        category: item.category || 'Élevage',
        type: item.category || 'Élevage',
        owner: item.owner?.name || 'CAPEF Certified',
        zone: item.location,
        location: item.location,
        price: item.price?.amount?.toLocaleString() || '0',
        yield: `+${item.roi || 0}%`,
        image: item.image || 'https://images.unsplash.com/photo-1514170307137-080646c1a84c?q=80&w=800',
        conditionsDesc: item.description || 'Conditions d\'élevage optimales avec suivi vétérinaire certifié.',
        locationDesc: `Situé à ${item.location || 'Cameroun'}, zone stratégique pour la distribution.`,
        temp: item.temp || '22°C - 28°C',
        cycle: item.cycleDuration || '6-12 mois',
        maturite: `${item.capacity?.value || 100} ${item.capacity?.unit || 'kg'}`,
        waterAccess: item.waterAccess,
        electricityAccess: item.electricityAccess,
        veterinaryAccess: item.veterinaryAccess
      }));
      
      setCheapestLivestock(formattedData);
      
    } catch (err) {
      console.error('Error fetching cheapest livestock:', err);
      setError(err.message || 'Erreur de chargement');
      
      // Données de fallback si API indisponible
      setCheapestLivestock([
        {
          id: 1,
          name: "Silures de Kribi - Cycle Rapide",
          title: "Silures de Kribi - Cycle Rapide",
          category: "Aquaculture",
          type: "Aquaculture",
          owner: "Aquaculture du Littoral SARL",
          zone: "Kribi, Sud",
          location: "Kribi, Sud",
          price: "450,000",
          yield: "+22%",
          image: "https://images.unsplash.com/photo-1514170307137-080646c1a84c?q=80&w=800",
          conditionsDesc: "Élevés dans des bacs circulaires hors-sol avec un système de filtration biologique.",
          locationDesc: "La ferme est située dans le bassin de la Lobé, à proximité du port de Kribi.",
          temp: "27°C - 30°C",
          cycle: "6 Mois",
          maturite: "1.2kg"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheapestLivestock();
  }, []);

  // Dupliquer pour l'effet de défilement infini
  const row1 = [...cheapestLivestock, ...cheapestLivestock];
  const row2 = [...cheapestLivestock].reverse().concat([...cheapestLivestock].reverse());

  const Card = ({ item }) => (
    <div className="flex-shrink-0 w-[350px] bg-white border border-emerald-900/5 p-4 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all group">
      <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-4">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-amber-400 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
          {item.type}
        </div>
        <div className="absolute bottom-3 right-3 bg-emerald-950 text-white text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-white/10">
          <TrendingUp className="w-3 h-3 text-amber-500" /> {item.yield}
        </div>
      </div>
      
      <div className="px-2">
        <h4 className="text-emerald-950 font-serif text-lg mb-1 group-hover:text-emerald-800 transition-colors line-clamp-1">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 text-emerald-900/40 text-[10px] mb-4">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="font-bold text-emerald-900/60 uppercase line-clamp-1">{item.owner}</span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-emerald-50">
          <div className="flex flex-col">
            <span className="text-[8px] text-emerald-900/30 uppercase font-black">Ticket d'entrée</span>
            <span className="text-emerald-950 font-black text-sm">{item.price} XAF</span>
          </div>
          
          <button 
            onClick={() => setSelectedProject(item)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-950 text-amber-500 rounded-full hover:bg-amber-600 hover:text-emerald-950 transition-all duration-300 text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-amber-500/20 active:scale-95 group/btn"
          >
            Détails 
            <ArrowUpRight size={14} className="group-hover/btn:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-24 bg-[#fdfcf0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Loader2 size={48} className="text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-emerald-600/60 text-sm">Chargement des meilleures opportunités...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-[#fdfcf0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block">
            <p className="font-bold">Erreur de chargement</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={fetchCheapestLivestock}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
            >
              Réessayer
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (cheapestLivestock.length === 0) {
    return (
      <section className="py-24 bg-[#fdfcf0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-emerald-600/60 text-sm">Aucune opportunité disponible pour le moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#fdfcf0] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em]">Opportunités du Marché</span>
            <h2 className="text-5xl font-serif text-emerald-950 mt-4 leading-tight">
              Projets Livestock <br /> 
              <span className="italic font-light">les plus accessibles.</span>
            </h2>
            <p className="text-emerald-600 text-sm mt-2">
              Top {cheapestLivestock.length} des unités les moins chères
            </p>
          </div>
          <p className="text-emerald-900/40 text-sm max-w-xs font-light italic">
            Cliquez sur les détails pour explorer les conditions d'élevage et les zones géographiques certifiées.
          </p>
        </div>
      </div>

      {cheapestLivestock.length > 0 && (
        <>
          <div className="flex gap-6 animate-marquee-left hover:[animation-play-state:paused] mb-8">
            {row1.map((item, index) => <Card key={`row1-${index}`} item={item} />)}
          </div>

          <div className="flex gap-6 animate-marquee-right hover:[animation-play-state:paused]">
            {row2.map((item, index) => <Card key={`row2-${index}`} item={item} />)}
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto z-[1000] no-scrollbar"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-[1010] bg-white p-2 rounded-full text-emerald-950 hover:bg-amber-500 hover:rotate-90 transition-all shadow-xl"
              >
                <X size={24} />
              </button>
              <LivestockDetailCard data={selectedProject} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee-left { display: flex; width: fit-content; animation: marquee-left 40s linear infinite; }
        .animate-marquee-right { display: flex; width: fit-content; animation: marquee-right 40s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default PopularLivestock;