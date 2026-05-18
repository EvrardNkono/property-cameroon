import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/agriculture/ProductCard';
import MarketplaceHero from '../components/agriculture/MarketplaceHero';
import { Loader2 } from 'lucide-react';
import api from '../services/api';

const MarketplacePage = () => {
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories for filter (from backend or static)
  const categories = ['All', 'Maraîcher', 'Livestock', 'Spices', 'Transformation'];

  // Fetch agricultural products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // You need to create this endpoint in your backend
      // For now, we'll use the agricultural lands endpoint or create a new one
      const response = await api.getAgriculturalProducts?.() || await api.getAgriculturalLands();
      
      // Transform agricultural lands into products if no dedicated endpoint
      let productsData = [];
      if (response.lands || response.products) {
        const items = response.lands || response.products || [];
        productsData = items.map(item => ({
          id: item._id,
          name: item.title,
          category: item.category || 'Maraîcher',
          price: item.price?.amount?.toLocaleString() || '0',
          unit: item.unit || 'Kg',
          origin: item.location?.region || 'Cameroon',
          stock: item.stock || Math.floor(Math.random() * 200) + 10,
          image: item.images?.[0] || 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800',
          description: item.description
        }));
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Error loading products');
      
      // Fallback data
      setProducts([
        {
          id: "PROD-001",
          name: "Penja White Pepper (AOP)",
          category: "Spices",
          price: "18,500",
          unit: "Kg",
          origin: "Moungo",
          stock: 25,
          image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: "PROD-002",
          name: "Sugar Pineapple",
          category: "Maraîcher",
          price: "1,500",
          unit: "Piece",
          origin: "Mbam",
          stock: 150,
          image: "/images/propertyananas.jfif"
        },
        {
          id: "PROD-003",
          name: "Cocoa Grade A (Beans)",
          category: "Transformation",
          price: "2,800",
          unit: "Kg",
          origin: "Lekié",
          stock: 1000,
          image: "/images/propertycacao.jfif"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(product => product.category === filter);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Loader2 size={48} className="text-pc-green animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen selection:bg-pc-green selection:text-white font-sans">
      <Navbar />
      
      <MarketplaceHero />

      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-slate-100 pb-8">
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`${
                  filter === cat 
                  ? 'text-pc-green border-b-2 border-pc-green scale-110' 
                  : 'hover:text-slate-900'
                } pb-2 transition-all duration-300 ease-out`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest mt-6 md:mt-0 font-bold">
            <span className="w-2 h-2 bg-pc-green rounded-full animate-pulse"></span>
            Inventory: Douala / Yaoundé HUB
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center mb-8">
            <p>{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-serif italic">No products available in this category at the moment.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default MarketplacePage;