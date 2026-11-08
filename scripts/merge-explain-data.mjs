// 合并 agent 产出的精讲批次到 learn/explain-data.js，并做结构/语法校验。
// 用法：node scripts/merge-explain-data.mjs [--check]
//   --check  只校验所有批次与现有数据，不写文件
// 校验项：slug 存在于 catalog；brute/bruteCode 非空；steps 为 3-8 条；bruteCode 可通过 Python 编译。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'learn', 'explain-data.js');
const batchDir = path.join(root, 'learn', 'explain-batches');
const checkOnly = process.argv.includes('--check');

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const catalogSlugs = new Set(catalog.map((entry) => entry.slug));

// 现有精修数据（合并时优先保留）
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(dataFile, 'utf8'), sandbox);
const existingData = sandbox.window.LEARNING_EXPLAIN;
const topics = { ...(existingData.topics || {}) };
const categoryFallback = existingData.categoryFallback || {};

function compilePython(code, slug) {
  try {
    // 只做语法编译，不执行代码
    execFileSync('python', ['-c', "import sys; compile(sys.stdin.read(), 'brute.py', 'exec')"], {
      input: code, timeout: 15000, stdio: ['pipe', 'pipe', 'pipe']
    });
    return null;
  } catch (error) {
    return `${slug}: bruteCode 无法通过 Python 编译 — ${String(error.stderr || error.message).slice(0, 200)}`;
  }
}

const errors = [];
let added = 0;
let pythonChecked = 0;

if (fs.existsSync(batchDir)) {
  const batchFiles = fs.readdirSync(batchDir).filter((name) => /^batch-\d+\.json$/.test(name)).sort();
  for (const name of batchFiles) {
    const batch = JSON.parse(fs.readFileSync(path.join(batchDir, name), 'utf8'));
    const slugs = Object.keys(batch);
    if (!slugs.length) continue;
    for (const slug of slugs) {
      const entry = batch[slug];
      if (!catalogSlugs.has(slug)) { errors.push(`${name}: 未知 slug ${slug}`); continue; }
      if (typeof entry?.brute !== 'string' || entry.brute.trim().length < 40) { errors.push(`${name}/${slug}: brute 缺失或过短`); continue; }
      if (typeof entry?.bruteCode !== 'string' || !entry.bruteCode.includes('def ')) { errors.push(`${name}/${slug}: bruteCode 缺失`); continue; }
      const steps = entry?.walkthrough?.steps;
      if (!Array.isArray(steps) || steps.length < 3 || steps.length > 8 || steps.some((s) => typeof s !== 'string' || !s.trim())) {
        errors.push(`${name}/${slug}: walkthrough.steps 需为 3-8 条非空字符串`); continue;
      }
      if (typeof entry?.walkthrough?.input !== 'string' || !entry.walkthrough.input.trim()) {
        errors.push(`${name}/${slug}: walkthrough.input 缺失`); continue;
      }
      const pythonError = compilePython(entry.bruteCode, `${name}/${slug}`);
      if (pythonError) { errors.push(pythonError); continue; }
      pythonChecked++;
      if (!topics[slug]) { topics[slug] = entry; added++; }
    }
  }
}

const covered = catalog.filter((entry) => topics[entry.slug]).length;
console.log(`精修覆盖：${covered}/${catalog.length}（本次新增 ${added}，bruteCode 编译通过 ${pythonChecked}）`);

if (errors.length) {
  console.error(`\n校验失败 ${errors.length} 项：`);
  for (const message of errors.slice(0, 30)) console.error('  ' + message);
  process.exit(1);
}

if (checkOnly) {
  console.log('校验通过（未写文件）');
} else {
  const ordered = {};
  for (const entry of catalog) {
    if (topics[entry.slug]) ordered[entry.slug] = topics[entry.slug];
  }
  const header = '/* 结构化讲解页数据：每个主题给出「先想暴力解」与一个具体输入的逐步推演。\n'
    + ' * 由 scripts/merge-explain-data.mjs 合并生成（learn/explain-batches/ 为中间产物，合并后删除）。\n'
    + ' * 纯数据文件，无依赖，挂载到 window.LEARNING_EXPLAIN 供讲解页读取。 */\n';
  const body = `window.LEARNING_EXPLAIN = ${JSON.stringify({ topics: ordered, categoryFallback }, null, 1)};\n`;
  fs.writeFileSync(dataFile, header + body, 'utf8');
  console.log(`已写入 ${dataFile}（${Object.keys(ordered).length} 个主题）`);
}
