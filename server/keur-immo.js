// scrape-keur-immo.mjs
// Lancer avec : node scrape-keur-immo.mjs
// Prérequis : npm install puppeteer mongoose dotenv

import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://evrardnkono870_db_user:Chesstitan870@cluster0.wkjstac.mongodb.net/property_cameroon?retryWrites=true&w=majority&appName=Cluster0';
const DEFAULT_OWNER_ID = process.env.DEFAULT_OWNER_ID || '000000000000000000000001';

// URLs à scraper
const SEARCH_PAGES = [
  'https://keur-immo.com/cameroun/annonces-immobilieres/vente/maison?page=1',
  'https://keur-immo.com/cameroun/annonces-immobilieres/vente/appartement?page=1',
  'https://keur-immo.com/cameroun/annonces-immobilieres/vente/terrain?page=1',
  'https://keur-immo.com/cameroun/annonces-immobilieres/location/maison?page=1',
  'https://keur-immo.com/cameroun/annonces-immobilieres/location/appartement?page=1',
  'https://keur-immo.com/cameroun/annonces-immobilieres/vente/boutique-locaux-commerciaux?page=1',
];

// Schéma MongoDB
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  listingType: { type: String, enum: ['sale', 'rent'], default: 'sale' },
  location: { city: String, district: String, region: String },
  surface: { value: Number, unit: String },
  price: { amount: Number, currency: String },
  status: { type: String, default: 'PUBLISHED' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  images: [String],
  features: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    isFurnished: { type: Boolean, default: false },
    hasParking: { type: Boolean, default: false }
  },
  sourceUrl: String,
  scrapedAt: Date
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// Mapping des catégories KEUR-IMMO -> vos catégories
const categoryMapping = {
  'maison': 'House',
  'villa': 'Villa',
  'appartement': 'Apartment',
  'studio': 'Studio',
  'terrain': 'Land',
  'boutique': 'Commercial Space',
  'local commercial': 'Commercial Space',
  'bureau': 'Office'
};

function detectCategoryFromUrl(url, title) {
  const text = (url + ' ' + title).toLowerCase();
  if (text.includes('maison')) return 'House';
  if (text.includes('villa')) return 'Villa';
  if (text.includes('appartement')) return 'Apartment';
  if (text.includes('studio')) return 'Studio';
  if (text.includes('terrain')) return 'Land';
  if (text.includes('boutique') || text.includes('commercial')) return 'Commercial Space';
  if (text.includes('bureau')) return 'Office';
  return 'House';
}

function detectListingType(url) {
  if (url.includes('/vente/')) return 'sale';
  if (url.includes('/location/')) return 'rent';
  return 'sale';
}

function extractPrice(text) {
  const patterns = [
    /(\d{1,3}(?:[\s.]?\d{3})*)\s*(?:FCFA|XAF|CFA)/i,
    /(\d+(?:\.\d+)?)\s*(?:millions?|M)\s*(?:FCFA|XAF|CFA)?/i,
    /prix[:\s]*(\d{1,3}(?:[\s.]?\d{3})*)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let val = match[1].replace(/[\s.]/g, '');
      if (match[0].toLowerCase().includes('million')) val = (parseFloat(val) * 1000000).toString();
      const price = parseInt(val);
      if (!isNaN(price) && price > 0 && price < 1000000000) return price;
    }
  }
  return null;
}

function extractSurface(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:m²|m2|sqm)/i);
  if (match) return parseFloat(match[1]);
  return null;
}

function extractBedrooms(text) {
  const match = text.match(/(\d+)\s*(?:chambres?|pieces?|bedrooms?)/i);
  if (match) return parseInt(match[1]);
  return null;
}

function extractCity(text) {
  const cities = ['Douala', 'Yaoundé', 'Yaounde', 'Bafoussam', 'Bamenda', 'Garoua', 'Limbe', 'Kribi', 'Edea', 'Ngaoundéré'];
  for (const city of cities) {
    if (text.toLowerCase().includes(city.toLowerCase())) {
      return city === 'Yaounde' ? 'Yaoundé' : city;
    }
  }
  return '';
}

async function scrapeKeurImmo() {
  console.log('\n' + '='.repeat(60));
  console.log('🏠 KEUR-IMMO SCRAPER');
  console.log('='.repeat(60) + '\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  const allProperties = [];

  for (const url of SEARCH_PAGES) {
    console.log(`\n📡 Scraping: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Attendre les annonces
      await page.waitForSelector('.property-item, .annonce, [class*="property"], [class*="listing"]', { timeout: 10000 }).catch(() => {
        console.log('  ⚠️ Pas de sélecteur trouvé, tentative de fallback...');
      });
      
      // Scroll pour charger plus
      await page.evaluate(async () => {
        for (let i = 0; i < 3; i++) {
          window.scrollBy(0, 600);
          await new Promise(r => setTimeout(r, 500));
        }
      });
      
      await new Promise(r => setTimeout(r, 2000));
      
      // Extraire les propriétés
      const properties = await page.evaluate(() => {
        const results = [];
        
        // Chercher tous les conteneurs possibles
        const selectors = [
          '.property-item', '.item', '.card', '.annonce',
          '[class*="property"]', '[class*="listing"]', 'article'
        ];
        
        let items = [];
        for (const sel of selectors) {
          const found = document.querySelectorAll(sel);
          if (found.length > 0) {
            items = Array.from(found);
            console.log(`Sélecteur ${sel}: ${found.length} éléments`);
            break;
          }
        }
        
        items.forEach(item => {
          const html = item.innerHTML;
          const text = item.innerText || '';
          
          // Titre
          let title = '';
          const titleEl = item.querySelector('h2, h3, h4, .title, [class*="title"]');
          if (titleEl) title = titleEl.innerText.trim();
          if (!title) title = text.split('\n')[0]?.trim() || '';
          
          // Prix
          let price = null;
          const priceMatch = text.match(/(\d{1,3}(?:[\s.]?\d{3})*)\s*(?:FCFA|XAF)/i);
          if (priceMatch) price = priceMatch[1].replace(/[\s.]/g, '');
          
          // Image
          let image = '';
          const img = item.querySelector('img');
          if (img) image = img.src || img.getAttribute('data-src') || '';
          if (image && image.startsWith('/')) image = 'https://keur-immo.com' + image;
          
          // Lien
          let link = '';
          const anchor = item.querySelector('a');
          if (anchor) {
            link = anchor.href;
            if (link && !link.startsWith('http')) link = 'https://keur-immo.com' + link;
          }
          
          if (title && title.length > 5) {
            results.push({ title, text, price, image, link });
          }
        });
        
        return results;
      });
      
      console.log(`  📦 ${properties.length} propriétés trouvées`);
      
      // Traiter chaque propriété
      for (const prop of properties) {
        const fullText = prop.title + ' ' + prop.text;
        const category = detectCategoryFromUrl(url, prop.title);
        const listingType = detectListingType(url);
        const price = extractPrice(fullText) || extractPrice(prop.price);
        const surface = extractSurface(fullText);
        const bedrooms = extractBedrooms(fullText);
        const city = extractCity(fullText);
        
        allProperties.push({
          title: prop.title.substring(0, 200),
          category,
          listingType,
          location: { city, district: '', region: '' },
          surface: surface ? { value: surface, unit: 'm²' } : undefined,
          price: price ? { amount: price, currency: 'FCFA' } : undefined,
          images: prop.image ? [prop.image] : [],
          features: { bedrooms: bedrooms || 0, bathrooms: 0, isFurnished: false },
          description: prop.text.substring(0, 1000),
          sourceUrl: prop.link,
          scrapedAt: new Date()
        });
      }
      
    } catch (err) {
      console.error(`  ❌ Erreur: ${err.message}`);
    }
    
    // Pause entre les pages
    await new Promise(r => setTimeout(r, 2000));
  }
  
  await browser.close();
  
  // Déduplication
  const seen = new Set();
  const unique = allProperties.filter(p => {
    if (seen.has(p.title.toLowerCase())) return false;
    seen.add(p.title.toLowerCase());
    return true;
  });
  
  console.log(`\n📊 Total unique: ${unique.length} propriétés`);
  
  if (unique.length === 0) {
    console.log('⚠️ Aucune propriété trouvée. Le site a peut-être changé de structure.');
    return;
  }
  
  // Aperçu
  console.log('\n📋 Aperçu des 3 premières:');
  unique.slice(0, 3).forEach((p, i) => {
    console.log(`\n[${i+1}] ${p.title}`);
    console.log(`    Type: ${p.category} (${p.listingType === 'sale' ? 'Vente' : 'Location'})`);
    console.log(`    Ville: ${p.location.city || '?'}`);
    console.log(`    Prix: ${p.price ? p.price.amount.toLocaleString() + ' FCFA' : 'N/A'}`);
    console.log(`    Surface: ${p.surface ? p.surface.value + ' m²' : 'N/A'}`);
  });
  
  // Import MongoDB
  console.log('\n💾 Connexion MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté');
    
    // Récupérer un owner
    let ownerId = new mongoose.Types.ObjectId(DEFAULT_OWNER_ID);
    try {
      const firstUser = await mongoose.connection.db.collection('users').findOne({});
      if (firstUser) ownerId = firstUser._id;
      console.log(`👤 Owner: ${ownerId}`);
    } catch(e) {}
    
    let imported = 0;
    for (const prop of unique) {
      const exists = await Property.findOne({ title: prop.title });
      if (!exists) {
        await Property.create({ ...prop, owner: ownerId, status: 'PUBLISHED' });
        imported++;
        console.log(`  ✅ Importé: ${prop.title.substring(0, 50)}`);
      }
    }
    
    console.log(`\n✅ ${imported} propriétés importées`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err.message);
  }
  
  console.log('\n✨ Terminé !');
}

scrapeKeurImmo().catch(console.error);