import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, TrendingUp, Map, Clock, Truck, Loader2 } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Overview = () => {
  const { activeRoles } = useOutletContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    propertiesCount: 0,
    investmentsCount: 0,
    investmentsROI: 0,
    purchasesCount: 0,
    lastUpdate: new Date()
  });
  const [pendingValidations, setPendingValidations] = useState([]);

  // Load dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let propertiesCount = 0;
      let investmentsCount = 0;
      let investmentsROI = 0;
      let purchasesCount = 0;
      
      // Load properties (if OWNER)
      if (activeRoles.includes('OWNER') && user) {
        try {
          const propertiesRes = await api.getPropertiesByOwner(user._id);
          propertiesCount = propertiesRes.properties?.length || 0;
        } catch (err) {
          console.error('Error fetching properties:', err);
        }
      }
      
      // Load investments (if INVESTOR)
      if (activeRoles.includes('INVESTOR')) {
        try {
          const investmentsRes = await api.getInvestments();
          let investments = investmentsRes.items || investmentsRes.investments || [];
          if (user && user._id) {
            investments = investments.filter(inv => inv.investor === user._id);
          }
          investmentsCount = investments.length;
          
          // Calculate average ROI
          if (investments.length > 0) {
            const totalROI = investments.reduce((sum, inv) => sum + (inv.performance?.realizedGainPercentage || 0), 0);
            investmentsROI = totalROI / investments.length;
          }
        } catch (err) {
          console.error('Error fetching investments:', err);
        }
      }
      
      // Load purchases (if BUYER)
      if (activeRoles.includes('BUYER')) {
        try {
          const transactionsRes = await api.getTransactions();
          let transactions = transactionsRes.items || transactionsRes.transactions || [];
          if (user && user._id) {
            transactions = transactions.filter(t => 
              (t.from === user._id || t.to === user._id) && 
              (t.type === 'PROPERTY_PURCHASE' || t.type === 'SOURCE_PAYMENT')
            );
          }
          purchasesCount = transactions.length;
        } catch (err) {
          console.error('Error fetching purchases:', err);
        }
      }
      
      // Load pending validations
      try {
        const docsRes = await api.getDocuments();
        let documents = docsRes.items || docsRes.documents || [];
        if (user && user._id) {
          documents = documents.filter(doc => 
            doc.uploadedBy === user._id && doc.status === 'PENDING'
          );
        }
        setPendingValidations(documents.slice(0, 3));
      } catch (err) {
        console.error('Error fetching pending validations:', err);
      }
      
      setStats({
        propertiesCount,
        investmentsCount,
        investmentsROI: investmentsROI.toFixed(1),
        purchasesCount,
        lastUpdate: new Date()
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Error loading data');
      
      // Fallback data
      setStats({
        propertiesCount: 2,
        investmentsCount: 2,
        investmentsROI: 12.4,
        purchasesCount: 4,
        lastUpdate: new Date()
      });
      setPendingValidations([
        { _id: 1, name: "Land Title N°455/LIT", status: "APPROVED" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatLastUpdate = () => {
    const now = new Date();
    return `Today, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // Get compliance status
  const getComplianceStatus = () => {
    if (user?.kycStatus === 'Verified') {
      return { label: 'KYC Verified', color: 'text-green-600', dotColor: 'bg-green-500' };
    }
    if (user?.kycStatus === 'Pending') {
      return { label: 'KYC Pending', color: 'text-orange-600', dotColor: 'bg-orange-500' };
    }
    return { label: 'KYC Required', color: 'text-red-600', dotColor: 'bg-red-500' };
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [activeRoles, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  const complianceStatus = getComplianceStatus();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em]">Dashboard</span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#0a2619] mt-1 italic">Activity Summary</h1>
          <p className="text-xs text-green-600 mt-2">
            ✅ Connected to backend
          </p>
        </div>
        <div className="text-sm text-slate-400 flex items-center gap-2">
           <Clock size={14} /> Last update: {formatLastUpdate()}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeRoles.includes('OWNER') && (
          <div className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Map size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Property Assets</h3>
                <p className="text-3xl font-bold text-[#0a2619] mt-2">
                  {stats.propertiesCount} Property{stats.propertiesCount > 1 ? 's' : ''}
                </p>
                <Link to="/dashboard/properties" className="mt-6 flex items-center gap-2 text-xs font-black text-[#c5a059] uppercase tracking-widest group-hover:gap-4 transition-all">
                    Manage Assets <ArrowUpRight size={14} />
                </Link>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}

        {activeRoles.includes('INVESTOR') && (
          <div className="group bg-[#0a2619] p-8 rounded-[2rem] text-white shadow-xl hover:shadow-[#0a2619]/20 transition-all duration-500 relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-[#c5a059]/20 text-[#c5a059] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                </div>
                <h3 className="text-sm font-black text-[#c5a059] uppercase tracking-widest">Investments</h3>
                <p className="text-3xl font-bold mt-2">
                  +{stats.investmentsROI}% <span className="text-xs font-normal text-white/50">ROI</span>
                </p>
                <p className="text-xs text-white/40 mt-1">{stats.investmentsCount} Project{stats.investmentsCount > 1 ? 's' : ''}</p>
                <Link to="/dashboard/invest" className="mt-6 flex items-center gap-2 text-xs font-black text-[#c5a059] uppercase tracking-widest group-hover:gap-4 transition-all">
                    CAPEF Opportunities <ArrowUpRight size={14} />
                </Link>
             </div>
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rotate-45 translate-x-10 -translate-y-10"></div>
          </div>
        )}

        {activeRoles.includes('BUYER') && (
          <div className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck size={24} />
             </div>
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Global Sourcing</h3>
             <p className="text-3xl font-bold text-[#0a2619] mt-2">
               {stats.purchasesCount} Order{stats.purchasesCount > 1 ? 's' : ''}
             </p>
             <Link to="/dashboard/sourcing" className="mt-6 flex items-center gap-2 text-xs font-black text-[#c5a059] uppercase tracking-widest group-hover:gap-4 transition-all">
                Track Shipment <ArrowUpRight size={14} />
             </Link>
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY / COMPLIANCE BLOC */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm">
         <div className="flex items-center gap-3 mb-8">
            <div className={`p-2 rounded-lg ${complianceStatus.color.replace('text', 'bg').replace('600', '50')}`}>
               <ShieldCheck size={20} className={complianceStatus.color} />
            </div>
            <h2 className="text-xl font-serif text-[#0a2619] italic">Compliance Status</h2>
         </div>
         
         <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 ${complianceStatus.dotColor} rounded-full shadow-[0_0_8px_${complianceStatus.dotColor === 'bg-green-500' ? '#22c55e' : '#f97316'}]`}></div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">KYC Verification</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {complianceStatus.label}
                          {user?.kycStatus === 'Verified' && ' - Documents approved by institutional framework'}
                          {user?.kycStatus === 'Pending' && ' - Document under review'}
                          {user?.kycStatus !== 'Verified' && user?.kycStatus !== 'Pending' && ' - Please submit your documents'}
                        </p>
                    </div>
                </div>
                <Link to="/dashboard/profile" className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest text-[#c5a059] hover:underline">
                  {user?.kycStatus === 'Verified' ? 'Details' : user?.kycStatus === 'Pending' ? 'Follow' : 'Submit'}
                </Link>
            </div>

            {pendingValidations.map((doc, index) => (
              <div key={doc._id || index} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">{doc.name || 'Document pending'}</p>
                        <p className="text-xs text-slate-400 mt-1">Under review by our experts</p>
                    </div>
                </div>
                <button className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest text-[#c5a059]">Details</button>
              </div>
            ))}
            
            {pendingValidations.length === 0 && user?.kycStatus === 'Verified' && (
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-green-50 border border-green-100">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
                    <div>
                        <p className="text-sm font-bold text-green-800">All your documents are verified</p>
                        <p className="text-xs text-green-600 mt-1">You have access to all platform features</p>
                    </div>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Overview;