// frontend/src/data/mockProperties.js

export const MOCK_PROPERTIES = [
  // ==================== VILLAS (5) ====================
  {
    id: "mock_villa_1",
    title: "Ambassadorial Villa - Bastos",
    category: "Villa",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 1500, unit: "m²" },
    price: { amount: 750000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "An exceptional residence located in the diplomatic heart of Yaoundé. This luxury villa offers majestic spaces, a landscaped garden with Olympic swimming pool, and staff quarters. Maximum security with guardhouse and electric fence.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
    ],
    features: {
      bedrooms: 8, bathrooms: 7, isFurnished: true, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 3, names: ["Lycée de Bastos", "International School Le Flamboyant", "American School"] },
      markets: { count: 2, names: ["Bastos Market", "Casino Supermarket"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 2, names: ["Acacias Bastos", "Select Bakes"] }
    }
  },
  {
    id: "mock_villa_2",
    title: "Mediterranean Villa - Lake District",
    category: "Villa",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Lake District", region: "Center" },
    surface: { value: 800, unit: "m²" },
    price: { amount: 850000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Magnificent Mediterranean-style villa overlooking the lake. 6 ensuite bedrooms, infinity pool, tennis court, 2000m² landscaped garden, gatehouse.",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
    features: {
      bedrooms: 6, bathrooms: 6, isFurnished: true, hasParking: true, hasGarden: true, hasElevator: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 3, names: ["Lycée Fustel de Coulanges", "Jean-Tabi College", "American School"] },
      markets: { count: 2, names: ["Lake Market", "Casino Golf"] },
      stations: { count: 2, names: ["Total Golf", "Oilibya Lake"] },
      bakeries: { count: 2, names: ["Acacias", "Lake Bakery"] }
    }
  },
  {
    id: "mock_villa_3",
    title: "Modern Villa - Makepe",
    category: "Villa",
    listingType: "sale",
    location: { city: "Douala", district: "Makepe", region: "Littoral" },
    surface: { value: 600, unit: "m²" },
    price: { amount: 550000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Architectural villa with 5 bedrooms, swimming pool, gym, home cinema. Secure neighborhood near Makepe terminal.",
    images: ["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800"],
    features: {
      bedrooms: 5, bathrooms: 4, isFurnished: true, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Makepe Bilingual College", "Public School"] },
      markets: { count: 1, names: ["Makepe Market"] },
      stations: { count: 1, names: ["Tradex Makepe"] },
      bakeries: { count: 1, names: ["Makepe Bakery"] }
    }
  },
  {
    id: "mock_villa_4",
    title: "Colonial Villa - Bali",
    category: "Villa",
    listingType: "rent",
    location: { city: "Bafoussam", district: "Bali", region: "West" },
    surface: { value: 450, unit: "m²" },
    price: { amount: 700000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Renovated colonial villa with authentic charm. Exposed beams, fireplace, large wooded garden. 4 bedrooms, covered terrace.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      bedrooms: 4, bathrooms: 3, isFurnished: true, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Bali High School", "Private College"] },
      markets: { count: 1, names: ["Bali Market"] },
      stations: { count: 1, names: ["Total Bali"] },
      bakeries: { count: 1, names: ["Bali Bakery"] }
    }
  },
  {
    id: "mock_villa_5",
    title: "Seaside Villa - Limbe",
    category: "Villa",
    listingType: "sale",
    location: { city: "Limbe", district: "Down Beach", region: "South-West" },
    surface: { value: 520, unit: "m²" },
    price: { amount: 420000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Prestige beachfront villa with stunning views of the ocean and Mount Cameroon. Tropical garden, direct beach access.",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    features: {
      bedrooms: 5, bathrooms: 4, isFurnished: true, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Limbe Bilingual High School", "Saker College"] },
      markets: { count: 1, names: ["Limbe Market"] },
      stations: { count: 2, names: ["Total Limbe", "Oilibya"] },
      bakeries: { count: 2, names: ["Seaside Bakery", "Saker"] }
    }
  },

  // ==================== HOUSES (5) ====================
  {
    id: "mock_house_1",
    title: "Contemporary Family Home - Bastos",
    category: "House",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 450, unit: "m²" },
    price: { amount: 250000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Beautiful contemporary villa in the residential Bastos neighborhood. This 4-bedroom house offers a spacious living room, fully equipped kitchen, landscaped garden and swimming pool. Perfect for a family seeking comfort and security.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    features: {
      bedrooms: 4, bathrooms: 3, isFurnished: false, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Lycée de Bastos", "International School Le Flamboyant"] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 1, names: ["Acacias Bastos"] }
    }
  },
  {
    id: "mock_house_2",
    title: "Modern Family Home - Mvog Mbi",
    category: "House",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvog Mbi", region: "Center" },
    surface: { value: 320, unit: "m²" },
    price: { amount: 500000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Bright contemporary house with 3 bedrooms, cathedral living room, American kitchen and small garden. Quiet neighborhood close to all amenities.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      bedrooms: 3, bathrooms: 2, isFurnished: true, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Vogt College", "Mvog Mbi Public School"] },
      markets: { count: 1, names: ["Mvog Mbi Market"] },
      stations: { count: 1, names: ["Oilibya Mvog Mbi"] },
      bakeries: { count: 1, names: ["Mvog Mbi Bakery"] }
    }
  },
  {
    id: "mock_house_3",
    title: "Luxury Executive Home - Golf",
    category: "House",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Golf", region: "Center" },
    surface: { value: 550, unit: "m²" },
    price: { amount: 450000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Exceptional property overlooking the golf course. 5 ensuite bedrooms, infinity pool, gym, home cinema, luxury gatehouse.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    features: {
      bedrooms: 5, bathrooms: 5, isFurnished: true, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["British School", "Jean-Tabi College"] },
      markets: { count: 1, names: ["Santa Lucia Golf"] },
      stations: { count: 1, names: ["Oilibya Golf"] },
      bakeries: { count: 1, names: ["Golf Bakery"] }
    }
  },
  {
    id: "mock_house_4",
    title: "Cozy Family Home - Mokolo",
    category: "House",
    listingType: "rent",
    location: { city: "Douala", district: "Mokolo", region: "Littoral" },
    surface: { value: 200, unit: "m²" },
    price: { amount: 350000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Warm 3-bedroom house located near the main market. Easy access, lively neighborhood, ideal for merchants or families.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      bedrooms: 3, bathrooms: 2, isFurnished: false, hasParking: false, hasGarden: false,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 1, names: ["Mokolo Public School"] },
      markets: { count: 2, names: ["Mokolo Market", "Total Market"] },
      stations: { count: 2, names: ["Total Mokolo", "Oilibya"] },
      bakeries: { count: 1, names: ["Saker Mokolo"] }
    }
  },
  {
    id: "mock_house_5",
    title: "Spacious Villa - Bonapriso",
    category: "House",
    listingType: "sale",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 480, unit: "m²" },
    price: { amount: 380000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Beautiful upscale villa in the Bonapriso residential area. 4 bedrooms including master suite, large living room, tree-filled garden, secure parking.",
    images: ["https://images.unsplash.com/photo-1600566753087-00f18fb6b3ea?w=800"],
    features: {
      bedrooms: 4, bathrooms: 3, isFurnished: true, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Bonapriso High School", "Libermann College"] },
      markets: { count: 2, names: ["Super U Bonapriso", "Bonapriso Market"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 2, names: ["Zepol Bonapriso", "Saker"] }
    }
  },

  // ==================== DUPLEX (5) ====================
  {
    id: "mock_duplex_1",
    title: "Executive Duplex - Mvan",
    category: "Duplex",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Mvan", region: "Center" },
    surface: { value: 350, unit: "m²" },
    price: { amount: 195000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Beautiful 3-story duplex with rooftop terrace. 4 bedrooms, double-height living room, equipped kitchen, garage for 2 cars.",
    images: ["https://images.unsplash.com/photo-1600566753087-00f18fb6b3ea?w=800"],
    features: {
      bedrooms: 4, bathrooms: 3, isFurnished: false, hasParking: true, floor: 1,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Mvan College", "Public School"] },
      markets: { count: 1, names: ["Mvan Market"] },
      stations: { count: 1, names: ["Oilibya Mvan"] },
      bakeries: { count: 1, names: ["Mvan Bakery"] }
    }
  },
  {
    id: "mock_duplex_2",
    title: "Luxury Duplex - Akwa",
    category: "Duplex",
    listingType: "rent",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 280, unit: "m²" },
    price: { amount: 1200000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Modern duplex in the heart of the business district. 3 bedrooms, panoramic view, home automation, private parking. Ideal for expatriates.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      bedrooms: 3, bathrooms: 3, isFurnished: true, hasParking: true, hasElevator: true, floor: 4,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Libermann College", "Joss High School"] },
      markets: { count: 2, names: ["Douala Grand Mall", "Sandaga Market"] },
      stations: { count: 2, names: ["Total Akwa", "Oilibya Akwa"] },
      bakeries: { count: 2, names: ["Saker Akwa", "Zepol"] }
    }
  },
  {
    id: "mock_duplex_3",
    title: "Family Duplex - Ndogbong",
    category: "Duplex",
    listingType: "sale",
    location: { city: "Douala", district: "Ndogbong", region: "Littoral" },
    surface: { value: 310, unit: "m²" },
    price: { amount: 165000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Family duplex with spacious areas. 4 bedrooms, large living room, separate kitchen, inner courtyard, garage.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      bedrooms: 4, bathrooms: 3, isFurnished: false, hasParking: true, hasGarden: true, floor: 1,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Ndogbong High School", "Private College"] },
      markets: { count: 1, names: ["Ndogbong Market"] },
      stations: { count: 1, names: ["Total Ndogbong"] },
      bakeries: { count: 1, names: ["Ndogbong Bakery"] }
    }
  },
  {
    id: "mock_duplex_4",
    title: "Student Duplex - Ngoa Ekele",
    category: "Duplex",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Ngoa Ekele", region: "Center" },
    surface: { value: 180, unit: "m²" },
    price: { amount: 400000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Furnished duplex near the University. 2 bedrooms, living room, small kitchen. Perfect for students or young couples.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      bedrooms: 2, bathrooms: 2, isFurnished: true, hasParking: false, hasGarden: false, floor: 1,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 1, names: ["University of Yaoundé I"] },
      markets: { count: 2, names: ["Ngoa Ekele Market", "Supermarket"] },
      stations: { count: 1, names: ["Oilibya Ngoa Ekele"] },
      bakeries: { count: 1, names: ["Ngoa Bakery"] }
    }
  },
  {
    id: "mock_duplex_5",
    title: "Premium Duplex - Kondengui",
    category: "Duplex",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Kondengui", region: "Center" },
    surface: { value: 400, unit: "m²" },
    price: { amount: 280000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Prestige duplex with panoramic city views. 5 bedrooms, private elevator, swimming pool, large terrace, garden.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    features: {
      bedrooms: 5, bathrooms: 4, isFurnished: true, hasParking: true, hasGarden: true, hasElevator: true, floor: 2,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Kondengui High School", "Bilingual College"] },
      markets: { count: 1, names: ["Kondengui Market"] },
      stations: { count: 1, names: ["Total Kondengui"] },
      bakeries: { count: 1, names: ["Kondengui Bakery"] }
    }
  },

  // ==================== APARTMENTS (5) ====================
  {
    id: "mock_apt_1",
    title: "Penthouse Ocean View - Akwa",
    category: "Apartment",
    listingType: "sale",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 220, unit: "m²" },
    price: { amount: 150000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Magnificent top-floor penthouse with panoramic views of the city and estuary. 3 bedrooms, 50m² terrace, parking.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    features: {
      bedrooms: 3, bathrooms: 3, isFurnished: true, hasParking: true, hasElevator: true, hasBalcony: true, floor: 12,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Libermann College", "Joss High School"] },
      markets: { count: 2, names: ["Douala Grand Mall", "Sandaga Market"] },
      stations: { count: 2, names: ["Total Akwa", "Oilibya"] },
      bakeries: { count: 2, names: ["Saker Akwa", "Zepol"] }
    }
  },
  {
    id: "mock_apt_2",
    title: "Modern Apartment - Mvog Mbi",
    category: "Apartment",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvog Mbi", region: "Center" },
    surface: { value: 120, unit: "m²" },
    price: { amount: 250000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Beautiful modern 2-bedroom apartment. Quiet neighborhood, close to shops, equipped kitchen, balcony.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      bedrooms: 2, bathrooms: 2, isFurnished: false, hasParking: false, hasBalcony: true, floor: 3,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 2, names: ["Vogt College", "Public School"] },
      markets: { count: 1, names: ["Mvog Mbi Market"] },
      stations: { count: 1, names: ["Oilibya Mvog Mbi"] },
      bakeries: { count: 1, names: ["Mvog Mbi Bakery"] }
    }
  },
  {
    id: "mock_apt_3",
    title: "Luxury Apartment - Bonapriso",
    category: "Apartment",
    listingType: "sale",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 180, unit: "m²" },
    price: { amount: 185000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Luxury apartment in a secure residence. 3 bedrooms including master suite, American kitchen, shared pool, 24/7 security.",
    images: ["https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=800"],
    features: {
      bedrooms: 3, bathrooms: 2, isFurnished: true, hasParking: true, hasElevator: true, hasBalcony: true, floor: 5,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Bonapriso High School", "Libermann College"] },
      markets: { count: 2, names: ["Super U Bonapriso", "Market"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 2, names: ["Zepol", "Saker"] }
    }
  },
  {
    id: "mock_apt_4",
    title: "Cozy Apartment - Nsam",
    category: "Apartment",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Nsam", region: "Center" },
    surface: { value: 85, unit: "m²" },
    price: { amount: 180000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Functional 1-bedroom apartment. Perfect for singles or students. Hot water, kitchenette.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      bedrooms: 1, bathrooms: 1, isFurnished: true, hasParking: false, floor: 2,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 1, names: ["Nsam College"] },
      markets: { count: 2, names: ["Nsam Market", "Mini-mart"] },
      stations: { count: 1, names: ["Total Nsam"] },
      bakeries: { count: 1, names: ["Nsam Bakery"] }
    }
  },
  {
    id: "mock_apt_5",
    title: "Executive Apartment - Bepanda",
    category: "Apartment",
    listingType: "sale",
    location: { city: "Douala", district: "Bepanda", region: "Littoral" },
    surface: { value: 150, unit: "m²" },
    price: { amount: 120000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Spacious apartment in the heart of Bepanda. 3 bedrooms, double living room, equipped kitchen, 2 balconies, parking.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      bedrooms: 3, bathrooms: 2, isFurnished: false, hasParking: true, hasElevator: true, hasBalcony: true, floor: 4,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Bepanda High School", "Private College"] },
      markets: { count: 2, names: ["Bepanda Market", "Super U"] },
      stations: { count: 2, names: ["Total Bepanda", "Oilibya"] },
      bakeries: { count: 1, names: ["Bepanda Bakery"] }
    }
  },

  // ==================== STUDIOS (5) ====================
  {
    id: "mock_studio_1",
    title: "Modern Studio - Bastos",
    category: "Studio",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 45, unit: "m²" },
    price: { amount: 150000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Modern all-inclusive studio, perfect for students or young professionals. Air-conditioned, furnished, equipped kitchen, secure.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    features: {
      bedrooms: 0, bathrooms: 1, isFurnished: true, hasParking: false, hasElevator: true, hasBalcony: true, floor: 2,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Bastos High School", "International School"] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 1, names: ["Acacias Bastos"] }
    }
  },
  {
    id: "mock_studio_2",
    title: "Student Studio - Nlongkak",
    category: "Studio",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Nlongkak", region: "Center" },
    surface: { value: 35, unit: "m²" },
    price: { amount: 100000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Furnished studio near the Catholic University. Ideal for students. Bed, fridge, shower, kitchenette.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      bedrooms: 0, bathrooms: 1, isFurnished: true, hasParking: false, floor: 1,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 2, names: ["Catholic University", "Nlongkak College"] },
      markets: { count: 1, names: ["Nlongkak Market"] },
      stations: { count: 1, names: ["Oilibya Nlongkak"] },
      bakeries: { count: 1, names: ["Nlongkak Bakery"] }
    }
  },
  {
    id: "mock_studio_3",
    title: "Cozy Studio - Bonapriso",
    category: "Studio",
    listingType: "rent",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 50, unit: "m²" },
    price: { amount: 200000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Charming studio in a residence with pool. Tastefully furnished, air-conditioned, American kitchen, terrace.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      bedrooms: 0, bathrooms: 1, isFurnished: true, hasParking: true, hasElevator: true, hasBalcony: true, floor: 3,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Bonapriso High School", "Libermann College"] },
      markets: { count: 2, names: ["Super U", "Bonapriso Market"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 2, names: ["Zepol", "Saker"] }
    }
  },
  {
    id: "mock_studio_4",
    title: "Minimalist Studio - Mvog Ada",
    category: "Studio",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvog Ada", region: "Center" },
    surface: { value: 40, unit: "m²" },
    price: { amount: 120000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Clean and bright studio. Perfect for a single person seeking comfort and simplicity. Close to transport.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    features: {
      bedrooms: 0, bathrooms: 1, isFurnished: false, hasParking: false, floor: 2,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 1, names: ["Mvog Ada College"] },
      markets: { count: 1, names: ["Mvog Ada Market"] },
      stations: { count: 1, names: ["Total Mvog Ada"] },
      bakeries: { count: 1, names: ["Mvog Ada Bakery"] }
    }
  },
  {
    id: "mock_studio_5",
    title: "Premium Studio - Golf",
    category: "Studio",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Golf", region: "Center" },
    surface: { value: 55, unit: "m²" },
    price: { amount: 45000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Premium studio for sale in luxury residence. Great rental investment. Prime location, secure.",
    images: ["https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=800"],
    features: {
      bedrooms: 0, bathrooms: 1, isFurnished: false, hasParking: true, hasElevator: true, hasBalcony: true, floor: 4,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["British School", "Jean-Tabi College"] },
      markets: { count: 1, names: ["Santa Lucia"] },
      stations: { count: 1, names: ["Oilibya Golf"] },
      bakeries: { count: 1, names: ["Golf Bakery"] }
    }
  },

  // ==================== ROOMS (5) ====================
  {
    id: "mock_room_1",
    title: "Furnished Room - Mendong",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mendong", region: "Center" },
    surface: { value: 25, unit: "m²" },
    price: { amount: 60000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Furnished room in student shared housing. Bed, wardrobe, desk, private bathroom. Shared kitchen and living room.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    features: {
      bedrooms: 1, bathrooms: 1, isFurnished: true, hasParking: false, floor: 1,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 1, names: ["University Mendong"] },
      markets: { count: 1, names: ["Mendong Market"] },
      stations: { count: 1, names: ["Total Mendong"] },
      bakeries: { count: 1, names: ["Mendong Bakery"] }
    }
  },
  {
    id: "mock_room_2",
    title: "Spacious Room - Etoug-Ebe",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Etoug-Ebe", region: "Center" },
    surface: { value: 30, unit: "m²" },
    price: { amount: 75000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Large room with private bathroom. Quiet house, shared garden. Close to Bastos shopping center.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    features: {
      bedrooms: 1, bathrooms: 1, isFurnished: false, hasParking: true, hasGarden: true,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 1, names: ["Etoug-Ebe College"] },
      markets: { count: 1, names: ["Etoug-Ebe Market"] },
      stations: { count: 1, names: ["Total Etoug-Ebe"] },
      bakeries: { count: 1, names: ["Etoug-Ebe Bakery"] }
    }
  },
  {
    id: "mock_room_3",
    title: "Student Room - Cite Verte",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Cite Verte", region: "Center" },
    surface: { value: 20, unit: "m²" },
    price: { amount: 50000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Budget-friendly room for students. Basic furnished, lively neighborhood, near universities.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    features: {
      bedrooms: 1, bathrooms: 1, isFurnished: true, hasParking: false, floor: 1,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 2, names: ["University of Yaoundé I", "Cite Verte College"] },
      markets: { count: 1, names: ["Cite Verte Market"] },
      stations: { count: 1, names: ["Oilibya Cite Verte"] },
      bakeries: { count: 1, names: ["Cite Verte Bakery"] }
    }
  },
  {
    id: "mock_room_4",
    title: "Cozy Room - Deido",
    category: "Room",
    listingType: "rent",
    location: { city: "Douala", district: "Deido", region: "Littoral" },
    surface: { value: 28, unit: "m²" },
    price: { amount: 65000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Comfortable room in a popular neighborhood. Double bed, wardrobe, fan, shared bathroom.",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    features: {
      bedrooms: 1, bathrooms: 1, isFurnished: true, hasParking: false,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false
    },
    amenities: {
      schools: { count: 1, names: ["Deido High School"] },
      markets: { count: 2, names: ["Deido Market", "Sandaga Market"] },
      stations: { count: 1, names: ["Total Deido"] },
      bakeries: { count: 1, names: ["Deido Bakery"] }
    }
  },
  {
    id: "mock_room_5",
    title: "Premium Room - Bastos",
    category: "Room",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 35, unit: "m²" },
    price: { amount: 120000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "High-end room in a secure residence. Luxury furnished, air conditioning, private bathroom, shared pool.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    features: {
      bedrooms: 1, bathrooms: 1, isFurnished: true, hasParking: true, hasElevator: true, hasBalcony: true, floor: 2,
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true
    },
    amenities: {
      schools: { count: 2, names: ["Bastos High School", "International School"] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 1, names: ["Acacias Bastos"] }
    }
  },

  // ==================== LAND (5) ====================
  {
    id: "mock_land_1",
    title: "Buildable Land - Nsam",
    category: "Land",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Nsam", region: "Center" },
    surface: { value: 500, unit: "m²" },
    price: { amount: 25000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Flat serviced land with title deed. Perfect for building a private villa. Close to all amenities.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false, landType: "buildable"
    },
    amenities: {
      schools: { count: 1, names: ["Nsam College"] },
      markets: { count: 1, names: ["Nsam Market"] },
      stations: { count: 1, names: ["Total Nsam"] },
      bakeries: { count: 1, names: ["Nsam Bakery"] }
    }
  },
  {
    id: "mock_land_2",
    title: "Agricultural Land - Mbankomo",
    category: "Agricultural Land",
    listingType: "sale",
    location: { city: "Mbankomo", district: "Center", region: "Center" },
    surface: { value: 50000, unit: "m²" },
    price: { amount: 15000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "5 hectares of fertile land. Ideal for agriculture (corn, cassava, vegetables). Water source nearby.",
    images: ["https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800"],
    features: {
      hasElectricity: false, hasWater: true, hasRoad: true, isFenced: false, landType: "agricultural"
    },
    amenities: {
      schools: { count: 1, names: ["Mbankomo School"] },
      markets: { count: 1, names: ["Mbankomo Market"] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: "mock_land_3",
    title: "Corner Land - Makepe",
    category: "Land",
    listingType: "sale",
    location: { city: "Douala", district: "Makepe", region: "Littoral" },
    surface: { value: 800, unit: "m²" },
    price: { amount: 45000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Corner land perfect for commercial or residential construction. Fronting paved road.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false, landType: "commercial"
    },
    amenities: {
      schools: { count: 1, names: ["Makepe College"] },
      markets: { count: 1, names: ["Makepe Market"] },
      stations: { count: 1, names: ["Total Makepe"] },
      bakeries: { count: 1, names: ["Makepe Bakery"] }
    }
  },
  {
    id: "mock_land_4",
    title: "Lake View Land - Lac",
    category: "Land",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Lake", region: "Center" },
    surface: { value: 1200, unit: "m²" },
    price: { amount: 120000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Exceptional land overlooking the lake. Perfect for luxury villa. Already serviced.",
    images: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false, landType: "buildable"
    },
    amenities: {
      schools: { count: 2, names: ["Fustel High School", "American School"] },
      markets: { count: 1, names: ["Lake Market"] },
      stations: { count: 1, names: ["Total Golf"] },
      bakeries: { count: 1, names: ["Lake Bakery"] }
    }
  },
  {
    id: "mock_land_5",
    title: "Beach Land - Kribi",
    category: "Land",
    listingType: "sale",
    location: { city: "Kribi", district: "Mboamanga", region: "South" },
    surface: { value: 2000, unit: "m²" },
    price: { amount: 85000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Beachfront land in Kribi. Direct beach access. Ideal for hotel, villa or tourist complex.",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: false, landType: "buildable"
    },
    amenities: {
      schools: { count: 1, names: ["Kribi High School"] },
      markets: { count: 1, names: ["Kribi Market"] },
      stations: { count: 1, names: ["Total Kribi"] },
      bakeries: { count: 1, names: ["Kribi Bakery"] }
    }
  },

  // ==================== COMMERCIAL SPACE (5) ====================
  {
    id: "mock_commercial_1",
    title: "Commercial Space - Akwa",
    category: "Commercial Space",
    listingType: "rent",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 120, unit: "m²" },
    price: { amount: 800000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Commercial space in the city center. Large storefront, storage areas. Perfect for boutique or agency.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, showWindow: true, zone: "commercial"
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Akwa Market", "Douala Grand Mall"] },
      stations: { count: 2, names: ["Total Akwa", "Oilibya"] },
      bakeries: { count: 1, names: ["Saker Akwa"] }
    }
  },
  {
    id: "mock_commercial_2",
    title: "Office Space - Mvan",
    category: "Office",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mvan", region: "Center" },
    surface: { value: 250, unit: "m²" },
    price: { amount: 1250000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Modern offices in a premium building. 5 offices, meeting room, kitchenette, parking. Perfect for companies.",
    images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, hasParking: true, hasElevator: true, floor: 2
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Mvan Market"] },
      stations: { count: 1, names: ["Oilibya Mvan"] },
      bakeries: { count: 1, names: ["Mvan Bakery"] }
    }
  },
  {
    id: "mock_commercial_3",
    title: "Warehouse - Douala Airport",
    category: "Warehouse",
    listingType: "rent",
    location: { city: "Douala", district: "Airport", region: "Littoral" },
    surface: { value: 1000, unit: "m²" },
    price: { amount: 2000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Large logistics warehouse near the airport. 8m height, loading dock, integrated offices.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true, hasParking: true
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 0, names: [] },
      stations: { count: 2, names: ["Total Airport", "Oilibya"] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: "mock_commercial_4",
    title: "Retail Shop - Bonapriso",
    category: "Shop",
    listingType: "rent",
    location: { city: "Douala", district: "Bonapriso", region: "Littoral" },
    surface: { value: 65, unit: "m²" },
    price: { amount: 450000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "65m² shop on the ground floor of a modern building. Street-facing storefront. Perfect for clothing or phone store.",
    images: ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, showWindow: true, zone: "commercial"
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Super U Bonapriso", "Bonapriso Market"] },
      stations: { count: 1, names: ["Total Bonapriso"] },
      bakeries: { count: 1, names: ["Zepol"] }
    }
  },
  {
    id: "mock_commercial_5",
    title: "Industrial Space - Bassa",
    category: "Industrial Space",
    listingType: "sale",
    location: { city: "Douala", district: "Bassa", region: "Littoral" },
    surface: { value: 5000, unit: "m²" },
    price: { amount: 450000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "5000m² industrial land with 1500m² building. Bassa industrial zone. Ideal for factory or logistics.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"],
    features: {
      hasElectricity: true, hasWater: true, hasRoad: true, isFenced: true, hasParking: true, zone: "industrial"
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Bassa Market"] },
      stations: { count: 2, names: ["Total Bassa", "Oilibya"] },
      bakeries: { count: 1, names: ["Bassa Bakery"] }
    }
  },

  // ==================== PARKING (5) ====================
  {
    id: "mock_parking_1",
    title: "Secure Parking - Bastos",
    category: "Parking",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    surface: { value: 25, unit: "m²" },
    price: { amount: 50000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Secure parking space in a residence. 24/7 access, security guard, ideal for residents or professionals.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasRoad: true, isFenced: true, hasParking: true
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Super U Bastos"] },
      stations: { count: 1, names: ["Total Bastos"] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: "mock_parking_2",
    title: "Parking Box - Akwa",
    category: "Parking",
    listingType: "sale",
    location: { city: "Douala", district: "Akwa", region: "Littoral" },
    surface: { value: 30, unit: "m²" },
    price: { amount: 5000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Enclosed box in an office building basement. Great rental investment. High demand.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasRoad: true, isFenced: true, hasParking: true, hasElevator: true, floor: -2
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Douala Grand Mall", "Akwa Market"] },
      stations: { count: 1, names: ["Total Akwa"] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: "mock_parking_3",
    title: "Parking Space - Mfoundi",
    category: "Parking",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Mfoundi", region: "Center" },
    surface: { value: 20, unit: "m²" },
    price: { amount: 40000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Monitored parking space in the city center. Ideal for office employees.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasRoad: true, isFenced: true, hasParking: true
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Mfoundi Market"] },
      stations: { count: 1, names: ["Total Mfoundi"] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: "mock_parking_4",
    title: "Underground Parking - Hilton",
    category: "Parking",
    listingType: "rent",
    location: { city: "Yaoundé", district: "Hilton", region: "Center" },
    surface: { value: 28, unit: "m²" },
    price: { amount: 60000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Secure parking under a premium building. Access badge, video surveillance.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasRoad: true, isFenced: true, hasParking: true, hasElevator: true, floor: -1
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 1, names: ["Casino Hilton"] },
      stations: { count: 1, names: ["Total Hilton"] },
      bakeries: { count: 0, names: [] }
    }
  },
  {
    id: "mock_parking_5",
    title: "Parking Lot - Bonamoussadi",
    category: "Parking",
    listingType: "sale",
    location: { city: "Douala", district: "Bonamoussadi", region: "Littoral" },
    surface: { value: 40, unit: "m²" },
    price: { amount: 8000000, currency: "FCFA" },
    status: "PUBLISHED",
    description: "Large secure outdoor parking. Good investment, busy commercial area.",
    images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"],
    features: {
      hasElectricity: true, hasRoad: true, isFenced: true, hasParking: true
    },
    amenities: {
      schools: { count: 0, names: [] },
      markets: { count: 2, names: ["Super U Bonamoussadi", "Bonamoussadi Market"] },
      stations: { count: 2, names: ["Total Bonamoussadi", "Oilibya"] },
      bakeries: { count: 1, names: ["Zepol"] }
    }
  }
];

// Helper function to get all mock properties
export const getAllMockProperties = () => MOCK_PROPERTIES;

// Helper function to get mock property by ID
export const getMockPropertyById = (id) => MOCK_PROPERTIES.find(p => p.id === id);

// Helper function to get mock properties by category
export const getMockPropertiesByCategory = (category) => MOCK_PROPERTIES.filter(p => p.category === category);