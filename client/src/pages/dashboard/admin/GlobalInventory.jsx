// frontend/src/pages/dashboard/admin/GlobalInventory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Home, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Layers,
  Tag,
  Loader2
} from 'lucide-react';
// Import standardized components
import { AdminSectionHeader, AdminStatusBadge, AdminActionButton } from '../../../components/admin/AdminComponents';
import api from '../../../services/api';

const GlobalInventory = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('fr');
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [stats, setStats] = useState({ land: 0, realEstate: 0 });

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      title: "Inventaire Global",
      description: "Gérez toutes les propriétés et subdivisions de la plateforme.",
      totalProperties: "biens au total",
      
      // Tabs
      allInventory: "Tout l'Inventaire",
      pending: "En Attente",
      published: "Publié",
      sold: "Vendu",
      reserved: "Réservé",
      
      // Actions
      categories: "Catégories",
      newProperty: "Nouveau Bien",
      
      // Table headers
      propertyProduct: "Bien/Produit",
      location: "Localisation",
      finances: "Finances",
      owner: "Propriétaire",
      actions: "Actions",
      
      // Filters
      searchPlaceholder: "Rechercher par ville, titre ou propriétaire...",
      
      // Stats
      inventoryDistribution: "Distribution de l'Inventaire",
      rawLand: "Terre Brute",
      realEstate: "Immobilier",
      totalCatalogValue: "Valeur Totale du Catalogue",
      billion: "Milliard",
      properties: "biens",
      
      // Messages
      noProperties: "Aucun bien trouvé pour cette sélection.",
      loadingProperties: "Chargement des propriétés...",
      errorLoading: "Erreur de chargement",
      retry: "Réessayer",
      
      // Confirmations
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.",
      deleteError: "Erreur lors de la suppression",
      
      // Status labels
      statusPending: "En Attente",
      statusPublished: "Publié",
      statusSold: "Vendu",
      statusReserved: "Réservé",
      
      // Unknown
      unknown: "Inconnu",
      na: "N/A"
    },
    en: {
      title: "Global Inventory",
      description: "Manage all properties and subdivisions across the platform.",
      totalProperties: "properties in total",
      
      // Tabs
      allInventory: "All Inventory",
      pending: "Pending",
      published: "Published",
      sold: "Sold",
      reserved: "Reserved",
      
      // Actions
      categories: "Categories",
      newProperty: "New Property",
      
      // Table headers
      propertyProduct: "Property Product",
      location: "Location",
      finances: "Finances",
      owner: "Owner",
      actions: "Actions",
      
      // Filters
      searchPlaceholder: "Search by city, title or owner...",
      
      // Stats
      inventoryDistribution: "Inventory Distribution",
      rawLand: "Raw Land",
      realEstate: "Real Estate",
      totalCatalogValue: "Total Catalog Value",
      billion: "Billion",
      properties: "properties",
      
      // Messages
      noProperties: "No properties found for this selection.",
      loadingProperties: "Loading properties...",
      errorLoading: "Error loading",
      retry: "Retry",
      
      // Confirmations
      confirmDelete: "Are you sure you want to delete this property? This action is irreversible.",
      deleteError: "Error deleting property",
      
      // Status labels
      statusPending: "Pending",
      statusPublished: "Published",
      statusSold: "Sold",
      statusReserved: "Reserved",
      
      // Unknown
      unknown: "Unknown",
      na: "N/A"
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

  // Charger les propriétés depuis le backend
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (activeTab !== 'ALL') filters.status = activeTab;
      if (searchQuery) filters.search = searchQuery;
      
      const response = await api.getProperties(filters);
      setProperties(response.properties || []);
      setTotalValue(response.totalValue || 0);
      
      // Calculer les statistiques de distribution
      if (response.properties) {
        const landCount = response.properties.filter(p => p.category === 'Land').length;
        const realEstateCount = response.properties.filter(p => p.category === 'Real Estate').length;
        const total = response.properties.length;
        setStats({
          land: total > 0 ? Math.round((landCount / total) * 100) : 0,
          realEstate: total > 0 ? Math.round((realEstateCount / total) * 100) : 0
        });
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || t.errorLoading);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les propriétés quand les filtres changent
  useEffect(() => {
    fetchProperties();
  }, [activeTab, searchQuery, currentLang]);

  // Handlers pour les actions
  const handleDeleteProperty = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await api.deleteProperty(id);
        await fetchProperties(); // Rafraîchir la liste
      } catch (err) {
        console.error('Error deleting property:', err);
        alert(t.deleteError);
      }
    }
  };

  // ✅ Navigation vers le formulaire d'édition (comme les utilisateurs)
  const handleEditProperty = (id) => {
    navigate(`/dashboard/admin/properties/edit/${id}`);
  };

  // ✅ Navigation vers le formulaire de création (comme les utilisateurs)
  const handleCreateProperty = () => {
    navigate('/dashboard/admin/properties/new');
  };

  // ✅ Ouverture de la page publique du bien
  const handleViewProperty = (id) => {
    window.open(`/property/${id}`, '_blank');
  };

  // ✅ Navigation vers la gestion des catégories
  const handleCategories = () => {
    navigate('/dashboard/admin/categories');
  };

  // Formater le prix
  const formatPrice = (price) => {
    if (!price) return `0 FCFA`;
    if (typeof price === 'object') {
      return `${price.amount?.toLocaleString() || 0} ${price.currency || 'FCFA'}`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  // Formater la surface
  const formatSurface = (surface) => {
    if (!surface) return t.na;
    if (typeof surface === 'object') {
      return `${surface.value || 0}${surface.unit || 'm²'}`;
    }
    return `${surface} m²`;
  };

  // Obtenir l'initiale du propriétaire
  const getOwnerInitial = (owner) => {
    if (!owner?.name) return '?';
    return owner.name.charAt(0).toUpperCase();
  };

  // Tabs avec traduction
  const tabs = [
    { id: 'ALL', label: t.allInventory },
    { id: 'PENDING', label: t.pending },
    { id: 'PUBLISHED', label: t.published },
    { id: 'SOLD', label: t.sold },
    { id: 'RESERVED', label: t.reserved }
  ];

  // Affichage du loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">{t.loadingProperties}</p>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center max-w-md">
          <p className="font-bold">{t.errorLoading}</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchProperties}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <AdminSectionHeader 
          title={t.title} 
          description={`${t.description} (${properties.length} ${t.totalProperties})`} 
        />
        <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleCategories}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
                <Layers size={16} /> {t.categories}
            </button>
            <button 
              onClick={handleCreateProperty}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
            >
                <Plus size={16} /> {t.newProperty}
            </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-[#0a2619] text-[#c5a059]' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs focus:ring-2 focus:ring-[#c5a059]/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.propertyProduct}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.location}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.finances}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.owner}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {properties.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0a2619] border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                        {item.category === 'Land' ? <MapPin size={22} className="text-[#c5a059]" /> : <Home size={22} className="text-[#0a2619]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-[#0a2619] text-sm">{item.title}</p>
                           <AdminStatusBadge status={item.status} label={getStatusLabel(item.status)} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-xs font-bold text-slate-700">{item.location?.city || t.na}</p>
                      <p className="text-[9px] text-slate-400">{item.location?.district || ''} {item.location?.region || ''}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[#0a2619]">{formatPrice(item.price)}</span>
                      <span className="text-[10px] text-[#c5a059] font-bold uppercase">{formatSurface(item.surface)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 font-medium text-xs text-slate-600">
                        <div className="w-6 h-6 bg-[#0a2619] text-[#c5a059] rounded-full flex items-center justify-center text-[8px] font-black">
                          {getOwnerInitial(item.owner)}
                        </div>
                        {item.owner?.name || t.unknown}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                        <AdminActionButton icon={Edit} onClick={() => handleEditProperty(item._id || item.id)} />
                        <AdminActionButton icon={Trash2} variant="danger" onClick={() => handleDeleteProperty(item._id || item.id)} />
                        <AdminActionButton icon={ExternalLink} variant="primary" onClick={() => handleViewProperty(item._id || item.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium italic">
              {t.noProperties}
            </div>
          )}
        </div>
      </div>

      {/* CATALOG VALUE DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f1f5f9] p-8 rounded-[2.5rem] border border-slate-200">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">{t.inventoryDistribution}</h4>
             <div className="flex gap-4">
                 <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                     <p className="text-2xl font-black text-[#0a2619]">{stats.land}%</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">{t.rawLand}</p>
                 </div>
                 <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                     <p className="text-2xl font-black text-[#0a2619]">{stats.realEstate}%</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">{t.realEstate}</p>
                 </div>
             </div>
          </div>
          <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t.totalCatalogValue}</p>
                <h3 className="text-3xl font-black">
                  {(totalValue / 1000000).toFixed(1)} {t.billion}
                  <span className="text-xs font-normal opacity-50 ml-1">FCFA</span>
                </h3>
                <p className="text-xs text-white/40 mt-1">{properties.length} {t.properties}</p>
            </div>
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <Tag size={32} className="text-[#c5a059]" />
            </div>
          </div>
      </div>
    </div>
  );
};

export default GlobalInventory;