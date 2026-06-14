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
  ZoomIn,
  Star,
  Archive
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentLang = useCurrentLang();
  
  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      editArticle: "Modifier l'article",
      editArticleDesc: "Modifiez le contenu, les images et les paramètres SEO",
      preview: "Prévisualiser",
      publish: "Publier",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      currentStatus: "Statut actuel",
      featured: "À la une",
      content: "Contenu",
      media: "Média",
      seo: "SEO",
      title: "Titre de l'article",
      titlePlaceholder: "Ex: Comment investir dans l'immobilier au Cameroun",
      category: "Catégorie",
      makeFeatured: "Mettre à la une",
      excerpt: "Résumé",
      excerptPlaceholder: "Court résumé de l'article (max 300 caractères)",
      excerptHint: "caractères",
      tags: "Tags",
      tagsPlaceholder: "Ajouter un tag (ex: investissement, immobilier)",
      contentLabel: "Contenu",
      contentPlaceholder: "Écrivez votre article ici... (supporte le HTML)",
      contentHint: "Vous pouvez utiliser du HTML pour formater votre contenu",
      featuredImage: "Image principale",
      clickOrDrag: "Cliquez ou glissez une image",
      imageFormats: "PNG, JPG, GIF jusqu'à 5MB",
      deleteImage: "Supprimer",
      changeImage: "Changer",
      seoInfo: "Ces informations aident les moteurs de recherche à mieux comprendre votre contenu",
      seoTitle: "Titre SEO",
      seoTitlePlaceholder: "Titre pour les moteurs de recherche (laissez vide pour utiliser le titre de l'article)",
      seoTitleRecommended: "Recommandé: 50-60 caractères",
      seoDescription: "Description SEO",
      seoDescriptionPlaceholder: "Description pour les résultats de recherche",
      seoKeywords: "Mots-clés SEO",
      seoKeywordsPlaceholder: "Ajouter un mot-clé",
      updateSuccess: "Article mis à jour avec succès !",
      publishSuccess: "Article publié avec succès !",
      errorUpdate: "Erreur lors de la mise à jour",
      errorPublish: "Erreur lors de la publication",
      errorDelete: "Erreur lors de la suppression",
      errorLoad: "Impossible de charger l'article",
      deleteConfirm: "Confirmer la suppression",
      deleteConfirmMessage: "Êtes-vous sûr de vouloir supprimer définitivement cet article ?",
      deleteIrreversible: "Cette action est irréversible.",
      imageTooLarge: "L'image ne doit pas dépasser 5MB",
      invalidImage: "Veuillez sélectionner une image valide",
      draft: "Brouillon",
      published: "Publié",
      archived: "Archivé",
      characters: "caractères"
    },
    en: {
      editArticle: "Edit Article",
      editArticleDesc: "Edit content, images and SEO settings",
      preview: "Preview",
      publish: "Publish",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      currentStatus: "Current status",
      featured: "Featured",
      content: "Content",
      media: "Media",
      seo: "SEO",
      title: "Article Title",
      titlePlaceholder: "Ex: How to invest in real estate in Cameroon",
      category: "Category",
      makeFeatured: "Make featured",
      excerpt: "Excerpt",
      excerptPlaceholder: "Short summary of the article (max 300 characters)",
      excerptHint: "characters",
      tags: "Tags",
      tagsPlaceholder: "Add a tag (ex: investment, real estate)",
      contentLabel: "Content",
      contentPlaceholder: "Write your article here... (supports HTML)",
      contentHint: "You can use HTML to format your content",
      featuredImage: "Featured Image",
      clickOrDrag: "Click or drag an image",
      imageFormats: "PNG, JPG, GIF up to 5MB",
      deleteImage: "Delete",
      changeImage: "Change",
      seoInfo: "This information helps search engines better understand your content",
      seoTitle: "SEO Title",
      seoTitlePlaceholder: "Title for search engines (leave empty to use article title)",
      seoTitleRecommended: "Recommended: 50-60 characters",
      seoDescription: "SEO Description",
      seoDescriptionPlaceholder: "Description for search results",
      seoKeywords: "SEO Keywords",
      seoKeywordsPlaceholder: "Add a keyword",
      updateSuccess: "Article updated successfully!",
      publishSuccess: "Article published successfully!",
      errorUpdate: "Error updating article",
      errorPublish: "Error publishing article",
      errorDelete: "Error deleting article",
      errorLoad: "Unable to load article",
      deleteConfirm: "Confirm deletion",
      deleteConfirmMessage: "Are you sure you want to permanently delete this article?",
      deleteIrreversible: "This action is irreversible.",
      imageTooLarge: "Image must not exceed 5MB",
      invalidImage: "Please select a valid image",
      draft: "Draft",
      published: "Published",
      archived: "Archived",
      characters: "characters"
    }
  }[currentLang] || {
    editArticle: "Edit Article",
    editArticleDesc: "Edit content, images and SEO settings",
    preview: "Preview",
    publish: "Publish",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    currentStatus: "Current status",
    featured: "Featured",
    content: "Content",
    media: "Media",
    seo: "SEO",
    title: "Article Title",
    titlePlaceholder: "Ex: How to invest in real estate in Cameroon",
    category: "Category",
    makeFeatured: "Make featured",
    excerpt: "Excerpt",
    excerptPlaceholder: "Short summary of the article (max 300 characters)",
    excerptHint: "characters",
    tags: "Tags",
    tagsPlaceholder: "Add a tag (ex: investment, real estate)",
    contentLabel: "Content",
    contentPlaceholder: "Write your article here... (supports HTML)",
    contentHint: "You can use HTML to format your content",
    featuredImage: "Featured Image",
    clickOrDrag: "Click or drag an image",
    imageFormats: "PNG, JPG, GIF up to 5MB",
    deleteImage: "Delete",
    changeImage: "Change",
    seoInfo: "This information helps search engines better understand your content",
    seoTitle: "SEO Title",
    seoTitlePlaceholder: "Title for search engines (leave empty to use article title)",
    seoTitleRecommended: "Recommended: 50-60 characters",
    seoDescription: "SEO Description",
    seoDescriptionPlaceholder: "Description for search results",
    seoKeywords: "SEO Keywords",
    seoKeywordsPlaceholder: "Add a keyword",
    updateSuccess: "Article updated successfully!",
    publishSuccess: "Article published successfully!",
    errorUpdate: "Error updating article",
    errorPublish: "Error publishing article",
    errorDelete: "Error deleting article",
    errorLoad: "Unable to load article",
    deleteConfirm: "Confirm deletion",
    deleteConfirmMessage: "Are you sure you want to permanently delete this article?",
    deleteIrreversible: "This action is irreversible.",
    imageTooLarge: "Image must not exceed 5MB",
    invalidImage: "Please select a valid image",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    characters: "characters"
  };

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
  const [activeTab, setActiveTab] = useState('content');
  
  // Catégories disponibles (traduites)
  const categories = [
    { value: 'Real Estate', labelFr: 'Immobilier', labelEn: 'Real Estate', icon: '🏠' },
    { value: 'Agriculture', labelFr: 'Agriculture', labelEn: 'Agriculture', icon: '🌾' },
    { value: 'Sourcing', labelFr: 'Approvisionnement', labelEn: 'Sourcing', icon: '🚢' },
    { value: 'Lifestyle', labelFr: 'Mode de Vie', labelEn: 'Lifestyle', icon: '🌟' }
  ];
  
  const getCategoryLabel = (cat) => currentLang === 'fr' ? cat.labelFr : cat.labelEn;
  
  // Statuts disponibles (traduits)
  const getStatuses = () => [
    { value: 'draft', label: t.draft, icon: <EyeOff size={14} />, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'published', label: t.published, icon: <Eye size={14} />, color: 'bg-green-100 text-green-700' },
    { value: 'archived', label: t.archived, icon: <Archive size={14} />, color: 'bg-gray-100 text-gray-700' }
  ];
  
  const statuses = getStatuses();
  
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
          throw new Error(response.message || t.errorLoad);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || t.errorLoad);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id, t.errorLoad]);
  
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
        alert(t.imageTooLarge);
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert(t.invalidImage);
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
        setSuccess(t.updateSuccess);
        setTimeout(() => {
          navigate('/dashboard/admin/blog');
        }, 1500);
      } else {
        throw new Error(response.message || t.errorUpdate);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.message || t.errorUpdate);
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
        setSuccess(t.publishSuccess);
      }
    } catch (err) {
      setError(t.errorPublish);
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
      setError(t.errorDelete);
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
            <h1 className="text-2xl font-serif text-slate-800">{t.editArticle}</h1>
            <p className="text-sm text-slate-500 mt-1">{t.editArticleDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreview}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Eye size={16} />
            {t.preview}
          </button>
          {formData.status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
              {t.publish}
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
            <span className="text-sm text-slate-500">{t.currentStatus} :</span>
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
              {t.featured}
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
          {t.content}
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
          {t.media}
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
          {t.seo}
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
                {t.title} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                placeholder={t.titlePlaceholder}
              />
            </div>
            
            {/* Catégorie et options */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.category} *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {getCategoryLabel(cat)}
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
                  <span className="text-sm text-slate-700">{t.makeFeatured}</span>
                </label>
              </div>
            </div>
            
            {/* Résumé */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.excerpt} *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                required
                maxLength={300}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none"
                placeholder={t.excerptPlaceholder}
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.excerpt.length}/300 {t.excerptHint}
              </p>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.tags}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                  placeholder={t.tagsPlaceholder}
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
                {t.contentLabel} *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent font-mono text-sm"
                placeholder={t.contentPlaceholder}
              />
              <p className="text-xs text-slate-400 mt-1">
                {t.contentHint}
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
                {t.featuredImage} *
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#c5a059] transition-colors">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
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
                        {t.deleteImage}
                      </button>
                      <label className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors cursor-pointer">
                        {t.changeImage}
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
                    <p className="text-slate-600">{t.clickOrDrag}</p>
                    <p className="text-xs text-slate-400 mt-1">{t.imageFormats}</p>
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
                {t.seoInfo}
              </p>
            </div>
            
            {/* Titre SEO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.seoTitle}
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                placeholder={t.seoTitlePlaceholder}
              />
              <p className="text-xs text-slate-400 mt-1">
                {t.seoTitleRecommended}
              </p>
            </div>
            
            {/* Description SEO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.seoDescription}
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none"
                placeholder={t.seoDescriptionPlaceholder}
              />
              <p className="text-xs text-slate-400 mt-1">
                {formData.seoDescription.length}/160 {t.characters}
              </p>
            </div>
            
            {/* Mots-clés SEO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.seoKeywords}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
                  placeholder={t.seoKeywordsPlaceholder}
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
            {t.cancel}
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#c5a059] text-white rounded-lg hover:bg-[#b08a4a] transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t.save}
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
              <h2 className="text-xl font-serif text-slate-800">{t.deleteConfirm}</h2>
            </div>
            <p className="text-slate-600 mb-6">
              {t.deleteConfirmMessage}
              <br />
              <span className="text-xs text-red-500 mt-2 block">{t.deleteIrreversible}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEdit;