// scripts/analyze-weetyu.js
import axios from 'axios';
import * as cheerio from 'cheerio';

const WEETYU_URL = 'https://weetyu.com/en';

async function analyzeWebsite() {
  console.log('🔍 Analyzing weetyu.com structure...\n');
  
  try {
    // Récupérer la page principale
    const response = await axios.get(WEETYU_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    console.log('📄 Page title:', $('title').text());
    console.log('\n📋 Classes et structures trouvées:\n');
    
    // Chercher les conteneurs de propriétés
    const possibleContainers = [
      '.property', '.listing', '.item', '.card', 
      '[class*="property"]', '[class*="listing"]', 
      '[class*="item"]', '[class*="card"]'
    ];
    
    possibleContainers.forEach(selector => {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`✅ ${selector}: ${elements.length} éléments trouvés`);
        if (elements.length > 0) {
          const firstElement = elements.first();
          console.log(`   Classes: ${firstElement.attr('class')}`);
          console.log(`   HTML sample: ${firstElement.html()?.substring(0, 200)}...\n`);
        }
      }
    });
    
    // Chercher les URLs de détails
    const links = $('a[href*="/property"], a[href*="/detail"], a[href*="/ad"]');
    console.log(`\n🔗 Liens potentiels vers détails: ${links.length}`);
    links.slice(0, 5).each((i, link) => {
      console.log(`   - ${$(link).attr('href')}`);
    });
    
  } catch (error) {
    console.error('❌ Error analyzing website:', error.message);
  }
}

analyzeWebsite();