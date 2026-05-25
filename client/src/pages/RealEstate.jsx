// frontend/src/pages/RealEstate.jsx - VERSION MODERNISÉE

import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  Search, SlidersHorizontal, X, Home, Building2, 
  MapPin, Bed, Bath, Maximize2, DollarSign, Filter,
  ChevronDown
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
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/properties/${image}`;
};

const RealEstate = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    category: 'all',
    listingType: 'all',
    minPrice: '',
    maxPrice: '',
    city: 'all',
    bedrooms: 'all'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties, searchTerm]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.getProperties({ status: 'PUBLISHED' });
      setProperties(response.properties || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];
    
    // Search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Listing type
    if (filters.listingType !== 'all') {
      filtered = filtered.filter(p => p.listingType === filters.listingType);
    }
    
    // Price
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price?.amount >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price?.amount <= parseInt(filters.maxPrice));
    }
    
    // City
    if (filters.city !== 'all') {
      filtered = filtered.filter(p => p.location?.city === filters.city);
    }
    
    // Bedrooms
    if (filters.bedrooms !== 'all') {
      if (filters.bedrooms === '5+') {
        filtered = filtered.filter(p => p.features?.bedrooms >= 5);
      } else {
        filtered = filtered.filter(p => p.features?.bedrooms === parseInt(filters.bedrooms));
      }
    }
    
    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      listingType: 'all',
      minPrice: '',
      maxPrice: '',
      city: 'all',
      bedrooms: 'all'
    });
    setSearchTerm('');
  };

  const categories = [
    { id: 'all', label: 'All Properties', icon: <Home size={16} /> },
    { id: 'Land', label: 'Land', icon: <MapPin size={16} /> },
    { id: 'Real Estate', label: 'Real Estate', icon: <Building2 size={16} /> }
  ];
  
  const cities = ['all', 'Douala', 'Yaoundé', 'Garoua', 'Bafoussam', 'Bamenda', 'Limbe', 'Kribi'];
  const priceRanges = [
    { label: 'All', min: '', max: '' },
    { label: 'Under 50M', min: '', max: 50000000 },
    { label: '50M - 100M', min: 50000000, max: 100000000 },
    { label: '100M - 200M', min: 100000000, max: 200000000 },
    { label: '200M+', min: 200000000, max: '' }
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
      <section className="relative bg-emerald-900 text-white pt-32 pb-20">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Real Estate Portfolio
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Discover exceptional properties across Cameroon's most desirable locations
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-white shadow-lg -mt-8 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or city..."
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all"
            >
              <Filter size={20} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-emerald-500 text-xs rounded-full">{activeFiltersCount}</span>
              )}
              <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-100 rounded-2xl animate-in slide-in-from-top duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFilters({...filters, category: cat.id})}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.category === cat.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat.icon}
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city === 'all' ? 'All Cities' : city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Price Range</label>
                  <select
                    value={`${filters.minPrice}-${filters.maxPrice}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-');
                      setFilters({...filters, minPrice: min === 'all' ? '' : min, maxPrice: max === 'all' ? '' : max});
                    }}
                    className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {priceRanges.map(range => (
                      <option key={range.label} value={`${range.min}-${range.max}`}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', '1', '2', '3', '4', '5+'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFilters({...filters, bedrooms: opt})}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.bedrooms === opt
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {opt === 'all' ? 'Any' : opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-5 pt-4 border-t border-gray-200">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            <span className="font-semibold text-emerald-600">{filteredProperties.length}</span> properties found
          </p>
          {filteredProperties.length > 0 && (
            <p className="text-sm text-gray-400">Showing {Math.min(12, filteredProperties.length)} results per page</p>
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
                      image: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
                      status: property.status === 'PUBLISHED' ? 'sale' : 'lease',
                      category: property.category,
                      price: `${property.price?.amount?.toLocaleString() || 0}`,
                      location: `${property.location?.city || ''}, ${property.location?.region || ''}`,
                      type: property.category?.toLowerCase() === 'land' ? 'land' : 'building',
                      size: property.surface?.value || 0,
                      beds: property.features?.bedrooms || 3,
                      baths: property.features?.bathrooms || 2
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