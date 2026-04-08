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
    image: "/images/propertyananas.jfif"
  },
  {
    id: "PROD-003",
    name: "Cacao Grade A (Fèves)",
    category: "Transformation",
    price: "2,800",
    unit: "Kg",
    origin: "Lekié",
    stock: 1000,
    image: "/images/propertycacao.jfif" // Mis à jour
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
    image: "/images/propertymaniocs.jfif"
  },
  {
    id: "PROD-006",
    name: "Maïs Jaune Séché (Premium)",
    category: "Maraîcher",
    price: "22,000",
    unit: "Sac (100kg)",
    origin: "Nord",
    stock: 200,
    image: "/images/propertymais.jfif" // Mis à jour
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
    name: "Banane Douce (Régime Brut)",
    category: "Maraîcher",
    price: "4,500",
    unit: "Régime",
    origin: "Sud-Ouest",
    stock: 85,
    image: "/images/propertybananes.jfif" // Mis à jour
  },
  {
    id: "PROD-009",
    name: "Oignons Rouges (Sélection)",
    category: "Maraîcher",
    price: "12,500",
    unit: "Sac (50kg)",
    origin: "Extrême-Nord",
    stock: 110,
    image: "/images/propertyoignons.jfif" // Mis à jour
  },
  {
    id: "PROD-010",
    name: "Arachides Égrainées",
    category: "Maraîcher",
    price: "18,500",
    unit: "Sac (50kg)",
    origin: "Nord",
    stock: 400,
    image: "/images/propertyarrachides.jfif" // Mis à jour
  },
  {
    id: "PROD-011",
    name: "Haricots Rouges (Gros Grains)",
    category: "Maraîcher",
    price: "15,000",
    unit: "Seau",
    origin: "Ouest",
    stock: 95,
    image: "/images/propertyharicots.jfif"
  },
  {
    id: "PROD-012",
    name: "Huile de Palme Rouge (Brute)",
    category: "Transformation",
    price: "1,000",
    unit: "Litre",
    origin: "Sud-Ouest",
    stock: 500,
    image: "/images/propertyhuile.jfif"
  }
];

const MarketplacePage = () => {
  const [filter, setFilter] = useState('All');

  const filteredProducts = filter === 'All' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(product => product.category === filter);

  return (
    <div className="bg-white min-h-screen selection:bg-pc-green selection:text-white font-sans">
      <Navbar />
      
      <MarketplaceHero />

      <section className="max-w-7xl mx-auto px-8 py-20">
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