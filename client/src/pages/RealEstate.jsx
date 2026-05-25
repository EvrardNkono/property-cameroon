// frontend/src/pages/RealEstate.jsx - VERSION AVEC MOCK DATA UNIQUEMENT

import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import api from '../services/api'; // ❌ COMMENTÉ - Backend temporairement désactivé
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { 
  Search, X, Home, Building2, 
  MapPin, Filter, AlertCircle,
  Hotel, BedDouble, DoorOpen, Trees, Store, 
  Briefcase, Warehouse, ShoppingBasket, Factory, 
  ParkingCircle, Heart, Star, Sofa, Armchair,
  Tag, Euro, Layers, Check, ChevronDown, SlidersHorizontal
} from 'lucide-react';

const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('blob:')) return null;
  if (!isDevelopment && image.includes('localhost')) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  return null;
};

const RealEstate = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    category: 'all',
    listingType: 'all',
    minPrice: '',
    maxPrice: '',
    region: 'all',
    bedrooms: 'all',
    furnished: 'all'
  });

  // Régions du Cameroun
  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'Center', label: 'Center (Yaoundé)' },
    { id: 'Littoral', label: 'Littoral (Douala)' },
    { id: 'West', label: 'West (Bafoussam)' },
    { id: 'North-West', label: 'North-West (Bamenda)' },
    { id: 'South', label: 'South' },
    { id: 'Adamawa', label: 'Adamawa' },
    { id: 'North', label: 'North' },
    { id: 'Far-North', label: 'Far-North' },
    { id: 'East', label: 'East' }
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties, searchTerm]);

  // ✅ UTILISATION UNIQUEMENT DES MOCK DATA
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // 🔥 BACKEND COMMENTÉ - Utilisation des mock data uniquement
      // const response = await api.getProperties({ status: 'PUBLISHED' });
      
      // Formater les mock data pour correspondre au format attendu
      const formattedMockProperties = MOCK_PROPERTIES.map(prop => ({
        _id: prop.id,
        title: prop.title,
        category: prop.category,
        listingType: prop.listingType,
        description: prop.description,
        location: {
          city: prop.location.city,
          district: prop.location.district,
          region: prop.location.region
        },
        surface: {
          value: prop.surface.value,
          unit: prop.surface.unit
        },
        price: {
          amount: prop.price.amount,
          currency: prop.price.currency
        },
        status: prop.status,
        images: prop.images,
        features: {
          bedrooms: prop.features?.bedrooms || 0,
          bathrooms: prop.features?.bathrooms || 0,
          isFurnished: prop.features?.isFurnished || false,
          hasParking: prop.features?.hasParking || false,
          hasGarden: prop.features?.hasGarden || false,
          hasElectricity: prop.features?.hasElectricity || false,
          hasWater: prop.features?.hasWater || false,
          hasRoad: prop.features?.hasRoad || false,
          isFenced: prop.features?.isFenced || false
        },
        amenities: prop.amenities || {
          schools: { count: 0, names: [] },
          markets: { count: 0, names: [] },
          stations: { count: 0, names: [] },
          bakeries: { count: 0, names: [] }
        }
      }));
      
      setProperties(formattedMockProperties);
      console.log(`📦 ${formattedMockProperties.length} mock properties loaded`);
      
    } catch (err) {
      console.error('Error loading mock properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.listingType !== 'all') {
      filtered = filtered.filter(p => p.listingType === filters.listingType);
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price?.amount >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price?.amount <= parseInt(filters.maxPrice));
    }
    
    if (filters.region !== 'all') {
      filtered = filtered.filter(p => p.location?.region === filters.region);
    }
    
    if (filters.bedrooms !== 'all') {
      if (filters.bedrooms === '5+') {
        filtered = filtered.filter(p => p.features?.bedrooms >= 5);
      } else {
        filtered = filtered.filter(p => p.features?.bedrooms === parseInt(filters.bedrooms));
      }
    }
    
    if (filters.furnished !== 'all') {
      filtered = filtered.filter(p => {
        const isFurnished = p.features?.isFurnished === true;
        return filters.furnished === 'furnished' ? isFurnished : !isFurnished;
      });
    }
    
    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      listingType: 'all',
      minPrice: '',
      maxPrice: '',
      region: 'all',
      bedrooms: 'all',
      furnished: 'all'
    });
    setSearchTerm('');
  };

  const categories = [
    { id: 'all', label: 'All', icon: <Home size={14} /> },
    { id: 'House', label: 'House', icon: <Home size={14} /> },
    { id: 'Villa', label: 'Villa', icon: <Hotel size={14} /> },
    { id: 'Duplex', label: 'Duplex', icon: <Building2 size={14} /> },
    { id: 'Apartment', label: 'Apartment', icon: <Building2 size={14} /> },
    { id: 'Studio', label: 'Studio', icon: <DoorOpen size={14} /> },
    { id: 'Room', label: 'Room', icon: <BedDouble size={14} /> },
    { id: 'Land', label: 'Land', icon: <MapPin size={14} /> },
    { id: 'Agricultural Land', label: 'Agri Land', icon: <Trees size={14} /> },
    { id: 'Commercial Space', label: 'Commercial', icon: <Store size={14} /> },
    { id: 'Office', label: 'Office', icon: <Briefcase size={14} /> },
    { id: 'Warehouse', label: 'Warehouse', icon: <Warehouse size={14} /> },
    { id: 'Shop', label: 'Shop', icon: <ShoppingBasket size={14} /> },
    { id: 'Industrial Space', label: 'Industrial', icon: <Factory size={14} /> },
    { id: 'Parking', label: 'Parking', icon: <ParkingCircle size={14} /> }
  ];

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-800 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Find Your Dream Property</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Discover exceptional homes, lands, and commercial spaces across Cameroon
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-2">
              <div className="text-2xl font-bold">{filteredProperties.length}</div>
              <div className="text-[10px] uppercase tracking-wider">Properties</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FILTER BAR - HORIZONTAL MODERN ========== */}
      <div className="sticky top-0 z-30 bg-white shadow-lg -mt-8 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          
          {/* Search Row */}
          <div className="relative mb-5">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, city or region..."
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 text-base"
            />
          </div>

          {/* Main Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Listing Type */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'sale', label: 'For Sale' },
                { id: 'rent', label: 'For Rent' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setFilters({...filters, listingType: option.id})}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filters.listingType === option.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Category Select */}
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="appearance-none px-4 py-2 pr-8 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* Region Select */}
            <div className="relative">
              <select
                value={filters.region}
                onChange={(e) => setFilters({...filters, region: e.target.value})}
                className="appearance-none px-4 py-2 pr-8 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.label}</option>
                ))}
              </select>
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-1">
              <Euro size={14} className="text-gray-500" />
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="w-20 py-2 bg-transparent outline-none text-sm placeholder:text-gray-400"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="w-20 py-2 bg-transparent outline-none text-sm placeholder:text-gray-400"
              />
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showAdvancedFilters || activeFiltersCount > 2
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal size={14} />
              More Filters
              {activeFiltersCount > 2 && (
                <span className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] rounded-full">
                  {activeFiltersCount - 2}
                </span>
              )}
              <ChevronDown size={14} className={`transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Reset Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={14} />
                Reset
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {/* Bedrooms */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                    <BedDouble size={12} /> Bedrooms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', '1', '2', '3', '4', '5+'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFilters({...filters, bedrooms: opt})}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          filters.bedrooms === opt
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {opt === 'all' ? 'Any' : opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Furnished Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                    <Sofa size={12} /> Furnished Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilters({...filters, furnished: 'all'})}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.furnished === 'all'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilters({...filters, furnished: 'furnished'})}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        filters.furnished === 'furnished'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Armchair size={10} /> Furnished
                    </button>
                    <button
                      onClick={() => setFilters({...filters, furnished: 'unfurnished'})}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.furnished === 'unfurnished'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Unfurnished
                    </button>
                  </div>
                </div>

                {/* Quick Price Presets */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Quick Price (FCFA)</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Under 50M', min: '', max: 50000000 },
                      { label: '50M - 100M', min: 50000000, max: 100000000 },
                      { label: '100M - 200M', min: 100000000, max: 200000000 },
                      { label: '200M+', min: 200000000, max: '' }
                    ].map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => setFilters({...filters, minPrice: preset.min, maxPrice: preset.max})}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
              {filters.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                  {categories.find(c => c.id === filters.category)?.label}
                  <button onClick={() => setFilters({...filters, category: 'all'})} className="ml-1 hover:text-emerald-900">×</button>
                </span>
              )}
              {filters.listingType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                  {filters.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                  <button onClick={() => setFilters({...filters, listingType: 'all'})} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {filters.region !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                  📍 {regions.find(r => r.id === filters.region)?.label}
                  <button onClick={() => setFilters({...filters, region: 'all'})} className="ml-1 hover:text-indigo-900">×</button>
                </span>
              )}
              {filters.bedrooms !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                  🛏️ {filters.bedrooms} {filters.bedrooms === '5+' ? '+' : ''}
                  <button onClick={() => setFilters({...filters, bedrooms: 'all'})} className="ml-1 hover:text-purple-900">×</button>
                </span>
              )}
              {filters.furnished !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                  {filters.furnished === 'furnished' ? '🛋️ Furnished' : '📦 Unfurnished'}
                  <button onClick={() => setFilters({...filters, furnished: 'all'})} className="ml-1 hover:text-amber-900">×</button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                  💰 {filters.minPrice ? `${parseInt(filters.minPrice).toLocaleString()}` : '0'} - {filters.maxPrice ? `${parseInt(filters.maxPrice).toLocaleString()}` : '∞'} FCFA
                  <button onClick={() => setFilters({...filters, minPrice: '', maxPrice: ''})} className="ml-1 hover:text-teal-900">×</button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No properties match your criteria</p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProperties.map((property) => {
                const firstImage = property.images?.[0];
                const imageUrl = getImageUrl(firstImage);
                
                return (
                  <PropertyCard 
                    key={property._id}
                    property={{
                      id: property._id,
                      title: property.title,
                      image: imageUrl || 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop',
                      listingType: property.listingType || 'sale',
                      category: property.category,
                      price: `${property.price?.amount?.toLocaleString() || 0}`,
                      location: `${property.location?.city || ''}, ${property.location?.region || ''}`,
                      size: property.surface?.value || 0,
                      beds: property.features?.bedrooms || 0,
                      baths: property.features?.bathrooms || 0,
                      isFurnished: property.features?.isFurnished || false
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RealEstate;