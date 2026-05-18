import React, { useState, useEffect } from 'react';
import { 
  X, User, Home, FileText, TrendingUp, 
  MapPin, Calendar, ShieldCheck, Mail, Phone,
  ExternalLink, Download, Clock, Loader2
} from 'lucide-react';
import api from '../../../../services/api';

const UserDetailModal = ({ isOpen, onClose, user, initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [userProperties, setUserProperties] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [userStats, setUserStats] = useState({
    totalLogins: 0,
    activeSessions: 0,
    totalPortfolio: 0,
    portfolioGrowth: 0
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchUserData();
    }
  }, [isOpen, user, activeTab]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Charger les propriétés si onglet properties
      if (activeTab === 'properties' && user.roles.includes('OWNER')) {
        const response = await api.getPropertiesByOwner(user.id);
        setUserProperties(response.properties || []);
      }
      
      // Charger les investissements si onglet investments
      if (activeTab === 'investments' && user.roles.includes('INVESTOR')) {
        const response = await api.getInvestments();
        const investments = response.investments || [];
        const userInv = investments.filter(inv => inv.investor === user.id);
        setUserInvestments(userInv);
        
        // Calculer stats portfolio
        const totalValue = userInv.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0);
        const growth = userInv.length > 0 ? 12.4 : 0; // À calculer réellement
        setUserStats(prev => ({ ...prev, totalPortfolio: totalValue, portfolioGrowth: growth }));
      }
      
      // Charger les documents KYC
      const docsResponse = await api.getDocuments();
      const docs = docsResponse.documents || [];
      const userDocs = docs.filter(doc => doc.uploadedBy === user.id);
      setUserDocuments(userDocs);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} />, show: true },
    { id: 'properties', label: 'Properties', icon: <Home size={16} />, show: user.roles.includes('OWNER') },
    { id: 'titles', label: 'Land Titles', icon: <FileText size={16} />, show: user.roles.includes('OWNER') },
    { id: 'investments', label: 'Investments', icon: <TrendingUp size={16} />, show: user.roles.includes('INVESTOR') },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatPrice = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} Mrd FCFA`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}M FCFA`;
    }
    return `${amount.toLocaleString()} FCFA`;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a2619]/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-[#0a2619] text-[#c5a059] rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-xl ring-4 ring-[#c5a059]/10">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-3xl font-serif italic text-[#0a2619] leading-tight">{user.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.roles?.map(role => (
                  <span key={role} className="text-[9px] font-black tracking-[0.15em] uppercase px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white rounded-[1.5rem] text-slate-300 hover:text-red-500 transition-all shadow-sm group">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-10 border-b border-slate-100 gap-8 overflow-x-auto no-scrollbar">
          {tabs.filter(t => t.show).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-[#c5a059]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c5a059] rounded-t-full animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-[#c5a059]" size={40} />
            </div>
          ) : (
            <>
              {/* TAB: PROFILE */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                        <User size={14} /> Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoField icon={<Mail />} label="Email Address" value={user.email} />
                        <InfoField icon={<Phone />} label="Phone Number" value={user.phone || '+237 6XX XXX XXX'} />
                        <InfoField icon={<Calendar />} label="Registration Date" value={formatDate(user.createdAt)} />
                        <InfoField icon={<ShieldCheck />} label="Verification Status" value={user.status || 'Pending'} color={user.status === 'Verified' ? 'text-emerald-600' : 'text-amber-600'} />
                      </div>
                    </section>
                    
                    <section className="p-6 bg-[#0a2619]/5 rounded-[2rem] border border-[#0a2619]/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0a2619]/40 mb-4">Account Analytics</h3>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-2xl font-serif italic text-[#0a2619]">{userStats.totalLogins || 0}</p>
                          <p className="text-[8px] font-bold uppercase text-slate-400">Total Logins</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div>
                          <p className="text-2xl font-serif italic text-[#0a2619]">{userStats.activeSessions || 0}</p>
                          <p className="text-[8px] font-bold uppercase text-slate-400">Active Sessions</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden">
                      <Clock className="absolute -right-4 -top-4 w-24 h-24 text-slate-100 -rotate-12" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 relative z-10">Admin Notes</h3>
                      <p className="text-sm text-slate-600 leading-relaxed italic relative z-10">
                        {user.kycStatus === 'Verified' 
                          ? 'KYC verified. Full access granted.'
                          : user.kycStatus === 'Pending'
                          ? 'KYC documents under review.'
                          : 'KYC verification required.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PROPERTIES */}
              {activeTab === 'properties' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {userProperties.map(property => (
                    <PropertyCard 
                      key={property._id}
                      name={property.title}
                      location={`${property.location?.city || ''}, ${property.location?.region || ''}`}
                      price={formatPrice(property.price?.amount)}
                      status={property.status === 'PUBLISHED' ? 'Validated' : 'Pending'}
                    />
                  ))}
                  {userProperties.length === 0 && (
                    <div className="col-span-2 text-center text-slate-400 italic py-12">
                      No properties found for this user.
                    </div>
                  )}
                </div>
              )}

              {/* TAB: TITLES */}
              {activeTab === 'titles' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {userDocuments.filter(d => d.type === 'TITLE_DEED').map(doc => (
                    <DocumentItem 
                      key={doc._id}
                      title={doc.name}
                      type={doc.fileType || 'PDF'}
                      size="2.4 MB"
                      date={formatDate(doc.createdAt)}
                    />
                  ))}
                  {userDocuments.filter(d => d.type === 'TITLE_DEED').length === 0 && (
                    <div className="text-center text-slate-400 italic py-12">
                      No land titles found for this user.
                    </div>
                  )}
                </div>
              )}

              {/* TAB: INVESTMENTS */}
              {activeTab === 'investments' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#0a2619] rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <TrendingUp className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-4">Total Portfolio Value</p>
                    <h4 className="text-5xl font-serif italic mb-10">{formatPrice(userStats.totalPortfolio)}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-white/10">
                      <Stat label="Growth" value={`+${userStats.portfolioGrowth}%`} color="text-emerald-400" />
                      <Stat label="Assets" value={userInvestments.length.toString()} />
                      <Stat label="Risk Level" value="Low" />
                      <Stat label="Next Payout" value="June 2026" />
                    </div>
                  </div>
                  {userInvestments.length === 0 && (
                    <div className="text-center text-slate-400 italic py-8">
                      No investments found for this user.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SOUS-COMPOSANTS UI ---
const InfoField = ({ icon, label, value, color = "text-slate-700" }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#c5a059] shadow-sm shrink-0">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className={`text-sm font-bold leading-none ${color}`}>{value}</p>
    </div>
  </div>
);

const PropertyCard = ({ name, location, price, status }) => (
  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#c5a059] group-hover:bg-[#0a2619] group-hover:text-white transition-colors">
        <MapPin size={20} />
      </div>
      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${status === 'Validated' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
        {status}
      </span>
    </div>
    <h4 className="font-bold text-[#0a2619] mb-1">{name}</h4>
    <p className="text-xs text-slate-400 mb-4">{location}</p>
    <p className="text-sm font-black text-[#c5a059]">{price}</p>
  </div>
);

const DocumentItem = ({ title, type, size, date }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
        <FileText size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-[#0a2619]">{title}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
          {type} • {size} • Uploaded {date}
        </p>
      </div>
    </div>
    <button className="p-3 bg-white rounded-xl shadow-sm text-slate-400 hover:text-[#c5a059] transition-colors">
      <Download size={18} />
    </button>
  </div>
);

const Stat = ({ label, value, color = "text-white" }) => (
  <div>
    <p className="text-[8px] font-bold uppercase text-white/30 tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-black ${color}`}>{value}</p>
  </div>
);

export default UserDetailModal;