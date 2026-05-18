import React, { useState, useEffect } from 'react';
import { Truck, Anchor, ShieldCheck, Box, MapPin, AlertCircle, Phone, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const SourcingTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipments, setShipments] = useState([]);

  // Charger les expéditions
  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getShipments();
      let allShipments = response.items || response.shipments || [];
      
      // Filtrer par utilisateur connecté
      if (user && user._id) {
        allShipments = allShipments.filter(s => s.client === user._id || s.client?._id === user._id);
      }
      
      setShipments(allShipments);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err.message || 'Erreur lors du chargement des expéditions');
      
      // Données de fallback
      setShipments([
        {
          _id: "SHIP-CN-237-01",
          reference: "SHIP-CN-237-01",
          product: { name: "Sanitaires & Robinetterie Luxe" },
          origin: { country: "Chine", city: "Foshan" },
          destination: { country: "Cameroun", city: "Douala", port: "DIT" },
          status: "AT_SEA",
          eta: "2026-05-15T00:00:00.000Z",
          progress: 65,
          currentLocation: "Océan Indien (proche Afrique du Sud)",
          customsStatus: "Documents Pré-validés"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Obtenir le statut en français
  const getStatusLabel = (status) => {
    const statusMap = {
      'WAREHOUSE': 'En entrepôt',
      'AT_SEA': 'En mer',
      'PORT_ARRIVAL': 'Arrivée au port',
      'CUSTOMS': 'Douane',
      'DELIVERED': 'Livré'
    };
    return statusMap[status] || status;
  };

  // Obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch(status) {
      case 'AT_SEA': return <Anchor size={20} className="text-[#c5a059]" />;
      case 'WAREHOUSE': return <Box size={20} className="text-blue-500" />;
      case 'PORT_ARRIVAL': return <MapPin size={20} className="text-green-500" />;
      case 'CUSTOMS': return <ShieldCheck size={20} className="text-orange-500" />;
      case 'DELIVERED': return <Truck size={20} className="text-green-600" />;
      default: return <Truck size={20} className="text-[#c5a059]" />;
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  // Contacter l'agent
  const handleContactAgent = () => {
    window.location.href = 'mailto:logistics@propertycameroon.com';
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Chargement des expéditions...</p>
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
            onClick={fetchShipments}
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
      <div>
        <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter uppercase">Suivi Sourcing & Logistique</h1>
        <p className="text-slate-500 text-sm">Traçabilité complète de vos importations depuis l'Asie.</p>
        <p className="text-xs text-green-600 mt-1">
          ✅ Connecté au backend - {shipments.length} expédition{shipments.length > 1 ? 's' : ''}
        </p>
      </div>

      {shipments.length === 0 && (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100">
          <Truck size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Aucune expédition en cours</p>
        </div>
      )}

      {shipments.map((ship) => (
        <div key={ship._id || ship.reference} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CARTE DE SUIVI PRINCIPALE */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 bg-[#0a2619] text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.2em]">Expédition active</span>
                <h2 className="text-xl font-bold">{ship.product?.name || 'N/A'}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase font-bold">ID Tracking</p>
                <p className="font-mono text-[#c5a059]">{ship.reference}</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* VOYAGE */}
              <div className="flex justify-between items-center relative">
                <div className="z-10 bg-white p-2 rounded-xl">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0a2619] border border-slate-100">
                    <Box size={24} />
                  </div>
                  <p className="text-[10px] font-black mt-2 uppercase text-center">
                    {ship.origin?.city}, {ship.origin?.country}
                  </p>
                </div>

                <div className="flex-1 h-[2px] bg-slate-100 relative mx-[-10px]">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#c5a059] transition-all duration-1000" 
                    style={{ width: `${ship.progress || 0}%` }} 
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{ left: `${ship.progress || 0}%` }}
                  >
                    {getStatusIcon(ship.status)}
                  </div>
                </div>

                <div className="z-10 bg-white p-2 rounded-xl">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                    <MapPin size={24} />
                  </div>
                  <p className="text-[10px] font-black mt-2 uppercase text-center">
                    {ship.destination?.port || ship.destination?.city}
                  </p>
                </div>
              </div>

              {/* DETAILS LOGISTIQUES */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Position Actuelle</p>
                  <p className="text-xs font-bold text-[#0a2619] mt-1 italic">
                    {ship.currentLocation || getStatusLabel(ship.status)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Arrivée Estimée (ETA)</p>
                  <p className="text-xs font-bold text-[#c5a059] mt-1">{formatDate(ship.eta)}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Statut Douane</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span className="text-xs font-bold text-green-600">
                      {ship.customsStatus || 'Documents Pré-validés'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS & CONTACT */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="font-bold text-[#0a2619]">Besoin d'aide ?</h3>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Des questions sur les frais de douane ou le dédouanement au Port de Douala ?
              </p>
              <button 
                onClick={handleContactAgent}
                className="w-full mt-6 py-3 bg-[#0a2619] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1a3d2a] transition-colors"
              >
                <Phone size={14} /> Contacter l'agent
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SourcingTracker;