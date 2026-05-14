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
  { title: "Solar Irrigation Kit", price: "From 249,000 FCFA", img: IMG.irrigation, tag: "BEST SELLER",
    desc: "Autonomous system for 1 hectare. Zero fuel. Includes 300W panel, submersible pump, PE pipes and timer. Installed in 4 hours." },
  { title: "Compact Oil Press", price: "From 450,000 FCFA", img: IMG.press, tag: "TOP QUALITY",
    desc: "85–92% yield. Processes palm, peanut, sesame. Capacity 50–80 kg/h. 2.2 kW single-phase motor. Food-grade stainless steel." },
  { title: "Professional Dryer", price: "From 185,000 FCFA", img: IMG.dryer, tag: "POST-HARVEST",
    desc: "For cocoa, coffee, maize, cassava. Adjustable temperature 40–80°C. Capacity 200 kg/cycle. 70% energy saving vs traditional solar drying." },
];

const STEPS = [
  { num:"01", icon:"📋", title:"Consultation & Requirements Specification",
    short:"You share your needs, we analyze them.",
    full:"You provide us with your precise requirements: type of equipment, budget, quantities, technical constraints (voltage, standards, dimensions). We produce a detailed specification sheet and identify the manufacturers best suited to your operation.", img: IMG.farmer },
  { num:"02", icon:"🔎", title:"Sourcing & Supplier Verification",
    short:"Physical audit of factories in Guangzhou.",
    full:"Our network in Guangzhou contacts factories directly. We verify business licenses, ISO/CE certifications, production capacity and reputation. No unaudited supplier enters our supply chain.", img: IMG.canton1 },
  { num:"03", icon:"🤝", title:"Negotiation & Sampling",
    short:"Samples tested before any order is placed.",
    full:"We negotiate prices on your behalf — with no conflict of interest. Samples are ordered, tested and photographed. You approve before any production payment is made. You only pay for what you have approved.", img: IMG.canton3 },
  { num:"04", icon:"📄", title:"Contracting & Secure Payment",
    short:"Bilingual EN/CN contract, structured payment.",
    full:"Contract drafted in both English AND Mandarin with buyer protection clauses, compliance guarantees and late delivery penalties. Payment via LC (letter of credit), escrow or milestone-based wire transfer.", img: IMG.contract },
  { num:"05", icon:"🔍", title:"Pre-Shipment Quality Control",
    short:"Certified third-party inspectors on-site in China.",
    full:"We commission certified third-party inspectors (SGS, Bureau Veritas or equivalent) to validate every batch before it leaves China. Inspection report with photos provided. Zero surprises upon arrival in Douala.", img: IMG.canton2 },
  { num:"06", icon:"🚢", title:"Shipping & Cameroon Customs Clearance",
    short:"Sea freight, real-time tracking, delivery.",
    full:"Full logistics coordination: LCL/FCL sea freight, customs documents (BL, certificate of origin), real-time tracking. Customs clearance in Douala and transport to Yaoundé or your site.", img: IMG.shipping },
];

const FAIRS = [
  { badge:"SPRING", color:"#c8a84b", name:"Canton Fair – Spring Session",
    dates:"April 15 – May 5, 2026", location:"Guangzhou, Guangdong",
    focus:"Agricultural equipment, machinery, industrial tools",
    detail:"The largest trade fair in the world. 25,000+ exhibitors. Massive agricultural section with live demonstrations. Palm Connect is present — we can represent you or accompany you on-site.", img: IMG.canton1 },
  { badge:"AUTUMN", color:"#e07b3a", name:"Canton Fair – Autumn Session",
    dates:"Oct 15 – Nov 4, 2026", location:"Guangzhou, Guangdong",
    focus:"Tooling, agrochemicals, post-harvest technologies",
    detail:"Ideal session for negotiating next year's prices. Manufacturers make significant commercial efforts at the end of their fiscal year. Perfect for planning ahead for the following cocoa season.", img: IMG.canton2 },
  { badge:"MACHINERY", color:"#4a9f6a", name:"CIAME — China Agri Machinery Exhibition",
    dates:"Late October / Early November", location:"Wuhan, Hubei",
    focus:"Specialized agricultural machinery, irrigation, seeds",
    detail:"The most technical trade show for specialized agricultural equipment. Tractors, harvesters, custom irrigation systems. Ideal for complex or customized orders.", img: IMG.canton3 },
  { badge:"B2B", color:"#3a6ea8", name:"China International Import Expo (CIIE)",
    dates:"November 5–10, 2026", location:"Shanghai",
    focus:"Imports, international B2B partnerships",
    detail:"A strategic event for establishing long-term partnerships. More focused on business development than direct purchasing. Recommended for companies seeking long-term partners.", img: IMG.china },
  { badge:"WHOLESALE", color:"#8a4faf", name:"Yiwu International Trade Fair",
    dates:"October 21–25, 2026", location:"Yiwu, Zhejiang",
    focus:"Small equipment, consumables, wholesale supplies",
    detail:"The mecca of small equipment and wholesale supplies. Ideal for resellers or to complement a main order with accessories at unbeatable prices.", img: IMG.canton1 },
];

const TRAPS = [
  { icon:"👻", title:"Ghost Suppliers",
    full:"Thousands of Chinese websites (Alibaba, DHgate, Made-in-China) list products without a real factory behind them. Without physical verification, you risk losing 30 to 50% of the total amount. We audit every supplier before any commitment." },
  { icon:"💸", title:"Deposit Without Enforceable Contract",
    full:"A wire transfer without a bilingual contract leaves you with no legal recourse. In China, only contracts written in Simplified Mandarin are enforceable. Our contracts are drafted by lawyers specializing in Sino-African trade." },
  { icon:"📦", title:"'Export Grade' Quality vs. Reality",
    full:"Many suppliers ship products inferior to the validated samples once production is paid for. Our pre-shipment inspection (AQL standard) stops this risk at the source." },
  { icon:"🧾", title:"Hidden Import Costs",
    full:"VAT, CEMAC customs duties, transit fees, port demurrage — these costs can reach 25 to 45% of the purchase price. We provide an all-inclusive quote before validation: zero surprises." },
  { icon:"🔌", title:"Technical and Language Barriers",
    full:"220V vs 380V, single-phase vs three-phase, CE vs GB/T standard, metric vs UNC threading — one wrong spec can make equipment unusable upon arrival. Our teams write specifications in technical Mandarin." },
  { icon:"⏳", title:"Non-Contractualized Delays",
    full:"Without late penalties in the contract, 4 announced weeks can become 16 weeks — tying up your capital. We systematically include an enforceable production schedule with penalties." },
];

const PERIODS = [
  { season:"Jan – Mar", label:"Pre-rainy season", stars:5, color:"#4a9f6a",
    tip:"Ideal for ordering irrigation equipment and seeders before April planting. Manufacturing lead times (4–8 weeks) align perfectly with the first Cameroonian rains." },
  { season:"Apr – Jun", label:"Post-Spring Canton", stars:4, color:"#c8a84b",
    tip:"Right after the Canton Fair, factories are at full capacity. A good time to negotiate exhibition stock often sold at reduced prices." },
  { season:"Jul – Sep", label:"Pre-dry season", stars:3, color:"#e07b3a",
    tip:"Order drying and pressing equipment for the cocoa campaign. Watch out for factory closures in August. Longer lead times." },
  { season:"Oct – Dec", label:"Post-Autumn Canton", stars:5, color:"#3a6ea8",
    tip:"Best time of the year. Negotiate prices for the following year. Manufacturers make major commercial efforts at the end of the Chinese fiscal year." },
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
                Agricultural Sourcing — Complete Guide
              </span>
              <h1 className="text-5xl md:text-7xl leading-[1.05] mb-8 italic">
                Buy from<br /><span className="text-pc-gold">China</span>,<br />risk-free.
              </h1>
              <p className="text-white/70 text-base max-w-lg leading-relaxed mb-10" style={{ fontFamily:'sans-serif', fontStyle:'normal' }}>
                Complete guide by our experts in Yaoundé and Canton. Secure 6-step process, 2026 trade fairs, pitfalls to avoid, equipment at factory prices.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/book-appointment">
                  <button className="bg-pc-gold text-pc-green px-10 py-4 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all shadow-2xl" style={{ fontFamily:'sans-serif' }}>
                    Get Started for Free
                  </button>
                </Link>
                <a href="#products">
                  <button className="border border-white/30 text-white px-10 py-4 uppercase text-[11px] font-black tracking-widest hover:border-pc-gold hover:text-pc-gold transition-all" style={{ fontFamily:'sans-serif' }}>
                    View Equipment ↓
                  </button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { target:60, suffix:"%", label:"Savings vs Europe", sub:"on agricultural equipment" },
                { target:500, suffix:"+", label:"Audited Manufacturers", sub:"Guangdong network" },
                { target:8, suffix:" wks", label:"Average Lead Time", sub:"custom manufacturing" },
                { target:100, suffix:"%", label:"Full Traceability", sub:"with our support" },
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

      {/* ══ PRODUCTS ══ */}
      <section id="products" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-3" style={{ fontFamily:'sans-serif' }}>Direct Factory Prices</span>
              <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">Featured Equipment</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xs md:text-right" style={{ fontFamily:'sans-serif' }}>Indicative ex-factory prices from China.<br />Custom quote available on request.</p>
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
                          Request a Quote →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex justify-between items-center border-t border-slate-50">
                  <span className="text-[10px] uppercase tracking-widest text-slate-300" style={{ fontFamily:'sans-serif' }}>Click for details</span>
                  <span className={`text-pc-gold font-black text-xl transition-transform duration-300 ${openProduct === i ? 'rotate-45' : ''}`}>+</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/book-appointment">
              <button className="border-2 border-pc-green text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-pc-green hover:text-white transition-all" style={{ fontFamily:'sans-serif' }}>
                All Available Equipment →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ WHY CHINA ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-3 h-[480px]">
            <div className="row-span-2 overflow-hidden">
              <img src={IMG.canton1} alt="Canton Fair" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden">
              <img src={IMG.china} alt="Guangzhou" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="overflow-hidden">
              <img src={IMG.canton3} alt="Machinery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div>
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Why China?</span>
            <h2 className="text-4xl md:text-5xl text-pc-green mb-6 leading-tight italic">The most competitive source in the world</h2>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed" style={{ fontFamily:'sans-serif' }}>
              China produces 70% of the world's agricultural equipment. For African farmers, accessing Guangdong factories directly is a historic opportunity.
            </p>
            <div className="space-y-5">
              {[
                { stat:"—60%", label:"Savings vs European or Japanese equipment" },
                { stat:"500+", label:"Specialized manufacturers in Guangdong alone" },
                { stat:"4–8 wks", label:"Custom manufacturing lead time (5 units and above)" },
                { stat:"100%", label:"Guaranteed traceability with our support" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 border-b border-slate-100 pb-5 hover:border-pc-gold transition-all">
                  <div className="text-3xl font-black text-pc-gold min-w-[90px]">{item.stat}</div>
                  <p className="text-slate-600 text-sm" style={{ fontFamily:'sans-serif' }}>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-slate-50 border-l-4 border-pc-gold p-8">
              <p className="text-slate-500 text-sm italic leading-relaxed mb-2">
                "China is the only economy capable of producing custom, small-batch orders within a reasonable timeframe. For a Cameroonian farmer, this is a historic window of opportunity."
              </p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-pc-green" style={{ fontFamily:'sans-serif' }}>— PALM CONNECT Team, Yaoundé</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROCESS — ACCORDION ══ */}
      <section id="process" className="py-24 px-8 bg-[#0a192f] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Our Method</span>
            <h2 className="text-4xl md:text-5xl leading-tight italic">
              6 steps to buy<br /><span className="text-pc-gold">with complete confidence</span>
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
                            Learn More →
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
                Start My Import Project
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TRADE FAIRS — ACCORDION ══ */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>2026 Agenda</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">
              The must-attend trade fairs<br />in China for farmers
            </h2>
            <p className="text-slate-400 text-sm mt-4" style={{ fontFamily:'sans-serif' }}>Click on a fair to learn more. Palm Connect can represent you there.</p>
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
                            Get Accompanied to This Fair →
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
              <strong>Palm Connect</strong> attends the Canton Fair (Spring &amp; Autumn 2026).{' '}
              <Link to="/book-appointment" className="font-bold text-pc-green underline hover:text-pc-gold">Contact us to be represented →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ══ PERIODS — SELECTOR ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Strategic Timing</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">When should you order from China?</h2>
            <p className="text-slate-400 text-sm mt-4" style={{ fontFamily:'sans-serif' }}>Select a period to see our recommendations.</p>
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
                    Plan for This Period →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PITFALLS — ACCORDION ══ */}
      <section className="py-24 px-8 bg-[#0a192f] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#e07b3a] text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Risks & Vigilance</span>
            <h2 className="text-4xl md:text-5xl leading-tight italic">
              The 6 classic pitfalls<br /><span className="text-[#e07b3a]">you absolutely must know</span>
            </h2>
            <p className="text-white/40 text-sm mt-4 max-w-lg mx-auto" style={{ fontFamily:'sans-serif' }}>
              These mistakes cost African buyers millions of FCFA every year. Click to read.
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
              <div className="text-pc-gold font-black text-lg mb-3">Palm Connect = your safeguard.</div>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily:'sans-serif' }}>
                Physically present in China. Bilingual enforceable contracts. Quality inspection before shipment. Customs clearance in Cameroon. We see every project through to the end.
              </p>
            </div>
            <Link to="/book-appointment">
              <button className="shrink-0 bg-pc-gold text-pc-green px-12 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all" style={{ fontFamily:'sans-serif' }}>
                Benefit from Our Protection
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ RELIABILITY — IMAGE CARDS ══ */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pc-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4" style={{ fontFamily:'sans-serif' }}>Our Reliability</span>
            <h2 className="text-4xl md:text-5xl text-pc-green leading-tight italic">Why trust<br />Palm Connect?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon:"🏛", img:IMG.canton2, title:"Institutional Presence", desc:"Active member of the Canton Fair. Teams physically present at trade fairs and factory visits. You don't buy blind." },
              { icon:"📄", img:IMG.contract, title:"Bilingual EN/CN Contracts", desc:"Every transaction governed by a contract in both English AND Mandarin, with buyer protection clauses and late delivery penalties." },
              { icon:"🔍", img:IMG.shipping, title:"Pre-Shipment Quality Control", desc:"Certified third-party inspectors (SGS, Bureau Veritas) validate every batch before it leaves China. Zero surprises in Douala." },
              { icon:"🌍", img:IMG.farmer, title:"Local Presence in Cameroon", desc:"Based in Yaoundé, we handle post-delivery follow-up, customs clearance and commissioning at your farm." },
              { icon:"🤝", img:IMG.canton1, title:"Network of Audited Suppliers", desc:"Every supplier visited, audited and tested. ISO, CE certifications verified. No unknown intermediaries." },
              { icon:"💬", img:IMG.china, title:"End-to-End Support", desc:"From the Canton Fair to your farm. No hidden fees. Transparent communication at every step." },
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

      {/* ══ FINAL CTA ══ */}
      <section className="py-32 bg-[#0a192f] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:`url(${IMG.canton2})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-transparent to-[#0a192f]" />
        <div className="max-w-3xl mx-auto px-8 relative z-10">
          <span className="text-pc-gold text-[10px] uppercase tracking-[0.5em] font-black block mb-8" style={{ fontFamily:'sans-serif' }}>Ready to take action?</span>
          <h2 className="text-4xl md:text-6xl leading-tight mb-8 italic">
            "The future belongs<br />to those who equip themselves<br /><span className="text-pc-gold">before the rest."</span>
          </h2>
          <p className="text-white/50 text-sm mb-14 leading-relaxed" style={{ fontFamily:'sans-serif' }}>
            Free first consultation, no commitment required. Our experts respond within 24 hours.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/book-appointment">
              <button className="bg-pc-gold text-pc-green px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:bg-white transition-all shadow-2xl" style={{ fontFamily:'sans-serif' }}>
                Book an Appointment — Free
              </button>
            </Link>
            <Link to="/book-appointment">
              <button className="border border-white/30 text-white px-14 py-5 uppercase text-[11px] font-black tracking-widest hover:border-pc-gold hover:text-pc-gold transition-all" style={{ fontFamily:'sans-serif' }}>
                Ask a Question →
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