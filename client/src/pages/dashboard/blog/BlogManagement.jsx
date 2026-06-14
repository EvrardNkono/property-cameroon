// frontend/src/pages/dashboard/blog/BlogManagement.jsx
import React, { useState, useEffect } from 'react';
import { Archive } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  Tag,
  MoreVertical,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  Globe,
  Copy,
  Share2
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

const BlogManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentLang = useCurrentLang();
  
  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      title: "Gestion du Blog",
      subtitle: "Gérez tous les articles, publiez, modifiez ou archivez",
      newArticle: "Nouvel article",
      total: "Total",
      published: "Publiés",
      draft: "Brouillons",
      archived: "Archivés",
      allStatus: "Tous les statuts",
      publishedStatus: "Publiés",
      draftStatus: "Brouillons",
      archivedStatus: "Archivés",
      allCategories: "Toutes les catégories",
      realEstate: "Immobilier",
      agriculture: "Agriculture",
      sourcing: "Approvisionnement",
      lifestyle: "Mode de Vie",
      searchPlaceholder: "Rechercher par titre ou auteur...",
      refresh: "Rafraîchir",
      retry: "Réessayer",
      noArticles: "Aucun article",
      noArticlesMatch: "Aucun article ne correspond aux filtres sélectionnés",
      createFirst: "Commencez par créer votre premier article de blog",
      clearFilters: "Effacer les filtres",
      createArticle: "Créer un article",
      article: "Article",
      category: "Catégorie",
      author: "Auteur",
      date: "Date",
      status: "Statut",
      actions: "Actions",
      viewArticle: "Voir l'article",
      copyLink: "Copier le lien",
      edit: "Modifier",
      changeStatus: "Changer le statut",
      delete: "Supprimer",
      linkCopied: "Lien copié dans le presse-papier !",
      page: "Page",
      of: "sur",
      changeStatusTitle: "Changer le statut",
      publish: "Publier",
      publishDesc: "Rendre l'article visible sur le site",
      draftLabel: "Brouillon",
      draftDesc: "Masquer l'article (en cours d'édition)",
      archiveLabel: "Archiver",
      archiveDesc: "Conserver mais retirer de la liste active",
      cancel: "Annuler",
      confirmDelete: "Confirmer la suppression",
      deleteConfirmMessage: "Êtes-vous sûr de vouloir supprimer l'article",
      deleteIrreversible: "Cette action est irréversible.",
      statusUpdateError: "Erreur lors de la mise à jour du statut",
      deleteError: "Erreur lors de la suppression",
      loadError: "Impossible de charger les articles",
      publishedLabel: "Publié",
      draftLabelShort: "Brouillon",
      archivedLabel: "Archivé",
      unknown: "Inconnu"
    },
    en: {
      title: "Blog Management",
      subtitle: "Manage all articles, publish, edit or archive",
      newArticle: "New article",
      total: "Total",
      published: "Published",
      draft: "Drafts",
      archived: "Archived",
      allStatus: "All statuses",
      publishedStatus: "Published",
      draftStatus: "Drafts",
      archivedStatus: "Archived",
      allCategories: "All categories",
      realEstate: "Real Estate",
      agriculture: "Agriculture",
      sourcing: "Sourcing",
      lifestyle: "Lifestyle",
      searchPlaceholder: "Search by title or author...",
      refresh: "Refresh",
      retry: "Retry",
      noArticles: "No articles",
      noArticlesMatch: "No articles match the selected filters",
      createFirst: "Start by creating your first blog article",
      clearFilters: "Clear filters",
      createArticle: "Create article",
      article: "Article",
      category: "Category",
      author: "Author",
      date: "Date",
      status: "Status",
      actions: "Actions",
      viewArticle: "View article",
      copyLink: "Copy link",
      edit: "Edit",
      changeStatus: "Change status",
      delete: "Delete",
      linkCopied: "Link copied to clipboard!",
      page: "Page",
      of: "of",
      changeStatusTitle: "Change status",
      publish: "Publish",
      publishDesc: "Make the article visible on the site",
      draftLabel: "Draft",
      draftDesc: "Hide the article (being edited)",
      archiveLabel: "Archive",
      archiveDesc: "Keep but remove from active list",
      cancel: "Cancel",
      confirmDelete: "Confirm deletion",
      deleteConfirmMessage: "Are you sure you want to delete the article",
      deleteIrreversible: "This action is irreversible.",
      statusUpdateError: "Error updating status",
      deleteError: "Error deleting article",
      loadError: "Unable to load articles",
      publishedLabel: "Published",
      draftLabelShort: "Draft",
      archivedLabel: "Archived",
      unknown: "Unknown"
    }
  }[currentLang] || {
    title: "Blog Management",
    subtitle: "Manage all articles, publish, edit or archive",
    newArticle: "New article",
    total: "Total",
    published: "Published",
    draft: "Drafts",
    archived: "Archived",
    allStatus: "All statuses",
    publishedStatus: "Published",
    draftStatus: "Drafts",
    archivedStatus: "Archived",
    allCategories: "All categories",
    realEstate: "Real Estate",
    agriculture: "Agriculture",
    sourcing: "Sourcing",
    lifestyle: "Lifestyle",
    searchPlaceholder: "Search by title or author...",
    refresh: "Refresh",
    retry: "Retry",
    noArticles: "No articles",
    noArticlesMatch: "No articles match the selected filters",
    createFirst: "Start by creating your first blog article",
    clearFilters: "Clear filters",
    createArticle: "Create article",
    article: "Article",
    category: "Category",
    author: "Author",
    date: "Date",
    status: "Status",
    actions: "Actions",
    viewArticle: "View article",
    copyLink: "Copy link",
    edit: "Edit",
    changeStatus: "Change status",
    delete: "Delete",
    linkCopied: "Link copied to clipboard!",
    page: "Page",
    of: "of",
    changeStatusTitle: "Change status",
    publish: "Publish",
    publishDesc: "Make the article visible on the site",
    draftLabel: "Draft",
    draftDesc: "Hide the article (being edited)",
    archiveLabel: "Archive",
    archiveDesc: "Keep but remove from active list",
    cancel: "Cancel",
    confirmDelete: "Confirm deletion",
    deleteConfirmMessage: "Are you sure you want to delete the article",
    deleteIrreversible: "This action is irreversible.",
    statusUpdateError: "Error updating status",
    deleteError: "Error deleting article",
    loadError: "Unable to load articles",
    publishedLabel: "Published",
    draftLabelShort: "Draft",
    archivedLabel: "Archived",
    unknown: "Unknown"
  };

  // États
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0
  });

  const postsPerPage = 10;

  // Charger les articles
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllBlogPostsAdmin();
      if (response.success) {
        let filteredPosts = response.data;
        
        // Filtre par statut
        if (statusFilter !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.status === statusFilter);
        }
        
        // Filtre par catégorie
        if (categoryFilter !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.category === categoryFilter);
        }
        
        // Filtre par recherche
        if (searchTerm) {
          filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Calculer les stats
        setStats({
          total: filteredPosts.length,
          published: filteredPosts.filter(p => p.status === 'published').length,
          draft: filteredPosts.filter(p => p.status === 'draft').length,
          archived: filteredPosts.filter(p => p.status === 'archived').length
        });
        
        // Pagination
        const start = (currentPage - 1) * postsPerPage;
        const paginatedPosts = filteredPosts.slice(start, start + postsPerPage);
        setPosts(paginatedPosts);
        setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
      } else {
        throw new Error(response.message || t.loadError);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message || t.loadError);
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/blog/categories');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [statusFilter, categoryFilter, currentPage, searchTerm]);

  // Changer le statut d'un article
  const handleStatusChange = async (postId, newStatus) => {
    try {
      const response = await api.updateBlogPost(postId, { status: newStatus });
      if (response.success) {
        fetchPosts();
        setShowStatusModal(false);
        setSelectedPost(null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(t.statusUpdateError);
    }
  };

  // Supprimer un article
  const handleDelete = async () => {
    if (!selectedPost) return;
    
    try {
      const response = await api.deleteBlogPost(selectedPost.id);
      if (response.success) {
        fetchPosts();
        setShowDeleteModal(false);
        setSelectedPost(null);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(t.deleteError);
    }
  };

  // Copier le lien de l'article
  const copyPostLink = (slug) => {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url);
    alert(t.linkCopied);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtenir la couleur du statut
  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return { label: t.publishedLabel, color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> };
      case 'draft':
        return { label: t.draftLabelShort, color: 'bg-yellow-100 text-yellow-700', icon: <EyeOff size={12} /> };
      case 'archived':
        return { label: t.archivedLabel, color: 'bg-gray-100 text-gray-700', icon: <Archive size={12} /> };
      default:
        return { label: t.unknown, color: 'bg-gray-100 text-gray-700', icon: null };
    }
  };

  // Obtenir la couleur de la catégorie
  const getCategoryColor = (category) => {
    const colors = {
      'Real Estate': 'bg-blue-100 text-blue-700',
      'Agriculture': 'bg-green-100 text-green-700',
      'Sourcing': 'bg-purple-100 text-purple-700',
      'Lifestyle': 'bg-rose-100 text-rose-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Obtenir le libellé de la catégorie traduit
  const getCategoryLabel = (category) => {
    const labels = {
      'Real Estate': t.realEstate,
      'Agriculture': t.agriculture,
      'Sourcing': t.sourcing,
      'Lifestyle': t.lifestyle
    };
    return labels[category] || category;
  };

  if (loading && posts.length === 0) {
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
        <div>
          <h1 className="text-2xl font-serif text-slate-800">{t.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        <Link
          to="/dashboard/admin/blog/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#c5a059] text-white rounded-lg hover:bg-[#b08a4a] transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          {t.newArticle}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">{t.total}</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">{t.published}</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">{t.draft}</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">{t.archived}</p>
          <p className="text-2xl font-bold text-gray-500">{stats.archived}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c5a059]"
          >
            <option value="all">{t.allStatus}</option>
            <option value="published">{t.publishedStatus}</option>
            <option value="draft">{t.draftStatus}</option>
            <option value="archived">{t.archivedStatus}</option>
          </select>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c5a059]"
          >
            <option value="all">{t.allCategories}</option>
            <option value="Real Estate">{t.realEstate}</option>
            <option value="Agriculture">{t.agriculture}</option>
            <option value="Sourcing">{t.sourcing}</option>
            <option value="Lifestyle">{t.lifestyle}</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={fetchPosts}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title={t.refresh}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={fetchPosts} className="ml-auto text-red-600 text-sm underline">
            {t.retry}
          </button>
        </div>
      )}

      {/* Posts Table */}
      {posts.length === 0 && !loading ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <ImageIcon size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-1">{t.noArticles}</h3>
          <p className="text-sm text-slate-400 mb-4">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? t.noArticlesMatch
              : t.createFirst}
          </p>
          {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-[#c5a059] text-sm underline"
            >
              {t.clearFilters}
            </button>
          ) : (
            <Link
              to="/dashboard/admin/blog/create"
              className="inline-flex items-center gap-2 text-[#c5a059] text-sm font-medium"
            >
              <Plus size={16} />
              {t.createArticle}
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.article}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.category}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.author}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.date}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.status}</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {posts.map((post) => {
                    const statusBadge = getStatusBadge(post.status);
                    return (
                      <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                <ImageIcon size={20} className="text-slate-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-800 line-clamp-1">{post.title}</p>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {post.excerpt?.substring(0, 80)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                            <Tag size={10} />
                            {getCategoryLabel(post.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-600">{post.authorName || 'Admin'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-600">{formatDate(post.publishedAt || post.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Voir l'article (public) */}
                            {post.status === 'published' && post.slug && (
                              <button
                                onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                title={t.viewArticle}
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            
                            {/* Copier le lien */}
                            {post.status === 'published' && post.slug && (
                              <button
                                onClick={() => copyPostLink(post.slug)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                title={t.copyLink}
                              >
                                <Copy size={16} />
                              </button>
                            )}
                            
                            {/* Modifier */}
                            <Link
                              to={`/dashboard/admin/blog/edit/${post.id}`}
                              className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
                              title={t.edit}
                            >
                              <Edit size={16} />
                            </Link>
                            
                            {/* Changer le statut */}
                            <button
                              onClick={() => {
                                setSelectedPost(post);
                                setStatusAction('status');
                                setShowStatusModal(true);
                              }}
                              className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                              title={t.changeStatus}
                            >
                              <RefreshCw size={16} />
                            </button>
                            
                            {/* Supprimer */}
                            <button
                              onClick={() => {
                                setSelectedPost(post);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                              title={t.delete}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-slate-500">
                {t.page} {currentPage} {t.of} {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Changer le statut */}
      {showStatusModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-serif text-slate-800 mb-4">{t.changeStatusTitle}</h2>
            <p className="text-slate-600 text-sm mb-6">
              {t.article}: <span className="font-medium">{selectedPost.title}</span>
            </p>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => handleStatusChange(selectedPost.id, 'published')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3"
              >
                <CheckCircle size={18} className="text-green-600" />
                <div>
                  <p className="font-medium text-slate-800">{t.publish}</p>
                  <p className="text-xs text-slate-400">{t.publishDesc}</p>
                </div>
              </button>
              <button
                onClick={() => handleStatusChange(selectedPost.id, 'draft')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-yellow-50 transition-colors flex items-center gap-3"
              >
                <EyeOff size={18} className="text-yellow-600" />
                <div>
                  <p className="font-medium text-slate-800">{t.draftLabel}</p>
                  <p className="text-xs text-slate-400">{t.draftDesc}</p>
                </div>
              </button>
              <button
                onClick={() => handleStatusChange(selectedPost.id, 'archived')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <Archive size={18} className="text-gray-600" />
                <div>
                  <p className="font-medium text-slate-800">{t.archiveLabel}</p>
                  <p className="text-xs text-slate-400">{t.archiveDesc}</p>
                </div>
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedPost(null);
                }}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-serif text-slate-800">{t.confirmDelete}</h2>
            </div>
            <p className="text-slate-600 mb-6">
              {t.deleteConfirmMessage} <br />
              <span className="font-medium text-slate-800">"{selectedPost.title}"</span> ?
              <br />
              <span className="text-xs text-red-500 mt-2 block">{t.deleteIrreversible}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPost(null);
                }}
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

export default BlogManagement;