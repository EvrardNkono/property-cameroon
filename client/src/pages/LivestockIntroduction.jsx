import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Leaf, Fish, Bird, 
  Database, TrendingUp, ShieldCheck, 
  Warehouse, Globe, BadgeCheck 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PopularLivestock from '../components/PopularLivestock'; // Ton nouveau composant

const LivestockIntroduction = () => {
  const categories = [
    {
      title: "Aquaculture",
      subtitle: "L'Or Bleu",
      icon: <Fish size={40} />,
      desc: "Élevage intensif de Tilapia et Clarias en bacs hors-sol. Un cycle court de 6 mois pour une rentabilité rapide.",
      image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=1000",
      color: "from-emerald-900/80"
    },
    {
      title: "Aviculture",
      subtitle: "Production Continue",
      icon: <Bird size={40} />,
      desc: "Poulets de chair et pondeuses. Gestion automatisée des cycles pour un approvisionnement constant du marché local.",
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000",
      color: "from-green-900/80"
    },
    {
      title: "Élevage Bovin",
      subtitle: "Le Patrimoine",
      icon: <Database size={40} />, 
      desc: "Investissement dans le cheptel bovin (viande et lait). Valorisation à long terme sur les marchés sous-régionaux.",
      image: "https://images.unsplash.com/photo-1545468843-059960205249?q=80&w=1000",
      color: "from-emerald-800/80"
    },
    {
      title: "Porciculture",
      subtitle: "Filière Dynamique",
      icon: <Leaf size={40} />,
      desc: "Élevage de porcins avec un suivi vétérinaire rigoureux. Une demande nationale en constante progression.",
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
             alt="Champs Verts"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-emerald-950" />
        
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 border border-amber-500/40 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 bg-amber-500/5 backdrop-blur-md"
          >
            Souveraineté Alimentaire • Cameroun
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-[100px] font-serif text-amber-500 leading-tight mb-6"
          >
            Livestock <br /> 
            <span className="text-white italic font-light">L'Économie Vivante.</span>
          </motion.h1>
          <p className="text-emerald-100/70 max-w-2xl mx-auto text-lg font-light italic">
            Transformez vos hectares en unités de production certifiées par la CAPEF. 
            Investissez dans le cycle de la vie, nourrissez l'émergence.
          </p>
        </div>
      </section>

      {/* --- LES PILIERS DU LIVESTOCK (SECTION CLIQUABLE) --- */}
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
                  Découvrir les actifs <ArrowRight size={16} className="text-amber-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PROJETS LIVESTOCK POPULAIRES (SLIDER) --- */}
      <div className="pb-32">
        <PopularLivestock />
      </div>

      {/* --- SECTION POURQUOI LE LIVESTOCK ? (L'ARGUMENT CHOC) --- */}
      <section className="bg-emerald-950 py-32 rounded-[5rem] mx-4 mb-32 border-b-4 border-amber-600 shadow-inner">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6 text-left">Chaîne de Valeur</h2>
              <h3 className="text-5xl font-serif text-white leading-[1.1]">Pourquoi produire <span className="italic text-amber-500">Local ?</span></h3>
              <p className="text-emerald-100/50 mt-8 font-light">
                Chaque bête élevée sur nos sites répond à une commande nationale. Nous ne produisons pas au hasard, nous comblons un déficit de production identifié.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: <TrendingUp className="text-amber-500" />, title: "Cash-flow Récurrent", desc: "Contrairement au foncier passif, le livestock génère des revenus cycliques (oeufs, lait, viande)." },
                { icon: <ShieldCheck className="text-amber-500" />, title: "Sécurité CAPEF", desc: "Suivi sanitaire rigoureux et encadrement par les techniciens de la Chambre d'Agriculture." },
                { icon: <Warehouse className="text-amber-500" />, title: "Transformation Locale", desc: "Accès direct aux abattoirs et usines de conservation pour minimiser les pertes." },
                { icon: <Globe className="text-amber-500" />, title: "Marché Garanti", desc: "Mise en relation directe avec les interprofessions et la grande distribution." }
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
          Passez de la Terre <br />à la <span className="italic text-amber-600 underline decoration-emerald-800/20 underline-offset-8">Richesse.</span>
        </h2>
        <p className="text-emerald-900/60 text-lg font-light mb-12">
          Choisissez une filière ci-dessus pour explorer les unités de production disponibles et commencer votre exploitation certifiée.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="bg-emerald-900 text-amber-200 px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl">
            Lancer un projet d'élevage
          </button>
          <button className="border-2 border-emerald-900/20 text-emerald-950 px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-amber-600 transition-all">
            Consulter les guides techniques
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LivestockIntroduction;