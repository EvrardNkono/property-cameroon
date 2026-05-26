// frontend/src/components/real-estate/PropertyCard.jsx - CORRIGÉ

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 🔥 Détection automatique de l'environnement
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// 🎨 Icônes par catégorie
const getCategoryIcon = (category) => {
  const icons = {
    'House': '🏠',
    'Villa': '🏛️',
    'Duplex': '🏘️',
    'Apartment': '🏢',
    'Studio': '📐',
    'Room': '🛏️',
    'Land': '🗺️',
    'Agricultural Land': '🌾',
    'Commercial Space': '🏪',
    'Office': '💼',
    'Warehouse': '📦',
    'Shop': '🛍️',
    'Industrial Space': '🏭',
    'Parking': '🅿️'
  };
  return icons[category] || '🏠';
};

// 🎨 Couleurs de fond par catégorie
const getCategoryColor = (category) => {
  const colors = {
    'House': 'bg-blue-50 text-blue-700',
    'Villa': 'bg-purple-50 text-purple-700',
    'Duplex': 'bg-indigo-50 text-indigo-700',
    'Apartment': 'bg-cyan-50 text-cyan-700',
    'Studio': 'bg-teal-50 text-teal-700',
    'Room': 'bg-orange-50 text-orange-700',
    'Land': 'bg-emerald-50 text-emerald-700',
    'Agricultural Land': 'bg-green-50 text-green-700',
    'Commercial Space': 'bg-red-50 text-red-700',
    'Office': 'bg-gray-50 text-gray-700',
    'Warehouse': 'bg-amber-50 text-amber-700',
    'Shop': 'bg-pink-50 text-pink-700',
    'Industrial Space': 'bg-slate-50 text-slate-700',
    'Parking': 'bg-stone-50 text-stone-700'
  };
  return colors[category] || 'bg-slate-50 text-slate-700';
};

// 🎨 Icône pour le statut meublé/non meublé
const getFurnishedIcon = (isFurnished) => {
  return isFurnished ? '🛋️' : '📦';
};

const getFurnishedLabel = (isFurnished) => {
  return isFurnished ? 'Furnished' : 'Unfurnished';
};

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  
  // ✅ Utilisation de listingType (sale/rent) depuis le backend
  const isSale = property.listingType === 'sale' || property.listingType === 'SALE';
  
  // 🔥 Récupérer l'ID correctement
  const propertyId = property._id || property.id;
  
  // 🔥 Fonction pour obtenir l'URL complète de l'image avec fallback backend
  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
    if (image.startsWith('http')) return image;
    if (image.startsWith('blob:')) return 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/properties/${image}`;
  };

  // Récupérer la première image du tableau d'images
  const firstImage = property.images?.[0] || property.image;
  
  // 🔥 Traitement de l'image
  const processedImage = getImageUrl(firstImage);

  // Déterminer si c'est une propriété résidentielle (pour afficher le statut meublé)
  const residentialCategories = ['House', 'Villa', 'Duplex', 'Apartment', 'Studio', 'Room'];
  const showFurnishedStatus = residentialCategories.includes(property.category);

  // Récupérer la surface (priorité à surface.value, puis size)
  const surfaceValue = property.surface?.value || property.size || 0;
  const surfaceUnit = property.surface?.unit || 'm²';

  // Récupérer le prix
  const priceAmount = property.price?.amount || property.price || 0;
  const priceCurrency = property.price?.currency || 'FCFA';

  // Récupérer la localisation
  const locationText = property.location?.city 
    ? `${property.location.city}, ${property.location.region || ''}`
    : property.location || 'Cameroon';

  // Récupérer les caractéristiques
  const bedrooms = property.features?.bedrooms || property.beds || 0;
  const bathrooms = property.features?.bathrooms || property.baths || 0;
  const isFurnished = property.features?.isFurnished || property.isFurnished || false;

  

  // 🔥 Gestion du clic manuelle (alternative si Link ne fonctionne pas)
  const handleViewDetails = (e) => {
    e.preventDefault();
    if (propertyId) {
      console.log('Navigating to:', `/real-estate/${propertyId}`);
      navigate(`/real-estate/${propertyId}`);
    } else {
      console.error('No property ID found!', property);
    }
  };
  

  return (
    <div className="group bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full rounded-xl overflow-hidden">
      
      {/* Image & Badges */}
      <div className="relative h-72 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-200 animate-pulse -z-10"></div>
        <img 
          src={processedImage} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
          }}
        />
        
        {/* ✅ Status Badge - Vente ou Location */}
        <div className={`absolute top-4 left-4 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-xl z-10 ${isSale ? 'bg-pc-gold' : 'bg-slate-900'}`}>
          {isSale ? 'For Sale' : 'For Rent'}
        </div>

        {/* ✅ Category Tag - Avec icône et couleur */}
        <div className={`absolute bottom-4 right-4 backdrop-blur-md px-3 py-1.5 text-[8px] uppercase font-black tracking-tighter rounded-lg shadow-md flex items-center gap-1.5 z-10 ${getCategoryColor(property.category)}`}>
          <span className="text-sm">{getCategoryIcon(property.category)}</span>
          <span>{property.category}</span>
        </div>

        {/* ✅ Furnished Badge - Pour les propriétés résidentielles */}
        {showFurnishedStatus && isFurnished !== undefined && (
          <div className={`absolute top-4 right-4 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg shadow-md flex items-center gap-1.5 z-10 ${
            isFurnished 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            <span className="text-xs">{getFurnishedIcon(isFurnished)}</span>
            <span>{getFurnishedLabel(isFurnished)}</span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Titre et Prix */}
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-serif text-slate-900 leading-tight group-hover:text-pc-gold transition-colors line-clamp-2">
            {property.title}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-pc-green font-black text-sm block whitespace-nowrap">
              {priceAmount.toLocaleString()} {priceCurrency}
            </span>
            <span className="text-[8px] text-slate-400 uppercase font-bold">
              {!isSale && '/ month'}
            </span>
          </div>
        </div>
        
        {/* Localisation */}
        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-medium">
          <span className="text-pc-gold text-sm">📍</span> 
          <span className="truncate">{locationText}</span>
        </p>

        {/* Spécifications dynamiques */}
        <div className="flex items-center gap-6 border-t border-slate-50 pt-5 mb-6 flex-wrap">
          
          {/* Cas des terrains */}
          {property.category === 'Land' || property.category === 'Agricultural Land' ? (
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 uppercase tracking-widest">Total Area</span>
              <span className="text-xs text-slate-900 font-bold">{surfaceValue} {surfaceUnit}</span>
            </div>
          ) : 
          /* Cas des chambres */
          property.category === 'Room' ? (
            <>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Room Area</span>
                <span className="text-xs text-slate-900 font-bold">{surfaceValue} {surfaceUnit}</span>
              </div>
              {isFurnished !== undefined && (
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest">Status</span>
                  <span className="text-xs font-semibold flex items-center gap-1">
                    {isFurnished ? '🛋️ Furnished' : '📦 Unfurnished'}
                  </span>
                </div>
              )}
            </>
          ) : 
          /* Cas des parkings */
          property.category === 'Parking' ? (
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 uppercase tracking-widest">Parking Spots</span>
              <span className="text-xs text-slate-900 font-bold">{surfaceValue || 1} spots</span>
            </div>
          ) : 
          /* Cas des maisons, appartements, villas, duplex, commerces */
          (
            <>
              {bedrooms > 0 && (
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest">Beds</span>
                  <span className="text-xs text-slate-900 font-bold">{bedrooms}</span>
                </div>
              )}
              {bathrooms > 0 && (
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest">Baths</span>
                  <span className="text-xs text-slate-900 font-bold">{bathrooms}</span>
                </div>
              )}
              {surfaceValue > 0 && (
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest">Area</span>
                  <span className="text-xs text-slate-900 font-bold">{surfaceValue} {surfaceUnit}</span>
                </div>
              )}
              {/* Statut meublé pour les propriétés résidentielles */}
              {showFurnishedStatus && isFurnished !== undefined && (
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest">Status</span>
                  <span className="text-xs font-semibold flex items-center gap-1">
                    {isFurnished ? '🛋️ Furnished' : '📦 Unfurnished'}
                  </span>
                </div>
              )}
            </>
          )}
          
          {/* Badge Verified */}
          <div className="ml-auto flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 bg-pc-green rounded-full animate-pulse"></div>
            <span className="text-[8px] uppercase font-black tracking-tighter text-pc-green">Verified</span>
          </div>
        </div>

        {/* Bouton Détail - Version 1: Link (recommendée) */}
        {propertyId ? (
          <Link 
            to={`/real-estate/${propertyId}`} 
            className="block w-full text-center border border-slate-900 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 rounded-lg"
          >
            View Full Details
          </Link>
        ) : (
          // Fallback: bouton avec navigate manuel
          <button
            onClick={handleViewDetails}
            className="block w-full text-center border border-slate-900 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 rounded-lg cursor-pointer"
          >
            View Full Details
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;