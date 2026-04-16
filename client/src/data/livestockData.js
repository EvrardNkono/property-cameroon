// src/data/livestockData.js

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
  }
};

export const LIVESTOCK_ASSETS = [
  // --- AQUACULTURE (5) ---
  {
    id: 101,
    category: "aquaculture",
    title: "Modern Tilapia Tank Unit",
    location: "Obala",
    price: "12,500,000",
    roi: "24%",
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800"
  },
  {
    id: 102,
    category: "aquaculture",
    title: "Intensive Clarias Unit",
    location: "Kribi",
    price: "8,000,000",
    roi: "18%",
    image: "https://images.unsplash.com/photo-1559440666-372f93169095?q=80&w=800"
  },
  {
    id: 103,
    category: "aquaculture",
    title: "Floating Cage System",
    location: "Lagdo",
    price: "35,000,000",
    roi: "30%",
    image: "https://images.unsplash.com/photo-1516132006923-6cf348e5dee2?q=80&w=800"
  },
  {
    id: 104,
    category: "aquaculture",
    title: "Industrial Fish Hatchery",
    location: "Douala",
    price: "55,000,000",
    roi: "28%",
    image: "https://images.unsplash.com/photo-1504109586055-751be16fe9e3?q=80&w=800"
  },
  {
    id: 105,
    category: "aquaculture",
    title: "Semi-Intensive Pond Farm",
    location: "Ebolowa",
    price: "15,000,000",
    roi: "20%",
    image: "https://images.unsplash.com/photo-1529604123893-601933098363?q=80&w=800"
  },

  // --- POULTRY (5) ---
  {
    id: 201,
    category: "poultry",
    title: "Automated Layer Farm",
    location: "Mbankomo",
    price: "25,000,000",
    roi: "35%",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800"
  },
  {
    id: 202,
    category: "poultry",
    title: "Broiler Production Unit",
    location: "Bafoussam",
    price: "18,500,000",
    roi: "22%",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800"
  },
  {
    id: 203,
    category: "poultry",
    title: "Certified Parent Stock Farm",
    location: "Sangmélima",
    price: "75,000,000",
    roi: "40%",
    image: "https://images.unsplash.com/photo-1588615419957-bc66d306634d?q=80&w=800"
  },
  {
    id: 204,
    category: "poultry",
    title: "Local Chicken (Goliath) Unit",
    location: "Okola",
    price: "5,500,000",
    roi: "15%",
    image: "https://images.unsplash.com/photo-1604314473918-993fe4fc7c09?q=80&w=800"
  },
  {
    id: 205,
    category: "poultry",
    title: "Quail Specialized Farm",
    location: "Yaoundé (Soa)",
    price: "10,000,000",
    roi: "19%",
    image: "https://images.unsplash.com/photo-1528495648044-84835a814d82?q=80&w=800"
  },

  // --- CATTLE (5) ---
  {
    id: 301,
    category: "cattle",
    title: "Highland Meat Ranch",
    location: "Ngaoundéré",
    price: "150,000,000",
    roi: "12%",
    image: "https://images.unsplash.com/photo-1545468843-059960205249?q=80&w=800"
  },
  {
    id: 302,
    category: "cattle",
    title: "Dairy Production Center",
    location: "Bamenda",
    price: "95,000,000",
    roi: "18%",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800"
  },
  {
    id: 303,
    category: "cattle",
    title: "Fattening Feedlot Station",
    location: "Garoua",
    price: "45,000,000",
    roi: "25%",
    image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=800"
  },
  {
    id: 304,
    category: "cattle",
    title: "Eco-Friendly Pasture Unit",
    location: "Foumban",
    price: "60,000,000",
    roi: "14%",
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=800"
  },
  {
    id: 305,
    category: "cattle",
    title: "Bovine Breeding Center",
    location: "Bertoua",
    price: "85,000,000",
    roi: "20%",
    image: "https://images.unsplash.com/photo-1527153355513-441619660232?q=80&w=800"
  },

  // --- PIGS (5) ---
  {
    id: 401,
    category: "pigs",
    title: "Modern Farrowing Unit",
    location: "Santchou",
    price: "35,000,000",
    roi: "28%",
    image: "https://images.unsplash.com/photo-1594236062810-b466f7704547?q=80&w=800"
  },
  {
    id: 402,
    category: "pigs",
    title: "Industrial Pig Nursery",
    location: "Monatélé",
    price: "22,000,000",
    roi: "22%",
    image: "https://images.unsplash.com/photo-1604848698030-c434ba0853fe?q=80&w=800"
  },
  {
    id: 403,
    category: "pigs",
    title: "Hybrid Breeding Stock Farm",
    location: "Dschang",
    price: "50,000,000",
    roi: "30%",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800"
  },
  {
    id: 404,
    category: "pigs",
    title: "Organic Free-Range Piggery",
    location: "Edéa",
    price: "12,000,000",
    roi: "18%",
    image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=800"
  },
  {
    id: 405,
    category: "pigs",
    title: "High-BioSecurity Swine Unit",
    location: "Njombé",
    price: "40,000,000",
    roi: "26%",
    image: "https://images.unsplash.com/photo-1594236063462-817367c336b1?q=80&w=800"
  }
];