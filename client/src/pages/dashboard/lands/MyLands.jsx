// frontend/src/pages/dashboard/properties/MyLands.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Plus, MapPin, Maximize2, CheckCircle2, Clock, MoreVertical, Search, 
  Loader2, FileText, Eye, Trash2, Edit3, Image as ImageIcon, Shield
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const MyLands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('fr');
  const { activeRoles } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lands, setLands] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const isAdmin = activeRoles?.includes('ADMIN');

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      title: "GESTION DES PROPRIÉTÉS",
      titleUser: "MES PROPRIÉTÉS",
      adminBadge: "Admin",
      subtitle: "Gérez toutes les propriétés — approuvez, publiez ou supprimez.",
      subtitleUser: "Gérez vos propriétés et suivez l'état de vos titres fonciers.",
      propertiesFound: "propriété{plural} trouvée{plural}",
      addProperty: "AJOUTER UNE PROPRIÉTÉ",
      
      // Search
      searchPlaceholder: "Rechercher par titre, ville, district...",
      
      // Status
      all: "TOUS",
      pending: "EN ATTENTE",
      published: "PUBLIÉ",
      reserved: "RÉSERVÉ",
      sold: "VENDU",
      
      // Labels
      unknownLocation: "Localisation inconnue",
      viewDocuments: "Voir les Documents",
      approvePublish: "Approuver & Publier",
      
      // Messages
      noProperties: "Aucune propriété trouvée",
      addPropertyLink: "Ajouter une propriété",
      loadingProperties: "Chargement des propriétés...",
      loadingError: "Erreur de chargement",
      tryAgain: "Réessayer",
      
      // Menu
      edit: "Modifier",
      changeStatus: "Changer le Statut",
      delete: "Supprimer",
      
      // Confirmations
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.",
      deleteError: "Erreur lors de la suppression",
      statusError: "Erreur lors de la mise à jour du statut",
      
      // Status labels
      statusPublished: "Publié",
      statusPending: "En Attente",
      statusSold: "Vendu",
      statusReserved: "Réservé"
    },
    en: {
      title: "PROPERTIES MANAGEMENT",
      titleUser: "MY PROPERTIES",
      adminBadge: "Admin",
      subtitle: "Manage all properties — approve, publish or delete.",
      subtitleUser: "Manage your properties and track your land titles status.",
      propertiesFound: "propert{plural} found",
      addProperty: "ADD PROPERTY",
      
      // Search
      searchPlaceholder: "Search by title, city, district...",
      
      // Status
      all: "ALL",
      pending: "PENDING",
      published: "PUBLISHED",
      reserved: "RESERVED",
      sold: "SOLD",
      
      // Labels
      unknownLocation: "Unknown location",
      viewDocuments: "View Documents",
      approvePublish: "Approve & Publish",
      
      // Messages
      noProperties: "No properties found",
      addPropertyLink: "Add a property",
      loadingProperties: "Loading properties...",
      loadingError: "Loading error",
      tryAgain: "Try Again",
      
      // Menu
      edit: "Edit",
      changeStatus: "Change Status",
      delete: "Delete",
      
      // Confirmations
      confirmDelete: "Are you sure you want to delete this property? This action is irreversible.",
      deleteError: "Error deleting property",
      statusError: "Error updating status",
      
      // Status labels
      statusPublished: "Published",
      statusPending: "Pending",
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
      'PUBLISHED': t.statusPublished,
      'PENDING': t.statusPending,
      'SOLD': t.statusSold,
      'RESERVED': t.statusReserved
    };
    return statusMap[status] || status;
  };

  // Filtres avec traduction
  const statusFilters = [
    { id: 'ALL', label: t.all },
    { id: 'PENDING', label: t.pending },
    { id: 'PUBLISHED', label: t.published },
    { id: 'RESERVED', label: t.reserved },
    { id: 'SOLD', label: t.sold }
  ];

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      let properties = [];

      if (isAdmin) {
        // Admin voit TOUTES les propriétés
        const response = await api.getProperties({ status: statusFilter !== 'ALL' ? statusFilter : undefined });
        properties = response.properties || [];
      } else if (user && user._id) {
        const response = await api.getPropertiesByOwner(user._id);
        properties = response.properties || [];
      }

      setLands(properties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || t.loadingError);
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, [isAdmin, statusFilter, currentLang]);

  // Changer le statut d'une propriété (admin seulement)
  const handleStatusChange = async (landId, newStatus) => {
    try {
      setUpdatingStatus(landId);
      await api.updateProperty(landId, { status: newStatus });
      setLands(prev => prev.map(l => l._id === landId ? { ...l, status: newStatus } : l));
      setShowMenu(null);
    } catch (err) {
      console.error('Error updating status:', err);
      alert(t.statusError);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredLands = lands.filter(land => {
    const matchesSearch = land.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.location?.district?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatPrice = (price) => {
    if (!price) return '0 FCFA';
    const amount = typeof price === 'object' ? price.amount : price;
    const currency = typeof price === 'object' ? (price.currency || 'FCFA') : 'FCFA';
    return `${Number(amount).toLocaleString()} ${currency}`;
  };

  const formatSurface = (surface) => {
    if (!surface) return 'N/A';
    const value = typeof surface === 'object' ? surface.value : surface;
    const unit = typeof surface === 'object' ? surface.unit : 'm²';
    return `${value} ${unit}`;
  };

  const getLocationString = (location) => {
    if (!location) return t.unknownLocation;
    const parts = [location.city, location.district].filter(Boolean);
    return parts.join(', ') || t.unknownLocation;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'PUBLISHED': { label: getStatusLabel('PUBLISHED'), color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} /> },
      'PENDING':   { label: getStatusLabel('PENDING'),   color: 'bg-orange-100 text-orange-700', icon: <Clock size={12} /> },
      'SOLD':      { label: getStatusLabel('SOLD'),      color: 'bg-gray-100 text-gray-700',   icon: <CheckCircle2 size={12} /> },
      'RESERVED':  { label: getStatusLabel('RESERVED'),  color: 'bg-blue-100 text-blue-700',   icon: <Clock size={12} /> }
    };
    return statusMap[status] || { label: status, color: 'bg-slate-100 text-slate-700', icon: <Clock size={12} /> };
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    const base = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://property-cameroon-backend.vercel.app';
    if (image.startsWith('/uploads')) return `${base}${image}`;
    return `${base}/uploads/properties/${image}`;
  };

  const handleAddProperty = () => {
    navigate(isAdmin ? '/dashboard/admin/properties/new' : '/dashboard/properties/new');
  };

  const handleEditProperty = (landId) => {
    navigate(isAdmin ? `/dashboard/admin/properties/edit/${landId}` : `/dashboard/properties/edit/${landId}`);
  };

  const handleDeleteProperty = async (landId) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await api.deleteProperty(landId);
        await fetchMyProperties();
        setShowMenu(null);
      } catch (err) {
        console.error('Error deleting property:', err);
        alert(t.deleteError);
      }
    }
  };

  // Obtenir le message de propriétés trouvées
  const getPropertiesMessage = (count) => {
    const msg = t.propertiesFound
      .replace('{plural}', count > 1 ? 's' : '')
      .replace('{plural}', count > 1 ? 'ies' : 'y');
    return msg;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">{t.loadingProperties}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center max-w-md">
          <p className="font-bold">{t.loadingError}</p>
          <p className="text-sm mt-1">{error}</p>
          <button onClick={fetchMyProperties} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors">
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter">
              {isAdmin ? t.title : t.titleUser}
            </h1>
            {isAdmin && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                <Shield size={10} /> {t.adminBadge}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">
            {isAdmin ? t.subtitle : t.subtitleUser}
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✅ {filteredLands.length} {getPropertiesMessage(filteredLands.length)}
          </p>
        </div>

        <button
          onClick={handleAddProperty}
          className="flex items-center justify-center gap-2 bg-[#c5a059] text-[#0a2619] font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-[#b08d4a] transition-all transform hover:scale-105 text-sm"
        >
          <Plus size={20} /> {t.addProperty}
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filtre statut */}
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(s => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === s.id
                  ? 'bg-[#0a2619] text-[#c5a059]'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLands.map((land) => {
          const statusInfo = getStatusInfo(land.status);
          const imageUrl = land.images && land.images[0] ? getImageUrl(land.images[0]) : null;

          return (
            <div key={land._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-[#0a2619] to-[#1a3d2a] relative">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={land.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                {!imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon size={48} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${statusInfo.color}`}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xl font-black">{formatPrice(land.price)}</p>
                </div>

                {/* Owner info (admin only) */}
                {isAdmin && land.owner && (
                  <div className="absolute bottom-4 right-4 text-white/70 text-[9px] text-right">
                    <p>{land.owner.name || land.owner.email}</p>
                  </div>
                )}

                {/* Menu */}
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === land._id ? null : land._id)}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      {updatingStatus === land._id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <MoreVertical size={20} />
                      }
                    </button>

                    {showMenu === land._id && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                        <button
                          onClick={() => handleEditProperty(land._id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit3 size={14} /> {t.edit}
                        </button>

                        {/* Actions admin : changer le statut */}
                        {isAdmin && (
                          <>
                            <div className="px-4 py-1 text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">
                              {t.changeStatus}
                            </div>
                            {['PUBLISHED', 'PENDING', 'RESERVED', 'SOLD'].map(s => {
                              const statusLabel = getStatusLabel(s);
                              return (
                                land.status !== s && (
                                  <button
                                    key={s}
                                    onClick={() => handleStatusChange(land._id, s)}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 ${
                                      s === 'PUBLISHED' ? 'text-green-600' :
                                      s === 'PENDING'   ? 'text-orange-500' :
                                      s === 'RESERVED'  ? 'text-blue-600'  : 'text-gray-600'
                                    }`}
                                  >
                                    <CheckCircle2 size={14} /> → {statusLabel}
                                  </button>
                                )
                              );
                            })}
                            <div className="border-t border-slate-100 mt-1" />
                          </>
                        )}

                        <button
                          onClick={() => handleDeleteProperty(land._id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> {t.delete}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 className="font-bold text-[#0a2619] text-lg leading-tight mb-1">{land.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                  <MapPin size={14} className="text-[#c5a059]" />
                  {getLocationString(land.location)}
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#c5a059]">
                      <Maximize2 size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{formatSurface(land.surface)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#c5a059]">
                      <FileText size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 uppercase leading-none">{land.category}</span>
                  </div>
                </div>

                {/* Bouton publier rapide pour l'admin si PENDING */}
                {isAdmin && land.status === 'PENDING' && (
                  <button
                    onClick={() => handleStatusChange(land._id, 'PUBLISHED')}
                    disabled={updatingStatus === land._id}
                    className="w-full mt-2 py-3 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {updatingStatus === land._id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <CheckCircle2 size={14} />
                    }
                    {t.approvePublish}
                  </button>
                )}

                {(!isAdmin || land.status !== 'PENDING') && (
                  <button
                    onClick={() => navigate(`/dashboard/documents?property=${land._id}`)}
                    className="w-full mt-2 py-3 bg-[#0a2619] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
                  >
                    {t.viewDocuments}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLands.length === 0 && (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100">
          <p className="text-slate-400 font-medium">{t.noProperties}</p>
          <button onClick={handleAddProperty} className="mt-4 text-[#c5a059] font-bold text-sm hover:underline">
            {t.addPropertyLink}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyLands;