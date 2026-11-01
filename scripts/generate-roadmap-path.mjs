// 从 catalog.json 生成 roadmap/path-data.js：精选核心学习主线（编号拓扑序）+ 各阶段扩展主题。
// 用法：node scripts/generate-roadmap-path.mjs
// 生成文件头部带有说明；手工微调会被下一次生成覆盖，请改本脚本或 catalog 元数据。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));

const TARGET_CORE = 100;      // 期望核心规模（闭包补齐后）
const INITIAL_PICK = 96;      // 闭包前的初选数量
const STAGE_FLOOR = 8;        // 每阶段保底入选数
const DIFF_RANK = { '基础': 0, '进阶': 1, '高级': 2 };

// ---------- 图构建 ----------
const bySlug = new Map();
catalog.forEach((entry) => bySlug.set(entry.slug, entry));
const dependents = new Map();
catalog.forEach((entry) => {
  for (const pre of entry.prerequisites || []) {
    if (!dependents.has(pre)) dependents.set(pre, new Set());
    dependents.get(pre).add(entry.slug);
  }
});

// 传递后继数：多少节点直接或间接依赖本节点（关键度）
const depCount = new Map();
function transitiveDependents(slug) {
  if (depCount.has(slug)) return depCount.get(slug);
  depCount.set(slug, 0); // 防环兜底（CI 已保证无环）
  const seen = new Set();
  const stack = [...(dependents.get(slug) || [])];
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    const entry = bySlug.get(cur);
    for (const next of (entry && entry.prerequisites) || []) {
      if (next !== slug && !seen.has(next)) stack.push(next);
    }
  }
  depCount.set(slug, seen.size);
  return seen.size;
}

// 先修链深度（用于偏好浅层基础节点）
const depthMemo = new Map();
function depthOf(slug) {
  if (depthMemo.has(slug)) return depthMemo.get(slug);
  depthMemo.set(slug, 0);
  const entry = bySlug.get(slug);
  let depth = 0;
  for (const pre of (entry && entry.prerequisites) || []) {
    if (bySlug.has(pre)) depth = Math.max(depth, depthOf(pre) + 1);
  }
  depthMemo.set(slug, depth);
  return depth;
}

catalog.forEach((entry) => {
  entry._key = entry.slug;
  entry._dep = transitiveDependents(entry.slug);
  entry._depth = depthOf(entry.slug);
  entry._diff = DIFF_RANK[entry.difficulty] ?? 1;
});

// ---------- 初选 ----------
const rank = (a, b) =>
  (b._dep - a._dep) || (a._diff - b._diff) || (a._depth - b._depth) || a.slug.localeCompare(b.slug);
const sorted = [...catalog].sort(rank);
const core = new Set();
for (const entry of sorted.slice(0, INITIAL_PICK)) core.add(entry.slug);
for (const stage of [1, 2, 3, 4]) {
  const inStage = sorted.filter((e) => e.stage === stage);
  for (const entry of inStage.slice(0, STAGE_FLOOR)) core.add(entry.slug);
}

// 前置闭包：所选节点的全部（传递）前置必须入选，保证编号链完整
const queue = [...core];
while (queue.length) {
  const slug = queue.pop();
  const entry = bySlug.get(slug);
  for (const pre of (entry && entry.prerequisites) || []) {
    if (bySlug.has(pre) && !core.has(pre)) {
      core.add(pre);
      queue.push(pre);
    }
  }
}

// ---------- 拓扑排序（Kahn + 确定性 tie-break）----------
const orderRank = new Map(sorted.map((entry, index) => [entry.slug, index]));
const indegree = new Map();
const children = new Map();
for (const slug of core) {
  const entry = bySlug.get(slug);
  const pres = (entry.prerequisites || []).filter((pre) => core.has(pre));
  indegree.set(slug, pres.length);
  for (const pre of pres) {
    if (!children.has(pre)) children.set(pre, []);
    children.get(pre).push(slug);
  }
}
const ready = [...core].filter((slug) => indegree.get(slug) === 0);
const ordered = [];
while (ready.length) {
  // 取 rank 最小的就绪节点（rank 已按 关键度/难度/深度 排好）
  ready.sort((a, b) => orderRank.get(a) - orderRank.get(b));
  const slug = ready.shift();
  ordered.push(slug);
  for (const child of children.get(slug) || []) {
    indegree.set(child, indegree.get(child) - 1);
    if (indegree.get(child) === 0) ready.push(child);
  }
}
if (ordered.length !== core.size) {
  throw new Error(`拓扑排序不完整：${ordered.length}/${core.size}，疑似出现环`);
}
const orderOf = new Map(ordered.map((slug, index) => [index + 1, slug]));

// ---------- 断言 ----------
for (let order = 1; order <= ordered.length; order++) {
  const slug = orderOf.get(order);
  const entry = bySlug.get(slug);
  for (const pre of (entry.prerequisites || []).filter((p) => core.has(p))) {
    if (!ordered.includes(pre) || ordered.indexOf(pre) >= order - 1) {
      throw new Error(`编号不变量被破坏：${slug}(#${order}) 的前置 ${pre} 不在更小编号位置`);
    }
  }
}
for (const slug of core) {
  const entry = bySlug.get(slug);
  for (const pre of entry.prerequisites || []) {
    if (!core.has(pre)) throw new Error(`闭包不完整：${slug} 的前置 ${pre} 未入选`);
  }
}

// ---------- 输出 ----------
const stageNames = { 1: '基础入门', 2: '进阶技巧', 3: '高级专题', 4: '前沿与综合' };
const stages = [1, 2, 3, 4].map((stage) => {
  const coreItems = ordered
    .map((slug, index) => ({ slug, order: index + 1 }))
    .filter((item) => bySlug.get(item.slug).stage === stage);
  const extensions = catalog
    .filter((entry) => entry.stage === stage && !core.has(entry.slug))
    .sort((a, b) => (a._diff - b._diff) || a.name.localeCompare(b.name, 'zh'))
    .map((entry) => entry.slug);
  return { stage, name: stageNames[stage], core: coreItems, extensions };
});

const header = `// Generated by scripts/generate-roadmap-path.mjs from catalog.json.
// 学习主线：core 为全局编号的拓扑序节点（order 从 1 开始），extensions 为各阶段扩展主题。
// 重跑 node scripts/generate-roadmap-path.mjs 会覆盖本文件的手工修改。
`;
const body = `window.ROADMAP_PATH = ${JSON.stringify(
  { generatedAt: new Date().toISOString().slice(0, 10), coreTotal: ordered.length, stages },
  null,
  1
)};\n`;
fs.writeFileSync(path.join(root, 'roadmap', 'path-data.js'), header + body, 'utf8');

console.log(`核心主线 ${ordered.length} 个节点（目标 ${TARGET_CORE}）：`);
for (const stage of stages) {
  console.log(`  阶段${stage.stage} ${stage.name}: 主线 ${stage.core.length} + 扩展 ${stage.extensions.length}`);
}
if (Math.abs(ordered.length - TARGET_CORE) > 15) {
  console.warn(`⚠ 核心规模偏离目标较多，可调整 INITIAL_PICK（当前 ${INITIAL_PICK}）`);
}
