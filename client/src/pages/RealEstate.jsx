// frontend/src/pages/RealEstate.jsx
import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// Fonction pour obtenir l'URL correcte d'une image
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si c'est déjà une URL complète (http:// ou https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si c'est une URL blob (upload temporaire)
  if (imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // Si c'est un chemin relatif commençant par /uploads
  if (imagePath.startsWith('/uploads')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // Sinon, on suppose que c'est juste le nom du fichier
  if (imagePath.includes('/uploads/properties/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // Si c'est un simple nom de fichier
  return `${BACKEND_URL}/uploads/properties/${imagePath}`;
};

const RealEstate = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État des filtres
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    city: 'all',
    minSurface: '',
    bedrooms: 'all',
    bathrooms: 'all'
  });
  
  // Options pour les filtres
  const categories = ['all', 'Apartment', 'House', 'Land', 'Commercial', 'Villa'];
  const cities = ['all', 'Douala', 'Yaoundé', 'Garoua', 'Bafoussam', 'Bamenda', 'Limbe', 'Kribi'];
  const bedroomOptions = ['all', '1', '2', '3', '4', '5+'];
  const bathroomOptions = ['all', '1', '2', '3', '4+'];

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log(`🌍 RealEstate - Environnement: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
      console.log(`🔗 Backend URL: ${BACKEND_URL}`);
      
      const response = await api.getProperties({ status: 'PUBLISHED' });
      
      // Debug: Afficher les premières images pour vérifier
      if (response.properties && response.properties.length > 0) {
        console.log('🔍 Sample property images:', response.properties[0].images);
      }
      
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
    
    // Filtre par catégorie
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Filtre par type (vente/location)
    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.listingType === filters.type);
    }
    
    // Filtre par prix
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price?.amount >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price?.amount <= parseInt(filters.maxPrice));
    }
    
    // Filtre par ville
    if (filters.city !== 'all') {
      filtered = filtered.filter(p => p.location?.city === filters.city);
    }
    
    // Filtre par surface
    if (filters.minSurface) {
      filtered = filtered.filter(p => p.surface?.value >= parseInt(filters.minSurface));
    }
    
    // Filtre par nombre de chambres
    if (filters.bedrooms !== 'all') {
      if (filters.bedrooms === '5+') {
        filtered = filtered.filter(p => p.features?.bedrooms >= 5);
      } else {
        filtered = filtered.filter(p => p.features?.bedrooms === parseInt(filters.bedrooms));
      }
    }
    
    // Filtre par nombre de salles de bain
    if (filters.bathrooms !== 'all') {
      if (filters.bathrooms === '4+') {
        filtered = filtered.filter(p => p.features?.bathrooms >= 4);
      } else {
        filtered = filtered.filter(p => p.features?.bathrooms === parseInt(filters.bathrooms));
      }
    }
    
    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      type: 'all',
      minPrice: '',
      maxPrice: '',
      city: 'all',
      minSurface: '',
      bedrooms: 'all',
      bathrooms: 'all'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pc-gold"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-32">
          <p className="text-red-600">Error: {error}</p>
          <button onClick={fetchProperties} className="mt-4 px-4 py-2 bg-pc-gold text-white rounded">
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-12 px-4 sm:px-6 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-4">
              Real Estate Portfolio
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Discover our exclusive collection of certified properties across Cameroon's prime locations.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="sticky top-0 z-20 bg-white shadow-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Version Desktop */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Listing Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                >
                  <option value="all">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city === 'all' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Min Price (FCFA)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Max Price (FCFA)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Min Surface (m²)</label>
                <input
                  type="number"
                  value={filters.minSurface}
                  onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                >
                  {bedroomOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt === 'all' ? 'Any' : opt === '5+' ? '5+' : `${opt}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pc-gold focus:border-pc-gold"
                >
                  {bathroomOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt === 'all' ? 'Any' : opt === '4+' ? '4+' : `${opt}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Version Mobile */}
          <div className="lg:hidden">
            <div className="flex flex-wrap gap-3 mb-3">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Category' : cat}
                  </option>
                ))}
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="all">Type</option>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
              
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'City' : city}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min Price"
                className="flex-1 min-w-[100px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
              
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max Price"
                className="flex-1 min-w-[100px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
              
              <input
                type="number"
                value={filters.minSurface}
                onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                placeholder="Min m²"
                className="flex-1 min-w-[100px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
              
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="flex-1 min-w-[100px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                {bedroomOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt === 'all' ? 'Beds' : opt === '5+' ? '5+ Beds' : `${opt} Bed${opt !== '1' ? 's' : ''}`}
                  </option>
                ))}
              </select>
              
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="flex-1 min-w-[100px] px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                {bathroomOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt === 'all' ? 'Baths' : opt === '4+' ? '4+ Baths' : `${opt} Bath${opt !== '1' ? 's' : ''}`}
                  </option>
                ))}
              </select>
              
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm bg-pc-gold text-white rounded-lg hover:bg-opacity-90"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-right">
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-pc-gold">{filteredProperties.length}</span> properties found
            </span>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-slate-500 text-lg">No properties match your criteria</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-pc-gold text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {filteredProperties.map((property) => {
                // Obtenir la première image
                let firstImage = null;
                if (property.images && property.images.length > 0) {
                  firstImage = property.images[0];
                }
                
                const imageUrl = getImageUrl(firstImage);
                
                // Debug: Afficher l'URL de l'image générée
                if (firstImage) {
                  console.log('🖼️ Property:', property.title);
                  console.log('   Original image:', firstImage);
                  console.log('   Generated URL:', imageUrl);
                }
                
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