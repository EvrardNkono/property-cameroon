// frontend/src/pages/RealEstate.jsx - VERSION AVEC TRADUCTION

import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  Search, X, Home, Building2, 
  MapPin, Filter, AlertCircle,
  Hotel, BedDouble, DoorOpen, Trees, Store, 
  Briefcase, Warehouse, ShoppingBasket, Factory, 
  ParkingCircle, Heart, Star, Sofa, Armchair,
  Tag, Euro, Layers, Check, ChevronDown, SlidersHorizontal
} from 'lucide-react';

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

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
  
  const currentLang = useCurrentLang();
  
  const [filters, setFilters] = useState({
    category: 'all',
    listingType: 'all',
    minPrice: '',
    maxPrice: '',
    region: 'all',
    bedrooms: 'all',
    furnished: 'all'
  });

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero
      heroTitle: "Trouvez la propriété de vos rêves",
      heroSubtitle: "Découvrez des maisons, terrains et espaces commerciaux exceptionnels à travers le Cameroun",
      properties: "Propriétés",
      
      // Search
      searchPlaceholder: "Rechercher par titre, ville ou région...",
      
      // Listing Types
      all: "Tous",
      forSale: "À Vendre",
      forRent: "À Louer",
      
      // Filters
      moreFilters: "Plus de filtres",
      reset: "Réinitialiser",
      any: "Tous",
      
      // Advanced Filters
      bedrooms: "Chambres",
      furnishedStatus: "État d'équipement",
      furnished: "Meublé",
      unfurnished: "Non meublé",
      quickPrice: "Prix rapide (FCFA)",
      under50M: "Moins de 50M",
      between50and100M: "50M - 100M",
      between100and200M: "100M - 200M",
      over200M: "200M+",
      
      // Regions
      allRegions: "Toutes les régions",
      center: "Centre (Yaoundé)",
      littoral: "Littoral (Douala)",
      west: "Ouest (Bafoussam)",
      northWest: "Nord-Ouest (Bamenda)",
      south: "Sud",
      adamawa: "Adamaoua",
      north: "Nord",
      farNorth: "Extrême-Nord",
      east: "Est",
      
      // Categories
      allCategories: "Tous",
      house: "Maison",
      villa: "Villa",
      duplex: "Duplex",
      apartment: "Appartement",
      studio: "Studio",
      room: "Chambre",
      land: "Terrain",
      agriculturalLand: "Terre agricole",
      commercialSpace: "Commercial",
      office: "Bureau",
      warehouse: "Entrepôt",
      shop: "Boutique",
      industrialSpace: "Industriel",
      parking: "Parking",
      
      // Errors
      errorLoading: "Erreur de chargement des propriétés",
      tryAgain: "Réessayer",
      noProperties: "Aucune propriété ne correspond à vos critères",
      clearFilters: "Effacer tous les filtres",
      
      // Status
      loading: "Chargement...",
      
      // Price labels
      min: "Min",
      max: "Max"
    },
    en: {
      // Hero
      heroTitle: "Find Your Dream Property",
      heroSubtitle: "Discover exceptional homes, lands, and commercial spaces across Cameroon",
      properties: "Properties",
      
      // Search
      searchPlaceholder: "Search by title, city or region...",
      
      // Listing Types
      all: "All",
      forSale: "For Sale",
      forRent: "For Rent",
      
      // Filters
      moreFilters: "More Filters",
      reset: "Reset",
      any: "Any",
      
      // Advanced Filters
      bedrooms: "Bedrooms",
      furnishedStatus: "Furnished Status",
      furnished: "Furnished",
      unfurnished: "Unfurnished",
      quickPrice: "Quick Price (FCFA)",
      under50M: "Under 50M",
      between50and100M: "50M - 100M",
      between100and200M: "100M - 200M",
      over200M: "200M+",
      
      // Regions
      allRegions: "All Regions",
      center: "Center (Yaoundé)",
      littoral: "Littoral (Douala)",
      west: "West (Bafoussam)",
      northWest: "North-West (Bamenda)",
      south: "South",
      adamawa: "Adamawa",
      north: "North",
      farNorth: "Far-North",
      east: "East",
      
      // Categories
      allCategories: "All",
      house: "House",
      villa: "Villa",
      duplex: "Duplex",
      apartment: "Apartment",
      studio: "Studio",
      room: "Room",
      land: "Land",
      agriculturalLand: "Agri Land",
      commercialSpace: "Commercial",
      office: "Office",
      warehouse: "Warehouse",
      shop: "Shop",
      industrialSpace: "Industrial",
      parking: "Parking",
      
      // Errors
      errorLoading: "Error loading properties",
      tryAgain: "Try Again",
      noProperties: "No properties match your criteria",
      clearFilters: "Clear all filters",
      
      // Status
      loading: "Loading...",
      
      // Price labels
      min: "Min",
      max: "Max"
    }
  }[currentLang] || {
    // Fallback français
    heroTitle: "Trouvez la propriété de vos rêves",
    heroSubtitle: "Découvrez des maisons, terrains et espaces commerciaux exceptionnels à travers le Cameroun",
    properties: "Propriétés",
    searchPlaceholder: "Rechercher par titre, ville ou région...",
    all: "Tous",
    forSale: "À Vendre",
    forRent: "À Louer",
    moreFilters: "Plus de filtres",
    reset: "Réinitialiser",
    any: "Tous",
    bedrooms: "Chambres",
    furnishedStatus: "État d'équipement",
    furnished: "Meublé",
    unfurnished: "Non meublé",
    quickPrice: "Prix rapide (FCFA)",
    under50M: "Moins de 50M",
    between50and100M: "50M - 100M",
    between100and200M: "100M - 200M",
    over200M: "200M+",
    allRegions: "Toutes les régions",
    center: "Centre (Yaoundé)",
    littoral: "Littoral (Douala)",
    west: "Ouest (Bafoussam)",
    northWest: "Nord-Ouest (Bamenda)",
    south: "Sud",
    adamawa: "Adamaoua",
    north: "Nord",
    farNorth: "Extrême-Nord",
    east: "Est",
    allCategories: "Tous",
    house: "Maison",
    villa: "Villa",
    duplex: "Duplex",
    apartment: "Appartement",
    studio: "Studio",
    room: "Chambre",
    land: "Terrain",
    agriculturalLand: "Terre agricole",
    commercialSpace: "Commercial",
    office: "Bureau",
    warehouse: "Entrepôt",
    shop: "Boutique",
    industrialSpace: "Industriel",
    parking: "Parking",
    errorLoading: "Erreur de chargement des propriétés",
    tryAgain: "Réessayer",
    noProperties: "Aucune propriété ne correspond à vos critères",
    clearFilters: "Effacer tous les filtres",
    loading: "Chargement...",
    min: "Min",
    max: "Max"
  };

  // Régions du Cameroun avec traduction
  const regions = [
    { id: 'all', label: t.allRegions },
    { id: 'Center', label: t.center },
    { id: 'Littoral', label: t.littoral },
    { id: 'West', label: t.west },
    { id: 'North-West', label: t.northWest },
    { id: 'South', label: t.south },
    { id: 'Adamawa', label: t.adamawa },
    { id: 'North', label: t.north },
    { id: 'Far-North', label: t.farNorth },
    { id: 'East', label: t.east }
  ];

  // Catégories avec traduction
  const categories = [
    { id: 'all', label: t.allCategories, icon: <Home size={14} /> },
    { id: 'House', label: t.house, icon: <Home size={14} /> },
    { id: 'Villa', label: t.villa, icon: <Hotel size={14} /> },
    { id: 'Duplex', label: t.duplex, icon: <Building2 size={14} /> },
    { id: 'Apartment', label: t.apartment, icon: <Building2 size={14} /> },
    { id: 'Studio', label: t.studio, icon: <DoorOpen size={14} /> },
    { id: 'Room', label: t.room, icon: <BedDouble size={14} /> },
    { id: 'Land', label: t.land, icon: <MapPin size={14} /> },
    { id: 'Agricultural Land', label: t.agriculturalLand, icon: <Trees size={14} /> },
    { id: 'Commercial Space', label: t.commercialSpace, icon: <Store size={14} /> },
    { id: 'Office', label: t.office, icon: <Briefcase size={14} /> },
    { id: 'Warehouse', label: t.warehouse, icon: <Warehouse size={14} /> },
    { id: 'Shop', label: t.shop, icon: <ShoppingBasket size={14} /> },
    { id: 'Industrial Space', label: t.industrialSpace, icon: <Factory size={14} /> },
    { id: 'Parking', label: t.parking, icon: <ParkingCircle size={14} /> }
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties, searchTerm]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Ajouter la langue à la requête pour que le backend traduise
      const response = await api.getProperties({ status: 'PUBLISHED', lang: currentLang });
      
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
      
      setProperties(propertiesData);
      
    } catch (err) {
      console.error('Error loading properties from backend:', err);
      setError(err.response?.data?.message || err.message || t.errorLoading);
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

  if (error && properties.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96 px-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-md">
            <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="font-bold">{t.errorLoading}</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchProperties}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700"
            >
              {t.tryAgain}
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-800 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{t.heroTitle}</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-2">
              <div className="text-2xl font-bold">{filteredProperties.length}</div>
              <div className="text-[10px] uppercase tracking-wider">{t.properties}</div>
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
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 text-base"
            />
          </div>

          {/* Main Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Listing Type */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              {[
                { id: 'all', label: t.all },
                { id: 'sale', label: t.forSale },
                { id: 'rent', label: t.forRent }
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
                className="appearance-none px-4 py-2 pr-8 pl-8 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
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
                placeholder={t.min}
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="w-20 py-2 bg-transparent outline-none text-sm placeholder:text-gray-400"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                placeholder={t.max}
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
              {t.moreFilters}
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
                {t.reset}
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
                    <BedDouble size={12} /> {t.bedrooms}
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
                        {opt === 'all' ? t.any : opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Furnished Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                    <Sofa size={12} /> {t.furnishedStatus}
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
                      {t.all}
                    </button>
                    <button
                      onClick={() => setFilters({...filters, furnished: 'furnished'})}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        filters.furnished === 'furnished'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Armchair size={10} /> {t.furnished}
                    </button>
                    <button
                      onClick={() => setFilters({...filters, furnished: 'unfurnished'})}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.furnished === 'unfurnished'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t.unfurnished}
                    </button>
                  </div>
                </div>

                {/* Quick Price Presets */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">{t.quickPrice}</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: t.under50M, min: '', max: 50000000 },
                      { label: t.between50and100M, min: 50000000, max: 100000000 },
                      { label: t.between100and200M, min: 100000000, max: 200000000 },
                      { label: t.over200M, min: 200000000, max: '' }
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
                  {filters.listingType === 'sale' ? t.forSale : t.forRent}
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
                  {filters.furnished === 'furnished' ? '🛋️ ' + t.furnished : '📦 ' + t.unfurnished}
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
              <p className="text-gray-500 text-lg">{t.noProperties}</p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
              >
                {t.clearFilters}
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
                      title: property.title, // Déjà traduit par le backend
                      image: imageUrl || 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop',
                      listingType: property.listingType || 'sale',
                      category: property.category,
                      price: `${property.price?.amount?.toLocaleString() || 0}`,
                      location: `${property.location?.city || ''}, ${property.location?.region || ''}`, // Déjà traduit
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