// frontend/src/pages/RealEstate.jsx - AVEC FILTRE MEUBLÉ/NON MEUBLÉ

import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  Search, X, Home, Building2, 
  MapPin, Filter, ChevronDown, AlertCircle,
  Hotel, BedDouble, DoorOpen, Trees, Store, 
  Briefcase, Warehouse, ShoppingBasket, Factory, 
  ParkingCircle, Heart, Star, Sofa, Armchair
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
  
  if (image.startsWith('blob:')) {
    console.log('⚠️ Image blob ignorée:', image);
    return null;
  }
  
  if (!isDevelopment && image.includes('localhost')) {
    console.log('⚠️ Image localhost ignorée en production:', image);
    return null;
  }
  
  if (image.startsWith('http')) {
    return image;
  }
  
  if (image.startsWith('/uploads')) {
    return `${BACKEND_URL}${image}`;
  }
  
  return null;
};

const RealEstate = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    city: 'all',
    bedrooms: 'all',
    furnished: 'all'  // ✅ NEW FILTER: 'all', 'furnished', 'unfurnished'
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
      
      const propertiesWithImages = (response.properties || []).map(prop => ({
        ...prop,
        images: (prop.images || []).filter(img => {
          if (!img) return false;
          if (img.startsWith('blob:')) return false;
          if (!isDevelopment && img.includes('localhost')) return false;
          return true;
        })
      }));
      
      let totalImages = 0;
      let validImageUrls = 0;
      
      propertiesWithImages.forEach(prop => {
        if (prop.images && prop.images.length > 0) {
          totalImages += prop.images.length;
          prop.images.forEach(img => {
            if (getImageUrl(img)) validImageUrls++;
          });
        }
      });
      
      setDebugInfo({
        totalProperties: propertiesWithImages.length,
        totalImages,
        validImageUrls,
        sampleProperty: propertiesWithImages[0] ? {
          title: propertiesWithImages[0].title,
          images: propertiesWithImages[0].images,
          generatedUrl: getImageUrl(propertiesWithImages[0].images?.[0])
        } : null
      });
      
      console.log('🔍 DEBUG IMAGES:', {
        totalProperties: propertiesWithImages.length,
        totalImages,
        validImageUrls,
        firstPropertyImages: propertiesWithImages[0]?.images
      });
      
      setProperties(propertiesWithImages);
    } catch (err) {
      console.error('Error fetching properties:', err);
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
        p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // ✅ FILTER BY EXACT CATEGORY
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price?.amount >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price?.amount <= parseInt(filters.maxPrice));
    }
    
    if (filters.city !== 'all') {
      filtered = filtered.filter(p => p.location?.city === filters.city);
    }
    
    if (filters.bedrooms !== 'all') {
      if (filters.bedrooms === '5+') {
        filtered = filtered.filter(p => p.features?.bedrooms >= 5);
      } else {
        filtered = filtered.filter(p => p.features?.bedrooms === parseInt(filters.bedrooms));
      }
    }
    
    // ✅ NEW: FILTER BY FURNISHED STATUS (only for Room category or all)
    if (filters.furnished !== 'all') {
      filtered = filtered.filter(p => {
        // Check if property has isFurnished feature
        const isFurnished = p.features?.isFurnished === true;
        if (filters.furnished === 'furnished') {
          return isFurnished === true;
        } else if (filters.furnished === 'unfurnished') {
          return isFurnished === false;
        }
        return true;
      });
    }
    
    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      city: 'all',
      bedrooms: 'all',
      furnished: 'all'  // ✅ Reset furnished filter
    });
    setSearchTerm('');
  };

  // ✅ ALL DETAILED CATEGORIES FOR FILTER
  const categories = [
    { id: 'all', label: 'All Properties', icon: <Home size={16} />, group: 'all' },
    
    // HOUSES
    { id: 'House', label: 'House', icon: <Home size={16} />, group: 'houses' },
    { id: 'Villa', label: 'Villa', icon: <Hotel size={16} />, group: 'houses' },
    { id: 'Duplex', label: 'Duplex', icon: <Building2 size={16} />, group: 'houses' },
    
    // APARTMENTS
    { id: 'Apartment', label: 'Apartment', icon: <Building2 size={16} />, group: 'apartments' },
    { id: 'Studio', label: 'Studio', icon: <DoorOpen size={16} />, group: 'apartments' },
    
    // ROOMS
    { id: 'Room', label: 'Room', icon: <BedDouble size={16} />, group: 'rooms' },
    
    // LAND
    { id: 'Land', label: 'Land', icon: <MapPin size={16} />, group: 'land' },
    { id: 'Agricultural Land', label: 'Agricultural Land', icon: <Trees size={16} />, group: 'land' },
    
    // COMMERCIAL
    { id: 'Commercial Space', label: 'Commercial Space', icon: <Store size={16} />, group: 'commercial' },
    { id: 'Office', label: 'Office', icon: <Briefcase size={16} />, group: 'commercial' },
    { id: 'Warehouse', label: 'Warehouse', icon: <Warehouse size={16} />, group: 'commercial' },
    { id: 'Shop', label: 'Shop', icon: <ShoppingBasket size={16} />, group: 'commercial' },
    
    // OTHER
    { id: 'Industrial Space', label: 'Industrial Space', icon: <Factory size={16} />, group: 'other' },
    { id: 'Parking', label: 'Parking', icon: <ParkingCircle size={16} />, group: 'other' }
  ];

  // Category groups for organized display
  const categoryGroups = [
    { name: 'Houses', key: 'houses', icon: <Home size={14} /> },
    { name: 'Apartments', key: 'apartments', icon: <Building2 size={14} /> },
    { name: 'Rooms', key: 'rooms', icon: <BedDouble size={14} /> },
    { name: 'Land', key: 'land', icon: <MapPin size={14} /> },
    { name: 'Commercial', key: 'commercial', icon: <Store size={14} /> },
    { name: 'Other', key: 'other', icon: <Star size={14} /> }
  ];
  
  const cities = ['all', 'Douala', 'Yaoundé', 'Garoua', 'Bafoussam', 'Bamenda', 'Limbe', 'Kribi'];

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
      
      {debugInfo && debugInfo.totalImages === 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle size={20} className="text-yellow-600" />
            <div className="text-sm text-yellow-700">
              <strong>No images found</strong> - {debugInfo.totalProperties} property(ies) loaded, 0 image(s).
              {debugInfo.sampleProperty && (
                <span className="block text-xs mt-1">
                  Example: "{debugInfo.sampleProperty.title}" - Images: {JSON.stringify(debugInfo.sampleProperty.images)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
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

          {showFilters && (
            <div className="mt-6 p-6 bg-gray-100 rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Category Filter - Organized by groups */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-3">Property Type</label>
                  <div className="space-y-4">
                    {categoryGroups.map(group => {
                      const groupCategories = categories.filter(c => c.group === group.key);
                      if (groupCategories.length === 0) return null;
                      
                      const selectedInGroup = groupCategories.some(c => filters.category === c.id);
                      
                      return (
                        <div key={group.key}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-emerald-600">{group.icon}</span>
                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{group.name}</span>
                            {selectedInGroup && (
                              <span className="ml-auto text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Selected</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 ml-1">
                            {groupCategories.map(cat => (
                              <button
                                key={cat.id}
                                onClick={() => setFilters({...filters, category: cat.id})}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  filters.category === cat.id
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-100'
                                }`}
                              >
                                {cat.icon}
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* All Properties Button */}
                    <button
                      onClick={() => setFilters({...filters, category: 'all'})}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all mt-2 ${
                        filters.category === 'all'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-100'
                      }`}
                    >
                      <Heart size={14} />
                      All Properties
                    </button>
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city === 'all' ? 'All Cities' : city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', '1', '2', '3', '4', '5+'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFilters({...filters, bedrooms: opt})}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

              {/* ✅ NEW: Furnished Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2">
                    <Sofa size={14} />
                    Furnished Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilters({...filters, furnished: 'all'})}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        filters.furnished === 'all'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilters({...filters, furnished: 'furnished'})}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        filters.furnished === 'furnished'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Armchair size={12} />
                      Furnished
                    </button>
                    <button
                      onClick={() => setFilters({...filters, furnished: 'unfurnished'})}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        filters.furnished === 'unfurnished'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Unfurnished
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1">
                    Only applies to rooms and apartments
                  </p>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Price Range (FCFA)</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="flex-1 px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="flex-1 px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Button Row */}
              <div className="flex justify-end mt-5 pt-3">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 bg-white rounded-xl"
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
        <div className="flex justify-between items-center flex-wrap gap-2">
          <p className="text-gray-500">
            <span className="font-semibold text-emerald-600">{filteredProperties.length}</span> properties found
          </p>
          <div className="flex gap-2">
            {filters.category !== 'all' && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                {categories.find(c => c.id === filters.category)?.label || filters.category}
              </span>
            )}
            {filters.furnished !== 'all' && (
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
                <Sofa size={10} />
                {filters.furnished === 'furnished' ? 'Furnished' : 'Unfurnished'}
              </span>
            )}
          </div>
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
                
                console.log('📸 RealEstate - Property:', {
                  title: property.title,
                  category: property.category,
                  isFurnished: property.features?.isFurnished,
                  firstImage: firstImage,
                  imageUrl: imageUrl
                });
                
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
                      baths: property.features?.bathrooms || 2,
                      isFurnished: property.features?.isFurnished || false  // ✅ Pass furnished status
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