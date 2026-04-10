import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, GeoJSON, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// URL d'un GeoJSON précis et public pour le Cameroun (hébergé sur GitHub)
// Ce fichier contient les tracés officiels et détaillés.
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

const ZoneMap = ({ activeZoneId, activeCenter, activeZoom = 6 }) => {
  const [geojsonData, setGeojsonData] = useState(null);

  // Chargement du GeoJSON précis au montage du composant
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

  // Définition visuelle des zones (cercles de rayonnement agro)
  const ZONES_GEOMETRY = [
    { id: 1, center: [11.5, 14.5], radius: 100000, color: "#f97316" }, 
    { id: 2, center: [7.3, 13.5], radius: 110000, color: "#eab308" },  
    { id: 3, center: [5.6, 10.4], radius: 60000, color: "#10b981" },   
    { id: 4, center: [4.1, 9.3], radius: 50000, color: "#3b82f6" },    
    { id: 5, center: [3.8, 11.5], radius: 120000, color: "#059669" },  
  ];

  // Style précis pour la délimitation du Cameroun
  const cameroonStyle = {
    color: "#D4AF37", // pc-gold (Or Prestige)
    weight: 2,
    fillColor: "#1B4332", // pc-green (Optionnel : léger fond vert pour le pays)
    fillOpacity: 0.05, // Très transparent pour ne pas masquer le satellite
    dashArray: "3", // Petits pointillés élégants
    lineJoin: "round"
  };

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[7.3697, 12.3547]} 
        zoom={6} 
        className="h-full w-full bg-[#0f172a]" 
        zoomControl={false}
      >
        {/* Fond Satellite (Le relief) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{y}/{x}/{z}"
          attribution='&copy; Esri'
        />

        {/* AFFICHAGE DU GEOJSON PRÉCIS (DÉLIMITATIONS DU CAMEROUN) */}
        {geojsonData && (
          <GeoJSON 
            data={geojsonData} 
            style={cameroonStyle}
            // Exemple d'interactivité : effet au survol
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

        {ZONES_GEOMETRY.map((zone) => (
          <Circle
            key={zone.id}
            center={zone.center}
            pathOptions={{ 
              fillColor: zone.color, 
              color: zone.color, 
              weight: 1, 
              fillOpacity: activeZoneId === zone.id ? 0.4 : 0.1 
            }}
            radius={zone.radius}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default ZoneMap;