// scrape-weetyu.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const WEETYU_URL = 'https://weetyu.com/en';
const MONGODB_URI = process.env.MONGODB_URI;

// Schéma Property (à adapter à votre modèle exact)
const propertySchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  location: {
    city: String,
    district: String,
    region: String
  },
  surface: { value: Number, unit: String },
  price: { amount: Number, currency: String },
  status: { type: String, default: 'PUBLISHED' },
  images: [String],
  features: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    isFurnished: { type: Boolean, default: false }
  },
  sourceUrl: String,
  scrapedAt: Date
});

const Property = mongoose.model('Property', propertySchema);

// Fonction pour extraire les données d'une carte de propriété
function extractPropertyFromCard(cardHtml) {
  const $ = cheerio.load(cardHtml);
  
  // Titre - chercher dans les headings MUI
  let title = '';
  $('h5, h6, .MuiTypography-h5, .MuiTypography-h6').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 5 && text.length < 200) {
      title = text;
    }
  });
  
  // Description
  let description = '';
  $('p, .MuiTypography-body2').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 20 && text !== title) {
      description = text;
    }
  });
  
  // Prix
  let price = null;
  const pricePattern = /(\d{1,3}(?:[\s.]?\d{3})*)\s*(?:FCFA|XAF|CFA)/i;
  const priceMatch = cardHtml.match(pricePattern);
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/[\s.]/g, ''));
  }
  
  // Image
  let imageUrl = '';
  $('img').each((i, img) => {
    const src = $(img).attr('src');
    if (src && !src.includes('logo') && !src.includes('icon')) {
      imageUrl = src.startsWith('/') ? `https://weetyu.com${src}` : src;
    }
  });
  
  // Lien vers le détail
  let detailUrl = '';
  $('a').each((i, link) => {
    const href = $(link).attr('href');
    if (href && (href.includes('/property') || href.includes('/detail') || href.includes('/annonce'))) {
      detailUrl = href.startsWith('/') ? `https://weetyu.com${href}` : href;
    }
  });
  
  // Catégorie (détection basique)
  let category = 'House';
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('appartement')) category = 'Apartment';
  else if (text.includes('studio')) category = 'Studio';
  else if (text.includes('villa')) category = 'Villa';
  else if (text.includes('terrain')) category = 'Land';
  else if (text.includes('commercial')) category = 'Commercial Space';
  else if (text.includes('chambre')) category = 'Room';
  
  // Surface
  let surface = null;
  const surfaceMatch = cardHtml.match(/(\d+)\s*(?:m²|m2)/i);
  if (surfaceMatch) surface = parseInt(surfaceMatch[1]);
  
  // Chambres
  let bedrooms = 0;
  const bedroomMatch = cardHtml.match(/(\d+)\s*(?:chambres?|bedrooms?)/i);
  if (bedroomMatch) bedrooms = parseInt(bedroomMatch[1]);
  
  // Ville
  let city = '';
  const cities = ['Douala', 'Yaoundé', 'Garoua', 'Bafoussam', 'Bamenda', 'Limbe', 'Kribi'];
  for (const c of cities) {
    if (text.includes(c.toLowerCase())) {
      city = c;
      break;
    }
  }
  
  return {
    title: title || 'Sans titre',
    category,
    description: description.substring(0, 1000),
    location: { city, district: '', region: '' },
    surface: surface ? { value: surface, unit: 'm²' } : null,
    price: price ? { amount: price, currency: 'FCFA' } : null,
    images: imageUrl ? [imageUrl] : [],
    features: { bedrooms, bathrooms: 0, isFurnished: false },
    sourceUrl: detailUrl,
    scrapedAt: new Date()
  };
}

// Fonction principale de scraping
async function scrapeWeetyu() {
  console.log('\n' + '='.repeat(60));
  console.log('🕷️  WEETYU.COM SCRAPER');
  console.log('='.repeat(60) + '\n');
  
  try {
    // 1. Récupérer la page
    console.log('📡 Fetching page...');
    const response = await axios.get(WEETYU_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9'
      },
      timeout: 15000
    });
    
    console.log(`✅ Page récupérée (${response.data.length} caractères)`);
    
    const $ = cheerio.load(response.data);
    
    // 2. Trouver les cartes de propriétés
    // D'après l'analyse, les propriétés sont dans MuiGrid-item
    const cards = [];
    
    $('.MuiGrid-item, .MuiCard-root, [class*="property"], [class*="listing"]').each((i, el) => {
      const html = $(el).html();
      if (html && html.length > 100 && i < 30) { // Limite à 30 annonces
        cards.push(html);
      }
    });
    
    console.log(`\n🔍 Trouvé ${cards.length} cartes potentielles\n`);
    
    // 3. Extraire les données de chaque carte
    const properties = [];
    
    for (let i = 0; i < cards.length; i++) {
      console.log(`📦 [${i + 1}/${cards.length}] Extraction...`);
      const prop = extractPropertyFromCard(cards[i]);
      
      if (prop.title && prop.title !== 'Sans titre') {
        properties.push(prop);
        console.log(`   ✅ ${prop.category}: ${prop.title.substring(0, 50)}...`);
        if (prop.price) console.log(`   💰 Prix: ${prop.price.amount.toLocaleString()} FCFA`);
        if (prop.surface) console.log(`   📐 Surface: ${prop.surface.value} m²`);
      } else {
        console.log(`   ⏭️ Ignoré (pas assez d'infos)`);
      }
      
      // Pause pour éviter d'être bloqué
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`\n📊 Total propriétés extraites: ${properties.length}`);
    
    // 4. Aperçu
    if (properties.length > 0) {
      console.log('\n📋 Aperçu de la première propriété:');
      console.log(JSON.stringify(properties[0], null, 2));
    }
    
    // 5. Sauvegarder dans MongoDB
    if (properties.length > 0 && MONGODB_URI) {
      console.log('\n💾 Connexion à MongoDB...');
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connecté');
      
      let imported = 0;
      let skipped = 0;
      
      for (const prop of properties) {
        // Vérifier si déjà existant (par titre ou URL)
        const existing = await Property.findOne({ 
          $or: [
            { title: prop.title },
            { sourceUrl: prop.sourceUrl }
          ]
        });
        
        if (!existing) {
          const property = new Property(prop);
          await property.save();
          imported++;
          console.log(`   ✅ Importé: ${prop.title.substring(0, 40)}`);
        } else {
          skipped++;
          console.log(`   ⏭️ Déjà existant: ${prop.title.substring(0, 40)}`);
        }
      }
      
      console.log(`\n📊 Résumé:`);
      console.log(`   ✅ Importés: ${imported}`);
      console.log(`   ⏭️ Ignorés: ${skipped}`);
      console.log(`   📦 Total: ${properties.length}`);
      
      await mongoose.disconnect();
    }
    
    console.log('\n✨ Scraping terminé !');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
    }
  }
}

// Exécuter
scrapeWeetyu();