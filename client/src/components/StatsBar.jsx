const StatsBar = () => {
  return (
    <section className="relative bg-pc-green py-20 overflow-hidden">
      {/* Texture de fond subtile (Lignes de prestige) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-0">
          
          {/* STAT 1 : IMMOBILIER (OR) */}
          <div className="flex flex-col items-center group lg:border-r lg:border-white/10 px-4">
            <div className="mb-4">
               <span className="text-5xl md:text-6xl font-serif text-pc-gold block mb-2 transition-transform duration-500 group-hover:-translate-y-2">
                 100%
               </span>
               <div className="h-[2px] w-8 bg-pc-gold/40 mx-auto group-hover:w-16 transition-all duration-500"></div>
            </div>
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/70 font-medium text-center">
              Titres Fonciers <span className="text-pc-gold font-bold">Sécurisés</span>
            </p>
          </div>

          {/* STAT 2 : AGRICULTURE (BLANC/VERRT) */}
          <div className="flex flex-col items-center group lg:border-r lg:border-white/10 px-4">
            <div className="mb-4">
               <span className="text-5xl md:text-6xl font-serif text-white block mb-2 transition-transform duration-500 group-hover:-translate-y-2">
                 +500
               </span>
               <div className="h-[2px] w-8 bg-white/20 mx-auto group-hover:w-16 transition-all duration-500"></div>
            </div>
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/70 font-medium text-center">
              Hectares en <span className="italic">Exploitation</span>
            </p>
          </div>

          {/* STAT 3 : TECH/DASHBOARD (ACCENT OR) */}
          <div className="flex flex-col items-center group px-4">
            <div className="mb-4">
               <span className="text-5xl md:text-6xl font-serif text-pc-gold block mb-2 transition-transform duration-500 group-hover:-translate-y-2">
                 24/7
               </span>
               <div className="h-[2px] w-8 bg-pc-gold/40 mx-auto group-hover:w-16 transition-all duration-500"></div>
            </div>
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/70 font-medium text-center">
              Suivi <span className="text-white">Dashboard</span> Live
            </p>
          </div>

        </div>
      </div>

      {/* Ligne de finition dorée en bas pour le rappel charte */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pc-gold/40 to-transparent"></div>
    </section>
  );
};

export default StatsBar;