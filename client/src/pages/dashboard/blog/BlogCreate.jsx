// frontend/src/pages/dashboard/blog/BlogCreate.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
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
  Upload,
  Sparkles
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const BlogCreate = () => {
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
    seoTitle: '',
    seoDescription: '',
    metaKeywords: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // content, seo, media
  
  // Catégories disponibles
  const categories = [
    { value: 'Real Estate', label: 'Immobilier', icon: '🏠', description: 'Articles sur l\'immobilier, investissements fonciers' },
    { value: 'Agriculture', label: 'Agriculture', icon: '🌾', description: 'Agriculture, élevage, agrobusiness' },
    { value: 'Sourcing', label: 'Approvisionnement', icon: '🚢', description: 'Importation, logistique, sourcing international' },
    { value: 'Lifestyle', label: 'Mode de Vie', icon: '🌟', description: 'Culture, lifestyle, diaspora' }
  ];
  
  // Suggestions de titres SEO
  const suggestSeoTitle = () => {
    if (formData.title) {
      const seoTitle = formData.title.length > 60 
        ? formData.title.substring(0, 57) + '...'
        : formData.title;
      setFormData(prev => ({ ...prev, seoTitle }));
    }
  };
  
  // Suggestions de description SEO
  const suggestSeoDescription = () => {
    if (formData.excerpt) {
      const seoDesc = formData.excerpt.length > 160
        ? formData.excerpt.substring(0, 157) + '...'
        : formData.excerpt;
      setFormData(prev => ({ ...prev, seoDescription: seoDesc }));
    }
  };
  
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
      // Validation
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide (JPEG, PNG, GIF)');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
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
  
  // Sauvegarder l'article (brouillon)
  const handleSaveDraft = async () => {
    await savePost('draft');
  };
  
  // Publier l'article
  const handlePublish = async () => {
    await savePost('published');
  };
  
  // Sauvegarder l'article
  const savePost = async (status) => {
    // Validation
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return;
    }
    if (!formData.excerpt.trim()) {
      setError('Le résumé est requis');
      return;
    }
    if (!formData.content.trim()) {
      setError('Le contenu est requis');
      return;
    }
    if (!imageFile && !formData.featuredImage) {
      setError('Une image principale est requise');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('status', status);
      submitData.append('isFeatured', formData.isFeatured);
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('seoTitle', formData.seoTitle);
      submitData.append('seoDescription', formData.seoDescription);
      submitData.append('metaKeywords', JSON.stringify(formData.metaKeywords));
      
      if (imageFile) {
        submitData.append('featuredImage', imageFile);
      }
      
      const response = await api.createBlogPost(submitData);
      
      if (response.success) {
        const message = status === 'published' 
          ? 'Article publié avec succès !' 
          : 'Brouillon sauvegardé avec succès !';
        setSuccess(message);
        setTimeout(() => {
          navigate('/dashboard/admin/blog');
        }, 1500);
      } else {
        throw new Error(response.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  
  // Générer un slug à partir du titre
  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      return slug;
    }
    return '';
  };
  
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
            <h1 className="text-2xl font-serif text-slate-800">Nouvel article</h1>
            <p className="text-sm text-slate-500 mt-1">
              Créez un nouvel article pour le blog
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Sauvegarder brouillon
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="px-4 py-2 bg-[#c5a059] text-white rounded-lg hover:bg-[#b08a4a] transition-colors text-sm font-medium flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
            Publier
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
      
      {/* Preview Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Aperçu de l'article</p>
            <p className="text-xs text-amber-700 mt-1">
              URL: <span className="font-mono">{window.location.origin}/blog/{generateSlug() || '...'}</span>
            </p>
          </div>
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
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent text-lg"
              placeholder="Ex: Comment investir dans l'immobilier au Cameroun"
            />
            <p className="text-xs text-slate-400 mt-1">
              {formData.title.length}/200 caractères
            </p>
          </div>
          
          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Catégorie *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map(cat => (
                <label
                  key={cat.value}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.category === cat.value
                      ? 'border-[#c5a059] bg-amber-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={handleChange}
                    className="mt-1 text-[#c5a059] focus:ring-[#c5a059]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-slate-700">{cat.label}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{cat.description}</p>
                  </div>
                </label>
              ))}
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
              placeholder="Court résumé de l'article qui apparaîtra dans les aperçus (max 300 caractères)"
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
                placeholder="Ajouter un tag (ex: investissement, immobilier, guide)"
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Contenu *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs text-slate-400 hover:text-slate-600"
                  onClick={() => {
                    // Helper pour insérer des balises HTML simples
                    const newContent = formData.content + '\n\n<p>Nouveau paragraphe</p>';
                    setFormData(prev => ({ ...prev, content: newContent }));
                  }}
                >
                  + Paragraphe
                </button>
              </div>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent font-mono text-sm"
              placeholder="Écrivez votre article ici...&#10;&#10;Vous pouvez utiliser du HTML pour le formatage :&#10;&lt;h2&gt;Titre&lt;/h2&gt;&#10;&lt;p&gt;Paragraphe&lt;/p&gt;&#10;&lt;ul&gt;&lt;li&gt;Liste&lt;/li&gt;&lt;/ul&gt;&#10;&lt;strong&gt;Gras&lt;/strong&gt; et &lt;em&gt;italique&lt;/em&gt;"
            />
            <p className="text-xs text-slate-400 mt-1">
              Supporte le HTML pour le formatage. Utilisez les balises standards.
            </p>
          </div>
          
          {/* Options */}
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-[#c5a059] focus:ring-[#c5a059]"
              />
              <span className="text-sm text-slate-700">Mettre à la une (apparaît en avant-première)</span>
            </label>
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
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              error && !imagePreview ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-[#c5a059]'
            }`}>
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
                  <p className="text-slate-600 font-medium">Cliquez ou glissez une image</p>
                  <p className="text-xs text-slate-400 mt-2">
                    PNG, JPG, GIF, WebP jusqu'à 5MB
                  </p>
                  <p className="text-xs text-slate-400">
                    Recommandé : 1200 x 630 pixels pour un partage optimal
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!imagePreview}
                  />
                </label>
              )}
            </div>
          </div>
          
          {/* Conseils images */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-600 flex items-start gap-2">
              <ImageIcon size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-medium">Conseils images :</strong><br />
                • Utilisez des images de haute qualité (min. 800px de large)<br />
                • Privilégiez des visuels authentiques liés au Cameroun<br />
                • Évitez les images avec trop de texte
              </span>
            </p>
          </div>
        </div>
      )}
      
      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-700">
              <Globe size={14} className="inline mr-1" />
              Ces informations aident les moteurs de recherche à mieux comprendre et classer votre contenu.
              Laissez vides pour utiliser les valeurs par défaut.
            </p>
          </div>
          
          {/* Titre SEO */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Titre SEO
              </label>
              <button
                type="button"
                onClick={suggestSeoTitle}
                className="text-xs text-[#c5a059] hover:underline"
                disabled={!formData.title}
              >
                Suggérer depuis le titre
              </button>
            </div>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent"
              placeholder="Titre pour les moteurs de recherche (laissez vide pour utiliser le titre de l'article)"
            />
            <p className="text-xs text-slate-400 mt-1">
              Recommandé: 50-60 caractères • {formData.seoTitle.length} caractères
            </p>
          </div>
          
          {/* Description SEO */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Description SEO
              </label>
              <button
                type="button"
                onClick={suggestSeoDescription}
                className="text-xs text-[#c5a059] hover:underline"
                disabled={!formData.excerpt}
              >
                Suggérer depuis le résumé
              </button>
            </div>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows={3}
              maxLength={160}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none"
              placeholder="Description pour les résultats de recherche (max 160 caractères)"
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
                placeholder="Ajouter un mot-clé (ex: investissement cameroun, immobilier douala)"
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
            <p className="text-xs text-slate-400 mt-1">
              Les mots-clés aident à catégoriser votre contenu pour la recherche
            </p>
          </div>
          
          {/* Aperçu Google */}
          {(formData.seoTitle || formData.seoDescription) && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-3">Aperçu dans Google :</p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-blue-800 text-lg font-medium">
                  {formData.seoTitle || formData.title || 'Titre de l\'article'}
                </p>
                <p className="text-green-700 text-sm mt-1">
                  {window.location.origin}/blog/{generateSlug() || '...'}
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  {formData.seoDescription || formData.excerpt || 'Description de l\'article...'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Tips Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
        <h3 className="text-sm font-semibold text-amber-800 mb-2">✨ Conseils pour un article réussi</h3>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• 📝 Titre accrocheur et descriptif (idéalement entre 50 et 70 caractères)</li>
          <li>• 🖼️ Utilisez des images de qualité et pertinentes</li>
          <li>• 🔗 Structurez votre contenu avec des sous-titres (h2, h3)</li>
          <li>• 📊 Ajoutez des données chiffrées pour renforcer votre crédibilité</li>
          <li>• 🎯 Optimisez votre SEO en incluant des mots-clés pertinents</li>
          <li>• 📱 Testez toujours l'affichage sur mobile</li>
        </ul>
      </div>
    </div>
  );
};

export default BlogCreate;