import React from 'react';

const FilterBar = ({ onSearch }) => {
  return (
    <div className="max-w-6xl mx-auto bg-white p-2 rounded-sm shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-2 -mt-10 relative z-20 border border-slate-100">
      
      {/* Category Selector */}
      <div className="flex flex-col p-2">
        <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 ml-2 font-bold">Category</label>
        <select className="bg-transparent text-slate-900 text-xs font-bold p-2 outline-none cursor-pointer appearance-none">
          <option value="">All Categories</option>
          <optgroup label="Residential">
            <option value="house">Houses & Villas</option>
            <option value="apartment">Apartments</option>
            <option value="studio">Studios & Rooms</option>
          </optgroup>
          <optgroup label="Commercial">
            <option value="office">Office Spaces</option>
            <option value="shop">Retail & Business</option>
          </optgroup>
          <optgroup label="Land & Farms">
            <option value="plot">Building Plots</option>
            <option value="field">Agricultural Fields</option>
            <option value="farm">Plantations</option>
          </optgroup>
        </select>
      </div>

      {/* Location Selector */}
      <div className="flex flex-col p-2 border-l border-slate-50">
        <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 ml-2 font-bold">Location</label>
        <select className="bg-transparent text-slate-900 text-xs font-bold p-2 outline-none cursor-pointer appearance-none">
          <option value="">All Regions</option>
          <option value="yaounde">Yaoundé (Bastos, Golf...)</option>
          <option value="douala">Douala (Bonapriso, Akwa...)</option>
          <option value="kribi">Kribi (Coastal)</option>
        </select>
      </div>

      {/* Budget Input */}
      <div className="flex flex-col p-2 border-l border-slate-50">
        <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 ml-2 font-bold">Max Budget (XAF)</label>
        <input 
          type="text" 
          placeholder="e.g. 50,000,000"
          className="bg-transparent text-slate-900 text-xs font-bold p-2 outline-none placeholder:text-slate-300"
        />
      </div>

      {/* Action Button */}
      <button className="bg-pc-green text-white text-[10px] uppercase tracking-[0.3em] font-black hover:bg-slate-900 transition-all duration-500 rounded-sm py-4 md:py-0">
        Search Property
      </button>
    </div>
  );
};

export default FilterBar;