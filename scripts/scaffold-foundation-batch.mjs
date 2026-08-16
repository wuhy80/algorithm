import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, 'foundation-batch.json'), 'utf8'),
);
const runtime = path.join(import.meta.dirname, 'foundation-batch-app.js');
const indexTemplate = path.join(root, 'prefix-sum', 'index.html');
const styleTemplate = path.join(root, 'prefix-sum', 'styles.css');
const catalogPath = path.join(root, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const slugs = new Set(manifest.map((entry) => entry.slug));

if (slugs.size !== manifest.length) throw new Error('Duplicate foundation batch slug');
if (!fs.existsSync(runtime)) throw new Error('Missing foundation batch runtime');

for (const entry of manifest) {
  const directory = path.join(root, entry.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.copyFileSync(indexTemplate, path.join(directory, 'index.html'));
  fs.copyFileSync(styleTemplate, path.join(directory, 'styles.css'));
  fs.copyFileSync(runtime, path.join(directory, 'app.js'));
}

const adjustments = {
  deque: { stage: 1 },
  'activity-selection': { stage: 1 },
  dijkstra: { stage: 2, prerequisites: ['bfs', 'heap-priority-queue'] },
  'convex-hull': { stage: 2, prerequisites: ['merge-sort'] },
  'coordinate-compression': { stage: 2 },
};

const existing = catalog
  .filter((entry) => !slugs.has(entry.slug))
  .map((entry) => ({ ...entry, ...(adjustments[entry.slug] || {}) }));
const expanded = [
  ...existing,
  ...manifest.map((entry) => ({
    ...entry,
    source: `https://github.com/wuhy80/algorithm/tree/main/${entry.slug}/`,
    demo: `https://wuhy80.github.io/algorithm/${entry.slug}/`,
  })),
];

fs.writeFileSync(catalogPath, `${JSON.stringify(expanded, null, 2)}\n`);
console.log(`Scaffolded ${manifest.length} foundation additions; catalog now has ${expanded.length} entries`);
