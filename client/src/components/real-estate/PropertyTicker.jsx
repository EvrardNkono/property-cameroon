// frontend/src/components/real-estate/PropertyTicker.jsx
import React, { useState, useEffect, useRef } from 'react';
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

const PropertyTicker = ({ properties, interval = 20000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible]       = useState(true);
  const [animState, setAnimState]       = useState('visible'); 
  // 'enter' → entre depuis droite
  // 'visible' → au repos au coin bas-droit
  // 'exit' → sort vers la gauche

  const indexRef   = useRef(0);
  const timerRef   = useRef(null);

  const published = properties?.filter(p => p.status === 'PUBLISHED') || [];

  // Cycle : attendre interval → sortir → changer → entrer → attendre…
  useEffect(() => {
    if (!isVisible || published.length < 2) return;

    const cycle = () => {
      // 1. Sortir vers la gauche
      setAnimState('exit');

      setTimeout(() => {
        // 2. Changer de propriété (invisible pendant le transit)
        indexRef.current = (indexRef.current + 1) % published.length;
        setCurrentIndex(indexRef.current);

        // 3. Positionner à droite (hors écran) sans transition
        setAnimState('hidden');

        setTimeout(() => {
          // 4. Entrer depuis la droite
          setAnimState('enter');

          setTimeout(() => {
            // 5. Au repos
            setAnimState('visible');
          }, 700);

        }, 50); // petit délai pour que le navigateur applique 'hidden' avant 'enter'

      }, 700); // durée de la sortie
    };

    timerRef.current = setInterval(cycle, interval);
    return () => clearInterval(timerRef.current);
  }, [isVisible, published.length, interval]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimState('exit');
    setTimeout(() => setIsVisible(false), 700);
    clearInterval(timerRef.current);
  };

  if (!isVisible || !published.length) return null;

  const prop     = published[currentIndex];
  const isSale   = prop.listingType === 'sale';
  const price    = prop.price?.amount?.toLocaleString() || 0;
  const location = prop.location?.city || '';
  const imageUrl = getImageUrl(prop.images?.[0] || prop.image);

  // Transform selon l'état
  const transforms = {
    hidden:  'translateX(120vw)',
    enter:   'translateX(0)',
    visible: 'translateX(0)',
    exit:    'translateX(-120vw)',
  };

  const transitions = {
    hidden:  'none',
    enter:   'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
    visible: 'none',
    exit:    'transform 700ms cubic-bezier(0.55, 0, 1, 0.45)',
  };

  return (
    <div
      style={{
        position:   'fixed',
        bottom:     24,
        right:      0,
        zIndex:     9999,
        transform:  transforms[animState],
        transition: transitions[animState],
      }}
    >
      <Link
        to={`/real-estate/${prop._id || prop.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{
          background:   'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px 0 0 16px',
          boxShadow:    '0 8px 32px rgba(0,0,0,0.12)',
          border:       '1px solid #f1f5f9',
          borderRight:  'none',
          display:      'flex',
          alignItems:   'center',
          gap:          12,
          padding:      '10px 20px 10px 12px',
          minWidth:     260,
          position:     'relative',
        }}>

          {/* Fermer */}
          <button
            onClick={handleClose}
            style={{
              position:   'absolute',
              top:        4,
              right:      6,
              width:      18,
              height:     18,
              borderRadius: '50%',
              background: '#f1f5f9',
              border:     'none',
              cursor:     'pointer',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding:    0,
            }}
          >
            <X size={10} color="#94a3b8" />
          </button>

          {/* Image */}
          <div style={{
            width: 48, height: 48,
            borderRadius: 10,
            overflow: 'hidden',
            background: '#f1f5f9',
            flexShrink: 0,
          }}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={prop.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Infos */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: '#1e293b',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {prop.title.length > 28 ? prop.title.substring(0, 28) + '…' : prop.title}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: isSale ? '#b8962e' : '#16a34a', marginTop: 2 }}>
              {price} FCFA
              {!isSale && <span style={{ fontSize: 10, fontWeight: 400, color: '#94a3b8' }}> /mois</span>}
            </div>

            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                <MapPin size={9} color="#94a3b8" />
                <span style={{ fontSize: 10, color: '#94a3b8' }}>
                  {location.length > 18 ? location.substring(0, 18) + '…' : location}
                </span>
              </div>
            )}

            <span style={{
              display: 'inline-block', marginTop: 3,
              fontSize: 9, fontWeight: 700,
              padding: '2px 6px', borderRadius: 99,
              background: isSale ? '#fef3c7' : '#dcfce7',
              color: isSale ? '#92400e' : '#166534',
            }}>
              {isSale ? 'VENTE' : 'LOCATION'}
            </span>
          </div>

          <ChevronRight size={14} color="#cbd5e1" />
        </div>
      </Link>
    </div>
  );
};

export default PropertyTicker;