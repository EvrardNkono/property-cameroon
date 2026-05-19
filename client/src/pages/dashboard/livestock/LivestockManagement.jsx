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

  // ✅ Statuts correspondant au backend
  const statuses = [
    { value: 'AVAILABLE', label: 'Available', color: 'text-green-600' },
    { value: 'RESERVED', label: 'Reserved', color: 'text-orange-600' },
    { value: 'SOLD', label: 'Sold', color: 'text-red-600' }
  ];

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

  // ✅ Charger les catégories depuis l'API (créées par l'admin)
 // frontend/src/pages/dashboard/livestock/LivestockManagement.jsx
// Modifie la fonction fetchCategories

// ✅ Charger les catégories depuis l'API (créées par l'admin)
const fetchCategories = async () => {
  try {
    setLoadingCategories(true);
    const response = await api.getAllLivestockCategories({ isActive: true });
    const cats = response.categories || [];
    
    // ✅ PLUS DE FILTRE ! On affiche TOUTES les catégories actives
    const formattedCats = cats.map(cat => ({
      value: cat.slug,
      label: cat.title,
      icon: getCategoryIcon(cat.slug)
    }));
    
    setCategories(formattedCats);
    console.log('📋 Categories loaded:', formattedCats);
  } catch (err) {
    console.error('Error fetching categories:', err);
    // Fallback sur les catégories par défaut si l'API échoue
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
      setError('Failed to load livestock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivestock();
    fetchCategories();
  }, []);

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
      alert('Maximum 10 images allowed');
      return;
    }
    
    setUploading(true);
    
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
      alert('Error uploading images');
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
      setError(err.message || 'Failed to save livestock');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this livestock?')) return;
    
    try {
      await api.deleteLivestock(id);
      fetchLivestock();
    } catch (err) {
      console.error('Error deleting livestock:', err);
      setError('Failed to delete livestock');
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

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/livestock/${image}`;
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
          <h1 className="text-3xl font-serif text-[#0a2619] italic">Livestock Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your livestock assets</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a2619] text-[#c5a059] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a3d2a] transition-colors"
        >
          <Plus size={16} /> Add Livestock
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
          <h3 className="text-lg font-medium text-slate-700 mb-2">No livestock yet</h3>
          <p className="text-slate-400 text-sm mb-6">Start by adding your first animal</p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a2619] text-[#c5a059] rounded-xl text-xs font-black uppercase tracking-widest"
          >
            <Plus size={16} /> Add Your First Livestock
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
                  <p className="text-slate-500 text-sm mb-2 capitalize">{item.category}</p>
                  <p className="text-slate-600 text-sm mb-3">{item.description?.substring(0, 100)}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">Capacity</p>
                      <p className="font-bold text-slate-800">{item.capacity?.value} {item.capacity?.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Price</p>
                      <p className="font-bold text-[#c5a059]">{item.price?.amount?.toLocaleString()} {item.price?.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">ROI</p>
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
                {editingItem ? 'Edit Livestock' : 'Add New Livestock'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  placeholder="e.g., Brahman Cattle Herd"
                />
              </div>

              {/* Category - Dynamique depuis l'API */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Category *</label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl">
                    <Loader2 size={16} className="animate-spin text-[#c5a059]" />
                    <span className="text-xs text-slate-400">Loading categories...</span>
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  >
                    <option value="">Select category</option>
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
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">City</label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder="Douala"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Region</label>
                  <input
                    type="text"
                    name="location.region"
                    value={formData.location.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder="Littoral"
                  />
                </div>
              </div>

              {/* Capacity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Capacity (heads) *</label>
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
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Price Amount *</label>
                  <input
                    type="number"
                    name="price.amount"
                    value={formData.price.amount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder="500000"
                  />
                </div>
              </div>

              {/* ROI & Cycle Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">ROI (%)</label>
                  <input
                    type="number"
                    name="roi"
                    value={formData.roi}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder="12.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Cycle Duration</label>
                  <input
                    type="text"
                    name="cycleDuration"
                    value={formData.cycleDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                    placeholder="e.g., 6 months"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Status</label>
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
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] resize-none"
                  placeholder="Describe your livestock..."
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 mb-2">Features</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasWaterSupply"
                      checked={formData.features.hasWaterSupply}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Water Supply</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasElectricity"
                      checked={formData.features.hasElectricity}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Electricity</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasVeterinaryAccess"
                      checked={formData.features.hasVeterinaryAccess}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Veterinary Access</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasFeedStorage"
                      checked={formData.features.hasFeedStorage}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Feed Storage</span>
                  </label>
                </div>
              </div>

              {/* Images section */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Images (max 10)</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-[#0a2619] text-[#c5a059] rounded-xl font-black uppercase text-[11px] flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {editingItem ? 'Update' : 'Create'}
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