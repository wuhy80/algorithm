import fs from 'node:fs';
import path from 'node:path';
import { buildLearningGuide } from './learning-guide.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalogPath = path.join(root, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const checkOnly = process.argv.includes('--check');

const categoryOrder = [
  '查找、排序与算法技巧','图算法、网络流与回溯','回溯、博弈与约束求解','字符串算法','动态规划与序列','贪心、调度与编码','数据结构',
  '高级查询与树分解','空间数据结构','计算几何','数论、变换与线性代数','压缩算法','生成、优化与模拟'
];
const stageNames = {
  1:'基础操作与核心思想',
  2:'常用范式与组合技巧',
  3:'进阶算法与工程结构',
  4:'专项高级算法'
};

function writeGenerated(file, content) {
  const normalized = `${content.trim()}\n`;
  if (checkOnly) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== normalized) {
      throw new Error(`${path.relative(root, file)} is out of date`);
    }
    return;
  }
  fs.writeFileSync(file, normalized);
}

function prerequisiteMarkdown(entry) {
  if (!entry.prerequisites.length) return '无';
  return entry.prerequisites.map((slug) => {
    const prerequisite = catalog.find((item) => item.slug === slug);
    return prerequisite ? `[${prerequisite.name}](${prerequisite.source})` : slug;
  }).join('、');
}

const counts = Object.fromEntries(categoryOrder.map((name) => [name,catalog.filter((entry) => entry.category === name).length]));
const stageCounts = Object.fromEntries(Object.keys(stageNames).map((stage) => [stage,catalog.filter((entry) => entry.stage === Number(stage)).length]));
let readme = `# Algorithm Visualization Lab

一个面向算法与数据结构学习的交互式可视化集合。当前包含 **${catalog.length}** 个独立演示，每个算法单独存放在自己的目录中，可直接在 GitHub Pages 运行。

- [打开可视化目录](https://wuhy80.github.io/algorithm/)
- 算法名称链接到对应 GitHub 源码目录
- “打开演示”链接直接进入对应 Pages 地址
- 每个目录的 README 都提供问题驱动的详细学习指南、伪代码、复杂度推导和自测问题

## 学习路径

| 阶段 | 目标 | 数量 |
| --- | --- | ---: |
${Object.entries(stageNames).map(([stage,name]) => `| ${stage}. ${name} | ${stage === '1' ? '建立查找、排序、线性结构、树与图遍历基础' : stage === '2' ? '掌握贪心、动态规划、字符串、区间与常用图算法' : stage === '3' ? '进入网络流、高级数据结构、几何、数论与离线算法' : '研究复杂匹配、树分解、自动机、变换与动态模拟'} | ${stageCounts[stage]} |`).join('\n')}

## 目录统计

${categoryOrder.map((name) => `- ${name}：${counts[name]} 项`).join('\n')}
`;

for (const category of categoryOrder) {
  readme += `\n## ${category}\n\n| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |\n| --- | --- | --- | --- | --- |\n`;
  for (const entry of catalog.filter((item) => item.category === category)) {
    readme += `| [${entry.name}](${entry.source}) | ${entry.summary} | ${entry.difficulty} | ${prerequisiteMarkdown(entry)} | [打开演示](${entry.demo}) |\n`;
  }
}

readme += `
## 目录规范

每个算法目录至少包含：

- \`index.html\`：页面结构
- \`styles.css\`：独立样式
- \`app.js\`：算法实现与动画逻辑
- \`README.md\`：算法说明、问题定义和复杂度

根目录的 \`catalog.json\` 是首页和文档的统一数据源。更新清单后运行：

\`\`\`powershell
node scripts/generate-readme.mjs
\`\`\`
`;

writeGenerated(path.join(root,'README.md'),readme);
writeGenerated(path.join(root,'catalog-data.js'),`// Generated from catalog.json. Do not edit directly.\nwindow.ALGORITHM_CATALOG = ${JSON.stringify(catalog,null,2)};`);

for (const entry of catalog) {
  writeGenerated(
    path.join(root,entry.slug,'README.md'),
    buildLearningGuide(entry, catalog, prerequisiteMarkdown),
  );
}

console.log(checkOnly ? `Verified ${catalog.length} catalog entries` : `Generated README and catalog data for ${catalog.length} entries`);
