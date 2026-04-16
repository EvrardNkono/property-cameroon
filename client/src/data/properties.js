export const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Ambassadorial Villa - Bastos",
    type: "house",
    category: "Villa",
    status: "sale",
    price: "750,000,000",
    location: "Bastos (Secure Zone), Yaoundé",
    description: "Une demeure d'exception située dans l'épicentre diplomatique. Cette villa de luxe offre des volumes majestueux, un jardin paysager avec piscine olympique, et une dépendance pour le personnel. Sécurité maximale avec guérite et clôture électrifiée.",
    beds: 8,
    baths: 7,
    surface: "1,500 m²",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070"
    ],
    amenities: {
      schools: { count: 3, names: ["Lycée de Bastos", "École Internationale Le Flamboyant", "American School"] },
      markets: { count: 2, names: ["Marché de Bastos", "Supermarché Casino"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 2, names: ["Acacias Bastos", "Select Bakes"] }
    }
  },
  {
    id: 2,
    title: "Penthouse Horizon - Golf Club View",
    type: "apartment",
    category: "Penthouse",
    status: "lease",
    price: "1,500,000",
    location: "Golf, Yaoundé",
    description: "Au sommet d'un immeuble de standing, ce penthouse offre une vue imprenable sur le parcours du Golf. Finitions ultra-modernes, cuisine américaine équipée, et terrasse panoramique de 100m².",
    beds: 4,
    baths: 4,
    surface: "320 m²",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980",
    gallery: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"],
    amenities: {
      schools: { count: 2, names: ["Collège Jean-Tabi", "British School"] },
      markets: { count: 1, names: ["Santa Lucia Golf"] },
      stations: { count: 1, names: ["Oilibya Golf"] },
      bakeries: { count: 1, names: ["Boulangerie du Golf"] }
    }
  },
  {
    id: 5,
    title: "Titled Land - Near Airport",
    type: "land",
    category: "Building Plot",
    status: "sale",
    price: "35,000,000",
    location: "Nsimalen, Yaoundé",
    description: "Terrain titré et loti, idéal pour un projet hôtelier ou une résidence privée. Zone en plein essor à proximité de l'autoroute de l'aéroport. Terrain plat et prêt à bâtir.",
    size: "1,000",
    surface: "1,000 m²",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932",
    gallery: [],
    amenities: {
      schools: { count: 1, names: ["École Publique Nsimalen"] },
      markets: { count: 1, names: ["Marché local Nsimalen"] },
      stations: { count: 2, names: ["Tradex Nsimalen", "Total Airport"] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: 9,
    title: "Industrial Warehouse - Magzi Zone",
    type: "office",
    category: "Warehouse",
    status: "sale",
    price: "850,000,000",
    location: "Magzi (Industrial Zone), Yaoundé",
    description: "Entrepôt industriel de grande capacité avec bureaux administratifs intégrés. Accès poids lourds facilité, zone sécurisée 24/7, hauteur sous plafond de 12 mètres.",
    size: "2,500",
    surface: "2,500 m²",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070",
    gallery: [],
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Zone Magzi Food Court"] },
      stations: { count: 2, names: ["Total Magzi", "Oilibya Magzi"] },
      bakeries: { count: 1, names: ["Point de vente Saker"] }
    }
  },
  {
    id: 11,
    title: "Student Residence - Soa",
    type: "house",
    category: "Hostel",
    status: "sale",
    price: "120,000,000",
    location: "Soa (University District)",
    description: "Immeuble de rapport comprenant 12 studios modernes pour étudiants. Rentabilité immédiate, forage opérationnel, proximité immédiate du campus universitaire.",
    beds: 12,
    baths: 12,
    surface: "600 m²",
    image: "https://images.unsplash.com/photo-1555854817-2b22603c76de?q=80&w=2071",
    gallery: ["https://images.unsplash.com/photo-1536376074432-af7158d15fe4?q=80&w=2070"],
    amenities: {
      schools: { count: 2, names: ["Université de Soa", "Institut Nanfah"] },
      markets: { count: 1, names: ["Marché de Soa"] },
      stations: { count: 1, names: ["Tradex Soa"] },
      bakeries: { count: 2, names: ["Boulangerie du Campus", "Zepol Soa"] }
    }
  },
  {
    id: 13,
    title: "Cocoa Plantation - Fertile Soil",
    type: "field",
    category: "Farmland",
    status: "sale",
    price: "25,000,000",
    location: "Obala (Lékié)",
    description: "Exploitation agricole de 5 hectares avec cacaoyers en pleine production. Sol extrêmement fertile, accès facile par piste carrossable, cours d'eau permanent à proximité.",
    size: "50,000",
    surface: "5 hectares",
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070",
    gallery: [],
    amenities: {
      schools: { count: 1, names: ["École Rurale Obala"] },
      markets: { count: 1, names: ["Marché de gros Obala"] },
      stations: { count: 1, names: ["Total Obala"] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: 16,
    title: "Beachfront Plot - Kribi",
    type: "land",
    category: "Seaside Plot",
    status: "sale",
    price: "95,000,000",
    location: "Lobe, Kribi",
    description: "Terrain d'exception en bordure de mer à proximité des Chutes de la Lobe. Pieds dans l'eau, titre foncier disponible, zone touristique à fort potentiel de développement.",
    size: "1,200",
    surface: "1,200 m²",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
    gallery: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070"],
    amenities: {
      schools: { count: 1, names: ["Lycée Bilingue Kribi"] },
      markets: { count: 1, names: ["Débarcadère de Kribi"] },
      stations: { count: 1, names: ["Tradex Kribi"] },
      bakeries: { count: 1, names: ["Boulangerie du Port"] }
    }
  },
  {
    id: 17,
    title: "Luxury Loft - Akwa",
    type: "apartment",
    category: "Loft",
    status: "lease",
    price: "900,000",
    location: "Akwa, Douala",
    description: "Loft ultra-moderne au coeur du quartier des affaires. Décoration industrielle, hauts plafonds, isolation acoustique renforcée et service de conciergerie.",
    beds: 2,
    baths: 2,
    surface: "180 m²",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070",
    gallery: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980"],
    amenities: {
      schools: { count: 2, names: ["Collège Libermann", "Lycée de Joss"] },
      markets: { count: 2, names: ["Marché Sandaga", "Douala Grand Mall"] },
      stations: { count: 3, names: ["Total Akwa Nord", "Oilibya Liberté", "Tradex Bépanda"] },
      bakeries: { count: 3, names: ["Saker Akwa", "Zepol Akwa", "La Baguette"] }
    }
  }
];