import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, School, ShoppingBasket, 
  Fuel, Coffee, CheckCircle2, Share2, Printer, 
  Maximize, Bed, Bath, Car, X, ChevronLeft, ChevronRight,
  Heart, Phone, Mail, MessageCircle, ExternalLink
} from 'lucide-react';
import { MOCK_PROPERTIES } from '../data/properties';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const property = MOCK_PROPERTIES.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Collection de toutes les images (principale + galerie)
  const allImages = property ? [
    property.image,
    ...(property.gallery || [])
  ].filter(Boolean) : [];

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setSelectedImage(allImages[index]);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Asset Not Found</h2>
          <Link to="/real-estate" className="text-amber-600 uppercase text-[10px] font-black tracking-widest">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  const isLand = property.type === 'land' || property.type === 'field';
  
  // Données par défaut pour les biens sans amenities
  const defaultAmenities = {
    schools: { count: 0, names: [] },
    markets: { count: 0, names: [] },
    stations: { count: 0, names: [] },
    bakeries: { count: 0, names: [] }
  };
  
  const amenities = property.amenities || defaultAmenities;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors z-10"
          >
            <X size={32} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 transition-colors z-10 bg-black/50 rounded-full p-2"
          >
            <ChevronLeft size={40} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 transition-colors z-10 bg-black/50 rounded-full p-2"
          >
            <ChevronRight size={40} />
          </button>
          <img 
            src={selectedImage} 
            alt="Gallery" 
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}

      {/* 1. NAVIGATION ACTIONS */}
      <nav className="pt-32 pb-6 px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/real-estate" className="flex items-center text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] group">
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Catalog
          </Link>
          <div className="flex gap-6 text-slate-400">
            <button className="hover:text-amber-600 transition-colors"><Share2 size={16} /></button>
            <button className="hover:text-amber-600 transition-colors"><Printer size={16} /></button>
            <button className="hover:text-red-500 transition-colors"><Heart size={16} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* 2. HEADER: TITRE & PRIX */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="bg-amber-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                {property.status === 'sale' ? 'For Sale' : 'For Lease'}
              </span>
              {property.featured && (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                  ⭐ Featured
                </span>
              )}
              <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                Ref: #PC-00{property.id}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-[1.1] uppercase tracking-tighter mb-4">
              {property.title}
            </h1>
            <p className="flex items-center text-slate-500 font-light tracking-wide italic">
              <MapPin size={18} className="mr-2 text-amber-600" /> {property.location}
            </p>
          </div>

          <div className="bg-slate-900 p-8 text-white min-w-[320px] rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full -translate-y-12 translate-x-12"></div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 font-bold">Inquiry Price</p>
            <div className="text-4xl font-bold text-amber-500">
              {property.price} <span className="text-xs font-light text-white/50 ml-1 uppercase">XAF</span>
            </div>
            {!isLand && <p className="text-[9px] text-white/30 uppercase mt-2 italic font-medium tracking-tighter">Conditions apply / monthly basis</p>}
            <div className="flex items-center gap-2 mt-6 py-3 border-t border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Certified Legal Title</span>
            </div>
          </div>
        </div>

        {/* 3. GALLERY GRID MODERNE */}
        <div className="mb-20">
          {/* Image principale */}
          <div 
            className="relative w-full h-[500px] md:h-[600px] overflow-hidden cursor-pointer group mb-4 rounded-xl"
            onClick={() => openLightbox(0)}
          >
            <img 
              src={property.image} 
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Maximize size={16} /> View Gallery
              </div>
            </div>
          </div>

          {/* Miniatures - uniquement si plus d'images */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {allImages.slice(1, 7).map((img, index) => (
                <div 
                  key={index}
                  className="relative aspect-square overflow-hidden cursor-pointer rounded-lg group"
                  onClick={() => openLightbox(index + 1)}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                </div>
              ))}
              {allImages.length > 7 && (
                <div 
                  className="relative aspect-square overflow-hidden cursor-pointer rounded-lg bg-slate-100 flex items-center justify-center"
                  onClick={() => openLightbox(7)}
                >
                  <span className="text-slate-600 text-sm font-medium">+{allImages.length - 7} more</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* 4. CONTENT AREA (LEFT) */}
          <div className="lg:col-span-2 space-y-20">
            
            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10 border-y border-slate-100">
              {isLand ? (
                <SpecItem icon={<Maximize size={20}/>} label="Total Area" value={property.surface || property.size || 'N/A'} />
              ) : (
                <>
                  <SpecItem icon={<Bed size={20}/>} label="Bedrooms" value={property.beds || 0} />
                  <SpecItem icon={<Bath size={20}/>} label="Bathrooms" value={property.baths || 0} />
                  <SpecItem icon={<Maximize size={20}/>} label="Total Surface" value={property.surface || 'N/A'} />
                  <SpecItem icon={<Car size={20}/>} label="Parking" value={property.hasParking ? '✓ Yes' : '—'} />
                </>
              )}
            </div>

            {/* Description */}
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8 border-l-4 border-amber-600 pl-5">Property Narrative</h2>
              <div className="text-slate-600 text-lg leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                {property.description || "No description available for this property."}
              </div>
            </section>

            {/* NEIGHBORHOOD ANALYSIS - UNIQUEMENT SI DES DONNÉES EXISTENT */}
            {(amenities.schools.count > 0 || amenities.markets.count > 0 || amenities.stations.count > 0 || amenities.bakeries.count > 0) && (
              <section className="bg-slate-50 p-10 md:p-16 rounded-xl">
                <div className="text-center mb-16">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 mb-3">Strategic Proximity</h2>
                  <div className="w-12 h-1 bg-amber-600 mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                  <AmenityBox icon={<School />} title="Education" data={amenities.schools} />
                  <AmenityBox icon={<ShoppingBasket />} title="Markets" data={amenities.markets} />
                  <AmenityBox icon={<Fuel />} title="Energy/Fuel" data={amenities.stations} />
                  <AmenityBox icon={<Coffee />} title="Gastronomy" data={amenities.bakeries} />
                </div>
              </section>
            )}
          </div>

          {/* 5. SIDEBAR (CONTACT) - AMÉLIORÉ */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Carte de contact */}
              <div className="bg-white border border-slate-200 p-8 shadow-xl rounded-xl">
                <h3 className="text-xl font-serif text-slate-900 mb-6 italic">Secure this Asset</h3>
                
                {/* Prix récapitulatif */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <p className="text-3xl font-bold text-amber-600">{property.price} <span className="text-sm text-slate-400 font-normal">XAF</span></p>
                  <p className="text-xs text-slate-400 mt-1">{property.status === 'sale' ? 'Sale price' : 'Monthly rent'}</p>
                </div>
                
                <form className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg text-[12px] focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" 
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg text-[12px] focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg text-[12px] focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" 
                  />
                  <textarea 
                    placeholder="Message or specific requirements..." 
                    rows="3" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg text-[12px] focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  ></textarea>
                  <button className="w-full bg-slate-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-amber-600 transition-all duration-500">
                    Request Private Viewing
                  </button>
                </form>
              </div>
              
              {/* Coordonnées directes */}
              <div className="p-8 border border-slate-100 bg-slate-50/50 rounded-xl text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Direct Channel</p>
                <p className="text-xl font-serif text-slate-900 mb-3">+237 6XX XXX XXX</p>
                <div className="flex justify-center gap-4">
                  <button className="p-2 bg-white rounded-full shadow-sm hover:bg-green-500 hover:text-white transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-500 hover:text-white transition-colors">
                    <Mail size={18} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-sm hover:bg-green-600 hover:text-white transition-colors">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
              
              {/* Agent info si disponible */}
              {property.agent && (
                <div className="p-6 border border-slate-100 bg-white rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl">
                    {property.agent.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{property.agent.name}</p>
                    <p className="text-[9px] text-slate-400">{property.agent.agency || 'Independent Agent'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-[9px] text-slate-500">{property.agent.rating || '4.5'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* --- MINI COMPOSANTS --- */

const SpecItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="text-amber-600 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>
    <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">{label}</span>
    <span className="text-sm text-slate-900 font-bold tracking-tighter">{value}</span>
  </div>
);

const AmenityBox = ({ icon, title, data }) => (
  <div className="flex gap-5">
    <div className="shrink-0 w-12 h-12 bg-white flex items-center justify-center text-amber-600 shadow-sm border border-slate-100 rounded-lg">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="text-[10px] font-black uppercase text-slate-900 mb-2 tracking-widest">{title}</h4>
      <p className="text-amber-600 text-[10px] font-bold mb-3">{data?.count || 0} Places Found</p>
      <ul className="space-y-2">
        {data?.names?.map((name, i) => (
          <li key={i} className="flex items-center text-[11px] text-slate-500 font-medium">
            <CheckCircle2 size={10} className="mr-2 text-emerald-500 shrink-0" /> {name}
          </li>
        ))}
        {(!data?.names || data.names.length === 0) && <li className="text-[10px] text-slate-400 italic font-light">No data available for this zone</li>}
      </ul>
    </div>
  </div>
);

export default PropertyDetailsPage;