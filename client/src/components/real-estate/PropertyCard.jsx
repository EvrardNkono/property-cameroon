import React from 'react';
import { Link } from 'react-router-dom'; // Assure-toi d'avoir react-router-dom installé

// 🔥 Détection automatique de l'environnement (AJOUTE CES 7 LIGNES)
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement (AJOUTE CES 3 LIGNES)
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           // URL locale
  : 'https://property-cameroon-backend.vercel.app';  // URL de production

const PropertyCard = ({ property }) => {
  const isSale = property.status === 'sale';

  // 🔥 Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/properties/${image}`;
  };

  // 🔥 Debug (optionnel)
  React.useEffect(() => {
    console.log(`🌍 PropertyCard - Environnement: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
    console.log(`🔗 PropertyCard - Backend URL: ${BACKEND_URL}`);
  }, []);

  // 🔥 Traitement de l'image de la propriété
  const processedProperty = {
    ...property,
    image: getImageUrl(property.image)
  };

  // Dans PropertyCard.jsx, après processedProperty
console.log('🖼️ PropertyCard reçoit:', {
  title: property.title,
  imageRecue: property.image,
  imageApresTraitement: processedProperty.image
});

  return (
    <div className="group bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full">
      {/* Image & Badges */}
      <div className="relative h-72 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-200 animate-pulse -z-10"></div>
        <img 
          src={processedProperty.image} 
          alt={processedProperty.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
          }}
        />
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-xl ${isSale ? 'bg-pc-gold' : 'bg-slate-900'}`}>
          {isSale ? 'For Sale' : 'For Lease'}
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[8px] uppercase font-black tracking-tighter text-slate-900 border border-slate-100">
          {processedProperty.category}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-serif text-slate-900 leading-tight group-hover:text-pc-gold transition-colors">{processedProperty.title}</h3>
          <div className="text-right">
             <span className="text-pc-green font-black text-sm block">{processedProperty.price}</span>
             <span className="text-[8px] text-slate-400 uppercase font-bold">XAF {!isSale && '/ month'}</span>
          </div>
        </div>
        
        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-medium">
          <span className="text-pc-gold text-sm">📍</span> {processedProperty.location}
        </p>

        {/* Dynamic Specifications */}
        <div className="flex items-center gap-6 border-t border-slate-50 pt-5 mb-6">
          {processedProperty.type === 'land' || processedProperty.type === 'field' ? (
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 uppercase tracking-widest">Total Area</span>
              <span className="text-xs text-slate-900 font-bold">{processedProperty.size} sqm</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Beds</span>
                <span className="text-xs text-slate-900 font-bold">{processedProperty.beds}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Baths</span>
                <span className="text-xs text-slate-900 font-bold">{processedProperty.baths}</span>
              </div>
            </>
          )}
          
          <div className="ml-auto flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 bg-pc-green rounded-full animate-pulse"></div>
              <span className="text-[8px] uppercase font-black tracking-tighter text-pc-green">Verified</span>
          </div>
        </div>

        {/* NOUVEAU : BOUTON DETAIL (Poussé vers le bas) */}
        <div className="mt-auto">
          <Link 
            to={`/real-estate/${processedProperty.id}`} 
            className="block w-full text-center border border-slate-900 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;