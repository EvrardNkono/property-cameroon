export const MOCK_PROPERTIES = [
  // ========== PROPRIÉTÉS EXISTANTES (conservées) ==========
  {
    id: 1,
    title: "Ambassadorial Villa - Bastos",
    type: "house",
    category: "Villa",
    status: "sale",
    price: "750,000,000",
    priceValue: 750000000,
    priceUnit: "FCFA",
    location: "Bastos (Secure Zone), Yaoundé",
    coordinates: {
      lat: 3.8667,
      lng: 11.5167
    },
    description: "Une demeure d'exception située dans l'épicentre diplomatique. Cette villa de luxe offre des volumes majestueux, un jardin paysager avec piscine olympique, et une dépendance pour le personnel. Sécurité maximale avec guérite et clôture électrifiée.",
    beds: 8,
    baths: 7,
    surface: "1,500 m²",
    surfaceValue: 1500,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070"
    ],
    featured: true,
    views: 1250,
    isAvailable: true,
    publishedAt: "2025-03-01T08:00:00Z",
    constructionYear: 2018,
    hasTitleDeed: true,
    hasParking: true,
    parkingSpots: 4,
    badges: ["exclusive", "luxury"],
    tags: ["villa", "piscine", "diplomatique", "sécurisé", "luxe", "bastos"],
    agent: {
      name: "Sophie Mbarga",
      phone: "+237 6XX XXX XXX",
      email: "sophie@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      agency: "Property Cameroon",
      rating: 4.9
    },
    amenities: {
      schools: { count: 3, names: ["Lycée de Bastos", "École Internationale Le Flamboyant", "American School"] },
      markets: { count: 2, names: ["Marché de Bastos", "Supermarché Casino"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 2, names: ["Acacias Bastos", "Select Bakes"] }
    },
    neighborhood: {
      type: "diplomatic",
      safety: "high",
      noiseLevel: "low",
      development: "luxury"
    }
  },
  {
    id: 2,
    title: "Penthouse Horizon - Golf Club View",
    type: "apartment",
    category: "Penthouse",
    status: "lease",
    price: "1,500,000",
    priceValue: 1500000,
    priceUnit: "FCFA/mois",
    location: "Golf, Yaoundé",
    coordinates: {
      lat: 3.8645,
      lng: 11.5189
    },
    description: "Au sommet d'un immeuble de standing, ce penthouse offre une vue imprenable sur le parcours du Golf. Finitions ultra-modernes, cuisine américaine équipée, et terrasse panoramique de 100m².",
    beds: 4,
    baths: 4,
    surface: "320 m²",
    surfaceValue: 320,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980",
    gallery: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"],
    featured: true,
    views: 890,
    isAvailable: true,
    publishedAt: "2025-02-15T10:30:00Z",
    constructionYear: 2021,
    floorNumber: 8,
    totalFloors: 10,
    hasElevator: true,
    hasParking: true,
    parkingSpots: 2,
    badges: ["luxury", "view"],
    tags: ["penthouse", "vue", "golf", "luxe", "terrasse"],
    agent: {
      name: "Jean Kamga",
      phone: "+237 6XX XXX XXX",
      email: "jean@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      agency: "Property Cameroon",
      rating: 4.7
    },
    amenities: {
      schools: { count: 2, names: ["Collège Jean-Tabi", "British School"] },
      markets: { count: 1, names: ["Santa Lucia Golf"] },
      stations: { count: 1, names: ["Oilibya Golf"] },
      bakeries: { count: 1, names: ["Boulangerie du Golf"] }
    },
    neighborhood: {
      type: "residential",
      safety: "high",
      noiseLevel: "low",
      development: "developed"
    }
  },
  {
    id: 5,
    title: "Titled Land - Near Airport",
    type: "land",
    category: "Building Plot",
    status: "sale",
    price: "35,000,000",
    priceValue: 35000000,
    priceUnit: "FCFA",
    location: "Nsimalen, Yaoundé",
    coordinates: {
      lat: 3.7592,
      lng: 11.5536
    },
    description: "Terrain titré et loti, idéal pour un projet hôtelier ou une résidence privée. Zone en plein essor à proximité de l'autoroute de l'aéroport. Terrain plat et prêt à bâtir.",
    size: "1,000",
    surface: "1,000 m²",
    surfaceValue: 1000,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932",
    gallery: [],
    featured: false,
    views: 342,
    isAvailable: true,
    publishedAt: "2025-03-20T14:15:00Z",
    hasTitleDeed: true,
    hasSurvey: true,
    hasConstructionPermit: false,
    badges: ["urgent", "price-reduced"],
    tags: ["terrain", "titré", "aéroport", "investissement", "constructible"],
    agent: {
      name: "Pierre Nga",
      phone: "+237 6XX XXX XXX",
      email: "pierre@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      agency: "Property Cameroon",
      rating: 4.5
    },
    amenities: {
      schools: { count: 1, names: ["École Publique Nsimalen"] },
      markets: { count: 1, names: ["Marché local Nsimalen"] },
      stations: { count: 2, names: ["Tradex Nsimalen", "Total Airport"] },
      bakeries: { count: 0, names: [] }
    },
    neighborhood: {
      type: "developing",
      safety: "medium",
      noiseLevel: "medium",
      development: "developing"
    }
  },
  {
    id: 9,
    title: "Industrial Warehouse - Magzi Zone",
    type: "office",
    category: "Warehouse",
    status: "sale",
    price: "850,000,000",
    priceValue: 850000000,
    priceUnit: "FCFA",
    location: "Magzi (Industrial Zone), Yaoundé",
    coordinates: {
      lat: 3.9015,
      lng: 11.5112
    },
    description: "Entrepôt industriel de grande capacité avec bureaux administratifs intégrés. Accès poids lourds facilité, zone sécurisée 24/7, hauteur sous plafond de 12 mètres.",
    size: "2,500",
    surface: "2,500 m²",
    surfaceValue: 2500,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070",
    gallery: [],
    featured: false,
    views: 156,
    isAvailable: true,
    publishedAt: "2025-04-01T09:00:00Z",
    constructionYear: 2015,
    hasParking: true,
    parkingSpots: 15,
    badges: ["commercial", "investment"],
    tags: ["entrepôt", "industriel", "commerce", "investissement", "magzi"],
    agent: {
      name: "Abdoulaye Diallo",
      phone: "+237 6XX XXX XXX",
      email: "abdoulaye@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/men/67.jpg",
      agency: "Property Cameroon",
      rating: 4.8
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Zone Magzi Food Court"] },
      stations: { count: 2, names: ["Total Magzi", "Oilibya Magzi"] },
      bakeries: { count: 1, names: ["Point de vente Saker"] }
    },
    neighborhood: {
      type: "industrial",
      safety: "medium",
      noiseLevel: "high",
      development: "developed"
    }
  },
  {
    id: 11,
    title: "Student Residence - Soa",
    type: "house",
    category: "Hostel",
    status: "sale",
    price: "120,000,000",
    priceValue: 120000000,
    priceUnit: "FCFA",
    location: "Soa (University District)",
    coordinates: {
      lat: 3.9847,
      lng: 11.5997
    },
    description: "Immeuble de rapport comprenant 12 studios modernes pour étudiants. Rentabilité immédiate, forage opérationnel, proximité immédiate du campus universitaire.",
    beds: 12,
    baths: 12,
    surface: "600 m²",
    surfaceValue: 600,
    image: "https://images.unsplash.com/photo-1555854817-2b22603c76de?q=80&w=2071",
    gallery: ["https://images.unsplash.com/photo-1536376074432-af7158d15fe4?q=80&w=2070"],
    featured: true,
    views: 567,
    isAvailable: true,
    publishedAt: "2025-02-28T11:20:00Z",
    constructionYear: 2020,
    hasTitleDeed: true,
    hasParking: true,
    parkingSpots: 6,
    badges: ["investment", "high-yield"],
    tags: ["investissement", "étudiants", "rentabilité", "soa", "studios"],
    agent: {
      name: "Marie-Claire Fouda",
      phone: "+237 6XX XXX XXX",
      email: "marie@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/women/54.jpg",
      agency: "Property Cameroon",
      rating: 4.9
    },
    amenities: {
      schools: { count: 2, names: ["Université de Soa", "Institut Nanfah"] },
      markets: { count: 1, names: ["Marché de Soa"] },
      stations: { count: 1, names: ["Tradex Soa"] },
      bakeries: { count: 2, names: ["Boulangerie du Campus", "Zepol Soa"] }
    },
    neighborhood: {
      type: "student",
      safety: "medium",
      noiseLevel: "high",
      development: "developing"
    }
  },
  {
    id: 13,
    title: "Cocoa Plantation - Fertile Soil",
    type: "field",
    category: "Farmland",
    status: "sale",
    price: "25,000,000",
    priceValue: 25000000,
    priceUnit: "FCFA",
    location: "Obala (Lékié)",
    coordinates: {
      lat: 4.1667,
      lng: 11.5333
    },
    description: "Exploitation agricole de 5 hectares avec cacaoyers en pleine production. Sol extrêmement fertile, accès facile par piste carrossable, cours d'eau permanent à proximité.",
    size: "50,000",
    surface: "5 hectares",
    surfaceValue: 50000,
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070",
    gallery: [],
    featured: false,
    views: 234,
    isAvailable: true,
    publishedAt: "2025-03-10T13:45:00Z",
    hasTitleDeed: true,
    badges: ["agricultural", "investment"],
    tags: ["cacao", "agricole", "plantation", "investissement", "obala"],
    agent: {
      name: "Alain Mbarga",
      phone: "+237 6XX XXX XXX",
      email: "alain@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/men/78.jpg",
      agency: "Property Cameroon",
      rating: 4.6
    },
    amenities: {
      schools: { count: 1, names: ["École Rurale Obala"] },
      markets: { count: 1, names: ["Marché de gros Obala"] },
      stations: { count: 1, names: ["Total Obala"] },
      bakeries: { count: 0, names: [] }
    },
    neighborhood: {
      type: "rural",
      safety: "high",
      noiseLevel: "low",
      development: "developing"
    }
  },
  {
    id: 16,
    title: "Beachfront Plot - Kribi",
    type: "land",
    category: "Seaside Plot",
    status: "sale",
    price: "95,000,000",
    priceValue: 95000000,
    priceUnit: "FCFA",
    location: "Lobe, Kribi",
    coordinates: {
      lat: 2.9403,
      lng: 9.9089
    },
    description: "Terrain d'exception en bordure de mer à proximité des Chutes de la Lobe. Pieds dans l'eau, titre foncier disponible, zone touristique à fort potentiel de développement.",
    size: "1,200",
    surface: "1,200 m²",
    surfaceValue: 1200,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
    gallery: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070"],
    featured: true,
    views: 1432,
    isAvailable: true,
    publishedAt: "2025-01-20T16:00:00Z",
    hasTitleDeed: true,
    badges: ["exclusive", "beachfront", "touristic"],
    tags: ["kribi", "plage", "touristique", "investissement", "lobe"],
    agent: {
      name: "Sophie Mbarga",
      phone: "+237 6XX XXX XXX",
      email: "sophie@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      agency: "Property Cameroon",
      rating: 5.0
    },
    amenities: {
      schools: { count: 1, names: ["Lycée Bilingue Kribi"] },
      markets: { count: 1, names: ["Débarcadère de Kribi"] },
      stations: { count: 1, names: ["Tradex Kribi"] },
      bakeries: { count: 1, names: ["Boulangerie du Port"] }
    },
    neighborhood: {
      type: "touristic",
      safety: "high",
      noiseLevel: "medium",
      development: "luxury"
    }
  },
  {
    id: 17,
    title: "Luxury Loft - Akwa",
    type: "apartment",
    category: "Loft",
    status: "lease",
    price: "900,000",
    priceValue: 900000,
    priceUnit: "FCFA/mois",
    location: "Akwa, Douala",
    coordinates: {
      lat: 4.0511,
      lng: 9.7679
    },
    description: "Loft ultra-moderne au coeur du quartier des affaires. Décoration industrielle, hauts plafonds, isolation acoustique renforcée et service de conciergerie.",
    beds: 2,
    baths: 2,
    surface: "180 m²",
    surfaceValue: 180,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070",
    gallery: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980"],
    featured: false,
    views: 678,
    isAvailable: true,
    publishedAt: "2025-04-10T10:00:00Z",
    constructionYear: 2022,
    floorNumber: 5,
    totalFloors: 8,
    hasElevator: true,
    hasParking: true,
    parkingSpots: 1,
    badges: ["luxury", "downtown"],
    tags: ["loft", "douala", "akwa", "moderne", "conciergerie"],
    agent: {
      name: "Jean Kamga",
      phone: "+237 6XX XXX XXX",
      email: "jean@propertycameroon.com",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      agency: "Property Cameroon",
      rating: 4.7
    },
    amenities: {
      schools: { count: 2, names: ["Collège Libermann", "Lycée de Joss"] },
      markets: { count: 2, names: ["Marché Sandaga", "Douala Grand Mall"] },
      stations: { count: 3, names: ["Total Akwa Nord", "Oilibya Liberté", "Tradex Bépanda"] },
      bakeries: { count: 3, names: ["Saker Akwa", "Zepol Akwa", "La Baguette"] }
    },
    neighborhood: {
      type: "commercial",
      safety: "high",
      noiseLevel: "high",
      development: "developed"
    }
  },

  // ========== NOUVELLES PROPRIÉTÉS SCRAPÉES DE KEUR-IMMO ==========

  // Terrain - Mfou
  {
    id: 1001,
    title: "Terrain à vendre - Mfou Centre",
    type: "land",
    category: "Building Plot",
    status: "sale",
    price: "33,000,000",
    priceValue: 33000000,
    priceUnit: "FCFA",
    location: "Mfou centre, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Terrain en bordure goudronnée de 1490 m² titrés avec magasins dans la clôture. Titre foncier disponible. Vente urgente - propriétaire brade.",
    beds: 0,
    baths: 0,
    surface: "1,490 m²",
    surfaceValue: 1490,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778688788669-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778688789417-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778688788800-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778688803096-media-374x240.jpg"
    ],
    featured: false,
    views: 245,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    hasTitleDeed: true,
    hasSurvey: true,
    badges: ["urgent", "price-reduced"],
    tags: ["terrain", "mfou", "titré", "urgence", "investissement"],
    contactPhone: "+237687611504",
    agent: {
      name: "Propriétaire direct",
      phone: "+237687611504",
      email: null,
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 1, names: ["École publique Mfou"] },
      markets: { count: 1, names: ["Marché de Mfou"] },
      stations: { count: 1, names: ["Station Total Mfou"] },
      bakeries: { count: 0, names: [] }
    }
  },

  // Appartement - Odza
  {
    id: 1002,
    title: "Appartement à louer - Odza",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "150,000",
    priceValue: 150000,
    priceUnit: "FCFA/mois",
    location: "Odza, Yaoundé",
    coordinates: { lat: 3.8480, lng: 11.5021 },
    description: "Appartement situé à Odza constitué de 2 chambres, 2 douches, séjour, cuisine, parking et vigile.",
    beds: 2,
    baths: 2,
    surface: "80 m²",
    surfaceValue: 80,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778501997164-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778501996818-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778501996748-media-374x240.jpg"
    ],
    featured: false,
    views: 123,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    constructionYear: 2018,
    hasParking: true,
    badges: [],
    tags: ["appartement", "odza", "location", "2 chambres"],
    contactPhone: "+237694059871",
    agent: {
      name: "Leboss House",
      phone: "+237694059871",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 2, names: ["École publique Odza", "Collège Odza"] },
      markets: { count: 1, names: ["Marché d'Odza"] },
      stations: { count: 1, names: ["Total Odza"] },
      bakeries: { count: 0, names: [] }
    }
  },

  // Maison duplex - Golf
  {
    id: 1003,
    title: "Maison duplex à louer - Golf",
    type: "house",
    category: "Duplex",
    status: "lease",
    price: "2,000,000",
    priceValue: 2000000,
    priceUnit: "FCFA/mois",
    location: "Golf, Yaoundé",
    coordinates: { lat: 3.8645, lng: 11.5189 },
    description: "Duplex situé à Golf, constitué de 4 chambres, 2 salles de vie, 1 salle à manger, cuisine, 4 douches avec dépendance et parking. Climatisation, local gardien, proche commodités.",
    beds: 4,
    baths: 5,
    surface: "250 m²",
    surfaceValue: 250,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778502613291-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778502612873-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778502611414-media-374x240.jpg"
    ],
    featured: true,
    views: 567,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    constructionYear: 2019,
    hasParking: true,
    parkingSpots: 2,
    badges: ["luxury"],
    tags: ["duplex", "golf", "location", "luxe", "4 chambres"],
    contactPhone: "+237694059871",
    agent: {
      name: "Leboss House",
      phone: "+237694059871",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 2, names: ["Collège Jean-Tabi", "British School"] },
      markets: { count: 1, names: ["Santa Lucia Golf"] },
      stations: { count: 1, names: ["Oilibya Golf"] },
      bakeries: { count: 1, names: ["Boulangerie du Golf"] }
    }
  },

  // Villa duplex avec piscine - Odza
  {
    id: 1004,
    title: "Villa duplex meublé avec piscine - Odza Nkolda",
    type: "house",
    category: "Villa",
    status: "sale",
    price: "150,000,000",
    priceValue: 150000000,
    priceUnit: "FCFA",
    location: "Odza Nkolda, Yaoundé",
    coordinates: { lat: 3.8480, lng: 11.5021 },
    description: "Duplex meublé avec piscine à vendre à Odza Nkolda. 4 chambres climatisées, grand salon, cuisine américaine équipée, piscine privée, parking sécurisé, forage, terrain titré 600 m².",
    beds: 4,
    baths: 4,
    surface: "300 m²",
    surfaceValue: 300,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778466049649-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778466049423-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1778466048114-media-374x240.jpg"
    ],
    featured: true,
    views: 890,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    constructionYear: 2022,
    hasTitleDeed: true,
    hasParking: true,
    parkingSpots: 3,
    badges: ["luxury", "exclusive"],
    tags: ["villa", "piscine", "meublé", "luxe", "odza", "vente"],
    contactPhone: "+237691970090",
    agent: {
      name: "André Ndebi Bell",
      phone: "+237691970090",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 2, names: ["École publique Odza", "Collège Odza"] },
      markets: { count: 1, names: ["Marché d'Odza"] },
      stations: { count: 1, names: ["Total Odza"] },
      bakeries: { count: 1, names: ["Boulangerie Odza"] }
    }
  },

  // Appartement 3 chambres - Omnisport
  {
    id: 1005,
    title: "Appartement 3 chambres - Omnisport",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "350,000",
    priceValue: 350000,
    priceUnit: "FCFA/mois",
    location: "Omnisport, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Appartement situé à Omnisport constitué de 3 chambres, 2 douches, WC visiteurs, cuisine, séjour, buanderie, parking et vigile. Climatisation, local gardien.",
    beds: 3,
    baths: 3,
    surface: "120 m²",
    surfaceValue: 120,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777997770510-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777997770026-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777997765889-media-374x240.jpg"
    ],
    featured: false,
    views: 234,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    hasParking: true,
    badges: [],
    tags: ["appartement", "omnisport", "location", "3 chambres"],
    contactPhone: "+237694059871",
    agent: {
      name: "Leboss House",
      phone: "+237694059871",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 2, names: ["Lycée d'Omnisport", "École publique Omnisport"] },
      markets: { count: 1, names: ["Marché d'Omnisport"] },
      stations: { count: 1, names: ["Total Omnisport"] },
      bakeries: { count: 1, names: ["Boulangerie Omnisport"] }
    }
  },

  // Terrain commercial - Tongolo
  {
    id: 1006,
    title: "Terrain commercial - Tongolo",
    type: "land",
    category: "Commercial Land",
    status: "sale",
    price: "750,000,000",
    priceValue: 750000000,
    priceUnit: "FCFA",
    location: "Tongolo, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Grand terrain commercial titré et loti de 3000 m², très bien placé en bordure de route. Idéal pour immeuble commercial, hôtel, centre commercial. Titré, un seul signataire.",
    beds: 0,
    baths: 0,
    surface: "3,000 m²",
    surfaceValue: 3000,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777920132695-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777920129230-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777920130961-media-374x240.jpg"
    ],
    featured: false,
    views: 178,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    hasTitleDeed: true,
    badges: ["commercial", "investment"],
    tags: ["terrain", "commercial", "tongolo", "investissement", "titre foncier"],
    contactPhone: "+237680139188",
    agent: {
      name: "Paul Mbala",
      phone: "+237680139188",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 1, names: ["École publique Tongolo"] },
      markets: { count: 1, names: ["Marché de Tongolo"] },
      stations: { count: 2, names: ["Total Tongolo", "Tradex Tongolo"] },
      bakeries: { count: 0, names: [] }
    }
  },

  // Maison duplex - Ekoudoum
  {
    id: 1007,
    title: "Maison duplex à vendre - Ekoudoum (En construction)",
    type: "house",
    category: "Duplex",
    status: "sale",
    price: "29,000,000",
    priceValue: 29000000,
    priceUnit: "FCFA",
    location: "Happi, Ekoudoum, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Vente urgente - Duplex semi fini sur terrain de 600 m². Composition: 4 chambres, 2 salons, 3 douches, cuisine, balcon. Forage, barrière, accès facile. Idéal pour investissement locatif. Prix négociable.",
    beds: 4,
    baths: 3,
    surface: "200 m²",
    surfaceValue: 200,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777415803838-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777415806140-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777415806385-media-374x240.jpg"
    ],
    featured: false,
    views: 456,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    hasTitleDeed: false,
    badges: ["urgent", "under-construction"],
    tags: ["duplex", "construction", "urgence", "investissement", "ekoudoum"],
    contactPhone: "+237691669241",
    agent: {
      name: "Joseph Dibengue",
      phone: "+237691669241",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 1, names: ["École publique Ekoudoum"] },
      markets: { count: 0, names: [] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    }
  },

  // Immeuble - Dragage Bastos
  {
    id: 1008,
    title: "Immeuble meublé à vendre - Dragage Bastos",
    type: "building",
    category: "Apartment Building",
    status: "sale",
    price: "4,000,000,000",
    priceValue: 4000000000,
    priceUnit: "FCFA",
    location: "Dragage, Bastos, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Immeuble meublé de 25 appartements (19 de 2 chambres, 6 studios) sur terrain titré de 700 m². Sous-sol, parking 40 véhicules, salle de fête 500 places. Rentabilité mensuelle 11,6 millions FCFA.",
    beds: 25,
    baths: 25,
    surface: "700 m²",
    surfaceValue: 700,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777617393010-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777617393440-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/05/1777617393867-media-374x240.jpg"
    ],
    featured: true,
    views: 678,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    hasTitleDeed: true,
    hasParking: true,
    parkingSpots: 40,
    badges: ["investment", "commercial"],
    tags: ["immeuble", "investissement", "bastos", "rentable", "meublé"],
    contactPhone: "+237680139188",
    agent: {
      name: "Paul Mbala",
      phone: "+237680139188",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 3, names: ["Lycée de Bastos", "École Internationale Le Flamboyant", "American School"] },
      markets: { count: 2, names: ["Marché de Bastos", "Supermarché Casino"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 2, names: ["Acacias Bastos", "Select Bakes"] }
    }
  },

  // Grande propriété - Biteng
  {
    id: 1009,
    title: "Grande propriété - Maétur Biteng",
    type: "house",
    category: "Estate",
    status: "sale",
    price: "230,000,000",
    priceValue: 230000000,
    priceUnit: "FCFA",
    location: "Maétur Biteng, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Magnifique domaine de 1204 m² avec surface bâtie de 400 m². Rez-de-chaussée avec grand séjour, salon, salle à manger, chambre visiteur, bureau, 2 vérandas. Étage avec suite parentale, 4 chambres avec douche, salle de jeux, salle d'études. Puits aménagé avec 2 cuves. Idéal pour résidence, institut, clinique.",
    beds: 5,
    baths: 7,
    surface: "400 m²",
    surfaceValue: 400,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/04/1776680762076-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/04/1776680778249-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/04/1776680788195-media-374x240.jpg"
    ],
    featured: true,
    views: 345,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    constructionYear: 2019,
    hasTitleDeed: true,
    hasParking: true,
    parkingSpots: 6,
    badges: ["exclusive", "investment"],
    tags: ["propriété", "biteng", "familiale", "investissement", "titré"],
    contactPhone: "+237690932382",
    agent: {
      name: "Zidane MENBGWA",
      phone: "+237690932382",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 1, names: ["École publique Biteng"] },
      markets: { count: 0, names: [] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    }
  },

  // Villa architecte contemporaine - Odza
  {
    id: 1010,
    title: "Villa d'architecte contemporaine - Odza",
    type: "house",
    category: "Villa",
    status: "sale",
    price: "220,000,000",
    priceValue: 220000000,
    priceUnit: "FCFA",
    location: "Odza, Yaoundé",
    coordinates: { lat: 3.8480, lng: 11.5021 },
    description: "Villa d'architecte contemporaine sur 891 m² titrés. R+1 avec 4 chambres, 4 salles de bain, double réception, bureau professionnel, 6 terrasses. Espace bureau indépendant, annexes pour personnel. Prix revu à la baisse pour vente rapide.",
    beds: 4,
    baths: 4,
    surface: "400 m²",
    surfaceValue: 400,
    image: "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/04/1776592963064-media-374x240.jpg",
    gallery: [
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/04/1776592963184-media-374x240.jpg",
      "https://keur-immo.com/cameroun/wp-content/uploads/sites/15/2026/04/1776592963336-media-374x240.jpg"
    ],
    featured: true,
    views: 567,
    isAvailable: true,
    publishedAt: "2026-05-01T00:00:00Z",
    constructionYear: 2013,
    hasTitleDeed: true,
    hasParking: true,
    badges: ["luxury", "architect"],
    tags: ["villa", "architecte", "contemporaine", "odza", "luxe"],
    contactPhone: "+237695098656",
    agent: {
      name: "Arthur Hel",
      phone: "+237695098656",
      email: "[email protected]",
      agency: "Particulier",
      rating: null
    },
    amenities: {
      schools: { count: 2, names: ["École publique Odza", "Collège Odza"] },
      markets: { count: 1, names: ["Marché d'Odza"] },
      stations: { count: 1, names: ["Total Odza"] },
      bakeries: { count: 0, names: [] }
    }
  },

  // ========== NOUVELLES PROPRIÉTÉS SCRAPÉES DE WEETYU ==========

  // Weetyu - Appartement Odza (125k FCFA)
  {
    id: 2001,
    title: "Appartement - Carrefour Petit Marché ODZA",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "125,000",
    priceValue: 125000,
    priceUnit: "FCFA/mois",
    location: "Carrefour Petit Marché ODZA, Odza, Yaoundé",
    coordinates: { lat: 3.8480, lng: 11.5021 },
    description: "Appartement situé à Odza avec offre spéciale. Proche commodités.",
    beds: 0,
    baths: 0,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/19604/image_-_2025-04-17T075343.259.jpg",
    gallery: [
      "https://backend.weetyu.com/media/19604/image_-_2025-04-17T075343.259.jpg",
      "https://backend.weetyu.com/media/19604/image_-_2025-04-17T075338.722.jpg",
      "https://backend.weetyu.com/media/19604/image_-_2025-04-17T075329.004.jpg",
      "https://backend.weetyu.com/media/19604/image_-_2025-04-17T075315.985.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2025-04-17T00:00:00Z",
    hasParking: false,
    badges: ["special-offer"],
    tags: ["appartement", "odza", "location", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/19604"
  },

  // Weetyu - Appartement Odza (120k FCFA)
  {
    id: 2002,
    title: "Appartement - Odza",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "120,000",
    priceValue: 120000,
    priceUnit: "FCFA/mois",
    location: "Odza, Yaoundé",
    coordinates: { lat: 3.8480, lng: 11.5021 },
    description: "Appartement situé à Odza avec offre spéciale.",
    beds: 0,
    baths: 0,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/22488/image_m3atnNx.jpg",
    gallery: ["https://backend.weetyu.com/media/22488/image_m3atnNx.jpg"],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2024-11-01T00:00:00Z",
    hasParking: false,
    badges: ["special-offer"],
    tags: ["appartement", "odza", "location", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/22488"
  },

  // Weetyu - Appartement Tradex éleveurs (70k FCFA - 2 chambres)
  {
    id: 2003,
    title: "Appartement 2 chambres - Tradex éleveurs",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "70,000",
    priceValue: 70000,
    priceUnit: "FCFA/mois",
    location: "Tradex éleveurs, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Appartement de 2 chambres situé près de Tradex éleveurs. Idéal pour petit famille.",
    beds: 2,
    baths: 1,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23563/95215620-0cb1-4a64-8241-7f42782016cc.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23563/95215620-0cb1-4a64-8241-7f42782016cc.jpg",
      "https://backend.weetyu.com/media/23563/d89c0e2a-d535-4de5-83b9-99582bf63a7b.jpg",
      "https://backend.weetyu.com/media/23563/093ba4bc-e8a8-4738-958c-378249cb2e7f.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-13T00:00:00Z",
    hasParking: false,
    badges: [],
    tags: ["appartement", "2 chambres", "location", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23563"
  },

  // Weetyu - Appartement Rond-point Tsinga (80k FCFA - 2 chambres)
  {
    id: 2004,
    title: "Appartement 2 chambres - Rond-point Tsinga",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "80,000",
    priceValue: 80000,
    priceUnit: "FCFA/mois",
    location: "Rond-point Tsinga village, Soa",
    coordinates: { lat: 3.9847, lng: 11.5997 },
    description: "Appartement de 2 chambres situé au Rond-point Tsinga village. Calme et bien situé.",
    beds: 2,
    baths: 2,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23562/f86cf356-4464-4219-bd4a-37303d923685.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23562/f86cf356-4464-4219-bd4a-37303d923685.jpg",
      "https://backend.weetyu.com/media/23562/d9306cc7-7848-4e53-b70a-ea6453dba223.jpg",
      "https://backend.weetyu.com/media/23562/4b8a6875-da1e-49df-a324-8aadf45993f5.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-13T00:00:00Z",
    hasParking: false,
    badges: [],
    tags: ["appartement", "2 chambres", "location", "soa", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23562"
  },

  // Weetyu - Appartement Total station Odza (90k FCFA)
  {
    id: 2005,
    title: "Appartement 2 chambres - Total station Odza",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "90,000",
    priceValue: 90000,
    priceUnit: "FCFA/mois",
    location: "Total station Odza terminal 10, Yaoundé",
    coordinates: { lat: 3.8480, lng: 11.5021 },
    description: "Appartement de 2 chambres situé près de la station Total Odza terminal 10.",
    beds: 2,
    baths: 2,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23560/d14d27a4-e599-49b2-8319-b8e8de47e51f.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23560/d14d27a4-e599-49b2-8319-b8e8de47e51f.jpg",
      "https://backend.weetyu.com/media/23560/e072b018-d8ab-4d9c-b946-9c71db1bd523.jpg",
      "https://backend.weetyu.com/media/23560/aaaa5680-08f6-489a-a4ec-47252ad796ec.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-13T00:00:00Z",
    hasParking: false,
    badges: [],
    tags: ["appartement", "2 chambres", "location", "odza", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23560"
  },

  // Weetyu - Appartement Nkolfoulou (100k FCFA)
  {
    id: 2006,
    title: "Appartement 2 chambres - Nkolfoulou",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "100,000",
    priceValue: 100000,
    priceUnit: "FCFA/mois",
    location: "Nkolfoulou, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Appartement de 2 chambres situé à Nkolfoulou. Quartier résidentiel calme.",
    beds: 2,
    baths: 2,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23557/1bacbde4-254a-4adf-b370-e36e53e7589a.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23557/1bacbde4-254a-4adf-b370-e36e53e7589a.jpg",
      "https://backend.weetyu.com/media/23557/6294243f-8b3b-4fec-a009-8c12b6468bcc.jpg",
      "https://backend.weetyu.com/media/23557/35cb7a51-c175-4bfa-8716-66b29fba0759.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-13T00:00:00Z",
    hasParking: false,
    badges: [],
    tags: ["appartement", "2 chambres", "location", "nkolfoulou", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23557"
  },

  // Weetyu - Appartement Essos (140k FCFA)
  {
    id: 2007,
    title: "Appartement 2 chambres - Essos",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "140,000",
    priceValue: 140000,
    priceUnit: "FCFA/mois",
    location: "Essos, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Appartement de 2 chambres situé à Essos. Proche commerces et écoles.",
    beds: 2,
    baths: 2,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23556/c4da67eb-2b53-437f-8f06-26bef0381dcd.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23556/c4da67eb-2b53-437f-8f06-26bef0381dcd.jpg",
      "https://backend.weetyu.com/media/23556/99ba04b3-1daf-4c17-9608-7d03309c7e78.jpg",
      "https://backend.weetyu.com/media/23556/4b1dba27-d40a-4d0a-b95d-facb7d142cad.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-11T00:00:00Z",
    hasParking: false,
    badges: [],
    tags: ["appartement", "2 chambres", "location", "essos", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23556"
  },

  // Weetyu - Appartement Carrefour Nkolfoulou (90k FCFA - 2 chambres)
  {
    id: 2008,
    title: "Appartement 2 chambres - Carrefour Nkolfoulou",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "90,000",
    priceValue: 90000,
    priceUnit: "FCFA/mois",
    location: "Carrefour Nkolfoulou, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Appartement de 2 chambres situé au Carrefour Nkolfoulou.",
    beds: 2,
    baths: 1,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23554/6a096102-54fb-497e-a63d-8a8febbd3ef7.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23554/6a096102-54fb-497e-a63d-8a8febbd3ef7.jpg",
      "https://backend.weetyu.com/media/23554/bf650b4c-835d-4de4-a5f5-1c84c3567133.jpg",
      "https://backend.weetyu.com/media/23554/9dee9cf9-09b0-4f16-9854-2cb767ea5f8c.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-11T00:00:00Z",
    hasParking: false,
    badges: [],
    tags: ["appartement", "2 chambres", "location", "nkolfoulou", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23554"
  },

  // Weetyu - Grand Appartement Carrefour Nkolfoulou (180k FCFA - 4 chambres)
  {
    id: 2009,
    title: "Grand Appartement 4 chambres - Carrefour Nkolfoulou",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "180,000",
    priceValue: 180000,
    priceUnit: "FCFA/mois",
    location: "Carrefour Nkolfoulou, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Grand appartement de 4 chambres situé au Carrefour Nkolfoulou. Idéal pour grande famille.",
    beds: 4,
    baths: 3,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23553/f1c14209-c91c-4075-9cfc-797efb4d7428.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23553/f1c14209-c91c-4075-9cfc-797efb4d7428.jpg",
      "https://backend.weetyu.com/media/23553/e93e2636-2a11-4c95-a319-9a0564a0eb28.jpg",
      "https://backend.weetyu.com/media/23553/40c3f730-8b4b-4389-b69b-b96ef16baac3.jpg"
    ],
    featured: true,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-11T00:00:00Z",
    hasParking: false,
    badges: ["spacious"],
    tags: ["appartement", "4 chambres", "location", "nkolfoulou", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23553"
  },

  // Weetyu - Appartement Fougerolles (70k FCFA - 2 chambres)
  {
    id: 2010,
    title: "Appartement 2 chambres - Fougerolles",
    type: "apartment",
    category: "Apartment",
    status: "lease",
    price: "70,000",
    priceValue: 70000,
    priceUnit: "FCFA/mois",
    location: "Fougerolles, Yaoundé",
    coordinates: { lat: 3.8667, lng: 11.5167 },
    description: "Appartement de 2 chambres situé à Fougerolles. Quartier résidentiel.",
    beds: 2,
    baths: 1,
    surface: "Non spécifié",
    surfaceValue: 0,
    image: "https://backend.weetyu.com/media/23552/22cef564-33dd-46d0-8a9a-a9903a3afa2c.jpg",
    gallery: [
      "https://backend.weetyu.com/media/23552/22cef564-33dd-46d0-8a9a-a9903a3afa2c.jpg",
      "https://backend.weetyu.com/media/23552/b55f89ee-7178-4352-88b8-5ac926614340.jpg",
      "https://backend.weetyu.com/media/23552/5db38035-7677-427e-9dfd-cb78fa42cb6a.jpg"
    ],
    featured: false,
    views: 0,
    isAvailable: true,
    publishedAt: "2026-05-11T00:00:00Z",
    hasParking: false,
    badges: [],
    tags: ["appartement", "2 chambres", "location", "fougerolles", "weetyu"],
    source: "weetyu",
    sourceUrl: "https://weetyu.com/en/property/23552"
  }
];