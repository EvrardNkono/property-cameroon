import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/agriculture/ProductCard';
import MarketplaceHero from '../components/agriculture/MarketplaceHero';

const MOCK_PRODUCTS = [
  {
    id: "PROD-001",
    name: "Poivre de Penja Blanc (AOP)",
    category: "Épices",
    price: "18,500",
    unit: "Kg",
    origin: "Moungo",
    stock: 25,
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-002",
    name: "Ananas Pain de Sucre",
    category: "Maraîcher",
    price: "1,500",
    unit: "Pièce",
    origin: "Mbam",
    stock: 150,
    image: "https://images.unsplash.com/photo-1550258114-b09a81c82e3c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-003",
    name: "Cacao Grade A1 (Fermenté)",
    category: "Transformation",
    price: "2,800",
    unit: "Kg",
    origin: "Lekié",
    stock: 1000,
    image: "https://images.unsplash.com/photo-1548339818-886d95d4160a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-004",
    name: "Café Arabica Blue Mountain",
    category: "Transformation",
    price: "7,500",
    unit: "500g",
    origin: "Ouest",
    stock: 45,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-005",
    name: "Manioc Blanc (Tubercules)",
    category: "Maraîcher",
    price: "8,500",
    unit: "Filet",
    origin: "Basse-Sanaga",
    stock: 120,
    image: "https://images.unsplash.com/photo-1593105544280-ed5d0a8903a2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-006",
    name: "Maïs Jaune Séché",
    category: "Maraîcher",
    price: "22,000",
    unit: "Sac (100kg)",
    origin: "Nord",
    stock: 200,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-007",
    name: "Ail Violet de l'Ouest",
    category: "Épices",
    price: "2,500",
    unit: "Seau",
    origin: "Ouest",
    stock: 60,
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-008",
    name: "Okok Frais (Découpé)",
    category: "Maraîcher",
    price: "1,500",
    unit: "Sachet",
    origin: "Centre",
    stock: 50,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-009",
    name: "Noix de Palme (Sélection)",
    category: "Maraîcher",
    price: "12,000",
    unit: "Sac",
    origin: "Littoral",
    stock: 80,
    image: "https://images.unsplash.com/photo-1590779033100-9f60705a2f3b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-010",
    name: "Arachides de Garoua",
    category: "Maraîcher",
    price: "1,800",
    unit: "Litre",
    origin: "Nord",
    stock: 400,
    image: "https://images.unsplash.com/photo-1509912747193-4709127db00d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-011",
    name: "Haricots Rouges (Gros Grains)",
    category: "Maraîcher",
    price: "15,000",
    unit: "Seau",
    origin: "Ouest",
    stock: 95,
    image: "https://images.unsplash.com/photo-1585914924626-45adbc9307f2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "PROD-012",
    name: "Huile de Palme Rouge (Brute)",
    category: "Transformation",
    price: "1,000",
    unit: "Litre",
    origin: "Sud-Ouest",
    stock: 500,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?auto=format&fit=crop&q=80&w=800"
  }
];

const MarketplacePage = () => {
  const [filter, setFilter] = useState('All');

  // LOGIQUE DE FILTRAGE
  const filteredProducts = filter === 'All' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(product => product.category === filter);

  return (
    <div className="bg-white min-h-screen selection:bg-pc-green selection:text-white">
      <Navbar />
      
      <MarketplaceHero />

      <section className="max-w-7xl mx-auto px-8 py-20">
        {/* Navigation des Filtres */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-slate-100 pb-8">
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            {['All', 'Maraîcher', 'Élevage', 'Épices', 'Transformation'].map(cat => (
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

        {/* Grille de Produits */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-serif italic">Aucun produit disponible dans cette catégorie pour le moment.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default MarketplacePage;