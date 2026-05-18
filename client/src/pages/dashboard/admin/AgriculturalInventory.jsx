// frontend/src/components/admin/AgriculturalInventory.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sprout, Plus, Search, Edit, Trash2, ExternalLink, 
  Tractor, Droplets, Sun, Mountain, Loader2
} from 'lucide-react';
import api from '../../../services/api';
import { AdminSectionHeader, AdminStatusBadge, AdminActionButton } from '../../../components/admin/AdminComponents';

const AgriculturalInventory = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    fetchAgriculturalLands();
  }, [activeTab, searchQuery, regionFilter]);

  const fetchAgriculturalLands = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (activeTab !== 'ALL') filters.status = activeTab;
      if (searchQuery) filters.search = searchQuery;
      if (regionFilter) filters.region = regionFilter;
      
      const response = await api.get('/agriculture', filters);
      setLands(response.lands || []);
    } catch (error) {
      console.error('Error fetching agricultural lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCropIcon = (crop) => {
    const icons = {
      cocoa: '🍫',
      coffee: '☕',
      palm: '🌴',
      banana: '🍌',
      rubber: '⚙️',
      maize: '🌽'
    };
    return icons[crop] || '🌾';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#c5a059]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <AdminSectionHeader 
          title="Agricultural Lands" 
          description="Manage agricultural properties, soil quality, and crop compatibility." 
        />
        <button className="flex items-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          <Plus size={16} /> New Agricultural Land
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'PENDING', 'PUBLISHED', 'SOLD'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                activeTab === tab ? 'bg-[#0a2619] text-[#c5a059]' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <select 
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border-none"
        >
          <option value="">All Regions</option>
          <option value="Center">Center</option>
          <option value="South">South</option>
          <option value="West">West</option>
          <option value="Littoral">Littoral</option>
        </select>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">Land / Crop</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">Surface</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">Soil Quality</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lands.map((land) => (
                <tr key={land._id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">
                        {getCropIcon(land.agricultureDetails?.primaryCrop)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0a2619]">{land.title}</p>
                        <p className="text-[9px] text-slate-400 uppercase">
                          {land.agricultureDetails?.primaryCrop || 'Mixed'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{land.location?.region}</td>
                  <td className="px-6 py-4 font-bold">{land.surface?.value} {land.surface?.unit}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${land.agricultureDetails?.soilQuality || 50}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{land.agricultureDetails?.soilQuality || 50}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {land.price?.amount?.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge status={land.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <AdminActionButton icon={Edit} onClick={() => {}} />
                      <AdminActionButton icon={Trash2} variant="danger" onClick={() => {}} />
                      <AdminActionButton icon={ExternalLink} variant="primary" onClick={() => {}} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalInventory;