// frontend/src/components/agriculture/LandCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Droplets, Gauge, ArrowRight, Activity, TrendingUp, Sprout, Zap } from 'lucide-react';

// Hook personnalisé pour la détection de langue
const useCurrentLang = () => {
  const [lang, setLang] = useState('fr');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    
    const finalLang = urlLang || storedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLang(finalLang);
  }, []);
  
  return lang;
};

// 🔥 Détection automatique de l'environnement
const isDevelopment = typeof window !== 'undefined' && 
                      (window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '');

// URLs en dur selon l'environnement
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://property-cameroon-backend.vercel.app';

const LandCard = ({ land }) => {
  const currentLang = useCurrentLang();

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      labels: {
        match: "Score de Compatibilité",
        matchPercent: "Match",
        landTitleVerified: "Titre Foncier Vérifié",
        id: "ID",
        pcAuditCertified: "Certifié PC-Audit",
        soilQuality: "Qualité du Sol",
        waterAccess: "Accès à l'Eau",
        waterAccessYes: "Oui ✓",
        waterAccessNo: "Non",
        primaryCrop: "Culture Principale",
        expectedRoi: "ROI Annuel Estimé",
        totalSurface: "Superficie Totale",
        initialInvestment: "Investissement Initial",
        fullAnalysis: "Analyse Complète",
        notSpecified: "Non spécifié"
      },
      status: {
        verified: "Vérifié",
        certified: "Certifié"
      }
    },
    en: {
      labels: {
        match: "Compatibility Score",
        matchPercent: "Match",
        landTitleVerified: "Land Title Verified",
        id: "ID",
        pcAuditCertified: "PC-Audit Certified",
        soilQuality: "Soil Quality",
        waterAccess: "Water Access",
        waterAccessYes: "Yes ✓",
        waterAccessNo: "No",
        primaryCrop: "Primary Crop",
        expectedRoi: "Expected Annual ROI",
        totalSurface: "Total Surface Area",
        initialInvestment: "Initial Investment",
        fullAnalysis: "Full Analysis",
        notSpecified: "Not specified"
      },
      status: {
        verified: "Verified",
        certified: "Certified"
      }
    }
  };

  const t = translations[currentLang] || translations.fr;

  // 🔥 Fonction pour obtenir l'URL complète de l'image avec BACKEND_URL dynamique
  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop";
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `${BACKEND_URL}${image}`;
    return `${BACKEND_URL}/uploads/properties/${image}`;
  };

  // Score de compatibilité
  const matchScore = land.matchScore || 92;

  // Formatage du prix
  const formatPrice = (price) => {
    if (!price) return "0";
    const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num.toString();
  };

  // Obtenir la valeur de l'eau traduite
  const getWaterAccessText = (hasAccess) => {
    return hasAccess ? t.labels.waterAccessYes : t.labels.waterAccessNo;
  };

  return (
    <Link to={`/agriculture/land/${land.id}`} className="block group">
      <div className="group bg-white border border-slate-100 flex flex-col md:flex-row h-full hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
        
        {/* VISUAL SECTION */}
        <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
          <img 
            src={getImageUrl(land.image)} 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
            alt={land.title}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop";
            }}
          />
          
          {/* Compatibility Score Badge */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 flex items-center gap-2 border border-pc-gold/30 rounded">
            <Activity size={12} className="text-pc-green animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {t.labels.match}: <span className="text-pc-gold">{matchScore}%</span>
            </span>
          </div>

          {/* Legal Status Badge */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="bg-pc-green text-white text-[8px] font-black uppercase px-2 py-1 tracking-tighter shadow-lg rounded">
              {t.labels.landTitleVerified}
            </span>
          </div>
        </div>

        {/* DATA & SPECS SECTION */}
        <div className="md:w-3/5 p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {t.labels.id}: {land.id?.slice(-8) || "AGR-237"}
              </span>
              <div className="flex items-center gap-1 text-pc-gold">
                <ShieldCheck size={14} />
                <span className="text-[8px] font-bold uppercase tracking-wide">{t.labels.pcAuditCertified}</span>
              </div>
            </div>

            <h3 className="text-2xl font-serif text-slate-900 mb-1 group-hover:text-pc-green transition-colors uppercase tracking-tighter">
              {land.title || "Sangmélima Agricultural Estate"}
            </h3>
            
            <div className="flex items-center gap-1 text-slate-400 mb-6">
              <MapPin size={12} />
              <span className="text-[10px] font-medium italic">{land.location || "South Region, Cameroon"}</span>
            </div>

            {/* TECHNICAL GRID - Données dynamiques */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 mb-6">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase font-black text-slate-400 mb-1 flex items-center gap-1">
                  <Gauge size={10} /> {t.labels.soilQuality}
                </span>
                <span className="text-sm font-bold text-slate-800">{land.soilQuality || 70}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase font-black text-slate-400 mb-1 flex items-center gap-1">
                  <Droplets size={10} /> {t.labels.waterAccess}
                </span>
                <span className="text-sm font-bold text-slate-800">{getWaterAccessText(land.waterAccess)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase font-black text-slate-400 mb-1 flex items-center gap-1">
                  <Sprout size={10} /> {t.labels.primaryCrop}
                </span>
                <span className="text-sm font-bold text-slate-800 capitalize">
                  {land.primaryCrop || t.labels.notSpecified}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase font-black text-slate-400 mb-1 flex items-center gap-1">
                  <TrendingUp size={10} /> {t.labels.expectedRoi}
                </span>
                <span className="text-sm font-bold text-green-600">+{land.expectedRoi || 12}%</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[8px] uppercase font-black text-slate-400">{t.labels.totalSurface}</span>
                <span className="text-xl font-serif font-black text-slate-900">{land.size || "50 Ha"}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] uppercase font-black text-slate-400">{t.labels.initialInvestment}</span>
                <span className="text-xl font-black text-pc-green">{formatPrice(land.price)} FCFA</span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex gap-2">
            <div className="flex-grow py-4 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest hover:bg-pc-gold hover:text-slate-900 transition-all flex items-center justify-center gap-2 group/btn rounded">
              {t.labels.fullAnalysis} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </div>
            <button className="px-4 border border-slate-200 hover:bg-slate-50 transition-colors rounded" onClick={(e) => e.preventDefault()}>
              <Activity size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LandCard;