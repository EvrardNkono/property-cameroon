// frontend/src/pages/dashboard/admin/LivestockAssetsManager.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, Loader2, 
  Fish, Bird, Database, Leaf, MapPin, DollarSign, 
  X, CheckCircle2, AlertCircle, Package, 
  TrendingUp, Store, Truck, Search, Filter } from 'lucide-react';
import api from '../../../services/api';

/**
 * Composant Admin pour la gestion des actifs d'élevage
 * Version complète avec gestion des actifs d'élevage
 */
const LivestockAssetsManager = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('fr');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      title: "Actifs d'Élevage",
      subtitle: "Gérez tous les actifs d'élevage (Admin)",
      addAsset: "Ajouter un Actif",
      searchPlaceholder: "Rechercher par nom, espèce, région...",
      allCategories: "Toutes les Catégories",
      allStatus: "Tous les Statuts",
      assetsFound: "actif(s) trouvé(s)",
      noAssets: "Aucun actif d'élevage trouvé",
      noResults: "Aucun résultat pour",
      clearSearch: "Effacer la recherche",
      addFirstAsset: "Ajouter Votre Premier Actif",
      
      // Categories
      categoryFish: "Poisson",
      categoryBird: "Volaille",
      categoryLivestock: "Élevage",
      categoryGeneral: "Général",
      
      // Status
      statusPending: "En Attente",
      statusPublished: "Publié",
      statusReserved: "Réservé",
      statusSold: "Vendu",
      
      // Modal
      editAsset: "Modifier l'Actif",
      addNewAsset: "Ajouter un Nouvel Actif",
      name: "Nom *",
      species: "Espèce *",
      category: "Catégorie *",
      selectCategory: "Sélectionner une catégorie",
      region: "Région *",
      city: "Ville",
      price: "Prix (FCFA) *",
      quantity: "Quantité *",
      unit: "Unité",
      description: "Description *",
      features: "Caractéristiques (séparées par des virgules)",
      status: "Statut",
      images: "Images (max 10)",
      
      // Labels
      priceLabel: "Prix",
      quantityLabel: "Quantité",
      originLabel: "Origine",
      categoryLabel: "Catégorie",
      actions: "Actions",
      
      // Buttons
      edit: "Modifier",
      delete: "Supprimer",
      view: "Voir",
      cancel: "Annuler",
      update: "Mettre à Jour",
      create: "Créer",
      
      // Errors
      errorLoad: "Échec du chargement des actifs d'élevage",
      errorSave: "Échec de l'enregistrement de l'actif",
      errorDelete: "Échec de la suppression de l'actif",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cet actif ?",
      maxImages: "Maximum 10 images autorisées",
      errorUpload: "Erreur lors du téléchargement des images",
      
      // Placeholders
      namePlaceholder: "ex: Tilapia, Poulet de chair...",
      speciesPlaceholder: "ex: Oreochromis niloticus",
      regionPlaceholder: "ex: Centre, Littoral...",
      cityPlaceholder: "ex: Yaoundé, Douala...",
      pricePlaceholder: "1000",
      quantityPlaceholder: "0",
      descriptionPlaceholder: "Décrivez votre actif d'élevage...",
      featuresPlaceholder: "Ex: Résistant, Croissance rapide, Adapté au climat...",
      
      // Units
      unitPiece: "Pièce",
      unitKg: "Kg",
      unitTon: "Tonne",
      unitHead: "Tête",
      unitPair: "Paire"
    },
    en: {
      title: "Livestock Assets",
      subtitle: "Manage all livestock assets (Admin)",
      addAsset: "Add Asset",
      searchPlaceholder: "Search by name, species, region...",
      allCategories: "All Categories",
      allStatus: "All Status",
      assetsFound: "asset(s) found",
      noAssets: "No livestock assets found",
      noResults: "No results for",
      clearSearch: "Clear search",
      addFirstAsset: "Add Your First Asset",
      
      // Categories
      categoryFish: "Fish",
      categoryBird: "Poultry",
      categoryLivestock: "Livestock",
      categoryGeneral: "General",
      
      // Status
      statusPending: "Pending",
      statusPublished: "Published",
      statusReserved: "Reserved",
      statusSold: "Sold",
      
      // Modal
      editAsset: "Edit Asset",
      addNewAsset: "Add New Asset",
      name: "Name *",
      species: "Species *",
      category: "Category *",
      selectCategory: "Select category",
      region: "Region *",
      city: "City",
      price: "Price (FCFA) *",
      quantity: "Quantity *",
      unit: "Unit",
      description: "Description *",
      features: "Features (comma separated)",
      status: "Status",
      images: "Images (max 10)",
      
      // Labels
      priceLabel: "Price",
      quantityLabel: "Quantity",
      originLabel: "Origin",
      categoryLabel: "Category",
      actions: "Actions",
      
      // Buttons
      edit: "Edit",
      delete: "Delete",
      view: "View",
      cancel: "Cancel",
      update: "Update",
      create: "Create",
      
      // Errors
      errorLoad: "Failed to load livestock assets",
      errorSave: "Failed to save asset",
      errorDelete: "Failed to delete asset",
      confirmDelete: "Are you sure you want to delete this asset?",
      maxImages: "Maximum 10 images allowed",
      errorUpload: "Error uploading images",
      
      // Placeholders
      namePlaceholder: "e.g., Tilapia, Broiler chicken...",
      speciesPlaceholder: "e.g., Oreochromis niloticus",
      regionPlaceholder: "e.g., Center, Littoral...",
      cityPlaceholder: "e.g., Yaoundé, Douala...",
      pricePlaceholder: "1000",
      quantityPlaceholder: "0",
      descriptionPlaceholder: "Describe your livestock asset...",
      featuresPlaceholder: "e.g., Resistant, Fast growth, Climate adapted...",
      
      // Units
      unitPiece: "Piece",
      unitKg: "Kg",
      unitTon: "Ton",
      unitHead: "Head",
      unitPair: "Pair"
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

  // Categories avec traduction
  const categories = [
    { value: 'FISH', label: t.categoryFish, icon: <Fish size={16} /> },
    { value: 'BIRD', label: t.categoryBird, icon: <Bird size={16} /> },
    { value: 'LIVESTOCK', label: t.categoryLivestock, icon: <Database size={16} /> },
    { value: 'GENERAL', label: t.categoryGeneral, icon: <Leaf size={16} /> }
  ];

  // Status options avec traduction
  const statuses = [
    { value: 'PENDING', label: t.statusPending, color: 'text-orange-600 bg-orange-50' },
    { value: 'PUBLISHED', label: t.statusPublished, color: 'text-green-600 bg-green-50' },
    { value: 'RESERVED', label: t.statusReserved, color: 'text-blue-600 bg-blue-50' },
    { value: 'SOLD', label: t.statusSold, color: 'text-red-600 bg-red-50' }
  ];

  // Unit options avec traduction
  const unitOptions = [
    { value: 'piece', label: t.unitPiece },
    { value: 'kg', label: t.unitKg },
    { value: 'ton', label: t.unitTon },
    { value: 'head', label: t.unitHead },
    { value: 'pair', label: t.unitPair }
  ];

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    category: '',
    location: { region: '', city: '' },
    price: { amount: '', currency: 'FCFA' },
    quantity: 0,
    unit: 'piece',
    description: '',
    features: [],
    images: [],
    status: 'PENDING'
  });

  // Fonction pour obtenir l'icône de catégorie
  const getCategoryIcon = (category) => {
    const iconMap = {
      'FISH': <Fish size={20} className="text-emerald-600" />,
      'BIRD': <Bird size={20} className="text-amber-600" />,
      'LIVESTOCK': <Database size={20} className="text-blue-600" />,
      'GENERAL': <Leaf size={20} className="text-emerald-600" />
    };
    return iconMap[category] || <Leaf size={20} className="text-emerald-600" />;
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/livestock/${image}`;
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/livestock');
      setAssets(response.assets || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [currentLang]);

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': t.statusPending,
      'PUBLISHED': t.statusPublished,
      'RESERVED': t.statusReserved,
      'SOLD': t.statusSold
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'text-orange-600 bg-orange-50',
      'PUBLISHED': 'text-green-600 bg-green-50',
      'RESERVED': 'text-blue-600 bg-blue-50',
      'SOLD': 'text-red-600 bg-red-50'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-50';
  };

  const getCategoryLabel = (category) => {
    const catMap = {
      'FISH': t.categoryFish,
      'BIRD': t.categoryBird,
      'LIVESTOCK': t.categoryLivestock,
      'GENERAL': t.categoryGeneral
    };
    return catMap[category] || category;
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = filterCategory === 'ALL' || asset.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || asset.status === filterStatus;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location?.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData(prev => ({
          ...prev,
          [parts[0]]: { ...prev[parts[0]], [parts[1]]: value }
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeaturesChange = (e) => {
    const features = e.target.value.split(',').map(f => f.trim());
    setFormData({ ...formData, features });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      alert(t.maxImages);
      return;
    }
    
    setUploadingImages(true);
    
    try {
      const uploadFormData = new FormData();
      files.forEach(file => uploadFormData.append('images', file));
      
      const response = await fetch('http://localhost:5000/api/upload/livestock-images', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...result.images]
        }));
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      alert(t.errorUpload);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const submitData = {
        name: formData.name,
        species: formData.species,
        category: formData.category,
        location: formData.location,
        price: {
          amount: parseFloat(formData.price.amount),
          currency: formData.price.currency || 'FCFA'
        },
        quantity: parseInt(formData.quantity) || 0,
        unit: formData.unit,
        description: formData.description,
        features: formData.features,
        images: formData.images,
        status: formData.status
      };
      
      if (editingItem) {
        await api.put(`/livestock/${editingItem._id}`, submitData);
      } else {
        await api.post('/livestock', submitData);
      }
      
      setShowModal(false);
      resetForm();
      fetchAssets();
    } catch (err) {
      console.error('Error saving asset:', err);
      setError(t.errorSave);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await api.del(`/livestock/${id}`);
      fetchAssets();
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError(t.errorDelete);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      species: '',
      category: '',
      location: { region: '', city: '' },
      price: { amount: '', currency: 'FCFA' },
      quantity: 0,
      unit: 'piece',
      description: '',
      features: [],
      images: [],
      status: 'PENDING'
    });
    setSearchTerm('');
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      species: item.species || '',
      category: item.category || '',
      location: item.location || { region: '', city: '' },
      price: item.price || { amount: '', currency: 'FCFA' },
      quantity: item.quantity || 0,
      unit: item.unit || 'piece',
      description: item.description || '',
      features: item.features || [],
      images: item.images || [],
      status: item.status || 'PENDING'
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={48} className="text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-emerald-900">{t.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
        >
          <Plus size={16} /> {t.addAsset}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">{t.allCategories}</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">{t.allStatus}</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {filteredAssets.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center">
          <Leaf size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">{t.noAssets}</h3>
          <p className="text-slate-400 text-sm mb-6">
            {searchTerm ? `${t.noResults} "${searchTerm}"` : ''}
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-emerald-600 text-sm underline">
              {t.clearSearch}
            </button>
          )}
          {!searchTerm && (
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700"
            >
              <Plus size={16} /> {t.addFirstAsset}
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">{filteredAssets.length} {t.assetsFound}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                {asset.images && asset.images[0] && (
                  <img
                    src={getImageUrl(asset.images[0])}
                    alt={asset.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                    }}
                  />
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(asset.category)}
                      <h3 className="text-lg font-bold text-slate-800">{asset.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(asset.status)}`}>
                      {getStatusLabel(asset.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <MapPin size={14} />
                    <span>{asset.location?.region}, {asset.location?.city || 'Cameroon'}</span>
                  </div>
                  {asset.species && (
                    <p className="text-xs text-slate-400 mb-2">Espèce: {asset.species}</p>
                  )}
                  <p className="text-slate-500 text-sm mb-3 line-clamp-2">{asset.description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">{t.priceLabel}</p>
                      <p className="font-bold text-emerald-600">{asset.price?.amount?.toLocaleString()} {asset.price?.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.quantityLabel}</p>
                      <p className="font-bold text-slate-800">{asset.quantity} {asset.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.categoryLabel}</p>
                      <p className="font-bold text-slate-800 text-sm">{getCategoryLabel(asset.category)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Features</p>
                      <p className="font-bold text-slate-800 text-sm">{asset.features?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(asset)}
                      className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      <Pencil size={14} className="inline mr-1" /> {t.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(asset._id)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} className="inline mr-1" /> {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
              <h2 className="text-xl font-serif text-emerald-900">
                {editingItem ? t.editAsset : t.addNewAsset}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name and Species */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.name}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.species}</label>
                  <input
                    type="text"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.speciesPlaceholder}
                  />
                </div>
              </div>

              {/* Category and Region */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.category}</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">{t.selectCategory}</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.region}</label>
                  <input
                    type="text"
                    name="location.region"
                    value={formData.location.region}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.regionPlaceholder}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.city}</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={t.cityPlaceholder}
                />
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.price}</label>
                  <input
                    type="number"
                    name="price.amount"
                    value={formData.price.amount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.pricePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.quantity}</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.quantityPlaceholder}
                  />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.unit}</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {unitOptions.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.description}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder={t.descriptionPlaceholder}
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.features}</label>
                <input
                  type="text"
                  value={formData.features.join(', ')}
                  onChange={handleFeaturesChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={t.featuresPlaceholder}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.status}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.images}</label>
                <div className="flex gap-3 flex-wrap">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={getImageUrl(img)} alt={`Asset ${idx}`} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImages}
                    />
                    {uploadingImages ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[11px]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-xl font-black uppercase text-[11px] flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {editingItem ? t.update : t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestockAssetsManager;