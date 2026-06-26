// frontend/src/pages/dashboard/properties/PropertyForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Trash2, Image as ImageIcon, Plus, X, 
  MapPin, Home, Maximize2, DollarSign, FileText,
  CheckCircle2, Loader2, Upload, Building2,
  School, ShoppingBasket, Fuel, Coffee, BedDouble,
  DoorOpen, Warehouse, Store, Briefcase, Trees,
  Hotel, Tent, Factory, ParkingCircle, Sofa,
  Tag, Calendar
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

// ✅ Environment detection for upload URL
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// 📸 Function to get full image URL
const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/properties/${image}`;
};

// 📸 Image compression function
const compressImage = (file, quality = 0.6, maxWidth = 1024) => {
  return new Promise((resolve) => {
    if (file.size < 500 * 1024) {
      resolve(file);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          console.log(`📸 Compression: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
    };
  });
};

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentLang, setCurrentLang] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'House',
    listingType: 'sale',
    description: '',
    location: {
      city: '',
      district: '',
      region: '',
      coordinates: { lat: '', lng: '' }
    },
    surface: {
      value: '',
      unit: 'm²'
    },
    price: {
      amount: '',
      currency: 'FCFA'
    },
    features: {
      hasElectricity: false,
      hasWater: false,
      hasRoad: false,
      isFenced: false,
      bedrooms: '',
      bathrooms: '',
      floor: '',           
      hasElevator: false,  
      hasBalcony: false,   
      isFurnished: false,  
      showWindow: false,   
      zone: '',            
      hasParking: false,   
      hasGarden: false,    
      landType: ''         
    },
    amenities: {
      schools: '',
      markets: '',
      stations: '',
      bakeries: ''
    },
    images: [],
    status: 'PENDING'
  });

  const [imageUrls, setImageUrls] = useState([]);

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      // Header
      editProperty: "Modifier la Propriété",
      addNewProperty: "Ajouter une Nouvelle Propriété",
      modifyDetails: "Modifiez les détails de votre propriété",
      listProperty: "Listez votre propriété sur le marketplace",
      delete: "Supprimer",
      
      // Sections
      basicInformation: "Informations de Base",
      title: "Titre *",
      titlePlaceholder: "ex: Villa de Luxe à Bastos",
      category: "Catégorie *",
      listingType: "Type d'Annonce *",
      forSale: "À Vendre",
      forRent: "À Louer",
      status: "Statut",
      pendingReview: "En Attente de Revue",
      published: "Publié",
      reserved: "Réservé",
      sold: "Vendu",
      description: "Description",
      descriptionPlaceholder: "Décrivez votre propriété...",
      
      // Location
      location: "Localisation",
      city: "Ville",
      cityPlaceholder: "Douala",
      district: "Quartier",
      districtPlaceholder: "Bonapriso",
      region: "Région",
      selectRegion: "Sélectionner une région",
      
      // Dimensions & Price
      dimensionsPrice: "Dimensions & Prix",
      surfaceArea: "Surface",
      price: "Prix",
      pricePerMonth: "Prix par mois",
      
      // Features
      features: "Caractéristiques",
      bedrooms: "Chambres",
      bathrooms: "Salles de Bain",
      electricity: "Électricité",
      water: "Eau",
      parking: "Parking",
      garden: "Jardin",
      elevator: "Ascenseur",
      balcony: "Balcon",
      furnishedStatus: "Statut Meublé",
      unfurnished: "📦 Non Meublé",
      furnished: "🛋️ Meublé",
      furnishedNote: "Optionnel - Précisez si la propriété est meublée",
      
      // Land
      landType: "Type de Terrain",
      selectLandType: "Sélectionner le type de terrain",
      buildable: "Constructible",
      agricultural: "Agricole",
      commercial: "Commercial",
      electricityNearby: "Électricité à proximité",
      waterNearby: "Eau à proximité",
      roadAccess: "Accès Routier",
      fenced: "Clôturé",
      
      // Commercial
      commercialZone: "Zone Commerciale",
      selectZoneType: "Sélectionner le type de zone",
      residentialZone: "Zone Résidentielle",
      mixedZone: "Zone Mixte",
      showWindow: "Vitrine",
      hasShowWindow: "Avec Vitrine",
      noShowWindow: "Sans Vitrine",
      
      // Proximity
      strategicProximity: "Proximité Stratégique (Optionnel)",
      proximityNote: "Indiquez les points de repère à proximité. Laissez vide pour une détection automatique.",
      schoolsUniversities: "Écoles / Universités",
      schoolsPlaceholder: "ex: Lycée de Bastos, Université de Yaoundé II",
      marketsShopping: "Marchés / Commerces",
      marketsPlaceholder: "ex: Marché Central, Super U Bonapriso",
      gasStations: "Stations Essence / Carburant",
      stationsPlaceholder: "ex: Total Bonapriso, Oil Libya",
      bakeriesRestaurants: "Boulangeries / Restaurants",
      bakeriesPlaceholder: "ex: Boulangerie La Parisienne, Restaurant La Scala",
      
      // Images
      images: "Images",
      imagesNote: "Maximum 10 images. Téléchargez au format JPEG ou PNG.",
      addImage: "Ajouter une Image",
      existing: "Existante",
      
      // Buttons
      cancel: "Annuler",
      updateProperty: "Mettre à Jour la Propriété",
      createProperty: "Créer la Propriété",
      
      // Messages
      successUpdate: "Propriété mise à jour avec succès !",
      successCreate: "Propriété créée avec succès !",
      successDelete: "Propriété supprimée avec succès !",
      errorFetch: "Échec du chargement des données de la propriété",
      errorSave: "Échec de l'enregistrement de la propriété",
      errorDelete: "Échec de la suppression de la propriété",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.",
      maxImages: "Maximum 10 images autorisées. Vous avez actuellement {count} images.",
      errorCompress: "Erreur lors de la compression de l'image"
    },
    en: {
      // Header
      editProperty: "Edit Property",
      addNewProperty: "Add New Property",
      modifyDetails: "Modify your property details",
      listProperty: "List your property on the marketplace",
      delete: "Delete",
      
      // Sections
      basicInformation: "Basic Information",
      title: "Title *",
      titlePlaceholder: "e.g., Luxury Villa in Bastos",
      category: "Category *",
      listingType: "Listing Type *",
      forSale: "For Sale",
      forRent: "For Rent",
      status: "Status",
      pendingReview: "Pending Review",
      published: "Published",
      reserved: "Reserved",
      sold: "Sold",
      description: "Description",
      descriptionPlaceholder: "Describe your property...",
      
      // Location
      location: "Location",
      city: "City",
      cityPlaceholder: "Douala",
      district: "District",
      districtPlaceholder: "Bonapriso",
      region: "Region",
      selectRegion: "Select region",
      
      // Dimensions & Price
      dimensionsPrice: "Dimensions & Price",
      surfaceArea: "Surface Area",
      price: "Price",
      pricePerMonth: "Price per month",
      
      // Features
      features: "Features",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      electricity: "Electricity",
      water: "Water",
      parking: "Parking",
      garden: "Garden",
      elevator: "Elevator",
      balcony: "Balcony",
      furnishedStatus: "Furnished Status",
      unfurnished: "📦 Unfurnished",
      furnished: "🛋️ Furnished",
      furnishedNote: "Optional - Specify if the property comes with furniture",
      
      // Land
      landType: "Land Type",
      selectLandType: "Select land type",
      buildable: "Buildable",
      agricultural: "Agricultural",
      commercial: "Commercial",
      electricityNearby: "Electricity nearby",
      waterNearby: "Water nearby",
      roadAccess: "Road Access",
      fenced: "Fenced",
      
      // Commercial
      commercialZone: "Commercial Zone",
      selectZoneType: "Select zone type",
      residentialZone: "Residential Zone",
      mixedZone: "Mixed Zone",
      showWindow: "Show Window",
      hasShowWindow: "Has Show Window",
      noShowWindow: "No Show Window",
      
      // Proximity
      strategicProximity: "Strategic Proximity (Optional)",
      proximityNote: "Tell us about nearby landmarks. Leave empty for auto-detection from map data.",
      schoolsUniversities: "Schools / Universities",
      schoolsPlaceholder: "e.g., Lycée de Bastos, Université de Yaoundé II",
      marketsShopping: "Markets / Shopping",
      marketsPlaceholder: "e.g., Marché Central, Super U Bonapriso",
      gasStations: "Gas Stations / Fuel",
      stationsPlaceholder: "e.g., Total Bonapriso, Oil Libya",
      bakeriesRestaurants: "Bakeries / Restaurants",
      bakeriesPlaceholder: "e.g., Boulangerie La Parisienne, Restaurant La Scala",
      
      // Images
      images: "Images",
      imagesNote: "Maximum 10 images. Upload JPEG or PNG format.",
      addImage: "Add Image",
      existing: "Existing",
      
      // Buttons
      cancel: "Cancel",
      updateProperty: "Update Property",
      createProperty: "Create Property",
      
      // Messages
      successUpdate: "Property updated successfully!",
      successCreate: "Property created successfully!",
      successDelete: "Property deleted successfully!",
      errorFetch: "Failed to load property data",
      errorSave: "Failed to save property",
      errorDelete: "Failed to delete property",
      confirmDelete: "Are you sure you want to delete this property? This action cannot be undone.",
      maxImages: "Maximum {max} images allowed. You currently have {count} images.",
      errorCompress: "Error compressing image"
    }
  };

  // Récupérer la langue
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setCurrentLang(finalLang);
  }, []);

  const t = translations[currentLang] || translations.fr;

  const categories = [
    { id: 'House', label: '🏠 House', icon: <Home size={18} />, type: 'house' },
    { id: 'Villa', label: '🏛️ Villa', icon: <Hotel size={18} />, type: 'house' },
    { id: 'Duplex', label: '🏘️ Duplex', icon: <Building2 size={18} />, type: 'house' },
    { id: 'Apartment', label: '🏢 Apartment', icon: <Building2 size={18} />, type: 'apartment' },
    { id: 'Studio', label: '📐 Studio', icon: <DoorOpen size={18} />, type: 'apartment' },
    { id: 'Room', label: '🛏️ Room', icon: <BedDouble size={18} />, type: 'room' },
    { id: 'Land', label: '🗺️ Land', icon: <MapPin size={18} />, type: 'land' },
    { id: 'Agricultural Land', label: '🌾 Agricultural Land', icon: <Trees size={18} />, type: 'land' },
    { id: 'Commercial Space', label: '🏪 Commercial Space', icon: <Store size={18} />, type: 'commercial' },
    { id: 'Office', label: '💼 Office', icon: <Briefcase size={18} />, type: 'commercial' },
    { id: 'Warehouse', label: '📦 Warehouse', icon: <Warehouse size={18} />, type: 'commercial' },
    { id: 'Shop', label: '🛍️ Shop', icon: <ShoppingBasket size={18} />, type: 'commercial' },
    { id: 'Industrial Space', label: '🏭 Industrial Space', icon: <Factory size={18} />, type: 'other' },
    { id: 'Parking', label: '🅿️ Parking', icon: <ParkingCircle size={18} />, type: 'other' }
  ];

  const regions = [
    'Center', 'South', 'West', 'North-West', 'Littoral', 
    'Adamawa', 'North', 'Far-North', 'East'
  ];

  const getCurrentCategoryType = () => {
    const cat = categories.find(c => c.id === formData.category);
    return cat ? cat.type : 'other';
  };

  const categoryType = getCurrentCategoryType();
  const isLand = categoryType === 'land';
  const isHouse = categoryType === 'house';
  const isApartment = categoryType === 'apartment';
  const isRoom = categoryType === 'room';
  const isCommercial = categoryType === 'commercial';
  const isOther = categoryType === 'other';

  const isResidential = isHouse || isApartment || isRoom;

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setFetching(true);
      const response = await api.getPropertyById(id);
      const property = response.property;
      
      const normalizedImages = (property.images || []).map(img => getImageUrl(img));
      
      setFormData({
        title: property.title || '',
        category: property.category || 'House',
        listingType: property.listingType || 'sale',
        description: property.description || '',
        location: {
          city: property.location?.city || '',
          district: property.location?.district || '',
          region: property.location?.region || '',
          coordinates: {
            lat: property.location?.coordinates?.lat || '',
            lng: property.location?.coordinates?.lng || ''
          }
        },
        surface: {
          value: property.surface?.value || '',
          unit: property.surface?.unit || 'm²'
        },
        price: {
          amount: property.price?.amount || '',
          currency: property.price?.currency || 'FCFA'
        },
        features: {
          hasElectricity: property.features?.hasElectricity || false,
          hasWater: property.features?.hasWater || false,
          hasRoad: property.features?.hasRoad || false,
          isFenced: property.features?.isFenced || false,
          bedrooms: property.features?.bedrooms || '',
          bathrooms: property.features?.bathrooms || '',
          floor: property.features?.floor || '',
          hasElevator: property.features?.hasElevator || false,
          hasBalcony: property.features?.hasBalcony || false,
          isFurnished: property.features?.isFurnished || false,
          showWindow: property.features?.showWindow || false,
          zone: property.features?.zone || '',
          hasParking: property.features?.hasParking || false,
          hasGarden: property.features?.hasGarden || false,
          landType: property.features?.landType || ''
        },
        amenities: {
          schools: property.amenities?.schools?.names?.join(', ') || '',
          markets: property.amenities?.markets?.names?.join(', ') || '',
          stations: property.amenities?.stations?.names?.join(', ') || '',
          bakeries: property.amenities?.bakeries?.names?.join(', ') || ''
        },
        images: property.images || [],
        status: property.status || 'PENDING'
      });
      
      setImageUrls(normalizedImages);
      console.log('📸 Loaded images:', normalizedImages);
      
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(t.errorFetch);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const MAX_IMAGES = 10;
    
    const currentImageCount = imageUrls.length;
    
    if (currentImageCount + files.length > MAX_IMAGES) {
      alert(t.maxImages.replace('{max}', MAX_IMAGES).replace('{count}', currentImageCount));
      return;
    }
    
    setUploadingImage(true);
    
    try {
      const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
      setImageFiles(prev => [...prev, ...compressedFiles]);
      
      compressedFiles.forEach(file => {
        const previewUrl = URL.createObjectURL(file);
        setImageUrls(prev => [...prev, previewUrl]);
      });
    } catch (err) {
      console.error('Error compressing image:', err);
      alert(t.errorCompress);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    const urlToRemove = imageUrls[index];
    const isExistingImage = urlToRemove.startsWith('http') && !urlToRemove.includes('blob');
    
    if (isExistingImage) {
      const relativePath = formData.images.find(img => 
        getImageUrl(img) === urlToRemove || 
        `${BACKEND_URL}/uploads/properties/${img}` === urlToRemove
      );
      
      if (relativePath) {
        setImagesToDelete(prev => [...prev, relativePath]);
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => img !== relativePath)
        }));
      }
    }
    
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let uploadedImageUrls = [];
      
      if (imageFiles.length > 0) {
        const uploadFormData = new FormData();
        imageFiles.forEach(file => {
          uploadFormData.append('images', file);
        });
        
        console.log('📤 Uploading images to:', `${BACKEND_URL}/api/upload/property-images`);
        
        const uploadResponse = await fetch(`${BACKEND_URL}/api/upload/property-images`, {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          uploadedImageUrls = uploadResult.images;
          console.log('✅ Images uploaded:', uploadedImageUrls);
        } else {
          console.error('Upload failed:', uploadResult);
        }
      }
      
      let finalImageUrls;
      if (id) {
        const keptImages = formData.images || [];
        finalImageUrls = [...keptImages, ...uploadedImageUrls];
      } else {
        finalImageUrls = uploadedImageUrls;
      }
      
      const amenitiesData = {
        schools: formData.amenities.schools?.trim() ? {
          count: formData.amenities.schools.split(',').filter(s => s.trim()).length,
          names: formData.amenities.schools.split(',').map(s => s.trim()).filter(s => s)
        } : { count: 0, names: [] },
        markets: formData.amenities.markets?.trim() ? {
          count: formData.amenities.markets.split(',').filter(s => s.trim()).length,
          names: formData.amenities.markets.split(',').map(s => s.trim()).filter(s => s)
        } : { count: 0, names: [] },
        stations: formData.amenities.stations?.trim() ? {
          count: formData.amenities.stations.split(',').filter(s => s.trim()).length,
          names: formData.amenities.stations.split(',').map(s => s.trim()).filter(s => s)
        } : { count: 0, names: [] },
        bakeries: formData.amenities.bakeries?.trim() ? {
          count: formData.amenities.bakeries.split(',').filter(s => s.trim()).length,
          names: formData.amenities.bakeries.split(',').map(s => s.trim()).filter(s => s)
        } : { count: 0, names: [] }
      };
      
      const submitData = {
        title: formData.title,
        category: formData.category,
        listingType: formData.listingType,
        description: formData.description,
        location: {
          city: formData.location.city,
          district: formData.location.district,
          region: formData.location.region,
          coordinates: {
            lat: formData.location.coordinates.lat ? parseFloat(formData.location.coordinates.lat) : null,
            lng: formData.location.coordinates.lng ? parseFloat(formData.location.coordinates.lng) : null
          }
        },
        surface: {
          value: formData.surface.value ? parseFloat(formData.surface.value) : null,
          unit: formData.surface.unit
        },
        price: {
          amount: formData.price.amount ? parseFloat(formData.price.amount) : null,
          currency: formData.price.currency
        },
        features: {
          hasElectricity: formData.features.hasElectricity,
          hasWater: formData.features.hasWater,
          hasRoad: formData.features.hasRoad,
          isFenced: formData.features.isFenced,
          bedrooms: formData.features.bedrooms ? parseInt(formData.features.bedrooms) : null,
          bathrooms: formData.features.bathrooms ? parseInt(formData.features.bathrooms) : null,
          floor: formData.features.floor ? parseInt(formData.features.floor) : null,
          hasElevator: formData.features.hasElevator,
          hasBalcony: formData.features.hasBalcony,
          isFurnished: formData.features.isFurnished,
          showWindow: formData.features.showWindow,
          zone: formData.features.zone,
          hasParking: formData.features.hasParking,
          hasGarden: formData.features.hasGarden,
          landType: formData.features.landType
        },
        amenities: amenitiesData,
        status: formData.status,
        images: finalImageUrls
      };
      
      console.log('Submitting data:', submitData);
      
      if (id) {
        await api.updateProperty(id, submitData);
        setSuccess(t.successUpdate);
      } else {
        await api.createProperty(submitData);
        setSuccess(t.successCreate);
      }
      
      setTimeout(() => {
        navigate('/dashboard/properties');
      }, 1500);
    } catch (err) {
      console.error('Error saving property:', err);
      setError(t.errorSave);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t.confirmDelete)) return;
    
    setLoading(true);
    try {
      await api.deleteProperty(id);
      setSuccess(t.successDelete);
      setTimeout(() => {
        navigate('/dashboard/properties');
      }, 1500);
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(t.errorDelete);
    } finally {
      setLoading(false);
    }
  };

  // Composant FurnishedStatusSelector avec traduction
  const FurnishedStatusSelector = () => (
    <div className="mt-5 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
          <Sofa size={14} /> {t.furnishedStatus}:
        </span>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="furnishedStatus"
              value="unfurnished"
              checked={!formData.features.isFurnished}
              onChange={() => setFormData(prev => ({ ...prev, features: { ...prev.features, isFurnished: false } }))}
              className="w-4 h-4 text-[#c5a059] focus:ring-[#c5a059]"
            />
            <span className="text-sm text-slate-700">{t.unfurnished}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="furnishedStatus"
              value="furnished"
              checked={formData.features.isFurnished}
              onChange={() => setFormData(prev => ({ ...prev, features: { ...prev.features, isFurnished: true } }))}
              className="w-4 h-4 text-[#c5a059] focus:ring-[#c5a059]"
            />
            <span className="text-sm text-slate-700">{t.furnished}</span>
          </label>
        </div>
      </div>
      <p className="text-[8px] text-slate-400 mt-2">
        {t.furnishedNote}
      </p>
    </div>
  );

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/properties')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-serif text-[#0a2619] italic">
              {id ? t.editProperty : t.addNewProperty}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {id ? t.modifyDetails : t.listProperty}
            </p>
          </div>
        </div>
        
        {id && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} /> {t.delete}
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619]">{t.basicInformation}</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.title}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                placeholder={t.titlePlaceholder}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.category}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Listing Type */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.listingType}</label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${formData.listingType === 'sale' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                    <input
                      type="radio"
                      name="listingType"
                      value="sale"
                      checked={formData.listingType === 'sale'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <Tag size={16} />
                    {t.forSale}
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${formData.listingType === 'rent' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                    <input
                      type="radio"
                      name="listingType"
                      value="rent"
                      checked={formData.listingType === 'rent'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <Calendar size={16} />
                    {t.forRent}
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.status}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                >
                  <option value="PENDING">{t.pendingReview}</option>
                  <option value="PUBLISHED">{t.published}</option>
                  <option value="RESERVED">{t.reserved}</option>
                  <option value="SOLD">{t.sold}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.description}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all resize-none"
                placeholder={t.descriptionPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <MapPin size={18} /> {t.location}
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.city}</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                  placeholder={t.cityPlaceholder}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.district}</label>
                <input
                  type="text"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                  placeholder={t.districtPlaceholder}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.region}</label>
                <select
                  name="location.region"
                  value={formData.location.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                >
                  <option value="">{t.selectRegion}</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions & Price */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <Maximize2 size={18} /> {t.dimensionsPrice}
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.surfaceArea}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="surface.value"
                    value={formData.surface.value}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                    placeholder="500"
                  />
                  <select
                    name="surface.unit"
                    value={formData.surface.unit}
                    onChange={handleChange}
                    className="px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                  >
                    <option value="m²">m²</option>
                    <option value="Ha">Ha</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.price}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="price.amount"
                    value={formData.price.amount}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                    placeholder="15000000"
                  />
                  <select
                    name="price.currency"
                    value={formData.price.currency}
                    onChange={handleChange}
                    className="px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                  >
                    <option value="FCFA">FCFA</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                {formData.listingType === 'rent' && (
                  <p className="text-[8px] text-slate-400 mt-1">{t.pricePerMonth}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <CheckCircle2 size={18} /> {t.features}
            </h2>
          </div>
          <div className="p-6">
            {/* HOUSE features */}
            {isHouse && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.bedrooms}</label>
                    <input
                      type="number"
                      name="features.bedrooms"
                      value={formData.features.bedrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.bathrooms}</label>
                    <input
                      type="number"
                      name="features.bathrooms"
                      value={formData.features.bathrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                      placeholder="2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasElectricity" checked={formData.features.hasElectricity} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.electricity}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasWater" checked={formData.features.hasWater} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.water}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasParking" checked={formData.features.hasParking} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.parking}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasGarden" checked={formData.features.hasGarden} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.garden}</span>
                  </label>
                </div>
                <FurnishedStatusSelector />
              </div>
            )}

            {/* APARTMENT features */}
            {isApartment && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Floor</label>
                    <input
                      type="number"
                      name="features.floor"
                      value={formData.features.floor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.bedrooms}</label>
                    <input
                      type="number"
                      name="features.bedrooms"
                      value={formData.features.bedrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.bathrooms}</label>
                    <input
                      type="number"
                      name="features.bathrooms"
                      value={formData.features.bathrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasElectricity" checked={formData.features.hasElectricity} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.electricity}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasWater" checked={formData.features.hasWater} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.water}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasElevator" checked={formData.features.hasElevator} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.elevator}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasBalcony" checked={formData.features.hasBalcony} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.balcony}</span>
                  </label>
                </div>
                <FurnishedStatusSelector />
              </div>
            )}

            {/* ROOM features */}
            {isRoom && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.surfaceArea} (m²)</label>
                    <input
                      type="number"
                      name="surface.value"
                      value={formData.surface.value}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                      placeholder="15"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasElectricity" checked={formData.features.hasElectricity} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.electricity}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasWater" checked={formData.features.hasWater} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.water}</span>
                  </label>
                </div>
                <FurnishedStatusSelector />
              </div>
            )}

            {/* LAND features */}
            {isLand && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.landType}</label>
                  <select
                    name="features.landType"
                    value={formData.features.landType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                  >
                    <option value="">{t.selectLandType}</option>
                    <option value="buildable">{t.buildable}</option>
                    <option value="agricultural">{t.agricultural}</option>
                    <option value="commercial">{t.commercial}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasElectricity" checked={formData.features.hasElectricity} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.electricityNearby}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasWater" checked={formData.features.hasWater} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.waterNearby}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasRoad" checked={formData.features.hasRoad} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.roadAccess}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isFenced" checked={formData.features.isFenced} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.fenced}</span>
                  </label>
                </div>
              </div>
            )}

            {/* COMMERCIAL features */}
            {isCommercial && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.commercialZone}</label>
                    <select
                      name="features.zone"
                      value={formData.features.zone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                    >
                      <option value="">{t.selectZoneType}</option>
                      <option value="commercial">{t.commercial}</option>
                      <option value="residential">{t.residentialZone}</option>
                      <option value="mixed">{t.mixedZone}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.showWindow}</label>
                    <select
                      name="features.showWindow"
                      value={formData.features.showWindow ? "yes" : "no"}
                      onChange={(e) => {
                        const syntheticEvent = {
                          target: {
                            name: 'features.showWindow',
                            type: 'checkbox',
                            checked: e.target.value === 'yes'
                          }
                        };
                        handleChange(syntheticEvent);
                      }}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                    >
                      <option value="no">{t.noShowWindow}</option>
                      <option value="yes">{t.hasShowWindow}</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasElectricity" checked={formData.features.hasElectricity} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.electricity}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasWater" checked={formData.features.hasWater} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.water}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasParking" checked={formData.features.hasParking} onChange={handleChange} className="w-4 h-4 rounded" />
                    <span className="text-sm text-slate-700">{t.parking}</span>
                  </label>
                </div>
              </div>
            )}

            {/* OTHER features */}
            {isOther && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasElectricity" checked={formData.features.hasElectricity} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm text-slate-700">{t.electricity}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasWater" checked={formData.features.hasWater} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm text-slate-700">{t.water}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasRoad" checked={formData.features.hasRoad} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm text-slate-700">{t.roadAccess}</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Strategic Proximity */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <MapPin size={18} /> {t.strategicProximity}
            </h2>
            <p className="text-[9px] text-slate-400 mt-1">
              {t.proximityNote}
            </p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <School size={14} /> {t.schoolsUniversities}
              </label>
              <input
                type="text"
                name="amenities.schools"
                value={formData.amenities.schools}
                onChange={handleChange}
                placeholder={t.schoolsPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <ShoppingBasket size={14} /> {t.marketsShopping}
              </label>
              <input
                type="text"
                name="amenities.markets"
                value={formData.amenities.markets}
                onChange={handleChange}
                placeholder={t.marketsPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <Fuel size={14} /> {t.gasStations}
              </label>
              <input
                type="text"
                name="amenities.stations"
                value={formData.amenities.stations}
                onChange={handleChange}
                placeholder={t.stationsPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <Coffee size={14} /> {t.bakeriesRestaurants}
              </label>
              <input
                type="text"
                name="amenities.bakeries"
                value={formData.amenities.bakeries}
                onChange={handleChange}
                placeholder={t.bakeriesPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <ImageIcon size={18} /> {t.images}
            </h2>
            <p className="text-[9px] text-slate-400 mt-1">
              {t.imagesNote}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => {
                const isExistingImage = url.startsWith('http') && !url.includes('blob');
                return (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                      onError={(e) => {
                        console.error('Image failed to load:', url);
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    {isExistingImage && (
                      <span className="absolute bottom-2 left-2 text-[8px] bg-green-600 text-white px-1.5 py-0.5 rounded">
                        {t.existing}
                      </span>
                    )}
                  </div>
                );
              })}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#c5a059] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <Loader2 size={24} className="text-[#c5a059] animate-spin" />
                ) : (
                  <>
                    <Plus size={24} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 mt-1">{t.addImage}</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/properties')}
            className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-4 bg-[#0a2619] text-[#c5a059] rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#1a3d2a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {id ? t.updateProperty : t.createProperty}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;