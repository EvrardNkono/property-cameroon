import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [stats, setStats] = useState({ land: 0, realEstate: 0 });

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
      setError(err.message || 'Erreur lors du chargement des propriétés');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les propriétés quand les filtres changent
  useEffect(() => {
    fetchProperties();
  }, [activeTab, searchQuery]);

  // Handlers pour les actions
  const handleDeleteProperty = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.')) {
      try {
        await api.deleteProperty(id);
        await fetchProperties(); // Rafraîchir la liste
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEditProperty = (id) => {
    // À implémenter - ouvrir modal d'édition
    console.log('Edit property:', id);
  };

  const handleViewProperty = (id) => {
    // À implémenter - voir les détails
    console.log('View property:', id);
  };

  const handleCreateProperty = () => {
    // À implémenter - ouvrir modal de création
    console.log('Create new property');
  };

  const handleCategories = () => {
    console.log('Open categories');
  };

  // Formater le prix
  const formatPrice = (price) => {
    if (!price) return '0 FCFA';
    if (typeof price === 'object') {
      return `${price.amount.toLocaleString()} ${price.currency || 'FCFA'}`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  // Formater la surface
  const formatSurface = (surface) => {
    if (!surface) return 'N/A';
    if (typeof surface === 'object') {
      return `${surface.value}${surface.unit || 'm²'}`;
    }
    return `${surface} m²`;
  };

  // Affichage du loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Chargement des propriétés...</p>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center max-w-md">
          <p className="font-bold">Erreur de chargement</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchProperties}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Réessayer
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
          title="Global Inventory" 
          description={`Manage all properties and subdivisions across the platform. (${properties.length} biens au total)`} 
        />
        <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleCategories}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
                <Layers size={16} /> Categories
            </button>
            <button 
              onClick={handleCreateProperty}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
            >
                <Plus size={16} /> New Property
            </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Inventory' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'PUBLISHED', label: 'Published' },
            { id: 'SOLD', label: 'Sold' },
            { id: 'RESERVED', label: 'Reserved' }
          ].map((tab) => (
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
            placeholder="Search by city, title or owner..."
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Finances</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
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
                           <AdminStatusBadge status={item.status} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-xs font-bold text-slate-700">{item.location?.city || 'N/A'}</p>
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
                          {item.owner?.name?.charAt(0) || '?'}
                        </div>
                        {item.owner?.name || 'Inconnu'}
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
              No properties found for this selection.
            </div>
          )}
        </div>
      </div>

      {/* CATALOG VALUE DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f1f5f9] p-8 rounded-[2.5rem] border border-slate-200">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Inventory Distribution</h4>
             <div className="flex gap-4">
                 <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                     <p className="text-2xl font-black text-[#0a2619]">{stats.land}%</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Raw Land</p>
                 </div>
                 <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                     <p className="text-2xl font-black text-[#0a2619]">{stats.realEstate}%</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Real Estate</p>
                 </div>
             </div>
          </div>
          <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Catalog Value</p>
                <h3 className="text-3xl font-black">
                  {(totalValue / 1000000).toFixed(1)} Billion 
                  <span className="text-xs font-normal opacity-50 ml-1">FCFA</span>
                </h3>
                <p className="text-xs text-white/40 mt-1">{properties.length} biens</p>
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