import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import ajouté
import { 
  ArrowRight, Leaf, Fish, Bird, 
  Database, TrendingUp, ShieldCheck, 
  Warehouse, Globe, BadgeCheck 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PopularLivestock from '../components/PopularLivestock';

const LivestockIntroduction = () => {
  const categories = [
    {
      title: "Aquaculture",
      slug: "aquaculture", // Identifiant pour l'URL
      subtitle: "The Blue Gold",
      icon: <Fish size={40} />,
      desc: "Intensive Tilapia and Clarias farming in above-ground tanks. A short 6-month cycle for rapid profitability.",
      image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=1000",
      color: "from-emerald-900/80"
    },
    {
      title: "Poultry Farming",
      slug: "poultry",
      subtitle: "Continuous Production",
      icon: <Bird size={40} />,
      desc: "Broilers and layers. Automated cycle management for a constant supply to the local market.",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000",
      color: "from-green-900/80"
    },
    {
      title: "Cattle Ranching",
      slug: "cattle",
      subtitle: "The Heritage",
      icon: <Database size={40} />, 
      desc: "Investment in bovine livestock (meat and dairy). Long-term value creation across sub-regional markets.",
      image: "https://images.unsplash.com/photo-1545468843-059960205249?q=80&w=1000",
      color: "from-emerald-800/80"
    },
    {
      title: "Pig Farming",
      slug: "pigs",
      subtitle: "Dynamic Sector",
      icon: <Leaf size={40} />,
      desc: "Swine production with rigorous veterinary monitoring. National demand is in constant progression.",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1000",
      color: "from-green-800/80"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf0] selection:bg-emerald-800 selection:text-amber-200">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000" 
             className="w-full h-full object-cover grayscale-[0.5]" 
             alt="Green Fields"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-emerald-950" />
        
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 border border-amber-500/40 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 bg-amber-500/5 backdrop-blur-md"
          >
            Food Sovereignty • Cameroon
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-[100px] font-serif text-amber-500 leading-tight mb-6"
          >
            Livestock <br /> 
            <span className="text-white italic font-light">The Living Economy.</span>
          </motion.h1>
          <p className="text-emerald-100/70 max-w-2xl mx-auto text-lg font-light italic">
            Transform your land into CAPEF-certified production units. 
            Invest in the cycle of life, fuel the emergence.
          </p>
        </div>
      </section>

      {/* --- LIVESTOCK PILLARS --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-[3rem] overflow-hidden border border-emerald-900/10 shadow-2xl"
            >
              {/* Le Link enveloppe toute la carte pour la navigation */}
              <Link to={`/agriculture/livestock/${cat.slug}`}>
                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.title} />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-emerald-950/40 to-transparent`} />
                
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform origin-left">
                    {cat.icon}
                  </div>
                  <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">{cat.subtitle}</span>
                  <h3 className="text-4xl font-serif text-white mb-4">{cat.title}</h3>
                  <p className="text-emerald-50/70 text-sm font-light leading-relaxed mb-8 max-w-sm">
                    {cat.desc}
                  </p>
                  <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                    Discover Assets <ArrowRight size={16} className="text-amber-500" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- REST OF THE PAGE --- */}
      <div className="pb-32">
        <PopularLivestock />
      </div>

      <Footer />
    </div>
  );
};

export default LivestockIntroduction;