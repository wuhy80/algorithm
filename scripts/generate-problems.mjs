import fs from 'node:fs';
import path from 'node:path';
import { problemBatchA } from './problem-batch-a.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const outputDirectory = path.join(root, 'problems');
const idPath = path.join(import.meta.dirname, 'problem-ids.json');
const checkOnly = process.argv.includes('--check');

const profiles = {
  '查找、排序与算法技巧': {
    mental: '先找出输入中的有序性、单调性或可复用区间信息，再决定哪些扫描能够永久省略。',
    invariant: '已经越过或确认的区域拥有明确结论，尚未处理区域仍包含全部可能答案。',
    steps: ['定义下标、区间或有序区的精确含义', '处理当前元素并更新局部状态', '证明被排除区域以后不必再访问', '到达边界后返回结果'],
    pitfalls: ['混用闭区间与半开区间', '忽略重复值、空输入和极端顺序'],
  },
  '图算法、网络流与回溯': {
    mental: '把节点看作状态、边看作允许的转移；算法的核心是决定访问顺序以及哪些状态需要被记住。',
    invariant: '已完成节点的结论不会再被未处理边破坏，队列、栈或优先队列中的节点都有清楚的候选含义。',
    steps: ['建立邻接关系和初始状态', '按算法规定的容器取出候选节点', '沿边更新邻居状态并记录来源', '在容器为空或目标确定时结束'],
    pitfalls: ['标记访问的时机错误导致重复处理', '忽略断开图、平行边、自环或负权限制'],
  },
  '回溯、博弈与约束求解': {
    mental: '每一层递归代表一次选择；先修改状态，递归探索，再完整撤销，形成可验证的决策树。',
    invariant: '递归入口保存的部分解始终合法，返回上一层时共享状态恢复到选择前。',
    steps: ['定义部分解和剩余候选', '检查约束并剪掉不可能分支', '做选择后递归进入下一层', '撤销选择并继续枚举'],
    pitfalls: ['忘记撤销共享状态', '找到一个解后错误停止全部搜索'],
  },
  '字符串算法': {
    mental: '字符串算法的优化来自复用已经匹配成功的前缀、后缀、回文边界或自动机状态。',
    invariant: '扫描位置之前的匹配信息已经正确编码，失配后的回退不会漏掉任何可能起点。',
    steps: ['定义模式状态或前缀信息', '预处理可复用的失败转移', '扫描文本并更新状态', '在完整匹配或扫描结束时输出'],
    pitfalls: ['空模式和重复字符处理不一致', '字符下标与长度边界差一位'],
  },
  '动态规划与序列': {
    mental: '先用一句话定义 dp 状态，再列出最后一步来自哪些更小状态；代码只是按依赖顺序填表。',
    invariant: '计算当前状态时，它依赖的全部子问题已经得到最终答案。',
    steps: ['定义状态含义和答案位置', '写出基本情况', '推导不重不漏的转移', '按依赖顺序填表并恢复答案'],
    pitfalls: ['状态定义无法支持转移', '循环方向导致同一轮错误复用新状态'],
  },
  '数据结构': {
    mental: '数据结构不是节点形状，而是一组操作契约；维护字段必须足以让高频操作达到目标复杂度。',
    invariant: '每次操作结束后，结构关系、大小字段和顺序约束同时成立。',
    steps: ['明确支持的操作和复杂度目标', '设计存储布局与维护字段', '只修改受影响的局部结构', '操作后检查全部结构不变量'],
    pitfalls: ['更新局部节点却忘记同步聚合字段', '只测试查询，未覆盖连续插入删除'],
  },
  default: {
    mental: '把动画中的视觉元素还原为真正的数据状态，先明确一次迭代读什么、写什么、何时结束。',
    invariant: '每一步都只依据当前合法状态产生下一状态，关键约束在更新前后保持成立。',
    steps: ['规范化输入和参数', '建立初始状态', '重复执行核心状态转移', '检查终止条件并返回可验证结果'],
    pitfalls: ['把绘图坐标误当作算法状态', '没有覆盖最小输入和数值边界'],
  },
};

function loadIds() {
  const existing = fs.existsSync(idPath) ? JSON.parse(fs.readFileSync(idPath, 'utf8')) : {};
  let next = Math.max(0, ...Object.values(existing)) + 1;
  for (const entry of catalog) if (!existing[entry.slug]) existing[entry.slug] = next++;
  return existing;
}

function writeGenerated(file, content) {
  const normalized = `${content.trim()}\n`;
  if (checkOnly) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== normalized) {
      throw new Error(`${path.relative(root, file)} is out of date`);
    }
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, normalized);
}

const ids = loadIds();
const catalogSlugs = new Set(catalog.map((entry) => entry.slug));
for (const slug of Object.keys(problemBatchA)) {
  if (!catalogSlugs.has(slug)) throw new Error(`Unknown problem override: ${slug}`);
}

const starterCode = (entry) => `def solve(data):\n    \"\"\"${entry.name}。\"\"\"\n    # 在这里实现算法\n    raise NotImplementedError\n`;

const problems = catalog
  .map((entry) => {
    const override = problemBatchA[entry.slug];
    const profile = profiles[entry.category] || profiles.default;
    const examples = override?.examples || [];
    const tests = override ? [...examples, ...override.tests] : [];
    return {
      id: ids[entry.slug],
      slug: entry.slug,
      title: entry.name,
      category: entry.category,
      difficulty: entry.difficulty,
      stage: entry.stage,
      tags: entry.tags,
      prerequisites: entry.prerequisites,
      summary: entry.summary,
      statement: override?.statement || entry.problem,
      input: override?.input || '本题的可执行输入契约将在对应 Python 批次中补充。',
      output: override?.output || '返回能够验证该算法核心过程的 JSON 可序列化结果。',
      constraints: override?.constraints || ['先根据演示中的最小样例确认状态定义和边界。'],
      examples,
      tests,
      explanation: {
        mental: profile.mental,
        invariant: override?.insights?.[0] || profile.invariant,
        insights: override?.insights || [profile.mental],
        steps: profile.steps,
        pitfalls: override?.pitfalls || profile.pitfalls,
      },
      complexity: entry.complexity,
      starterCode: starterCode(entry),
      judgeReady: Boolean(override),
      solutionPath: `../${entry.slug}/solution.py`,
      demo: entry.demo,
      source: entry.source,
    };
  })
  .sort((a, b) => a.id - b.id);

if (new Set(problems.map((item) => item.id)).size !== problems.length) throw new Error('Duplicate problem id');

if (!checkOnly) {
  for (const [slug, problem] of Object.entries(problemBatchA)) {
    writeGenerated(path.join(root, slug, 'solution.py'), problem.solution);
  }
}

writeGenerated(idPath, JSON.stringify(ids, null, 2));
writeGenerated(path.join(outputDirectory, 'problem-data.json'), JSON.stringify(problems, null, 2));
writeGenerated(path.join(outputDirectory, 'problem-data.js'), `// Generated by scripts/generate-problems.mjs.\nwindow.PROBLEM_DATA = ${JSON.stringify(problems, null, 2)};`);

console.log(`${checkOnly ? 'Verified' : 'Generated'} ${problems.length} problems; ${problems.filter((item) => item.judgeReady).length} are judge-ready`);
