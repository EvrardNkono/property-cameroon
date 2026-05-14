import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [unitType, setUnitType] = useState(product.unit); // Par défaut l'unité du mock
  const [isAdded, setIsAdded] = useState(false);

  // Simulation du changement de prix selon l'unité (exemple simplifié)
  const displayPrice = unitType.includes('Sac') 
    ? (parseInt(product.price.replace(',', '')) * 25).toLocaleString() 
    : product.price;

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    console.log(`Ajouté: ${quantity} ${unitType} de ${product.name}`);
  };

  return (
    <div className="group bg-white border border-slate-100 p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
      {/* Visual Section */}
      <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-slate-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
           <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[8px] font-black px-3 py-1.5 uppercase tracking-widest border border-slate-100 shadow-sm">
             {product.origin}
           </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-2 mb-6 text-center">
        <p className="text-[9px] uppercase tracking-[0.2em] text-pc-gold font-bold">{product.category}</p>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight h-10 flex items-center justify-center">
          {product.name}
        </h3>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-serif text-slate-900">{displayPrice} <span className="text-[10px] font-sans align-middle ml-1">XAF</span></span>
          <span className="text-[9px] text-slate-400 uppercase tracking-tighter font-bold">par {unitType}</span>
        </div>
      </div>

      {/* Interface d'achat */}
      <div className="space-y-3">
        {/* Sélecteur Unité (Kg ou Sac) */}
        <div className="flex gap-2 p-1 bg-slate-50 rounded-sm">
          {['Kg', 'Sac'].map((type) => (
            <button
              key={type}
              onClick={() => setUnitType(type)}
              className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${
                unitType === type ? 'bg-white text-pc-green shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Quantité */}
          <div className="flex items-center border border-slate-200 px-2 h-12">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-slate-900">-</button>
            <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-slate-900">+</button>
          </div>

          {/* Bouton Panier */}
          <button 
            onClick={handleAddToCart}
            className={`flex-1 h-12 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden ${
              isAdded ? 'bg-pc-green text-white' : 'bg-slate-900 text-white hover:bg-pc-gold hover:shadow-lg hover:shadow-pc-gold/20'
            }`}
          >
            <span className={`flex items-center justify-center gap-2 transition-transform duration-300 ${isAdded ? '-translate-y-12' : 'translate-y-0'}`}>
              Add to cart
            </span>
            <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${isAdded ? 'translate-y-0' : 'translate-y-12'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Confirmed
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;