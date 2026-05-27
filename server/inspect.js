/**
 * inspector.js — Run this FIRST to detect the correct CSS selectors
 * on keur-immo.com/cameroun and print a selector report.
 *
 * Usage: node inspector.js
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

const URL = 'https://keur-immo.com/cameroun/';

const client = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9',
  },
  timeout: 20000
});

async function inspect() {
  console.log(`Fetching ${URL}…`);
  const { data: html } = await client.get(URL);

  writeFileSync('page-dump.html', html);
  console.log('✓ Raw HTML saved to page-dump.html');

  const $ = cheerio.load(html);

  // 1. All unique class names that might relate to listings
  const relevantClasses = new Set();
  $('[class]').each((_, el) => {
    const cls = $(el).attr('class') || '';
    cls.split(/\s+/).forEach(c => {
      if (/prop|list|annonce|immob|bien|card|item|entry|post/i.test(c))
        relevantClasses.add(c);
    });
  });

  console.log('\n📌 Relevant CSS classes found:');
  [...relevantClasses].forEach(c => console.log('  .'+c));

  // 2. Count articles / sections
  console.log(`\n📌 article tags: ${$('article').length}`);
  console.log(`📌 section tags: ${$('section').length}`);
  console.log(`📌 .property*: ${$('[class*="property"]').length}`);
  console.log(`📌 .listing*: ${$('[class*="listing"]').length}`);
  console.log(`📌 .annonce*: ${$('[class*="annonce"]').length}`);
  console.log(`📌 .bien*: ${$('[class*="bien"]').length}`);

  // 3. Try common selectors
  const candidates = [
    '.property-item', '.listing-item', 'article.property',
    '.wpf-listing-item', '.rh_list_view__wrap', 'article',
    '[class*="property-card"]', '[class*="listing-card"]',
    '.annonce-item', '.property', '.listing'
  ];

  console.log('\n📌 Selector hit counts:');
  candidates.forEach(sel => {
    const count = $(sel).length;
    if (count > 0) console.log(`  "${sel}": ${count} elements`);
  });

  // 4. Pagination
  const paginationLinks = $('a[href*="/page/"], a.page-numbers, .pagination a');
  console.log(`\n📌 Pagination links found: ${paginationLinks.length}`);
  paginationLinks.each((_, a) => console.log('  href:', $(a).attr('href'), '| text:', $(a).text().trim()));

  // 5. Sample first article/property HTML
  const first = $('article, .property-item, .listing-item').first();
  if (first.length) {
    console.log('\n📌 First card HTML (truncated):');
    console.log(first.html()?.substring(0, 1500));
  }

  console.log('\n✅ Inspection complete. Update CARD_SELECTOR in scraper.js if needed.');
}

inspect().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});