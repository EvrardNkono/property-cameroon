// server/routes/sitemap.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');
  
  // Pages statiques
  const staticPages = [
    { url: '/', priority: 1.0 },
    { url: '/real-estate', priority: 0.9 },
    { url: '/agriculture', priority: 0.9 },
    { url: '/agriculture/livestock', priority: 0.8 },
    { url: '/agriculture/products', priority: 0.8 },
    { url: '/agriculture/marketplace', priority: 0.8 },
    { url: '/global-sourcing', priority: 0.7 },
    { url: '/experts', priority: 0.7 },
    { url: '/blog', priority: 0.6 },
  ];
  
  // Récupérer les pages dynamiques depuis MongoDB
  let dynamicPages = [];
  try {
    // Récupérer toutes les catégories livestock
    const categories = await mongoose.connection.db
      .collection('livestockcategories')
      .find({ isActive: true })
      .toArray();
    
    categories.forEach(cat => {
      dynamicPages.push({
        url: `/agriculture/livestock/${cat.slug}`,
        priority: 0.7
      });
    });
    
    // Récupérer les propriétés
    const properties = await mongoose.connection.db
      .collection('properties')
      .find({ status: 'PUBLISHED' })
      .limit(100)
      .toArray();
    
    properties.forEach(prop => {
      dynamicPages.push({
        url: `/real-estate/${prop._id}`,
        priority: 0.6
      });
    });
    
  } catch (err) {
    console.error('Error fetching dynamic pages:', err);
  }
  
  // Générer le XML
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Pages statiques
  staticPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>https://propertycameroon.com${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  // Pages dynamiques
  dynamicPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>https://propertycameroon.com${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += '</urlset>';
  
  res.send(xml);
});

export default router;