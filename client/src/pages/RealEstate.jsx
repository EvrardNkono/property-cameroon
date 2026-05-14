// RealEstatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../data/properties';

// ========== UTILITY FUNCTIONS ==========
const getPriceFormatted = (property) => {
  const price = property.priceValue;
  const unit = property.priceUnit || (property.status === 'lease' ? 'FCFA/month' : 'FCFA');
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M ${unit}`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K ${unit}`;
  return `${price.toLocaleString()} ${unit}`;
};

const getStatus = (property) => property.status || 'sale';

// Extraire la ville depuis la localisation
const extractCity = (location) => {
  if (!location) return 'Unknown';
  if (location.includes('Yaoundé')) return 'Yaoundé';
  if (location.includes('Douala')) return 'Douala';
  if (location.includes('Kribi')) return 'Kribi';
  if (location.includes('Soa')) return 'Soa';
  if (location.includes('Obala')) return 'Obala';
  if (location.includes('Mfou')) return 'Mfou';
  return 'Other';
};

// Extraire le quartier (le premier élément après la ville)
const extractNeighborhood = (location) => {
  if (!location) return 'Unknown';
  const neighborhoods = ['Bastos', 'Golf', 'Odza', 'Nsimalen', 'Magzi', 'Soa', 'Obala', 'Kribi', 'Mfou', 'Tongolo', 'Ekoudoum', 'Biteng', 'Omnisport', 'Essos', 'Nkolfoulou', 'Fougerolles', 'Akwa', 'Tradex', 'Tsinga'];
  for (const hood of neighborhoods) {
    if (location.includes(hood)) return hood;
  }
  return 'Other';
};

// Obtenir toutes les villes uniques
const getUniqueCities = () => {
  const cities = new Set();
  MOCK_PROPERTIES.forEach(p => {
    const city = extractCity(p.location);
    cities.add(city);
  });
  return Array.from(cities).sort();
};

// Obtenir les quartiers d'une ville spécifique
const getNeighborhoodsByCity = (city) => {
  const neighborhoods = new Set();
  MOCK_PROPERTIES.forEach(p => {
    if (extractCity(p.location) === city) {
      const hood = extractNeighborhood(p.location);
      if (hood !== 'Other') neighborhoods.add(hood);
    }
  });
  return Array.from(neighborhoods).sort();
};

// ========== PROPERTY CARD COMPONENT ==========
const PropertyCard = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/real-estate/${property.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {property.featured && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full z-10">
            ⭐ Featured
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-slate-700">
          {property.type === 'apartment' ? 'Apartment' : 
           property.type === 'house' ? 'House' : 
           property.type === 'land' ? 'Land' : 'Property'}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-800 text-lg line-clamp-1">{property.title}</h3>
          <div className="text-right">
            <div className="text-lg font-bold text-amber-600">{getPriceFormatted(property)}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {getStatus(property) === 'sale' ? 'For Sale' : 'Per Month'}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">
          {property.location}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          {property.beds > 0 && (
            <span className="flex items-center gap-1">🛏️ {property.beds}</span>
          )}
          {property.baths > 0 && (
            <span className="flex items-center gap-1">🚿 {property.baths}</span>
          )}
          {property.surface && property.surface !== 'Non spécifié' && (
            <span className="flex items-center gap-1">📐 {property.surface}</span>
          )}
        </div>
        
        <button 
          onClick={handleViewDetails}
          className="w-full py-2.5 border border-amber-500 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-500 hover:text-white transition-all duration-300"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

// ========== FILTER BAR COMPONENT ==========
const FilterBar = ({ filters, onFilterChange, onReset, cities, neighborhoods }) => {
  const [priceRange, setPriceRange] = useState([0, 1000000000]);

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
    onFilterChange({ priceMax: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search by City */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value, neighborhood: '' })}
            className="w-full p-3 bg-slate-50 border-none text-sm focus:ring-1 focus:ring-amber-500 outline-none rounded-lg"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Search by Neighborhood (dépendant de la ville) */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Neighborhood
          </label>
          <select
            value={filters.neighborhood}
            onChange={(e) => onFilterChange({ neighborhood: e.target.value })}
            className="w-full p-3 bg-slate-50 border-none text-sm focus:ring-1 focus:ring-amber-500 outline-none rounded-lg"
            disabled={filters.city === 'all' || neighborhoods.length === 0}
          >
            <option value="all">All Neighborhoods</option>
            {neighborhoods.map(hood => (
              <option key={hood} value={hood}>{hood}</option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange({ propertyType: e.target.value })}
            className="w-full p-3 bg-slate-50 border-none text-sm focus:ring-1 focus:ring-amber-500 outline-none rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House/Villa</option>
            <option value="land">Land</option>
            <option value="office">Office/Warehouse</option>
            <option value="building">Building</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Bedrooms
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
            className="w-full p-3 bg-slate-50 border-none text-sm focus:ring-1 focus:ring-amber-500 outline-none rounded-lg"
          >
            <option value="all">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Max Price (FCFA)
          </label>
          <select
            value={filters.priceMax}
            onChange={(e) => onFilterChange({ priceMax: parseInt(e.target.value) })}
            className="w-full p-3 bg-slate-50 border-none text-sm focus:ring-1 focus:ring-amber-500 outline-none rounded-lg"
          >
            <option value="50000000">50M</option>
            <option value="100000000">100M</option>
            <option value="250000000">250M</option>
            <option value="500000000">500M</option>
            <option value="1000000000">1B+</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      {(filters.city !== 'all' || filters.neighborhood !== 'all' || filters.propertyType !== 'all' || filters.bedrooms !== 'all' || filters.priceMax !== 1000000000) && (
        <div className="mt-4 text-right">
          <button
            onClick={onReset}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
            Clear all filters ✕
          </button>
        </div>
      )}
    </div>
  );
};

// ========== MAIN LISTING COMPONENT ==========
const RealEstatePage = () => {
  const [activeMode, setActiveMode] = useState('all');
  const [filters, setFilters] = useState({
    city: 'all',
    neighborhood: 'all',
    propertyType: 'all',
    bedrooms: 'all',
    priceMax: 1000000000
  });
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cities = getUniqueCities();
  const neighborhoods = filters.city !== 'all' ? getNeighborhoodsByCity(filters.city) : [];

  const propertiesForSale = MOCK_PROPERTIES.filter(p => getStatus(p) === 'sale').length;
  const propertiesForLease = MOCK_PROPERTIES.filter(p => getStatus(p) === 'lease').length;

  useEffect(() => {
    setIsLoading(true);
    let results = [...MOCK_PROPERTIES];
    
    // 1. Filter by status (sale/lease)
    if (activeMode !== 'all') {
      results = results.filter(property => getStatus(property) === activeMode);
    }
    
    // 2. Filter by city
    if (filters.city !== 'all') {
      results = results.filter(property => extractCity(property.location) === filters.city);
    }
    
    // 3. Filter by neighborhood
    if (filters.neighborhood !== 'all' && filters.neighborhood !== '') {
      results = results.filter(property => extractNeighborhood(property.location) === filters.neighborhood);
    }
    
    // 4. Filter by property type
    if (filters.propertyType !== 'all') {
      results = results.filter(property => property.type === filters.propertyType);
    }
    
    // 5. Filter by bedrooms
    if (filters.bedrooms !== 'all') {
      const minBeds = parseInt(filters.bedrooms);
      results = results.filter(property => (property.beds || 0) >= minBeds);
    }
    
    // 6. Filter by max price
    results = results.filter(property => (property.priceValue || 0) <= filters.priceMax);
    
    setTimeout(() => {
      setFilteredProperties(results);
      setIsLoading(false);
    }, 300);
  }, [activeMode, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      city: 'all',
      neighborhood: 'all',
      propertyType: 'all',
      bedrooms: 'all',
      priceMax: 1000000000
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your <span className="text-amber-400">Real Estate</span> Portfolio
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Discover exceptional properties in Cameroon
          </p>
          
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-amber-400 text-2xl font-bold">{MOCK_PROPERTIES.length}</div>
              <div className="text-slate-400 text-xs">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 text-2xl font-bold">{propertiesForSale}</div>
              <div className="text-slate-400 text-xs">For Sale</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 text-2xl font-bold">{propertiesForLease}</div>
              <div className="text-slate-400 text-xs">For Lease</div>
            </div>
          </div>
          
          <div className="inline-flex bg-white/10 rounded-lg p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'sale', label: 'For Sale' },
              { id: 'lease', label: 'For Lease' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeMode === mode.id 
                    ? 'bg-amber-500 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* FILTER BAR */}
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          cities={cities}
          neighborhoods={neighborhoods}
        />

        {/* RESULTS HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-slate-800">
            {filteredProperties.length} property{filteredProperties.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        {/* RESULTS GRID */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-500">No properties match your criteria</p>
            <button 
              onClick={resetFilters}
              className="mt-4 text-amber-600 hover:underline text-sm"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RealEstatePage;