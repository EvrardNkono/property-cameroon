import React from 'react';

const MarketplaceHero = () => {
  return (
    <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-pc-green/5 skew-x-12 transform translate-x-20"></div>
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 animate-fade-in">
              <span className="w-8 h-[1px] bg-pc-gold"></span>
              <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.4em]">Direct Terroir Access</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight tracking-tighter">
              The <span className="text-pc-gold italic font-light">Gold</span> Standard <br />
              of Cameroonian <span className="text-pc-green italic font-light">Harvest</span>.
            </h1>
            
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md">
              From the volcanic soils of Foumbot to the shores of Kribi. 
              Buy premium agricultural products, tracked and delivered 
              with institutional rigor.
            </p>

            <div className="flex gap-6 pt-4">
              <button className="bg-pc-green text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all duration-500 shadow-xl">
                Shop the Harvest
              </button>
              <div className="flex flex-col justify-center">
                <span className="text-pc-gold font-bold text-xl">24h</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">Max Delivery Time</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Featured Product */}
          <div className="relative">
            <div className="aspect-square relative z-10 border border-pc-gold/20 p-4">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000" 
                alt="Premium Harvest" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-2xl border-t-4 border-pc-gold max-w-[200px]">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Today's Pick</p>
                <p className="text-sm font-bold text-slate-900 uppercase">Organic Penja Pepper</p>
                <p className="text-pc-green font-serif text-xs mt-1 italic">Certified AOP</p>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-pc-green/20 rounded-full animate-pulse"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MarketplaceHero;