import fs from 'node:fs';
import path from 'node:path';
import { problemBatchA } from './problem-batch-a.mjs';
import { problemBatchB } from './problem-batch-b.mjs';
import { problemBatchC } from './problem-batch-c.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const outputDirectory = path.join(root, 'problems');
const idPath = path.join(import.meta.dirname, 'problem-ids.json');
const checkOnly = process.argv.includes('--check');
const problemOverrides = { ...problemBatchA, ...problemBatchB, ...problemBatchC };

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

const variantDefinitions = [
  {
    key: 'core',
    suffix: '',
    label: '核心实现',
    title: (entry) => entry.name,
    statement: (entry, baseStatement) => baseStatement,
    summary: (entry) => entry.summary,
    constraints: [],
    mental: (profile) => profile.mental,
    steps: (profile) => profile.steps,
    pitfalls: [],
    difficultyOffset: 0,
  },
  {
    key: 'state',
    suffix: '--state',
    label: '状态诊断',
    title: (entry) => `${entry.name}：状态诊断`,
    statement: (entry, baseStatement) => `${baseStatement}\n\n本题重点检查状态定义与更新顺序。请先明确每个变量在循环或递归入口处的含义，再完成 solve(data)，使结果满足原问题契约。`,
    summary: (entry) => `从状态含义、更新顺序和终止条件三个角度诊断 ${entry.name}。`,
    constraints: ['写代码前列出关键状态在一次迭代前后的含义。', '更新状态时不得使用已经失效的旧边界或旧标记。'],
    mental: (profile) => `先把实现当成状态机逐步检查：${profile.mental}`,
    steps: (profile) => ['列出关键变量在步骤开始时的精确定义', ...profile.steps.slice(1, 3), '用终止状态反推返回值是否满足契约'],
    pitfalls: ['只盯最终答案，没有检查中间状态何时第一次失效。'],
    difficultyOffset: 0,
  },
  {
    key: 'edge',
    suffix: '--edge',
    label: '边界强化',
    title: (entry) => `${entry.name}：边界强化`,
    statement: (entry, baseStatement) => `${baseStatement}\n\n本题使用相同输入输出契约，但会重点覆盖空输入、最小规模、重复元素、极端顺序或退化结构。请实现能够稳定处理这些边界的 solve(data)。`,
    summary: (entry) => `通过最小规模、退化结构和极端输入强化 ${entry.name} 的边界处理。`,
    constraints: ['显式处理空输入或该算法允许的最小输入。', '检查重复值、退化结构与最大合法边界，不依赖偶然的数据分布。'],
    mental: (profile) => `先确定最小合法状态，再扩展到一般情况：${profile.mental}`,
    steps: (profile) => ['列出空输入、单元素和退化结构的预期结果', ...profile.steps.slice(0, 2), '用极端顺序与重复值验证终止条件'],
    pitfalls: ['一般样例可以通过，但空输入、重复值或退化结构触发越界。'],
    difficultyOffset: 1,
  },
  {
    key: 'applied',
    suffix: '--applied',
    label: '应用建模',
    title: (entry) => `${entry.name}：应用建模`,
    statement: (entry, baseStatement) => `${baseStatement}\n\n请把输入中的业务对象还原为该算法真正需要的状态、关系或序列，再调用同一套核心过程完成 solve(data)。评分同时关注建模是否保持原问题语义以及结果是否满足输入输出契约。`,
    summary: (entry) => `把具体输入抽象为 ${entry.name} 的标准模型，并完成端到端求解。`,
    constraints: ['先区分业务字段与算法真正需要的状态，避免把展示信息带入核心过程。', '建模转换不得改变元素关系、顺序约束或可达性。'],
    mental: (profile) => `先完成“现实对象 → 算法状态”的翻译，再套用核心不变量：${profile.mental}`,
    steps: (profile) => ['提取输入中影响答案的对象、关系与约束', '把它们转换为算法使用的标准状态', ...profile.steps.slice(1, 3)],
    pitfalls: ['模型转换遗漏约束，导致核心算法正确但解决了另一个问题。'],
    difficultyOffset: 1,
  },
];

const difficultyLevels = ['基础', '进阶', '高级'];

function variantSlug(baseSlug, variant) {
  return `${baseSlug}${variant.suffix}`;
}

function adjustedDifficulty(difficulty, offset) {
  const index = difficultyLevels.indexOf(difficulty);
  return index === -1 ? difficulty : difficultyLevels[Math.min(index + offset, difficultyLevels.length - 1)];
}

function loadIds() {
  const existing = fs.existsSync(idPath) ? JSON.parse(fs.readFileSync(idPath, 'utf8')) : {};
  let next = Math.max(0, ...Object.values(existing)) + 1;
  for (const entry of catalog) if (!existing[entry.slug]) existing[entry.slug] = next++;
  for (const entry of catalog) {
    for (const variant of variantDefinitions.slice(1)) {
      const slug = variantSlug(entry.slug, variant);
      if (!existing[slug]) existing[slug] = next++;
    }
  }
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
for (const slug of Object.keys(problemOverrides)) {
  if (!catalogSlugs.has(slug)) throw new Error(`Unknown problem override: ${slug}`);
}

const starterCode = (entry, variant) => `def solve(data):\n    \"\"\"${entry.name} · ${variant.label}。\"\"\"\n    # 在这里实现算法\n    raise NotImplementedError\n`;

const problems = catalog
  .flatMap((entry) => {
    const override = problemOverrides[entry.slug];
    const profile = profiles[entry.category] || profiles.default;
    const examples = override?.examples || [];
    const tests = override ? [...examples, ...override.tests] : [];
    const baseStatement = override?.statement || entry.problem;
    const baseConstraints = override?.constraints || ['先根据演示中的最小样例确认状态定义和边界。'];
    const basePitfalls = override?.pitfalls || profile.pitfalls;
    const invariant = override?.insights?.[0] || profile.invariant;

    return variantDefinitions.map((variant) => {
      const slug = variantSlug(entry.slug, variant);
      return {
        id: ids[slug],
        slug,
        baseSlug: entry.slug,
        variant: variant.key,
        variantLabel: variant.label,
        title: variant.title(entry),
        category: entry.category,
        difficulty: adjustedDifficulty(entry.difficulty, variant.difficultyOffset),
        stage: entry.stage,
        tags: [...entry.tags, variant.label],
        prerequisites: entry.prerequisites,
        summary: variant.summary(entry),
        statement: variant.statement(entry, baseStatement),
        input: override?.input || '本题的可执行输入契约将在对应 Python 批次中补充。',
        output: override?.output || '返回能够验证该算法核心过程的 JSON 可序列化结果。',
        constraints: [...baseConstraints, ...variant.constraints],
        examples,
        tests,
        explanation: {
          mental: variant.mental(profile),
          invariant,
          insights: [...(override?.insights || [profile.mental]), variant.summary(entry)],
          steps: variant.steps(profile),
          pitfalls: [...basePitfalls, ...variant.pitfalls],
        },
        complexity: entry.complexity,
        starterCode: starterCode(entry, variant),
        judgeReady: Boolean(override),
        solutionPath: `../${entry.slug}/solution.py`,
        demo: entry.demo,
        source: entry.source,
      };
    });
  })
  .sort((a, b) => a.id - b.id);

if (new Set(problems.map((item) => item.id)).size !== problems.length) throw new Error('Duplicate problem id');
if (problems.length < 1000) throw new Error(`Problem bank must contain at least 1000 entries, received ${problems.length}`);

if (!checkOnly) {
  for (const [slug, problem] of Object.entries(problemOverrides)) {
    writeGenerated(path.join(root, slug, 'solution.py'), problem.solution);
  }
}

writeGenerated(idPath, JSON.stringify(ids, null, 2));
writeGenerated(path.join(outputDirectory, 'problem-data.json'), JSON.stringify(problems, null, 2));
writeGenerated(path.join(outputDirectory, 'problem-data.js'), `// Generated by scripts/generate-problems.mjs.\nwindow.PROBLEM_DATA = ${JSON.stringify(problems)};`);

console.log(`${checkOnly ? 'Verified' : 'Generated'} ${problems.length} problems; ${problems.filter((item) => item.judgeReady).length} are judge-ready`);
