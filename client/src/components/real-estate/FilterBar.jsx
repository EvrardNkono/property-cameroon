import React, { useState, useEffect } from 'react';

const FilterBar = ({ onFilterChange, initialFilters = {} }) => {
  // États locaux pour les filtres
  const [category, setCategory] = useState(initialFilters.category || '');
  const [location, setLocation] = useState(initialFilters.location || '');
  const [maxBudget, setMaxBudget] = useState(initialFilters.maxBudget || '');
  const [listingType, setListingType] = useState(initialFilters.listingType || 'all');

  // Déclencher le changement de filtre quand les valeurs changent
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        category,
        location,
        maxBudget,
        listingType
      });
    }
  }, [category, location, maxBudget, listingType, onFilterChange]);

  // Réinitialiser les filtres
  const handleReset = () => {
    setCategory('');
    setLocation('');
    setMaxBudget('');
    setListingType('all');
  };

  // Appliquer les filtres immédiatement
  const handleSearch = () => {
    if (onFilterChange) {
      onFilterChange({
        category,
        location,
        maxBudget,
        listingType
      });
    }
  };

  // Gérer la touche Enter dans le champ budget
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-4 rounded-xl shadow-2xl -mt-10 relative z-20 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Listing Type - Vente/Location */}
        <div className="flex flex-col">
          <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 ml-2 font-bold">
            Transaction Type
          </label>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setListingType('all')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                listingType === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setListingType('sale')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                listingType === 'sale'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setListingType('rent')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                listingType === 'rent'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              For Rent
            </button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-col">
          <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 ml-2 font-bold">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-100 text-slate-900 text-xs font-medium p-3 rounded-lg outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="">All Categories</option>
            
            <optgroup label="🏠 Residential">
              <option value="House">Houses</option>
              <option value="Villa">Villas</option>
              <option value="Duplex">Duplex</option>
              <option value="Apartment">Apartments</option>
              <option value="Studio">Studios</option>
              <option value="Room">Rooms</option>
            </optgroup>
            
            <optgroup label="🏢 Commercial">
              <option value="Commercial Space">Commercial Spaces</option>
              <option value="Office">Offices</option>
              <option value="Shop">Shops</option>
              <option value="Warehouse">Warehouses</option>
              <option value="Industrial Space">Industrial Spaces</option>
            </optgroup>
            
            <optgroup label="🌾 Land & Agriculture">
              <option value="Land">Building Plots</option>
              <option value="Agricultural Land">Agricultural Lands</option>
            </optgroup>
            
            <optgroup label="🅿️ Other">
              <option value="Parking">Parking Spaces</option>
            </optgroup>
          </select>
        </div>

        {/* Location Selector - 10 Regions */}
        <div className="flex flex-col">
          <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 ml-2 font-bold">
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-slate-100 text-slate-900 text-xs font-medium p-3 rounded-lg outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="">All Regions</option>
            
            <optgroup label="📍 Major Hubs">
              <option value="Center">Center (Yaoundé)</option>
              <option value="Littoral">Littoral (Douala)</option>
              <option value="West">West (Bafoussam)</option>
            </optgroup>

            <optgroup label="📍 All Regions">
              <option value="Adamawa">Adamawa</option>
              <option value="Center">Center</option>
              <option value="East">East</option>
              <option value="Far-North">Far North</option>
              <option value="Littoral">Littoral</option>
              <option value="North">North</option>
              <option value="North-West">North West</option>
              <option value="South">South</option>
              <option value="South-West">South West</option>
              <option value="West">West</option>
            </optgroup>
          </select>
        </div>

        {/* Budget Input */}
        <div className="flex flex-col">
          <label className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 ml-2 font-bold">
            Max Budget (XAF)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. 50,000,000"
              className="flex-1 bg-slate-100 text-slate-900 text-xs font-medium p-3 rounded-lg outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSearch}
          className="flex-1 bg-emerald-600 text-white text-[10px] uppercase tracking-[0.2em] font-black hover:bg-emerald-700 transition-all duration-300 rounded-lg py-4"
        >
          🔍 Search Properties
        </button>
        
        {(category || location || maxBudget || listingType !== 'all') && (
          <button
            onClick={handleReset}
            className="px-6 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-gray-200 transition-all duration-300 rounded-lg"
          >
            Reset
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(category || location || maxBudget || listingType !== 'all') && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
          <span className="text-[8px] text-slate-400 uppercase tracking-wider font-bold">Active Filters:</span>
          
          {listingType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[9px] rounded-full">
              {listingType === 'sale' ? '🏷️ For Sale' : '🔑 For Rent'}
              <button onClick={() => setListingType('all')} className="ml-1 hover:text-blue-900">×</button>
            </span>
          )}
          
          {category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[9px] rounded-full">
              🏠 {category}
              <button onClick={() => setCategory('')} className="ml-1 hover:text-emerald-900">×</button>
            </span>
          )}
          
          {location && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-[9px] rounded-full">
              📍 {location}
              <button onClick={() => setLocation('')} className="ml-1 hover:text-indigo-900">×</button>
            </span>
          )}
          
          {maxBudget && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-[9px] rounded-full">
              💰 Up to {parseInt(maxBudget).toLocaleString()} FCFA
              <button onClick={() => setMaxBudget('')} className="ml-1 hover:text-amber-900">×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;