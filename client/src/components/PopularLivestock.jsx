import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ArrowUpRight, X } from 'lucide-react';
import LivestockDetailCard from './LivestockDetailCard';

const PopularLivestock = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const trendingProjects = [
    {
      id: 1,
      name: "Silures de Kribi - Cycle Rapide",
      title: "Silures de Kribi - Cycle Rapide",
      category: "Aquaculture",
      owner: "Aquaculture du Littoral SARL",
      zone: "Kribi, Sud",
      location: "Kribi, Sud",
      price: "450,000",
      yield: "+22%",
      type: "Aquaculture",
      image: "https://images.unsplash.com/photo-1514170307137-080646c1a84c?q=80&w=800",
      conditionsDesc: "Élevés dans des bacs circulaires hors-sol avec un système de filtration biologique. Nous utilisons une densité de 150 poissons par m3 pour garantir une croissance homogène et limiter le stress des alevins.",
      locationDesc: "La ferme est située dans le bassin de la Lobé, à proximité du port de Kribi, ce qui permet un acheminement rapide vers les marchés de Douala et Yaoundé.",
      temp: "27°C - 30°C",
      cycle: "6 Mois",
      maturite: "1.2kg / poisson"
    },
    {
      id: 2,
      name: "Poulets de Chair - Ferme Pilote",
      title: "Poulets de Chair - Ferme Pilote",
      category: "Aviculture",
      owner: "Éts. Mvondo & Fils",
      zone: "Obala, Centre",
      location: "Obala, Centre",
      price: "1,200,000",
      yield: "+18%",
      type: "Aviculture",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800",
      conditionsDesc: "Bâtiments semi-ouverts avec régulation thermique naturelle. Alimentation 100% naturelle à base de maïs local et soja. Suivi vétérinaire hebdomadaire certifié.",
      locationDesc: "Zone périurbaine d'Obala, stratégiquement placée pour desservir la capitale Yaoundé en moins de 45 minutes.",
      temp: "24°C - 26°C",
      cycle: "45 Jours",
      maturite: "2.5kg / poulet"
    },
    {
      id: 3,
      name: "Bovins de l'Adamaoua (Goudali)",
      title: "Bovins de l'Adamaoua (Race Goudali)",
      category: "Élevage Bovin",
      owner: "Groupement Pastoral Ngaoundéré",
      zone: "Ngaoundéré, Adamaoua",
      location: "Ngaoundéré, Adamaoua",
      price: "3,500,000",
      yield: "+15%",
      type: "Élevage Bovin",
      image: "https://images.unsplash.com/photo-1545468843-059960205249?q=80&w=800",
      conditionsDesc: "Système de ranching amélioré avec rotation des pâturages. Les bêtes bénéficient d'un complément nutritionnel riche en coton et tourteaux de soja pendant la saison sèche.",
      locationDesc: "Hauts plateaux de l'Adamaoua, zone réputée pour la qualité de ses pâturages naturels et son climat favorable à la race Goudali.",
      temp: "22°C",
      cycle: "24 Mois",
      maturite: "450kg / bête"
    },
    {
      id: 4,
      name: "Porcins Charcutiers - Unité 12",
      title: "Porcins Charcutiers - Unité 12",
      category: "Porciculture",
      owner: "Batié Livestock Group",
      zone: "Bafoussam, Ouest",
      location: "Bafoussam, Ouest",
      price: "850,000",
      yield: "+25%",
      type: "Porciculture",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800",
      conditionsDesc: "Loges bétonnées avec évacuation automatique. Système d'abreuvement automatique 'Nipple'. Protocoles de biosécurité stricts à l'entrée de l'unité.",
      locationDesc: "Situé sur les collines de Batié, bénéficiant d'un air pur et d'une proximité avec les grands centres de distribution de l'Ouest.",
      temp: "20°C - 23°C",
      cycle: "7 Mois",
      maturite: "90kg / porc"
    }
  ];

  const row1 = [...trendingProjects, ...trendingProjects];
  const row2 = [...trendingProjects].reverse().concat([...trendingProjects].reverse());

  const Card = ({ item }) => (
    <div className="flex-shrink-0 w-[350px] bg-white border border-emerald-900/5 p-4 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all group">
      <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-4">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-amber-400 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
          {item.type}
        </div>
        <div className="absolute bottom-3 right-3 bg-emerald-950 text-white text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-white/10">
          <TrendingUp className="w-3 h-3 text-amber-500" /> {item.yield}
        </div>
      </div>
      
      <div className="px-2">
        <h4 className="text-emerald-950 font-serif text-lg mb-1 group-hover:text-emerald-800 transition-colors line-clamp-1">{item.title}</h4>
        <div className="flex items-center gap-2 text-emerald-900/40 text-[10px] mb-4">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="font-bold text-emerald-900/60 uppercase">{item.owner}</span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-emerald-50">
          <div className="flex flex-col">
            <span className="text-[8px] text-emerald-900/30 uppercase font-black">Ticket d'entrée</span>
            <span className="text-emerald-950 font-black text-sm">{item.price} XAF</span>
          </div>
          
          {/* BOUTON DÉTAILS AMÉLIORÉ */}
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

  return (
    <section className="py-24 bg-[#fdfcf0] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em]">Opportunités du Marché</span>
            <h2 className="text-5xl font-serif text-emerald-950 mt-4 leading-tight">Projets Livestock <br /> <span className="italic font-light">les plus sollicités.</span></h2>
          </div>
          <p className="text-emerald-900/40 text-sm max-w-xs font-light italic">
            Cliquez sur les détails pour explorer les conditions d'élevage et les zones géographiques certifiées.
          </p>
        </div>
      </div>

      <div className="flex gap-6 animate-marquee-left hover:[animation-play-state:paused] mb-8">
        {row1.map((item, index) => <Card key={`row1-${index}`} item={item} />)}
      </div>

      <div className="flex gap-6 animate-marquee-right hover:[animation-play-state:paused]">
        {row2.map((item, index) => <Card key={`row2-${index}`} item={item} />)}
      </div>

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

const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default PopularLivestock;