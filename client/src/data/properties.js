// mockProperties.js
import mongoose from 'mongoose';

export const MOCK_PROPERTIES = [
  // ==================== HOUSES (5) ====================
  {
    title: "Contemporary Family Home - Bastos",
    category: "House",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 450, unit: "m²" },
    price: { amount: 250000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Magnifique villa contemporaine située dans le quartier résidentiel de Bastos. Cette maison de 4 chambres offre un salon spacieux, une cuisine entièrement équipée, un jardin paysager et une piscine. Idéal pour une famille cherchant confort et sécurité.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=800"
    ],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 4, bathrooms: 3, floor: null, hasElevator: false, hasBalcony: true,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Bastos", "École Internationale Le Flamboyant"] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 1, names: ["Acacias Bastos"] }
    },
    views: 45
  },
  {
    title: "Modern Family Home - Mvog Mbi",
    category: "House",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvog Mbi", region: "Center" },
    surface: { value: 320, unit: "m²" },
    price: { amount: 500000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Maison contemporaine lumineuse avec 3 chambres, salon cathédrale, cuisine américaine et petit jardin. Quartier calme et proche de toutes commodités.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 3, bathrooms: 2, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Collège Vogt", "École Publique Mvog Mbi"] },
      markets: { count: 1, names: ["Marché Mvog Mbi"] },
      stations: { count: 1, names: ["Oilibya Mvog Mbi"] },
      bakeries: { count: 1, names: ["Boulangerie Mvog Mbi"] }
    },
    views: 32
  },
  {
    title: "Luxury Executive Home - Golf",
    category: "House",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Golf", region: "Center" },
    surface: { value: 550, unit: "m²" },
    price: { amount: 450000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Propriété d'exception avec vue sur le parcours de golf. 5 chambres suites, piscine à débordement, salle de sport, home cinéma et dépendance de luxe.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 5, bathrooms: 5, floor: null, hasElevator: false, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["British School", "Collège Jean-Tabi"] },
      markets: { count: 1, names: ["Santa Lucia Golf"] },
      stations: { count: 1, names: ["Oilibya Golf"] },
      bakeries: { count: 1, names: ["Boulangerie du Golf"] }
    },
    views: 78
  },
  {
    title: "Cozy Family Home - Mokolo",
    category: "House",
    listingType: "rent",
    location: { city: "Douala", district: "Mokolo", region: "Littoral" },
    surface: { value: 200, unit: "m²" },
    price: { amount: 350000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Maison chaleureuse de 3 chambres située à proximité du grand marché. Accès facile, quartier animé, idéal pour commerçants ou famille.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 3, bathrooms: 2, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 1, names: ["École Publique Mokolo"] },
      markets: { count: 2, names: ["Marché Mokolo", "Marché Total"] },
      stations: { count: 2, names: ["Total Mokolo", "Oilibya"] },
      bakeries: { count: 1, names: ["Saker Mokolo"] }
    },
    views: 23
  },
  {
    title: "Spacious Villa - Bonapriso",
    category: "House",
    listingType: "sale",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 480, unit: "m²" },
    price: { amount: 380000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Superbe villa de standing dans le quartier résidentiel de Bonapriso. 4 chambres dont une suite parentale, grand salon, jardin arboré, parking sécurisé.",
    images: ["https://images.unsplash.com/photo-1600566753087-00f18fb6b3ea?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 4, bathrooms: 3, floor: null, hasElevator: false, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Bonapriso", "Collège Libermann"] },
      markets: { count: 2, names: ["Super U Bonapriso", "Marché de Bonapriso"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 2, names: ["Zepol Bonapriso", "Saker"] }
    },
    views: 56
  },

  // ==================== VILLAS (5) ====================
  {
    title: "Mediterranean Villa - Lake District",
    category: "Villa",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Quartier du Lac", region: "Center" },
    surface: { value: 800, unit: "m²" },
    price: { amount: 850000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Magnifique villa de style méditerranéen avec vue sur le lac. 6 chambres suites, piscine à débordement, court de tennis, jardin paysager de 2000m², pavillon de gardien.",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 6, bathrooms: 6, floor: null, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 3, names: ["Lycée Fustel de Coulanges", "Collège Jean-Tabi", "American School"] },
      markets: { count: 2, names: ["Marché du Lac", "Casino Golf"] },
      stations: { count: 2, names: ["Total Golf", "Oilibya Lac"] },
      bakeries: { count: 2, names: ["Acacias", "Boulangerie du Lac"] }
    },
    views: 124
  },
  {
    title: "Modern Villa - Makepe",
    category: "Villa",
    listingType: "sale",
    location: { city: "Douala", district: "Makepe", region: "Littoral" },
    surface: { value: 600, unit: "m²" },
    price: { amount: 550000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Villa architecturale de 5 chambres avec piscine, salle de sport, home cinéma. Quartier sécurisé proche du terminus Makepe.",
    images: ["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 5, bathrooms: 4, floor: null, hasElevator: false, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Collège Bilingue Makepe", "École Publique"] },
      markets: { count: 1, names: ["Marché Makepe"] },
      stations: { count: 1, names: ["Tradex Makepe"] },
      bakeries: { count: 1, names: ["Boulangerie Makepe"] }
    },
    views: 67
  },
  {
    title: "Colonial Villa - Bali",
    category: "Villa",
    listingType: "rent",
    location: { city: "Bafoussam", district: "Bali", region: "West" },
    surface: { value: 450, unit: "m²" },
    price: { amount: 700000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Villa coloniale rénovée avec charme authentique. Poutres apparentes, cheminée, grand jardin arboré. 4 chambres, terrasse couverte.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 4, bathrooms: 3, floor: null, hasElevator: false, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Bali", "Collège Privé"] },
      markets: { count: 1, names: ["Marché de Bali"] },
      stations: { count: 1, names: ["Total Bali"] },
      bakeries: { count: 1, names: ["Boulangerie Bali"] }
    },
    views: 34
  },
  {
    title: "Seaside Villa - Limbe",
    category: "Villa",
    listingType: "sale",
    location: { city: "Limbe", district: "Down Beach", region: "South-West" },
    surface: { value: 520, unit: "m²" },
    price: { amount: 420000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Villa de prestige en front de mer avec vue imprenable sur l'océan et le Mont Cameroun. Jardin tropical, accès direct à la plage.",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 5, bathrooms: 4, floor: null, hasElevator: false, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée Bilingue Limbe", "Collège Saker"] },
      markets: { count: 1, names: ["Marché de Limbe"] },
      stations: { count: 2, names: ["Total Limbe", "Oilibya"] },
      bakeries: { count: 2, names: ["Boulangerie de la Mer", "Saker"] }
    },
    views: 89
  },
  {
    title: "Eco Villa - Obala",
    category: "Villa",
    listingType: "sale",
    location: { city: "Obala", district: "Centre", region: "Center" },
    surface: { value: 380, unit: "m²" },
    price: { amount: 180000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Villa écologique avec panneaux solaires, récupération d'eau de pluie. 3 chambres, grand jardin potager, cadre verdoyant à 30min de Yaoundé.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 3, bathrooms: 2, floor: null, hasElevator: false, hasBalcony: true,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée d'Obala", "Collège Privé"] },
      markets: { count: 1, names: ["Marché d'Obala"] },
      stations: { count: 1, names: ["Total Obala"] },
      bakeries: { count: 1, names: ["Boulangerie Obala"] }
    },
    views: 41
  },

  // ==================== DUPLEX (5) ====================
  {
    title: "Executive Duplex - Mvan",
    category: "Duplex",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Mvan", region: "Center" },
    surface: { value: 350, unit: "m²" },
    price: { amount: 195000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Superbe duplex de 3 étages avec toit terrasse. 4 chambres, salon double hauteur, cuisine équipée, garage pour 2 voitures.",
    images: ["https://images.unsplash.com/photo-1600566753087-00f18fb6b3ea?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 4, bathrooms: 3, floor: 1, hasElevator: false, hasBalcony: true,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Collège Mvan", "École Publique"] },
      markets: { count: 1, names: ["Marché Mvan"] },
      stations: { count: 1, names: ["Oilibya Mvan"] },
      bakeries: { count: 1, names: ["Boulangerie Mvan"] }
    },
    views: 52
  },
  {
    title: "Luxury Duplex - Akwa",
    category: "Duplex",
    listingType: "rent",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 280, unit: "m²" },
    price: { amount: 1200000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Duplex moderne en plein cœur des affaires. 3 chambres, vue panoramique, domotique, parking privé. Idéal cadre expatrié.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 3, bathrooms: 3, floor: 4, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Collège Libermann", "Lycée de Joss"] },
      markets: { count: 2, names: ["Douala Grand Mall", "Marché Sandaga"] },
      stations: { count: 2, names: ["Total Akwa", "Oilibya Akwa"] },
      bakeries: { count: 2, names: ["Saker Akwa", "Zepol"] }
    },
    views: 88
  },
  {
    title: "Family Duplex - Ndogbong",
    category: "Duplex",
    listingType: "sale",
    location: { city: "Douala", district: "Ndogbong", region: "Littoral" },
    surface: { value: 310, unit: "m²" },
    price: { amount: 165000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Duplex familial avec espaces spacieux. 4 chambres, grand salon, cuisine séparée, cour intérieure, garage.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 4, bathrooms: 3, floor: 1, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Ndogbong", "Collège Privé"] },
      markets: { count: 1, names: ["Marché Ndogbong"] },
      stations: { count: 1, names: ["Total Ndogbong"] },
      bakeries: { count: 1, names: ["Boulangerie Ndogbong"] }
    },
    views: 38
  },
  {
    title: "Student Duplex - Ngoa Ekele",
    category: "Duplex",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Ngoa Ekele", region: "Center" },
    surface: { value: 180, unit: "m²" },
    price: { amount: 400000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Duplex meublé à proximité de l'Université. 2 chambres, salon, petite cuisine. Parfait pour étudiants ou jeune couple.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 2, bathrooms: 2, floor: 1, hasElevator: false, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 1, names: ["Université de Yaoundé I"] },
      markets: { count: 2, names: ["Marché Ngoa Ekele", "Supermarché"] },
      stations: { count: 1, names: ["Oilibya Ngoa Ekele"] },
      bakeries: { count: 1, names: ["Boulangerie Ngoa"] }
    },
    views: 67
  },
  {
    title: "Premium Duplex - Kondengui",
    category: "Duplex",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Kondengui", region: "Center" },
    surface: { value: 400, unit: "m²" },
    price: { amount: 280000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Duplex de prestige avec vue sur toute la ville. 5 chambres, ascenseur privé, piscine, grande terrasse, jardin.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 5, bathrooms: 4, floor: 2, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Kondengui", "Collège Bilingue"] },
      markets: { count: 1, names: ["Marché Kondengui"] },
      stations: { count: 1, names: ["Total Kondengui"] },
      bakeries: { count: 1, names: ["Boulangerie Kondengui"] }
    },
    views: 73
  },

  // ==================== APARTMENTS (5) ====================
  {
    title: "Penthouse Vue Mer - Akwa",
    category: "Apartment",
    listingType: "sale",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 220, unit: "m²" },
    price: { amount: 150000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Magnifique penthouse en dernier étage avec vue panoramique sur la ville et l'estuaire. 3 chambres, terrasse 50m², parking.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 3, bathrooms: 3, floor: 12, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Collège Libermann", "Lycée de Joss"] },
      markets: { count: 2, names: ["Douala Grand Mall", "Marché Sandaga"] },
      stations: { count: 2, names: ["Total Akwa", "Oilibya"] },
      bakeries: { count: 2, names: ["Saker Akwa", "Zepol"] }
    },
    views: 156
  },
  {
    title: "Modern Apartment - Mvog Mbi",
    category: "Apartment",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvog Mbi", region: "Center" },
    surface: { value: 120, unit: "m²" },
    price: { amount: 250000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Bel appartement moderne de 2 chambres. Quartier calme, proche commerce, cuisine équipée, balcon.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 2, bathrooms: 2, floor: 3, hasElevator: false, hasBalcony: true,
      isFurnished: false, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Collège Vogt", "École Publique"] },
      markets: { count: 1, names: ["Marché Mvog Mbi"] },
      stations: { count: 1, names: ["Oilibya Mvog Mbi"] },
      bakeries: { count: 1, names: ["Boulangerie Mvog Mbi"] }
    },
    views: 45
  },
  {
    title: "Luxury Apartment - Bonapriso",
    category: "Apartment",
    listingType: "sale",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 180, unit: "m²" },
    price: { amount: 185000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Appartement de luxe dans résidence sécurisée. 3 chambres dont suite parentale, cuisine américaine, piscine commune, 24h/24.",
    images: ["https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 3, bathrooms: 2, floor: 5, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Bonapriso", "Collège Libermann"] },
      markets: { count: 2, names: ["Super U Bonapriso", "Marché"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 2, names: ["Zepol", "Saker"] }
    },
    views: 94
  },
  {
    title: "Cozy Apartment - Nsam",
    category: "Apartment",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Nsam", region: "Center" },
    surface: { value: 85, unit: "m²" },
    price: { amount: 180000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Petit appartement fonctionnel de 1 chambre. Idéal pour célibataire ou étudiant. Eau chaude, coin cuisine.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 1, bathrooms: 1, floor: 2, hasElevator: false, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 1, names: ["Collège Nsam"] },
      markets: { count: 2, names: ["Marché Nsam", "Superette"] },
      stations: { count: 1, names: ["Total Nsam"] },
      bakeries: { count: 1, names: ["Boulangerie Nsam"] }
    },
    views: 56
  },
  {
    title: "Executive Apartment - Bepanda",
    category: "Apartment",
    listingType: "sale",
    location: { city: "Douala", district: "Bepanda", region: "Littoral" },
    surface: { value: 150, unit: "m²" },
    price: { amount: 120000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Appartement spacieux au cœur de Bepanda. 3 chambres, salon double, cuisine équipée, 2 balcons, parking.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 3, bathrooms: 2, floor: 4, hasElevator: true, hasBalcony: true,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Bepanda", "Collège Privé"] },
      markets: { count: 2, names: ["Marché Bepanda", "Super U"] },
      stations: { count: 2, names: ["Total Bepanda", "Oilibya"] },
      bakeries: { count: 1, names: ["Boulangerie Bepanda"] }
    },
    views: 62
  },

  // ==================== STUDIOS (5) ====================
  {
    title: "Modern Studio - Bastos",
    category: "Studio",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 45, unit: "m²" },
    price: { amount: 150000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Studio moderne tout confort, idéal pour étudiant ou jeune pro. Climatisé, meublé, cuisine équipée, sécurisé.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 1, floor: 2, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Bastos", "International School"] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 1, names: ["Acacias Bastos"] }
    },
    views: 89
  },
  {
    title: "Student Studio - Nlongkak",
    category: "Studio",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Nlongkak", region: "Center" },
    surface: { value: 35, unit: "m²" },
    price: { amount: 100000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Studio meublé à proximité de l'Université Catholique. Idéal pour étudiant. Lit, frigo, douche, cuisineette.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 1, floor: 1, hasElevator: false, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Université Catholique", "Collège Nlongkak"] },
      markets: { count: 1, names: ["Marché Nlongkak"] },
      stations: { count: 1, names: ["Oilibya Nlongkak"] },
      bakeries: { count: 1, names: ["Boulangerie Nlongkak"] }
    },
    views: 103
  },
  {
    title: "Cosy Studio - Bonapriso",
    category: "Studio",
    listingType: "rent",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 50, unit: "m²" },
    price: { amount: 200000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Studio de charme dans résidence avec piscine. Meublé avec goût, climatisé, cuisine américaine, terrasse.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 1, floor: 3, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée Bonapriso", "Collège Libermann"] },
      markets: { count: 2, names: ["Super U", "Marché Bonapriso"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 2, names: ["Zepol", "Saker"] }
    },
    views: 78
  },
  {
    title: "Minimalist Studio - Mvog Ada",
    category: "Studio",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvog Ada", region: "Center" },
    surface: { value: 40, unit: "m²" },
    price: { amount: 120000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Studio épuré et lumineux. Parfait pour personne seule recherchant confort et simplicité. Proche transport.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 1, floor: 2, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 1, names: ["Collège Mvog Ada"] },
      markets: { count: 1, names: ["Marché Mvog Ada"] },
      stations: { count: 1, names: ["Total Mvog Ada"] },
      bakeries: { count: 1, names: ["Boulangerie Mvog Ada"] }
    },
    views: 47
  },
  {
    title: "Premium Studio - Golf",
    category: "Studio",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Golf", region: "Center" },
    surface: { value: 55, unit: "m²" },
    price: { amount: 45000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Studio de standing à vendre dans résidence de luxe. Idéal investissement locatif. Localisation prisée, sécurisé.",
    images: ["https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 1, floor: 4, hasElevator: true, hasBalcony: true,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["British School", "Collège Jean-Tabi"] },
      markets: { count: 1, names: ["Santa Lucia"] },
      stations: { count: 1, names: ["Oilibya Golf"] },
      bakeries: { count: 1, names: ["Boulangerie Golf"] }
    },
    views: 55
  },

  // ==================== ROOMS (5) ====================
  {
    title: "Furnished Room - Mendong",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mendong", region: "Center" },
    surface: { value: 25, unit: "m²" },
    price: { amount: 60000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Chambre meublée dans colocation étudiante. Lit, armoire, bureau, salle de bain privée. Cuisine et salon partagés.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 1, bathrooms: 1, floor: 1, hasElevator: false, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 1, names: ["Université Mendong"] },
      markets: { count: 1, names: ["Marché Mendong"] },
      stations: { count: 1, names: ["Total Mendong"] },
      bakeries: { count: 1, names: ["Boulangerie Mendong"] }
    },
    views: 112
  },
  {
    title: "Spacious Room - Etoug-Ebe",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Etoug-Ebe", region: "Center" },
    surface: { value: 30, unit: "m²" },
    price: { amount: 75000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Grande chambre avec salle de bain privative. Maison calme, jardin commun. Proche centre commercial Bastos.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 1, bathrooms: 1, floor: 0, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: true, landType: ""
    },
    amenities: {
      schools: { count: 1, names: ["Collège Etoug-Ebe"] },
      markets: { count: 1, names: ["Marché Etoug-Ebe"] },
      stations: { count: 1, names: ["Total Etoug-Ebe"] },
      bakeries: { count: 1, names: ["Boulangerie Etoug-Ebe"] }
    },
    views: 68
  },
  {
    title: "Student Room - Cite Verte",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Cité Verte", region: "Center" },
    surface: { value: 20, unit: "m²" },
    price: { amount: 50000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Chambre économique pour étudiant. Meublée de base, quartier animé, proximité universités.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 1, bathrooms: 1, floor: 1, hasElevator: false, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Université Yaoundé I", "Collège Cite Verte"] },
      markets: { count: 1, names: ["Marché Cite Verte"] },
      stations: { count: 1, names: ["Oilibya Cite Verte"] },
      bakeries: { count: 1, names: ["Boulangerie Cite Verte"] }
    },
    views: 134
  },
  {
    title: "Cozy Room - Deido",
    category: "Room",
    listingType: "rent",
    location: { city: "Douala", district: "Deido", region: "Littoral" },
    surface: { value: 28, unit: "m²" },
    price: { amount: 65000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Chambre confortable dans quartier populaire. Lit double, armoire, ventilateur, salle de bain partagée.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 1, bathrooms: 1, floor: 0, hasElevator: false, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 1, names: ["Lycée de Deido"] },
      markets: { count: 2, names: ["Marché Deido", "Marché Sandaga"] },
      stations: { count: 1, names: ["Total Deido"] },
      bakeries: { count: 1, names: ["Boulangerie Deido"] }
    },
    views: 59
  },
  {
    title: "Premium Room - Bastos",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 35, unit: "m²" },
    price: { amount: 120000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Chambre de standing dans résidence sécurisée. Meublée luxe, climatisation, salle de bain privée, piscine commune.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 1, bathrooms: 1, floor: 2, hasElevator: true, hasBalcony: true,
      isFurnished: true, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 2, names: ["Lycée Bastos", "International School"] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 1, names: ["Acacias Bastos"] }
    },
    views: 91
  },

  // ==================== LAND (5) ====================
  {
    title: "Buildable Land - Nsam",
    category: "Land",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Nsam", region: "Center" },
    surface: { value: 500, unit: "m²" },
    price: { amount: 25000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Terrain plat viabilisé, titré. Idéal construction villa individuelle. Proche toutes commodités.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 0, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: "buildable"
    },
    amenities: {
      schools: { count: 1, names: ["Collège Nsam"] },
      markets: { count: 1, names: ["Marché Nsam"] },
      stations: { count: 1, names: ["Total Nsam"] },
      bakeries: { count: 1, names: ["Boulangerie Nsam"] }
    },
    views: 45
  },
  {
    title: "Agricultural Land - Mbankomo",
    category: "Agricultural Land",
    listingType: "sale",
    location: { city: "Mbankomo", district: "Centre", region: "Center" },
    surface: { value: 50000, unit: "m²" },
    price: { amount: 15000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "5 hectares de terre fertile. Idéal agriculture (maïs, manioc, légumes). Source d'eau à proximité.",
    images: ["https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800"],
    features: {
      hasElectricity: false, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 0, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: "agricultural"
    },
    amenities: {
      schools: { count: 1, names: ["École Mbankomo"] },
      markets: { count: 1, names: ["Marché Mbankomo"] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    },
    views: 32
  },
  {
    title: "Corner Land - Makepe",
    category: "Land",
    listingType: "sale",
    location: { city: "Douala", district: "Makepe", region: "Littoral" },
    surface: { value: 800, unit: "m²" },
    price: { amount: 45000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Terrain d'angle idéal construction commerciale ou résidentiel. Face route bitumée.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 0, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "commercial", hasParking: false, hasGarden: false, landType: "commercial"
    },
    amenities: {
      schools: { count: 1, names: ["Collège Makepe"] },
      markets: { count: 1, names: ["Marché Makepe"] },
      stations: { count: 1, names: ["Total Makepe"] },
      bakeries: { count: 1, names: ["Boulangerie Makepe"] }
    },
    views: 56
  },
  {
    title: "Lake View Land - Lac",
    category: "Land",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Lac", region: "Center" },
    surface: { value: 1200, unit: "m²" },
    price: { amount: 120000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Terrain exceptionnel avec vue sur le lac. Idéal pour villa de luxe. Déjà viabilisé.",
    images: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 0, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: "buildable"
    },
    amenities: {
      schools: { count: 2, names: ["Lycée Fustel", "American School"] },
      markets: { count: 1, names: ["Marché du Lac"] },
      stations: { count: 1, names: ["Total Golf"] },
      bakeries: { count: 1, names: ["Boulangerie Lac"] }
    },
    views: 78
  },
  {
    title: "Beach Land - Kribi",
    category: "Land",
    listingType: "sale",
    location: { city: "Kribi", district: "Mboamanga", region: "South" },
    surface: { value: 2000, unit: "m²" },
    price: { amount: 85000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Terrain en bord de mer à Kribi. Accès direct plage. Idéal hôtel, villa ou complexe touristique.",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 0, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: false, hasGarden: false, landType: "buildable"
    },
    amenities: {
      schools: { count: 1, names: ["Lycée Kribi"] },
      markets: { count: 1, names: ["Marché de Kribi"] },
      stations: { count: 1, names: ["Total Kribi"] },
      bakeries: { count: 1, names: ["Boulangerie Kribi"] }
    },
    views: 134
  },

  // ==================== COMMERCIAL SPACE (5) ====================
  {
    title: "Commercial Space - Akwa",
    category: "Commercial Space",
    listingType: "rent",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 120, unit: "m²" },
    price: { amount: 800000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Local commercial en plein centre-ville. Grande vitrine, zones de stockage. Idéal boutique, agence.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 1, floor: 0, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: true, zone: "commercial", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Marché Akwa", "Douala Grand Mall"] },
      stations: { count: 2, names: ["Total Akwa", "Oilibya"] },
      bakeries: { count: 1, names: ["Saker Akwa"] }
    },
    views: 67
  },
  {
    title: "Office Space - Mvan",
    category: "Office",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvan", region: "Center" },
    surface: { value: 250, unit: "m²" },
    price: { amount: 1250000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Bureaux modernes dans immeuble de standing. 5 bureaux, salle réunion, kitchenette, parking. Idéal société.",
    images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 2, floor: 2, hasElevator: true, hasBalcony: false,
      isFurnished: true, showWindow: false, zone: "commercial", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Marché Mvan"] },
      stations: { count: 1, names: ["Oilibya Mvan"] },
      bakeries: { count: 1, names: ["Boulangerie Mvan"] }
    },
    views: 45
  },
  {
    title: "Warehouse - Douala Airport",
    category: "Warehouse",
    listingType: "rent",
    location: { city: "Douala", district: "Aéroport", region: "Littoral" },
    surface: { value: 1000, unit: "m²" },
    price: { amount: 2000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Grand entrepôt logistique proche aéroport. Hauteur 8m, quai de chargement, bureaux intégrés.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 2, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "commercial", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 0, names: [] },
      stations: { count: 2, names: ["Total Aéroport", "Oilibya"] },
      bakeries: { count: 0, names: [] }
    },
    views: 89
  },
  {
    title: "Retail Shop - Bonapriso",
    category: "Shop",
    listingType: "rent",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 65, unit: "m²" },
    price: { amount: 450000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Boutique de 65m² au rez-de-chaussée d'immeuble moderne. Vitrine sur rue. Idéal prêt-à-porter, téléphonie.",
    images: ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false,
      bedrooms: 0, bathrooms: 1, floor: 0, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: true, zone: "commercial", hasParking: false, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Super U Bonapriso", "Marché Bonapriso"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 1, names: ["Zepol"] }
    },
    views: 56
  },
  {
    title: "Industrial Space - Bassa",
    category: "Industrial Space",
    listingType: "sale",
    location: { city: "Douala", district: "Bassa", region: "Littoral" },
    surface: { value: 5000, unit: "m²" },
    price: { amount: 450000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Terrain industriel de 5000m² avec bâtiment 1500m². Zone industrielle de Bassa. Idéal usine, logistique.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 4, floor: null, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "industrial", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Marché Bassa"] },
      stations: { count: 2, names: ["Total Bassa", "Oilibya"] },
      bakeries: { count: 1, names: ["Boulangerie Bassa"] }
    },
    views: 42
  },

  // ==================== PARKING (5) ====================
  {
    title: "Secure Parking - Bastos",
    category: "Parking",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 25, unit: "m²" },
    price: { amount: 50000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Place de parking sécurisée dans résidence. Accès 24/7, gardiennage, idéal pour résident ou professionnel.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasWater: false, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 0, floor: -1, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 0, names: [] }
    },
    views: 34
  },
  {
    title: "Parking Box - Akwa",
    category: "Parking",
    listingType: "sale",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 30, unit: "m²" },
    price: { amount: 5000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Box fermé en sous-sol d'immeuble de bureaux. Idéal investissement locatif. Forte demande.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasWater: false, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 0, floor: -2, hasElevator: true, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Douala Grand Mall", "Marché Akwa"] },
      stations: { count: 1, names: ["Total Akwa"] },
      bakeries: { count: 0, names: [] }
    },
    views: 78
  },
  {
    title: "Parking Space - Mfoundi",
    category: "Parking",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mfoundi", region: "Center" },
    surface: { value: 20, unit: "m²" },
    price: { amount: 40000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Place parking surveillée en centre-ville. Idéal pour employés de bureau.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: false, hasWater: false, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 0, floor: 0, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Marché Mfoundi"] },
      stations: { count: 1, names: ["Total Mfoundi"] },
      bakeries: { count: 0, names: [] }
    },
    views: 45
  },
  {
    title: "Underground Parking - Hilton",
    category: "Parking",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Hilton", region: "Center" },
    surface: { value: 28, unit: "m²" },
    price: { amount: 60000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Parking sécurisé sous immeuble premium. Accès badge, vidéosurveillance.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasWater: false, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 0, floor: -1, hasElevator: true, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Casino Hilton"] },
      stations: { count: 1, names: ["Total Hilton"] },
      bakeries: { count: 0, names: [] }
    },
    views: 56
  },
  {
    title: "Parking Lot - Bonamoussadi",
    category: "Parking",
    listingType: "sale",
    location: { city: "Douala", district: "Bonamoussadi", region: "Littoral" },
    surface: { value: 40, unit: "m²" },
    price: { amount: 8000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Grand parking extérieur sécurisé. Bon investissement, zone commerciale très fréquentée.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasWater: false, hasRoad: true, isFenced: true,
      bedrooms: 0, bathrooms: 0, floor: 0, hasElevator: false, hasBalcony: false,
      isFurnished: false, showWindow: false, zone: "", hasParking: true, hasGarden: false, landType: ""
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Super U Bonamoussadi", "Marché Bonamoussadi"] },
      stations: { count: 2, names: ["Total Bonamoussadi", "Oilibya"] },
      bakeries: { count: 1, names: ["Zepol"] }
    },
    views: 62
  }
];

// Owner ID par défaut (à remplacer par un vrai ID)
const DEFAULT_OWNER_ID = "6a0b1246cb24da378d66d401";

// Fonction pour importer les mock data
export async function importMockProperties() {
  try {
    const Property = mongoose.model('Property');
    
    for (const prop of MOCK_PROPERTIES) {
      const exists = await Property.findOne({ title: prop.title });
      if (!exists) {
        await Property.create({
          ...prop,
          owner: new mongoose.Types.ObjectId(DEFAULT_OWNER_ID),
          status: "PUBLISHED"
        });
        console.log(`✅ Importé: ${prop.title}`);
      } else {
        console.log(`⏭️ Déjà existant: ${prop.title}`);
      }
    }
    console.log(`\n✨ Import terminé! ${MOCK_PROPERTIES.length} propriétés traitées.`);
  } catch (error) {
    console.error('❌ Erreur import:', error.message);
  }
}