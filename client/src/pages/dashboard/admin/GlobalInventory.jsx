import React, { useState } from 'react';
import { 
  MapPin, 
  Home, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Layers,
  Tag
} from 'lucide-react';
// Import standardized components
import { AdminSectionHeader, AdminStatusBadge, AdminActionButton } from '../../../components/admin/AdminComponents';

const GlobalInventory = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const inventory = [
    { id: 1, title: "Horizon Kribi Subdivision", location: "Kribi, Coastal Zone", price: "15,000,000 FCFA", surface: "500m²", owner: "Samuel E.", status: "PUBLISHED", category: "Land" },
    { id: 2, title: "Signature Villa Yassa", location: "Douala, Yassa", price: "85,000,000 FCFA", surface: "350m²", owner: "Marie Ngo", status: "PENDING", category: "Real Estate" },
    { id: 3, title: "Lekié Estate", location: "Obala, Center", price: "3,500,000 FCFA", surface: "1000m²", owner: "Horizon SCI", status: "SOLD", category: "Land" }
  ];

  // FILTERING LOGIC
  const filteredInventory = inventory.filter(item => {
    const matchesTab = activeTab === 'ALL' || item.status === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER USING ADMINSECTIONHEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <AdminSectionHeader 
          title="Global Inventory" 
          description="Manage all properties and subdivisions across the platform." 
        />
        <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Layers size={16} /> Categories
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                <Plus size={16} /> New Property
            </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Inventory' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'PUBLISHED', label: 'Published' },
            { id: 'SOLD', label: 'Sold' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-[#0a2619] text-[#c5a059]' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, title or owner..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs focus:ring-2 focus:ring-[#c5a059]/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Finances</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0a2619] border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                        {item.category === 'Land' ? <MapPin size={22} className="text-[#c5a059]" /> : <Home size={22} className="text-[#0a2619]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-[#0a2619] text-sm">{item.title}</p>
                           {/* Using Standarized Badge */}
                           <AdminStatusBadge status={item.status} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-700">{item.location}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[#0a2619]">{item.price}</span>
                      <span className="text-[10px] text-[#c5a059] font-bold uppercase">{item.surface}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 font-medium text-xs text-slate-600">
                        <div className="w-6 h-6 bg-[#0a2619] text-[#c5a059] rounded-full flex items-center justify-center text-[8px] font-black">{item.owner.charAt(0)}</div>
                        {item.owner}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
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
          {filteredInventory.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium italic">No properties found for this selection.</div>
          )}
        </div>
      </div>

      {/* CATALOG VALUE DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f1f5f9] p-8 rounded-[2.5rem] border border-slate-200">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Inventory Distribution</h4>
             <div className="flex gap-4">
                 <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                     <p className="text-2xl font-black text-[#0a2619]">65%</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Raw Land</p>
                 </div>
                 <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                     <p className="text-2xl font-black text-[#0a2619]">35%</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Developed</p>
                 </div>
             </div>
          </div>
          <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Catalog Value</p>
                <h3 className="text-3xl font-black">1.2 Billion <span className="text-xs font-normal opacity-50 ml-1">FCFA</span></h3>
            </div>
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <Tag size={32} className="text-[#c5a059]" />
            </div>
          </div>
      </div>
    </div>
  );
};

export default GlobalInventory;