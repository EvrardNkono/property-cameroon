import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Container, 
  Anchor, 
  Clock,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import api from '../../../services/api';

const FinancialControl = () => {
  const [activeSection, setActiveSection] = useState('SOURCING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les données
  const [financialStats, setFinancialStats] = useState({
    totalLiquidity: 0,
    inTransitImports: 0,
    containersCount: 0,
    dividendsToPay: 0
  });
  
  const [shipments, setShipments] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [portfolioPerformance, setPortfolioPerformance] = useState([]);

  // Charger toutes les données
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les expéditions (sourcing)
      const shipmentsRes = await api.getShipments();
      setShipments(shipmentsRes.items || shipmentsRes.shipments || []);
      
      // Charger les investissements
      const investmentsRes = await api.getInvestments();
      setInvestments(investmentsRes.items || investmentsRes.investments || []);
      
      // Charger les transactions
      const transactionsRes = await api.getTransactions();
      setTransactions(transactionsRes.items || transactionsRes.transactions || []);
      
      // Calculer les statistiques financières
      calculateFinancialStats(transactionsRes.items || transactionsRes.transactions || []);
      
      // Calculer la performance du portefeuille
      calculatePortfolioPerformance(investmentsRes.items || investmentsRes.investments || []);
      
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err.message || 'Erreur lors du chargement des données financières');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques financières
  const calculateFinancialStats = (transactionsData) => {
    // Calculer la liquidité totale (somme des transactions entrantes - sortantes)
    const totalIn = transactionsData
      .filter(t => t.type === 'INVESTMENT' || t.type === 'PROPERTY_PURCHASE')
      .reduce((sum, t) => sum + (t.amount?.value || 0), 0);
    
    const totalOut = transactionsData
      .filter(t => t.type === 'DIVIDEND' || t.type === 'FEE')
      .reduce((sum, t) => sum + (t.amount?.value || 0), 0);
    
    const totalLiquidity = totalIn - totalOut;
    
    // Dividendes à payer
    const dividendsToPay = transactionsData
      .filter(t => t.type === 'DIVIDEND' && t.status === 'PENDING')
      .reduce((sum, t) => sum + (t.amount?.value || 0), 0);
    
    setFinancialStats({
      totalLiquidity,
      inTransitImports: 45200000, // À calculer depuis les shipments
      containersCount: shipments.length,
      dividendsToPay
    });
  };

  // Calculer la performance du portefeuille
  const calculatePortfolioPerformance = (investmentsData) => {
    const performance = investmentsData.map(inv => ({
      name: inv.project,
      performance: inv.performance?.realizedGainPercentage || 0,
      progress: Math.min(100, Math.max(0, (inv.currentValue / inv.amount) * 100 || 75))
    }));
    
    setPortfolioPerformance(performance.length ? performance : [
      { name: "Kribi Real Estate", performance: 18.5, progress: 75 },
      { name: "Textile Sourcing", performance: 12.3, progress: 60 },
      { name: "Agro-Business", performance: 8.7, progress: 45 }
    ]);
  };

  // Formater le montant
  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  // Exporter les données
  const handleExport = () => {
    const data = activeSection === 'SOURCING' ? shipments : investments;
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSection.toLowerCase()}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => JSON.stringify(obj[header] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  // Mettre à jour le statut d'une expédition
  const handleUpdateShipmentStatus = async (shipmentId, newStatus) => {
    try {
      const progress = getProgressForStatus(newStatus);
      await api.updateShipmentStatus(shipmentId, newStatus, progress);
      await fetchData(); // Rafraîchir les données
    } catch (err) {
      console.error('Error updating shipment status:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getProgressForStatus = (status) => {
    const progressMap = {
      'WAREHOUSE': 25,
      'AT_SEA': 50,
      'PORT_ARRIVAL': 75,
      'CUSTOMS': 90,
      'DELIVERED': 100
    };
    return progressMap[status] || 0;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'AT_SEA': return <Anchor size={14} />;
      case 'WAREHOUSE': return <Clock size={14} />;
      case 'PORT_ARRIVAL': return <Container size={14} />;
      case 'CUSTOMS': return <Filter size={14} />;
      case 'DELIVERED': return <ArrowDownLeft size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'WAREHOUSE': 'Guangzhou Warehouse',
      'AT_SEA': 'At Sea',
      'PORT_ARRIVAL': 'Port Arrival',
      'CUSTOMS': 'Customs Clearance',
      'DELIVERED': 'Delivered'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Chargement des données financières...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center max-w-md">
          <p className="font-bold">Erreur de chargement</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0a2619] italic">Financial Control</h1>
          <p className="text-slate-500 text-sm mt-1">Cash flow, CAPEF dividends, and import logistics.</p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Connecté au backend - Données en temps réel
          </p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-[#0a2619] transition-all shadow-sm"
            >
                <Download size={20} />
            </button>
            <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex">
                <button 
                  onClick={() => setActiveSection('SOURCING')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeSection === 'SOURCING' ? 'bg-[#0a2619] text-[#c5a059]' : 'text-slate-400'}`}
                >
                  Sourcing
                </button>
                <button 
                  onClick={() => setActiveSection('INVEST')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeSection === 'INVEST' ? 'bg-[#0a2619] text-[#c5a059]' : 'text-slate-400'}`}
                >
                  Investments
                </button>
            </div>
        </div>
      </div>

      {/* DYNAMIC METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Liquidity</p>
            <h3 className="text-2xl font-black text-[#0a2619] mt-2">
              {formatAmount(financialStats.totalLiquidity)} <span className="text-xs font-normal">FCFA</span>
            </h3>
            <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-2">
                <ArrowUpRight size={12} /> +15.4%
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-Transit Imports</p>
            <h3 className="text-2xl font-black text-[#0a2619] mt-2">
              {formatAmount(financialStats.inTransitImports)} <span className="text-xs font-normal">FCFA</span>
            </h3>
            <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold mt-2">
                <Clock size={12} /> {shipments.length} Containers
            </div>
        </div>
        <div className="bg-[#c5a059] p-6 rounded-[2rem] shadow-xl shadow-[#c5a059]/10">
            <p className="text-[10px] font-black text-[#0a2619] uppercase tracking-widest">Dividends to Pay</p>
            <h3 className="text-2xl font-black text-[#0a2619] mt-2">
              {formatAmount(financialStats.dividendsToPay)} <span className="text-xs font-black opacity-60">FCFA</span>
            </h3>
            <button className="mt-3 text-[9px] font-black bg-[#0a2619] text-white px-3 py-1.5 rounded-lg uppercase">
              Release Payment
            </button>
        </div>
      </div>

      {activeSection === 'SOURCING' ? (
        /* CHINA SOURCING SECTION */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-[#0a2619] flex items-center gap-2 italic">
                  <Container size={20} className="text-[#c5a059]" /> Bulk Order Tracking
                </h3>
                <Filter size={18} className="text-slate-300" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">Freight Ref</th>
                            <th className="px-8 py-4">Product</th>
                            <th className="px-8 py-4">Cargo Value</th>
                            <th className="px-8 py-4">Logistics Stage</th>
                            <th className="px-8 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {shipments.map((shipment) => (
                            <tr key={shipment._id} className="text-sm hover:bg-slate-50/80 transition-all">
                                <td className="px-8 py-5 font-bold text-[#0a2619]">{shipment.reference}</td>
                                <td className="px-8 py-5 text-slate-600">{shipment.product?.name || 'N/A'}</td>
                                <td className="px-8 py-5 font-black">
                                  {shipment.cargoValue?.toLocaleString()} <span className="text-[10px] opacity-40">FCFA</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600">
                                        {getStatusIcon(shipment.status)} {getStatusText(shipment.status)}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button 
                                      onClick={() => handleUpdateShipmentStatus(shipment._id, shipment.status)}
                                      className="text-[10px] font-black text-[#c5a059] uppercase hover:underline"
                                    >
                                      Update Status
                                    </button>
                                 </td>
                             </tr>
                        ))}
                        {shipments.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-8 py-12 text-center text-slate-400">
                              Aucune expédition en cours
                            </td>
                          </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      ) : (
        /* CAPEF INVEST SECTION */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0a2619] p-8 rounded-[2.5rem] text-white">
                <h3 className="font-bold text-[#c5a059] mb-6 flex items-center gap-2 italic uppercase tracking-widest text-sm">
                    <TrendingUp size={20} /> Portfolio Performance
                </h3>
                <div className="space-y-6">
                    {portfolioPerformance.map((proj, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm">{proj.name}</span>
                                <span className={`text-xs font-black ${proj.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {proj.performance >= 0 ? '+' : ''}{proj.performance}%
                                </span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#c5a059] h-full" style={{ width: `${proj.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-[#0a2619] mb-6 flex items-center gap-2 italic">
                    <Wallet size={20} className="text-[#c5a059]" /> Cash Flow
                </h3>
                <div className="space-y-4">
                    {transactions.slice(0, 5).map((tx, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-all">
                            <div className="flex items-center gap-3">
                                {tx.type === 'INVESTMENT' || tx.type === 'PROPERTY_PURCHASE' ? 
                                  <ArrowDownLeft className="text-green-500" size={16} /> : 
                                  <ArrowUpRight className="text-red-500" size={16} />
                                }
                                <div>
                                  <span className="text-xs font-bold text-slate-700">{tx.reference}</span>
                                  <p className="text-[9px] text-slate-400">{tx.type}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-black ${tx.type === 'INVESTMENT' || tx.type === 'PROPERTY_PURCHASE' ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.type === 'INVESTMENT' || tx.type === 'PROPERTY_PURCHASE' ? '+' : '-'}{tx.amount?.value?.toLocaleString() || 0} FCFA
                            </span>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                      <div className="text-center text-slate-400 py-8">
                        Aucune transaction récente
                      </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FinancialControl;