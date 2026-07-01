#!/usr/bin/env node
/**
 * Live smoke test: hits the Content Delivery API the same way the adapter does
 * and prints what came back. Proves the space id + delivery token + published
 * content all line up. Run with `pnpm cf:smoke` (loads .env.local).
 */
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const TOKEN = process.env.CONTENT_DELIVERY_API_KEY;

if (!SPACE_ID || !TOKEN) {
  console.error('Missing CONTENTFUL_SPACE_ID or CONTENT_DELIVERY_API_KEY');
  process.exit(1);
}

const base = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENV}`;
const headers = { Authorization: `Bearer ${TOKEN}` };

const devices = await fetch(`${base}/entries?content_type=device&limit=100`, { headers }).then((r) => r.json());
console.log(`device entries: ${devices.total}`);
for (const d of devices.items) console.log(`  - ${d.fields.slug} (${d.fields.name})`);

const page = await fetch(`${base}/entries?content_type=page&fields.slug=home&include=2`, { headers }).then((r) => r.json());
const home = page.items?.[0];
console.log(`\npage "home" found: ${Boolean(home)}`);
if (home) {
  console.log(`  sections: ${home.fields.sections?.length ?? 0}`);
  console.log(`  linked entries in includes: ${page.includes?.Entry?.length ?? 0}`);
  console.log(`  linked assets in includes: ${page.includes?.Asset?.length ?? 0}`);
}
