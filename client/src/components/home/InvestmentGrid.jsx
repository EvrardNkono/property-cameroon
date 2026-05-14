import React from 'react';

const INVESTMENTS = [
  {
    id: 1,
    title: "Industrial Palm Oil Plantation",
    location: "Littoral Region",
    yield: "+22%",
    term: "Short-Cycle",
    image: "/images/palm-plantation.jpg",
  },
  {
    id: 2,
    title: "Premium Pineapple (Export Grade)",
    location: "Central Region",
    yield: "+18%",
    term: "18 Months",
    image: "/images/propertyananas.jfif",
  },
  {
    id: 3,
    title: "Cocoa Farm Rehabilitation",
    location: "South-West Region",
    yield: "+15%",
    term: "Long-Term",
    image: "/images/propertycacao.jfif",
  }
];

const InvestmentGrid = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto bg-white font-sans">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16">
        <div className="max-w-xl">
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-pc-gold mb-3 md:mb-4 block">
            Growth Opportunities
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
            High-Yield <br /> <span className="text-pc-green italic">Agricultural</span> Investments
          </h2>
        </div>
        <p className="text-slate-500 text-xs md:text-sm max-w-xs mt-6 md:mt-0 italic border-l-2 border-pc-gold pl-4">
          Rigorous selection of high-potential projects managed by our on-field experts.
        </p>
      </div>

      {/* Bento Grid - Correction de la hauteur ici */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Main Card (Large) - Hauteur fixe sur mobile pour forcer la visibilité */}
        <div className="md:col-span-2 relative group overflow-hidden bg-slate-200 min-h-[400px] md:h-[600px]">
          <img 
            src={INVESTMENTS[0].image} 
            alt={INVESTMENTS[0].title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="bg-pc-gold text-white text-[8px] md:text-[10px] font-black px-3 py-1 uppercase tracking-widest mb-3 md:mb-4 inline-block">
                {INVESTMENTS[0].term}
              </span>
              <h3 className="text-2xl md:text-4xl font-serif text-white leading-tight">{INVESTMENTS[0].title}</h3>
              <p className="text-white/70 text-xs mt-1 md:mt-2">{INVESTMENTS[0].location}, Cameroon</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-widest">Estimated ROI</p>
              <p className="text-3xl md:text-4xl font-light text-pc-gold">{INVESTMENTS[0].yield}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Stacked cards */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {INVESTMENTS.slice(1).map((inv) => (
            <div key={inv.id} className="relative group overflow-hidden bg-slate-200 min-h-[300px] md:h-full">
              <img 
                src={inv.image} 
                alt={inv.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-500 group-hover:opacity-80"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-serif text-white mb-1 leading-tight">{inv.title}</h3>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                  <span className="text-pc-gold font-bold text-lg">{inv.yield}</span>
                  <button className="text-[9px] text-white uppercase tracking-widest font-bold border-b border-pc-gold/50 pb-1">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentGrid;