// frontend/src/pages/RealEstate.jsx
import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/real-estate/PropertyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// 🔥 Détection automatique de l'environnement (AJOUTE CES 7 LIGNES)
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement (AJOUTE CES 3 LIGNES)
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'           // URL locale
  : 'https://property-cameroon-backend.vercel.app';  // URL de production

const RealEstate = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // 🔥 Console.log pour debug (optionnel)
      console.log(`🌍 RealEstate - Environnement: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
      console.log(`🔗 RealEstate - Backend URL: ${BACKEND_URL}`);
      
      const response = await api.getProperties({ status: 'PUBLISHED' });
      setProperties(response.properties || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fonction pour obtenir l'URL complète de l'image avec BACKEND_URL dynamique
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/properties/${image}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pc-gold"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-32">
          <p className="text-red-600">Error: {error}</p>
          <button onClick={fetchProperties} className="mt-4 px-4 py-2 bg-pc-gold text-white rounded">
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-4">Real Estate Portfolio</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our exclusive collection of certified properties across Cameroon's prime locations.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              const imageUrl = getImageUrl(property.images?.[0]);
              
              return (
                <PropertyCard 
                  key={property._id}
                  property={{
                    id: property._id,
                    title: property.title,
                    image: imageUrl || 'https://via.placeholder.com/400x300',
                    status: property.status === 'PUBLISHED' ? 'sale' : 'lease',
                    category: property.category,
                    price: `${property.price?.amount?.toLocaleString() || 0}`,
                    location: `${property.location?.city || ''}, ${property.location?.region || ''}`,
                    type: property.category?.toLowerCase() === 'land' ? 'land' : 'building',
                    size: property.surface?.value || 0,
                    beds: property.features?.bedrooms || 3,
                    baths: property.features?.bathrooms || 2
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RealEstate;