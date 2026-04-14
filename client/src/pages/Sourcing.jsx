import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

/* ─────────────── UNSPLASH IMAGES ─────────────── */
const IMG = {
  hero:       "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=1800&q=80",
  canton1:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
  canton2:    "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=900&q=80",
  canton3:    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80",
  china:      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=900&q=80",
  farmer:     "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80",
  irrigation: "/images/globalirigationkit.jfif",
  press:      "/images/compactoil.jfif",
  dryer:      "/images/dryingunit.jfif",
  contract:   "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80",
  shipping:   "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80",
};

/* ─────────────── DATA ─────────────── */
const PRODUCTS = [
  { title: "Kit d'irrigation solaire", price: "À partir de 249 000 FCFA", img: IMG.irrigation, tag: "BEST SELLER",
    desc: "Système autonome pour 1 hectare. Zéro carburant. Inclut panneau 300W, pompe immergée, tuyaux PE et programmateur. Installation en 4h." },
  { title: "Presse à huile compacte", price: "À partir de 450 000 FCFA", img: IMG.press, tag: "TOP QUALITÉ",
    desc: "Rendement 85–92%. Traite palme, arachide, sésame. Capacité 50–80 kg/h. Moteur 2.2 kW monophasé. Acier inox alimentaire." },
  { title: "Séchoir professionnel", price: "À partir de 185 000 FCFA", img: IMG.dryer, tag: "POST-RÉCOLTE",
    desc: "Pour cacao, café, maïs, manioc. Température réglable 40–80°C. Capacité 200 kg/cycle. Économie de 70% vs séchage solaire classique." },
];

const STEPS = [
  { num:"01", icon:"📋", title:"Consultation & Cahier des charges",
    short:"Vous transmettez vos besoins, nous analysons.",
    full:"Vous nous transmettez vos besoins précis : type de matériel, budget, quantités, contraintes techniques (voltage, normes, dimensions). Nous produisons un cahier des charges détaillé et identifions les fabricants les mieux adaptés à votre exploitation.", img: IMG.farmer },
  { num:"02", icon:"🔎", title:"Sourcing & Vérification fournisseur",
    short:"Audit physique des usines à Guangzhou.",
    full:"Notre réseau à Guangzhou contacte les usines directement. Nous vérifions licences commerciales, certifications ISO/CE, capacité de production et réputation. Aucun fournisseur non audité n'entre dans notre chaîne.", img: IMG.canton1 },
  { num:"03", icon:"🤝", title:"Négociation & Échantillonnage",
    short:"Des échantillons testés avant toute commande.",
    full:"Nous négocions les prix en votre nom — sans conflit d'intérêt. Des échantillons sont commandés, testés et photographiés. Vous validez avant tout paiement de production. Vous ne payez que ce que vous avez approuvé.", img: IMG.canton3 },
  { num:"04", icon:"📄", title:"Contractualisation & Paiement sécurisé",
    short:"Contrat bilingue FR/CN, paiement encadré.",
    full:"Contrat rédigé en français ET mandarin avec clauses de protection acheteur, garanties de conformité, pénalités de retard. Paiement via LC (lettre de crédit), escrow ou virement encadré à jalons de production.", img: IMG.contract },
  { num:"05", icon:"🔍", title:"Contrôle qualité avant embarquement",
    short:"Inspecteurs tiers certifiés sur site en Chine.",
    full:"Nous mandatons des inspecteurs tiers certifiés (SGS, Bureau Veritas ou équivalents) pour valider chaque lot avant qu'il quitte la Chine. Rapport d'inspection avec photos remis. Zéro surprise à Douala.", img: IMG.canton2 },
  { num:"06", icon:"🚢", title:"Expédition & Dédouanement Cameroun",
    short:"Fret maritime, suivi en temps réel, livraison.",
    full:"Coordination logistique complète : fret maritime LCL/FCL, documents douaniers (BL, certificat d'origine), suivi tracking en temps réel. Dédouanement à Douala et transport jusqu'à Yaoundé ou votre site.", img: IMG.shipping },
];

const FAIRS = [
  { badge:"PRINTEMPS", color:"#c8a84b", name:"Canton Fair – Session Printemps",
    dates:"15 avril – 5 mai 2026", location:"Guangzhou, Guangdong",
    focus:"Matériel agricole, machinerie, équipements industriels",
    detail:"La plus grande foire commerciale au monde. +25 000 exposants. Section agricole massive avec démonstrations en direct. Palm Connect y est présent — nous pouvons vous représenter ou vous accompagner sur place.", img: IMG.canton1 },
  { badge:"AUTOMNE", color:"#e07b3a", name:"Canton Fair – Session Automne",
    dates:"15 oct – 4 nov 2026", location:"Guangzhou, Guangdong",
    focus:"Outillage, agrochimie, technologies post-récolte",
    detail:"Session idéale pour négocier les prix de l'année suivante. Les fabricants font des efforts commerciaux significatifs en fin d'exercice fiscal. Parfait pour la campagne cacao de la saison suivante.", img: IMG.canton2 },
  { badge:"MACHINERIE", color:"#4a9f6a", name:"CIAME — China Agri Machinery Exhibition",
    dates:"Fin octobre / début novembre", location:"Wuhan, Hubei",
    focus:"Machines agricoles spécialisées, irrigation, semences",
    detail:"Le salon le plus technique pour l'équipement agricole spécialisé. Tracteurs, moissonneuses, systèmes d'irrigation sur mesure. Idéal pour des commandes complexes ou personnalisées.", img: IMG.canton3 },
  { badge:"B2B", color:"#3a6ea8", name:"China International Import Expo (CIIE)",
    dates:"5–10 novembre 2026", location:"Shanghai",
    focus:"Importations, partenariats B2B internationaux",
    detail:"Événement stratégique pour établir des partenariats durables. Plus orienté business development qu'achat direct. Recommandé pour les entreprises cherchant des partenaires de long terme.", img: IMG.china },
  { badge:"WHOLESALE", color:"#8a4faf", name:"Yiwu International Trade Fair",
    dates:"21–25 octobre 2026", location:"Yiwu, Zhejiang",
    focus:"Petits équipements, consommables, fournitures en gros",
    detail:"La mecque du petit équipement et des fournitures en gros. Idéal pour les revendeurs ou pour compléter une commande principale avec des accessoires à prix imbattables.", img: IMG.canton1 },
];

const TRAPS = [
  { icon:"👻", title:"Les fournisseurs fantômes",
    full:"Des milliers de sites chinois (Alibaba, DHgate, Made-in-China) présentent des produits sans usine réelle. Sans vérification physique, vous risquez de perdre 30 à 50 % du montant total. Nous auditons chaque fournisseur avant tout engagement." },
  { icon:"💸", title:"L'acompte sans contrat opposable",
    full:"Un virement sans contrat bilingue vous prive de tout recours légal. En Chine, seuls les contrats en mandarin simplifié ont force exécutoire. Nos contrats sont rédigés par des juristes spécialisés sino-africains." },
  { icon:"📦", title:"Qualité 'export grade' vs réelle",
    full:"Nombreux fournisseurs expédient des produits inférieurs aux échantillons validés, une fois la commande payée. Notre inspection pré-embarquement (norme AQL) bloque ce risque à la source." },
  { icon:"🧾", title:"Les frais cachés à l'importation",
    full:"TVA, droits de douane CEMAC, frais de transit, surestaries au port — ces coûts peuvent atteindre 25 à 45 % du prix d'achat. Nous établissons un devis tout compris avant validation : zéro surprise." },
  { icon:"🔌", title:"La barrière technique et linguistique",
    full:"Voltage 220V vs 380V, mono vs triphasé, norme CE vs GB/T, filetage métrique vs UNC — une mauvaise spec peut rendre un équipement inutilisable à l'arrivée. Nos équipes rédigent les specs en mandarin technique." },
  { icon:"⏳", title:"Les délais non contractualisés",
    full:"Sans pénalités de retard dans le contrat, 4 semaines annoncées peuvent devenir 16 semaines — immobilisant votre capital. Nous incluons systématiquement un planning de production opposable avec pénalités." },
];

const PERIODS = [
  { season:"Janv – Mars", label:"Pré-saison des pluies", stars:5, color:"#4a9f6a",
    tip:"Idéal pour commander du matériel d'irrigation et des semoirs avant les semailles d'avril. Les délais de fabrication (4–8 semaines) s'alignent parfaitement avec les premières pluies camerounaises." },
  { season:"Avr – Juin", label:"Post-Canton Printemps", stars:4, color:"#c8a84b",
    tip:"Juste après la Foire de Canton, les usines sont en plein régime. Bon moment pour négocier les stocks d'exposition souvent vendus à prix réduit." },
  { season:"Juil – Sept", label:"Pré-saison sèche", stars:3, color:"#e07b3a",
    tip:"Commander du matériel de séchage et de pressage pour la campagne cacao. Attention aux fermetures d'usines en août. Délais plus longs." },
  { season:"Oct – Déc", label:"Post-Canton Automne", stars:5, color:"#3a6ea8",
    tip:"Meilleure période de l'année. Négociation des prix pour N+1. Les fabricants font des efforts commerciaux majeurs en fin d'exercice fiscal chinois." },
];

/* ─────────────── HELPERS ─────────────── */
function CountUp({ target, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick); else setVal(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Accordion({ open, onToggle, header, children, borderColor }) {
  return (
    <div
      className={`transition-all duration-400 cursor-pointer overflow-hidden border ${open ? 'shadow-xl' : 'hover:shadow-md'}`}
      style={open && borderColor ? { borderColor, borderLeftWidth: 4 } : {}}
      onClick={onToggle}
    >
      {header}
      <div className={`grid transition-all duration-500 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────── PAGE ─────────────── */
const Sourcing = () => {
  const [openStep,    setOpenStep]    = useState(0);
  const [openFair,    setOpenFair]    = useState(0);
  const [openTrap,    setOpenTrap]    = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const [period,      setPeriod]      = useState(0);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Georgia','Times New Roman',serif" }}>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative pt-32 pb-0 bg-[#0a192f] text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-25">
            <source src="/video/sourcing.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ backgroundImage:`url(${IMG.hero})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.2 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0a192f]/85 to-[#0a192f]/40" />
        </div>
        <div className="absolute inset-0 z-[1] opacity-[0.05]" style={{ backgroundImage:'linear-gradient(#c8a84b 1px,transparent 1px),linear-gradient(90deg,#c8a84b 1px,transparent 1px)', backgroundSize:'80px 80px' }} />

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-pc-gold text-[10px] uppercase tracking-[0.6em] font-bold mb-6 block" style={{ fontFamily:'sans-serif' }}>
                Sourcing Agricole — Guide Complet
              </span>
              <h1 className="text-5xl md:text-7xl leading-[1.05] mb-8 italic">
                Acheter en<br /><span className="text-pc-gold">Chine</span>,<br />sans risque.
              </h1>
              <p className="text-white/70 text-base max-w-lg leading-relaxed mb-10" style={{ fontFamily:'sans-serif', fontStyle:'normal' }}>
                Guide complet par nos experts à Yaoundé et Canton. Processus sécurisé en 6 étapes, foires 2026, pièges à éviter, équipements au prix usine.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/book-appointment">
                  <button className="bg-pc-gold text-pc-green px-10 py-4 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all shadow-2xl" style={{ fontFamily:'sans-serif' }}>
                    Démarrer gratuitement
                  </button>
                </Link>
                <a href="#produits">
                  <button className="border border-white/30 text-white px-10 py-4 uppercase text-[11px] font-black tracking-widest hover:border-pc-gold hover:text-pc-gold transition-all" style={{ fontFamily:'sans-serif' }}>
                    Voir les équipements ↓
                  </button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { target:60, suffix:"%", label:"Économie vs Europe", sub:"sur l'équipement agricole" },
                { target:500, suffix:"+", label:"Fabricants audités", sub:"réseau Guangdong" },
                { target:8, suffix:" sem.", label:"Délai moyen", sub:"fabrication sur mesure" },
                { target:100, suffix:"%", label:"Traçabilité", sub:"avec notre accompagnement" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-pc-gold transition-all">
                  <div className="text-4xl font-black text-pc-gold mb-2"><CountUp target={s.target} suffix={s.suffix} /></div>
                  <div className="font-bold text-sm mb-1">{s.label}</div>
                  <div className="text-white/40 text-[10px] uppercase tracking-wider" style={{ fontFamily:'sans-serif' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10" style={{ background:'linear-gradient(to bottom,transparent,#f8fafc)' }} />
      </section>

      {/* ══ PRODUITS EN HAUT ══ */}
      <section id="produits" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-3" style={{ fontFamily:'sans-serif' }}>Prix Usine Directe</span>
              <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">Équipements phares</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xs md:text-right" style={{ fontFamily:'sans-serif' }}>Tarifs indicatifs départ usine Chine.<br />Devis personnalisé sur demande.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <div key={i}
                className={`bg-white cursor-pointer group transition-all duration-500 overflow-hidden ${openProduct === i ? 'shadow-2xl ring-2 ring-pc-gold' : 'shadow-md hover:shadow-xl'}`}
                onClick={() => setOpenProduct(openProduct === i ? null : i)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4 bg-pc-gold text-pc-green text-[9px] font-black px-3 py-1 uppercase tracking-widest" style={{ fontFamily:'sans-serif' }}>{p.tag}</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-bold text-lg leading-tight">{p.title}</div>
                    <div className="text-pc-gold font-black text-base mt-1">{p.price}</div>
                  </div>
                </div>
                <div className={`grid transition-all duration-500 ${openProduct === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 border-t border-slate-100">
                      <p className="text-slate-500 text-sm leading-relaxed mb-4" style={{ fontFamily:'sans-serif' }}>{p.desc}</p>
                      <Link to="/book-appointment">
                        <button className="w-full bg-pc-green text-white py-3 text-[10px] uppercase tracking-widest font-black hover:bg-pc-gold hover:text-pc-green transition-all" style={{ fontFamily:'sans-serif' }}>
                          Demander un devis →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex justify-between items-center border-t border-slate-50">
                  <span className="text-[10px] uppercase tracking-widest text-slate-300" style={{ fontFamily:'sans-serif' }}>Cliquer pour les détails</span>
                  <span className={`text-pc-gold font-black text-xl transition-transform duration-300 ${openProduct === i ? 'rotate-45' : ''}`}>+</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/book-appointment">
              <button className="border-2 border-pc-green text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-pc-green hover:text-white transition-all" style={{ fontFamily:'sans-serif' }}>
                Tous nos équipements disponibles →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ POURQUOI LA CHINE ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-3 h-[480px]">
            <div className="row-span-2 overflow-hidden">
              <img src={IMG.canton1} alt="Foire de Canton" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden">
              <img src={IMG.china} alt="Guangzhou" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden">
              <img src={IMG.canton3} alt="Machines" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div>
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Pourquoi la Chine ?</span>
            <h2 className="text-4xl md:text-5xl text-pc-green mb-6 leading-tight italic">La source la plus compétitive au monde</h2>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed" style={{ fontFamily:'sans-serif' }}>
              La Chine produit 70 % des équipements agricoles mondiaux. Pour un exploitant africain, accéder directement aux usines de Guangdong est une opportunité historique.
            </p>
            <div className="space-y-5">
              {[
                { stat:"—60%", label:"Économie vs équipements européens ou japonais" },
                { stat:"500+", label:"Fabricants spécialisés en région de Guangdong seule" },
                { stat:"4–8 sem.", label:"Délai de fabrication sur mesure (5 unités et +)" },
                { stat:"100%", label:"Traçabilité garantie avec notre accompagnement" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 border-b border-slate-100 pb-5 hover:border-pc-gold transition-all">
                  <div className="text-3xl font-black text-pc-gold min-w-[90px]">{item.stat}</div>
                  <p className="text-slate-600 text-sm" style={{ fontFamily:'sans-serif' }}>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-slate-50 border-l-4 border-pc-gold p-8">
              <p className="text-slate-500 text-sm italic leading-relaxed mb-2">
                "La Chine est la seule économie capable de produire sur mesure, en petites séries, avec un délai raisonnable. Pour un exploitant camerounais, c'est une fenêtre historique."
              </p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-pc-green" style={{ fontFamily:'sans-serif' }}>— Équipe PALM CONNECT, Yaoundé</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROCESSUS — ACCORDÉON ══ */}
      <section id="processus" className="py-24 px-8 bg-[#0a192f] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Notre Méthode</span>
            <h2 className="text-4xl md:text-5xl leading-tight italic">
              6 étapes pour acheter<br /><span className="text-pc-gold">en toute sécurité</span>
            </h2>
          </div>
          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <div key={i}
                className={`border transition-all duration-400 cursor-pointer overflow-hidden ${openStep === i ? 'border-pc-gold shadow-xl' : 'border-white/10 hover:border-white/30'}`}
                onClick={() => setOpenStep(openStep === i ? null : i)}
              >
                <div className="flex items-center gap-6 p-6 md:p-8">
                  <div className={`text-3xl font-black italic transition-all min-w-[56px] ${openStep === i ? 'text-pc-gold' : 'text-white/20'}`}>{step.num}</div>
                  <div className="text-2xl">{step.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm md:text-base">{step.title}</div>
                    <div className="text-white/40 text-xs mt-1" style={{ fontFamily:'sans-serif' }}>{step.short}</div>
                  </div>
                  <div className={`text-pc-gold font-black text-xl transition-transform duration-300 ${openStep === i ? 'rotate-45' : ''}`}>+</div>
                </div>
                <div className={`grid transition-all duration-500 ${openStep === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col md:flex-row border-t border-white/10">
                      <div className="flex-1 p-6 md:p-10">
                        <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>{step.full}</p>
                        <Link to="/book-appointment">
                          <button className="mt-6 text-[10px] uppercase tracking-widest font-black text-pc-gold border border-pc-gold/40 px-6 py-3 hover:bg-pc-gold hover:text-pc-green transition-all" style={{ fontFamily:'sans-serif' }}>
                            En savoir plus →
                          </button>
                        </Link>
                      </div>
                      <div className="md:w-64 h-44 md:h-auto overflow-hidden shrink-0">
                        <img src={step.img} alt={step.title} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-all duration-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/book-appointment">
              <button className="bg-pc-gold text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all" style={{ fontFamily:'sans-serif' }}>
                Démarrer mon projet d'import
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOIRES — ACCORDÉON ══ */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Agenda 2026</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">
              Les foires incontournables<br />en Chine pour les agriculteurs
            </h2>
            <p className="text-slate-400 text-sm mt-4" style={{ fontFamily:'sans-serif' }}>Cliquez sur une foire pour en savoir plus. Palm Connect peut vous y représenter.</p>
          </div>
          <div className="space-y-3">
            {FAIRS.map((fair, i) => (
              <div key={i}
                className={`bg-white overflow-hidden cursor-pointer transition-all duration-400 border ${openFair === i ? 'shadow-2xl' : 'border-slate-100 hover:shadow-md'}`}
                style={openFair === i ? { borderLeft:`4px solid ${fair.color}`, borderColor: fair.color } : {}}
                onClick={() => setOpenFair(openFair === i ? null : i)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 md:p-8">
                  <span className="text-[9px] uppercase tracking-widest font-black px-3 py-1.5 shrink-0" style={{ background:fair.color, color:'#fff', fontFamily:'sans-serif' }}>{fair.badge}</span>
                  <div className="flex-1">
                    <div className="font-bold text-pc-green">{fair.name}</div>
                    <div className="text-xs text-slate-400" style={{ fontFamily:'sans-serif' }}>{fair.focus}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-sm" style={{ color:fair.color }}>{fair.dates}</div>
                    <div className="text-[10px] text-slate-400" style={{ fontFamily:'sans-serif' }}>📍 {fair.location}</div>
                  </div>
                  <div className={`text-slate-400 font-black text-xl transition-transform duration-300 shrink-0 ${openFair === i ? 'rotate-45' : ''}`}>+</div>
                </div>
                <div className={`grid transition-all duration-500 ${openFair === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col md:flex-row border-t border-slate-100">
                      <div className="flex-1 p-6 md:p-8">
                        <p className="text-slate-600 text-sm leading-relaxed mb-6" style={{ fontFamily:'sans-serif' }}>{fair.detail}</p>
                        <Link to="/book-appointment">
                          <button className="text-[10px] uppercase tracking-widest font-black px-8 py-3 text-white hover:opacity-80 transition-all" style={{ background:fair.color, fontFamily:'sans-serif' }}>
                            Être accompagné à cette foire →
                          </button>
                        </Link>
                      </div>
                      <div className="md:w-72 h-48 md:h-auto overflow-hidden shrink-0">
                        <img src={fair.img} alt={fair.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-pc-gold/10 border border-pc-gold/30 p-6 text-center">
            <p className="text-sm text-slate-700" style={{ fontFamily:'sans-serif' }}>
              <strong>Palm Connect</strong> participe à la Foire de Canton (Printemps &amp; Automne 2026).{' '}
              <Link to="/book-appointment" className="font-bold text-pc-green underline hover:text-pc-gold">Nous contacter pour être représenté →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ══ PÉRIODES — SÉLECTEUR ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Timing Stratégique</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">Quand commander en Chine ?</h2>
            <p className="text-slate-400 text-sm mt-4" style={{ fontFamily:'sans-serif' }}>Sélectionnez une période pour voir nos recommandations.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-0">
            {PERIODS.map((p, i) => (
              <button key={i} onClick={() => setPeriod(i)}
                className={`p-5 text-left border-t-4 transition-all duration-300 ${period === i ? 'shadow-lg' : 'bg-slate-50 border-slate-200 hover:shadow-md'}`}
                style={period === i ? { borderColor:p.color, background:p.color+'14' } : {}}
              >
                <div className="text-[9px] uppercase tracking-widest font-black mb-1" style={{ color:p.color, fontFamily:'sans-serif' }}>{p.label}</div>
                <div className="font-bold text-pc-green text-sm">{p.season}</div>
                <div className="mt-2 text-base" style={{ color:p.color }}>{'★'.repeat(p.stars)}{'☆'.repeat(5-p.stars)}</div>
              </button>
            ))}
          </div>
          <div className="border border-slate-100 bg-slate-50 p-8 md:p-12" style={{ borderTop:`4px solid ${PERIODS[period].color}` }}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="text-4xl font-black mb-2 italic" style={{ color:PERIODS[period].color }}>{PERIODS[period].season}</div>
                <div className="text-lg mb-4 italic text-pc-green">{PERIODS[period].label}</div>
                <p className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>{PERIODS[period].tip}</p>
              </div>
              <div className="shrink-0">
                <Link to="/book-appointment">
                  <button className="px-10 py-4 text-white text-[10px] uppercase tracking-widest font-black hover:opacity-80 transition-all" style={{ background:PERIODS[period].color, fontFamily:'sans-serif' }}>
                    Planifier pour cette période →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PIÈGES — ACCORDÉON ══ */}
      <section className="py-24 px-8 bg-[#0a192f] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#e07b3a] text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Risques & Vigilance</span>
            <h2 className="text-4xl md:text-5xl leading-tight italic">
              Les 6 pièges classiques<br /><span className="text-[#e07b3a]">à connaître absolument</span>
            </h2>
            <p className="text-white/40 text-sm mt-4 max-w-lg mx-auto" style={{ fontFamily:'sans-serif' }}>
              Ces erreurs coûtent des millions de FCFA à des acheteurs africains chaque année. Cliquez pour lire.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TRAPS.map((trap, i) => (
              <div key={i}
                className={`border transition-all duration-300 cursor-pointer overflow-hidden ${openTrap === i ? 'border-[#e07b3a] bg-white/10' : 'border-white/10 hover:border-white/25 bg-white/5'}`}
                onClick={() => setOpenTrap(openTrap === i ? null : i)}
              >
                <div className="flex items-center gap-5 p-6">
                  <span className="text-3xl">{trap.icon}</span>
                  <div className="flex-1 font-bold text-sm">{trap.title}</div>
                  <div className={`text-[#e07b3a] font-black text-xl transition-transform duration-300 ${openTrap === i ? 'rotate-45' : ''}`}>+</div>
                </div>
                <div className={`grid transition-all duration-400 ${openTrap === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="border-t border-white/10 px-6 pb-6 pt-4">
                      <p className="text-white/60 text-xs leading-relaxed" style={{ fontFamily:'sans-serif' }}>{trap.full}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 border border-pc-gold/30 bg-white/5 p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="text-pc-gold font-black text-lg mb-3">Palm Connect = votre garde-fou.</div>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>
                Présents physiquement en Chine. Contrats bilingues opposables. Inspection qualité avant embarquement. Dédouanement au Cameroun. Nous ne lâchons pas le dossier.
              </p>
            </div>
            <Link to="/book-appointment">
              <button className="shrink-0 bg-pc-gold text-pc-green px-12 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all" style={{ fontFamily:'sans-serif' }}>
                Bénéficier de notre protection
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FIABILITÉ — CARTES IMAGE ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Notre Fiabilité</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">Pourquoi faire confiance<br />à Palm Connect ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon:"🏛", img:IMG.canton2, title:"Présence institutionnelle", desc:"Membre actif de la Foire de Canton. Équipes présentes physiquement lors des foires et visites d'usines. Vous n'achetez pas à l'aveugle." },
              { icon:"📄", img:IMG.contract, title:"Contrats bilingues FR/CN", desc:"Chaque transaction encadrée par un contrat en français ET mandarin, avec clauses de protection acheteur et pénalités de retard." },
              { icon:"🔍", img:IMG.shipping, title:"Contrôle qualité avant embarquement", desc:"Inspecteurs tiers certifiés (SGS, Bureau Veritas) valident chaque lot avant qu'il quitte la Chine. Zéro surprise à Douala." },
              { icon:"🌍", img:IMG.farmer, title:"Ancrage local au Cameroun", desc:"Basés à Yaoundé, nous assurons suivi post-livraison, dédouanement et mise en service sur votre exploitation." },
              { icon:"🤝", img:IMG.canton1, title:"Réseau de fournisseurs audités", desc:"Chaque fournisseur visité, audité et testé. Certifications ISO, CE vérifiées. Aucun intermédiaire inconnu." },
              { icon:"💬", img:IMG.china, title:"Accompagnement bout en bout", desc:"De la foire de Canton à votre exploitation. Pas de frais cachés. Communication transparente à chaque étape." },
            ].map((item, i) => (
              <div key={i} className="border border-slate-100 overflow-hidden group hover:shadow-xl hover:border-pc-gold transition-all duration-500">
                <div className="h-40 overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-3xl">{item.icon}</div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-pc-green mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily:'sans-serif' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-32 bg-[#0a192f] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:`url(${IMG.canton2})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-transparent to-[#0a192f]" />
        <div className="max-w-3xl mx-auto px-8 relative z-10">
          <span className="text-pc-gold text-[10px] uppercase tracking-[0.5em] font-black block mb-8" style={{ fontFamily:'sans-serif' }}>Prêt à passer à l'action ?</span>
          <h2 className="text-4xl md:text-6xl leading-tight mb-8 italic">
            "L'avenir appartient<br />à ceux qui s'équipent<br /><span className="text-pc-gold">avant les autres."</span>
          </h2>
          <p className="text-white/50 text-sm mb-14 leading-relaxed" style={{ fontFamily:'sans-serif' }}>
            Premier entretien gratuit et sans engagement. Nos experts vous répondent sous 24h.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/book-appointment">
              <button className="bg-pc-gold text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all shadow-2xl" style={{ fontFamily:'sans-serif' }}>
                Prendre rendez-vous — Gratuit
              </button>
            </Link>
            <Link to="/book-appointment">
              <button className="border border-white/30 text-white px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:border-pc-gold hover:text-pc-gold transition-all" style={{ fontFamily:'sans-serif' }}>
                Poser une question →
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sourcing;