import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  ChevronRight, 
  ExternalLink, 
  CreditCard,
  History,
  Loader2
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const MyPurchases = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // ACTIVE or ARCHIVE

  // Charger les achats
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les transactions de l'utilisateur
      const transactionsRes = await api.getTransactions();
      let transactions = transactionsRes.items || transactionsRes.transactions || [];
      
      // Filtrer par utilisateur et par type d'achat
      if (user && user._id) {
        transactions = transactions.filter(t => 
          (t.from === user._id || t.to === user._id) && 
          (t.type === 'PROPERTY_PURCHASE' || t.type === 'SOURCE_PAYMENT')
        );
      }
      
      // Transformer les transactions en achats
      const formattedPurchases = transactions.map(t => ({
        id: t.reference,
        item: t.metadata?.item || (t.type === 'PROPERTY_PURCHASE' ? 'Projet Immobilier' : 'Matériaux Sourcing'),
        category: t.type === 'PROPERTY_PURCHASE' ? 'Immobilier' : 'Matériaux',
        date: formatDate(t.createdAt),
        amount: t.amount?.value || 0,
        status: getPurchaseStatus(t.status, t.completedAt),
        step: getStepProgress(t.status)
      }));
      
      setPurchases(formattedPurchases);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError(err.message || 'Erreur lors du chargement des achats');
      
      // Données de fallback
      setPurchases([
        {
          id: "PC-8821",
          item: "Lotissement Ahala II - Lot 14",
          category: "Immobilier",
          date: "28 Mars 2026",
          amount: 12500000,
          status: "Acté",
          step: 4
        },
        {
          id: "SC-4402",
          item: "Conteneur Carrelage Premium (Sourcing Chine)",
          category: "Matériaux",
          date: "02 Avril 2026",
          amount: 4200000,
          status: "En Transit",
          step: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  // Obtenir le statut de l'achat
  const getPurchaseStatus = (status, completedAt) => {
    if (status === 'COMPLETED') return 'Acté';
    if (status === 'PENDING') return 'En attente';
    if (status === 'FAILED') return 'Échec';
    return 'En cours';
  };

  // Obtenir la progression (1-4)
  const getStepProgress = (status) => {
    const stepMap = {
      'PENDING': 1,
      'PROCESSING': 2,
      'SHIPPING': 3,
      'COMPLETED': 4
    };
    return stepMap[status] || 1;
  };

  // Voir les détails de facture
  const handleViewInvoice = (purchaseId) => {
    window.open(`/api/invoices/${purchaseId}`, '_blank');
  };

  // Contacter le support
  const handleContactSupport = () => {
    window.location.href = 'mailto:support@propertycameroon.com';
  };

  // Filtrer les achats par onglet
  const filteredPurchases = purchases.filter(p => {
    if (activeTab === 'ACTIVE') return p.step < 4;
    return p.step === 4;
  });

  useEffect(() => {
    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Chargement de vos achats...</p>
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
            onClick={fetchPurchases}
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
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter uppercase">Mes Acquisitions</h1>
          <p className="text-slate-500 text-sm">Historique et suivi en temps réel de vos achats sur Property Cameroon.</p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Connecté au backend - {filteredPurchases.length} achat{filteredPurchases.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'ACTIVE' ? 'bg-[#0a2619] text-white' : 'text-slate-400 hover:text-[#0a2619]'
            }`}
          >
            Actifs
          </button>
          <button 
            onClick={() => setActiveTab('ARCHIVE')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'ARCHIVE' ? 'bg-[#0a2619] text-white' : 'text-slate-400 hover:text-[#0a2619]'
            }`}
          >
            Archives
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPurchases.map((order) => (
          <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* INFO PRODUIT */}
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                    {order.category === "Immobilier" ? <MapPin size={28} /> : <Package size={28} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/10 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{order.date}</span>
                    </div>
                    <h3 className="text-lg font-black text-[#0a2619] mt-1">{order.item}</h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                      Catégorie : <span className="text-[#0a2619] font-bold">{order.category}</span>
                    </p>
                  </div>
                </div>

                {/* PRIX ET STATUS */}
                <div className="flex md:flex-col justify-between items-end">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Montant Total</p>
                    <p className="text-xl font-black text-[#0a2619]">{order.amount.toLocaleString()} <span className="text-xs font-normal">FCFA</span></p>
                  </div>
                  <button 
                    onClick={() => handleViewInvoice(order.id)}
                    className="flex items-center gap-2 text-[10px] font-black text-[#c5a059] uppercase tracking-widest hover:translate-x-1 transition-transform"
                  >
                    Détails facture <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* BARRE DE PROGRESSION */}
              <div className="mt-8 pt-8 border-t border-slate-50">
                <div className="flex justify-between mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression de l'acquisition</p>
                  <p className="text-[10px] font-black text-[#0a2619] uppercase bg-slate-100 px-3 py-1 rounded-full italic">
                    {order.status}
                  </p>
                </div>
                
                <div className="relative flex justify-between">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-[#c5a059] -translate-y-1/2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(order.step / 4) * 100}%` }}
                  />
                  
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s} 
                      className={`relative w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-colors duration-500 ${
                        s <= order.step ? 'bg-[#c5a059] text-[#0a2619]' : 'bg-slate-200 text-white'
                      }`}
                    >
                      {s <= order.step && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Commande</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Paiement</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Transit / Notaire</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Livraison / Acte</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredPurchases.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100">
            <ShoppingBag size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Aucun achat trouvé</p>
          </div>
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="bg-slate-950 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#c5a059]">
            <History size={24} />
          </div>
          <div className="text-white">
            <h4 className="font-bold text-sm uppercase">Un problème avec un achat ?</h4>
            <p className="text-white/40 text-xs">Notre service client est disponible 24/7 pour vous assister.</p>
          </div>
        </div>
        <button 
          onClick={handleContactSupport}
          className="w-full md:w-auto px-8 py-3 bg-[#c5a059] text-[#0a2619] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Contacter le Support
        </button>
      </div>
    </div>
  );
};

export default MyPurchases;