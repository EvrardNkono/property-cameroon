// frontend/src/pages/dashboard/properties/PropertyForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Trash2, Image, Plus, X, 
  MapPin, Home, Maximize2, DollarSign, FileText,
  CheckCircle2, Loader2, Upload, Building2,
  School, ShoppingBasket, Fuel, Coffee
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

// ✅ Détection de l'environnement pour l'URL d'upload
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// 📸 Fonction pour obtenir l'URL complète de l'image
const getImageUrl = (image) => {
  if (!image) return null;
  // Si c'est déjà une URL complète (Vercel Blob ou autre)
  if (image.startsWith('http')) return image;
  // Si c'est un chemin relatif avec /uploads
  if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
  // Si c'est juste le nom du fichier
  return `${BACKEND_URL}/uploads/properties/${image}`;
};

// 📸 Fonction de compression d'images
const compressImage = (file, quality = 0.6, maxWidth = 1024) => {
  return new Promise((resolve) => {
    if (file.size < 500 * 1024) {
      resolve(file);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Land',
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
      bathrooms: ''
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

  const categories = [
    { id: 'Land', label: 'Land', icon: <MapPin size={18} /> },
    { id: 'Real Estate', label: 'Real Estate', icon: <Home size={18} /> },
    { id: 'Commercial', label: 'Commercial', icon: <Building2 size={18} /> }
  ];

  const regions = [
    'Center', 'South', 'West', 'North-West', 'Littoral', 
    'Adamawa', 'North', 'Far-North', 'East'
  ];

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
        category: property.category || 'Land',
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
          bathrooms: property.features?.bathrooms || ''
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
      setError('Failed to load property data');
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
      alert(`Maximum ${MAX_IMAGES} images allowed. You currently have ${currentImageCount} images.`);
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
      alert('Error compressing image');
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
      
      // ✅ CORRECTION : Upload des nouvelles images avec URL dynamique
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
          bathrooms: formData.features.bathrooms ? parseInt(formData.features.bathrooms) : null
        },
        amenities: amenitiesData,
        status: formData.status,
        images: finalImageUrls
      };
      
      console.log('Submitting data:', submitData);
      
      if (id) {
        await api.updateProperty(id, submitData);
        setSuccess('Property updated successfully!');
      } else {
        await api.createProperty(submitData);
        setSuccess('Property created successfully!');
      }
      
      setTimeout(() => {
        navigate('/dashboard/properties');
      }, 1500);
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    
    setLoading(true);
    try {
      await api.deleteProperty(id);
      setSuccess('Property deleted successfully!');
      setTimeout(() => {
        navigate('/dashboard/properties');
      }, 1500);
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
      </div>
    );
  }

  const isLand = formData.category === 'Land';
  const isRealEstate = formData.category === 'Real Estate';

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
              {id ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {id ? 'Modify your property details' : 'List your property on the marketplace'}
            </p>
          </div>
        </div>
        
        {id && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} /> Delete
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
            <h2 className="font-bold text-[#0a2619]">Basic Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                placeholder="e.g., Luxury Villa in Bastos"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Category *</label>
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
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                >
                  <option value="PENDING">Pending Review</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="SOLD">Sold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all resize-none"
                placeholder="Describe your property..."
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <MapPin size={18} /> Location
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                  placeholder="Douala"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">District</label>
                <input
                  type="text"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                  placeholder="Bonapriso"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Region</label>
                <select
                  name="location.region"
                  value={formData.location.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                >
                  <option value="">Select region</option>
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
              <Maximize2 size={18} /> Dimensions & Price
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Surface Area</label>
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
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Price</label>
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
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <CheckCircle2 size={18} /> Features
            </h2>
          </div>
          <div className="p-6">
            {isLand ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasElectricity"
                    checked={formData.features.hasElectricity}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Electricity</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasWater"
                    checked={formData.features.hasWater}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Water</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasRoad"
                    checked={formData.features.hasRoad}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Road Access</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFenced"
                    checked={formData.features.isFenced}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Fenced</span>
                </label>
              </div>
            ) : isRealEstate ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Bedrooms</label>
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
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="features.bathrooms"
                    value={formData.features.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
                    placeholder="2"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasElectricity"
                    checked={formData.features.hasElectricity}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Electricity</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasWater"
                    checked={formData.features.hasWater}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Water</span>
                </label>
              </div>
            ) : null}
          </div>
        </div>

        {/* Strategic Proximity (Amenities) - Optional */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <MapPin size={18} /> Strategic Proximity (Optional)
            </h2>
            <p className="text-[9px] text-slate-400 mt-1">
              Tell us about nearby landmarks. Leave empty for auto-detection from map data.
            </p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <School size={14} /> Schools / Universities
              </label>
              <input
                type="text"
                name="amenities.schools"
                value={formData.amenities.schools}
                onChange={handleChange}
                placeholder="e.g., Lycée de Bastos, Université de Yaoundé II"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <ShoppingBasket size={14} /> Markets / Shopping
              </label>
              <input
                type="text"
                name="amenities.markets"
                value={formData.amenities.markets}
                onChange={handleChange}
                placeholder="e.g., Marché Central, Super U Bonapriso"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <Fuel size={14} /> Gas Stations / Fuel
              </label>
              <input
                type="text"
                name="amenities.stations"
                value={formData.amenities.stations}
                onChange={handleChange}
                placeholder="e.g., Total Bonapriso, Oil Libya"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 flex items-center gap-2">
                <Coffee size={14} /> Bakeries / Restaurants
              </label>
              <input
                type="text"
                name="amenities.bakeries"
                value={formData.amenities.bakeries}
                onChange={handleChange}
                placeholder="e.g., Boulangerie La Parisienne, Restaurant La Scala"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#c5a059] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#0a2619] flex items-center gap-2">
              <Image size={18} /> Images
            </h2>
            <p className="text-[9px] text-slate-400 mt-1">
              Maximum 10 images. Upload JPEG or PNG format.
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
                        Existing
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
                    <span className="text-[10px] text-slate-400 mt-1">Add Image</span>
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-4 bg-[#0a2619] text-[#c5a059] rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#1a3d2a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {id ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;