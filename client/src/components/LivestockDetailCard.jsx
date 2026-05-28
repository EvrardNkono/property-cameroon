import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShieldCheck, Thermometer, Activity, ArrowRight, X } from 'lucide-react';

// ✅ PAS BESOIN DE CHANGER LA DÉTECTION D'ENVIRONNEMENT
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

// ✅ Hook pour récupérer la langue (amélioré)
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
    
    // ✅ Optionnel: sauvegarder la langue préférée
    if (!storedLang && finalLang !== 'fr') {
      localStorage.setItem('preferredLanguage', finalLang);
    }
  }, []);
  
  return lang;
};

// ✅ NOUVEAU: Hook pour récupérer les données avec la bonne langue
const useLivestockData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentLang = useCurrentLang();
  
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // ✅ AJOUTER le paramètre lang à l'appel API
        const response = await fetch(`${BACKEND_URL}/api/livestock/${id}?lang=${currentLang}`);
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        // Le backend retourne { success: true, livestock: {...}, lang: 'fr' }
        setData(result.livestock || result.data);
      } catch (err) {
        console.error('Error fetching livestock:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, currentLang]); // ✅ Re-fetch quand la langue change
  
  return { data, loading, error };
};

const LivestockDetailCard = ({ data: propData, id }) => {
  const [activeTab, setActiveTab] = useState('conditions');
  const currentLang = useCurrentLang();
  
  // ✅ Si on reçoit un ID mais pas de data, on fetch
  const { data: fetchedData, loading, error } = useLivestockData(id);
  
  // Utiliser les données passées en prop ou celles fetchées
  const data = propData || fetchedData;
  
  // ✅ Gérer l'état de chargement
  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 text-center">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-emerald-900/60 mt-4">
          {currentLang === 'fr' ? 'Chargement...' : 'Loading...'}
        </p>
      </div>
    );
  }
  
  // ✅ Gérer les erreurs
  if (error) {
    return (
      <div className="bg-white rounded-[2rem] p-8 text-center">
        <p className="text-red-500 mb-2">
          {currentLang === 'fr' ? 'Erreur de chargement' : 'Loading error'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="text-emerald-600 underline"
        >
          {currentLang === 'fr' ? 'Réessayer' : 'Try again'}
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Utility function to ensure image has correct URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/livestock/${image}`;
  };

  // ✅ MAPPING SIMPLIFIÉ - Le backend a déjà traduit !
  const backendData = {
    id: data._id || data.id,
    name: data.title,  // ← Déjà dans la bonne langue grâce à ?lang=
    owner: data.owner?.name || data.owner || "CAPEF Certified Farm",
    category: data.category,  // ← Déjà dans la bonne langue
    type: data.category,
    conditionsDesc: data.description || "Modern livestock facility with complete infrastructure.",
    temp: data.features?.hasElectricity ? "Climate Controlled" : "Natural Ventilation",
    location: data.location?.city || data.location || "Cameroon",
    zone: data.location?.district || data.location?.city || "Cameroon",
    locationDesc: data.location?.description || `Located in ${data.location?.city || "Cameroon"}`,
    cycle: data.cycleDuration || "6-12 months",
    maturite: data.capacity?.value ? `${data.capacity.value} ${data.capacity.unit || "units"}` : "Varies by breed",
    price: data.price?.amount ? `${(data.price.amount / 1000000).toFixed(1)}M` : "Contact for pricing",
    image: data.images?.[0] || null,
    roi: data.roi || 0,
    status: data.status || 'AVAILABLE'
  };

  if (backendData.image && !backendData.image.startsWith('http')) {
    backendData.image = getImageUrl(backendData.image);
  }

  // ✅ Textes traduits pour l'interface
  const getLocalizedText = () => {
    const texts = {
      fr: {
        certified: "Certifié",
        owner: "Propriétaire",
        conditions: "CONDITIONS",
        location: "LOCALISATION",
        performance: "PERFORMANCE",
        cycle: "CYCLE",
        targetWeight: "POIDS CIBLE",
        projectCost: "COÛT DU PROJET",
        reserve: "Réserver cette unité",
        contact: "Contactez-nous",
        climateControlled: "Climatisé",
        naturalVentilation: "Ventilation naturelle",
        certifiedOperation: "Opération Certifiée",
        loading: "Chargement...",
        error: "Erreur de chargement",
        retry: "Réessayer"
      },
      en: {
        certified: "Certified",
        owner: "Owner",
        conditions: "CONDITIONS",
        location: "LOCATION",
        performance: "PERFORMANCE",
        cycle: "CYCLE",
        targetWeight: "TARGET WEIGHT",
        projectCost: "PROJECT COST",
        reserve: "Reserve this unit",
        contact: "Contact us",
        climateControlled: "Climate Controlled",
        naturalVentilation: "Natural Ventilation",
        certifiedOperation: "Certified Operation",
        loading: "Loading...",
        error: "Loading error",
        retry: "Try again"
      }
    };
    return texts[currentLang] || texts.fr;
  };

  const t = getLocalizedText();

  const handleReserve = async () => {
    console.log('Reserving livestock unit:', backendData.id);
    const reserveMessage = currentLang === 'fr' 
      ? `Demande de réservation envoyée pour ${backendData.name}. Un représentant vous contactera sous peu.`
      : `Reservation request sent for ${backendData.name}. A representative will contact you shortly.`;
    alert(reserveMessage);
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-emerald-900/5 shadow-2xl w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* IMAGE */}
        <div className="relative h-[300px] lg:h-auto overflow-hidden">
          <img 
            src={backendData.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000'} 
            alt={backendData.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
            }}
          />
          <div className="absolute top-6 left-6 bg-emerald-950 text-amber-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 backdrop-blur-md">
            {backendData.type || backendData.category}
          </div>
          
          {backendData.roi > 0 && (
            <div className="absolute top-6 right-6 bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              +{backendData.roi}% ROI
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-8 lg:p-14 bg-[#fdfcf0]/30 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-emerald-900/40 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Activity size={14} className="text-amber-600" />
              {t.certifiedOperation}
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-emerald-950 mb-2">{backendData.name}</h2>
            <p className="text-emerald-900/60 font-light italic text-sm">
              {t.owner}: <span className="text-emerald-950 font-medium not-italic">{backendData.owner}</span>
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b border-emerald-900/10 mb-6">
            {[
              { id: 'conditions', label: t.conditions },
              { id: 'localisation', label: t.location },
              { id: 'rendement', label: t.performance }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-[9px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? 'text-emerald-950' : 'text-emerald-900/30'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabPopup" className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-600" />
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-emerald-900/70 text-sm leading-relaxed font-light"
              >
                {activeTab === 'conditions' && (
                  <div>
                    <p>{backendData.conditionsDesc}</p>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                        <Thermometer size={14} className="text-amber-600" />
                        <span className="text-[9px] font-bold uppercase text-emerald-900">
                          {backendData.temp === "Climate Controlled" 
                            ? t.climateControlled
                            : t.naturalVentilation}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'localisation' && (
                  <div>
                    <div className="flex items-center gap-2 text-emerald-950 mb-2">
                      <MapPin size={16} className="text-amber-600" />
                      <span className="font-serif text-lg">{backendData.zone || backendData.location}</span>
                    </div>
                    <p>{backendData.locationDesc}</p>
                  </div>
                )}

                {activeTab === 'rendement' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-emerald-50">
                      <span className="block text-[7px] font-black text-emerald-900/30 uppercase mb-1">{t.cycle}</span>
                      <span className="text-lg font-serif text-emerald-950">{backendData.cycle}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-emerald-50">
                      <span className="block text-[7px] font-black text-emerald-900/30 uppercase mb-1">{t.targetWeight}</span>
                      <span className="text-lg font-serif text-emerald-950">{backendData.maturite}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA */}
          <div className="mt-10 pt-8 border-t border-emerald-900/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="block text-[8px] font-black text-emerald-900/30 uppercase">{t.projectCost}</span>
              <span className="text-2xl font-serif text-amber-600">{backendData.price} <span className="text-[10px] text-emerald-900/40">XAF</span></span>
            </div>
            <button 
              onClick={handleReserve}
              className="bg-emerald-950 text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2"
            >
              {t.reserve} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockDetailCard;