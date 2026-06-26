// frontend/src/pages/dashboard/agricultural/AgriculturalManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Pencil, Trash2, Eye, Loader2, 
  Sprout, DollarSign, MapPin, Calendar,
  X, CheckCircle2, AlertCircle, Package, 
  TrendingUp, Store, Truck
} from 'lucide-react';
import api from '../../../services/api';

const AgriculturalManagement = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('fr');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      // Header
      title: "Produits Agricoles",
      subtitle: "Gérez vos produits agricoles et vos cultures",
      addProduct: "Ajouter un Produit",
      
      // Empty state
      noProducts: "Aucun produit pour le moment",
      noProductsDesc: "Commencez par ajouter votre premier produit agricole",
      addFirstProduct: "Ajouter Votre Premier Produit",
      
      // Modal
      editProduct: "Modifier le Produit",
      addNewProduct: "Ajouter un Nouveau Produit",
      productName: "Nom du Produit *",
      category: "Catégorie *",
      selectCategory: "Sélectionner une catégorie",
      price: "Prix *",
      unit: "Unité",
      origin: "Origine",
      stock: "Stock",
      harvestDate: "Date de Récolte",
      expiryDate: "Date d'Expiration",
      status: "Statut",
      description: "Description",
      certifications: "Certifications",
      images: "Images (max 10)",
      cancel: "Annuler",
      update: "Mettre à Jour",
      create: "Créer",
      
      // Buttons
      edit: "Modifier",
      delete: "Supprimer",
      
      // Status
      pending: "En Attente",
      published: "Publié",
      soldOut: "Épuisé",
      discontinued: "Abandonné",
      
      // Categories
      vegetables: "Légumes",
      livestock: "Élevage",
      spices: "Épices",
      processed: "Transformés",
      cereals: "Céréales",
      fruits: "Fruits",
      
      // Certifications
      organic: "Bio",
      fairTrade: "Commerce Équitable",
      rainforest: "Rainforest Alliance",
      utz: "Certifié UTZ",
      
      // Labels
      priceLabel: "Prix",
      unitStock: "Unité/Stock",
      originLabel: "Origine",
      certificationsLabel: "Certifications",
      
      // Errors
      errorLoad: "Échec du chargement des produits agricoles",
      errorSave: "Échec de l'enregistrement du produit",
      errorDelete: "Échec de la suppression du produit",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      maxImages: "Maximum 10 images autorisées",
      errorUpload: "Erreur lors du téléchargement des images",
      
      // Placeholders
      productNamePlaceholder: "ex: Tomates Bio, Maïs Frais...",
      originPlaceholder: "ex: Cameroun, France...",
      pricePlaceholder: "1000",
      descriptionPlaceholder: "Décrivez votre produit...",
      stockPlaceholder: "0",
      
      // Units
      kg: "Kg",
      ton: "Tonne",
      piece: "Pièce",
      bundle: "Bot",
      liter: "Litre"
    },
    en: {
      // Header
      title: "Agricultural Products",
      subtitle: "Manage your agricultural products and crops",
      addProduct: "Add Product",
      
      // Empty state
      noProducts: "No products yet",
      noProductsDesc: "Start by adding your first agricultural product",
      addFirstProduct: "Add Your First Product",
      
      // Modal
      editProduct: "Edit Product",
      addNewProduct: "Add New Product",
      productName: "Product Name *",
      category: "Category *",
      selectCategory: "Select category",
      price: "Price *",
      unit: "Unit",
      origin: "Origin",
      stock: "Stock",
      harvestDate: "Harvest Date",
      expiryDate: "Expiry Date",
      status: "Status",
      description: "Description",
      certifications: "Certifications",
      images: "Images (max 10)",
      cancel: "Cancel",
      update: "Update",
      create: "Create",
      
      // Buttons
      edit: "Edit",
      delete: "Delete",
      
      // Status
      pending: "Pending",
      published: "Published",
      soldOut: "Sold Out",
      discontinued: "Discontinued",
      
      // Categories
      vegetables: "Vegetables",
      livestock: "Livestock",
      spices: "Spices",
      processed: "Processed",
      cereals: "Cereals",
      fruits: "Fruits",
      
      // Certifications
      organic: "Organic",
      fairTrade: "Fair Trade",
      rainforest: "Rainforest Alliance",
      utz: "UTZ Certified",
      
      // Labels
      priceLabel: "Price",
      unitStock: "Unit/Stock",
      originLabel: "Origin",
      certificationsLabel: "Certifications",
      
      // Errors
      errorLoad: "Failed to load agricultural products",
      errorSave: "Failed to save product",
      errorDelete: "Failed to delete product",
      confirmDelete: "Are you sure you want to delete this product?",
      maxImages: "Maximum 10 images allowed",
      errorUpload: "Error uploading images",
      
      // Placeholders
      productNamePlaceholder: "e.g., Organic Tomatoes, Fresh Maize...",
      originPlaceholder: "e.g., Cameroon, France...",
      pricePlaceholder: "1000",
      descriptionPlaceholder: "Describe your product...",
      stockPlaceholder: "0",
      
      // Units
      kg: "Kg",
      ton: "Ton",
      piece: "Piece",
      bundle: "Bundle",
      liter: "Liter"
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

  // Categories list avec traduction
  const categories = [
    { value: 'Maraîcher', label: t.vegetables, icon: '🥬' },
    { value: 'Livestock', label: t.livestock, icon: '🐄' },
    { value: 'Spices', label: t.spices, icon: '🌶️' },
    { value: 'Transformation', label: t.processed, icon: '🏭' },
    { value: 'Cereals', label: t.cereals, icon: '🌾' },
    { value: 'Fruits', label: t.fruits, icon: '🍎' }
  ];

  // Status options avec traduction
  const statuses = [
    { value: 'PENDING', label: t.pending, color: 'text-orange-600' },
    { value: 'PUBLISHED', label: t.published, color: 'text-green-600' },
    { value: 'SOLD_OUT', label: t.soldOut, color: 'text-red-600' },
    { value: 'DISCONTINUED', label: t.discontinued, color: 'text-gray-500' }
  ];

  // Certification options avec traduction
  const certifications = [
    { value: 'organic', label: t.organic },
    { value: 'fair-trade', label: t.fairTrade },
    { value: 'rainforest', label: t.rainforest },
    { value: 'utZ', label: t.utz }
  ];

  // Unit options avec traduction
  const unitOptions = [
    { value: 'Kg', label: t.kg },
    { value: 'Ton', label: t.ton },
    { value: 'Piece', label: t.piece },
    { value: 'Bundle', label: t.bundle },
    { value: 'Liter', label: t.liter }
  ];

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: { amount: '', currency: 'FCFA' },
    unit: 'Kg',
    origin: '',
    stock: 0,
    description: '',
    images: [],
    certifications: [],
    harvestDate: '',
    expiryDate: '',
    status: 'PENDING'
  });

  // Get image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/agriculture/${image}`;
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agriculture/products');
      const items = response.products || [];
      setProducts(items);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentLang]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else if (type === 'checkbox' && name === 'certifications') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          certifications: [...prev.certifications, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          certifications: prev.certifications.filter(c => c !== value)
        }));
      }
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
      
      const response = await fetch('http://localhost:5000/api/upload/agriculture-images', {
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
        name: formData.name,
        category: formData.category,
        price: {
          amount: parseFloat(formData.price.amount),
          currency: formData.price.currency || 'FCFA'
        },
        unit: formData.unit,
        origin: formData.origin,
        stock: parseInt(formData.stock) || 0,
        description: formData.description,
        images: formData.images,
        certifications: formData.certifications,
        harvestDate: formData.harvestDate || null,
        expiryDate: formData.expiryDate || null,
        status: formData.status
      };
      
      if (editingItem) {
        await api.put(`/agriculture/products/${editingItem._id}`, submitData);
      } else {
        await api.post('/agriculture/products', submitData);
      }
      
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(t.errorSave);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    
    try {
      await api.del(`/agriculture/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(t.errorDelete);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: '',
      price: { amount: '', currency: 'FCFA' },
      unit: 'Kg',
      origin: '',
      stock: 0,
      description: '',
      images: [],
      certifications: [],
      harvestDate: '',
      expiryDate: '',
      status: 'PENDING'
    });
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || '',
      price: item.price || { amount: '', currency: 'FCFA' },
      unit: item.unit || 'Kg',
      origin: item.origin || '',
      stock: item.stock || 0,
      description: item.description || '',
      images: item.images || [],
      certifications: item.certifications || [],
      harvestDate: item.harvestDate ? item.harvestDate.split('T')[0] : '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      status: item.status || 'PENDING'
    });
    setShowModal(true);
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Maraîcher': '🥬',
      'Livestock': '🐄',
      'Spices': '🌶️',
      'Transformation': '🏭',
      'Cereals': '🌾',
      'Fruits': '🍎'
    };
    return iconMap[category] || '🌾';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'bg-orange-100 text-orange-700',
      'PUBLISHED': 'bg-green-100 text-green-700',
      'SOLD_OUT': 'bg-red-100 text-red-700',
      'DISCONTINUED': 'bg-gray-100 text-gray-500'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-500';
  };

  // Fonction pour obtenir le libellé du statut traduit
  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': t.pending,
      'PUBLISHED': t.published,
      'SOLD_OUT': t.soldOut,
      'DISCONTINUED': t.discontinued
    };
    return statusMap[status] || status;
  };

  if (loading && products.length === 0) {
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
          <Plus size={16} /> {t.addProduct}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center">
          <Sprout size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">{t.noProducts}</h3>
          <p className="text-slate-400 text-sm mb-6">{t.noProductsDesc}</p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a2619] text-[#c5a059] rounded-xl text-xs font-black uppercase tracking-widest"
          >
            <Plus size={16} /> {t.addFirstProduct}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              {product.images && product.images[0] && (
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
                  }}
                />
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
                  <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(product.status)}`}>
                    {getStatusLabel(product.status)}
                  </span>
                  <span className="text-xs text-slate-400">{product.category}</span>
                </div>
                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">{t.priceLabel}</p>
                    <p className="font-bold text-[#c5a059]">{product.price?.amount?.toLocaleString()} {product.price?.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{t.unitStock}</p>
                    <p className="font-bold text-slate-800">{product.unit} / {product.stock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{t.originLabel}</p>
                    <p className="font-bold text-slate-800">{product.origin || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{t.certificationsLabel}</p>
                    <p className="font-bold text-slate-800">{product.certifications?.length || 0}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                  >
                    <Pencil size={14} className="inline mr-1" /> {t.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} className="inline mr-1" /> {t.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
              <h2 className="text-xl font-serif text-[#0a2619] italic">
                {editingItem ? t.editProduct : t.addNewProduct}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.productName}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  placeholder={t.productNamePlaceholder}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.category}</label>
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
              </div>

              {/* Price and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.price}</label>
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
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.unit}</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  >
                    {unitOptions.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Origin and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.origin}</label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder={t.originPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.stock}</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder={t.stockPlaceholder}
                  />
                </div>
              </div>

              {/* Harvest and Expiry Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.harvestDate}</label>
                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.expiryDate}</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
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

              {/* Certifications */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">{t.certifications}</label>
                <div className="grid grid-cols-2 gap-3">
                  {certifications.map(cert => (
                    <label key={cert.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="certifications"
                        value={cert.value}
                        checked={formData.certifications.includes(cert.value)}
                        onChange={handleChange}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-700">{cert.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.images}</label>
                <div className="flex gap-3 flex-wrap">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={getImageUrl(img)} alt={`Product ${idx}`} className="w-20 h-20 object-cover rounded-lg" />
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

export default AgriculturalManagement;