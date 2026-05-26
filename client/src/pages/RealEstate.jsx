// frontend/src/pages/RealEstate.jsx - VERSION AVEC FILTERBAR INTÉGRÉ ET LOGS

import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import FilterBar from '../components/real-estate/FilterBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { Search, X, AlertCircle, ChevronDown, SlidersHorizontal } from 'lucide-react';

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
  
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    maxBudget: '',
    listingType: 'all'
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: '',
    bedrooms: 'all',
    furnished: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
  }, [filters, advancedFilters, properties, searchTerm]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🌍 RealEstate - Environment: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
      console.log(`🔗 RealEstate - Backend URL: ${BACKEND_URL}`);
      
      const response = await api.getProperties({ status: 'PUBLISHED' });
      
      let propertiesData = [];
      if (response.properties) {
        propertiesData = response.properties;
      } else if (Array.isArray(response)) {
        propertiesData = response;
      } else if (response.data && response.data.properties) {
        propertiesData = response.data.properties;
      } else if (response.data && Array.isArray(response.data)) {
        propertiesData = response.data;
      }
      
      // 🔥 LOG - Afficher les premières propriétés pour vérifier les IDs
      console.log(`✅ ${propertiesData.length} properties loaded from backend`);
      if (propertiesData.length > 0) {
        console.log('📋 Sample property data:', {
          id: propertiesData[0]._id,
          title: propertiesData[0].title,
          hasId: !!propertiesData[0]._id
        });
      } else {
        console.warn('⚠️ No properties found in backend response');
      }
      
      setProperties(propertiesData);
      
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
    
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.listingType && filters.listingType !== 'all') {
      filtered = filtered.filter(p => p.listingType === filters.listingType);
    }
    
    if (filters.location && filters.location !== '') {
      filtered = filtered.filter(p => p.location?.region === filters.location);
    }
    
    if (filters.maxBudget && filters.maxBudget !== '') {
      const maxBudgetNum = parseInt(filters.maxBudget.replace(/,/g, ''));
      filtered = filtered.filter(p => p.price?.amount <= maxBudgetNum);
    }
    
    if (advancedFilters.minPrice) {
      filtered = filtered.filter(p => p.price?.amount >= parseInt(advancedFilters.minPrice));
    }
    
    if (advancedFilters.bedrooms !== 'all') {
      if (advancedFilters.bedrooms === '5+') {
        filtered = filtered.filter(p => p.features?.bedrooms >= 5);
      } else {
        filtered = filtered.filter(p => p.features?.bedrooms === parseInt(advancedFilters.bedrooms));
      }
    }
    
    if (advancedFilters.furnished !== 'all') {
      filtered = filtered.filter(p => {
        const isFurnished = p.features?.isFurnished === true;
        return advancedFilters.furnished === 'furnished' ? isFurnished : !isFurnished;
      });
    }
    
    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      location: '',
      maxBudget: '',
      listingType: 'all'
    });
    setAdvancedFilters({
      minPrice: '',
      bedrooms: 'all',
      furnished: 'all'
    });
    setSearchTerm('');
  };

  const hasActiveFilters = () => {
    return filters.category !== '' ||
           filters.location !== '' ||
           filters.maxBudget !== '' ||
           filters.listingType !== 'all' ||
           advancedFilters.minPrice !== '' ||
           advancedFilters.bedrooms !== 'all' ||
           advancedFilters.furnished !== 'all' ||
           searchTerm !== '';
  };

  const categories = [
    { id: 'all', label: 'All', icon: null },
    { id: 'House', label: 'House', icon: null },
    { id: 'Villa', label: 'Villa', icon: null },
    { id: 'Duplex', label: 'Duplex', icon: null },
    { id: 'Apartment', label: 'Apartment', icon: null },
    { id: 'Studio', label: 'Studio', icon: null },
    { id: 'Room', label: 'Room', icon: null },
    { id: 'Land', label: 'Land', icon: null },
    { id: 'Agricultural Land', label: 'Agri Land', icon: null },
    { id: 'Commercial Space', label: 'Commercial', icon: null },
    { id: 'Office', label: 'Office', icon: null },
    { id: 'Warehouse', label: 'Warehouse', icon: null },
    { id: 'Shop', label: 'Shop', icon: null },
    { id: 'Industrial Space', label: 'Industrial', icon: null },
    { id: 'Parking', label: 'Parking', icon: null }
  ];

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
            <button
              onClick={fetchProperties}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700"
            >
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

      <FilterBar onFilterChange={handleFilterChange} />

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
                  onChange={(e) => setAdvancedFilters({...advancedFilters, minPrice: e.target.value})}
                  placeholder="e.g., 10,000,000"
                  className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Bedrooms</label>
                <select
                  value={advancedFilters.bedrooms}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, bedrooms: e.target.value})}
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
                  onChange={(e) => setAdvancedFilters({...advancedFilters, furnished: e.target.value})}
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
              {hasActiveFilters() && (
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProperties.map((property, index) => {
                const firstImage = property.images?.[0];
                const imageUrl = getImageUrl(firstImage);
                const propertyId = property._id;
                
                // 🔥 LOG - Afficher chaque propriété rendue
                console.log(`🎴 Rendering property ${index + 1}/${filteredProperties.length}:`, {
                  id: propertyId,
                  title: property.title,
                  idType: typeof propertyId,
                  hasId: !!propertyId,
                  url: `/real-estate/${propertyId}`
                });
                
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