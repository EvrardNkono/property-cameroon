import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Plus, MapPin, Maximize2, CheckCircle2, Clock, MoreVertical, Search, 
  Loader2, FileText, Eye, Trash2, Edit3, Image as ImageIcon
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const MyLands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeRoles } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  // Load user's properties
  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let properties = [];
      
      if (user && user._id) {
        const response = await api.getPropertiesByOwner(user._id);
        properties = response.properties || [];
      }
      
      setLands(properties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Error loading your properties');
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter properties
  const filteredLands = lands.filter(land => {
    const matchesSearch = land.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.location?.district?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Format price
  const formatPrice = (price) => {
    if (!price) return '0 FCFA';
    const amount = typeof price === 'object' ? price.amount : price;
    return `${amount.toLocaleString()} FCFA`;
  };

  // Format surface area
  const formatSurface = (surface) => {
    if (!surface) return 'N/A';
    const value = typeof surface === 'object' ? surface.value : surface;
    const unit = typeof surface === 'object' ? surface.unit : 'm²';
    return `${value} ${unit}`;
  };

  // Get formatted location
  const getLocationString = (location) => {
    if (!location) return 'Unknown location';
    const parts = [location.city, location.district].filter(Boolean);
    return parts.join(', ') || 'Unknown location';
  };

  // Get formatted status
  const getStatusInfo = (status) => {
    const statusMap = {
      'PUBLISHED': { label: 'Published', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} /> },
      'PENDING': { label: 'Pending', color: 'bg-orange-100 text-orange-700', icon: <Clock size={12} /> },
      'SOLD': { label: 'Sold', color: 'bg-gray-100 text-gray-700', icon: <CheckCircle2 size={12} /> },
      'RESERVED': { label: 'Reserved', color: 'bg-blue-100 text-blue-700', icon: <Clock size={12} /> }
    };
    return statusMap[status] || { label: status, color: 'bg-slate-100 text-slate-700', icon: <Clock size={12} /> };
  };

  // Get image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `http://localhost:5000/uploads/properties/${image}`;
  };

  // Add property
  const handleAddProperty = () => {
    navigate('/dashboard/properties/new');
  };

  // View documents
  const handleViewDocuments = (landId) => {
    navigate(`/dashboard/documents?property=${landId}`);
  };

  // Edit property
  const handleEditProperty = (landId) => {
    navigate(`/dashboard/properties/edit/${landId}`);
  };

  // Delete property
  const handleDeleteProperty = async (landId) => {
    if (window.confirm('Are you sure you want to delete this property? This action is irreversible.')) {
      try {
        await api.deleteProperty(landId);
        await fetchMyProperties();
        setShowMenu(null);
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Error deleting property');
      }
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Loading your properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center max-w-md">
          <p className="font-bold">Loading Error</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchMyProperties}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter">MY PROPERTIES</h1>
          <p className="text-slate-500 text-sm">Manage your properties and track your land titles status.</p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Connected to backend - {filteredLands.length} property{filteredLands.length > 1 ? 'ies' : ''}
          </p>
        </div>
        
        <button 
          onClick={handleAddProperty}
          className="flex items-center justify-center gap-2 bg-[#c5a059] text-[#0a2619] font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-[#b08d4a] transition-all transform hover:scale-105 text-sm"
        >
          <Plus size={20} /> ADD PROPERTY
        </button>
      </div>

      {/* SEARCH BAR AND FILTERS */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search land (city, district...)" 
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* PROPERTIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLands.map((land) => {
          const statusInfo = getStatusInfo(land.status);
          const imageUrl = land.images && land.images[0] ? getImageUrl(land.images[0]) : null;
          
          return (
            <div key={land._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-[#0a2619] to-[#1a3d2a] relative">
                {imageUrl ? (
                  <img 
                    src={imageUrl}
                    alt={land.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center fallback-icon" style={{ display: imageUrl ? 'none' : 'flex' }}>
                  <ImageIcon size={48} className="text-white/20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xl font-black">{formatPrice(land.price)}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowMenu(showMenu === land._id ? null : land._id)}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {showMenu === land._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                        <button 
                          onClick={() => handleEditProperty(land._id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(land._id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[#0a2619] text-lg leading-tight">{land.title}</h3>
                </div>
                
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                  <MapPin size={14} className="text-[#c5a059]" />
                  {getLocationString(land.location)}
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#c5a059]">
                      <Maximize2 size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{formatSurface(land.surface)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#c5a059]">
                      <FileText size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 uppercase leading-none">
                      {land.category === 'Land' ? 'Land' : land.category}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleViewDocuments(land._id)}
                  className="w-full mt-2 py-3 bg-[#0a2619] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  View Documents
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state message */}
      {filteredLands.length === 0 && (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100">
          <p className="text-slate-400 font-medium">No properties found</p>
          <button 
            onClick={handleAddProperty}
            className="mt-4 text-[#c5a059] font-bold text-sm hover:underline"
          >
            Add your first property
          </button>
        </div>
      )}
    </div>
  );
};

export default MyLands;