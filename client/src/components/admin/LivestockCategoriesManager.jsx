// frontend/src/components/admin/LivestockCategoriesManager.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Link as LinkIcon, Loader2 } from 'lucide-react';
import api from '../../services/api';

const LivestockCategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    iconName: 'Leaf',
    marketDemand: '+0% YoY',
    features: [],
    order: 0,
    isActive: true,
    imageType: 'url',
    imageUrl: '',
    imageFile: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getAllLivestockCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
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
      if (key === 'features') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'imageFile' && formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      } else if (key !== 'imageFile') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    try {
      if (editingCategory) {
        await api.updateLivestockCategory(editingCategory._id, formDataToSend);
      } else {
        await api.createLivestockCategory(formDataToSend);
      }
      await fetchCategories();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      iconName: 'Leaf',
      marketDemand: '+0% YoY',
      features: [],
      order: 0,
      isActive: true,
      imageType: 'url',
      imageUrl: '',
      imageFile: null
    });
    setPreviewUrl('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await api.deleteLivestockCategory(id);
      await fetchCategories();
    }
  };

  const icons = ['Fish', 'Bird', 'Database', 'Leaf'];

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
          <h2 className="text-2xl font-serif text-emerald-900">Livestock Categories</h2>
          <p className="text-sm text-emerald-600">Manage livestock sectors and their visual assets</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 overflow-hidden">
              <img 
                src={cat.imageType === 'upload' ? cat.imageUpload : cat.imageUrl} 
                alt={cat.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-emerald-900">{cat.title}</h3>
                  <p className="text-[10px] text-emerald-500 uppercase">/{cat.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingCategory(cat); setFormData(cat); setShowModal(true); }} className="text-emerald-500 hover:text-emerald-700">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-emerald-600/70 line-clamp-2 mb-3">{cat.description}</p>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-emerald-500">{cat.stats?.totalAssets || 0} assets</span>
                <span className="text-amber-600 font-bold">{cat.marketDemand}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-emerald-100">
              <h3 className="text-xl font-serif text-emerald-900">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                    className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Icon</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm"
                  >
                    {icons.map(icon => <option key={icon}>{icon}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Market Demand</label>
                  <input
                    type="text"
                    value={formData.marketDemand}
                    onChange={(e) => setFormData({ ...formData, marketDemand: e.target.value })}
                    placeholder="+24% YoY"
                    className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-3">Category Image</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.imageType === 'url'}
                      onChange={() => setFormData({ ...formData, imageType: 'url', imageFile: null })}
                    />
                    <LinkIcon size={14} /> URL
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.imageType === 'upload'}
                      onChange={() => setFormData({ ...formData, imageType: 'upload', imageUrl: '' })}
                    />
                    <Image size={14} /> Upload File
                  </label>
                </div>

                {formData.imageType === 'url' ? (
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 bg-emerald-50 rounded-xl text-sm"
                  />
                ) : (
                  <div className="border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Image size={24} className="text-emerald-600" />
                      </div>
                      <p className="text-xs text-emerald-600">Click to upload image</p>
                    </label>
                  </div>
                )}

                {previewUrl && (
                  <div className="mt-3">
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestockCategoriesManager;