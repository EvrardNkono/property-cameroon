// scrape-weetyu.mjs
// Lancer avec : node scrape-weetyu.mjs
// Prérequis    : npm install puppeteer mongoose dotenv

import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ─── CONFIG ────────────────────────────────────────────────────────────────
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://evrardnkono870_db_user:Chesstitan870@cluster0.wkjstac.mongodb.net/property_cameroon?retryWrites=true&w=majority&appName=Cluster0';

// ID d'un utilisateur admin existant dans votre BD (obligatoire car owner est required)
// Remplacez par un vrai ObjectId de votre collection users
const DEFAULT_OWNER_ID = process.env.DEFAULT_OWNER_ID || '000000000000000000000001';

const SEARCH_PAGES = [
  'https://weetyu.com/en/search?typeRent=non-furnished',
  'https://weetyu.com/en/search?typeRent=furnished',
  'https://weetyu.com/en/search?typeRent=for-sale',
  'https://weetyu.com/en/search',
];

const MAX_PER_PAGE = 20; // annonces à extraire par page
// ───────────────────────────────────────────────────────────────────────────

// ─── SCHÉMA MONGOOSE (miroir du vrai modèle) ───────────────────────────────
const propertySchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    category: {
      type: String,
      enum: [
        'House','Villa','Duplex','Apartment','Studio','Room','Land',
        'Agricultural Land','Commercial Space','Office','Warehouse',
        'Shop','Industrial Space','Parking',
      ],
      required: true,
    },
    location: {
      city: String, district: String, region: String,
      coordinates: { lat: Number, lng: Number },
    },
    surface:  { value: Number, unit: { type: String, default: 'm2' } },
    price:    { amount: Number, currency: { type: String, default: 'FCFA' } },
    status:   { type: String, enum: ['PENDING','PUBLISHED','SOLD','RESERVED'], default: 'PUBLISHED' },
    owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    images:   [String],
    features: {
      hasElectricity: Boolean, hasWater: Boolean, hasRoad: Boolean,
      isFenced: Boolean,
      bedrooms:  { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      floor: { type: Number, default: null },
      hasElevator: { type: Boolean, default: false },
      hasBalcony:  { type: Boolean, default: false },
      isFurnished: { type: Boolean, default: false },
      showWindow:  { type: Boolean, default: false },
      zone:        { type: String,  default: '' },
      hasParking:  { type: Boolean, default: false },
      hasGarden:   { type: Boolean, default: false },
      landType:    { type: String,  default: '' },
    },
    amenities: {
      schools:  { count: { type: Number, default: 0 }, names: [String] },
      markets:  { count: { type: Number, default: 0 }, names: [String] },
      stations: { count: { type: Number, default: 0 }, names: [String] },
      bakeries: { count: { type: Number, default: 0 }, names: [String] },
    },
    views:  { type: Number, default: 0 },
    sourceUrl: String,
    scrapedAt: Date,
  },
  { timestamps: true }
);

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
// ───────────────────────────────────────────────────────────────────────────

// ─── HELPERS ───────────────────────────────────────────────────────────────
function detectCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('villa'))       return 'Villa';
  if (t.includes('duplex'))      return 'Duplex';
  if (t.includes('appartement') || t.includes('apartment')) return 'Apartment';
  if (t.includes('studio'))      return 'Studio';
  if (t.includes('chambre') || t.includes('room')) return 'Room';
  if (t.includes('terrain') || t.includes('land') || t.includes('plot')) return 'Land';
  if (t.includes('commercial') || t.includes('boutique') || t.includes('shop')) return 'Commercial Space';
  if (t.includes('bureau') || t.includes('office')) return 'Office';
  if (t.includes('parking'))     return 'Parking';
  return 'House';
}

function extractNumber(text, patterns) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseInt(m[1].replace(/[\s.]/g, ''));
  }
  return null;
}

function detectCity(text) {
  const cities = ['Douala','Yaoundé','Yaounde','Bafoussam','Bamenda','Garoua','Limbe','Kribi','Buea','Ngaoundéré'];
  for (const c of cities) {
    if (text.toLowerCase().includes(c.toLowerCase())) return c === 'Yaounde' ? 'Yaoundé' : c;
  }
  return '';
}
// ───────────────────────────────────────────────────────────────────────────

// ─── EXTRACTION D'UNE PAGE ─────────────────────────────────────────────────
async function scrapePage(page, url) {
  console.log(`\n🌐 Navigation vers ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Attendre que les cartes se chargent
  try {
    await page.waitForSelector(
      'article, [class*="card"], [class*="Card"], [class*="property"], [class*="listing"], .MuiCard-root',
      { timeout: 10000 }
    );
  } catch {
    console.log('  ⚠️  Sélecteur de cartes non trouvé, on essaie quand même…');
  }

  // Scroll pour charger le lazy loading
  await page.evaluate(async () => {
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, 800);
      await new Promise(r => setTimeout(r, 600));
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Extraire les données depuis le DOM rendu
  const properties = await page.evaluate((maxItems) => {
    const results = [];

    // Sélecteurs candidats pour les cartes
    const selectors = [
      'article',
      '.MuiCard-root',
      '[class*="PropertyCard"]',
      '[class*="property-card"]',
      '[class*="listing-card"]',
      '[class*="annonce"]',
    ];

    let cards = [];
    for (const sel of selectors) {
      const found = document.querySelectorAll(sel);
      if (found.length > 2) { cards = Array.from(found); break; }
    }

    // Fallback : chercher des blocs avec prix FCFA
    if (cards.length === 0) {
      const allDivs = Array.from(document.querySelectorAll('div'));
      cards = allDivs.filter(d => {
        const t = d.innerText || '';
        return (t.includes('FCFA') || t.includes('XAF')) && t.length > 50 && t.length < 2000;
      });
    }

    cards = cards.slice(0, maxItems);

    for (const card of cards) {
      const text   = card.innerText || '';
      const html   = card.innerHTML || '';

      // Titre : premier heading ou premier texte long
      let title = '';
      const heading = card.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) title = heading.innerText.trim();
      if (!title) {
        const spans = card.querySelectorAll('p, span, div');
        for (const s of spans) {
          const t = s.innerText?.trim();
          if (t && t.length > 10 && t.length < 150 && !t.match(/^\d/)) { title = t; break; }
        }
      }

      // Image
      let imageUrl = '';
      const img = card.querySelector('img');
      if (img) {
        imageUrl = img.src || img.getAttribute('data-src') || '';
        if (imageUrl.startsWith('/')) imageUrl = 'https://weetyu.com' + imageUrl;
      }

      // Lien
      let sourceUrl = '';
      const link = card.querySelector('a[href*="propert"], a[href*="detail"], a[href*="annonce"], a[href*="logement"]')
                || card.querySelector('a');
      if (link) {
        sourceUrl = link.href || '';
        if (sourceUrl.startsWith('/')) sourceUrl = 'https://weetyu.com' + sourceUrl;
      }

      if (!title || title.length < 5) continue;

      results.push({ title, text, imageUrl, sourceUrl, html });
    }

    return results;
  }, MAX_PER_PAGE);

  // Post-traitement JS (hors page.evaluate pour utiliser nos helpers)
  return properties.map(p => {
    const allText = p.title + ' ' + p.text;

    const price = extractNumber(p.text, [
      /(\d{1,3}(?:[\s.]\d{3})+)\s*(?:FCFA|XAF|CFA)/i,
      /(\d{4,9})\s*(?:FCFA|XAF|CFA)/i,
    ]);

    const surface = extractNumber(p.text, [
      /(\d+)\s*m[²2]/i,
    ]);

    const bedrooms = extractNumber(p.text, [
      /(\d+)\s*(?:chambres?|bedrooms?|pièces?)/i,
    ]);

    const bathrooms = extractNumber(p.text, [
      /(\d+)\s*(?:salles?\s*de\s*bain|bathrooms?|douches?)/i,
    ]);

    const isFurnished = /meublé|furnished/i.test(allText);

    return {
      title:       p.title.substring(0, 200),
      category:    detectCategory(allText),
      description: p.text.substring(0, 1000),
      location: {
        city:     detectCity(allText),
        district: '',
        region:   '',
      },
      surface:  surface ? { value: surface, unit: 'm2' } : undefined,
      price:    price   ? { amount: price, currency: 'FCFA' } : undefined,
      images:   p.imageUrl ? [p.imageUrl] : [],
      features: {
        bedrooms:   bedrooms  || 0,
        bathrooms:  bathrooms || 0,
        isFurnished,
      },
      sourceUrl:  p.sourceUrl,
      scrapedAt:  new Date(),
    };
  });
}
// ───────────────────────────────────────────────────────────────────────────

// ─── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🕷️   WEETYU SCRAPER v2 — Puppeteer + MongoDB');
  console.log('═'.repeat(60));

  // 1. Lancer le navigateur
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
  );

  // 2. Scraper chaque page
  const allProperties = [];
  for (const url of SEARCH_PAGES) {
    try {
      const props = await scrapePage(page, url);
      console.log(`  ✅ ${props.length} annonces extraites`);
      allProperties.push(...props);
    } catch (err) {
      console.error(`  ❌ Erreur sur ${url}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();

  // Dédupliquer par titre
  const seen = new Set();
  const unique = allProperties.filter(p => {
    if (seen.has(p.title)) return false;
    seen.add(p.title);
    return true;
  });

  console.log(`\n📊 Total unique: ${unique.length} propriétés`);

  if (unique.length === 0) {
    console.log('⚠️  Aucune donnée extraite. Le site a peut-être changé de structure.');
    console.log('   → Lancez avec headless:false pour voir ce que le browser voit.');
    return;
  }

  // Aperçu
  console.log('\n📋 Aperçu (3 premières):');
  unique.slice(0, 3).forEach((p, i) => {
    console.log(`\n[${i+1}] ${p.title}`);
    console.log(`    Catégorie: ${p.category} | Ville: ${p.location.city || '?'}`);
    console.log(`    Prix: ${p.price ? p.price.amount.toLocaleString() + ' FCFA' : 'N/A'}`);
    console.log(`    Surface: ${p.surface ? p.surface.value + ' m²' : 'N/A'}`);
    console.log(`    Image: ${p.images[0] ? '✅' : '❌'}`);
  });

  // 3. Importer dans MongoDB
  console.log('\n💾 Connexion MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connecté !');

    // Récupérer un owner valide si DEFAULT_OWNER_ID est un placeholder
    let ownerId = new mongoose.Types.ObjectId(DEFAULT_OWNER_ID);

    // Tentative de récupérer le premier admin/user existant
    try {
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ _id: mongoose.Schema.Types.ObjectId }));
      const firstUser = await mongoose.connection.db.collection('users').findOne({});
      if (firstUser) {
        ownerId = firstUser._id;
        console.log(`👤 Owner trouvé: ${ownerId}`);
      }
    } catch { /* pas grave */ }

    let imported = 0, skipped = 0, errors = 0;

    for (const prop of unique) {
      try {
        const exists = await Property.findOne({
          $or: [
            { title: prop.title },
            ...(prop.sourceUrl ? [{ sourceUrl: prop.sourceUrl }] : []),
          ],
        });

        if (exists) {
          skipped++;
          continue;
        }

        await Property.create({ ...prop, owner: ownerId });
        imported++;
        console.log(`  ✅ Importé: ${prop.title.substring(0, 50)}`);
      } catch (err) {
        errors++;
        console.error(`  ❌ Erreur import "${prop.title.substring(0, 40)}": ${err.message}`);
      }
    }

    console.log('\n📊 Résumé final:');
    console.log(`   ✅ Importés : ${imported}`);
    console.log(`   ⏭️  Ignorés  : ${skipped} (déjà existants)`);
    console.log(`   ❌ Erreurs  : ${errors}`);

    await mongoose.disconnect();
  } catch (dbErr) {
    console.error('❌ Erreur MongoDB:', dbErr.message);
    console.error('\n👉 Solution: Allez sur MongoDB Atlas → Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)');
  }

  console.log('\n✨ Terminé !');
}

main().catch(console.error);
