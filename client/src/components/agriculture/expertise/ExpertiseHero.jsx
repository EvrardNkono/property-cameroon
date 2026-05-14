import React from 'react';
import { ShieldCheck, BarChart3, Microscope, ChevronRight } from 'lucide-react';

const ExpertiseHero = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="text-pc-gold" size={24} />,
      title: "Legal Engineering",
      desc: "Securing land titles and navigating CEMAC investment codes."
    },
    {
      icon: <Microscope className="text-pc-gold" size={24} />,
      title: "Agro-Analysis",
      desc: "Soil testing and climate matching for maximum yield potential."
    },
    {
      icon: <BarChart3 className="text-pc-gold" size={24} />,
      title: "Financial Modeling",
      desc: "Projecting ROI, CAPEX, and OPEX for long-term plantations."
    }
  ];

  return (
    <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
      {/* Texture de fond discrète */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* CONTENT SIDE */}
          <div className="lg:w-1/2">
            <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
              Strategic Consulting
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-8 uppercase tracking-tighter">
              Where Data Meets <br />
              <span className="italic font-light text-pc-green">The Soil.</span>
            </h1>
            <p className="text-slate-400 font-light text-lg leading-relaxed mb-10 max-w-xl">
              We bridge the gap between raw land and industrial performance. Our multidisciplinary team ensures every hectare is a calculated asset.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-5 bg-pc-green text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3">
                Download Brochure <ChevronRight size={14} />
              </button>
              <button className="px-8 py-5 border border-slate-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Book a Technical Audit
              </button>
            </div>
          </div>

          {/* PILLARS GRID */}
          <div className="lg:w-1/2 grid grid-cols-1 gap-4">
            {pillars.map((pillar, idx) => (
              <div 
                key={idx} 
                className="group p-8 bg-slate-800/50 border border-slate-700 hover:border-pc-gold transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-slate-900 rounded-sm group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold uppercase tracking-tight mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExpertiseHero;