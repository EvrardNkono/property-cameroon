// frontend/src/pages/PropertyDetailsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, School, ShoppingBasket, 
  Fuel, Coffee, CheckCircle2, Share2, Printer, 
  Maximize, Bed, Bath, Car, Loader2,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// Hook pour récupérer la langue actuelle
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

// 🔥 Détection automatique de l'environnement
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const currentLang = useCurrentLang();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [autoAmenities, setAutoAmenities] = useState({
    schools:  { count: 0, names: [], source: 'backend', hasOwnerData: false, hasAutoData: false },
    markets:  { count: 0, names: [], source: 'backend', hasOwnerData: false, hasAutoData: false },
    stations: { count: 0, names: [], source: 'backend', hasOwnerData: false, hasAutoData: false },
    bakeries: { count: 0, names: [], source: 'backend', hasOwnerData: false, hasAutoData: false }
  });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Navigation
      backToCatalog: "Retour au catalogue",
      
      // Status
      forSale: "À VENDRE",
      forRent: "À LOUER",
      ref: "Réf",
      inquiryPrice: "Prix sur demande",
      perMonth: "par mois",
      includingFees: "frais inclus",
      certifiedLegalTitle: "Titre foncier certifié",
      
      // Specs
      totalArea: "Superficie totale",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      totalSurface: "Surface totale",
      parking: "Stationnement",
      available: "Disponible",
      nA: "N/A",
      
      // Sections
      propertyNarrative: "Description du bien",
      strategicProximity: "Proximité stratégique",
      education: "Éducation",
      markets: "Commerces",
      energyFuel: "Énergie/Carburant",
      gastronomy: "Gastronomie",
      
      // Sidebar
      secureThisAsset: "Sécurisez ce bien",
      fullName: "Nom complet",
      professionalEmail: "Email professionnel",
      specificRequirements: "Besoins spécifiques...",
      requestPrivateViewing: "Demander une visite privée",
      sending: "Envoi en cours...",
      requestSent: "Demande envoyée avec succès !",
      errorSending: "Erreur, veuillez réessayer.",
      
      // Furnishing
      furnishingStatus: "État d'ameublement",
      fullyFurnished: "🛋️ Entièrement meublé",
      unfurnished: "📦 Non meublé",
      
      // Amenities
      placesFound: "Lieux trouvés",
      noDataAvailable: "Aucune donnée disponible pour cette zone",
      ownerInfo: "Info propriétaire",
      
      // Errors
      propertyNotFound: "Bien non trouvé",
      loadingProperty: "Chargement des détails du bien...",
      assetNotFound: "Actif non trouvé",
      propertyDoesNotExist: "Ce bien n'existe pas",
      returnToCatalog: "Retour au catalogue",
      
      // Gallery
      viewLabel: "Vue",
      
      // Copy link
      linkCopied: "Lien copié dans le presse-papier !"
    },
    en: {
      // Navigation
      backToCatalog: "Back to Catalog",
      
      // Status
      forSale: "FOR SALE",
      forRent: "FOR RENT",
      ref: "Ref",
      inquiryPrice: "Inquiry Price",
      perMonth: "per month",
      includingFees: "including fees",
      certifiedLegalTitle: "Certified Legal Title",
      
      // Specs
      totalArea: "Total Area",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      totalSurface: "Total Surface",
      parking: "Parking",
      available: "Available",
      nA: "N/A",
      
      // Sections
      propertyNarrative: "Property Narrative",
      strategicProximity: "Strategic Proximity",
      education: "Education",
      markets: "Markets",
      energyFuel: "Energy/Fuel",
      gastronomy: "Gastronomy",
      
      // Sidebar
      secureThisAsset: "Secure this Asset",
      fullName: "Full Name",
      professionalEmail: "Professional Email",
      specificRequirements: "Specific Requirements...",
      requestPrivateViewing: "Request Private Viewing",
      sending: "Sending...",
      requestSent: "Request sent successfully!",
      errorSending: "Error, please try again.",
      
      // Furnishing
      furnishingStatus: "Furnishing Status",
      fullyFurnished: "🛋️ Fully Furnished",
      unfurnished: "📦 Unfurnished",
      
      // Amenities
      placesFound: "Places Found",
      noDataAvailable: "No data available for this area",
      ownerInfo: "Owner info",
      
      // Errors
      propertyNotFound: "Property not found",
      loadingProperty: "Loading property details...",
      assetNotFound: "Asset Not Found",
      propertyDoesNotExist: "Property does not exist",
      returnToCatalog: "Return to Catalog",
      
      // Gallery
      viewLabel: "View",
      
      // Copy link
      linkCopied: "Link copied to clipboard!"
    }
  }[currentLang] || {
    // Fallback français
    backToCatalog: "Retour au catalogue",
    forSale: "À VENDRE",
    forRent: "À LOUER",
    ref: "Réf",
    inquiryPrice: "Prix sur demande",
    perMonth: "par mois",
    includingFees: "frais inclus",
    certifiedLegalTitle: "Titre foncier certifié",
    totalArea: "Superficie totale",
    bedrooms: "Chambres",
    bathrooms: "Salles de bain",
    totalSurface: "Surface totale",
    parking: "Stationnement",
    available: "Disponible",
    nA: "N/A",
    propertyNarrative: "Description du bien",
    strategicProximity: "Proximité stratégique",
    education: "Éducation",
    markets: "Commerces",
    energyFuel: "Énergie/Carburant",
    gastronomy: "Gastronomie",
    secureThisAsset: "Sécurisez ce bien",
    fullName: "Nom complet",
    professionalEmail: "Email professionnel",
    specificRequirements: "Besoins spécifiques...",
    requestPrivateViewing: "Demander une visite privée",
    sending: "Envoi en cours...",
    requestSent: "Demande envoyée avec succès !",
    errorSending: "Erreur, veuillez réessayer.",
    furnishingStatus: "État d'ameublement",
    fullyFurnished: "🛋️ Entièrement meublé",
    unfurnished: "📦 Non meublé",
    placesFound: "Lieux trouvés",
    noDataAvailable: "Aucune donnée disponible pour cette zone",
    ownerInfo: "Info propriétaire",
    propertyNotFound: "Bien non trouvé",
    loadingProperty: "Chargement des détails du bien...",
    assetNotFound: "Actif non trouvé",
    propertyDoesNotExist: "Ce bien n'existe pas",
    returnToCatalog: "Retour au catalogue",
    viewLabel: "Vue",
    linkCopied: "Lien copié dans le presse-papier !"
  };

  // 🔥 Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    if (image.startsWith('data:')) return image;
    return `${BACKEND_URL}/uploads/properties/${image}`;
  };

  // ✅ useCallback avec seulement [id] comme dépendance — plus de boucle infinie
  const fetchPropertyDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🌍 Environment: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
      console.log(`🔍 Loading property ID: ${id}`);
      console.log(`🌐 Current language: ${currentLang}`);

      // Ajouter la langue à la requête
      const response = await api.getPropertyById(id, { lang: currentLang });
      console.log(`📦 Raw API response:`, response);

      // Extraire la propriété selon la structure de la réponse
      let prop = response;
      if (response?.property) prop = response.property;
      if (response?.data?.property) prop = response.data.property;

      if (!prop) throw new Error(t.propertyNotFound);

      console.log(`✅ Property loaded: ${prop.title}`);

      // Traiter les images
      const allImages = (prop.images || []).map(img => getImageUrl(img)).filter(Boolean);

      const formattedProperty = {
        id:           prop._id || prop.id,
        title:        prop.title || 'Property',
        location:     `${prop.location?.city || ''}, ${prop.location?.region || ''}`,
        price:        prop.price?.amount?.toLocaleString() || '0',
        status:       prop.listingType === 'sale' ? 'sale' : 'rent',
        type:         prop.category?.toLowerCase() || 'property',
        size:         prop.surface?.value || 0,
        surface:      `${prop.surface?.value || 0} ${prop.surface?.unit || 'm²'}`,
        beds:         prop.features?.bedrooms || 0,
        baths:        prop.features?.bathrooms || 0,
        description:  prop.description || 'No description available',
        images:       allImages.length > 0
                        ? allImages
                        : ['https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop'],
        coordinates:  prop.location?.coordinates || null,
        owner:        prop.owner || null,
        ownerAmenities: prop.amenities || null,
        isFurnished:  prop.features?.isFurnished  || false,
        hasParking:   prop.features?.hasParking   || false,
        hasGarden:    prop.features?.hasGarden    || false,
        hasElectricity: prop.features?.hasElectricity || false,
        hasWater:     prop.features?.hasWater     || false,
        hasElevator:  prop.features?.hasElevator  || false,
        hasBalcony:   prop.features?.hasBalcony   || false,
        floor:        prop.features?.floor        || null
      };

      setProperty(formattedProperty);
      setCurrentImageIndex(0);

      // Charger les amenities depuis le backend si disponibles
      if (prop.amenities) {
        setAutoAmenities({
          schools:  { count: prop.amenities.schools?.count  || 0, names: prop.amenities.schools?.names  || [], source: 'backend', hasOwnerData: true, hasAutoData: false },
          markets:  { count: prop.amenities.markets?.count  || 0, names: prop.amenities.markets?.names  || [], source: 'backend', hasOwnerData: true, hasAutoData: false },
          stations: { count: prop.amenities.stations?.count || 0, names: prop.amenities.stations?.names || [], source: 'backend', hasOwnerData: true, hasAutoData: false },
          bakeries: { count: prop.amenities.bakeries?.count || 0, names: prop.amenities.bakeries?.names || [], source: 'backend', hasOwnerData: true, hasAutoData: false }
        });
      }

    } catch (err) {
      console.error('❌ Error fetching property details:', err);
      setError(err.response?.data?.message || err.message || t.propertyNotFound);
    } finally {
      setLoading(false);
    }
  }, [id, currentLang, t.propertyNotFound]);

  // ✅ UN SEUL useEffect propre — réinitialise et recharge quand l'id change
  useEffect(() => {
    setProperty(null);
    setError(null);
    setCurrentImageIndex(0);
    setLightboxOpen(false);
    window.scrollTo(0, 0);
    fetchPropertyDetails();
  }, [id, fetchPropertyDetails]);

  // Navigation des images
  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex(prev => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
    if (lightboxOpen) setLightboxOpen(false);
  };

  // Envoi de la demande de contact
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      await api.createInquiry({
        property:      property.id,
        propertyTitle: property.title,
        name:          formData.name,
        email:         formData.email,
        message:       formData.message,
        lang:          currentLang
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus(null), 3000);
    } catch (err) {
      console.error('Error sending inquiry:', err);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property?.title, text: property?.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t.linkCopied);
    }
  };

  const handlePrint = () => window.print();

  // --- ÉTATS DE CHARGEMENT ---

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Loader2 size={48} className="text-pc-gold animate-spin mb-4" />
          <p className="text-slate-500 text-sm ml-3">{t.loadingProperty}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center font-serif">
          <div className="text-center">
            <h2 className="text-2xl mb-4">{t.assetNotFound}</h2>
            <p className="text-slate-500 mb-6">{error || t.propertyDoesNotExist}</p>
            <Link to="/real-estate" className="text-pc-gold uppercase text-[10px] font-black tracking-widest">
              {t.returnToCatalog}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isLand = property.type === 'land' || property.type === 'field' || property.type === 'agricultural land';
  const currentImage = property.images?.[currentImageIndex] || property.images?.[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Lightbox Modal */}
      {lightboxOpen && property.images && property.images.length > 0 && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={40} />
          </button>
          <img
            src={currentImage}
            alt={property.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight size={40} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>
      )}

      {/* 1. NAVIGATION ACTIONS */}
      <nav className="pt-32 pb-6 px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/real-estate"
            className="flex items-center text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] group"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t.backToCatalog}
          </Link>
          <div className="flex gap-6 text-slate-400">
            <button onClick={handleShare}  className="hover:text-pc-gold transition-colors"><Share2  size={16} /></button>
            <button onClick={handlePrint}  className="hover:text-pc-gold transition-colors"><Printer size={16} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">

        {/* 2. HEADER: TITRE & PRIX */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white ${property.status === 'sale' ? 'bg-pc-gold' : 'bg-slate-900'}`}>
                {property.status === 'sale' ? t.forSale : t.forRent}
              </span>
              <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                {t.ref}: #PC-{property.id?.slice(-6) || property.id?.substring(0, 6)}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-[1.1] uppercase tracking-tighter mb-4">
              {property.title}
            </h1>
            <p className="flex items-center text-slate-500 font-light tracking-wide italic">
              <MapPin size={18} className="mr-2 text-pc-gold" /> {property.location}
            </p>
          </div>

          <div className="bg-slate-900 p-8 text-white min-w-[320px] rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pc-gold/10 rounded-full -translate-y-12 translate-x-12"></div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 font-bold">{t.inquiryPrice}</p>
            <div className="text-4xl font-bold text-pc-gold">
              {property.price} <span className="text-xs font-light text-white/50 ml-1 uppercase">XAF</span>
            </div>
            {!isLand && property.status === 'rent' && (
              <p className="text-[9px] text-white/30 uppercase mt-2 italic font-medium tracking-tighter">{t.perMonth}</p>
            )}
            {!isLand && property.status === 'sale' && (
              <p className="text-[9px] text-white/30 uppercase mt-2 italic font-medium tracking-tighter">{t.includingFees}</p>
            )}
            <div className="flex items-center gap-2 mt-6 py-3 border-t border-white/10">
              <div className="w-2 h-2 bg-pc-green rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-pc-green">{t.certifiedLegalTitle}</span>
            </div>
          </div>
        </div>

        {/* 3. GALLERY */}
        <div className="mb-20">
          <div className="relative h-[500px] md:h-[650px] rounded-2xl overflow-hidden mb-4">
            <img
              src={currentImage || 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop'}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
              }}
              onClick={() => property.images && property.images.length > 0 && setLightboxOpen(true)}
            />
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            {property.images && property.images.length > 0 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            )}
          </div>

          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 md:gap-4">
              {property.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => goToImage(idx)}
                  className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    currentImageIndex === idx ? 'ring-2 ring-pc-gold scale-95' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${t.viewLabel} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1594759714300-8456f9f68800?q=80&w=2070&auto=format&fit=crop';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. CONTENU PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10 border-y border-slate-100">
              {isLand ? (
                <SpecItem icon={<Maximize size={20}/>} label={t.totalArea} value={`${property.size} m²`} t={t} />
              ) : (
                <>
                  {property.beds  > 0 && <SpecItem icon={<Bed      size={20}/>} label={t.bedrooms}      value={property.beds} t={t} />}
                  {property.baths > 0 && <SpecItem icon={<Bath     size={20}/>} label={t.bathrooms}     value={property.baths} t={t} />}
                  <SpecItem icon={<Maximize size={20}/>} label={t.totalSurface} value={property.surface} t={t} />
                  <SpecItem icon={<Car      size={20}/>} label={t.parking}       value={property.hasParking ? t.available : t.nA} t={t} />
                </>
              )}
            </div>

            {/* Description */}
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8 border-l-4 border-pc-gold pl-5">
                {t.propertyNarrative}
              </h2>
              <div className="text-slate-600 text-lg leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                {property.description}
              </div>
            </section>

            {/* Amenities */}
            <section className="bg-slate-50 p-10 md:p-16 rounded-sm">
              <div className="text-center mb-16">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 mb-3">{t.strategicProximity}</h2>
                <div className="w-12 h-1 bg-pc-gold mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                <AmenityBox icon={<School          />} title={t.education}  data={autoAmenities.schools}  hasOwnerData={autoAmenities.schools?.hasOwnerData} t={t} />
                <AmenityBox icon={<ShoppingBasket  />} title={t.markets}    data={autoAmenities.markets}  hasOwnerData={autoAmenities.markets?.hasOwnerData} t={t} />
                <AmenityBox icon={<Fuel            />} title={t.energyFuel} data={autoAmenities.stations} hasOwnerData={autoAmenities.stations?.hasOwnerData} t={t} />
                <AmenityBox icon={<Coffee          />} title={t.gastronomy} data={autoAmenities.bakeries} hasOwnerData={autoAmenities.bakeries?.hasOwnerData} t={t} />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white border border-slate-200 p-8 shadow-2xl shadow-slate-200/50">
                <h3 className="text-xl font-serif text-slate-900 mb-6 italic">{t.secureThisAsset}</h3>
                <form className="space-y-4" onSubmit={handleContactSubmit}>
                  <input
                    type="text" name="name" placeholder={t.fullName}
                    value={formData.name} onChange={handleInputChange} required
                    className="w-full p-4 bg-slate-50 border-none text-[12px] focus:ring-1 focus:ring-pc-gold outline-none transition-all"
                  />
                  <input
                    type="email" name="email" placeholder={t.professionalEmail}
                    value={formData.email} onChange={handleInputChange} required
                    className="w-full p-4 bg-slate-50 border-none text-[12px] focus:ring-1 focus:ring-pc-gold outline-none transition-all"
                  />
                  <textarea
                    name="message" placeholder={t.specificRequirements} rows="4"
                    value={formData.message} onChange={handleInputChange}
                    className="w-full p-4 bg-slate-50 border-none text-[12px] focus:ring-1 focus:ring-pc-gold outline-none transition-all"
                  />
                  <button
                    type="submit" disabled={formStatus === 'loading'}
                    className="w-full bg-slate-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pc-gold transition-all duration-500 disabled:opacity-50"
                  >
                    {formStatus === 'loading' ? t.sending : t.requestPrivateViewing}
                  </button>
                  {formStatus === 'success' && <p className="text-green-600 text-[10px] text-center">{t.requestSent}</p>}
                  {formStatus === 'error'   && <p className="text-red-600   text-[10px] text-center">{t.errorSending}</p>}
                </form>
              </div>

              {property.isFurnished !== undefined && (
                <div className="p-8 border border-slate-100 bg-slate-50/30 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t.furnishingStatus}</p>
                  <p className="text-lg font-serif text-slate-900">
                    {property.isFurnished ? t.fullyFurnished : t.unfurnished}
                  </p>
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
const SpecItem = ({ icon, label, value, t }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="text-pc-gold mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>
    <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">{label}</span>
    <span className="text-sm text-slate-900 font-bold tracking-tighter">{value}</span>
  </div>
);

const AmenityBox = ({ icon, title, data, hasOwnerData, t }) => (
  <div className="flex gap-5">
    <div className="shrink-0 w-12 h-12 bg-white flex items-center justify-center text-pc-gold shadow-sm border border-slate-100">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest">{title}</h4>
        {hasOwnerData && (
          <span className="text-[7px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">{t.ownerInfo}</span>
        )}
      </div>
      <p className="text-pc-gold text-[10px] font-bold mb-3">{data?.count || 0} {t.placesFound}</p>
      <ul className="space-y-2">
        {data?.names?.slice(0, 5).map((name, i) => (
          <li key={i} className="flex items-center text-[11px] text-slate-500 font-medium">
            <CheckCircle2 size={10} className="mr-2 text-pc-green shrink-0" /> {name}
          </li>
        ))}
        {(!data?.count || data.count === 0) && (
          <li className="text-[10px] text-slate-400 italic font-light">{t.noDataAvailable}</li>
        )}
      </ul>
    </div>
  </div>
);

export default PropertyDetailsPage;