import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, GeoJSON, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// URL d'un GeoJSON précis et public pour le Cameroun
const CAMEROON_GEOJSON_URL = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/CMR.geo.json";

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true, duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

const ZoneMap = ({ activeZoneId, activeCenter, activeZoom = 6, showLegend = true }) => {
  const currentLang = useCurrentLang();
  const [geojsonData, setGeojsonData] = useState(null);

  // ========== TRADUCTIONS ==========
  const translations = {
    fr: {
      zones: [
        { 
          id: 1, 
          name: "Zone Sahélienne (Nord)",
          shortName: "Sahel",
          description: "Idéal pour l'élevage extensif, les céréales rustiques (mil, sorgho) et les cultures irriguées",
          opportunities: "Élevage bovin, mil, sorgho, oignons"
        },
        { 
          id: 2, 
          name: "Hautes Terres de l'Ouest",
          shortName: "Ouest",
          description: "Terres volcaniques fertiles, parfaites pour le café, cacao, pomme de terre et maraîchage",
          opportunities: "Café Arabica, cacao, pomme de terre, carottes, choux"
        },
        { 
          id: 3, 
          name: "Forêt Humide du Sud",
          shortName: "Sud",
          description: "Zone forestière riche, idéale pour le cacao, l'huile de palme et les bois précieux",
          opportunities: "Cacao, huile de palme, caoutchouc, bois d'œuvre"
        },
        { 
          id: 4, 
          name: "Plaine Côtière",
          shortName: "Littoral",
          description: "Zone stratégique pour la riziculture, le maraîchage et les zones industrielles agroalimentaires",
          opportunities: "Riz, maraîchage, ananas, banane plantain"
        },
        { 
          id: 5, 
          name: "Bassin de l'Est",
          shortName: "Est",
          description: "Grandes étendues agricoles disponibles, potentiel pour l'agro-industrie et l'élevage",
          opportunities: "Manioc, maïs, élevage porcin, acacia"
        }
      ],
      legend: {
        title: "Zones d'Investissement Agricole",
        subtitle: "Cliquez sur une zone pour explorer les opportunités",
        activeZone: "Zone active",
        opportunity: "Opportunités",
        roi: "ROI estimé"
      },
      tooltips: {
        agriculturalZone: "Zone agricole prioritaire",
        clickToExplore: "Cliquer pour explorer"
      }
    },
    en: {
      zones: [
        { 
          id: 1, 
          name: "Sahelian Zone (North)",
          shortName: "Sahel",
          description: "Ideal for extensive livestock farming, rustic cereals (millet, sorghum) and irrigated crops",
          opportunities: "Cattle farming, millet, sorghum, onions"
        },
        { 
          id: 2, 
          name: "Western Highlands",
          shortName: "West",
          description: "Fertile volcanic lands, perfect for coffee, cocoa, potatoes and market gardening",
          opportunities: "Arabica coffee, cocoa, potatoes, carrots, cabbage"
        },
        { 
          id: 3, 
          name: "Southern Rainforest",
          shortName: "South",
          description: "Rich forest area, ideal for cocoa, palm oil and precious woods",
          opportunities: "Cocoa, palm oil, rubber, timber"
        },
        { 
          id: 4, 
          name: "Coastal Plain",
          shortName: "Coastal",
          description: "Strategic zone for rice cultivation, market gardening and agribusiness industrial zones",
          opportunities: "Rice, market gardening, pineapple, plantain"
        },
        { 
          id: 5, 
          name: "Eastern Basin",
          shortName: "East",
          description: "Large available agricultural expanses, potential for agribusiness and livestock",
          opportunities: "Cassava, corn, pig farming, acacia"
        }
      ],
      legend: {
        title: "Agricultural Investment Zones",
        subtitle: "Click on a zone to explore opportunities",
        activeZone: "Active zone",
        opportunity: "Opportunities",
        roi: "Estimated ROI"
      },
      tooltips: {
        agriculturalZone: "Priority agricultural zone",
        clickToExplore: "Click to explore"
      }
    }
  };

  const t = translations[currentLang] || translations.fr;
  
  // Récupérer la zone active
  const activeZone = t.zones.find(z => z.id === activeZoneId);

  // Définition visuelle des zones avec les noms traduits pour l'affichage
  const ZONES_GEOMETRY = [
    { id: 1, center: [11.5, 14.5], radius: 100000, color: "#f97316", name: t.zones[0].shortName }, 
    { id: 2, center: [7.3, 13.5], radius: 110000, color: "#eab308", name: t.zones[1].shortName },  
    { id: 3, center: [5.6, 10.4], radius: 60000, color: "#10b981", name: t.zones[2].shortName },   
    { id: 4, center: [4.1, 9.3], radius: 50000, color: "#3b82f6", name: t.zones[3].shortName },    
    { id: 5, center: [3.8, 11.5], radius: 120000, color: "#059669", name: t.zones[4].shortName },  
  ];

  // Style pour la délimitation du Cameroun
  const cameroonStyle = {
    color: "#D4AF37",
    weight: 2,
    fillColor: "#1B4332",
    fillOpacity: 0.05,
    dashArray: "3",
    lineJoin: "round"
  };

  // Debug
  useEffect(() => {
    console.log(`🌍 ZoneMap - Environnement: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
    console.log(`🔗 ZoneMap - Backend URL: ${BACKEND_URL}`);
    console.log(`🗣️ ZoneMap - Langue active: ${currentLang}`);
  }, [currentLang]);

  // Chargement du GeoJSON
  useEffect(() => {
    fetch(CAMEROON_GEOJSON_URL)
      .then(response => response.json())
      .then(data => {
        setGeojsonData(data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement du GeoJSON du Cameroun:", error);
      });
  }, []);

  return (
    <div className="h-full w-full relative z-0">
      {/* Légende flottante traduite */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-pc-gold/20 max-w-xs pointer-events-none">
          <h4 className="text-xs font-bold text-slate-900 mb-2 border-b border-pc-gold/30 pb-1">
            {t.legend.title}
          </h4>
          <p className="text-[9px] text-slate-500 mb-3 italic">
            {t.legend.subtitle}
          </p>
          <div className="space-y-2">
            {ZONES_GEOMETRY.map((zone) => (
              <div key={zone.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: zone.color, opacity: activeZoneId === zone.id ? 0.8 : 0.4 }}
                ></div>
                <span className="text-[10px] text-slate-700">{zone.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carte interactive */}
      <MapContainer 
        center={[7.3697, 12.3547]} 
        zoom={6} 
        className="h-full w-full bg-[#0f172a]" 
        zoomControl={false}
      >
        {/* Fond Satellite */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{y}/{x}/{z}"
          attribution='&copy; Esri'
        />

        {/* GeoJSON du Cameroun */}
        {geojsonData && (
          <GeoJSON 
            data={geojsonData} 
            style={cameroonStyle}
            onEachFeature={(feature, layer) => {
              layer.on({
                mouseover: (e) => {
                  e.target.setStyle({ weight: 4, fillOpacity: 0.1 });
                },
                mouseout: (e) => {
                  e.target.setStyle(cameroonStyle);
                }
              });
            }}
          />
        )}

        <ZoomControl position="bottomright" />
        <MapController center={activeCenter} zoom={activeZoom} />

        {/* Cercles des zones */}
        {ZONES_GEOMETRY.map((zone) => (
          <Circle
            key={zone.id}
            center={zone.center}
            pathOptions={{ 
              fillColor: zone.color, 
              color: zone.color, 
              weight: activeZoneId === zone.id ? 3 : 1,
              fillOpacity: activeZoneId === zone.id ? 0.4 : 0.1 
            }}
            radius={zone.radius}
          />
        ))}
      </MapContainer>

      {/* Info-bulle de zone active (mobile friendly) */}
      {activeZone && showLegend && (
        <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-3 rounded-lg shadow-xl max-w-xs pointer-events-none md:hidden">
          <p className="text-xs font-bold text-pc-gold mb-1">{activeZone.name}</p>
          <p className="text-[9px] text-slate-300 line-clamp-2">{activeZone.description}</p>
        </div>
      )}
    </div>
  );
};

export default ZoneMap;