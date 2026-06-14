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

const BlogManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
        throw new Error(response.message || 'Erreur de chargement');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Impossible de charger les articles');
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
      alert('Erreur lors de la mise à jour du statut');
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
      alert('Erreur lors de la suppression');
    }
  };

  // Copier le lien de l'article
  const copyPostLink = (slug) => {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Lien copié dans le presse-papier !');
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtenir la couleur du statut
  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return { label: 'Publié', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> };
      case 'draft':
        return { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-700', icon: <EyeOff size={12} /> };
      case 'archived':
        return { label: 'Archivé', color: 'bg-gray-100 text-gray-700', icon: <Archive size={12} /> };
      default:
        return { label: 'Inconnu', color: 'bg-gray-100 text-gray-700', icon: null };
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
          <h1 className="text-2xl font-serif text-slate-800">Gestion du Blog</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez tous les articles, publiez, modifiez ou archivez
          </p>
        </div>
        <Link
          to="/dashboard/admin/blog/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#c5a059] text-white rounded-lg hover:bg-[#b08a4a] transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Nouvel article
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Publiés</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Brouillons</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Archivés</p>
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
              placeholder="Rechercher par titre ou auteur..."
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
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="archived">Archivés</option>
          </select>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c5a059]"
          >
            <option value="all">Toutes les catégories</option>
            <option value="Real Estate">Immobilier</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Sourcing">Approvisionnement</option>
            <option value="Lifestyle">Mode de Vie</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={fetchPosts}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title="Rafraîchir"
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
            Réessayer
          </button>
        </div>
      )}

      {/* Posts Table */}
      {posts.length === 0 && !loading ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <ImageIcon size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-1">Aucun article</h3>
          <p className="text-sm text-slate-400 mb-4">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? "Aucun article ne correspond aux filtres sélectionnés"
              : "Commencez par créer votre premier article de blog"}
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
              Effacer les filtres
            </button>
          ) : (
            <Link
              to="/dashboard/admin/blog/create"
              className="inline-flex items-center gap-2 text-[#c5a059] text-sm font-medium"
            >
              <Plus size={16} />
              Créer un article
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
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Article</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Auteur</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
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
                            {post.category}
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
                                title="Voir l'article"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            
                            {/* Copier le lien */}
                            {post.status === 'published' && post.slug && (
                              <button
                                onClick={() => copyPostLink(post.slug)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Copier le lien"
                              >
                                <Copy size={16} />
                              </button>
                            )}
                            
                            {/* Modifier */}
                            <Link
                              to={`/dashboard/admin/blog/edit/${post.id}`}
                              className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
                              title="Modifier"
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
                              title="Changer le statut"
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
                              title="Supprimer"
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
                Page {currentPage} sur {totalPages}
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
            <h2 className="text-xl font-serif text-slate-800 mb-4">Changer le statut</h2>
            <p className="text-slate-600 text-sm mb-6">
              Article: <span className="font-medium">{selectedPost.title}</span>
            </p>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => handleStatusChange(selectedPost.id, 'published')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3"
              >
                <CheckCircle size={18} className="text-green-600" />
                <div>
                  <p className="font-medium text-slate-800">Publier</p>
                  <p className="text-xs text-slate-400">Rendre l'article visible sur le site</p>
                </div>
              </button>
              <button
                onClick={() => handleStatusChange(selectedPost.id, 'draft')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-yellow-50 transition-colors flex items-center gap-3"
              >
                <EyeOff size={18} className="text-yellow-600" />
                <div>
                  <p className="font-medium text-slate-800">Brouillon</p>
                  <p className="text-xs text-slate-400">Masquer l'article (en cours d'édition)</p>
                </div>
              </button>
              <button
                onClick={() => handleStatusChange(selectedPost.id, 'archived')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <Archive size={18} className="text-gray-600" />
                <div>
                  <p className="font-medium text-slate-800">Archiver</p>
                  <p className="text-xs text-slate-400">Conserver mais retirer de la liste active</p>
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
                Annuler
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
              <h2 className="text-xl font-serif text-slate-800">Confirmer la suppression</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'article <br />
              <span className="font-medium text-slate-800">"{selectedPost.title}"</span> ?
              <br />
              <span className="text-xs text-red-500 mt-2 block">Cette action est irréversible.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPost(null);
                }}
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

export default BlogManagement;