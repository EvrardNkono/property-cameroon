import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgroIntelligence from '../components/agriculture/AgroIntelligence';
import ZoneRadar from '../components/agriculture/ZoneRadar';
import LandCard from '../components/agriculture/LandCard';

// Hook pour récupérer la langue (à mutualiser dans un fichier utils!)
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

const AgriculturePage = () => {
  const currentLang = useCurrentLang();
  const [activeCrop, setActiveCrop] = useState(null);
  const [filteredLands, setFilteredLands] = useState([]);
  const [priceRange, setPriceRange] = useState('all'); // 'all', 'low', 'medium', 'high'
  const [zoneType, setZoneType] = useState('all'); // 'all', 'periurban', 'rural', 'remote'

  // ========== DONNÉES DES TERRES AVEC PRIX RÉALISTES ==========
  const landsData = {
    fr: [
      // Zones péri-urbaines (prix moyens)
      { 
        id: "LAND-001", 
        title: "Domaine Cacaoyer de Mbalmayo", 
        location: "Région du Centre", 
        zoneType: "periurban",
        size: "25 Ha", 
        price: "8,500,000", 
        pricePerHa: "340,000",
        matchScore: 98,
        description: "Parcelle certifiée avec accès route bitumée, électricité à 2km"
      },
      { 
        id: "LAND-002", 
        title: "Terres Volcaniques de Foumbot", 
        location: "Région de l'Ouest", 
        zoneType: "periurban",
        size: "10 Ha", 
        price: "4,200,000", 
        pricePerHa: "420,000",
        matchScore: 85,
        description: "Sol volcanique riche, proche axe principal"
      },
      // Zones rurales (prix abordables)
      { 
        id: "LAND-003", 
        title: "Vallée du Mbam - Terres Rizicoles", 
        location: "Région du Centre (Bafia)", 
        zoneType: "rural",
        size: "50 Ha", 
        price: "7,500,000", 
        pricePerHa: "150,000",
        matchScore: 92,
        description: "Prix promotionnel ! Zone irriguée idéale pour riz et maraîchage"
      },
      { 
        id: "LAND-004", 
        title: "Plateau de l'Adamaoua - Élevage", 
        location: "Région de l'Adamaoua", 
        zoneType: "rural",
        size: "100 Ha", 
        price: "12,000,000", 
        pricePerHa: "120,000",
        matchScore: 88,
        description: "Grand espace pour élevage extensif et fourrage"
      },
      // Zones reculées (très abordables)
      { 
        id: "LAND-005", 
        title: "Forêts du Dja - Agroforesterie", 
        location: "Région du Sud-Est (Lomié)", 
        zoneType: "remote",
        size: "200 Ha", 
        price: "15,000,000", 
        pricePerHa: "75,000",
        matchScore: 95,
        description: "🔥 MEILLEUR RAPPORT QUALITÉ/PRIX ! Forêt secondaire riche, idéal cacao bio"
      },
      { 
        id: "LAND-006", 
        title: "Savanes du Nord - Coton et Sésame", 
        location: "Région du Nord (Garoua)", 
        zoneType: "remote",
        size: "150 Ha", 
        price: "10,500,000", 
        pricePerHa: "70,000",
        matchScore: 90,
        description: "Prix imbattable ! Terres vierges, potentiel agricole énorme"
      },
      { 
        id: "LAND-007", 
        title: "Plaine de la Bénoué - Maraîchage", 
        location: "Région du Nord (Lagdo)", 
        zoneType: "remote",
        size: "30 Ha", 
        price: "2,400,000", 
        pricePerHa: "80,000",
        matchScore: 87,
        description: "💡 PARFAIT POUR DÉMARRER ! Proche barrage, terre irrigable"
      },
      { 
        id: "LAND-008", 
        title: "Massif du Mbam - Forêt Communautaire", 
        location: "Région du Centre (Yokadouma)", 
        zoneType: "remote",
        size: "75 Ha", 
        price: "5,250,000", 
        pricePerHa: "70,000",
        matchScore: 93,
        description: "Projet communautaire avec appui technique inclus"
      }
    ],
    en: [
      // Peri-urban areas (medium prices)
      { 
        id: "LAND-001", 
        title: "Mbalmayo Cocoa Estate", 
        location: "Center Region", 
        zoneType: "periurban",
        size: "25 Ha", 
        price: "8,500,000", 
        pricePerHa: "340,000",
        matchScore: 98,
        description: "Certified plot with paved road access, electricity 2km away"
      },
      { 
        id: "LAND-002", 
        title: "Foumbot Volcanic Lands", 
        location: "West Region", 
        zoneType: "periurban",
        size: "10 Ha", 
        price: "4,200,000", 
        pricePerHa: "420,000",
        matchScore: 85,
        description: "Rich volcanic soil near main road"
      },
      { 
        id: "LAND-003", 
        title: "Mbam Valley - Rice Fields", 
        location: "Center Region (Bafia)", 
        zoneType: "rural",
        size: "50 Ha", 
        price: "7,500,000", 
        pricePerHa: "150,000",
        matchScore: 92,
        description: "PROMOTIONAL PRICE! Irrigated area ideal for rice and vegetables"
      },
      { 
        id: "LAND-004", 
        title: "Adamawa Plateau - Livestock", 
        location: "Adamawa Region", 
        zoneType: "rural",
        size: "100 Ha", 
        price: "12,000,000", 
        pricePerHa: "120,000",
        matchScore: 88,
        description: "Large space for extensive livestock and fodder"
      },
      { 
        id: "LAND-005", 
        title: "Dja Forest - Agroforestry", 
        location: "Southeast Region (Lomié)", 
        zoneType: "remote",
        size: "200 Ha", 
        price: "15,000,000", 
        pricePerHa: "75,000",
        matchScore: 95,
        description: "🔥 BEST VALUE! Rich secondary forest, ideal for organic cocoa"
      },
      { 
        id: "LAND-006", 
        title: "Northern Savannahs - Cotton & Sesame", 
        location: "North Region (Garoua)", 
        zoneType: "remote",
        size: "150 Ha", 
        price: "10,500,000", 
        pricePerHa: "70,000",
        matchScore: 90,
        description: "Unbeatable price! Virgin lands with huge agricultural potential"
      },
      { 
        id: "LAND-007", 
        title: "Benoue Plain - Market Gardening", 
        location: "North Region (Lagdo)", 
        zoneType: "remote",
        size: "30 Ha", 
        price: "2,400,000", 
        pricePerHa: "80,000",
        matchScore: 87,
        description: "💡 PERFECT TO START! Near dam, irrigable land"
      },
      { 
        id: "LAND-008", 
        title: "Mbam Massif - Community Forest", 
        location: "Center Region (Yokadouma)", 
        zoneType: "remote",
        size: "75 Ha", 
        price: "5,250,000", 
        pricePerHa: "70,000",
        matchScore: 93,
        description: "Community project with technical support included"
      }
    ]
  };

  // ========== TRADUCTIONS ==========
  const t = {
    fr: {
      // Hero section
      heroBadge: "Portail d'Investissement",
      heroTitle: "Cultivez Votre",
      heroTitleLegacy: "Héritage",
      heroSubtitle: "Accédez à une sélection rigoureuse de terres agricoles certifiées au Cameroun, à partir de 70 000 FCFA/Ha dans les zones à fort potentiel.",
      
      // Listing section
      availableOpportunities: "Opportunités",
      availableTagline: "Disponibles",
      selectCropHint: "Sélectionnez une culture ci-dessus pour affiner vos résultats.",
      totalAssets: "Actifs",
      
      // Filters
      filterByPrice: "Filtrer par prix",
      allPrices: "Tous les prix",
      lowPrice: "Économique (< 5M FCFA)",
      mediumPrice: "Abordable (5M - 10M FCFA)",
      highPrice: "Premium (> 10M FCFA)",
      filterByZone: "Zone géographique",
      allZones: "Toutes zones",
      periurban: "Péri-urbain (Accès facile)",
      rural: "Rural (Bon rapport)",
      remote: "⭐⭐ RECULÉ (Prix imbattables) ⭐⭐",
      
      // Price info
      pricePerHa: "Prix/Ha",
      
      // CTA section
      ctaTitle: "Vous cherchez des terres encore moins chères ?",
      ctaSubtitle: "Nous avons des offres spéciales dans les zones reculées à partir de 50 000 FCFA/Ha. Contactez-nous pour un devis personnalisé.",
      ctaButton: "Demander un catalogue complet",
      
      // Zone labels
      zoneLabels: {
        periurban: "📍 Accès facile",
        rural: "🌾 Bon rapport qualité/prix",
        remote: "🔥 PRIX IMBATTABLE - Zone reculée"
      }
    },
    en: {
      // Hero section
      heroBadge: "Investment Gateway",
      heroTitle: "Cultivate Your",
      heroTitleLegacy: "Legacy",
      heroSubtitle: "Access a rigorous selection of certified agricultural lands in Cameroon, starting from 70,000 FCFA/Ha in high-potential areas.",
      
      // Listing section
      availableOpportunities: "Available",
      availableTagline: "Opportunities",
      selectCropHint: "Select a crop above to refine your search results.",
      totalAssets: "Assets",
      
      // Filters
      filterByPrice: "Filter by price",
      allPrices: "All prices",
      lowPrice: "Budget (< 5M FCFA)",
      mediumPrice: "Affordable (5M - 10M FCFA)",
      highPrice: "Premium (> 10M FCFA)",
      filterByZone: "Zone type",
      allZones: "All zones",
      periurban: "Peri-urban (Easy access)",
      rural: "Rural (Good value)",
      remote: "⭐⭐ REMOTE (Unbeatable prices) ⭐⭐",
      
      // Price info
      pricePerHa: "Price/Ha",
      
      // CTA section
      ctaTitle: "Looking for even cheaper land?",
      ctaSubtitle: "We have special offers in remote areas starting from 50,000 FCFA/Ha. Contact us for a custom quote.",
      ctaButton: "Request full catalog",
      
      // Zone labels
      zoneLabels: {
        periurban: "📍 Easy access",
        rural: "🌾 Great value",
        remote: "🔥 UNBEATABLE PRICE - Remote area"
      }
    }
  }[currentLang] || {
    heroBadge: "Portail d'Investissement",
    heroTitle: "Cultivez Votre",
    heroTitleLegacy: "Héritage",
    heroSubtitle: "Accédez à une sélection rigoureuse de terres agricoles certifiées au Cameroun...",
    availableOpportunities: "Opportunités",
    availableTagline: "Disponibles",
    selectCropHint: "Sélectionnez une culture ci-dessus pour affiner vos résultats.",
    totalAssets: "Actifs",
    filterByPrice: "Filtrer par prix",
    allPrices: "Tous les prix",
    lowPrice: "Économique (< 5M FCFA)",
    mediumPrice: "Abordable (5M - 10M FCFA)",
    highPrice: "Premium (> 10M FCFA)",
    filterByZone: "Zone géographique",
    allZones: "Toutes zones",
    periurban: "Péri-urbain",
    rural: "Rural",
    remote: "Reculé",
    pricePerHa: "Prix/Ha",
    ctaTitle: "Vous ne trouvez pas la parcelle idéale ?",
    ctaSubtitle: "Notre équipe peut effectuer une recherche personnalisée...",
    ctaButton: "Lancer un Mandat de Recherche",
    zoneLabels: {
      periurban: "📍 Accès facile",
      rural: "🌾 Bon rapport",
      remote: "🔥 Prix imbattable"
    }
  };

  // Obtenir les terres selon la langue
  const currentLands = landsData[currentLang] || landsData.fr;

  // Filtrer les terres
  useEffect(() => {
    let filtered = [...currentLands];
    
    // Filtre par prix
    if (priceRange !== 'all') {
      filtered = filtered.filter(land => {
        const priceNum = parseInt(land.price.replace(/,/g, ''));
        if (priceRange === 'low') return priceNum < 5000000;
        if (priceRange === 'medium') return priceNum >= 5000000 && priceNum <= 10000000;
        if (priceRange === 'high') return priceNum > 10000000;
        return true;
      });
    }
    
    // Filtre par zone
    if (zoneType !== 'all') {
      filtered = filtered.filter(land => land.zoneType === zoneType);
    }
    
    // Filtre par culture (si active)
    if (activeCrop) {
      // Logique de filtrage par culture à implémenter
      console.log("Filtering for crop:", activeCrop.name);
    }
    
    setFilteredLands(filtered);
  }, [currentLang, priceRange, zoneType, activeCrop, currentLands]);

  const handleMatchFound = (crop) => {
    setActiveCrop(crop);
    console.log("Filtering lands for:", crop.name);
  };

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(parseInt(price));
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-pc-green selection:text-white">
      <Navbar />

      <section className="relative pt-48 pb-40 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-pc-gold"></span>
              <span className="text-pc-gold text-[10px] font-black uppercase tracking-[0.5em]">
                {t.heroBadge}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter mb-8">
              {t.heroTitle} <br />
              <span className="text-pc-green italic font-light underline decoration-pc-gold/20">
                {t.heroTitleLegacy}
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 relative -mt-20">
        <AgroIntelligence onMatchFound={handleMatchFound} />
      </section>

      <ZoneRadar />

      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-serif text-slate-900 uppercase tracking-tighter">
                {t.availableOpportunities} <span className="text-pc-green italic font-light">{t.availableTagline}</span>
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {activeCrop 
                  ? `Optimized lands for growing: ${activeCrop.name}`
                  : t.selectCropHint}
              </p>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 mt-4 md:mt-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {t.totalAssets}: {filteredLands.length}
               </span>
            </div>
          </div>

          {/* ========== FILTRES AJOUTÉS ========== */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.filterByPrice}</label>
              <select 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
              >
                <option value="all">{t.allPrices}</option>
                <option value="low">{t.lowPrice}</option>
                <option value="medium">{t.mediumPrice}</option>
                <option value="high">{t.highPrice}</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.filterByZone}</label>
              <select 
                value={zoneType} 
                onChange={(e) => setZoneType(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
              >
                <option value="all">{t.allZones}</option>
                <option value="periurban">{t.periurban}</option>
                <option value="rural">{t.rural}</option>
                <option value="remote">{t.remote}</option>
              </select>
            </div>

            {/* Indicateur de prix minimum */}
            <div className="ml-auto flex items-center">
              <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold">
                💰 À partir de 70 000 FCFA/Ha
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredLands.map((land) => (
              <LandCard key={land.id} land={land} zoneLabel={t.zoneLabels[land.zoneType]} formatPrice={formatPrice} t={t} />
            ))}
          </div>

          {filteredLands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Aucune terre ne correspond à vos critères. Essayez d'élargir vos filtres.</p>
            </div>
          )}

          <div className="mt-20 p-12 bg-gradient-to-r from-emerald-900 to-slate-900 text-center relative overflow-hidden group rounded-2xl">
            <div className="absolute inset-0 bg-pc-green opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <h3 className="text-white text-2xl font-serif mb-4">{t.ctaTitle}</h3>
            <p className="text-slate-300 text-sm mb-8 max-w-lg mx-auto">
              {t.ctaSubtitle}
            </p>
            <button className="px-10 py-4 border border-pc-gold text-pc-gold text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pc-gold hover:text-slate-900 transition-all">
              {t.ctaButton}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgriculturePage;