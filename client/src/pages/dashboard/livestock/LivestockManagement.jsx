// frontend/src/pages/dashboard/livestock/LivestockManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Pencil, Trash2, Eye, Loader2, 
  PawPrint, DollarSign, MapPin, Calendar,
  X, CheckCircle2, AlertCircle
} from 'lucide-react';
import api from '../../../services/api';

const LivestockManagement = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('fr');
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // ✅ Catégories dynamiques chargées depuis l'API
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // ✅ Form data
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: { city: '', region: '' },
    price: { amount: '', currency: 'FCFA' },
    roi: '',
    capacity: { value: 1, unit: 'heads' },
    cycleDuration: '',
    description: '',
    features: {
      hasWaterSupply: false,
      hasElectricity: false,
      hasVeterinaryAccess: false,
      hasFeedStorage: false
    },
    images: [],
    status: 'AVAILABLE'
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      title: "Gestion d'Élevage",
      subtitle: "Gérez vos actifs d'élevage",
      addLivestock: "Ajouter un Élevage",
      noLivestock: "Aucun élevage pour le moment",
      noLivestockDesc: "Commencez par ajouter votre premier animal",
      addFirstLivestock: "Ajouter Votre Premier Élevage",
      
      // Modal
      editLivestock: "Modifier l'Élevage",
      addNewLivestock: "Ajouter un Nouvel Élevage",
      title: "Titre *",
      category: "Catégorie *",
      selectCategory: "Sélectionner une catégorie",
      loadingCategories: "Chargement des catégories...",
      city: "Ville",
      region: "Région",
      capacity: "Capacité (têtes) *",
      priceAmount: "Montant du Prix *",
      roi: "ROI (%)",
      cycleDuration: "Durée du Cycle",
      status: "Statut",
      description: "Description",
      features: "Caractéristiques",
      waterSupply: "Alimentation en Eau",
      electricity: "Électricité",
      veterinaryAccess: "Accès Vétérinaire",
      feedStorage: "Stockage d'Aliments",
      images: "Images (max 10)",
      cancel: "Annuler",
      update: "Mettre à Jour",
      create: "Créer",
      
      // Status
      available: "Disponible",
      reserved: "Réservé",
      sold: "Vendu",
      
      // Labels
      capacity: "Capacité",
      price: "Prix",
      roi: "ROI",
      
      // Errors
      errorLoad: "Échec du chargement des données d'élevage",
      errorSave: "Échec de l'enregistrement de l'élevage",
      errorDelete: "Échec de la suppression de l'élevage",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cet élevage ?",
      maxImages: "Maximum 10 images autorisées",
      errorUpload: "Erreur lors du téléchargement des images",
      
      // Placeholders
      titlePlaceholder: "ex: Troupeau de Bovins Brahman",
      cityPlaceholder: "ex: Douala",
      regionPlaceholder: "ex: Littoral",
      pricePlaceholder: "500000",
      roiPlaceholder: "12.5",
      cyclePlaceholder: "ex: 6 mois",
      descriptionPlaceholder: "Décrivez votre élevage...",
      
      // Units
      heads: "têtes",
      animals: "animaux"
    },
    en: {
      title: "Livestock Management",
      subtitle: "Manage your livestock assets",
      addLivestock: "Add Livestock",
      noLivestock: "No livestock yet",
      noLivestockDesc: "Start by adding your first animal",
      addFirstLivestock: "Add Your First Livestock",
      
      // Modal
      editLivestock: "Edit Livestock",
      addNewLivestock: "Add New Livestock",
      title: "Title *",
      category: "Category *",
      selectCategory: "Select category",
      loadingCategories: "Loading categories...",
      city: "City",
      region: "Region",
      capacity: "Capacity (heads) *",
      priceAmount: "Price Amount *",
      roi: "ROI (%)",
      cycleDuration: "Cycle Duration",
      status: "Status",
      description: "Description",
      features: "Features",
      waterSupply: "Water Supply",
      electricity: "Electricity",
      veterinaryAccess: "Veterinary Access",
      feedStorage: "Feed Storage",
      images: "Images (max 10)",
      cancel: "Cancel",
      update: "Update",
      create: "Create",
      
      // Status
      available: "Available",
      reserved: "Reserved",
      sold: "Sold",
      
      // Labels
      capacity: "Capacity",
      price: "Price",
      roi: "ROI",
      
      // Errors
      errorLoad: "Failed to load livestock data",
      errorSave: "Failed to save livestock",
      errorDelete: "Failed to delete livestock",
      confirmDelete: "Are you sure you want to delete this livestock?",
      maxImages: "Maximum 10 images allowed",
      errorUpload: "Error uploading images",
      
      // Placeholders
      titlePlaceholder: "e.g., Brahman Cattle Herd",
      cityPlaceholder: "e.g., Douala",
      regionPlaceholder: "e.g., Littoral",
      pricePlaceholder: "500000",
      roiPlaceholder: "12.5",
      cyclePlaceholder: "e.g., 6 months",
      descriptionPlaceholder: "Describe your livestock...",
      
      // Units
      heads: "heads",
      animals: "animals"
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

  // ✅ Statuts correspondant au backend avec traduction
  const statuses = [
    { value: 'AVAILABLE', label: t.available, color: 'text-green-600' },
    { value: 'RESERVED', label: t.reserved, color: 'text-orange-600' },
    { value: 'SOLD', label: t.sold, color: 'text-red-600' }
  ];

  // ✅ Détection de l'environnement (local vs production)
  const isDevelopment = typeof window !== 'undefined' && 
                        (window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1');

  const BACKEND_URL = isDevelopment 
    ? 'http://localhost:5000'
    : 'https://property-cameroon-backend.vercel.app';

  // 📸 Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (image) => {
    if (!image) return null;
    
    // ✅ Déjà une URL complète (Vercel Blob ou externe)
    if (image.startsWith('http')) return image;
    
    // ✅ Chemin local commençant par /uploads
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    
    // ✅ Sinon, on construit le chemin complet
    return `${BACKEND_URL}/uploads/livestock/${image}`;
  };

  // ✅ Mapping des icônes par catégorie
  const getCategoryIcon = (slug) => {
    const iconMap = {
      cattle: '🐄',
      poultry: '🐔',
      pigs: '🐷',
      aquaculture: '🐟'
    };
    return iconMap[slug] || '🐄';
  };

  // ✅ Obtenir le label de la catégorie
  const getCategoryLabel = (slug) => {
    const cat = categories.find(c => c.value === slug);
    return cat ? cat.label : slug;
  };

  // ✅ Charger les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.getAllLivestockCategories({ isActive: true });
      const cats = response.categories || [];
      
      const formattedCats = cats.map(cat => ({
        value: cat.slug,
        label: cat.title,
        icon: getCategoryIcon(cat.slug)
      }));
      
      setCategories(formattedCats);
      console.log('📋 Categories loaded:', formattedCats);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback sur les catégories par défaut
      setCategories([
        { value: 'cattle', label: 'Cattle', icon: '🐄' },
        { value: 'poultry', label: 'Poultry', icon: '🐔' },
        { value: 'pigs', label: 'Pigs', icon: '🐷' },
        { value: 'aquaculture', label: 'Aquaculture', icon: '🐟' }
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // ✅ Charger les livestock
  const fetchLivestock = async () => {
    try {
      setLoading(true);
      const response = await api.getAllLivestock();
      const items = response.items || response.livestock || [];
      setLivestock(items);
    } catch (err) {
      console.error('Error fetching livestock:', err);
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivestock();
    fetchCategories();
  }, [currentLang]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        features: { ...prev.features, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      alert(t.maxImages);
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadFormData = new FormData();
      files.forEach(file => uploadFormData.append('images', file));
      
      const response = await fetch(`${BACKEND_URL}/api/upload/livestock-images`, {
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
      setUploading(false);
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
    setLoading(true);
    
    try {
      const submitData = {
        title: formData.title,
        category: formData.category,
        location: {
          city: formData.location.city,
          region: formData.location.region
        },
        price: {
          amount: parseFloat(formData.price.amount),
          currency: formData.price.currency || 'FCFA'
        },
        roi: formData.roi ? parseFloat(formData.roi) : 0,
        capacity: {
          value: parseInt(formData.capacity.value),
          unit: formData.capacity.unit
        },
        cycleDuration: formData.cycleDuration || null,
        description: formData.description,
        features: formData.features,
        images: formData.images,
        status: formData.status
      };
      
      if (editingItem) {
        await api.updateLivestock(editingItem._id, submitData);
      } else {
        await api.createLivestock(submitData);
      }
      
      setShowModal(false);
      resetForm();
      fetchLivestock();
    } catch (err) {
      console.error('Error saving livestock:', err);
      setError(t.errorSave);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    
    try {
      await api.deleteLivestock(id);
      fetchLivestock();
    } catch (err) {
      console.error('Error deleting livestock:', err);
      setError(t.errorDelete);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      location: { city: '', region: '' },
      price: { amount: '', currency: 'FCFA' },
      roi: '',
      capacity: { value: 1, unit: 'heads' },
      cycleDuration: '',
      description: '',
      features: {
        hasWaterSupply: false,
        hasElectricity: false,
        hasVeterinaryAccess: false,
        hasFeedStorage: false
      },
      images: [],
      status: 'AVAILABLE'
    });
    setImageFiles([]);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || '',
      location: item.location || { city: '', region: '' },
      price: item.price || { amount: '', currency: 'FCFA' },
      roi: item.roi || '',
      capacity: item.capacity || { value: 1, unit: 'heads' },
      cycleDuration: item.cycleDuration || '',
      description: item.description || '',
      features: item.features || {
        hasWaterSupply: false,
        hasElectricity: false,
        hasVeterinaryAccess: false,
        hasFeedStorage: false
      },
      images: item.images || [],
      status: item.status || 'AVAILABLE'
    });
    setShowModal(true);
  };

  if (loading && livestock.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#0a2619] italic">{t.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a2619] text-[#c5a059] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a3d2a] transition-colors"
        >
          <Plus size={16} /> {t.addLivestock}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Livestock Grid */}
      {livestock.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center">
          <PawPrint size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">{t.noLivestock}</h3>
          <p className="text-slate-400 text-sm mb-6">{t.noLivestockDesc}</p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a2619] text-[#c5a059] rounded-xl text-xs font-black uppercase tracking-widest"
          >
            <Plus size={16} /> {t.addFirstLivestock}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livestock.map((item) => {
            const categoryIcon = getCategoryIcon(item.category);
            return (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                {item.images && item.images[0] && (
                  <img
                    src={getImageUrl(item.images[0])}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                    <span className="text-xl">{categoryIcon}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-2 capitalize">{getCategoryLabel(item.category)}</p>
                  <p className="text-slate-600 text-sm mb-3">{item.description?.substring(0, 100)}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">{t.capacity}</p>
                      <p className="font-bold text-slate-800">{item.capacity?.value} {item.capacity?.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.price}</p>
                      <p className="font-bold text-[#c5a059]">{item.price?.amount?.toLocaleString()} {item.price?.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.roi}</p>
                      <p className="font-bold text-green-600">+{item.roi || 0}%</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      <Pencil size={14} className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
              <h2 className="text-xl font-serif text-[#0a2619] italic">
                {editingItem ? t.editLivestock : t.addNewLivestock}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.title}</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  placeholder={t.titlePlaceholder}
                />
              </div>

              {/* Category - Dynamique depuis l'API */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.category}</label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl">
                    <Loader2 size={16} className="animate-spin text-[#c5a059]" />
                    <span className="text-xs text-slate-400">{t.loadingCategories}</span>
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  >
                    <option value="">{t.selectCategory}</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.city}</label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder={t.cityPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.region}</label>
                  <input
                    type="text"
                    name="location.region"
                    value={formData.location.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder={t.regionPlaceholder}
                  />
                </div>
              </div>

              {/* Capacity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.capacity}</label>
                  <input
                    type="number"
                    name="capacity.value"
                    value={formData.capacity.value}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.priceAmount}</label>
                  <input
                    type="number"
                    name="price.amount"
                    value={formData.price.amount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder={t.pricePlaceholder}
                  />
                </div>
              </div>

              {/* ROI & Cycle Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.roi}</label>
                  <input
                    type="number"
                    name="roi"
                    value={formData.roi}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder={t.roiPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.cycleDuration}</label>
                  <input
                    type="text"
                    name="cycleDuration"
                    value={formData.cycleDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder={t.cyclePlaceholder}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.status}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
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
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] resize-none"
                  placeholder={t.descriptionPlaceholder}
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 mb-2">{t.features}</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasWaterSupply"
                      checked={formData.features.hasWaterSupply}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">{t.waterSupply}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasElectricity"
                      checked={formData.features.hasElectricity}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">{t.electricity}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasVeterinaryAccess"
                      checked={formData.features.hasVeterinaryAccess}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">{t.veterinaryAccess}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasFeedStorage"
                      checked={formData.features.hasFeedStorage}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">{t.feedStorage}</span>
                  </label>
                </div>
              </div>

              {/* Images section */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.images}</label>
                <div className="flex gap-3 flex-wrap">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={getImageUrl(img)} alt={`Livestock ${idx}`} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#c5a059]">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
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
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-[#0a2619] text-[#c5a059] rounded-xl font-black uppercase text-[11px] flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
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

export default LivestockManagement;