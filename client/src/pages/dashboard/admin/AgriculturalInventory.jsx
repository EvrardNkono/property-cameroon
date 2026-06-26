// frontend/src/components/admin/AgriculturalInventory.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sprout, Plus, Search, Edit, Trash2, ExternalLink, 
  Tractor, Droplets, Sun, Mountain, Loader2
} from 'lucide-react';
import api from '../../../services/api';
import { AdminSectionHeader, AdminStatusBadge, AdminActionButton } from '../../../components/admin/AdminComponents';

const AgriculturalInventory = () => {
  const [currentLang, setCurrentLang] = useState('fr');
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      title: "Terres Agricoles",
      description: "Gérez les propriétés agricoles, la qualité des sols et la compatibilité des cultures.",
      newAgriculturalLand: "Nouvelle Terre Agricole",
      
      // Tabs
      all: "Toutes",
      pending: "En Attente",
      published: "Publié",
      sold: "Vendu",
      
      // Table headers
      landCrop: "Terre / Culture",
      location: "Localisation",
      surface: "Superficie",
      soilQuality: "Qualité du Sol",
      price: "Prix",
      status: "Statut",
      actions: "Actions",
      
      // Filters
      allRegions: "Toutes les Régions",
      center: "Centre",
      south: "Sud",
      west: "Ouest",
      littoral: "Littoral",
      searchPlaceholder: "Rechercher...",
      
      // Labels
      mixed: "Mixte",
      unknown: "Inconnu",
      
      // Messages
      noData: "Aucune donnée disponible",
      loadingData: "Chargement des données...",
      errorLoading: "Erreur de chargement",
      retry: "Réessayer",
      
      // Status labels
      statusPending: "En Attente",
      statusPublished: "Publié",
      statusSold: "Vendu",
      statusReserved: "Réservé"
    },
    en: {
      title: "Agricultural Lands",
      description: "Manage agricultural properties, soil quality, and crop compatibility.",
      newAgriculturalLand: "New Agricultural Land",
      
      // Tabs
      all: "All",
      pending: "Pending",
      published: "Published",
      sold: "Sold",
      
      // Table headers
      landCrop: "Land / Crop",
      location: "Location",
      surface: "Surface",
      soilQuality: "Soil Quality",
      price: "Price",
      status: "Status",
      actions: "Actions",
      
      // Filters
      allRegions: "All Regions",
      center: "Center",
      south: "South",
      west: "West",
      littoral: "Littoral",
      searchPlaceholder: "Search...",
      
      // Labels
      mixed: "Mixed",
      unknown: "Unknown",
      
      // Messages
      noData: "No data available",
      loadingData: "Loading data...",
      errorLoading: "Error loading",
      retry: "Retry",
      
      // Status labels
      statusPending: "Pending",
      statusPublished: "Published",
      statusSold: "Sold",
      statusReserved: "Reserved"
    }
  };

  // Récupérer la langue
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setCurrentLang(finalLang);
  }, []);

  const t = translations[currentLang] || translations.fr;

  // Obtenir le libellé du statut traduit
  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': t.statusPending,
      'PUBLISHED': t.statusPublished,
      'SOLD': t.statusSold,
      'RESERVED': t.statusReserved
    };
    return statusMap[status] || status;
  };

  // Tabs avec traduction
  const tabs = [
    { id: 'ALL', label: t.all },
    { id: 'PENDING', label: t.pending },
    { id: 'PUBLISHED', label: t.published },
    { id: 'SOLD', label: t.sold }
  ];

  // Régions avec traduction
  const regions = [
    { value: '', label: t.allRegions },
    { value: 'Center', label: t.center },
    { value: 'South', label: t.south },
    { value: 'West', label: t.west },
    { value: 'Littoral', label: t.littoral }
  ];

  useEffect(() => {
    fetchAgriculturalLands();
  }, [activeTab, searchQuery, regionFilter, currentLang]);

  const fetchAgriculturalLands = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (activeTab !== 'ALL') filters.status = activeTab;
      if (searchQuery) filters.search = searchQuery;
      if (regionFilter) filters.region = regionFilter;
      
      const response = await api.get('/agriculture', filters);
      setLands(response.lands || []);
    } catch (error) {
      console.error('Error fetching agricultural lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCropIcon = (crop) => {
    const icons = {
      cocoa: '🍫',
      coffee: '☕',
      palm: '🌴',
      banana: '🍌',
      rubber: '⚙️',
      maize: '🌽',
      rice: '🍚',
      cassava: '🍠',
      yam: '🍠',
      sweet: '🍠',
      potato: '🥔',
      tomato: '🍅',
      onion: '🧅',
      garlic: '🧄',
      chili: '🌶️',
      pepper: '🫑',
      beans: '🫘',
      soybean: '🫘',
      peanut: '🥜'
    };
    return icons[crop?.toLowerCase()] || '🌾';
  };

  const formatPrice = (price) => {
    if (!price) return `0 ${t.fcfa || 'FCFA'}`;
    if (typeof price === 'object') {
      return `${price.amount?.toLocaleString() || 0} ${price.currency || 'FCFA'}`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="animate-spin text-[#c5a059]" size={40} />
        <p className="text-slate-500 text-sm">{t.loadingData}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center max-w-md">
          <p className="font-bold">{t.errorLoading}</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchAgriculturalLands}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <AdminSectionHeader 
          title={t.title} 
          description={t.description} 
        />
        <button className="flex items-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          <Plus size={16} /> {t.newAgriculturalLand}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                activeTab === tab.id ? 'bg-[#0a2619] text-[#c5a059]' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select 
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border-none"
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">{t.landCrop}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">{t.location}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">{t.surface}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">{t.soilQuality}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">{t.price}</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">{t.status}</th>
                <th className="px-6 py-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {lands.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <Sprout size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">{t.noData}</p>
                  </td>
                </tr>
              ) : (
                lands.map((land) => (
                  <tr key={land._id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">
                          {getCropIcon(land.agricultureDetails?.primaryCrop)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#0a2619]">{land.title}</p>
                          <p className="text-[9px] text-slate-400 uppercase">
                            {land.agricultureDetails?.primaryCrop || t.mixed}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {land.location?.region || t.unknown}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {land.surface?.value || 0} {land.surface?.unit || 'Ha'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{ width: `${land.agricultureDetails?.soilQuality || 50}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{land.agricultureDetails?.soilQuality || 50}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {formatPrice(land.price)}
                    </td>
                    <td className="px-6 py-4">
                      <AdminStatusBadge status={land.status} label={getStatusLabel(land.status)} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <AdminActionButton icon={Edit} onClick={() => {}} />
                        <AdminActionButton icon={Trash2} variant="danger" onClick={() => {}} />
                        <AdminActionButton icon={ExternalLink} variant="primary" onClick={() => {}} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalInventory;