import fs from 'node:fs';
import path from 'node:path';
import { complexityForEntry, problemForEntry } from './learning-guide.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalogPath = path.join(root, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const enriched = catalog.map((entry) => ({
  ...entry,
  problem: problemForEntry(entry),
  complexity: complexityForEntry(entry),
}));

fs.writeFileSync(catalogPath, `${JSON.stringify(enriched, null, 2)}\n`);
console.log(`Enriched learning metadata for ${enriched.length} entries`);
