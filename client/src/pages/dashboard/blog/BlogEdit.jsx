// frontend/src/pages/dashboard/blog/BlogEdit.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Image as ImageIcon,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Globe,
  Calendar,
  Tag,
  User,
  FileText,
  Hash,
  Link as LinkIcon,
  Upload,
  ZoomIn
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Agriculture',
    tags: [],
    status: 'draft',
    isFeatured: false,
    featuredImage: null,
    existingFeaturedImage: null,
    seoTitle: '',
    seoDescription: '',
    metaKeywords: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, seo, media
  
  // Catégories disponibles
  const categories = [
    { value: 'Real Estate', label: 'Immobilier', icon: '🏠' },
    { value: 'Agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'Sourcing', label: 'Approvisionnement', icon: '🚢' },
    { value: 'Lifestyle', label: 'Mode de Vie', icon: '🌟' }
  ];
  
  // Statuts disponibles
  const statuses = [
    { value: 'draft', label: 'Brouillon', icon: <EyeOff size={14} />, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'published', label: 'Publié', icon: <Eye size={14} />, color: 'bg-green-100 text-green-700' },
    { value: 'archived', label: 'Archivé', icon: <Archive size={14} />, color: 'bg-gray-100 text-gray-700' }
  ];
  
  // Charger l'article existant
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/blog/admin/post/${id}`);
        if (response.success) {
          const post = response.data;
          setFormData({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || 'Agriculture',
            tags: post.tags || [],
            status: post.status || 'draft',
            isFeatured: post.isFeatured || false,
            existingFeaturedImage: post.featuredImage || null,
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            metaKeywords: post.metaKeywords || []
          });
          setImagePreview(post.featuredImage);
        } else {
          throw new Error(response.message || 'Article non trouvé');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Impossible de charger l\'article');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id]);
  
  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Gérer l'upload d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Ajouter un tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Supprimer un tag
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Ajouter un mot-clé SEO
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.metaKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };
  
  // Supprimer un mot-clé SEO
  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(k => k !== keyword)
    }));
  };
  
  // Sauvegarder l'article
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      submitData.append('isFeatured', formData.isFeatured);
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('seoTitle', formData.seoTitle);
      submitData.append('seoDescription', formData.seoDescription);
      submitData.append('metaKeywords', JSON.stringify(formData.metaKeywords));
      
      if (imageFile) {
        submitData.append('featuredImage', imageFile);
      }
      
      const response = await api.updateBlogPost(id, submitData);
      
      if (response.success) {
        setSuccess('Article mis à jour avec succès !');
        setTimeout(() => {
          navigate('/dashboard/admin/blog');
        }, 1500);
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };
  
  // Publier directement
  const handlePublish = async () => {
    setSaving(true);
    try {
      const response = await api.updateBlogPost(id, { status: 'published' });
      if (response.success) {
        setFormData(prev => ({ ...prev, status: 'published' }));
        setSuccess('Article publié avec succès !');
      }
    } catch (err) {
      setError('Erreur lors de la publication');
    } finally {
      setSaving(false);
    }
  };
  
  // Supprimer l'article
  const handleDelete = async () => {
    try {
      const response = await api.deleteBlogPost(id);
      if (response.success) {
        navigate('/dashboard/admin/blog');
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };
  
  // Prévisualiser l'article
  const handlePreview = () => {
    window.open(`/blog/preview/${id}`, '_blank');
  };
  
  if (loading) {
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
            <h1 className="text-2xl font-serif text-slate-800">Modifier l'article</h1>
            <p className="text-sm text-slate-500 mt-1">
              Modifiez le contenu, les images et les paramètres SEO
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreview}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Eye size={16} />
            Prévisualiser
          </button>
          {formData.status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
              Publier
            </button>
          )}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
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
      
      {/* Status Badge */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Statut actuel :</span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              statuses.find(s => s.value === formData.status)?.color
            }`}>
              {statuses.find(s => s.value === formData.status)?.icon}
              {statuses.find(s => s.value === formData.status)?.label}
            </span>
          </div>
          {formData.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              <Star size={12} />
              À la une
            </span>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-[#c5a059] border-b-2 border-[#c5a059]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText size={14} className="inline mr-2" />
          Contenu
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'media'
              ? 'text-[#c5a059] border-b-2 border-[#c5a059]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ImageIcon size={14} className="inline mr-2" />
          Média
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'seo'
              ? 'text-[#c5a059] border-b-2 border-[#c5a059]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Globe size={14} className="inline mr-2" />
          SEO
        </button>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Titre de l'article *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                placeholder="Ex: Comment investir dans l'immobilier au Cameroun"
              />
            </div>
            
            {/* Catégorie et options */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#c5a059] focus:ring-[#c5a059]"
                  />
                  <span className="text-sm text-slate-700">Mettre à la une</span>
                </label>
              </div>
            </div>
            
            {/* Résumé */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Résumé *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                required
                maxLength={300}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none"
                placeholder="Court résumé de l'article (max 300 caractères)"
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.excerpt.length}/300 caractères
              </p>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                  placeholder="Ajouter un tag (ex: investissement, immobilier)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"
                    >
                      <Tag size={10} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contenu *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent font-mono text-sm"
                placeholder="Écrivez votre article ici... (supporte le HTML)"
              />
              <p className="text-xs text-slate-400 mt-1">
                Vous pouvez utiliser du HTML pour formater votre contenu
              </p>
            </div>
          </div>
        )}
        
        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
            {/* Image principale */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image principale *
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#c5a059] transition-colors">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, existingFeaturedImage: null }));
                        }}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors"
                      >
                        Supprimer
                      </button>
                      <label className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors cursor-pointer">
                        Changer
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload size={48} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-slate-600">Cliquez ou glissez une image</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF jusqu'à 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required={!formData.existingFeaturedImage && !imageFile}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700">
                <Globe size={14} className="inline mr-1" />
                Ces informations aident les moteurs de recherche à mieux comprendre votre contenu
              </p>
            </div>
            
            {/* Titre SEO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Titre SEO
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                placeholder="Titre pour les moteurs de recherche (laissez vide pour utiliser le titre de l'article)"
              />
              <p className="text-xs text-slate-400 mt-1">
                Recommandé: 50-60 caractères
              </p>
            </div>
            
            {/* Description SEO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description SEO
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none"
                placeholder="Description pour les résultats de recherche"
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.seoDescription.length}/160 caractères
              </p>
            </div>
            
            {/* Mots-clés SEO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mots-clés SEO
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                  placeholder="Ajouter un mot-clé"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              {formData.metaKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.metaKeywords.map(keyword => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"
                    >
                      <Hash size={10} />
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/dashboard/admin/blog"
            className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#c5a059] text-white rounded-lg hover:bg-[#b08a4a] transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Enregistrer
          </button>
        </div>
      </form>
      
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-serif text-slate-800">Confirmer la suppression</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement cet article ?
              <br />
              <span className="text-xs text-red-500 mt-2 block">Cette action est irréversible.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEdit;