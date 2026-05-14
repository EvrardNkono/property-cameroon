import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, DollarSign, MoveRight, HelpCircle } from 'lucide-react';

const CROP_DATA = {
  cocoa: {
    name: "Premium Cocoa",
    yieldPerHa: 800, // kg/ha
    pricePerKg: 1500, // FCFA
    setupCost: 800000, // Cost per ha
    maturity: "3-4 Years"
  },
  oil_palm: {
    name: "Oil Palm (Elite)",
    yieldPerHa: 12000, // kg/ha (bunches)
    pricePerKg: 85, // FCFA
    setupCost: 1200000, 
    maturity: "3 Years"
  },
  black_pepper: {
    name: "Penja Black Pepper",
    yieldPerHa: 1500, // kg/ha
    pricePerKg: 5000, // FCFA
    setupCost: 2500000,
    maturity: "4-5 Years"
  }
};

const YieldSimulator = () => {
  const [crop, setCrop] = useState('cocoa');
  const [surface, setSurface] = useState(10);
  const [results, setResults] = useState({ revenue: 0, cost: 0, net: 0 });

  useEffect(() => {
    const selected = CROP_DATA[crop];
    const annualRevenue = selected.yieldPerHa * selected.pricePerKg * surface;
    const initialInvestment = selected.setupCost * surface;
    
    setResults({
      revenue: annualRevenue,
      cost: initialInvestment,
      net: annualRevenue * 0.7 // Est. 30% margin for OPEX
    });
  }, [crop, surface]);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* CONTROL PANEL */}
          <div className="lg:w-1/3 bg-white p-10 border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-serif text-slate-900 uppercase tracking-tighter mb-8">
              ROI <span className="text-pc-green italic font-light">Simulator</span>
            </h3>

            <div className="space-y-8">
              {/* Crop Selection */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">
                  Select Crop Category
                </label>
                <select 
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-pc-gold transition-colors"
                >
                  <option value="cocoa">Premium Cocoa</option>
                  <option value="oil_palm">Oil Palm (Elite)</option>
                  <option value="black_pepper">Penja Black Pepper</option>
                </select>
              </div>

              {/* Surface Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Surface Area (Ha)
                  </label>
                  <span className="text-xl font-serif font-black text-pc-green">{surface} Ha</span>
                </div>
                <input 
                  type="range" min="1" max="100" value={surface}
                  onChange={(e) => setSurface(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-100 appearance-none cursor-pointer accent-pc-green"
                />
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-900 text-white relative overflow-hidden">
              <HelpCircle className="absolute -right-2 -bottom-2 text-white/5" size={80} />
              <p className="text-[11px] font-light leading-relaxed relative z-10">
                Data based on 2025/2026 market averages. For a customized industrial business plan, please contact our financial desk.
              </p>
            </div>
          </div>

          {/* RESULTS DASHBOARD */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Projected Annual Revenue */}
            <div className="bg-white p-10 border border-slate-100 flex flex-col justify-between shadow-sm">
              <div>
                <TrendingUp className="text-pc-gold mb-6" size={32} />
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Est. Annual Revenue</h4>
                <p className="text-4xl font-serif font-black text-slate-900 uppercase leading-none">
                  {results.revenue.toLocaleString()} <span className="text-xs">FCFA</span>
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-50">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Gross output based on current market price</span>
              </div>
            </div>

            {/* Estimated Net Margin */}
            <div className="bg-white p-10 border border-slate-100 flex flex-col justify-between shadow-sm">
              <div>
                <Leaf className="text-pc-green mb-6" size={32} />
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Projected Net Margin</h4>
                <p className="text-4xl font-serif font-black text-pc-green uppercase leading-none">
                  {Math.round(results.net).toLocaleString()} <span className="text-xs">FCFA</span>
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-50">
                <span className="text-[9px] text-slate-400 uppercase font-bold">After 30% estimated operational expenses</span>
              </div>
            </div>

            {/* Initial Setup Investment */}
            <div className="bg-slate-900 p-10 md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border border-pc-gold/30 flex items-center justify-center">
                  <DollarSign className="text-pc-gold" size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-pc-gold tracking-[0.2em] mb-1">Initial Capital Expenditure (CAPEX)</h4>
                  <p className="text-3xl font-serif text-white">
                    {results.cost.toLocaleString()} <span className="text-xs opacity-50">FCFA</span>
                  </p>
                </div>
              </div>
              
              <button className="group flex items-center gap-4 bg-pc-green hover:bg-white text-white hover:text-slate-900 px-8 py-4 transition-all duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest">Get Full Business Plan</span>
                <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            {/* Quick Specs */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="p-4 bg-white border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Maturity Period</p>
                <p className="text-sm font-bold text-slate-900">{CROP_DATA[crop].maturity}</p>
              </div>
              <div className="p-4 bg-white border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Yield Target</p>
                <p className="text-sm font-bold text-slate-900">{CROP_DATA[crop].yieldPerHa} kg/Ha</p>
              </div>
              <div className="p-4 bg-white border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Price Index</p>
                <p className="text-sm font-bold text-slate-900">{CROP_DATA[crop].pricePerKg} FCFA/kg</p>
              </div>
              <div className="p-4 bg-white border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Compliance</p>
                <p className="text-sm font-bold text-pc-green">CAPEF Certified</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default YieldSimulator;