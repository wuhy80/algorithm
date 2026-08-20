import fs from 'node:fs';
import path from 'node:path';
import { buildLearningGuide } from './learning-guide.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalogPath = path.join(root, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const customGuidePath = path.join(root, 'scripts', 'custom-learning-guides.json');
const customGuideSlugs = JSON.parse(fs.readFileSync(customGuidePath, 'utf8'));
const customGuideSet = new Set(customGuideSlugs);
const checkOnly = process.argv.includes('--check');

const categoryOrder = [
  '查找、排序与算法技巧','图算法、网络流与回溯','回溯、博弈与约束求解','字符串算法','动态规划与序列','贪心、调度与编码','数据结构',
  '高级查询与树分解','空间数据结构','计算几何','数论、变换与线性代数','压缩算法','生成、优化与模拟','机器学习与神经网络'
];
const stageNames = {
  1:'基础操作与核心思想',
  2:'常用范式与组合技巧',
  3:'进阶算法与工程结构',
  4:'专项高级算法'
};
const categoryDisplayNames = {
  '图算法、网络流与回溯':'图算法、树与网络流'
};

if (customGuideSet.size !== customGuideSlugs.length) {
  throw new Error('scripts/custom-learning-guides.json contains duplicate slugs');
}
for (const slug of customGuideSet) {
  if (!catalog.some((entry) => entry.slug === slug)) {
    throw new Error(`Unknown custom learning guide: ${slug}`);
  }
}

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
- [打开 Pages 学习指南](https://wuhy80.github.io/algorithm/guides/)
- [打开在线题库](https://wuhy80.github.io/algorithm/problems/)
- [打开工业大模型专题](https://wuhy80.github.io/algorithm/industrial-ai/)
- 算法名称链接到对应 GitHub 源码目录
- “打开演示”链接直接进入对应 Pages 地址
- 每个目录的 README 都提供问题驱动的详细学习指南、伪代码、复杂度推导和自测问题

## 工业大模型专题

industrial-ai/ 是面向设备运维、生产计划和工艺优化的独立专题，包含剩余使用寿命、产量预测、异常检测、自来水厂加药预测和维护决策五个可调参数演示。页面使用透明基线帮助理解数据链路，目录内同时提供 Python 参考实现、建模假设、风险边界和升级到 TCN、TFT、PatchTST 及时序基础模型的路径。

## 学习路径

| 阶段 | 目标 | 数量 |
| --- | --- | ---: |
${Object.entries(stageNames).map(([stage,name]) => `| ${stage}. ${name} | ${stage === '1' ? '建立查找、排序、线性结构、树、图遍历与神经元基础' : stage === '2' ? '掌握贪心、动态规划、字符串、图算法与梯度训练' : stage === '3' ? '进入高级数据结构、几何、数论及 CNN、RNN、注意力等专用架构' : '研究复杂匹配、树分解、自动机、生成模型与动态模拟'} | ${stageCounts[stage]} |`).join('\n')}

### 跨分类推荐路线

下列路线按依赖关系组织，不要求把同一分类全部学完后再进入下一类：

| 方向 | 建议顺序 |
| --- | --- |
| 线性结构 | [静态数组](https://github.com/wuhy80/algorithm/tree/main/static-array/) → [数组操作](https://github.com/wuhy80/algorithm/tree/main/array-operations/) → [动态数组](https://github.com/wuhy80/algorithm/tree/main/dynamic-array/) / [链表](https://github.com/wuhy80/algorithm/tree/main/linked-list/) → [栈](https://github.com/wuhy80/algorithm/tree/main/stack/) / [队列](https://github.com/wuhy80/algorithm/tree/main/queue/) / [双端队列](https://github.com/wuhy80/algorithm/tree/main/deque/) → [哈希表](https://github.com/wuhy80/algorithm/tree/main/hash-table/) |
| 查找与排序 | [线性查找](https://github.com/wuhy80/algorithm/tree/main/linear-search/) → [二分查找](https://github.com/wuhy80/algorithm/tree/main/binary-search/) → [插入排序](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/) → [归并排序](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) / [快速排序](https://github.com/wuhy80/algorithm/tree/main/quick-sort/) → [快速选择](https://github.com/wuhy80/algorithm/tree/main/quickselect/) |
| 递归与树 | [递归与调用栈](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) → [二叉树基础](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/) → [前序](https://github.com/wuhy80/algorithm/tree/main/preorder-traversal/) / [中序](https://github.com/wuhy80/algorithm/tree/main/inorder-traversal/) / [后序](https://github.com/wuhy80/algorithm/tree/main/postorder-traversal/) / [层序](https://github.com/wuhy80/algorithm/tree/main/level-order-traversal/) → [二叉搜索树](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) → [LCA](https://github.com/wuhy80/algorithm/tree/main/lowest-common-ancestor/) |
| 字符串 | [朴素匹配](https://github.com/wuhy80/algorithm/tree/main/naive-string-search/) → [KMP](https://github.com/wuhy80/algorithm/tree/main/kmp-search/) / [Z 算法](https://github.com/wuhy80/algorithm/tree/main/z-algorithm/) / [Rabin-Karp](https://github.com/wuhy80/algorithm/tree/main/rabin-karp/) → [Trie](https://github.com/wuhy80/algorithm/tree/main/trie/) → [Aho-Corasick](https://github.com/wuhy80/algorithm/tree/main/aho-corasick/) → [后缀数组与 LCP](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/) / [后缀自动机](https://github.com/wuhy80/algorithm/tree/main/suffix-automaton/) |
| 动态规划 | [斐波那契记忆化](https://github.com/wuhy80/algorithm/tree/main/fibonacci-memoization/) → [爬楼梯](https://github.com/wuhy80/algorithm/tree/main/climbing-stairs/) / [网格路径](https://github.com/wuhy80/algorithm/tree/main/grid-path-dp/) → [背包](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) → [LCS](https://github.com/wuhy80/algorithm/tree/main/longest-common-subsequence/) / [编辑距离](https://github.com/wuhy80/algorithm/tree/main/edit-distance/) / [LIS](https://github.com/wuhy80/algorithm/tree/main/longest-increasing-subsequence/) → [树形 DP](https://github.com/wuhy80/algorithm/tree/main/tree-dp/) / [数位 DP](https://github.com/wuhy80/algorithm/tree/main/digit-dp/) |
| 区间查询 | [前缀和](https://github.com/wuhy80/algorithm/tree/main/prefix-sum/) → [差分数组](https://github.com/wuhy80/algorithm/tree/main/difference-array/) → [树状数组](https://github.com/wuhy80/algorithm/tree/main/fenwick-tree/) / [平方根分解](https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/) → [线段树](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) → [懒标记线段树](https://github.com/wuhy80/algorithm/tree/main/lazy-segment-tree/) → [莫队](https://github.com/wuhy80/algorithm/tree/main/mo-algorithm/) / [Wavelet Matrix](https://github.com/wuhy80/algorithm/tree/main/wavelet-matrix/) |
| 数论与线性代数 | [欧几里得算法](https://github.com/wuhy80/algorithm/tree/main/euclidean-algorithm/) → [扩展欧几里得](https://github.com/wuhy80/algorithm/tree/main/extended-euclidean/) → [快速模幂](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/) → [埃氏筛](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/) / [Miller-Rabin](https://github.com/wuhy80/algorithm/tree/main/miller-rabin/) → [矩阵快速幂](https://github.com/wuhy80/algorithm/tree/main/matrix-exponentiation/) / [高斯消元](https://github.com/wuhy80/algorithm/tree/main/gaussian-elimination/) → [FFT](https://github.com/wuhy80/algorithm/tree/main/fft/) / [NTT](https://github.com/wuhy80/algorithm/tree/main/ntt/) |
| 神经网络 | [激活函数](https://github.com/wuhy80/algorithm/tree/main/activation-functions/) → [感知机](https://github.com/wuhy80/algorithm/tree/main/perceptron-classifier/) → [前向传播](https://github.com/wuhy80/algorithm/tree/main/neural-network-forward-pass/) → [反向传播](https://github.com/wuhy80/algorithm/tree/main/backpropagation/) → [优化器](https://github.com/wuhy80/algorithm/tree/main/optimizer-comparison/) → [CNN](https://github.com/wuhy80/algorithm/tree/main/convolutional-neural-network/) / [RNN](https://github.com/wuhy80/algorithm/tree/main/recurrent-neural-network/) / [自注意力](https://github.com/wuhy80/algorithm/tree/main/transformer-self-attention/) |

## 目录统计

${categoryOrder.map((name) => `- ${categoryDisplayNames[name] || name}：${counts[name]} 项`).join('\n')}
`;

for (const category of categoryOrder) {
  readme += `\n## ${categoryDisplayNames[category] || category}\n\n`;
  if (category === '图算法、网络流与回溯') {
    readme += `### 推荐学习路线

图算法不适合按下表顺序逐项学习。先掌握表示与遍历，再沿问题类型选择一条分支：

| 分支 | 建议顺序 |
| --- | --- |
| 图基础 | [图的表示](https://github.com/wuhy80/algorithm/tree/main/graph-representations/) → [BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) / [DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) → [连通分量](https://github.com/wuhy80/algorithm/tree/main/connected-components/) → [无向环检测](https://github.com/wuhy80/algorithm/tree/main/undirected-cycle-detection/) / [有向环检测](https://github.com/wuhy80/algorithm/tree/main/directed-cycle-detection/) → [拓扑排序](https://github.com/wuhy80/algorithm/tree/main/topological-sort/) |
| 最短路径 | [BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) → [0-1 BFS](https://github.com/wuhy80/algorithm/tree/main/zero-one-bfs/) → [Dijkstra](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) → [Bellman-Ford](https://github.com/wuhy80/algorithm/tree/main/bellman-ford/) / [DAG 最短路径](https://github.com/wuhy80/algorithm/tree/main/dag-shortest-path/) → [Floyd-Warshall](https://github.com/wuhy80/algorithm/tree/main/floyd-warshall/) / [Johnson](https://github.com/wuhy80/algorithm/tree/main/johnson-algorithm/) |
| 连通结构 | [并查集](https://github.com/wuhy80/algorithm/tree/main/union-find/) → [割点与桥](https://github.com/wuhy80/algorithm/tree/main/bridges-articulation/) → [双连通分量](https://github.com/wuhy80/algorithm/tree/main/biconnected-components/)；[Kosaraju](https://github.com/wuhy80/algorithm/tree/main/kosaraju-scc/) / [Tarjan SCC](https://github.com/wuhy80/algorithm/tree/main/tarjan-scc/) → [2-SAT](https://github.com/wuhy80/algorithm/tree/main/two-sat/) |
| 最小生成树 | [并查集](https://github.com/wuhy80/algorithm/tree/main/union-find/) → [Kruskal](https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/) / [Prim](https://github.com/wuhy80/algorithm/tree/main/prim-mst/) → [Borůvka](https://github.com/wuhy80/algorithm/tree/main/boruvka-mst/) → [Chu-Liu/Edmonds](https://github.com/wuhy80/algorithm/tree/main/chu-liu-edmonds/) |
| 匹配与指派 | [二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/) → [Hopcroft-Karp](https://github.com/wuhy80/algorithm/tree/main/hopcroft-karp/) → [匈牙利算法](https://github.com/wuhy80/algorithm/tree/main/hungarian-algorithm/) → [Blossom](https://github.com/wuhy80/algorithm/tree/main/blossom-matching/) |
| 网络流与割 | [Edmonds-Karp](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/) → [Dinic](https://github.com/wuhy80/algorithm/tree/main/dinic/) → [Push-Relabel](https://github.com/wuhy80/algorithm/tree/main/push-relabel/) → [最小费用最大流](https://github.com/wuhy80/algorithm/tree/main/min-cost-max-flow/) / [有上下界网络流](https://github.com/wuhy80/algorithm/tree/main/lower-bound-flow/) → [Stoer-Wagner](https://github.com/wuhy80/algorithm/tree/main/stoer-wagner-min-cut/) → [Gomory-Hu](https://github.com/wuhy80/algorithm/tree/main/gomory-hu-tree/) |
| 树上问题 | [树的直径](https://github.com/wuhy80/algorithm/tree/main/tree-diameter/) → [最近公共祖先](https://github.com/wuhy80/algorithm/tree/main/lowest-common-ancestor/) → [AHU 树同构](https://github.com/wuhy80/algorithm/tree/main/tree-isomorphism-ahu/)；更复杂的动态树与树分解见[高级查询与树分解](#高级查询与树分解) |

> 范围说明：Tarjan 与 Kosaraju 已覆盖强连通分量，但目前没有单独的“缩点 DAG”演示；[Euler Tour Tree](https://github.com/wuhy80/algorithm/tree/main/euler-tour-tree/) 是动态森林结构，不等同于静态 DFS 欧拉序。

### 完整索引

`;
  }
  readme += `| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
`;
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
  if (customGuideSet.has(entry.slug)) {
    const guidePath = path.join(root,entry.slug,'README.md');
    if (!fs.existsSync(guidePath)) {
      throw new Error(`Missing custom learning guide: ${entry.slug}/README.md`);
    }
    continue;
  }
  writeGenerated(
    path.join(root,entry.slug,'README.md'),
    buildLearningGuide(entry, catalog, prerequisiteMarkdown),
  );
}

console.log(checkOnly ? `Verified ${catalog.length} catalog entries` : `Generated README and catalog data for ${catalog.length} entries`);
