import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe,
  Briefcase,
  Calendar,
  Loader2
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const Portfolio = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les données du portefeuille
  const [stats, setStats] = useState([
    { label: "Capital Investi", value: "0", unit: "FCFA", icon: <Wallet size={20} />, trend: "+0%", up: true },
    { label: "Valeur Actuelle", value: "0", unit: "FCFA", icon: <TrendingUp size={20} />, trend: "+0", up: true },
    { label: "Rendement Moyen", value: "0", unit: "%", icon: <PieChart size={20} />, trend: "Annuel", up: true },
  ]);
  
  const [investments, setInvestments] = useState([]);
  const [totalReturn, setTotalReturn] = useState(0);
  const [averageReturn, setAverageReturn] = useState(0);

  // Formater les montants
  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(date);
  };

  // Obtenir le texte du statut
  const getStatusText = (status) => {
    const statusMap = {
      'ACTIVE': 'En cours',
      'MATURED': 'Maturé',
      'EXITED': 'Sorti'
    };
    return statusMap[status] || status;
  };

  // Formater le gain
  const formatGain = (gain) => {
    if (gain >= 0) {
      return `+${gain}%`;
    }
    return `${gain}%`;
  };

  // Charger les données du portefeuille
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les investissements de l'utilisateur connecté
      const investmentsRes = await api.getInvestments();
      let userInvestments = investmentsRes.items || investmentsRes.investments || [];
      
      // Filtrer par utilisateur connecté si nécessaire
      if (user && user._id) {
        userInvestments = userInvestments.filter(inv => inv.investor === user._id);
      }
      
      setInvestments(userInvestments);
      
      // Calculer les statistiques
      const totalInvested = userInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
      const totalCurrentValue = userInvestments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0);
      const totalGain = totalCurrentValue - totalInvested;
      const totalGainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
      
      // Calculer le rendement moyen
      const avgReturn = userInvestments.length > 0 
        ? userInvestments.reduce((sum, inv) => sum + (inv.performance?.realizedGainPercentage || 0), 0) / userInvestments.length
        : 0;
      
      setAverageReturn(avgReturn);
      setTotalReturn(totalGain);
      
      // Mettre à jour les statistiques
      setStats([
        { 
          label: "Capital Investi", 
          value: formatAmount(totalInvested), 
          unit: "FCFA", 
          icon: <Wallet size={20} />, 
          trend: `+${totalGainPercentage.toFixed(1)}%`, 
          up: totalGainPercentage >= 0 
        },
        { 
          label: "Valeur Actuelle", 
          value: formatAmount(totalCurrentValue), 
          unit: "FCFA", 
          icon: <TrendingUp size={20} />, 
          trend: `+${formatAmount(totalGain)}`, 
          up: totalGain >= 0 
        },
        { 
          label: "Rendement Moyen", 
          value: avgReturn.toFixed(1), 
          unit: "%", 
          icon: <PieChart size={20} />, 
          trend: "Annuel", 
          up: avgReturn >= 0 
        },
      ]);
      
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message || 'Erreur lors du chargement du portefeuille');
      
      // Données de fallback
      setInvestments([
        {
          _id: 1,
          project: "Projet Kribi Marina",
          name: "Projet Kribi Marina",
          type: "Copropriété",
          amount: 10000000,
          gain: 18,
          status: "ACTIVE",
          startDate: "2025-10-01"
        },
        {
          _id: 2,
          project: "Extension Douala-Lendi",
          name: "Extension Douala-Lendi",
          type: "Achat-Revente",
          amount: 15500000,
          gain: 8,
          status: "ACTIVE",
          startDate: "2026-01-01"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Nouvel investissement
  const handleNewInvestment = () => {
    console.log('New investment');
  };

  // Voir les détails d'un investissement
  const handleViewInvestment = (id) => {
    console.log('View investment:', id);
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Chargement de votre portefeuille...</p>
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
            onClick={fetchPortfolioData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter uppercase">Mon Portefeuille</h1>
          <p className="text-slate-500 text-sm">Analyse de vos performances immobilières au Cameroun.</p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Connecté au backend - {investments.length} investissement{investments.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          onClick={handleNewInvestment}
          className="bg-[#0a2619] text-[#c5a059] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Briefcase size={16} /> Nouvel Investissement
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="w-10 h-10 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[#c5a059] mb-4 shadow-inner">
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-2xl font-black text-[#0a2619]">{stat.value}</h2>
                <span className="text-[10px] font-bold text-slate-400">{stat.unit}</span>
              </div>
              <div className={`mt-3 flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LISTE DES INVESTISSEMENTS ACTIFS */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-[#0a2619] flex items-center gap-2">
            <Globe size={18} className="text-[#c5a059]" />
            Actifs Détenus
          </h3>
          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 uppercase">
            {investments.length} PROJET{investments.length > 1 ? 'S' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Projet</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {investments.map((inv) => (
                <tr key={inv._id || inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-[#0a2619] text-sm">{inv.project || inv.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Calendar size={10} /> Acquis en {formatDate(inv.startDate || inv.date)}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded-lg">
                      {inv.type || 'Investissement'}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-sm text-[#0a2619]">
                    {(inv.amount || 0).toLocaleString()} FCFA
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-1 font-black text-sm ${(inv.performance?.realizedGainPercentage || inv.gain || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <ArrowUpRight size={14} /> 
                      {formatGain(inv.performance?.realizedGainPercentage || inv.gain || 0)}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-[#c5a059] uppercase">
                      <div className={`w-1.5 h-1.5 rounded-full ${inv.status === 'ACTIVE' ? 'bg-[#c5a059] animate-pulse' : 'bg-slate-400'}`} />
                      {getStatusText(inv.status)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleViewInvestment(inv._id || inv.id)}
                      className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-[#c5a059] group-hover:text-[#0a2619] transition-all"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {investments.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium italic">
              Aucun investissement pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;