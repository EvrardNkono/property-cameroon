// frontend/src/components/real-estate/PropertyTicker.jsx - Version avec Keyframes CSS
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, X } from 'lucide-react';

const isDevelopment = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BACKEND_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/properties/${image}`;
};

const PropertyTicker = ({ properties, interval = 10000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const published = properties?.filter(p => p.status === 'PUBLISHED') || [];
  
  if (!published.length) return null;

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationKey(prev => prev + 1);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % published.length);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, published.length]);

  const prop = published[currentIndex];
  const isSale = prop.listingType === 'sale';
  const price = prop.price?.amount?.toLocaleString() || 0;
  const location = prop.location?.city || '';
  const imageUrl = getImageUrl(prop.images?.[0] || prop.image);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideInFromRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOutToLeft {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(-100%);
              opacity: 0;
            }
          }
          
          .animate-slide-in {
            animation: slideInFromRight 0.5s ease-out forwards;
          }
          
          .animate-slide-out {
            animation: slideOutToLeft 0.5s ease-in forwards;
          }
        `}
      </style>

      <div className="fixed bottom-6 right-0 z-50">
        <div key={animationKey} className="animate-slide-in">
          <Link to={`/real-estate/${prop._id || prop.id}`} className="block">
            <div className="bg-white/95 backdrop-blur-md rounded-l-xl shadow-2xl border border-slate-100 border-r-0 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
              
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-100 hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 z-10"
              >
                <X size={10} />
              </button>

              <div className="flex items-center gap-3 p-3 pr-8">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                    {prop.title}
                  </h4>

                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold ${isSale ? 'text-pc-gold' : 'text-pc-green'}`}>
                      {price} FCFA {!isSale && <span className="text-[9px]">/mois</span>}
                    </span>
                    {location && (
                      <>
                        <span className="text-slate-300 text-[8px]">•</span>
                        <div className="flex items-center gap-0.5">
                          <MapPin size={8} className="text-slate-400" />
                          <span className="text-[9px] text-slate-500 truncate max-w-[80px]">{location}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <span className={`inline-block mt-1 text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isSale ? 'bg-pc-gold/10 text-pc-gold' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSale ? 'VENTE' : 'LOCATION'}
                  </span>
                </div>

                <ChevronRight size={16} className="text-slate-300 group-hover:text-pc-gold transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PropertyTicker;