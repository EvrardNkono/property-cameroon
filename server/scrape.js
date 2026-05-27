// scrape-simple-manual.js - Version ultra simple
import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const propertySchema = new mongoose.Schema({
  title: String,
  category: String,
  listingType: { type: String, default: 'sale' },
  location: { city: String, district: String, region: String },
  surface: { value: Number, unit: { type: String, default: 'm²' } },
  price: { amount: Number, currency: { type: String, default: 'FCFA' } },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  description: String,
  images: [String],
  features: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    hasBalcony: Boolean,
    isFurnished: Boolean,
    hasParking: Boolean,
    hasGarden: Boolean
  }
});

const Property = mongoose.model('Property', propertySchema);

async function main() {
  console.log('\n🔥 Scraping Facebook - Version manuelle simple\n');
  
  // Lance le navigateur (il va s'ouvrir)
  const browser = await puppeteer.launch({ 
    headless: false,
    userDataDir: './ma_session'  // Garde ta connexion pour toujours
  });
  
  const page = await browser.newPage();
  
  // Va sur la page Facebook
  await page.goto('https://www.facebook.com/profile.php?id=100080356824823');
  
  console.log('\n⚠️ CONNECTE-TOI MANUELLEMENT dans le navigateur');
  console.log('➡️  Entre ton email et mot de passe');
  console.log('➡️  Clique sur "Se connecter"');
  console.log('\n✅ Quand tu es CONNECTÉ et que tu vois les annonces,');
  console.log('   appuie sur ENTER dans ce terminal pour continuer...\n');
  
  // Attend que l'utilisateur appuie sur Enter
  await new Promise(resolve => process.stdin.once('data', resolve));
  
  console.log('\n📜 Scroll pour charger les annonces...');
  for(let i = 0; i < 6; i++) {
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));
    console.log(`  Scroll ${i+1}/6`);
  }
  
  // Récupère les posts
  const posts = await page.evaluate(() => {
    const results = [];
    const articles = document.querySelectorAll('div[role="article"]');
    
    for(let art of articles) {
      const text = art.innerText;
      if(text && text.length > 100 && 
         /appartement|maison|studio|chambre|villa|terrain|bureau/i.test(text)) {
        results.push(text.substring(0, 1500));
      }
      if(results.length >= 20) break;
    }
    return results;
  });
  
  console.log(`\n📊 ${posts.length} annonces trouvées\n`);
  
  if(posts.length === 0) {
    console.log('❌ Aucune annonce. Vérifie que tu es bien sur la page du profil.');
    await browser.close();
    return;
  }
  
  // Connexion MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('💾 Connecté à MongoDB\n');
  
  let saved = 0;
  for(let [i, post] of posts.entries()) {
    console.log(`\n📝 [${i+1}/${posts.length}] Traitement...`);
    console.log(`   ${post.substring(0, 80)}...`);
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: `
          Extrais les infos de cette annonce en JSON:
          {"title": "titre", "category": "Appartement|Maison|Studio|Chambre", "price": nombre, "surface": nombre}
          
          Annonce: ${post}
        `}],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });
      
      const data = JSON.parse(completion.choices[0].message.content);
      
      const property = new Property({
        title: data.title || post.substring(0, 100),
        category: data.category || 'Appartement',
        owner: new mongoose.Types.ObjectId(),
        description: post,
        price: { amount: data.price || 0 },
        surface: { value: data.surface || 0 },
        features: {
          bedrooms: data.category === 'Studio' ? 1 : (data.category === 'Appartement' ? 2 : (data.category === 'Maison' ? 3 : 0)),
          bathrooms: data.category === 'Studio' ? 1 : (data.category === 'Appartement' ? 2 : (data.category === 'Maison' ? 2 : 0)),
          hasBalcony: data.category === 'Studio',
          hasParking: data.category === 'Maison',
          hasGarden: data.category === 'Maison'
        }
      });
      
      await property.save();
      saved++;
      console.log(`   ✅ Sauvegardé: ${property.title.substring(0, 50)}`);
    } catch(err) {
      console.log(`   ❌ Erreur: ${err.message}`);
    }
  }
  
  console.log(`\n🎉 Terminé! ${saved}/${posts.length} biens sauvegardés`);
  console.log('\n💡 Prochaine fois, tu seras déjà connecté automatiquement!');
  
  await browser.close();
  await mongoose.disconnect();
}

main().catch(console.error);