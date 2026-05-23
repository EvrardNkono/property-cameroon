import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, Package, Loader2, AlertCircle, 
  Search, Filter, DollarSign, MapPin, TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// 🔥 Détection automatique de l'environnement
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';

// URLs en dur selon l'environnement
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           // URL locale
  : 'https://property-cameroon-backend.vercel.app';  // URL de production

const API_URL = `${BACKEND_URL}/api`;

const AgriculturalProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Maraîcher', 'Livestock', 'Spices', 'Transformation', 'Cereals', 'Fruits'];

  // 🔥 Fonction getImageUrl mise à jour
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/agriculture/${image}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Utiliser l'API configurée dynamiquement
      const response = await api.get('/agriculture/products');
      setProducts(response.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`🌍 Environnement: ${isDevelopment ? 'DÉVELOPPEMENT (local)' : 'PRODUCTION (Vercel)'}`);
    console.log(`🔗 Backend URL: ${BACKEND_URL}`);
    fetchProducts();
  }, []);

  // ... le reste de ton code reste identique ...
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.origin || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'Maraîcher': '🥬',
      'Livestock': '🐄',
      'Spices': '🌶️',
      'Transformation': '🏭',
      'Cereals': '🌾',
      'Fruits': '🍎'
    };
    return icons[category] || '🌾';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Loader2 size={48} className="text-emerald-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-emerald-900 mb-2">Agricultural Products</h1>
          <p className="text-gray-500">Discover quality products from local farmers</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
            <AlertCircle size={40} className="mx-auto mb-3" />
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <Link to="/dashboard/agriculture" className="inline-block mt-4 text-emerald-600 underline">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
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
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      product.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                      product.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {product.status}
                    </span>
                    <span className="text-xs text-gray-400">{product.category}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-emerald-700">
                        {product.price?.amount?.toLocaleString()} <span className="text-sm">{product.price?.currency}</span>
                      </p>
                      <p className="text-xs text-gray-400">per {product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Stock: {product.stock}</p>
                      <p className="text-xs text-gray-400">{product.origin || 'Cameroon'}</p>
                    </div>
                  </div>

                  {product.certifications && product.certifications.length > 0 && (
                    <div className="flex gap-1 mb-4">
                      {product.certifications.map(cert => (
                        <span key={cert} className="text-[8px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full uppercase">
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/agriculture/products/${product._id}`}
                    className="block w-full py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wide text-center hover:bg-emerald-900 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AgriculturalProducts;