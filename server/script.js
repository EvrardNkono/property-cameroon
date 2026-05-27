// scripts/seedLivestock.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Schémas
const livestockCategorySchema = new mongoose.Schema({}, { strict: false, collection: 'livestockcategories' });
const livestockSchema = new mongoose.Schema({}, { strict: false, collection: 'livestocks' });
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });

const LivestockCategory = mongoose.model('LivestockCategory', livestockCategorySchema);
const Livestock = mongoose.model('Livestock', livestockSchema);
const User = mongoose.model('User', userSchema);

// ============================================
// DONNÉES PRÉ-REMPLIES (5 par catégorie, SAUF POULTRY)
// ============================================

const livestockData = [
  // ========== FISH FARMING (5 assets) ==========
  // 1. Moderne - Douala
  {
    title: "Modern Tilapia Farm – Douala",
    categoryKey: "FISH FARMING",
    city: "Douala",
    region: "Littoral",
    capacity: 5000,
    price: 12500000,
    roi: 20,
    cycleDuration: "8 months",
    description: "Modern tilapia and catfish farm in Douala's peri-urban area. 5000 heads capacity with aerated ponds and automatic feeders. Direct supply to Douala's fish markets and restaurants. Strong demand as fresh fish replaces frozen imports.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 2. Traditionnel - Dschang
  {
    title: "Traditional Tilapia Ponds – Dschang",
    categoryKey: "FISH FARMING",
    city: "Dschang",
    region: "West",
    capacity: 2000,
    price: 5000000,
    roi: 28,
    cycleDuration: "8 months",
    description: "Traditional earthen ponds in the Western highlands. 2000 heads of mixed tilapia and catfish. Low operating cost using local feed (palm kernel cake, cassava leaves). Cold mountain water ensures healthy fish. Ideal for patient investors.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 3. Cage flottante - Yaoundé
  {
    title: "Floating Cage Fish Farm – Yaoundé (Mfoundi Reservoir)",
    categoryKey: "FISH FARMING",
    city: "Yaoundé",
    region: "Centre",
    capacity: 8000,
    price: 28000000,
    roi: 25,
    cycleDuration: "7 months",
    description: "Innovative floating cage system on Mfoundi Reservoir in Yaoundé. 8,000 heads capacity (tilapia dominant). High-density farming with minimal land use. Direct access to Yaoundé's growing middle-class market. Includes boat access and automated feeding system.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 4. Clarias (poisson-chat) - Bertoua
  {
    title: "Clarias Catfish Hatchery – Bertoua",
    categoryKey: "FISH FARMING",
    city: "Bertoua",
    region: "East",
    capacity: 10000,
    price: 22000000,
    roi: 30,
    cycleDuration: "6 months",
    description: "Specialized Clarias gariepinus (African catfish) hatchery in Bertoua. 10,000 fingerlings capacity per cycle. Clarias is highly resistant to disease and low oxygen. Supplies fingerlings to 20+ small farmers in East region. High demand from restaurants for 'poisson braisé'.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 5. Pisciculture intégrée agriculture - Kribi
  {
    title: "Integrated Agri-Aquaculture Farm – Kribi",
    categoryKey: "FISH FARMING",
    city: "Kribi",
    region: "South",
    capacity: 3000,
    price: 15000000,
    roi: 35,
    cycleDuration: "9 months",
    description: "Integrated farm combining fish ponds with vegetable irrigation and duck farming. 3,000 heads of mixed tilapia and Clarias. Duck manure fertilizes ponds, pond water irrigates vegetable gardens. Closed-loop sustainable system. Located near Kribi's growing tourist market.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },

  // ========== PIG FARMING (5 assets) ==========
  // 1. Moderne - Douala
  {
    title: "Modern Pig Farm – Douala",
    categoryKey: "PIG FARMING",
    city: "Douala",
    region: "Littoral",
    capacity: 300,
    price: 25500000,
    roi: 18,
    cycleDuration: "6 months",
    description: "Modern pig farm with concrete pens, ventilation, and biosecurity measures. 300 heads capacity (breeders + fatteners). Direct contracts with maquis and butchers in Douala. High demand for fresh pork in urban areas.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 2. Traditionnel - Bafoussam
  {
    title: "Traditional Free-range Pigs – Bafoussam",
    categoryKey: "PIG FARMING",
    city: "Bafoussam",
    region: "West",
    capacity: 150,
    price: 12750000,
    roi: 26,
    cycleDuration: "6 months",
    description: "Free-range pig farming in Bafoussam area. 150 heads raised on local feed (maize bran, cassava peels, palm kernel cake). Lower operating costs than modern farms. Premium price for 'village pork' in local ceremonies.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 3. Porc noir des montagnes - Buea
  {
    title: "Mountain Black Pig Farm – Buea (Mount Cameroon)",
    categoryKey: "PIG FARMING",
    city: "Buea",
    region: "South-West",
    capacity: 120,
    price: 18000000,
    roi: 30,
    cycleDuration: "7 months",
    description: "Premium 'Black Pig' breed raised on Mount Cameroon slopes. 120 heads of heritage breed known for marbled meat and superior taste. Sold to high-end restaurants in Douala and Limbe. Unique selling point: pigs forage on volcanic soil rich in minerals.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 4. Porc naisseur-engraisseur - Foumban
  {
    title: "Breeder-Fattener Pig Farm – Foumban",
    categoryKey: "PIG FARMING",
    city: "Foumban",
    region: "West",
    capacity: 500,
    price: 42000000,
    roi: 22,
    cycleDuration: "8 months",
    description: "Large-scale breeder-fattener operation in Foumban. 50 sows + 450 fatteners. Produces piglets for sale and finished pigs for meat. Established network of buyers across West and Littoral regions. Includes farrowing crates and weaning facilities.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 5. Porc fermier - Nkongsamba
  {
    title: "Organic Pig Farm – Nkongsamba",
    categoryKey: "PIG FARMING",
    city: "Nkongsamba",
    region: "Littoral",
    capacity: 80,
    price: 9500000,
    roi: 28,
    cycleDuration: "6 months",
    description: "Small-scale organic pig farm in Nkongsamba. 80 heads raised without antibiotics or commercial feeds. Pigs eat palm kernel cake, cassava peels, plantains, and kitchen waste from local restaurants. 'Konga Pork' brand gaining recognition in Douala.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },

  // ========== CATTLE FARMING (5 assets) ==========
  // 1. Moderne - Ngaoundéré
  {
    title: "Modern Cattle Feedlot – Ngaoundéré",
    categoryKey: "CATTLE FARMING",
    city: "Ngaoundéré",
    region: "Adamawa",
    capacity: 100,
    price: 35000000,
    roi: 8,
    cycleDuration: "18 months",
    description: "Modern feedlot in Ngaoundéré, the heart of Cameroon's cattle region. 100 heads of zebu cattle, fattened with supplemented feed. Direct supply to butchers in Douala and Yaoundé. Long cycle but stable returns.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 2. Traditionnel - Garoua
  {
    title: "Traditional Pastoral Herd – Garoua",
    categoryKey: "CATTLE FARMING",
    city: "Garoua",
    region: "North",
    capacity: 250,
    price: 87500000,
    roi: 12,
    cycleDuration: "18 months",
    description: "Traditional transhumance herd in the North region. 250 heads of hardy zebu cattle raised on natural savannah pastures. Low input costs. Meat is highly prized for its taste. Includes established grazing corridors.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  // 3. Élevage laitier - Bamenda
  {
    title: "Dairy Cattle Farm – Bamenda Highlands",
    categoryKey: "CATTLE FARMING",
    city: "Bamenda",
    region: "North-West",
    capacity: 60,
    price: 45000000,
    roi: 15,
    cycleDuration: "12 months",
    description: "Specialized dairy farm in the cool Bamenda highlands. 60 heads of crossbred Friesian-zebu cattle producing 500L of fresh milk daily. Supplies milk to Bamenda, Bafoussam, and Douala. Includes milking parlor and cold chain equipment. Growing demand for fresh local milk.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 4. Embouche bovine - Maroua
  {
    title: "Cattle Fattening Station – Maroua",
    categoryKey: "CATTLE FARMING",
    city: "Maroua",
    region: "Far-North",
    capacity: 150,
    price: 52000000,
    roi: 14,
    cycleDuration: "14 months",
    description: "Specialized cattle fattening station in Maroua. 150 heads purchased during rainy season, fattened with cottonseed cake and maize bran, sold during Tabaski and dry season. Strategic location near Sudanian pastures. High margins due to seasonal price variations.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 5. Petit élevage - Banyo
  {
    title: "Community Cattle Farm – Banyo (Adamawa)",
    categoryKey: "CATTLE FARMING",
    city: "Banyo",
    region: "Adamawa",
    capacity: 40,
    price: 14000000,
    roi: 18,
    cycleDuration: "20 months",
    description: "Small-scale community cattle farm in Banyo. 40 heads managed by cooperative of 5 herders. Low overhead costs. Animals have access to communal pastures. Cooperative model reduces individual risk. Ideal for social impact investors.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },

  // ========== GOAT & SHEEP (5 assets) ==========
  // 1. Moderne - Yaoundé
  {
    title: "Modern Goat Farm – Yaoundé",
    categoryKey: "GOAT & SHEEP",
    city: "Yaoundé",
    region: "Centre",
    capacity: 200,
    price: 9000000,
    roi: 22,
    cycleDuration: "6 months",
    description: "Modern goat farm on the outskirts of Yaoundé. 200 heads of improved breeds (Sahelian crossed). Semi-intensive system with supplemented feeding. High demand for chevron in restaurants and ceremonies.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 2. Traditionnel - Maroua
  {
    title: "Traditional Ceremonial Rams – Maroua",
    categoryKey: "GOAT & SHEEP",
    city: "Maroua",
    region: "Far-North",
    capacity: 150,
    price: 8250000,
    roi: 30,
    cycleDuration: "6 months",
    description: "Traditional sheep and goat farm in the Far-North. 150 heads raised on natural pastures. Specialized in rams for Ramadan and Tabaski ceremonies. Premium prices during religious festivals. Minimal feed cost.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  },
  // 3. Chèvre laitière - Dschang
  {
    title: "Dairy Goat Farm – Dschang (Goat Milk)",
    categoryKey: "GOAT & SHEEP",
    city: "Dschang",
    region: "West",
    capacity: 100,
    price: 12000000,
    roi: 32,
    cycleDuration: "5 months",
    description: "Specialized dairy goat farm in Dschang. 100 heads of Sahelian goats producing 150L of milk per week. Goat milk sold to health-conscious consumers and people with cow milk allergies. Also produces artisanal goat cheese for hotels in Dschang and Bafoussam.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 4. Ovins (moutons) - Foumban
  {
    title: "Sheep Breeding Farm – Foumban (Ram Production)",
    categoryKey: "GOAT & SHEEP",
    city: "Foumban",
    region: "West",
    capacity: 80,
    price: 11000000,
    roi: 35,
    cycleDuration: "7 months",
    description: "Specialized sheep breeding farm in Foumban. Produces high-quality rams for sale across West and Littoral regions. Rams are sold at premium prices (150,000-250,000 FCFA each) for Tabaski. Purebred Djallonké sheep – hardy and disease-resistant.",
    features: { hasWaterSupply: true, hasElectricity: true, hasVeterinaryAccess: true, hasFeedStorage: true }
  },
  // 5. Petit ruminant - Bafia
  {
    title: "Integrated Goat & Poultry Farm – Bafia",
    categoryKey: "GOAT & SHEEP",
    city: "Bafia",
    region: "Centre",
    capacity: 60,
    price: 5000000,
    roi: 38,
    cycleDuration: "5 months",
    description: "Small integrated farm combining 60 goats with 200 free-range chickens. Goats browse on fallow land, chickens eat insects and kitchen waste. Minimal external feed required. Direct sales to Bafia market and neighboring villages. Perfect for entry-level investors.",
    features: { hasWaterSupply: true, hasElectricity: false, hasVeterinaryAccess: true, hasFeedStorage: false }
  }
];

function getImageForCategory(categoryKey) {
  const cat = categoryKey.toLowerCase();
  if (cat.includes('fish')) return 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=1000';
  if (cat.includes('pig')) return 'https://images.unsplash.com/photo-1516467504853-51623d4d5c3f?q=80&w=1000';
  if (cat.includes('cattle')) return 'https://images.unsplash.com/photo-1570042225831-d96fa9b0ab6b?q=80&w=1000';
  if (cat.includes('goat') || cat.includes('sheep')) return 'https://images.unsplash.com/photo-1524024974431-b39ccf726cc0?q=80&w=1000';
  return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000';
}

async function seedLivestock() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté\n');

    // Récupérer toutes les catégories
    const existingCategories = await LivestockCategory.find({ isActive: true });
    console.log(`📂 ${existingCategories.length} catégories trouvées:\n`);
    
    // Créer un map title -> catégorie
    const categoryMap = new Map();
    existingCategories.forEach(cat => {
      categoryMap.set(cat.title, cat);
      console.log(`   - "${cat.title}"`);
    });
    console.log('');

    // Récupérer un owner
    const anyUser = await User.findOne();
    if (!anyUser) {
      console.error('❌ Aucun utilisateur trouvé. Crée un utilisateur admin d\'abord.');
      process.exit(1);
    }
    console.log(`👤 Owner: ${anyUser.name || anyUser.email || anyUser._id}\n`);

    let created = 0;
    let skipped = 0;
    let notFound = 0;

    for (const item of livestockData) {
      // Chercher la catégorie correspondante
      let targetCategory = categoryMap.get(item.categoryKey);
      
      // Cas spécial pour FISH FARMING
      if (!targetCategory && item.categoryKey === "FISH FARMING") {
        targetCategory = categoryMap.get("fish-farming-cameroon");
      }

      if (!targetCategory) {
        console.log(`❌ Catégorie non trouvée: "${item.categoryKey}"`);
        notFound++;
        continue;
      }

      // Vérifier si le livestock existe déjà
      const exists = await Livestock.findOne({
        title: item.title,
        category: targetCategory.title
      });

      if (exists) {
        console.log(`⏭️ Déjà existant: ${item.title}`);
        skipped++;
        continue;
      }

      const livestockDoc = {
        title: item.title,
        category: targetCategory.title,
        location: {
          city: item.city,
          region: item.region,
          coordinates: { lat: null, lng: null }
        },
        price: { amount: item.price, currency: 'FCFA' },
        roi: item.roi,
        capacity: { value: item.capacity, unit: 'heads' },
        cycleDuration: item.cycleDuration,
        status: 'AVAILABLE',
        description: item.description,
        images: [getImageForCategory(item.categoryKey)],
        features: item.features,
        owner: anyUser._id,
        certifications: []
      };

      await Livestock.create(livestockDoc);
      console.log(`✅ Créé: ${item.title} → ${targetCategory.title}`);
      created++;
    }

    console.log(`\n🎉 Terminé ! ${created} créés, ${skipped} existants, ${notFound} introuvables.`);
    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedLivestock();