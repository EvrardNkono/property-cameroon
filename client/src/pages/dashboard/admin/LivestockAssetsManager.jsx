// frontend/src/components/admin/LivestockAssetsManager.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Link as LinkIcon, Loader2, MapPin, TrendingUp, Droplets, Sun, ShieldCheck } from 'lucide-react';
import api from '../../../services/api';

const LivestockAssetsManager = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    price: { amount: 0, currency: 'FCFA' },
    roi: 0,
    capacity: { value: 0, unit: 'heads' },
    cycleDuration: '',
    description: '',
    imageType: 'url',
    imageUrl: '',
    imageFile: null,
    waterAccess: false,
    electricityAccess: false,
    veterinaryAccess: false,
    status: 'AVAILABLE'
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchCategories();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await api.getAllLivestock();
      setAssets(response.livestock || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getAllLivestockCategories({ isActive: true });
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageType: 'upload', imageFile: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageType: 'url', imageUrl: url, imageFile: null });
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'price') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'capacity') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'imageFile' && formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      } else if (key !== 'imageFile') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    try {
      if (editingAsset) {
        await api.updateLivestock(editingAsset._id, formDataToSend);
      } else {
        await api.createLivestock(formDataToSend);
      }
      await fetchAssets();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const resetForm = () => {
    setEditingAsset(null);
    setFormData({
      title: '',
      category: '',
      location: '',
      price: { amount: 0, currency: 'FCFA' },
      roi: 0,
      capacity: { value: 0, unit: 'heads' },
      cycleDuration: '',
      description: '',
      imageType: 'url',
      imageUrl: '',
      imageFile: null,
      waterAccess: false,
      electricityAccess: false,
      veterinaryAccess: false,
      status: 'AVAILABLE'
    });
    setPreviewUrl('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this asset?')) {
      await api.deleteLivestock(id);
      await fetchAssets();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      AVAILABLE: { label: 'Available', color: 'bg-green-100 text-green-700' },
      RESERVED: { label: 'Reserved', color: 'bg-yellow-100 text-yellow-700' },
      SOLD: { label: 'Sold', color: 'bg-gray-100 text-gray-700' }
    };
    const config = statusConfig[status] || statusConfig.AVAILABLE;
    return <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${config.color}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-emerald-900">Livestock Assets</h2>
          <p className="text-sm text-emerald-600">Manage production units and investment opportunities</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <Plus size={16} /> Add Asset
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-emerald-600">Title / Category</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-emerald-600">Location</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-emerald-600">Price</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-emerald-600">ROI</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-emerald-600">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-emerald-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {assets.map((asset) => (
              <tr key={asset._id} className="hover:bg-emerald-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-emerald-900">{asset.title}</p>
                    <p className="text-[9px] text-emerald-500 uppercase">{asset.category}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-700">{asset.location}</td>
                <td className="px-6 py-4 font-bold">{(asset.price?.amount / 1000000).toFixed(1)}M FCFA</td>
                <td className="px-6 py-4">
                  <span className="text-amber-600 font-bold">+{asset.roi}%</span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(asset.status)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditingAsset(asset); setFormData(asset); setShowModal(true); }} className="text-emerald-500 hover:text-emerald-700">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(asset._id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-emerald-100">
              <h3 className="text-xl font-serif text-emerald-900">
                {editingAsset ? 'Edit Asset' : 'New Livestock Asset'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" required>
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat._id} value={cat.slug}>{cat.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Price (FCFA)</label>
                  <input type="number" value={formData.price.amount} onChange={(e) => setFormData({ ...formData, price: { ...formData.price, amount: parseInt(e.target.value) } })} className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">ROI (%)</label>
                  <input type="number" step="0.1" value={formData.roi} onChange={(e) => setFormData({ ...formData, roi: parseFloat(e.target.value) })} className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Capacity</label>
                  <input type="number" value={formData.capacity.value} onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, value: parseInt(e.target.value) } })} className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Cycle Duration</label>
                  <input type="text" value={formData.cycleDuration} onChange={(e) => setFormData({ ...formData, cycleDuration: e.target.value })} placeholder="6 months" className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-3">Image</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2"><input type="radio" checked={formData.imageType === 'url'} onChange={() => setFormData({ ...formData, imageType: 'url', imageFile: null })} /> URL</label>
                  <label className="flex items-center gap-2"><input type="radio" checked={formData.imageType === 'upload'} onChange={() => setFormData({ ...formData, imageType: 'upload', imageUrl: '' })} /> Upload File</label>
                </div>
                {formData.imageType === 'url' ? (
                  <input type="url" value={formData.imageUrl} onChange={handleUrlChange} placeholder="https://example.com/image.jpg" className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm" />
                ) : (
                  <div className="border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="asset-image-upload" />
                    <label htmlFor="asset-image-upload" className="cursor-pointer">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2"><Image size={24} className="text-emerald-600" /></div>
                      <p className="text-xs text-emerald-600">Click to upload image</p>
                    </label>
                  </div>
                )}
                {previewUrl && <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-3" />}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.waterAccess} onChange={(e) => setFormData({ ...formData, waterAccess: e.target.checked })} /> <Droplets size={14} /> Water Access</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.electricityAccess} onChange={(e) => setFormData({ ...formData, electricityAccess: e.target.checked })} /> <Sun size={14} /> Electricity</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.veterinaryAccess} onChange={(e) => setFormData({ ...formData, veterinaryAccess: e.target.checked })} /> <ShieldCheck size={14} /> Vet Access</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">{editingAsset ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestockAssetsManager;