// src/data/mockLivestock.js

// ==================== BANQUE D'IMAGES RÉALISTES PAR CATÉGORIE ====================
// Chaque catégorie a ses propres images spécifiques

const LIVESTOCK_IMAGES = {
  // POULTRY - Images de poulets, fermes avicoles (REALISTIC)
  poultry: [
    "https://images.pexels.com/photos/6173180/pexels-photo-6173180.jpeg?w=800&h=600&fit=crop",  // poulets dans un élevage
    "https://images.pexels.com/photos/5863312/pexels-photo-5863312.jpeg?w=800&h=600&fit=crop",  // poulets blancs
    "https://images.pexels.com/photos/4057700/pexels-photo-4057700.jpeg?w=800&h=600&fit=crop",  // ferme avicole moderne
    "https://images.pexels.com/photos/5328689/pexels-photo-5328689.jpeg?w=800&h=600&fit=crop",  // poules pondeuses
    "https://images.pexels.com/photos/6107764/pexels-photo-6107764.jpeg?w=800&h=600&fit=crop",  // oeufs en production
    "https://images.pexels.com/photos/6347935/pexels-photo-6347935.jpeg?w=800&h=600&fit=crop",  // incubateur
    "https://images.pexels.com/photos/3997754/pexels-photo-3997754.jpeg?w=800&h=600&fit=crop",  // poulet de chair
    "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?w=800&h=600&fit=crop"   // coq
  ],
  
  // AQUACULTURE - Images de poissons, bassins, pisciculture (REALISTIC)
  aquaculture: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMy9DPFRrEMile9CD20hbyiduP05mlCLkoAQ&s",  // bassin à poissons
    "https://images.pexels.com/photos/5784061/pexels-photo-5784061.jpeg?w=800&h=600&fit=crop",  // tilapia
    "https://images.pexels.com/photos/5688661/pexels-photo-5688661.jpeg?w=800&h=600&fit=crop",  // ferme piscicole
    "https://images.pexels.com/photos/209848/pexels-photo-209848.jpeg?w=800&h=600&fit=crop",   // poissons dans un bassin
    "https://images.pexels.com/photos/4167523/pexels-photo-4167523.jpeg?w=800&h=600&fit=crop",  // alevins
    "https://images.pexels.com/photos/235731/pexels-photo-235731.jpeg?w=800&h=600&fit=crop",   // pêche
    "https://images.pexels.com/photos/4600795/pexels-photo-4600795.jpeg?w=800&h=600&fit=crop",  // poisson tropicaux
    "https://images.pexels.com/photos/4578822/pexels-photo-4578822.jpeg?w=800&h=600&fit=crop"   // récolte de poissons
  ],
  
  // CATTLE - Images de vaches, élevage bovin (REALISTIC)
  cattle: [
    "https://en.wikipedia.org/wiki/Cattle",  // vaches laitières
    "https://images.pexels.com/photos/2456451/pexels-photo-2456451.jpeg?w=800&h=600&fit=crop",  // troupeau de vaches
    "https://images.pexels.com/photos/2525870/pexels-photo-2525870.jpeg?w=800&h=600&fit=crop",  // vaches au pâturage
    "https://images.pexels.com/photos/3576796/pexels-photo-3576796.jpeg?w=800&h=600&fit=crop",  // bovins dans un enclos
    "https://images.pexels.com/photos/2888140/pexels-photo-2888140.jpeg?w=800&h=600&fit=crop",  // ferme bovine
    "https://images.pexels.com/photos/2828029/pexels-photo-2828029.jpeg?w=800&h=600&fit=crop",  // vache et veau
    "https://images.pexels.com/photos/167464/pexels-photo-167464.jpeg?w=800&h=600&fit=crop",   // troupeau dans la savane
    "https://images.pexels.com/photos/1434905/pexels-photo-1434905.jpeg?w=800&h=600&fit=crop"   // vaches broutant
  ],
  
  // PIGS - Images de porcs (REALISTIC - avec VRAIS cochons!)
  pigs: [
    "https://www.google.com/imgres?q=Pigs&imgurl=https%3A%2F%2Fpedersonsfarms.com%2Fcdn%2Fshop%2Farticles%2FWhat_Do_Pigs_Eat_1800x.jpg%3Fv%3D1669818914&imgrefurl=https%3A%2F%2Fpedersonsfarms.com%2Fblogs%2Fblog%2Fwhat-do-pigs-eat%3Fsrsltid%3DAfmBOor5FHb7O98doXtx8BtY5yMw7p8u3quMcmXxR_eTw-lSqSxqesRj&docid=TSvfxjRZq1sM7M&tbnid=LyHMshtNVdusBM&vet=12ahUKEwi-ta6iptWUAxWms5UCHR2MANcQnPAOegQIGxAB..i&w=1800&h=1200&hcb=2&ved=2ahUKEwi-ta6iptWUAxWms5UCHR2MANcQnPAOegQIGxAB",  // porc dans un enclos
    "https://images.pexels.com/photos/11696695/pexels-photo-11696695.jpeg?w=800&h=600&fit=crop", // truie avec porcelets
    "https://images.pexels.com/photos/2916546/pexels-photo-2916546.jpeg?w=800&h=600&fit=crop",  // cochon rose
    "https://images.pexels.com/photos/2888283/pexels-photo-2888283.jpeg?w=800&h=600&fit=crop",  // porcs en liberté
    "https://images.pexels.com/photos/11696677/pexels-photo-11696677.jpeg?w=800&h=600&fit=crop", // élevage porcin
    "https://images.pexels.com/photos/2225763/pexels-photo-2225763.jpeg?w=800&h=600&fit=crop",  // porcelets
    "https://images.pexels.com/photos/2645102/pexels-photo-2645102.jpeg?w=800&h=600&fit=crop",  // cochons à la ferme
    "https://images.pexels.com/photos/1326777/pexels-photo-1326777.jpeg?w=800&h=600&fit=crop"   // porc dans la boue
  ],
  
  // GOATS - Images de chèvres (REALISTIC)
  goats: [
    "https://www.google.com/imgres?q=goats&imgurl=https%3A%2F%2Fmannapro.com%2Fcdn%2Fshop%2Farticles%2Fdairy-goats-1_2x_49a19023-b661-41ef-8796-8e044e5dfb46.jpg%3Fv%3D1740003408%26width%3D1200&imgrefurl=https%3A%2F%2Fmannapro.com%2Fblogs%2Fnews%2Fdairy-goat-breeds&docid=wLSFRHtJGNknYM&tbnid=FTWYQfM5nQLiTM&vet=12ahUKEwjSoMy9ptWUAxVUlZUCHWK6A5wQnPAOegQIFBAB..i&w=1200&h=901&hcb=2&ved=2ahUKEwjSoMy9ptWUAxVUlZUCHWK6A5wQnPAOegQIFBAB",  // chèvres blanches
    "https://www.google.com/imgres?q=sheep&imgurl=https%3A%2F%2Fmedia.4-paws.org%2F7%2F5%2F6%2F7%2F756746f95982a3d92017eed984b7adb4c5af5efb%2FVP0082009-1930x1336-1920x1329.jpg&imgrefurl=https%3A%2F%2Fwww.four-paws.org%2Fcampaigns-topics%2Ftopics%2Ffarm-animals%2F10-facts-about-sheep&docid=df9PNV9hbQEJqM&tbnid=yFBarTk-wVhrmM&vet=12ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB..i&w=1920&h=1329&hcb=2&ved=2ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB",  // troupeau de chèvres
    "https://images.pexels.com/photos/7850394/pexels-photo-7850394.jpeg?w=800&h=600&fit=crop",  // chèvre laitière
    "https://images.pexels.com/photos/6019570/pexels-photo-6019570.jpeg?w=800&h=600&fit=crop",  // chèvres broutant
    "https://images.pexels.com/photos/5679579/pexels-photo-5679579.jpeg?w=800&h=600&fit=crop",  // chevreau
    "https://images.pexels.com/photos/3352519/pexels-photo-3352519.jpeg?w=800&h=600&fit=crop",  // chèvre noire
    "https://images.pexels.com/photos/3352518/pexels-photo-3352518.jpeg?w=800&h=600&fit=crop",  // chèvre avec cornes
    "https://images.pexels.com/photos/2607546/pexels-photo-2607546.jpeg?w=800&h=600&fit=crop"   // chèvre sur rocher
  ],
  
  // SHEEP - Images de moutons (REALISTIC)
  sheep: [
    "https://www.google.com/imgres?q=sheep&imgurl=https%3A%2F%2Fmedia.4-paws.org%2F7%2F5%2F6%2F7%2F756746f95982a3d92017eed984b7adb4c5af5efb%2FVP0082009-1930x1336-1920x1329.jpg&imgrefurl=https%3A%2F%2Fwww.four-paws.org%2Fcampaigns-topics%2Ftopics%2Ffarm-animals%2F10-facts-about-sheep&docid=df9PNV9hbQEJqM&tbnid=yFBarTk-wVhrmM&vet=12ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB..i&w=1920&h=1329&hcb=2&ved=2ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB",  // moutons
    "https://images.pexels.com/photos/6019570/pexels-photo-6019570.jpeg?w=800&h=600&fit=crop",  // troupeau de moutons
    "https://images.pexels.com/photos/326245/pexels-photo-326245.jpeg?w=800&h=600&fit=crop",   // agneau
    "https://images.pexels.com/photos/386006/pexels-photo-386006.jpeg?w=800&h=600&fit=crop",   // moutons blancs
    "https://images.pexels.com/photos/442541/pexels-photo-442541.jpeg?w=800&h=600&fit=crop",   // moutons à la ferme
    "https://images.pexels.com/photos/167451/pexels-photo-167451.jpeg?w=800&h=600&fit=crop",   // bergerie
    "https://images.pexels.com/photos/577093/pexels-photo-577093.jpeg?w=800&h=600&fit=crop",   // moutons dans le pré
    "https://images.pexels.com/photos/3352509/pexels-photo-3352509.jpeg?w=800&h=600&fit=crop"   // moutons avec cloche
  ]
};

// Helper function to get image by index - assure des images différentes par propriété
const getImageForProperty = (category, index) => {
  const images = LIVESTOCK_IMAGES[category] || LIVESTOCK_IMAGES.poultry;
  return images[index % images.length];
};

// ==================== MOCK LIVESTOCK DATA ====================
export const MOCK_LIVESTOCK = [
  // ==================== AQUACULTURE (5) ====================
  {
    id: "mock_fish_1",
    _id: "mock_fish_1",
    title: "Modern Tilapia Tank Unit",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Obala", district: "Lékié", region: "Center" },
    price: { amount: 12500000, currency: "FCFA" },
    roi: 24,
    capacity: { value: 5000, unit: "fish" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "Modern tilapia farm with recirculating aquaculture system (RAS). Complete setup includes tanks, filters, and aeration system.",
    images: [getImageForProperty("aquaculture", 0), getImageForProperty("aquaculture", 1)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_2",
    _id: "mock_fish_2",
    title: "Intensive Clarias Unit",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Kribi", district: "Océan", region: "South" },
    price: { amount: 8000000, currency: "FCFA" },
    roi: 18,
    capacity: { value: 3000, unit: "fish" },
    cycleDuration: "5 months",
    status: "AVAILABLE",
    description: "Specialized catfish production unit with concrete ponds. High demand in local markets.",
    images: [getImageForProperty("aquaculture", 2), getImageForProperty("aquaculture", 3)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_fish_3",
    _id: "mock_fish_3",
    title: "Floating Cage System",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Lagdo", district: "Bénoué", region: "North" },
    price: { amount: 35000000, currency: "FCFA" },
    roi: 30,
    capacity: { value: 20000, unit: "fish" },
    cycleDuration: "7 months",
    status: "AVAILABLE",
    description: "Floating cage system on Lake Lagdo. Perfect for large-scale tilapia production.",
    images: [getImageForProperty("aquaculture", 4), getImageForProperty("aquaculture", 5)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_4",
    _id: "mock_fish_4",
    title: "Industrial Fish Hatchery",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Douala", district: "Bonabéri", region: "Littoral" },
    price: { amount: 55000000, currency: "FCFA" },
    roi: 28,
    capacity: { value: 1000000, unit: "fry" },
    cycleDuration: "3 months",
    status: "AVAILABLE",
    description: "Large-scale hatchery producing tilapia and catfish fingerlings.",
    images: [getImageForProperty("aquaculture", 6), getImageForProperty("aquaculture", 7)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_5",
    _id: "mock_fish_5",
    title: "Semi-Intensive Pond Farm",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Ebolowa", district: "Mvila", region: "South" },
    price: { amount: 15000000, currency: "FCFA" },
    roi: 20,
    capacity: { value: 8000, unit: "fish" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "Traditional pond system with 5 earthen ponds. Low maintenance operation.",
    images: [getImageForProperty("aquaculture", 1), getImageForProperty("aquaculture", 3)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: false, hasFeedStorage: false }
  },

  // ==================== POULTRY (5) ====================
  {
    id: "mock_poultry_1",
    _id: "mock_poultry_1",
    title: "Automated Layer Farm",
    category: "poultry",
    listingType: "sale",
    location: { city: "Mbankomo", district: "Mfoundi", region: "Center" },
    price: { amount: 25000000, currency: "FCFA" },
    roi: 35,
    capacity: { value: 5000, unit: "hens" },
    cycleDuration: "18 months",
    status: "AVAILABLE",
    description: "Fully automated layer farm with egg collection system. Produces 4,500 eggs daily.",
    images: [getImageForProperty("poultry", 0), getImageForProperty("poultry", 1)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_2",
    _id: "mock_poultry_2",
    title: "Broiler Production Unit",
    category: "poultry",
    listingType: "sale",
    location: { city: "Bafoussam", district: "Bali", region: "West" },
    price: { amount: 18500000, currency: "FCFA" },
    roi: 22,
    capacity: { value: 3000, unit: "birds" },
    cycleDuration: "45 days",
    status: "AVAILABLE",
    description: "Broiler farm with 3 houses. Quick turnaround with 5 cycles per year.",
    images: [getImageForProperty("poultry", 2), getImageForProperty("poultry", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_3",
    _id: "mock_poultry_3",
    title: "Certified Parent Stock Farm",
    category: "poultry",
    listingType: "sale",
    location: { city: "Sangmélima", district: "Dja-et-Lobo", region: "South" },
    price: { amount: 75000000, currency: "FCFA" },
    roi: 40,
    capacity: { value: 10000, unit: "birds" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Premium parent stock farm supplying day-old chicks to 50+ farms.",
    images: [getImageForProperty("poultry", 4), getImageForProperty("poultry", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_4",
    _id: "mock_poultry_4",
    title: "Local Chicken (Goliath) Unit",
    category: "poultry",
    listingType: "sale",
    location: { city: "Okola", district: "Lékié", region: "Center" },
    price: { amount: 5500000, currency: "FCFA" },
    roi: 15,
    capacity: { value: 500, unit: "birds" },
    cycleDuration: "90 days",
    status: "AVAILABLE",
    description: "Free-range local chicken farm. Premium prices for traditional poultry.",
    images: [getImageForProperty("poultry", 6), getImageForProperty("poultry", 7)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: false, hasFeedStorage: false }
  },
  {
    id: "mock_poultry_5",
    _id: "mock_poultry_5",
    title: "Quail Specialized Farm",
    category: "poultry",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Soa", region: "Center" },
    price: { amount: 10000000, currency: "FCFA" },
    roi: 19,
    capacity: { value: 2000, unit: "quails" },
    cycleDuration: "2 months",
    status: "AVAILABLE",
    description: "Specialized quail farm for eggs and meat. Niche market with high demand.",
    images: [getImageForProperty("poultry", 1), getImageForProperty("poultry", 4)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: false }
  },

  // ==================== CATTLE (5) ====================
  {
    id: "mock_cattle_1",
    _id: "mock_cattle_1",
    title: "Highland Meat Ranch",
    category: "cattle",
    listingType: "sale",
    location: { city: "Ngaoundéré", district: "Vina", region: "Adamawa" },
    price: { amount: 150000000, currency: "FCFA" },
    roi: 12,
    capacity: { value: 200, unit: "heads" },
    cycleDuration: "24 months",
    status: "AVAILABLE",
    description: "Extensive cattle ranch on 500 hectares. Gudali breed for premium beef.",
    images: [getImageForProperty("cattle", 0), getImageForProperty("cattle", 1)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_2",
    _id: "mock_cattle_2",
    title: "Dairy Production Center",
    category: "cattle",
    listingType: "sale",
    location: { city: "Bamenda", district: "Bali", region: "North-West" },
    price: { amount: 95000000, currency: "FCFA" },
    roi: 18,
    capacity: { value: 60, unit: "cows" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Dairy farm with 60 Frisian cows. Produces 800L milk daily. Includes milking parlor.",
    images: [getImageForProperty("cattle", 2), getImageForProperty("cattle", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_3",
    _id: "mock_cattle_3",
    title: "Fattening Feedlot Station",
    category: "cattle",
    listingType: "sale",
    location: { city: "Garoua", district: "Bénoué", region: "North" },
    price: { amount: 45000000, currency: "FCFA" },
    roi: 25,
    capacity: { value: 120, unit: "heads" },
    cycleDuration: "4 months",
    status: "AVAILABLE",
    description: "Intensive feedlot. Fattening 120 bulls per cycle. Quick returns.",
    images: [getImageForProperty("cattle", 4), getImageForProperty("cattle", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_4",
    _id: "mock_cattle_4",
    title: "Eco-Friendly Pasture Unit",
    category: "cattle",
    listingType: "sale",
    location: { city: "Foumban", district: "Noun", region: "West" },
    price: { amount: 60000000, currency: "FCFA" },
    roi: 14,
    capacity: { value: 80, unit: "heads" },
    cycleDuration: "20 months",
    status: "AVAILABLE",
    description: "Rotational grazing system. Organic beef production. Premium markets.",
    images: [getImageForProperty("cattle", 6), getImageForProperty("cattle", 7)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_5",
    _id: "mock_cattle_5",
    title: "Bovine Breeding Center",
    category: "cattle",
    listingType: "sale",
    location: { city: "Bertoua", district: "Lom-et-Djérem", region: "East" },
    price: { amount: 85000000, currency: "FCFA" },
    roi: 20,
    capacity: { value: 100, unit: "heads" },
    cycleDuration: "24 months",
    status: "AVAILABLE",
    description: "Specialized breeding center. Artificial insemination lab. Sells breeding stock.",
    images: [getImageForProperty("cattle", 3), getImageForProperty("cattle", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },

  // ==================== PIGS (5) - AVEC VRAIES IMAGES DE PORCS ====================
  {
    id: "mock_pig_1",
    _id: "mock_pig_1",
    title: "Modern Farrowing Unit",
    category: "pigs",
    listingType: "sale",
    location: { city: "Santchou", district: "Moungo", region: "West" },
    price: { amount: 35000000, currency: "FCFA" },
    roi: 28,
    capacity: { value: 80, unit: "sows" },
    cycleDuration: "5 months",
    status: "AVAILABLE",
    description: "Complete farrow-to-finish operation. 80 sows producing 1,600 piglets annually.",
    images: [getImageForProperty("pigs", 0), getImageForProperty("pigs", 1)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_2",
    _id: "mock_pig_2",
    title: "Industrial Pig Nursery",
    category: "pigs",
    listingType: "sale",
    location: { city: "Monatélé", district: "Lékié", region: "Center" },
    price: { amount: 22000000, currency: "FCFA" },
    roi: 22,
    capacity: { value: 500, unit: "piglets" },
    cycleDuration: "2 months",
    status: "AVAILABLE",
    description: "Specialized nursery unit. Takes weaners to grower stage. Climate controlled.",
    images: [getImageForProperty("pigs", 2), getImageForProperty("pigs", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_3",
    _id: "mock_pig_3",
    title: "Hybrid Breeding Stock Farm",
    category: "pigs",
    listingType: "sale",
    location: { city: "Dschang", district: "Ménoua", region: "West" },
    price: { amount: 50000000, currency: "FCFA" },
    roi: 30,
    capacity: { value: 60, unit: "sows" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "High-genetics breeding farm. Large White and Landrace breeds.",
    images: [getImageForProperty("pigs", 4), getImageForProperty("pigs", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_4",
    _id: "mock_pig_4",
    title: "Organic Free-Range Piggery",
    category: "pigs",
    listingType: "sale",
    location: { city: "Edéa", district: "Sanaga-Maritime", region: "Littoral" },
    price: { amount: 12000000, currency: "FCFA" },
    roi: 18,
    capacity: { value: 50, unit: "heads" },
    cycleDuration: "8 months",
    status: "AVAILABLE",
    description: "Pasture-raised pigs. Organic certification. Premium pork prices.",
    images: [getImageForProperty("pigs", 6), getImageForProperty("pigs", 7)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_pig_5",
    _id: "mock_pig_5",
    title: "High-BioSecurity Swine Unit",
    category: "pigs",
    listingType: "sale",
    location: { city: "Njombé", district: "Moungo", region: "Littoral" },
    price: { amount: 40000000, currency: "FCFA" },
    roi: 26,
    capacity: { value: 300, unit: "heads" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "Biosecure facility with shower-in system. Disease-free certified.",
    images: [getImageForProperty("pigs", 1), getImageForProperty("pigs", 4)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },

  // ==================== GOATS (3) ====================
  {
    id: "mock_goat_1",
    _id: "mock_goat_1",
    title: "Goat Breeding Center",
    category: "goats",
    listingType: "sale",
    location: { city: "Yagoua", district: "Mayo-Danay", region: "Far North" },
    price: { amount: 15000000, currency: "FCFA" },
    roi: 20.5,
    capacity: { value: 100, unit: "heads" },
    cycleDuration: "8 months",
    status: "AVAILABLE",
    description: "Goat breeding farm with 80 does + 20 bucks. Sahelian breed adapted to hot climate.",
    images: [getImageForProperty("goats", 0), getImageForProperty("goats", 1)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_goat_2",
    _id: "mock_goat_2",
    title: "Dairy Goat Operation",
    category: "goats",
    listingType: "sale",
    location: { city: "Buea", district: "Fako", region: "South-West" },
    price: { amount: 22000000, currency: "FCFA" },
    roi: 25.0,
    capacity: { value: 60, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Specialized dairy goat farm. 50 Saanen goats. Cheese and yogurt production unit included.",
    images: [getImageForProperty("goats", 2), getImageForProperty("goats", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_goat_3",
    _id: "mock_goat_3",
    title: "Premium Kirdi Goats",
    category: "goats",
    listingType: "sale",
    location: { city: "Mora", district: "Mayo-Sava", region: "Far North" },
    price: { amount: 18000000, currency: "FCFA" },
    roi: 27.0,
    capacity: { value: 80, unit: "heads" },
    cycleDuration: "7 months",
    status: "AVAILABLE",
    description: "Rare Kirdi goat breed known for premium meat quality. High demand in luxury restaurants.",
    images: [getImageForProperty("goats", 4), getImageForProperty("goats", 5)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },

  // ==================== SHEEP (2) ====================
  {
    id: "mock_sheep_1",
    _id: "mock_sheep_1",
    title: "Sheep Ranch - Mokolo",
    category: "sheep",
    listingType: "sale",
    location: { city: "Mokolo", district: "Mayo-Tsanaga", region: "Far North" },
    price: { amount: 25000000, currency: "FCFA" },
    roi: 18.0,
    capacity: { value: 150, unit: "heads" },
    cycleDuration: "10 months",
    status: "AVAILABLE",
    description: "Sheep ranch with 120 ewes + 30 rams. Fulani sheep breed prized for meat.",
    images: [getImageForProperty("sheep", 0), getImageForProperty("sheep", 1)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_sheep_2",
    _id: "mock_sheep_2",
    title: "Premium Tabaski Sheep",
    category: "sheep",
    listingType: "sale",
    location: { city: "Garoua", district: "Bénoué", region: "North" },
    price: { amount: 28000000, currency: "FCFA" },
    roi: 25.0,
    capacity: { value: 80, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Specialized farm for premium Tabaski sheep. High-quality breeding stock.",
    images: [getImageForProperty("sheep", 2), getImageForProperty("sheep", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  }
];

// ==================== EXPORTED HELPER FUNCTIONS ====================
export const getMockLivestockByCategory = (category) => {
  return MOCK_LIVESTOCK.filter(item => item.category === category);
};

export const getMockLivestockById = (id) => {
  return MOCK_LIVESTOCK.find(item => item.id === id || item._id === id);
};

export const getAllMockLivestock = () => {
  return MOCK_LIVESTOCK;
};

export const getMockLivestockStats = () => {
  const totalAssets = MOCK_LIVESTOCK.length;
  const avgROI = MOCK_LIVESTOCK.reduce((sum, item) => sum + item.roi, 0) / totalAssets;
  const totalValue = MOCK_LIVESTOCK.reduce((sum, item) => sum + item.price.amount, 0);
  
  const byCategory = {};
  MOCK_LIVESTOCK.forEach(item => {
    if (!byCategory[item.category]) {
      byCategory[item.category] = { count: 0, totalValue: 0, totalROI: 0 };
    }
    byCategory[item.category].count++;
    byCategory[item.category].totalValue += item.price.amount;
    byCategory[item.category].totalROI += item.roi;
  });
  
  Object.keys(byCategory).forEach(cat => {
    byCategory[cat].avgROI = byCategory[cat].totalROI / byCategory[cat].count;
  });
  
  return { totalAssets, avgROI, totalValue, byCategory };
};

export const LIVESTOCK_CATEGORIES = {
  aquaculture: {
    title: "Aquaculture Systems",
    description: "Units specialized in Tilapia and Catfish production using recirculating systems.",
    marketDemand: "85%",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  poultry: {
    title: "Poultry Production",
    description: "High-yield broiler houses and layer units with automated feeding.",
    marketDemand: "92%",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  cattle: {
    title: "Cattle & Ranches",
    description: "Extensive and intensive ranching assets for dairy and beef.",
    marketDemand: "78%",
    color: "text-amber-700",
    bg: "bg-amber-700/10"
  },
  pigs: {
    title: "Swine Farming",
    description: "Modern pig production units with high bio-security standards.",
    marketDemand: "88%",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10"
  },
  goats: {
    title: "Goat Farming",
    description: "Dairy and meat goat operations with growing market demand.",
    marketDemand: "75%",
    color: "text-teal-600",
    bg: "bg-teal-600/10"
  },
  sheep: {
    title: "Sheep Ranching",
    description: "Premium meat sheep for festive season markets.",
    marketDemand: "82%",
    color: "text-indigo-600",
    bg: "bg-indigo-600/10"
  }
};

export default MOCK_LIVESTOCK;