// scripts/seedProperties.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';
import User from '../models/User.js';

dotenv.config();

// Banque d'images réalistes (URLs Unsplash de biens immobiliers)
const IMAGE_BANK = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', // Luxury villa
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', // Modern house
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233', // House with garden
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6', // Apartment building
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', // Studio apartment
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', // Living room
  'https://images.unsplash.com/photo-1484154218962-a197022b5858', // Kitchen
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511', // Bedroom
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', // Bathroom
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', // Modern apartment
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', // Luxury house
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', // Exterior house
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', // Office space
  'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf', // Commercial space
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa', // Land plot
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126', // Warehouse
  'https://images.unsplash.com/photo-1556906781-9a412961c28c', // Shop front
  'https://images.unsplash.com/photo-1566480173053-d29f92ec6f35', // Parking
  'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12', // Villa pool
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf'  // Duplex
];

// Villes et quartiers du Cameroun
const LOCATIONS = [
  { city: 'Douala', districts: ['Bonapriso', 'Akwa', 'Bonamoussadi', 'Makepe', 'Logbessou', 'Bepanda', 'Deido', 'Bonaberi', 'Yassa', 'Nzeng-Ayong'] },
  { city: 'Yaoundé', districts: ['Bastos', 'Mvog-Mbi', 'Etoudi', 'Messa', 'Obili', 'Nsimeyong', 'Mfoundi', 'Elig-Essono', 'Mokolo', 'Manguier'] },
  { city: 'Bafoussam', districts: ['Quartier 1', 'Quartier 2', 'Banengo', 'Baleng', 'Famleng', 'Djeleng'] },
  { city: 'Garoua', districts: ['Plateau', 'Banque', 'Roumde Adjia', 'Domayo', 'Pitoa'] },
  { city: 'Maroua', districts: ['Domayo', 'Palar', 'Doualaré', 'Djarengol', 'Baoliwol'] },
  { city: 'Ngaoundéré', districts: ['Plateau', 'République', 'Mbindao', 'Ngaoundal', 'Kossara'] },
  { city: 'Bamenda', districts: ['Commercial Avenue', 'Ntarinkon', 'Bayelle', 'Mankon', 'Nso'] },
  { city: 'Limbe', districts: ['Down Beach', 'Mile 4', 'Mile 15', 'Bota', 'Batoke'] },
  { city: 'Kribi', districts: ['Mboamanga', 'Grand Batanga', 'Mabi', 'Bwambe'] },
  { city: 'Bertoua', districts: ['Nkolbikon', 'Lom', 'Ngan', 'Boulembe'] }
];

// Régions du Cameroun
const REGIONS = [
  'Littoral', 'Centre', 'West', 'North', 'Far North', 
  'Adamawa', 'North-West', 'South-West', 'South', 'East'
];

// Descriptions génériques
const DESCRIPTIONS = {
  House: [
    'Spacious family house with large living areas, modern kitchen, and beautiful garden. Perfect for a comfortable family life.',
    'Beautiful house in a quiet neighborhood, close to schools and shopping centers. Features include parking, garden, and security system.',
    'Modern house with contemporary design, fully equipped kitchen, air conditioning in all bedrooms, and a private swimming pool.'
  ],
  Villa: [
    'Luxurious villa with panoramic views, private pool, landscaped garden, and high-end finishes throughout. Located in exclusive neighborhood.',
    'Magnificent villa offering exceptional living spaces, 24/7 security, staff quarters, and premium amenities for discerning buyers.',
    'Stunning contemporary villa with smart home features, gym, home cinema, and breathtaking views of the city skyline.'
  ],
  Apartment: [
    'Modern apartment in secure residence with elevator, parking, and 24/7 security. Close to all amenities and transport links.',
    'Beautifully renovated apartment with high ceilings, large windows, and high-quality finishes. Perfect for professionals.',
    'Spacious apartment in prime location, offering comfort and convenience. Walking distance to shops, restaurants, and public transport.'
  ],
  Land: [
    'Prime land for residential or commercial development. Excellent location with easy access to main roads and utilities available.',
    'Buildable plot in a growing area. Perfect for constructing your dream home or investment property.',
    'Large land parcel suitable for agricultural use or real estate development. Good access to water and electricity.'
  ],
  'Commercial Space': [
    'Prime commercial space in high-traffic area. Ideal for retail, office, or restaurant business. Ample parking available.',
    'Versatile commercial unit with street frontage and excellent visibility. Modern finishes and flexible layout.',
    'Ready-to-use commercial space with all permits. Perfect for showroom, boutique, or professional services.'
  ]
};

// Fonction pour obtenir des images aléatoires
function getRandomImages() {
  const shuffled = [...IMAGE_BANK];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
}

// Fonction pour générer un prix réaliste (FCFA)
function generatePrice(category, listingType) {
  const prices = {
    House: { sale: [35000000, 120000000], rent: [250000, 800000] },
    Villa: { sale: [80000000, 250000000], rent: [500000, 1500000] },
    Duplex: { sale: [60000000, 180000000], rent: [400000, 1200000] },
    Apartment: { sale: [25000000, 80000000], rent: [150000, 500000] },
    Studio: { sale: [12000000, 35000000], rent: [80000, 250000] },
    Room: { sale: [5000000, 15000000], rent: [30000, 100000] },
    Land: { sale: [10000000, 50000000], rent: [50000, 200000] },
    'Agricultural Land': { sale: [8000000, 30000000], rent: [40000, 150000] },
    'Commercial Space': { sale: [45000000, 150000000], rent: [300000, 1000000] },
    Office: { sale: [30000000, 100000000], rent: [200000, 700000] },
    Warehouse: { sale: [40000000, 120000000], rent: [300000, 900000] },
    Shop: { sale: [25000000, 90000000], rent: [150000, 600000] },
    'Industrial Space': { sale: [60000000, 200000000], rent: [500000, 1500000] },
    Parking: { sale: [5000000, 20000000], rent: [20000, 80000] }
  };
  
  const range = prices[category][listingType];
  return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}

// Fonction pour générer la surface
function generateSurface(category) {
  const surfaces = {
    House: [150, 400],
    Villa: [250, 800],
    Duplex: [180, 500],
    Apartment: [60, 180],
    Studio: [25, 50],
    Room: [12, 25],
    Land: [300, 2000],
    'Agricultural Land': [1000, 10000],
    'Commercial Space': [80, 300],
    Office: [50, 200],
    Warehouse: [200, 1000],
    Shop: [30, 120],
    'Industrial Space': [300, 2000],
    Parking: [20, 100]
  };
  
  const range = surfaces[category];
  return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}

// Toutes les catégories disponibles
const CATEGORIES = [
  'House', 'Villa', 'Duplex', 'Apartment', 'Studio', 'Room', 
  'Land', 'Agricultural Land', 'Commercial Space', 'Office', 
  'Warehouse', 'Shop', 'Industrial Space', 'Parking'
];

// Générer 50 propriétés
function generateProperties(userId) {
  const properties = [];
  
  for (let i = 0; i < 50; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const listingType = Math.random() > 0.5 ? 'sale' : 'rent';
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const district = location.districts[Math.floor(Math.random() * location.districts.length)];
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    
    // Générer features spécifiques à la catégorie
    const features = {
      hasElectricity: Math.random() > 0.2,
      hasWater: Math.random() > 0.15,
      hasRoad: Math.random() > 0.1,
      isFenced: category === 'House' || category === 'Villa' ? Math.random() > 0.3 : Math.random() > 0.7,
      bedrooms: 0,
      bathrooms: 0,
      floor: null,
      hasElevator: false,
      hasBalcony: false,
      isFurnished: false,
      showWindow: false,
      zone: '',
      hasParking: false,
      hasGarden: false,
      landType: ''
    };
    
    // Ajuster features selon la catégorie
    if (['House', 'Villa', 'Duplex', 'Apartment'].includes(category)) {
      features.bedrooms = Math.floor(Math.random() * 5) + 2;
      features.bathrooms = Math.floor(Math.random() * 4) + 1;
      features.hasParking = Math.random() > 0.4;
      features.hasBalcony = Math.random() > 0.5;
      features.isFurnished = Math.random() > 0.6;
      
      if (category === 'Villa') {
        features.hasGarden = Math.random() > 0.2;
        features.hasElevator = Math.random() > 0.7;
      }
      
      if (category === 'Apartment') {
        features.floor = Math.floor(Math.random() * 10) + 1;
        features.hasElevator = Math.random() > 0.5;
      }
    }
    
    if (category === 'Land' || category === 'Agricultural Land') {
      features.landType = category === 'Land' ? 'Residential/Commercial' : 'Agricultural';
      features.isFenced = Math.random() > 0.6;
    }
    
    if (category === 'Commercial Space' || category === 'Shop') {
      features.showWindow = Math.random() > 0.3;
      features.zone = ['Commercial', 'Mixed-Use', 'Residential-Commercial'][Math.floor(Math.random() * 3)];
    }
    
    // Générer amenities
    const amenities = {
      schools: { count: 0, names: [] },
      markets: { count: 0, names: [] },
      stations: { count: 0, names: [] },
      bakeries: { count: 0, names: [] }
    };
    
    if (Math.random() > 0.5) {
      amenities.schools.count = Math.floor(Math.random() * 3) + 1;
      amenities.schools.names = [`${district} Primary School`, `${location.city} International School`, 'Public High School'].slice(0, amenities.schools.count);
    }
    
    if (Math.random() > 0.4) {
      amenities.markets.count = Math.floor(Math.random() * 2) + 1;
      amenities.markets.names = [`${district} Market`, `${location.city} Central Market`].slice(0, amenities.markets.count);
    }
    
    // Sélectionner une description
    const descOptions = DESCRIPTIONS[category] || ['Beautiful property in excellent location. Great investment opportunity.'];
    const description = descOptions[Math.floor(Math.random() * descOptions.length)];
    
    const property = {
      title: `${category === 'Land' ? 'Buildable' : category === 'Commercial Space' ? 'Prime' : 'Beautiful'} ${category} in ${district}, ${location.city}`,
      category,
      listingType,
      location: {
        city: location.city,
        district,
        region,
        coordinates: {
          lat: (Math.random() * 10) + 3,
          lng: (Math.random() * 12) + 8
        }
      },
      surface: {
        value: generateSurface(category),
        unit: category === 'Land' || category === 'Agricultural Land' ? 'm²' : 'm²'
      },
      price: {
        amount: generatePrice(category, listingType),
        currency: 'FCFA'
      },
      status: Math.random() > 0.8 ? 'PENDING' : 'PUBLISHED',
      owner: userId,
      description,
      images: getRandomImages(),
      features,
      amenities,
      views: Math.floor(Math.random() * 500),
      ...(Math.random() > 0.95 && listingType === 'sale' ? { soldAt: new Date() } : {})
    };
    
    properties.push(property);
  }
  
  return properties;
}

// Script principal
async function seedProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Trouver un utilisateur propriétaire (ou créer un utilisateur par défaut)
    let owner = await User.findOne({ role: 'owner' });
    
    if (!owner) {
      // Créer un utilisateur propriétaire par défaut si aucun n'existe
      owner = await User.create({
        name: 'Default Owner',
        email: 'owner@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+237600000000',
        role: 'owner',
        isVerified: true
      });
      console.log('Created default owner user');
    }
    
    // Supprimer les anciennes propriétés (optionnel)
    await Property.deleteMany({});
    console.log('Cleared existing properties');
    
    // Générer et insérer 50 propriétés
    const properties = generateProperties(owner._id);
    const inserted = await Property.insertMany(properties);
    
    console.log(`✅ Successfully seeded ${inserted.length} properties`);
    console.log('\n📊 Summary:');
    
    // Afficher quelques statistiques
    const stats = {
      total: inserted.length,
      byCategory: {},
      byListingType: { sale: 0, rent: 0 },
      byStatus: { PUBLISHED: 0, PENDING: 0, SOLD: 0, RESERVED: 0 }
    };
    
    inserted.forEach(p => {
      stats.byCategory[p.category] = (stats.byCategory[p.category] || 0) + 1;
      stats.byListingType[p.listingType]++;
      stats.byStatus[p.status]++;
    });
    
    console.log('By category:', stats.byCategory);
    console.log('By listing type:', stats.byListingType);
    console.log('By status:', stats.byStatus);
    console.log('\nFirst property example:');
    console.log(JSON.stringify(inserted[0], null, 2));
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding properties:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Exécuter le script
seedProperties();