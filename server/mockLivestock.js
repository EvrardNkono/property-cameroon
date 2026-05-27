// frontend/src/data/mockLivestock.js

// ==================== BANQUE D'IMAGES UNIQUES PAR CATÉGORIE ====================
const LIVESTOCK_IMAGES = {
  // POULTRY - Images variées de poulets, fermes avicoles
  poultry: [
    "https://images.pexels.com/photos/6173180/pexels-photo-6173180.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/5863312/pexels-photo-5863312.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/4057700/pexels-photo-4057700.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/5328689/pexels-photo-5328689.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/6107764/pexels-photo-6107764.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/3997754/pexels-photo-3997754.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/6347935/pexels-photo-6347935.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/6547416/pexels-photo-6547416.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/4016627/pexels-photo-4016627.jpeg?w=800&h=600&fit=crop"
  ],
  
  // AQUACULTURE - Images de poissons, bassins, pisciculture
  aquaculture: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMy9DPFRrEMile9CD20hbyiduP05mlCLkoAQ&s",
    "https://images.pexels.com/photos/5784061/pexels-photo-5784061.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/5688661/pexels-photo-5688661.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/209848/pexels-photo-209848.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/4167523/pexels-photo-4167523.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/235731/pexels-photo-235731.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/4600795/pexels-photo-4600795.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/4578822/pexels-photo-4578822.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/626491/pexels-photo-626491.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/300046/pexels-photo-300046.jpeg?w=800&h=600&fit=crop"
  ],
  
  // CATTLE - Images de vaches, élevage bovin
  cattle: [
    "https://en.wikipedia.org/wiki/Cattle",
    "https://images.pexels.com/photos/2456451/pexels-photo-2456451.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2525870/pexels-photo-2525870.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/3576796/pexels-photo-3576796.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2888140/pexels-photo-2888140.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2828029/pexels-photo-2828029.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/167464/pexels-photo-167464.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/1434905/pexels-photo-1434905.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/700881/pexels-photo-700881.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/239777/pexels-photo-239777.jpeg?w=800&h=600&fit=crop"
  ],
  
  // PIGS - Images de porcs, élevage porcin
  pigs: [
    "https://www.google.com/imgres?q=Pigs&imgurl=https%3A%2F%2Fpedersonsfarms.com%2Fcdn%2Fshop%2Farticles%2FWhat_Do_Pigs_Eat_1800x.jpg%3Fv%3D1669818914&imgrefurl=https%3A%2F%2Fpedersonsfarms.com%2Fblogs%2Fblog%2Fwhat-do-pigs-eat%3Fsrsltid%3DAfmBOor5FHb7O98doXtx8BtY5yMw7p8u3quMcmXxR_eTw-lSqSxqesRj&docid=TSvfxjRZq1sM7M&tbnid=LyHMshtNVdusBM&vet=12ahUKEwi-ta6iptWUAxWms5UCHR2MANcQnPAOegQIGxAB..i&w=1800&h=1200&hcb=2&ved=2ahUKEwi-ta6iptWUAxWms5UCHR2MANcQnPAOegQIGxAB",
    "https://images.pexels.com/photos/11696695/pexels-photo-11696695.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2916546/pexels-photo-2916546.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2888283/pexels-photo-2888283.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/11696677/pexels-photo-11696677.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2225763/pexels-photo-2225763.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2645102/pexels-photo-2645102.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/1326777/pexels-photo-1326777.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/220604/pexels-photo-220604.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/5328668/pexels-photo-5328668.jpeg?w=800&h=600&fit=crop"
  ],
  
  // GOATS - Images de chèvres
  goats: [
    "https://www.google.com/imgres?q=goats&imgurl=https%3A%2F%2Fmannapro.com%2Fcdn%2Fshop%2Farticles%2Fdairy-goats-1_2x_49a19023-b661-41ef-8796-8e044e5dfb46.jpg%3Fv%3D1740003408%26width%3D1200&imgrefurl=https%3A%2F%2Fmannapro.com%2Fblogs%2Fnews%2Fdairy-goat-breeds&docid=wLSFRHtJGNknYM&tbnid=FTWYQfM5nQLiTM&vet=12ahUKEwjSoMy9ptWUAxVUlZUCHWK6A5wQnPAOegQIFBAB..i&w=1200&h=901&hcb=2&ved=2ahUKEwjSoMy9ptWUAxVUlZUCHWK6A5wQnPAOegQIFBAB",
    "https://www.google.com/imgres?q=sheep&imgurl=https%3A%2F%2Fmedia.4-paws.org%2F7%2F5%2F6%2F7%2F756746f95982a3d92017eed984b7adb4c5af5efb%2FVP0082009-1930x1336-1920x1329.jpg&imgrefurl=https%3A%2F%2Fwww.four-paws.org%2Fcampaigns-topics%2Ftopics%2Ffarm-animals%2F10-facts-about-sheep&docid=df9PNV9hbQEJqM&tbnid=yFBarTk-wVhrmM&vet=12ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB..i&w=1920&h=1329&hcb=2&ved=2ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB",
    "https://images.pexels.com/photos/7850394/pexels-photo-7850394.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/6019570/pexels-photo-6019570.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/5679579/pexels-photo-5679579.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/3352519/pexels-photo-3352519.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/3352518/pexels-photo-3352518.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/2607546/pexels-photo-2607546.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/861169/pexels-photo-861169.jpeg?w=800&h=600&fit=crop"
  ],
  
  // SHEEP - Images de moutons
  sheep: [
    "https://www.google.com/imgres?q=sheep&imgurl=https%3A%2F%2Fmedia.4-paws.org%2F7%2F5%2F6%2F7%2F756746f95982a3d92017eed984b7adb4c5af5efb%2FVP0082009-1930x1336-1920x1329.jpg&imgrefurl=https%3A%2F%2Fwww.four-paws.org%2Fcampaigns-topics%2Ftopics%2Ffarm-animals%2F10-facts-about-sheep&docid=df9PNV9hbQEJqM&tbnid=yFBarTk-wVhrmM&vet=12ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB..i&w=1920&h=1329&hcb=2&ved=2ahUKEwjd-4jOptWUAxUrppUCHbLTDXcQnPAOegQIFxAB",
    "https://images.pexels.com/photos/6019570/pexels-photo-6019570.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/326245/pexels-photo-326245.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/386006/pexels-photo-386006.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/442541/pexels-photo-442541.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/167451/pexels-photo-167451.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/577093/pexels-photo-577093.jpeg?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/3352509/pexels-photo-3352509.jpeg?w=800&h=600&fit=crop"
  ]
};

// Fonction pour prendre une image différente par index
const getImageForProperty = (category, index) => {
  const images = LIVESTOCK_IMAGES[category] || LIVESTOCK_IMAGES.poultry;
  return images[index % images.length];
};

// ==================== MOCK DATA COMPLÈTE ====================
export const MOCK_LIVESTOCK = [
  // ==================== POULTRY (10 propriétés) ====================
  {
    id: "mock_poultry_1",
    title: "Modern Broiler Farm - Mvog Mbi",
    category: "poultry",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Mvog Mbi", region: "Center" },
    price: { amount: 25000000, currency: "FCFA" },
    roi: 18.5,
    capacity: { value: 5000, unit: "birds" },
    cycleDuration: "45 days",
    status: "AVAILABLE",
    description: "Modern poultry farm with 5 climate-controlled henhouses. Automated feeding system, temperature control, and training included. Produces 5,000 broilers per cycle.",
    images: [getImageForProperty("poultry", 0), getImageForProperty("poultry", 1)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_2",
    title: "Layer Egg Production - Makepe",
    category: "poultry",
    listingType: "sale",
    location: { city: "Douala", district: "Makepe", region: "Littoral" },
    price: { amount: 18500000, currency: "FCFA" },
    roi: 22.3,
    capacity: { value: 3000, unit: "hens" },
    cycleDuration: "18 months",
    status: "AVAILABLE",
    description: "Certified organic layer farm producing 2,800+ eggs daily. Contracts with major supermarkets included.",
    images: [getImageForProperty("poultry", 2), getImageForProperty("poultry", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_3",
    title: "Premium Broiler Facility - Bastos",
    category: "poultry",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Bastos", region: "Center" },
    price: { amount: 42000000, currency: "FCFA" },
    roi: 25.0,
    capacity: { value: 10000, unit: "birds" },
    cycleDuration: "42 days",
    status: "AVAILABLE",
    description: "Premium poultry farm with Israeli technology. Blockchain traceability, export-ready.",
    images: [getImageForProperty("poultry", 4), getImageForProperty("poultry", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_4",
    title: "Dual-Purpose Farm - Bafoussam",
    category: "poultry",
    listingType: "sale",
    location: { city: "Bafoussam", district: "Bali", region: "West" },
    price: { amount: 32000000, currency: "FCFA" },
    roi: 20.8,
    capacity: { value: 3500, unit: "birds" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Dual-purpose farm for both meat and eggs. Diversified income streams.",
    images: [getImageForProperty("poultry", 6), getImageForProperty("poultry", 7)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_5",
    title: "Hatchery Center - Nkolbisson",
    category: "poultry",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Nkolbisson", region: "Center" },
    price: { amount: 75000000, currency: "FCFA" },
    roi: 30.0,
    capacity: { value: 25000, unit: "eggs" },
    cycleDuration: "21 days",
    status: "AVAILABLE",
    description: "Specialized hatchery supplying day-old chicks to 50+ farms.",
    images: [getImageForProperty("poultry", 8), getImageForProperty("poultry", 9)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_6",
    title: "Free-Range Poultry - Dschang",
    category: "poultry",
    listingType: "sale",
    location: { city: "Dschang", district: "Fongo-Tongo", region: "West" },
    price: { amount: 15000000, currency: "FCFA" },
    roi: 28.5,
    capacity: { value: 2000, unit: "birds" },
    cycleDuration: "90 days",
    status: "AVAILABLE",
    description: "Free-range poultry farm. Premium quality meat for high-end restaurants.",
    images: [getImageForProperty("poultry", 1), getImageForProperty("poultry", 4)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_poultry_7",
    title: "Broiler Integration - Bonabéri",
    category: "poultry",
    listingType: "sale",
    location: { city: "Douala", district: "Bonabéri", region: "Littoral" },
    price: { amount: 55000000, currency: "FCFA" },
    roi: 32.0,
    capacity: { value: 15000, unit: "birds" },
    cycleDuration: "48 days",
    status: "AVAILABLE",
    description: "Large-scale integration with feed mill and slaughterhouse access.",
    images: [getImageForProperty("poultry", 5), getImageForProperty("poultry", 0)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_8",
    title: "Organic Chicken Farm - Ebolowa",
    category: "poultry",
    listingType: "sale",
    location: { city: "Ebolowa", district: "Mvila", region: "South" },
    price: { amount: 28000000, currency: "FCFA" },
    roi: 24.0,
    capacity: { value: 4000, unit: "birds" },
    cycleDuration: "60 days",
    status: "AVAILABLE",
    description: "100% organic chicken farming. Certified organic feed and free-range system.",
    images: [getImageForProperty("poultry", 2), getImageForProperty("poultry", 6)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_poultry_9",
    title: "Small Poultry Unit - Kribi",
    category: "poultry",
    listingType: "sale",
    location: { city: "Kribi", district: "Océan", region: "South" },
    price: { amount: 8000000, currency: "FCFA" },
    roi: 35.0,
    capacity: { value: 800, unit: "birds" },
    cycleDuration: "45 days",
    status: "AVAILABLE",
    description: "Entry-level poultry farm. Perfect for beginners with full training.",
    images: [getImageForProperty("poultry", 7), getImageForProperty("poultry", 3)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: false, hasFeedStorage: false }
  },
  {
    id: "mock_poultry_10",
    title: "Turkey Farm - Foumban",
    category: "poultry",
    listingType: "sale",
    location: { city: "Foumban", district: "Noun", region: "West" },
    price: { amount: 22000000, currency: "FCFA" },
    roi: 26.5,
    capacity: { value: 1000, unit: "turkeys" },
    cycleDuration: "120 days",
    status: "AVAILABLE",
    description: "Specialized turkey farm for holiday season demand. High margins.",
    images: [getImageForProperty("poultry", 9), getImageForProperty("poultry", 8)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },

  // ==================== AQUACULTURE (8 propriétés) ====================
  {
    id: "mock_fish_1",
    title: "Tilapia Farm - Mvan",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Yaoundé", district: "Mvan", region: "Center" },
    price: { amount: 15000000, currency: "FCFA" },
    roi: 28.7,
    capacity: { value: 10000, unit: "fish" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "Modern tilapia farm with 6 concrete ponds. Solar pumping system included.",
    images: [getImageForProperty("aquaculture", 0), getImageForProperty("aquaculture", 1)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_2",
    title: "Catfish Production - Edéa",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Edéa", district: "Sanaga-Maritime", region: "Littoral" },
    price: { amount: 38000000, currency: "FCFA" },
    roi: 32.1,
    capacity: { value: 50000, unit: "fish" },
    cycleDuration: "7 months",
    status: "AVAILABLE",
    description: "Large-scale catfish farm on 5 hectares. 20 ponds, hatchery.",
    images: [getImageForProperty("aquaculture", 2), getImageForProperty("aquaculture", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_3",
    title: "Tilapia Hatchery - Foumban",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Foumban", district: "Noun", region: "West" },
    price: { amount: 22000000, currency: "FCFA" },
    roi: 26.5,
    capacity: { value: 500000, unit: "fry" },
    cycleDuration: "3 months",
    status: "AVAILABLE",
    description: "Tilapia hatchery producing 500,000 fry per cycle. Supplies 30+ farms.",
    images: [getImageForProperty("aquaculture", 4), getImageForProperty("aquaculture", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_4",
    title: "Cage Fish Farm - Lake Lagdo",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Lagdo", district: "Bénoué", region: "North" },
    price: { amount: 55000000, currency: "FCFA" },
    roi: 35.0,
    capacity: { value: 100000, unit: "fish" },
    cycleDuration: "8 months",
    status: "AVAILABLE",
    description: "Unique cage fish farm on Lake Lagdo. 20 floating cages.",
    images: [getImageForProperty("aquaculture", 5), getImageForProperty("aquaculture", 6)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_5",
    title: "Ornamental Fish - Limbe",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Limbe", district: "Down Beach", region: "South-West" },
    price: { amount: 18000000, currency: "FCFA" },
    roi: 42.0,
    capacity: { value: 5000, unit: "aquariums" },
    cycleDuration: "4 months",
    status: "AVAILABLE",
    description: "Ornamental fish farm with 50+ tropical species.",
    images: [getImageForProperty("aquaculture", 6), getImageForProperty("aquaculture", 7)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_fish_6",
    title: "Integrated Aquaponics - Buea",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Buea", district: "Fako", region: "South-West" },
    price: { amount: 45000000, currency: "FCFA" },
    roi: 38.0,
    capacity: { value: 20000, unit: "fish" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "Aquaponics system combining fish and vegetable production.",
    images: [getImageForProperty("aquaculture", 8), getImageForProperty("aquaculture", 9)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_7",
    title: "Shrimp Farm - Kribi",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Kribi", district: "Océan", region: "South" },
    price: { amount: 65000000, currency: "FCFA" },
    roi: 45.0,
    capacity: { value: 50000, unit: "shrimps" },
    cycleDuration: "5 months",
    status: "AVAILABLE",
    description: "Shrimp farming with export potential to Europe.",
    images: [getImageForProperty("aquaculture", 1), getImageForProperty("aquaculture", 4)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_fish_8",
    title: "Small Fish Farm - Bertoua",
    category: "aquaculture",
    listingType: "sale",
    location: { city: "Bertoua", district: "Lom-et-Djérem", region: "East" },
    price: { amount: 9500000, currency: "FCFA" },
    roi: 25.0,
    capacity: { value: 5000, unit: "fish" },
    cycleDuration: "7 months",
    status: "AVAILABLE",
    description: "Small-scale fish farm. Perfect for beginners.",
    images: [getImageForProperty("aquaculture", 3), getImageForProperty("aquaculture", 0)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: false, hasFeedStorage: false }
  },

  // ==================== CATTLE (8 propriétés) ====================
  {
    id: "mock_cattle_1",
    title: "Dairy Farm - Bamenda",
    category: "cattle",
    listingType: "sale",
    location: { city: "Bamenda", district: "Bali", region: "North-West" },
    price: { amount: 65000000, currency: "FCFA" },
    roi: 16.2,
    capacity: { value: 50, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Grade A dairy farm with 50 cows producing 800L milk daily.",
    images: [getImageForProperty("cattle", 0), getImageForProperty("cattle", 1)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_2",
    title: "Beef Ranch - Ngaoundéré",
    category: "cattle",
    listingType: "sale",
    location: { city: "Ngaoundéré", district: "Vina", region: "Adamawa" },
    price: { amount: 120000000, currency: "FCFA" },
    roi: 14.5,
    capacity: { value: 200, unit: "heads" },
    cycleDuration: "18 months",
    status: "AVAILABLE",
    description: "Large beef cattle ranch on 500 hectares.",
    images: [getImageForProperty("cattle", 2), getImageForProperty("cattle", 3)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_3",
    title: "Feedlot Operation - Maroua",
    category: "cattle",
    listingType: "sale",
    location: { city: "Maroua", district: "Diamaré", region: "Far North" },
    price: { amount: 45000000, currency: "FCFA" },
    roi: 22.8,
    capacity: { value: 100, unit: "heads" },
    cycleDuration: "4 months",
    status: "AVAILABLE",
    description: "Intensive feedlot operation. Fattening 100 bulls per cycle.",
    images: [getImageForProperty("cattle", 3), getImageForProperty("cattle", 4)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_4",
    title: "Mixed Dairy-Beef - Dschang",
    category: "cattle",
    listingType: "sale",
    location: { city: "Dschang", district: "Ménoua", region: "West" },
    price: { amount: 38000000, currency: "FCFA" },
    roi: 18.0,
    capacity: { value: 30, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Mixed operation with 20 dairy cows + 10 beef cattle.",
    images: [getImageForProperty("cattle", 4), getImageForProperty("cattle", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_5",
    title: "Breeding Center - Garoua",
    category: "cattle",
    listingType: "sale",
    location: { city: "Garoua", district: "Bénoué", region: "North" },
    price: { amount: 95000000, currency: "FCFA" },
    roi: 19.5,
    capacity: { value: 80, unit: "heads" },
    cycleDuration: "24 months",
    status: "AVAILABLE",
    description: "Specialized cattle breeding center. Purebred Gudali and Red Bororo.",
    images: [getImageForProperty("cattle", 5), getImageForProperty("cattle", 6)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_cattle_6",
    title: "Small Dairy - Mbouda",
    category: "cattle",
    listingType: "sale",
    location: { city: "Mbouda", district: "Bamboutos", region: "West" },
    price: { amount: 25000000, currency: "FCFA" },
    roi: 20.0,
    capacity: { value: 20, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Small family dairy farm. Perfect starter operation.",
    images: [getImageForProperty("cattle", 6), getImageForProperty("cattle", 7)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_cattle_7",
    title: "Organic Beef - Yokadouma",
    category: "cattle",
    listingType: "sale",
    location: { city: "Yokadouma", district: "Boumba-et-Ngoko", region: "East" },
    price: { amount: 50000000, currency: "FCFA" },
    roi: 17.5,
    capacity: { value: 120, unit: "heads" },
    cycleDuration: "20 months",
    status: "AVAILABLE",
    description: "Organic grass-fed beef operation.",
    images: [getImageForProperty("cattle", 7), getImageForProperty("cattle", 8)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_cattle_8",
    title: "Cattle Fattening - Kumba",
    category: "cattle",
    listingType: "sale",
    location: { city: "Kumba", district: "Meme", region: "South-West" },
    price: { amount: 35000000, currency: "FCFA" },
    roi: 24.0,
    capacity: { value: 60, unit: "heads" },
    cycleDuration: "5 months",
    status: "AVAILABLE",
    description: "Short-cycle fattening operation. Quick returns.",
    images: [getImageForProperty("cattle", 8), getImageForProperty("cattle", 9)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },

  // ==================== PIGS (8 propriétés) ====================
  {
    id: "mock_pig_1",
    title: "Modern Pig Farm - Bafoussam",
    category: "pigs",
    listingType: "sale",
    location: { city: "Bafoussam", district: "Bali", region: "West" },
    price: { amount: 28000000, currency: "FCFA" },
    roi: 24.5,
    capacity: { value: 200, unit: "heads" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "Modern pig farm with 50 sows. Complete farrow to finish operation.",
    images: [getImageForProperty("pigs", 0), getImageForProperty("pigs", 1)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_2",
    title: "Piglet Production - Mbalmayo",
    category: "pigs",
    listingType: "sale",
    location: { city: "Mbalmayo", district: "Nyong-et-So'o", region: "Center" },
    price: { amount: 18000000, currency: "FCFA" },
    roi: 28.0,
    capacity: { value: 30, unit: "sows" },
    cycleDuration: "5 months",
    status: "AVAILABLE",
    description: "Specialized piglet production. 30 sows producing 600 piglets annually.",
    images: [getImageForProperty("pigs", 2), getImageForProperty("pigs", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_3",
    title: "Organic Free-Range - Kribi",
    category: "pigs",
    listingType: "sale",
    location: { city: "Kribi", district: "Océan", region: "South" },
    price: { amount: 35000000, currency: "FCFA" },
    roi: 31.5,
    capacity: { value: 150, unit: "heads" },
    cycleDuration: "8 months",
    status: "AVAILABLE",
    description: "Organic free-range pig farm on 20 hectares.",
    images: [getImageForProperty("pigs", 3), getImageForProperty("pigs", 4)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_4",
    title: "Breeding & Fattening - Nkongsamba",
    category: "pigs",
    listingType: "sale",
    location: { city: "Nkongsamba", district: "Moungo", region: "Littoral" },
    price: { amount: 42000000, currency: "FCFA" },
    roi: 26.0,
    capacity: { value: 300, unit: "heads" },
    cycleDuration: "7 months",
    status: "AVAILABLE",
    description: "Large integrated pig operation with biogas system.",
    images: [getImageForProperty("pigs", 4), getImageForProperty("pigs", 5)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_5",
    title: "Small Pig Farm - Ebolowa",
    category: "pigs",
    listingType: "sale",
    location: { city: "Ebolowa", district: "Mvila", region: "South" },
    price: { amount: 12000000, currency: "FCFA" },
    roi: 22.0,
    capacity: { value: 50, unit: "heads" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "Entry-level pig farm. Perfect for beginners.",
    images: [getImageForProperty("pigs", 5), getImageForProperty("pigs", 6)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_pig_6",
    title: "Pork Processing Unit - Douala",
    category: "pigs",
    listingType: "sale",
    location: { city: "Douala", district: "Bonabéri", region: "Littoral" },
    price: { amount: 60000000, currency: "FCFA" },
    roi: 35.0,
    capacity: { value: 1000, unit: "heads/month" },
    cycleDuration: "Monthly",
    status: "AVAILABLE",
    description: "Pig farm with integrated slaughterhouse and processing.",
    images: [getImageForProperty("pigs", 6), getImageForProperty("pigs", 7)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_7",
    title: "Breeding Stock - Bafang",
    category: "pigs",
    listingType: "sale",
    location: { city: "Bafang", district: "Haut-Nkam", region: "West" },
    price: { amount: 25000000, currency: "FCFA" },
    roi: 27.0,
    capacity: { value: 40, unit: "sows" },
    cycleDuration: "6 months",
    status: "AVAILABLE",
    description: "High-genetics breeding stock. Purebred Large White.",
    images: [getImageForProperty("pigs", 7), getImageForProperty("pigs", 8)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_pig_8",
    title: "Fattening Farm - Mbanga",
    category: "pigs",
    listingType: "sale",
    location: { city: "Mbanga", district: "Moungo", region: "Littoral" },
    price: { amount: 22000000, currency: "FCFA" },
    roi: 29.0,
    capacity: { value: 120, unit: "heads" },
    cycleDuration: "5 months",
    status: "AVAILABLE",
    description: "Fast-turnaround fattening operation.",
    images: [getImageForProperty("pigs", 8), getImageForProperty("pigs", 9)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },

  // ==================== GOATS (6 propriétés) ====================
  {
    id: "mock_goat_1",
    title: "Goat Breeding - Yagoua",
    category: "goats",
    listingType: "sale",
    location: { city: "Yagoua", district: "Mayo-Danay", region: "Far North" },
    price: { amount: 15000000, currency: "FCFA" },
    roi: 20.5,
    capacity: { value: 100, unit: "heads" },
    cycleDuration: "8 months",
    status: "AVAILABLE",
    description: "Goat breeding farm with 80 does + 20 bucks. Sahelian breed.",
    images: [getImageForProperty("goats", 0), getImageForProperty("goats", 1)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_goat_2",
    title: "Dairy Goat Farm - Buea",
    category: "goats",
    listingType: "sale",
    location: { city: "Buea", district: "Fako", region: "South-West" },
    price: { amount: 22000000, currency: "FCFA" },
    roi: 25.0,
    capacity: { value: 60, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Specialized dairy goat farm. Cheese and yogurt production.",
    images: [getImageForProperty("goats", 2), getImageForProperty("goats", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_goat_3",
    title: "Premium Kirdi Goats - Mora",
    category: "goats",
    listingType: "sale",
    location: { city: "Mora", district: "Mayo-Sava", region: "Far North" },
    price: { amount: 18000000, currency: "FCFA" },
    roi: 27.0,
    capacity: { value: 80, unit: "heads" },
    cycleDuration: "7 months",
    status: "AVAILABLE",
    description: "Rare Kirdi goat breed known for premium meat quality.",
    images: [getImageForProperty("goats", 3), getImageForProperty("goats", 4)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_goat_4",
    title: "Mixed Goats - Bertoua",
    category: "goats",
    listingType: "sale",
    location: { city: "Bertoua", district: "Lom-et-Djérem", region: "East" },
    price: { amount: 12000000, currency: "FCFA" },
    roi: 23.0,
    capacity: { value: 70, unit: "heads" },
    cycleDuration: "9 months",
    status: "AVAILABLE",
    description: "Mixed goat herd for meat and breeding.",
    images: [getImageForProperty("goats", 4), getImageForProperty("goats", 5)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  {
    id: "mock_goat_5",
    title: "Boer Goat Farm - Sangmélima",
    category: "goats",
    listingType: "sale",
    location: { city: "Sangmélima", district: "Dja-et-Lobo", region: "South" },
    price: { amount: 30000000, currency: "FCFA" },
    roi: 30.0,
    capacity: { value: 120, unit: "heads" },
    cycleDuration: "10 months",
    status: "AVAILABLE",
    description: "Purebred Boer goats for meat production.",
    images: [getImageForProperty("goats", 5), getImageForProperty("goats", 6)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_goat_6",
    title: "Small Goat Herd - Batouri",
    category: "goats",
    listingType: "sale",
    location: { city: "Batouri", district: "Kadey", region: "East" },
    price: { amount: 8000000, currency: "FCFA" },
    roi: 18.0,
    capacity: { value: 30, unit: "heads" },
    cycleDuration: "8 months",
    status: "AVAILABLE",
    description: "Perfect starter goat farm for beginners.",
    images: [getImageForProperty("goats", 7), getImageForProperty("goats", 8)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: false, hasFeedStorage: false }
  },

  // ==================== SHEEP (4 propriétés) ====================
  {
    id: "mock_sheep_1",
    title: "Sheep Ranch - Mokolo",
    category: "sheep",
    listingType: "sale",
    location: { city: "Mokolo", district: "Mayo-Tsanaga", region: "Far North" },
    price: { amount: 25000000, currency: "FCFA" },
    roi: 18.0,
    capacity: { value: 150, unit: "heads" },
    cycleDuration: "10 months",
    status: "AVAILABLE",
    description: "Sheep ranch with 120 ewes + 30 rams. Fulani sheep breed.",
    images: [getImageForProperty("sheep", 0), getImageForProperty("sheep", 1)],
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_sheep_2",
    title: "Mixed Sheep-Goats - Bertoua",
    category: "sheep",
    listingType: "sale",
    location: { city: "Bertoua", district: "Lom-et-Djérem", region: "East" },
    price: { amount: 32000000, currency: "FCFA" },
    roi: 21.0,
    capacity: { value: 200, unit: "heads" },
    cycleDuration: "9 months",
    status: "AVAILABLE",
    description: "Mixed small ruminant farm. 120 goats + 80 sheep.",
    images: [getImageForProperty("sheep", 1), getImageForProperty("sheep", 2)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_sheep_3",
    title: "Breeding Sheep - Ngaoundéré",
    category: "sheep",
    listingType: "sale",
    location: { city: "Ngaoundéré", district: "Vina", region: "Adamawa" },
    price: { amount: 40000000, currency: "FCFA" },
    roi: 22.0,
    capacity: { value: 100, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Purebred sheep breeding operation.",
    images: [getImageForProperty("sheep", 2), getImageForProperty("sheep", 3)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  {
    id: "mock_sheep_4",
    title: "Tabaski Sheep - Garoua",
    category: "sheep",
    listingType: "sale",
    location: { city: "Garoua", district: "Bénoué", region: "North" },
    price: { amount: 28000000, currency: "FCFA" },
    roi: 25.0,
    capacity: { value: 80, unit: "heads" },
    cycleDuration: "12 months",
    status: "AVAILABLE",
    description: "Specialized farm for premium Tabaski sheep.",
    images: [getImageForProperty("sheep", 3), getImageForProperty("sheep", 4)],
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  }
];

// ==================== STATISTIQUES ====================
export const getMockLivestockStats = () => {
  const categories = {};
  MOCK_LIVESTOCK.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = { count: 0, totalValue: 0, totalROI: 0 };
    }
    categories[item.category].count++;
    categories[item.category].totalValue += item.price.amount;
    categories[item.category].totalROI += item.roi;
  });
  
  // Calculer les moyennes
  Object.keys(categories).forEach(cat => {
    categories[cat].avgROI = categories[cat].totalROI / categories[cat].count;
  });
  
  return {
    totalAssets: MOCK_LIVESTOCK.length,
    avgROI: MOCK_LIVESTOCK.reduce((sum, item) => sum + item.roi, 0) / MOCK_LIVESTOCK.length,
    totalValue: MOCK_LIVESTOCK.reduce((sum, item) => sum + item.price.amount, 0),
    byCategory: categories
  };
};

// ==================== HELPERS ====================
export const getMockLivestockByCategory = (category) => {
  return MOCK_LIVESTOCK.filter(item => item.category === category);
};

export const getMockLivestockById = (id) => {
  return MOCK_LIVESTOCK.find(item => item.id === id);
};

export default MOCK_LIVESTOCK;