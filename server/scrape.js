// scrape.js - Version avec sélecteurs Facebook à jour
import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialisation Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Schéma Property
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['House', 'Villa', 'Duplex', 'Apartment', 'Studio', 'Room', 'Land', 
           'Agricultural Land', 'Commercial Space', 'Office', 'Warehouse', 'Shop', 'Industrial Space', 'Parking'], 
    required: true 
  },
  listingType: { type: String, enum: ['sale', 'rent'], default: 'sale', required: true },
  location: {
    city: String,
    district: String,
    region: String,
    coordinates: { lat: Number, lng: Number }
  },
  surface: { value: Number, unit: { type: String, default: 'm²' } },
  price: { amount: Number, currency: { type: String, default: 'FCFA' } },
  status: { type: String, enum: ['PENDING', 'PUBLISHED', 'SOLD', 'RESERVED'], default: 'PENDING' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  images: [String],
  features: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    hasBalcony: { type: Boolean, default: false },
    isFurnished: { type: Boolean, default: false },
    hasParking: { type: Boolean, default: false },
    hasGarden: { type: Boolean, default: false },
    floor: { type: Number, default: null },
    hasElevator: { type: Boolean, default: false }
  },
  views: { type: Number, default: 0 }
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

const randomDelay = (min = 2000, max = 5000) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// Fonction d'extraction avec Groq
async function extractPropertyWithAI(postText, postImages = []) {
  const prompt = `
    Analyse cette annonce immobilière et retourne un JSON strictement selon ce format:
    {
      "title": "titre court de l'annonce",
      "category": "Apartment|House|Studio|Room|Villa|Land|Office|Commercial Space",
      "listingType": "sale|rent",
      "price": { "amount": nombre, "currency": "FCFA" },
      "surface": { "value": nombre, "unit": "m²" },
      "location": { "city": "ville", "district": "quartier", "region": "région" },
      "features": {
        "bedrooms": nombre,
        "bathrooms": nombre,
        "hasBalcony": boolean,
        "isFurnished": boolean,
        "hasParking": boolean,
        "hasGarden": boolean
      },
      "description": "description complète"
    }
    
    Règles métier:
    - Chambre (Room) → bedrooms: 0
    - Studio → bedrooms: 1, bathrooms: 1, hasBalcony: true
    - Appartement → bedrooms: 2, bathrooms: 2
    - Maison → bedrooms: 3, bathrooms: 2, hasParking: true, hasGarden: true
    
    Annonce: ${postText.substring(0, 1500)}
    
    Réponds UNIQUEMENT avec le JSON.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return result;
  } catch (error) {
    console.error('Erreur Groq:', error.message);
    return null;
  }
}

// Fonction de connexion automatique à Facebook (sélecteurs mis à jour)
async function loginToFacebook(page) {
  console.log('🔐 Tentative de connexion automatique...');
  
  // Aller à la page de login
  await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2', timeout: 60000 });
  await randomDelay(3000, 5000);
  
  // Attendre que le formulaire soit chargé
  await page.waitForSelector('input[type="text"], input[name="email"], input#email', { timeout: 10000 });
  
  // Sélecteurs multiples pour l'email (au cas où)
  const emailSelectors = ['input[name="email"]', 'input#email', 'input[type="text"]'];
  let emailField = null;
  for(const selector of emailSelectors) {
    emailField = await page.$(selector);
    if(emailField) break;
  }
  
  if(emailField) {
    await emailField.click({ clickCount: 3 }); // Sélectionner tout le texte
    await emailField.type(process.env.FACEBOOK_EMAIL, { delay: 50 });
    console.log('✅ Email saisi');
  } else {
    console.error('❌ Champ email non trouvé');
    return false;
  }
  
  await randomDelay(500, 1000);
  
  // Sélecteurs pour le mot de passe
  const passwordSelectors = ['input[name="pass"]', 'input#pass', 'input[type="password"]'];
  let passwordField = null;
  for(const selector of passwordSelectors) {
    passwordField = await page.$(selector);
    if(passwordField) break;
  }
  
  if(passwordField) {
    await passwordField.click({ clickCount: 3 });
    await passwordField.type(process.env.FACEBOOK_PASSWORD, { delay: 50 });
    console.log('✅ Mot de passe saisi');
  } else {
    console.error('❌ Champ mot de passe non trouvé');
    return false;
  }
  
  await randomDelay(500, 1000);
  
  // Chercher et cliquer sur le bouton de connexion
  const buttonSelectors = ['button[name="login"]', 'button[type="submit"]', '#loginbutton', 'input[value="Log In"]'];
  let loginButton = null;
  for(const selector of buttonSelectors) {
    loginButton = await page.$(selector);
    if(loginButton) break;
  }
  
  if(loginButton) {
    await loginButton.click();
    console.log('⏳ Connexion en cours...');
  } else {
    // Alternative: appuyer sur Enter
    await page.keyboard.press('Enter');
    console.log('⏳ Connexion par Enter...');
  }
  
  // Attendre la redirection
  await randomDelay(5000, 8000);
  
  // Vérifier la connexion
  const currentUrl = page.url();
  console.log(`📍 URL après connexion: ${currentUrl}`);
  
  if (currentUrl.includes('login') || currentUrl.includes('checkpoint')) {
    console.error('❌ Échec de connexion. Vérifiez vos identifiants dans .env');
    
    // Capture d'écran pour debug
    await page.screenshot({ path: 'login-error.png' });
    console.log('📸 Capture d\'écran sauvegardée: login-error.png');
    return false;
  }
  
  console.log('✅ Connecté avec succès!');
  return true;
}

async function scrapeFacebookPage(pageUrl, maxProperties = 20) {
  console.log('🚀 Lancement du scraping avec connexion auto...');
  
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './facebook_session',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--start-maximized'
    ]
  });

  const page = await browser.newPage();
  
  // Masquer la détection
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.evaluateOnNewDocument(() => {
    delete navigator.__webdriver;
    delete navigator.__selenium;
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  // Connexion
  const loginSuccess = await loginToFacebook(page);
  if (!loginSuccess) {
    console.log('🔁 Tentative avec session existante...');
    // Essayer d'accéder directement à la page cible
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await randomDelay(3000, 5000);
  }
  
  // Vérifier si on est sur la bonne page
  let currentUrl = page.url();
  if (!currentUrl.includes('profile.php?id=100080356824823')) {
    console.log(`🔄 Navigation vers la page cible: ${pageUrl}`);
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await randomDelay(3000, 5000);
  }
  
  // Scroller pour charger les posts
  console.log('📜 Défilement pour charger les posts...');
  for(let i = 0; i < 8; i++) {
    try {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await randomDelay(3000, 5000);
      console.log(`  Scroll ${i+1}/8`);
    } catch (err) {
      console.log(`  Scroll ${i+1} ignoré`);
    }
  }
  
  // Extraction des posts
  console.log('🔍 Extraction des annonces...');
  const posts = await page.evaluate(() => {
    const items = [];
    
    // Sélecteurs multiples pour les posts Facebook (version 2026)
    const selectors = [
      'div[role="article"]',
      'div[data-ad-preview="message"]',
      'div[data-pagelet="FeedUnit_0"]',
      'div.x1y1aw1k.x1sxyh0.xdg9m1h', // Classes récentes
      'div[class*="feed"]',
      'div[class*="post"]'
    ];
    
    let allDivs = [];
    for(const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if(elements.length > 0) {
        allDivs = Array.from(elements);
        break;
      }
    }
    
    if(allDivs.length === 0) {
      // Fallback: tous les divs avec du texte
      allDivs = Array.from(document.querySelectorAll('div')).filter(div => 
        div.innerText && div.innerText.length > 100
      );
    }
    
    for(const article of allDivs) {
      const text = article.innerText || '';
      if(text.length > 100 && (
        text.match(/appartement|maison|studio|chambre|villa|terrain|bureau|local|vends?|loue|location|F\d|pièces?/i)
      )) {
        const images = [];
        const imgs = article.querySelectorAll('img');
        for(const img of imgs) {
          const src = img.src;
          if(src && src.startsWith('https') && 
             !src.includes('emoji') && 
             !src.includes('profile') &&
             !src.includes('_c.gif')) {
            images.push(src);
          }
        }
        
        // Nettoyer le texte
        const cleanText = text
          .replace(/\s+/g, ' ')
          .replace(/Voir plus/g, '')
          .trim();
        
        items.push({
          text: cleanText.substring(0, 2000),
          images: images.slice(0, 5)
        });
        
        if(items.length >= 30) break;
      }
    }
    return items;
  }).catch(err => {
    console.error('Erreur extraction:', err);
    return [];
  });
  
  console.log(`📊 ${posts.length} annonces immobilières détectées`);
  
  if(posts.length === 0) {
    console.log('❌ Aucune annonce trouvée.');
    console.log('💡 Conseil: Vérifiez que la page contient bien des annonces immobilières');
    await browser.close();
    return;
  }
  
  const propertiesToProcess = posts.slice(0, maxProperties);
  
  // Connexion MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('💾 Connecté à MongoDB\n');
  
  let saved = 0;
  for(const [index, post] of propertiesToProcess.entries()) {
    console.log(`\n📝 [${index+1}/${propertiesToProcess.length}] Traitement...`);
    console.log(`   Texte: ${post.text.substring(0, 100)}...`);
    
    const extracted = await extractPropertyWithAI(post.text, post.images);
    
    if(extracted && extracted.category) {
      const propertyData = {
        title: extracted.title || post.text.split('\n')[0].substring(0, 150),
        category: extracted.category,
        listingType: extracted.listingType || 'sale',
        location: {
          city: extracted.location?.city || 'Yaoundé',
          district: extracted.location?.district || '',
          region: extracted.location?.region || 'Centre'
        },
        surface: extracted.surface || { value: 0, unit: 'm²' },
        price: extracted.price || { amount: 0, currency: 'FCFA' },
        description: extracted.description || post.text.substring(0, 500),
        images: post.images,
        features: {
          bedrooms: extracted.features?.bedrooms || 0,
          bathrooms: extracted.features?.bathrooms || 0,
          hasBalcony: extracted.features?.hasBalcony || false,
          isFurnished: extracted.features?.isFurnished || false,
          hasParking: extracted.features?.hasParking || false,
          hasGarden: extracted.features?.hasGarden || false
        },
        owner: new mongoose.Types.ObjectId(),
        status: 'PUBLISHED'
      };
      
      try {
        const property = new Property(propertyData);
        await property.save();
        saved++;
        console.log(`   ✅ Sauvegardé: ${propertyData.title.substring(0, 50)}`);
      } catch(err) {
        console.error(`   ❌ Erreur sauvegarde: ${err.message}`);
      }
    } else {
      console.log(`   ⚠️ Impossible d'extraire les données`);
    }
    
    await randomDelay(1500, 2500);
  }
  
  console.log(`\n🎉 Terminé! ${saved}/${propertiesToProcess.length} biens sauvegardés`);
  await browser.close();
  await mongoose.disconnect();
}

// Lancement
const PAGE_URL = 'https://www.facebook.com/profile.php?id=100080356824823';
scrapeFacebookPage(PAGE_URL, 20).catch(console.error);