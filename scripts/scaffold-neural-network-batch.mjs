import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'neural-network-batch.json'), 'utf8'));
const templates = {
  'index.html': path.join(import.meta.dirname, 'neural-network-batch-index.html'),
  'styles.css': path.join(import.meta.dirname, 'neural-network-batch.css'),
  'app.js': path.join(import.meta.dirname, 'neural-network-batch-app.js'),
};
const catalogPath = path.join(root, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const slugs = new Set(manifest.map((entry) => entry.slug));

if (slugs.size !== manifest.length) throw new Error('Duplicate neural-network batch slug');
for (const source of Object.values(templates)) {
  if (!fs.existsSync(source)) throw new Error(`Missing template: ${source}`);
}

for (const entry of manifest) {
  const directory = path.join(root, entry.slug);
  fs.mkdirSync(directory, { recursive: true });
  for (const [filename, source] of Object.entries(templates)) fs.copyFileSync(source, path.join(directory, filename));
}

const existing = catalog.filter((entry) => !slugs.has(entry.slug));
const expanded = [
  ...existing,
  ...manifest.map((entry) => ({
    ...entry,
    source: `https://github.com/wuhy80/algorithm/tree/main/${entry.slug}/`,
    demo: `https://wuhy80.github.io/algorithm/${entry.slug}/`,
  })),
];

fs.writeFileSync(catalogPath, `${JSON.stringify(expanded, null, 2)}\n`);
console.log(`Scaffolded ${manifest.length} neural-network demos; catalog now has ${expanded.length} entries`);
