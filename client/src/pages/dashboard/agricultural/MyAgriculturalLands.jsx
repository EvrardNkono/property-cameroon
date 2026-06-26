// frontend/src/pages/dashboard/agricultural/MyAgriculturalLands.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Sprout, X, CheckCircle2, AlertCircle, MapPin, DollarSign, TrendingUp, Droplets, Sun, Zap, Truck, Award, Camera, Search } from 'lucide-react';
import api from '../../../services/api';

const MyAgriculturalLands = () => {
  const [currentLang, setCurrentLang] = useState('fr');
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      title: "Mes Terres Agricoles",
      subtitle: "Gérez vos propriétés agricoles",
      addLand: "Ajouter une Terre",
      searchPlaceholder: "Rechercher par titre, région, culture, description...",
      allStatus: "Tous les Statuts",
      pending: "En Attente",
      published: "Publié",
      reserved: "Réservé",
      sold: "Vendu",
      landsFound: "terre(s) trouvée(s)",
      noLands: "Aucune terre agricole trouvée",
      noResults: "Aucun résultat pour",
      clearSearch: "Effacer la recherche",
      addFirstLand: "Ajouter Votre Première Terre",
      
      // Modal
      editLand: "Modifier la Terre",
      addNewLand: "Ajouter une Nouvelle Terre",
      title: "Titre *",
      region: "Région *",
      selectRegion: "Sélectionner une région",
      city: "Ville",
      district: "District",
      description: "Description *",
      primaryCrop: "Culture Principale *",
      searchCrop: "Rechercher une culture (ex: cacao, maïs, oignon, ail...)",
      investmentMetrics: "Métriques d'Investissement",
      surface: "Superficie (Ha) *",
      price: "Prix (FCFA) *",
      expectedRoi: "ROI Attendu (%)",
      annualYield: "Rendement Annuel (tonnes)",
      estimatedAnnualReturn: "Est. retour annuel",
      compatibleCrops: "Cultures Compatibles",
      searchCropsToAdd: "Rechercher des cultures à ajouter...",
      soilType: "Type de Sol",
      selectSoil: "Sélectionner un sol",
      soilQuality: "Qualité du Sol (%)",
      slope: "Pente",
      roadAccess: "Accès Routier",
      waterAccess: "Accès à l'Eau",
      electricityAccess: "Accès à l'Électricité",
      certifications: "Certifications",
      images: "Images (max 10)",
      status: "Statut",
      pendingReview: "En Attente de Revue",
      publishedVisible: "Publié (Visible aux investisseurs)",
      reserved: "Réservé",
      sold: "Vendu",
      cancel: "Annuler",
      update: "Mettre à Jour",
      create: "Créer",
      
      // Labels carte
      surface: "Superficie",
      price: "Prix",
      expectedRoi: "ROI Attendu",
      primaryCrop: "Culture Principale",
      edit: "Modifier",
      delete: "Supprimer",
      
      // Status colors
      statusPublished: "Publié",
      statusPending: "En Attente",
      statusReserved: "Réservé",
      statusSold: "Vendu",
      
      // Soil types
      volcanic: "Volcanique",
      laterite: "Latérite",
      sandy: "Sableux",
      clay: "Argileux",
      loam: "Limoneux",
      ferrallitic: "Ferralitique",
      peat: "Tourbeux",
      silt: "Limon",
      
      // Slopes
      flat: "Plat",
      gentle: "Douce",
      moderate: "Modérée",
      steep: "Raide",
      mountainous: "Montagneux",
      
      // Road access
      paved: "Goudronné",
      unpaved: "Non goudronné",
      trail: "Piste",
      none: "Aucun",
      
      // Errors
      errorLoad: "Échec du chargement des terres agricoles",
      errorSave: "Échec de l'enregistrement",
      errorDelete: "Échec de la suppression",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette terre ?",
      maxImages: "Maximum 10 images autorisées",
      errorUpload: "Erreur lors du téléchargement des images",
      
      // Regions
      center: "Centre",
      south: "Sud",
      west: "Ouest",
      northWest: "Nord-Ouest",
      littoral: "Littoral",
      adamawa: "Adamaoua",
      north: "Nord",
      farNorth: "Extrême-Nord",
      east: "Est"
    },
    en: {
      title: "My Agricultural Lands",
      subtitle: "Manage your agricultural properties",
      addLand: "Add Land",
      searchPlaceholder: "Search by title, region, crop, description...",
      allStatus: "All Status",
      pending: "Pending",
      published: "Published",
      reserved: "Reserved",
      sold: "Sold",
      landsFound: "land(s) found",
      noLands: "No agricultural lands found",
      noResults: "No results for",
      clearSearch: "Clear search",
      addFirstLand: "Add Your First Land",
      
      // Modal
      editLand: "Edit Land",
      addNewLand: "Add New Land",
      title: "Title *",
      region: "Region *",
      selectRegion: "Select region",
      city: "City",
      district: "District",
      description: "Description *",
      primaryCrop: "Primary Crop *",
      searchCrop: "Search crop (e.g., cocoa, maize, onion, garlic...)",
      investmentMetrics: "Investment Metrics",
      surface: "Surface (Ha) *",
      price: "Price (FCFA) *",
      expectedRoi: "Expected ROI (%)",
      annualYield: "Annual Yield (tons)",
      estimatedAnnualReturn: "Est. annual return",
      compatibleCrops: "Compatible Crops",
      searchCropsToAdd: "Search crops to add...",
      soilType: "Soil Type",
      selectSoil: "Select soil",
      soilQuality: "Soil Quality (%)",
      slope: "Slope",
      roadAccess: "Road Access",
      waterAccess: "Water Access",
      electricityAccess: "Electricity Access",
      certifications: "Certifications",
      images: "Images (max 10)",
      status: "Status",
      pendingReview: "Pending Review",
      publishedVisible: "Published (Visible to investors)",
      reserved: "Reserved",
      sold: "Sold",
      cancel: "Cancel",
      update: "Update",
      create: "Create",
      
      // Labels carte
      surface: "Surface",
      price: "Price",
      expectedRoi: "Expected ROI",
      primaryCrop: "Primary Crop",
      edit: "Edit",
      delete: "Delete",
      
      // Status colors
      statusPublished: "Published",
      statusPending: "Pending",
      statusReserved: "Reserved",
      statusSold: "Sold",
      
      // Soil types
      volcanic: "Volcanic",
      laterite: "Laterite",
      sandy: "Sandy",
      clay: "Clay",
      loam: "Loam",
      ferrallitic: "Ferrallitic",
      peat: "Peat",
      silt: "Silt",
      
      // Slopes
      flat: "Flat",
      gentle: "Gentle",
      moderate: "Moderate",
      steep: "Steep",
      mountainous: "Mountainous",
      
      // Road access
      paved: "Paved",
      unpaved: "Unpaved",
      trail: "Trail",
      none: "None",
      
      // Errors
      errorLoad: "Failed to load agricultural lands",
      errorSave: "Failed to save",
      errorDelete: "Failed to delete",
      confirmDelete: "Are you sure you want to delete this land?",
      maxImages: "Maximum 10 images allowed",
      errorUpload: "Error uploading images",
      
      // Regions
      center: "Center",
      south: "South",
      west: "West",
      northWest: "North-West",
      littoral: "Littoral",
      adamawa: "Adamawa",
      north: "North",
      farNorth: "Far-North",
      east: "East"
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

  // ========== 60+ CULTURES COMPLÈTES ==========
  const cropTypes = [
    // Céréales (7)
    'maize', 'rice', 'wheat', 'sorghum', 'millet', 'barley', 'fonio',
    // Cultures de rente (10)
    'cocoa', 'coffee', 'palm', 'rubber', 'cotton', 'cashew', 'shea', 'tea', 'tobacco', 'sugarcane',
    // Tubercules (8)
    'cassava', 'yam', 'sweet potato', 'potato', 'taro', 'cocoyam', 'ginger', 'turmeric',
    // Légumes (15)
    'tomato', 'onion', 'garlic', 'shallot', 'leek', 'chili', 'pepper', 'eggplant', 'cucumber', 
    'zucchini', 'pumpkin', 'squash', 'cabbage', 'cauliflower', 'broccoli',
    // Légumineuses (8)
    'beans', 'soybean', 'peanut', 'cowpea', 'lentil', 'chickpea', 'green bean', 'pea',
    // Fruits (12)
    'banana', 'plantain', 'mango', 'pineapple', 'orange', 'lemon', 'grapefruit', 'papaya', 
    'avocado', 'guava', 'passion fruit', 'watermelon',
    // Épices et aromates (10)
    'vanilla', 'cinnamon', 'pepper black', 'clove', 'nutmeg', 'cardamom', 'basil', 'thyme', 
    'rosemary', 'mint',
    // Autres (5)
    'sunflower', 'sesame', 'jatropha', 'bamboo', 'moringa'
  ].sort();

  // ========== AUTOCOMPLETE POUR LA RECHERCHE ==========
  const filteredCrops = cropTypes.filter(crop => 
    crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const regions = [
    { value: 'Center', label: t.center },
    { value: 'South', label: t.south },
    { value: 'West', label: t.west },
    { value: 'North-West', label: t.northWest },
    { value: 'Littoral', label: t.littoral },
    { value: 'Adamawa', label: t.adamawa },
    { value: 'North', label: t.north },
    { value: 'Far-North', label: t.farNorth },
    { value: 'East', label: t.east }
  ];

  const soilTypes = [
    { value: 'volcanic', label: t.volcanic },
    { value: 'laterite', label: t.laterite },
    { value: 'sandy', label: t.sandy },
    { value: 'clay', label: t.clay },
    { value: 'loam', label: t.loam },
    { value: 'ferrallitic', label: t.ferrallitic },
    { value: 'peat', label: t.peat },
    { value: 'silt', label: t.silt }
  ];

  const roadAccessOptions = [
    { value: 'paved', label: t.paved },
    { value: 'unpaved', label: t.unpaved },
    { value: 'trail', label: t.trail },
    { value: 'none', label: t.none }
  ];

  const slopeOptions = [
    { value: 'flat', label: t.flat },
    { value: 'gentle', label: t.gentle },
    { value: 'moderate', label: t.moderate },
    { value: 'steep', label: t.steep },
    { value: 'mountainous', label: t.mountainous }
  ];

  const getCropEmoji = (crop) => {
    const emojiMap = {
      'cocoa': '🍫', 'coffee': '☕', 'palm': '🌴', 'rubber': '⚽', 'cotton': '👕',
      'maize': '🌽', 'rice': '🍚', 'wheat': '🌾', 'sorghum': '🌾', 'millet': '🌾',
      'cassava': '🍠', 'yam': '🍠', 'sweet potato': '🍠', 'potato': '🥔',
      'tomato': '🍅', 'onion': '🧅', 'garlic': '🧄', 'chili': '🌶️', 'pepper': '🫑',
      'banana': '🍌', 'plantain': '🍌', 'mango': '🥭', 'pineapple': '🍍', 'orange': '🍊',
      'beans': '🫘', 'soybean': '🫘', 'peanut': '🥜', 'vanilla': '🍦'
    };
    return emojiMap[crop] || '🌱';
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: { region: '', city: '', district: '' },
    surface: { value: '', unit: 'Ha' },
    price: { amount: '', currency: 'FCFA' },
    agricultureDetails: {
      primaryCrop: '',
      cropCompatibility: [],
      soilType: '',
      soilQuality: 50,
      waterAccess: false,
      waterSource: '',
      electricityAccess: false,
      roadAccess: 'unpaved',
      distanceToMarket: { value: '', unit: 'km' },
      annualRainfall: { value: '', unit: 'mm' },
      averageTemperature: { value: '', unit: '°C' },
      altitude: { value: '', unit: 'm' },
      slope: 'gentle'
    },
    expectedRoi: '',
    annualYield: '',
    certifications: [],
    images: [],
    status: 'PUBLISHED'
  });

  const certificationOptions = [
    { value: 'organic', label: t.organic || 'Organic', icon: '🌱' },
    { value: 'fair-trade', label: t.fairTrade || 'Fair Trade', icon: '🤝' },
    { value: 'rainforest', label: t.rainforest || 'Rainforest Alliance', icon: '🐸' },
    { value: 'utZ', label: t.utz || 'UTZ Certified', icon: '✓' },
    { value: 'bio-certified', label: t.bioCertified || 'Bio Certified', icon: '🌿' },
    { value: 'global-gap', label: t.globalGap || 'Global GAP', icon: '🌍' }
  ];

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/properties/${image}`;
  };

  const fetchLands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agriculture');
      setLands(response.lands || []);
    } catch (err) {
      console.error('Error fetching lands:', err);
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [currentLang]);

  // Fonction pour obtenir le statut traduit
  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': t.pending,
      'PUBLISHED': t.published,
      'RESERVED': t.reserved,
      'SOLD': t.sold
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'bg-orange-100 text-orange-700',
      'PUBLISHED': 'bg-green-100 text-green-700',
      'RESERVED': 'bg-blue-100 text-blue-700',
      'SOLD': 'bg-red-100 text-red-700'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-500';
  };

  const filteredLands = lands.filter(land => {
    const matchesStatus = filterStatus === 'ALL' || land.status === filterStatus;
    const matchesSearch = land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.location?.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.agricultureDetails?.primaryCrop?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      alert(t.maxImages);
      return;
    }
    
    setUploadingImages(true);
    
    try {
      const uploadFormData = new FormData();
      files.forEach(file => uploadFormData.append('images', file));
      
      const response = await fetch('http://localhost:5000/api/upload/property-images', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...result.images]
        }));
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      alert(t.errorUpload);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCropCompatibility = (crop) => {
    setFormData(prev => ({
      ...prev,
      agricultureDetails: {
        ...prev.agricultureDetails,
        cropCompatibility: prev.agricultureDetails.cropCompatibility.includes(crop)
          ? prev.agricultureDetails.cropCompatibility.filter(c => c !== crop)
          : [...prev.agricultureDetails.cropCompatibility, crop]
      }
    }));
  };

  const handleCertification = (cert) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData(prev => ({
          ...prev,
          [parts[0]]: { ...prev[parts[0]], [parts[1]]: value }
        }));
      } else if (parts.length === 3) {
        setFormData(prev => ({
          ...prev,
          [parts[0]]: {
            ...prev[parts[0]],
            [parts[1]]: { ...prev[parts[0]]?.[parts[1]], [parts[2]]: value }
          }
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        agricultureDetails: { ...prev.agricultureDetails, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const cleanData = {
        ...formData,
        surface: { value: parseFloat(formData.surface.value), unit: formData.surface.unit },
        price: { amount: parseFloat(formData.price.amount), currency: formData.price.currency },
        expectedRoi: parseFloat(formData.expectedRoi) || 0,
        annualYield: parseFloat(formData.annualYield) || 0,
        agricultureDetails: {
          ...formData.agricultureDetails,
          primaryCrop: formData.agricultureDetails.primaryCrop || undefined,
          soilType: formData.agricultureDetails.soilType || undefined,
          waterSource: formData.agricultureDetails.waterSource || undefined,
          slope: formData.agricultureDetails.slope || 'gentle',
          cropCompatibility: formData.agricultureDetails.cropCompatibility || []
        }
      };
      
      if (editingItem) {
        await api.put(`/agriculture/${editingItem._id}`, cleanData);
      } else {
        await api.post('/agriculture', cleanData);
      }
      
      setShowModal(false);
      resetForm();
      fetchLands();
    } catch (err) {
      console.error('Error saving land:', err);
      setError(t.errorSave);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await api.del(`/agriculture/${id}`);
      fetchLands();
    } catch (err) {
      console.error('Error deleting land:', err);
      setError(t.errorDelete);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      location: { region: '', city: '', district: '' },
      surface: { value: '', unit: 'Ha' },
      price: { amount: '', currency: 'FCFA' },
      agricultureDetails: {
        primaryCrop: '',
        cropCompatibility: [],
        soilType: '',
        soilQuality: 50,
        waterAccess: false,
        waterSource: '',
        electricityAccess: false,
        roadAccess: 'unpaved',
        distanceToMarket: { value: '', unit: 'km' },
        annualRainfall: { value: '', unit: 'mm' },
        averageTemperature: { value: '', unit: '°C' },
        altitude: { value: '', unit: 'm' },
        slope: 'gentle'
      },
      expectedRoi: '',
      annualYield: '',
      certifications: [],
      images: [],
      status: 'PUBLISHED'
    });
    setSearchTerm('');
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      location: item.location || { region: '', city: '', district: '' },
      surface: item.surface || { value: '', unit: 'Ha' },
      price: item.price || { amount: '', currency: 'FCFA' },
      agricultureDetails: item.agricultureDetails || {
        primaryCrop: '',
        cropCompatibility: [],
        soilType: '',
        soilQuality: 50,
        waterAccess: false,
        waterSource: '',
        electricityAccess: false,
        roadAccess: 'unpaved',
        distanceToMarket: { value: '', unit: 'km' },
        annualRainfall: { value: '', unit: 'mm' },
        averageTemperature: { value: '', unit: '°C' },
        altitude: { value: '', unit: 'm' },
        slope: 'gentle'
      },
      expectedRoi: item.expectedRoi || '',
      annualYield: item.annualYield || '',
      certifications: item.certifications || [],
      images: item.images || [],
      status: item.status || 'PUBLISHED'
    });
    setShowModal(true);
  };

  const calculateEstimatedReturn = () => {
    if (!formData.price.amount || !formData.expectedRoi) return null;
    const roi = parseFloat(formData.expectedRoi) / 100;
    const annualReturn = parseFloat(formData.price.amount) * roi;
    return annualReturn.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#0a2619] italic">{t.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a2619] text-[#c5a059] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a3d2a] transition-colors"
        >
          <Plus size={16} /> {t.addLand}
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
          >
            <option value="ALL">{t.allStatus}</option>
            <option value="PENDING">{t.pending}</option>
            <option value="PUBLISHED">{t.published}</option>
            <option value="RESERVED">{t.reserved}</option>
            <option value="SOLD">{t.sold}</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {filteredLands.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center">
          <Sprout size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">{t.noLands}</h3>
          <p className="text-slate-400 text-sm mb-6">
            {searchTerm ? `${t.noResults} "${searchTerm}"` : ''}
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-[#c5a059] text-sm underline">
              {t.clearSearch}
            </button>
          )}
          {!searchTerm && (
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a2619] text-[#c5a059] rounded-xl text-xs font-black uppercase tracking-widest"
            >
              <Plus size={16} /> {t.addFirstLand}
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">{filteredLands.length} {t.landsFound}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLands.map((land) => (
              <div key={land._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                {land.images && land.images[0] && (
                  <img src={getImageUrl(land.images[0])} alt={land.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{land.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(land.status)}`}>
                      {getStatusLabel(land.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <MapPin size={14} />
                    <span>{land.location?.region}, {land.location?.city || 'Cameroon'}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3 line-clamp-2">{land.description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">{t.surface}</p>
                      <p className="font-bold text-slate-800">{land.surface?.value} {land.surface?.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.price}</p>
                      <p className="font-bold text-[#c5a059]">{land.price?.amount?.toLocaleString()} {land.price?.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.expectedRoi}</p>
                      <p className="font-bold text-green-600">{land.expectedRoi || 0}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{t.primaryCrop}</p>
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        {getCropEmoji(land.agricultureDetails?.primaryCrop)}
                        {land.agricultureDetails?.primaryCrop || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openEditModal(land)} className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200">
                      <Pencil size={14} className="inline mr-1" /> {t.edit}
                    </button>
                    <button onClick={() => handleDelete(land._id)} className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100">
                      <Trash2 size={14} className="inline mr-1" /> {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal avec recherche de cultures */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
              <h2 className="text-xl font-serif text-[#0a2619] italic">
                {editingItem ? t.editLand : t.addNewLand}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.title}</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]" placeholder="e.g., Mbalmayo Cocoa Estate" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.region}</label>
                  <select name="location.region" value={formData.location.region} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]">
                    <option value="">{t.selectRegion}</option>
                    {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.city}</label>
                  <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.district}</label>
                  <input type="text" name="location.district" value={formData.location.district} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.description}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]" />
              </div>

              {/* Primary Crop avec recherche */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.primaryCrop}</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchCrop}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]"
                  />
                </div>
                {searchTerm && filteredCrops.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl bg-white">
                    {filteredCrops.map(crop => (
                      <button
                        type="button"
                        key={crop}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            agricultureDetails: { ...prev.agricultureDetails, primaryCrop: crop }
                          }));
                          setSearchTerm('');
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-lg">{getCropEmoji(crop)}</span>
                        <span className="capitalize">{crop}</span>
                      </button>
                    ))}
                  </div>
                )}
                {formData.agricultureDetails.primaryCrop && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                    <span className="text-lg">{getCropEmoji(formData.agricultureDetails.primaryCrop)}</span>
                    <span className="text-sm capitalize">{formData.agricultureDetails.primaryCrop}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, agricultureDetails: { ...prev.agricultureDetails, primaryCrop: '' } }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Investment Metrics */}
              <div className="bg-emerald-50 p-4 rounded-2xl">
                <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2"><TrendingUp size={16} /> {t.investmentMetrics}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.surface}</label>
                    <input type="number" name="surface.value" value={formData.surface.value} onChange={handleChange} required className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.price}</label>
                    <input type="number" name="price.amount" value={formData.price.amount} onChange={handleChange} required className="w-full px-4 py-3 bg-white rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.expectedRoi}</label>
                    <input type="number" name="expectedRoi" value={formData.expectedRoi} onChange={handleChange} step="0.1" className="w-full px-4 py-3 bg-white rounded-xl outline-none" placeholder="e.g., 15" />
                    {formData.expectedRoi && formData.price.amount && (
                      <p className="text-[10px] text-green-600 mt-1">{t.estimatedAnnualReturn}: {calculateEstimatedReturn()} FCFA</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.annualYield}</label>
                    <input type="number" name="annualYield" value={formData.annualYield} onChange={handleChange} step="0.1" className="w-full px-4 py-3 bg-white rounded-xl outline-none" />
                  </div>
                </div>
              </div>

              {/* Compatible Crops avec recherche */}
              <div className="bg-amber-50 p-4 rounded-2xl">
                <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2"><Sprout size={16} /> {t.compatibleCrops}</h3>
                <div className="relative mb-3">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchCropsToAdd}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] text-sm"
                  />
                </div>
                {searchTerm && filteredCrops.length > 0 && (
                  <div className="mb-3 max-h-32 overflow-y-auto border border-slate-200 rounded-xl bg-white">
                    {filteredCrops.map(crop => (
                      <button
                        type="button"
                        key={crop}
                        onClick={() => {
                          handleCropCompatibility(crop);
                          setSearchTerm('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-sm border-b border-slate-100 last:border-0"
                      >
                        <span>{getCropEmoji(crop)}</span>
                        <span className="capitalize">{crop}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.agricultureDetails.cropCompatibility.map(crop => (
                    <span key={crop} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      {getCropEmoji(crop)} {crop}
                      <button type="button" onClick={() => handleCropCompatibility(crop)} className="ml-1 hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Soil & Climate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.soilType}</label>
                  <select name="agricultureDetails.soilType" value={formData.agricultureDetails.soilType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]">
                    <option value="">{t.selectSoil}</option>
                    {soilTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.soilQuality}</label>
                  <input type="number" name="agricultureDetails.soilQuality" value={formData.agricultureDetails.soilQuality} onChange={handleChange} min="0" max="100" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.slope}</label>
                  <select name="agricultureDetails.slope" value={formData.agricultureDetails.slope} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none">
                    {slopeOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.roadAccess}</label>
                  <select name="agricultureDetails.roadAccess" value={formData.agricultureDetails.roadAccess} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none">
                    {roadAccessOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="waterAccess" checked={formData.agricultureDetails.waterAccess} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-slate-700">{t.waterAccess}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="electricityAccess" checked={formData.agricultureDetails.electricityAccess} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-slate-700">{t.electricityAccess}</span>
                </label>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">{t.certifications}</label>
                <div className="flex flex-wrap gap-3">
                  {certificationOptions.map(cert => (
                    <label key={cert.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert.value)}
                        onChange={() => handleCertification(cert.value)}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-700">{cert.icon} {cert.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.images}</label>
                <div className="flex gap-3 flex-wrap">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={getImageUrl(img)} alt={`Land ${idx}`} className="w-20 h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"><X size={12} /></button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#c5a059]">
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploadingImages} />
                    {uploadingImages ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                  </label>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.status}</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059]">
                  <option value="PENDING">{t.pendingReview}</option>
                  <option value="PUBLISHED">{t.publishedVisible}</option>
                  <option value="RESERVED">{t.reserved}</option>
                  <option value="SOLD">{t.sold}</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[11px]">
                  {t.cancel}
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-6 py-4 bg-[#0a2619] text-[#c5a059] rounded-xl font-black uppercase text-[11px] flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {editingItem ? t.update : t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAgriculturalLands;