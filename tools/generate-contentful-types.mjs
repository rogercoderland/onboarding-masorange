#!/usr/bin/env node
/**
 * Regenerate Contentful TypeScript types into
 * `libs/contentful/domain/src/lib/generated`.
 *
 * cf-content-types-generator normally talks to the Content Management API, but
 * our CMA token is not usable, so we read the content model from the Content
 * Delivery API (`/content_types`, which is also public read-only) and feed the
 * generator a local export file. Then we append `.js` to the generated relative
 * imports so they satisfy this workspace's `nodenext` module resolution.
 *
 * Usage: `pnpm cf:types`  (loads CONTENT_DELIVERY_API_KEY + CONTENTFUL_* from .env.local)
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const TOKEN = process.env.CONTENT_DELIVERY_API_KEY;
const OUT_DIR = 'libs/contentful/domain/src/lib/generated';

if (!SPACE_ID || !TOKEN) {
  console.error('Missing CONTENTFUL_SPACE_ID or CONTENT_DELIVERY_API_KEY in the environment.');
  process.exit(1);
}

const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/content_types?limit=100`;
const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
if (!res.ok) {
  console.error(`Failed to fetch content_types: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const { items } = await res.json();
console.log(`Fetched ${items.length} content types from space ${SPACE_ID}.`);

const tmp = mkdtempSync(join(tmpdir(), 'cf-types-'));
const exportFile = join(tmp, 'export.json');
writeFileSync(exportFile, JSON.stringify({ contentTypes: items }, null, 2));

rmSync(OUT_DIR, { recursive: true, force: true });
execFileSync(
  'npx',
  ['cf-content-types-generator', exportFile, '-o', OUT_DIR, '-g', '-r'],
  { stdio: 'inherit' },
);

// nodenext requires explicit .js on relative import specifiers.
for (const file of readdirSync(OUT_DIR).filter((f) => f.endsWith('.ts'))) {
  const path = join(OUT_DIR, file);
  const fixed = readFileSync(path, 'utf8').replace(
    /(from ")(\.\.?\/[^"]+)(")/g,
    (_m, p1, p2, p3) => `${p1}${p2}.js${p3}`,
  );
  writeFileSync(path, fixed);
}
rmSync(tmp, { recursive: true, force: true });
console.log(`Types written to ${OUT_DIR}`);
