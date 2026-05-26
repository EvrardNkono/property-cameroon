import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import FilterBar from '../components/real-estate/FilterBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { Search, AlertCircle, ChevronDown, SlidersHorizontal } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '', location: '', maxBudget: '', listingType: 'all'
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: '', bedrooms: 'all', furnished: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProperties({ status: 'PUBLISHED' });
      let propertiesData = [];
      if (response.properties) propertiesData = response.properties;
      else if (Array.isArray(response)) propertiesData = response;
      else if (response.data?.properties) propertiesData = response.data.properties;
      else if (Array.isArray(response.data)) propertiesData = response.data;
      setProperties(propertiesData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // ✅ useMemo au lieu de useEffect + setState pour éviter les boucles de rendu
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.listingType !== 'all') filtered = filtered.filter(p => p.listingType === filters.listingType);
    if (filters.location) filtered = filtered.filter(p => p.location?.region === filters.location);
    if (filters.maxBudget) {
      const max = parseInt(filters.maxBudget.replace(/,/g, ''));
      filtered = filtered.filter(p => p.price?.amount <= max);
    }
    if (advancedFilters.minPrice) filtered = filtered.filter(p => p.price?.amount >= parseInt(advancedFilters.minPrice));
    if (advancedFilters.bedrooms !== 'all') {
      if (advancedFilters.bedrooms === '5+') filtered = filtered.filter(p => p.features?.bedrooms >= 5);
      else filtered = filtered.filter(p => p.features?.bedrooms === parseInt(advancedFilters.bedrooms));
    }
    if (advancedFilters.furnished !== 'all') {
      filtered = filtered.filter(p => {
        const f = p.features?.isFurnished === true;
        return advancedFilters.furnished === 'furnished' ? f : !f;
      });
    }
    return filtered;
  }, [properties, searchTerm, filters, advancedFilters]);

  const resetFilters = () => {
    setFilters({ category: '', location: '', maxBudget: '', listingType: 'all' });
    setAdvancedFilters({ minPrice: '', bedrooms: 'all', furnished: 'all' });
    setSearchTerm('');
  };

  const hasActiveFilters = 
    filters.category !== '' || filters.location !== '' || filters.maxBudget !== '' ||
    filters.listingType !== 'all' || advancedFilters.minPrice !== '' ||
    advancedFilters.bedrooms !== 'all' || advancedFilters.furnished !== 'all' || searchTerm !== '';

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

  if (error && properties.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96 px-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-md">
            <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="font-bold">Error loading properties</p>
            <p className="text-sm mt-1">{error}</p>
            <button onClick={fetchProperties} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-800 text-white pt-24 pb-20">
        {/* ✅ pointer-events-none pour que l'overlay ne bloque pas les clics */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
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

      <FilterBar onFilterChange={setFilters} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, city or region..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 text-base"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <SlidersHorizontal size={14} />
          Advanced Filters
          <ChevronDown size={14} className={`transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showAdvancedFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Min Price (FCFA)</label>
                <input
                  type="number"
                  value={advancedFilters.minPrice}
                  onChange={(e) => setAdvancedFilters(p => ({...p, minPrice: e.target.value}))}
                  placeholder="e.g., 10,000,000"
                  className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Bedrooms</label>
                <select
                  value={advancedFilters.bedrooms}
                  onChange={(e) => setAdvancedFilters(p => ({...p, bedrooms: e.target.value}))}
                  className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Furnished Status</label>
                <select
                  value={advancedFilters.furnished}
                  onChange={(e) => setAdvancedFilters(p => ({...p, furnished: e.target.value}))}
                  className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All</option>
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No properties match your criteria</p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProperties.map((property, index) => {
                const propertyId = property._id;
                const imageUrl = getImageUrl(property.images?.[0]);
                return (
                  <PropertyCard
                    key={propertyId || index}
                    property={{
                      id: propertyId,
                      _id: propertyId,
                      title: property.title,
                      image: imageUrl || 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop',
                      listingType: property.listingType || 'sale',
                      category: property.category,
                      price: property.price?.amount || 0,
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