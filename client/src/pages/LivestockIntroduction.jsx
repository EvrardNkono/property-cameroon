import React from 'react';
import { motion } from 'framer-motion';
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
      subtitle: "The Blue Gold",
      icon: <Fish size={40} />,
      desc: "Intensive Tilapia and Clarias farming in above-ground tanks. A short 6-month cycle for rapid profitability.",
      image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=1000",
      color: "from-emerald-900/80"
    },
    {
      title: "Poultry Farming",
      subtitle: "Continuous Production",
      icon: <Bird size={40} />,
      desc: "Broilers and layers. Automated cycle management for a constant supply to the local market.",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000",
      color: "from-green-900/80"
    },
    {
      title: "Cattle Ranching",
      subtitle: "The Heritage",
      icon: <Database size={40} />, 
      desc: "Investment in bovine livestock (meat and dairy). Long-term value creation across sub-regional markets.",
      image: "https://images.unsplash.com/photo-1545468843-059960205249?q=80&w=1000",
      color: "from-emerald-800/80"
    },
    {
      title: "Pig Farming",
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
              className="group relative h-[450px] rounded-[3rem] overflow-hidden border border-emerald-900/10 shadow-2xl cursor-pointer"
            >
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
                <button className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                  Discover Assets <ArrowRight size={16} className="text-amber-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- POPULAR PROJECTS --- */}
      <div className="pb-32">
        <PopularLivestock />
      </div>

      {/* --- VALUE PROPOSITION --- */}
      <section className="bg-emerald-950 py-32 rounded-[5rem] mx-4 mb-32 border-b-4 border-amber-600 shadow-inner">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6 text-left">Value Chain</h2>
              <h3 className="text-5xl font-serif text-white leading-[1.1]">Why produce <span className="italic text-amber-500">Locally?</span></h3>
              <p className="text-emerald-100/50 mt-8 font-light">
                Every animal raised on our sites meets specific national demand. We don't produce by chance; we fill identified production deficits.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: <TrendingUp className="text-amber-500" />, title: "Recurring Cash-flow", desc: "Unlike passive real estate, livestock generates cyclical income (eggs, milk, meat)." },
                { icon: <ShieldCheck className="text-amber-500" />, title: "CAPEF Security", desc: "Rigorous sanitary monitoring and coaching by technicians from the Chamber of Agriculture." },
                { icon: <Warehouse className="text-amber-500" />, title: "Local Processing", desc: "Direct access to slaughterhouses and preservation facilities to minimize losses." },
                { icon: <Globe className="text-amber-500" />, title: "Guaranteed Market", desc: "Direct connection with inter-professional bodies and major retailers." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-amber-500/30 transition-all">
                  <div className="mb-6">{item.icon}</div>
                  <h4 className="text-white font-serif text-xl mb-3">{item.title}</h4>
                  <p className="text-emerald-100/40 text-xs leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-40 text-center max-w-4xl mx-auto px-6">
        <BadgeCheck className="mx-auto text-amber-500 w-20 h-20 mb-10" />
        <h2 className="text-5xl md:text-7xl font-serif text-emerald-950 mb-8 leading-[0.9]">
          Turn Soil <br />into <span className="italic text-amber-600 underline decoration-emerald-800/20 underline-offset-8">Wealth.</span>
        </h2>
        <p className="text-emerald-900/60 text-lg font-light mb-12">
          Select a sector above to explore available production units and start your certified operation.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="bg-emerald-900 text-amber-200 px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl">
            Launch a Livestock Project
          </button>
          <button className="border-2 border-emerald-900/20 text-emerald-950 px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-amber-600 transition-all">
            Consult Technical Guides
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LivestockIntroduction;