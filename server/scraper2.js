// scraper2.js
import puppeteer from 'puppeteer';
import fs from 'fs';

const url = 'https://keur-immo.com/cameroun/';

async function fetchHTML() {
  let browser;
  try {
    console.log('🚀 Lancement du navigateur...');
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Augmenter le timeout
    page.setDefaultNavigationTimeout(120000);
    page.setDefaultTimeout(120000);
    
    // Configurer le User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('📡 Chargement de la page...');
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', // Plus rapide que 'networkidle2'
      timeout: 60000 
    });
    
    // Attendre un peu que le contenu se charge
    await page.waitForTimeout(3000);
    
    console.log('💾 Sauvegarde du HTML...');
    const html = await page.content();
    fs.writeFileSync('page-complete.html', html);
    
    console.log(`✅ HTML sauvegardé dans page-complete.html`);
    console.log(`📊 Taille: ${html.length} caractères`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

fetchHTML();