import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, 'core-batch.json'), 'utf8'),
);
const runtime = path.join(import.meta.dirname, 'core-batch-app.js');
const indexTemplate = path.join(root, 'prefix-sum', 'index.html');
const styleTemplate = path.join(root, 'prefix-sum', 'styles.css');
const catalogPath = path.join(root, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const slugs = new Set(manifest.map((entry) => entry.slug));

if (slugs.size !== manifest.length) throw new Error('Duplicate core batch slug');

for (const entry of manifest) {
  const directory = path.join(root, entry.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.copyFileSync(indexTemplate, path.join(directory, 'index.html'));
  fs.copyFileSync(styleTemplate, path.join(directory, 'styles.css'));
  fs.copyFileSync(runtime, path.join(directory, 'app.js'));
}

const expanded = [
  ...catalog.filter((entry) => !slugs.has(entry.slug)),
  ...manifest.map((entry) => ({
    ...entry,
    source: `https://github.com/wuhy80/algorithm/tree/main/${entry.slug}/`,
    demo: `https://wuhy80.github.io/algorithm/${entry.slug}/`,
  })),
];

fs.writeFileSync(catalogPath, `${JSON.stringify(expanded, null, 2)}\n`);
console.log(`Scaffolded ${manifest.length} core additions; catalog now has ${expanded.length} entries`);
