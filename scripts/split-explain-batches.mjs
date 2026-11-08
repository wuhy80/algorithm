// 把待精修的 catalog 条目切成分批文件，供多 agent 并行生成 learn 精讲数据。
// 用法：node scripts/split-explain-batches.mjs [批次数，默认 12]
// 产物（learn/explain-batches/）：
//   batch-NN.input.json  该批 slug 的 catalog 条目（agent 输入素材）
//   batch-NN.json        agent 产出文件（初始为空对象占位）
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'learn', 'explain-batches');
const batchCount = Number(process.argv[2]) || 12;

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));

// 现有精修主题（不重做）
const existingSource = fs.readFileSync(path.join(root, 'learn', 'explain-data.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(existingSource, sandbox);
const existing = new Set(Object.keys(sandbox.window.LEARNING_EXPLAIN?.topics || {}));

const pending = catalog.filter((entry) => !existing.has(entry.slug));
if (pending.length < batchCount) throw new Error(`待精修 ${pending.length} 题少于批次数 ${batchCount}`);

fs.mkdirSync(outDir, { recursive: true });
for (const name of fs.readdirSync(outDir)) fs.unlinkSync(path.join(outDir, name));

const perBatch = Math.ceil(pending.length / batchCount);
for (let index = 0; index < batchCount; index++) {
  const slice = pending.slice(index * perBatch, (index + 1) * perBatch);
  if (!slice.length) continue;
  const id = String(index + 1).padStart(2, '0');
  const input = Object.fromEntries(slice.map((entry) => [entry.slug, entry]));
  fs.writeFileSync(path.join(outDir, `batch-${id}.input.json`), JSON.stringify(input, null, 1), 'utf8');
  fs.writeFileSync(path.join(outDir, `batch-${id}.json`), '{}\n', 'utf8');
  console.log(`batch-${id}: ${slice.length} 题 (${slice[0].slug} … ${slice.at(-1).slug})`);
}
console.log(`共 ${pending.length} 题待精修，切成 ${batchCount} 批 → ${outDir}`);
