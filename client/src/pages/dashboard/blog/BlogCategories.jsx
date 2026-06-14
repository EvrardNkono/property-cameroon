// frontend/src/pages/dashboard/blog/BlogCategories.jsx
import React, { useState, useEffect } from 'react';
// À ajouter en haut du fichier
import { Star } from 'lucide-react';  // Utilisé mais pas importé
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Tag,
  Eye,
  EyeOff,
  Star,
  Home,
  TrendingUp,
  ShoppingBag,
  Users,
  Globe,
  Archive,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const BlogCategories = () => {
  const { user } = useAuth();
  
  // États
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Formulaire catégorie
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '🏷️',
    color: '#c5a059',
    isActive: true,
    displayOrder: 0,
    metaTitle: '',
    metaDescription: ''
  });
  
  // Icônes disponibles
  const availableIcons = [
    { icon: '🏠', label: 'Maison', category: 'Real Estate' },
    { icon: '🌾', label: 'Agriculture', category: 'Agriculture' },
    { icon: '🚢', label: 'Sourcing', category: 'Sourcing' },
    { icon: '🌟', label: 'Lifestyle', category: 'Lifestyle' },
    { icon: '📈', label: 'Marché', category: 'Market' },
    { icon: '💼', label: 'Business', category: 'Business' },
    { icon: '🏦', label: 'Finance', category: 'Finance' },
    { icon: '🌍', label: 'International', category: 'International' },
    { icon: '🔧', label: 'Technique', category: 'Technical' },
    { icon: '🎓', label: 'Formation', category: 'Education' },
    { icon: '👥', label: 'Communauté', category: 'Community' },
    { icon: '⚖️', label: 'Légal', category: 'Legal' }
  ];
  
  // Couleurs disponibles
  const availableColors = [
    '#c5a059', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#6b7280'
  ];
  
  // Charger les catégories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/blog/categories');
      if (response.success) {
        let filteredCategories = response.data;
        
        // Filtre par recherche
        if (searchTerm) {
          filteredCategories = filteredCategories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Filtre par statut
        if (filterStatus !== 'all') {
          filteredCategories = filteredCategories.filter(cat =>
            filterStatus === 'active' ? cat.isActive : !cat.isActive
          );
        }
        
        setCategories(filteredCategories);
      } else {
        throw new Error(response.message || 'Erreur de chargement');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, [searchTerm, filterStatus]);
  
  // Générer le slug à partir du nom
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };
  
  // Gérer les changements du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Générer automatiquement le slug à partir du nom
    if (name === 'name' && !editingCategory) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };
  
  // Sélectionner une icône
  const selectIcon = (icon) => {
    setFormData(prev => ({ ...prev, icon }));
  };
  
  // Sélectionner une couleur
  const selectColor = (color) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  // Ouvrir le modal d'ajout
  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '🏷️',
      color: '#c5a059',
      isActive: true,
      displayOrder: categories.length,
      metaTitle: '',
      metaDescription: ''
    });
    setShowModal(true);
  };
  
  // Ouvrir le modal d'édition
  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '🏷️',
      color: category.color || '#c5a059',
      isActive: category.isActive !== false,
      displayOrder: category.displayOrder || 0,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || ''
    });
    setShowModal(true);
  };
  
  // Sauvegarder la catégorie
  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }
    if (!formData.slug.trim()) {
      setError('Le slug est requis');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (editingCategory) {
        response = await api.put(`/blog/categories/${editingCategory.id}`, formData);
      } else {
        response = await api.post('/blog/categories', formData);
      }
      
      if (response.success) {
        setSuccess(editingCategory ? 'Catégorie mise à jour !' : 'Catégorie créée !');
        setShowModal(false);
        fetchCategories();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.message || 'Une erreur est survenue');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Supprimer une catégorie
  const handleDelete = async (category) => {
    if (!confirm(`Supprimer la catégorie "${category.name}" ?\nLes articles associés ne seront pas supprimés mais n'auront plus de catégorie.`)) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.delete(`/blog/categories/${category.id}`);
      if (response.success) {
        setSuccess('Catégorie supprimée');
        fetchCategories();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Erreur lors de la suppression');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Changer le statut (actif/inactif)
  const toggleStatus = async (category) => {
    try {
      const response = await api.put(`/blog/categories/${category.id}`, {
        ...category,
        isActive: !category.isActive
      });
      if (response.success) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };
  
  // Obtenir la couleur de fond pour l'aperçu
  const getBgColor = (color) => {
    return { backgroundColor: color + '20', color: color };
  };
  
  // Statistiques des catégories
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length
  };
  
  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/admin/blog"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-slate-800">Gestion des Catégories</h1>
            <p className="text-sm text-slate-500 mt-1">
              Gérez les catégories d'articles pour organiser votre blog
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#c5a059] text-white rounded-lg hover:bg-[#b08a4a] transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Nouvelle catégorie
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <Tag size={24} className="text-slate-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Actives</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Eye size={24} className="text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Inactives</p>
              <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
            </div>
            <EyeOff size={24} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c5a059]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={fetchCategories}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      
      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Tag size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-1">Aucune catégorie</h3>
          <p className="text-sm text-slate-400 mb-4">
            {searchTerm || filterStatus !== 'all'
              ? "Aucune catégorie ne correspond aux filtres sélectionnés"
              : "Commencez par créer votre première catégorie"}
          </p>
          {(searchTerm || filterStatus !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="text-[#c5a059] text-sm underline"
            >
              Effacer les filtres
            </button>
          ) : (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 text-[#c5a059] text-sm font-medium"
            >
              <Plus size={16} />
              Créer une catégorie
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div
                className="p-4 border-b border-slate-100"
                style={{ backgroundColor: category.color + '10' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon || '🏷️'}</span>
                    <div>
                      <h3 className="font-semibold text-slate-800">{category.name}</h3>
                      <p className="text-xs text-slate-400">/{category.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStatus(category)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      title={category.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {category.isActive ? (
                        <Eye size={16} className="text-green-500" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="text-amber-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 space-y-3">
                {category.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 pt-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-slate-400">
                    Code couleur: {category.color}
                  </span>
                </div>
                
                {category.metaTitle && (
                  <div className="pt-2 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">SEO</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{category.metaTitle}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal Création/Édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
              <h2 className="text-xl font-serif text-slate-800">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                  placeholder="Ex: Immobilier"
                />
              </div>
              
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent font-mono text-sm"
                  placeholder="ex: immobilier"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Utilisé dans l'URL: /blog/category/{formData.slug || '...'}
                </p>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none"
                  placeholder="Description de la catégorie (optionnel)"
                />
              </div>
              
              {/* Icône */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Icône
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {availableIcons.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => selectIcon(item.icon)}
                      className={`p-2 rounded-lg text-2xl transition-all ${
                        formData.icon === item.icon
                          ? 'bg-[#c5a059] text-white scale-110'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                      title={item.label}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Couleur
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => selectColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        formData.color === color
                          ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                          : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => selectColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                  />
                </div>
              </div>
              
              {/* Ordre d'affichage */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  className="w-24 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Les catégories avec un ordre plus bas apparaissent en premier
                </p>
              </div>
              
              {/* Actif */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#c5a059] focus:ring-[#c5a059]"
                />
                <label className="text-sm text-slate-700">
                  Catégorie active (visible sur le site)
                </label>
              </div>
              
              {/* Section SEO */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Globe size={14} />
                  Optimisation SEO
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Titre SEO
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                      placeholder="Titre pour les moteurs de recherche"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description SEO
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      rows={2}
                      maxLength={160}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none"
                      placeholder="Description pour les résultats de recherche"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {formData.metaDescription.length}/160 caractères
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Aperçu */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Aperçu</h3>
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: formData.color + '10' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{formData.icon || '🏷️'}</span>
                    <div>
                      <p className="font-medium text-slate-800">
                        {formData.name || 'Nom de la catégorie'}
                      </p>
                      <p className="text-xs text-slate-500">
                        /{formData.slug || 'slug'}
                      </p>
                    </div>
                  </div>
                  {formData.description && (
                    <p className="text-sm text-slate-500 mt-2">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-[#c5a059] text-white rounded-lg hover:bg-[#b08a4a] transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingCategory ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCategories;