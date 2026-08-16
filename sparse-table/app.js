(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const pathParts = decodeURIComponent(location.pathname).split('/').filter(Boolean);
  const slug = pathParts.at(-1) === 'index.html' ? pathParts.at(-2) : pathParts.at(-1);

  const configs = {
    'counting-sort': { title: '计数排序', mono: 'CS', eye: 'SORT / COUNTING', theme: '', aLabel: '非负整数数组（0-20）', a: '4, 2, 2, 8, 3, 3, 1, 7, 5, 2', metrics: ['写入', '计数范围', '已输出'], principle: '使用值域计数代替元素比较，再由累计计数确定稳定输出位置。', complexity: 'TIME O(N + K) · SPACE O(N + K)' },
    'radix-sort': { title: '基数排序', mono: 'RS', eye: 'SORT / LSD RADIX', theme: 'theme-violet', aLabel: '非负整数数组（0-9999）', a: '170, 45, 75, 90, 802, 24, 2, 66, 501, 310', metrics: ['轮次', '移动', '当前位'], principle: '从最低位开始稳定分桶，使高位处理不会破坏低位形成的顺序。', complexity: 'TIME O(D(N + B)) · SPACE O(N + B)' },
    'shell-sort': { title: '希尔排序', mono: 'SH', eye: 'SORT / DIMINISHING GAP', theme: 'theme-green', aLabel: '整数数组', a: '64, 21, 48, 13, 75, 32, 9, 56, 27, 81, 4, 39', metrics: ['比较', '移动', 'Gap'], principle: '按逐渐缩小的间隔执行分组插入排序，先消除远距离逆序。', complexity: 'GAP INSERTION · IN-PLACE' },
    'bellman-ford': { title: 'Bellman-Ford', mono: 'BF', eye: 'GRAPH / NEGATIVE EDGES', theme: 'theme-rose', aLabel: '起点', a: 'A', optionLabel: '图预设', options: [['normal', '含负边、无负环'], ['cycle', '包含负权环']], metrics: ['轮次', '松弛', '到 G 距离'], principle: '对全部边执行 V-1 轮松弛，并用额外一轮检测可达负权环。', complexity: 'SHORTEST PATH · O(VE)' },
    'floyd-warshall': { title: 'Floyd-Warshall', mono: 'FW', eye: 'GRAPH / ALL PAIRS', theme: 'theme-amber', aLabel: '矩阵规模', a: '5', metrics: ['中转点', '更新', '已检查'], principle: '依次允许每个节点作为中转点，更新所有节点对之间的最短距离。', complexity: 'ALL-PAIRS SHORTEST PATH · O(V³)' },
    'tarjan-scc': { title: 'Tarjan 强连通分量', mono: 'TJ', eye: 'GRAPH / LOWLINK', theme: 'theme-violet', aLabel: '起始节点', a: 'A', metrics: ['已发现', '分量', '栈深'], principle: '一次 DFS 同时维护发现时间与 Lowlink，从栈中弹出完整强连通分量。', complexity: 'STRONGLY CONNECTED · O(V + E)' },
    'bridges-articulation': { title: '割点与桥', mono: 'BA', eye: 'GRAPH / CRITICAL LINKS', theme: 'theme-green', aLabel: '起始节点', a: 'A', metrics: ['已发现', '割点', '桥'], principle: 'DFS 树中的 Lowlink 判断子树能否绕过父节点回到更早的祖先。', complexity: 'ARTICULATION + BRIDGES · O(V + E)' },
    'edmonds-karp': { title: 'Edmonds-Karp 最大流', mono: 'EK', eye: 'FLOW / RESIDUAL GRAPH', theme: 'theme-rose', aLabel: '源点', a: 'S', metrics: ['增广次数', '瓶颈', '最大流'], principle: '在残量网络中反复用 BFS 寻找最短增广路径，并更新正向与反向容量。', complexity: 'MAX FLOW · O(VE²)' },
    'bipartite-matching': { title: '二分图匹配', mono: 'BM', eye: 'GRAPH / AUGMENTING PATH', theme: 'theme-amber', aLabel: '左侧节点数', a: '4', metrics: ['当前节点', '尝试', '匹配数'], principle: '为每个左侧节点寻找交替增广路径，必要时重新安排已有匹配。', complexity: 'AUGMENTING MATCH · O(VE)' },
    'aho-corasick': { title: 'Aho-Corasick', mono: 'AC', eye: 'STRING / MULTI-PATTERN', theme: 'theme-green', aLabel: '模式串（逗号分隔）', a: 'he, she, his, hers', bLabel: '文本', b: 'ushers and his sheep', metrics: ['节点', '匹配', '文本索引'], principle: '在 Trie 上建立失败指针，使多个模式串可以共享一次线性文本扫描。', complexity: 'MULTI-PATTERN · O(TEXT + MATCHES)' },
    'rabin-karp': { title: 'Rabin-Karp', mono: 'RK', eye: 'STRING / ROLLING HASH', theme: 'theme-violet', aLabel: '文本', a: 'THE QUICK BROWN FOX JUMPS', bLabel: '模式串', b: 'BROWN', metrics: ['窗口', '哈希命中', '结果'], principle: '滚动更新窗口哈希，只在哈希相等时逐字符确认真实匹配。', complexity: 'ROLLING HASH · AVERAGE O(N + M)' },
    'edit-distance': { title: '编辑距离', mono: 'ED', eye: 'DP / LEVENSHTEIN', theme: 'theme-rose', aLabel: '字符串 A', a: 'SUNDAY', bLabel: '字符串 B', b: 'SATURDAY', metrics: ['单元格', '当前代价', '最终距离'], principle: '每个状态在插入、删除和替换三种操作中选择最小代价。', complexity: 'LEVENSHTEIN DP · O(MN)' },
    'longest-increasing-subsequence': { title: '最长递增子序列', mono: 'LI', eye: 'DP / BINARY SEARCH', theme: 'theme-green', aLabel: '整数数组', a: '10, 9, 2, 5, 3, 7, 101, 18, 20, 6', metrics: ['已处理', '二分比较', 'LIS 长度'], principle: '维护不同长度递增子序列的最小尾值，并用二分查找更新位置。', complexity: 'PATIENCE METHOD · O(N LOG N)' },
    'huffman-coding': { title: 'Huffman 编码', mono: 'HF', eye: 'GREEDY / PREFIX CODE', theme: 'theme-amber', aLabel: '待编码文本', a: 'ALGORITHM VISUALIZATION', metrics: ['符号数', '合并', '编码位数'], principle: '每轮合并频率最低的两个节点，构造平均编码长度最短的前缀树。', complexity: 'PREFIX CODE · O(K LOG K)' },
    'b-tree': { title: 'B 树', mono: 'BT', eye: 'STRUCTURE / MULTIWAY TREE', theme: 'theme-rose', aLabel: '插入序列（最小度数 2）', a: '10, 20, 5, 6, 12, 30, 7, 17, 3, 25, 2, 8', metrics: ['节点', '高度', '键数'], principle: '一个节点保存多个有序键；节点满时先分裂，再向正确子节点继续插入。', complexity: 'SEARCH + INSERT · O(LOG N)' },
    'skip-list': { title: '跳表', mono: 'SL', eye: 'STRUCTURE / LAYERED INDEX', theme: 'theme-violet', aLabel: '插入序列', a: '4, 9, 13, 18, 25, 31, 38, 44, 52, 60', bLabel: '查找目标', b: '38', metrics: ['已插入', '当前层', '比较'], principle: '高层稀疏索引跨越大量节点，下降到低层后完成精确查找。', complexity: 'EXPECTED SEARCH · O(LOG N)' },
    'bloom-filter': { title: 'Bloom Filter', mono: 'BL', eye: 'STRUCTURE / PROBABILISTIC', theme: 'theme-green', aLabel: '插入项目（逗号分隔）', a: 'apple, pear, mango, grape, kiwi', bLabel: '查询项目', b: 'orange', metrics: ['置位数', '哈希次数', '查询结果'], principle: '多个哈希函数共享位数组：缺少任一位即可确定不存在，全部命中则可能存在。', complexity: 'MEMBERSHIP · PROBABILISTIC' },
    'sparse-table': { title: '稀疏表', mono: 'ST', eye: 'STRUCTURE / STATIC RMQ', theme: 'theme-amber', aLabel: '静态整数数组', a: '7, 2, 6, 3, 9, 1, 5, 8, 4, 10, 0, 11', bLabel: '查询区间 L,R', b: '2, 9', metrics: ['预处理格', '区间幂次', '最小值'], principle: '预计算长度为 2 的幂次区间，查询时用两个重叠块覆盖目标范围。', complexity: 'BUILD O(N LOG N) · QUERY O(1)' },
    'quadtree': { title: '四叉树', mono: 'QT', eye: 'SPATIAL / QUADTREE', theme: 'theme-violet', aLabel: '点数量（8-40）', a: '28', metrics: ['已插入', '空间分区', '查询命中'], principle: '当区域容量用尽时递归划分四个象限，只访问与查询窗口相交的分区。', complexity: 'SPATIAL INDEX · ADAPTIVE' },
    'sieve-of-eratosthenes': { title: '埃氏筛法', mono: 'SE', eye: 'NUMBER / PRIME SIEVE', theme: 'theme-rose', aLabel: '上限（30-150）', a: '100', metrics: ['当前质数', '已标记', '质数数量'], principle: '从最小未标记数开始，把它的所有倍数标记为合数。', complexity: 'PRIME SIEVE · O(N LOG LOG N)' }
  };

  const cfg = configs[slug] || configs['counting-sort'];
  let steps = [];
  let stepIndex = 0;
  let running = false;
  let speed = 1;
  let width = 1;
  let height = 1;
  let dpr = 1;
  let lastTick = 0;
  let palette = {};

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const parseNumbers = (value, limit = 28) => value.split(/[\s,，;；]+/).filter(Boolean).map(Number).filter(Number.isFinite).map(Math.round).slice(0, limit);
  const edgeKey = (a, b) => `${a}-${b}`;
  const undirectedKey = (a, b) => [a, b].sort((x, y) => x - y).join('-');
  const graphNodes = [
    { label: 'A', x: .10, y: .34 }, { label: 'B', x: .29, y: .16 }, { label: 'C', x: .31, y: .58 },
    { label: 'D', x: .50, y: .38 }, { label: 'E', x: .67, y: .16 }, { label: 'F', x: .69, y: .62 },
    { label: 'G', x: .88, y: .38 }, { label: 'H', x: .89, y: .70 }
  ];

  function setUpPage() {
    document.body.className = cfg.theme || '';
    document.title = `${cfg.title} · Algorithm Lab`;
    $('title').textContent = cfg.title;
    $('monogram').textContent = cfg.mono;
    $('eyebrow').textContent = cfg.eye;
    $('primary-label').textContent = cfg.aLabel;
    $('input-a').value = cfg.a;
    $('secondary-wrap').hidden = !cfg.bLabel;
    if (cfg.bLabel) {
      $('secondary-label').textContent = cfg.bLabel;
      $('input-b').value = cfg.b;
    }
    $('option-wrap').hidden = !cfg.options;
    if (cfg.options) {
      $('option-label').textContent = cfg.optionLabel;
      $('option').innerHTML = cfg.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
    }
    cfg.metrics.forEach((label, index) => { $(`metric-label-${index + 1}`).textContent = label; });
    $('principle').textContent = cfg.principle;
    $('complexity').textContent = cfg.complexity;
    canvas.setAttribute('aria-label', `${cfg.title}执行过程动画`);
  }

  function push(label, kind, data, metrics = [0, 0, '--'], note = '') {
    steps.push({ label, kind, metrics, note, ...data });
  }

  function buildCounting() {
    const arr = parseNumbers($('input-a').value, 24);
    if (!arr.length || arr.some((v) => v < 0 || v > 20)) throw new Error('请输入 1-24 个 0 到 20 的整数');
    const max = Math.max(...arr);
    const counts = Array(max + 1).fill(0);
    const output = Array(arr.length).fill(null);
    let writes = 0;
    push('准备计数桶', 'counting', { arr, counts: [...counts], output: [...output], current: -1, bucket: -1, phase: 'count' }, [0, max + 1, 0], 'COUNT FREQUENCIES');
    arr.forEach((value, index) => {
      counts[value]++;
      push(`计数 ${value}：出现 ${counts[value]} 次`, 'counting', { arr, counts: [...counts], output: [...output], current: index, bucket: value, phase: 'count' }, [writes, max + 1, 0], `COUNT[${value}] = ${counts[value]}`);
    });
    for (let i = 1; i < counts.length; i++) {
      counts[i] += counts[i - 1];
      push(`累计计数到值 ${i}`, 'counting', { arr, counts: [...counts], output: [...output], current: -1, bucket: i, phase: 'prefix' }, [writes, max + 1, 0], `PREFIX[${i}] = ${counts[i]}`);
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      const value = arr[i];
      const position = --counts[value];
      output[position] = value;
      writes++;
      push(`把 ${value} 写入输出索引 ${position}`, 'counting', { arr, counts: [...counts], output: [...output], current: i, bucket: value, outIndex: position, phase: 'output' }, [writes, max + 1, writes], `OUTPUT[${position}] = ${value}`);
    }
    push('计数排序完成', 'counting', { arr: [...output], counts: [...counts], output: [...output], current: -1, bucket: -1, phase: 'done' }, [writes, max + 1, output.length], `SORTED [${output.join(', ')}]`);
  }

  function buildRadix() {
    let arr = parseNumbers($('input-a').value, 22);
    if (!arr.length || arr.some((v) => v < 0 || v > 9999)) throw new Error('请输入 1-22 个 0 到 9999 的整数');
    const max = Math.max(...arr);
    let pass = 0;
    let moves = 0;
    push('准备最低位优先排序', 'radix', { arr: [...arr], buckets: Array.from({ length: 10 }, () => []), current: -1, exp: 1 }, [0, 0, 1], 'LSD RADIX');
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      pass++;
      const buckets = Array.from({ length: 10 }, () => []);
      arr.forEach((value, index) => {
        const digit = Math.floor(value / exp) % 10;
        buckets[digit].push(value);
        moves++;
        push(`按当前位 ${digit} 放入桶 ${digit}`, 'radix', { arr: [...arr], buckets: clone(buckets), current: index, exp, digit }, [pass, moves, exp], `DIGIT = FLOOR(${value} / ${exp}) MOD 10`);
      });
      arr = buckets.flat();
      push(`第 ${pass} 轮收集完成`, 'radix', { arr: [...arr], buckets: clone(buckets), current: -1, exp, digit: -1 }, [pass, moves, exp], `PASS ${pass} COMPLETE`);
    }
    push('基数排序完成', 'radix', { arr: [...arr], buckets: Array.from({ length: 10 }, () => []), current: -1, exp: 0, digit: -1, done: true }, [pass, moves, '--'], `SORTED [${arr.join(', ')}]`);
  }

  function buildShell() {
    const arr = parseNumbers($('input-a').value, 26);
    if (arr.length < 2) throw new Error('请输入至少两个整数');
    let comparisons = 0;
    let moves = 0;
    push('准备 Gap 序列', 'array', { arr: [...arr], current: -1, other: -1, gap: Math.floor(arr.length / 2), sorted: [] }, [0, 0, Math.floor(arr.length / 2)], 'GAP INSERTION');
    for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      push(`开始 Gap = ${gap}`, 'array', { arr: [...arr], current: -1, other: -1, gap, sorted: [] }, [comparisons, moves, gap], `GROUPS MOD ${gap}`);
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i];
        let j = i;
        while (j >= gap) {
          comparisons++;
          push(`比较 ${arr[j - gap]} 与暂存值 ${temp}`, 'array', { arr: [...arr], current: j, other: j - gap, gap, held: temp, sorted: [] }, [comparisons, moves, gap], `INDEX ${j - gap} → ${j}`);
          if (arr[j - gap] <= temp) break;
          arr[j] = arr[j - gap];
          moves++;
          j -= gap;
          push('较大元素沿 Gap 右移', 'array', { arr: [...arr], current: j, other: j + gap, gap, held: temp, sorted: [] }, [comparisons, moves, gap], `SHIFT BY ${gap}`);
        }
        arr[j] = temp;
        moves++;
        push(`把 ${temp} 插入索引 ${j}`, 'array', { arr: [...arr], current: j, other: -1, gap, sorted: [] }, [comparisons, moves, gap], `INSERT AT ${j}`);
      }
    }
    push('希尔排序完成', 'array', { arr: [...arr], current: -1, other: -1, gap: 0, sorted: arr.map((_, i) => i) }, [comparisons, moves, 0], `SORTED [${arr.join(', ')}]`);
  }

  function buildBellmanFord() {
    const nodes = graphNodes.slice(0, 7);
    const edges = [[0, 1, 4], [0, 2, 5], [1, 2, -2], [1, 3, 6], [2, 3, 3], [2, 4, 4], [3, 5, 2], [4, 5, -1], [5, 6, 2]];
    if ($('option').value === 'cycle') edges.push([6, 2, -6]);
    const start = Math.max(0, nodes.findIndex((node) => node.label === $('input-a').value.trim().toUpperCase()));
    const dist = Array(nodes.length).fill(Infinity);
    dist[start] = 0;
    let relaxations = 0;
    push(`从 ${nodes[start].label} 开始`, 'graph', { nodes, edges, directed: true, activeEdge: null, nodeValues: [...dist] }, [0, 0, '∞'], `DIST[${nodes[start].label}] = 0`);
    let stopped = false;
    for (let pass = 1; pass < nodes.length && !stopped; pass++) {
      let changed = false;
      for (const [u, v, weight] of edges) {
        push(`检查 ${nodes[u].label} → ${nodes[v].label}`, 'graph', { nodes, edges, directed: true, activeEdge: edgeKey(u, v), nodeValues: [...dist], activeNode: u }, [pass, relaxations, Number.isFinite(dist[6]) ? dist[6] : '∞'], `EDGE WEIGHT ${weight}`);
        if (Number.isFinite(dist[u]) && dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          relaxations++;
          changed = true;
          push(`更新 dist[${nodes[v].label}] = ${dist[v]}`, 'graph', { nodes, edges, directed: true, activeEdge: edgeKey(u, v), nodeValues: [...dist], activeNode: v }, [pass, relaxations, Number.isFinite(dist[6]) ? dist[6] : '∞'], `RELAX ${nodes[u].label} + ${weight}`);
        }
      }
      stopped = !changed;
    }
    const cycleEdge = edges.find(([u, v, weight]) => Number.isFinite(dist[u]) && dist[u] + weight < dist[v]);
    push(cycleEdge ? '检测到可达负权环' : '最短距离计算完成', 'graph', { nodes, edges, directed: true, activeEdge: cycleEdge ? edgeKey(cycleEdge[0], cycleEdge[1]) : null, nodeValues: [...dist], dangerEdge: cycleEdge ? edgeKey(cycleEdge[0], cycleEdge[1]) : null }, [nodes.length - 1, relaxations, Number.isFinite(dist[6]) ? dist[6] : '∞'], cycleEdge ? 'NEGATIVE CYCLE' : 'NO NEGATIVE CYCLE');
  }

  function buildFloyd() {
    const n = Math.max(4, Math.min(5, Math.round(Number($('input-a').value) || 5)));
    const labels = 'ABCDE'.slice(0, n).split('');
    const inf = Infinity;
    const source = [[0, 3, 8, inf, -4], [inf, 0, inf, 1, 7], [inf, 4, 0, inf, inf], [2, inf, -5, 0, inf], [inf, inf, inf, 6, 0]];
    const matrix = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => source[i][j]));
    let updates = 0;
    let checked = 0;
    push('载入初始距离矩阵', 'matrix', { matrix: clone(matrix), rowLabels: labels, colLabels: labels, active: null, k: -1 }, ['--', 0, 0], 'D(I,J)');
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          checked++;
          const through = matrix[i][k] + matrix[k][j];
          const improved = through < matrix[i][j];
          if (improved) { matrix[i][j] = through; updates++; }
          push(improved ? `经 ${labels[k]} 缩短 ${labels[i]} → ${labels[j]}` : `检查经 ${labels[k]} 的路径`, 'matrix', { matrix: clone(matrix), rowLabels: labels, colLabels: labels, active: [i, j], k, improved }, [labels[k], updates, checked], `${labels[i]} → ${labels[k]} → ${labels[j]}`);
        }
      }
    }
    push('全源最短路径计算完成', 'matrix', { matrix: clone(matrix), rowLabels: labels, colLabels: labels, active: null, k: -1 }, ['--', updates, checked], 'ALL PAIRS COMPLETE');
  }

  function buildTarjan() {
    const nodes = graphNodes;
    const edges = [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3], [5, 6], [6, 7], [7, 6]];
    const adj = Array.from({ length: nodes.length }, () => []);
    edges.forEach(([u, v]) => adj[u].push(v));
    const disc = Array(nodes.length).fill(-1), low = Array(nodes.length).fill(-1), stack = [], onStack = Array(nodes.length).fill(false), component = Array(nodes.length).fill(-1);
    let time = 0, count = 0;
    const snapshot = (label, activeNode = -1, activeEdge = null) => push(label, 'graph', { nodes, edges, directed: true, activeNode, activeEdge, nodeValues: disc.map((d, i) => d < 0 ? '--' : `${d}/${low[i]}`), stack: [...stack], components: [...component] }, [disc.filter((v) => v >= 0).length, count, stack.length], `DISC / LOW · STACK [${stack.map((i) => nodes[i].label).join(', ')}]`);
    function visit(u) {
      disc[u] = low[u] = time++;
      stack.push(u); onStack[u] = true;
      snapshot(`发现节点 ${nodes[u].label}`, u);
      for (const v of adj[u]) {
        snapshot(`检查 ${nodes[u].label} → ${nodes[v].label}`, u, edgeKey(u, v));
        if (disc[v] < 0) {
          visit(v); low[u] = Math.min(low[u], low[v]);
          snapshot(`回溯更新 low[${nodes[u].label}]`, u, edgeKey(u, v));
        } else if (onStack[v]) {
          low[u] = Math.min(low[u], disc[v]);
          snapshot(`栈内返祖边更新 Lowlink`, u, edgeKey(u, v));
        }
      }
      if (low[u] === disc[u]) {
        const members = [];
        let v;
        do { v = stack.pop(); onStack[v] = false; component[v] = count; members.push(nodes[v].label); } while (v !== u);
        count++;
        snapshot(`形成强连通分量：${members.join(', ')}`, u);
      }
    }
    const preferred = nodes.findIndex((node) => node.label === $('input-a').value.trim().toUpperCase());
    if (preferred >= 0) visit(preferred);
    for (let i = 0; i < nodes.length; i++) if (disc[i] < 0) visit(i);
    snapshot('强连通分量分解完成');
  }

  function buildBridges() {
    const nodes = graphNodes;
    const edges = [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3], [3, 6], [6, 7]];
    const adj = Array.from({ length: nodes.length }, () => []);
    edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u); });
    const disc = Array(nodes.length).fill(-1), low = Array(nodes.length).fill(-1), parent = Array(nodes.length).fill(-1), bridges = new Set(), arts = new Set();
    let time = 0;
    const snapshot = (label, activeNode = -1, activeEdge = null) => push(label, 'graph', { nodes, edges, directed: false, activeNode, activeEdge, nodeValues: disc.map((d, i) => d < 0 ? '--' : `${d}/${low[i]}`), bridgeEdges: [...bridges], articulationNodes: [...arts] }, [disc.filter((v) => v >= 0).length, arts.size, bridges.size], 'DISC / LOW');
    function visit(u) {
      disc[u] = low[u] = time++;
      let children = 0;
      snapshot(`访问节点 ${nodes[u].label}`, u);
      for (const v of adj[u]) {
        if (disc[v] < 0) {
          parent[v] = u; children++;
          snapshot(`沿树边 ${nodes[u].label}-${nodes[v].label}`, u, undirectedKey(u, v));
          visit(v); low[u] = Math.min(low[u], low[v]);
          if (low[v] > disc[u]) bridges.add(undirectedKey(u, v));
          if ((parent[u] < 0 && children > 1) || (parent[u] >= 0 && low[v] >= disc[u])) arts.add(u);
          snapshot(`回溯判断 ${nodes[u].label}-${nodes[v].label}`, u, undirectedKey(u, v));
        } else if (v !== parent[u]) {
          low[u] = Math.min(low[u], disc[v]);
          snapshot('返祖边降低 Lowlink', u, undirectedKey(u, v));
        }
      }
    }
    const preferred = nodes.findIndex((node) => node.label === $('input-a').value.trim().toUpperCase());
    visit(preferred >= 0 ? preferred : 0);
    for (let i = 0; i < nodes.length; i++) if (disc[i] < 0) visit(i);
    snapshot('割点与桥识别完成');
  }

  function buildFlow() {
    const nodes = [
      { label: 'S', x: .08, y: .42 }, { label: 'A', x: .28, y: .18 }, { label: 'B', x: .29, y: .66 },
      { label: 'C', x: .56, y: .18 }, { label: 'D', x: .57, y: .66 }, { label: 'T', x: .86, y: .42 }
    ];
    const capacityEdges = [[0, 1, 10], [0, 2, 10], [1, 2, 2], [1, 3, 4], [1, 4, 8], [2, 4, 9], [4, 3, 6], [3, 5, 10], [4, 5, 10]];
    const n = nodes.length, capacity = Array.from({ length: n }, () => Array(n).fill(0)), flow = Array.from({ length: n }, () => Array(n).fill(0));
    capacityEdges.forEach(([u, v, c]) => { capacity[u][v] = c; });
    let maxFlow = 0, augmentations = 0;
    const labels = () => Object.fromEntries(capacityEdges.map(([u, v, c]) => [edgeKey(u, v), `${flow[u][v]}/${c}`]));
    const snapshot = (label, activeEdge = null, pathEdges = [], bottleneck = 0) => push(label, 'graph', { nodes, edges: capacityEdges, directed: true, activeEdge, pathEdges, edgeLabels: labels() }, [augmentations, bottleneck || '--', maxFlow], `FLOW / CAPACITY · ${maxFlow}`);
    snapshot('初始化残量网络');
    while (true) {
      const parent = Array(n).fill(-1), queue = [0]; parent[0] = -2;
      while (queue.length && parent[5] < 0) {
        const u = queue.shift();
        for (let v = 0; v < n; v++) if (parent[v] < 0 && capacity[u][v] - flow[u][v] > 0) {
          parent[v] = u; queue.push(v);
          snapshot(`BFS 发现 ${nodes[v].label}`, edgeKey(u, v));
          if (v === 5) break;
        }
      }
      if (parent[5] < 0) break;
      let bottleneck = Infinity;
      const path = [];
      for (let v = 5; v !== 0; v = parent[v]) { path.push(edgeKey(parent[v], v)); bottleneck = Math.min(bottleneck, capacity[parent[v]][v] - flow[parent[v]][v]); }
      path.reverse(); augmentations++;
      snapshot(`找到增广路径，瓶颈 ${bottleneck}`, null, path, bottleneck);
      for (let v = 5; v !== 0; v = parent[v]) { const u = parent[v]; flow[u][v] += bottleneck; flow[v][u] -= bottleneck; }
      maxFlow += bottleneck;
      snapshot(`沿路径增广 ${bottleneck}`, null, path, bottleneck);
    }
    snapshot('最大流计算完成');
  }

  function buildMatching() {
    const nodes = [
      { label: 'L1', x: .18, y: .12 }, { label: 'L2', x: .18, y: .32 }, { label: 'L3', x: .18, y: .52 }, { label: 'L4', x: .18, y: .72 },
      { label: 'R1', x: .80, y: .12 }, { label: 'R2', x: .80, y: .32 }, { label: 'R3', x: .80, y: .52 }, { label: 'R4', x: .80, y: .72 }
    ];
    const edges = [[0, 4], [0, 5], [1, 4], [1, 6], [2, 5], [2, 6], [2, 7], [3, 6], [3, 7]];
    const adj = Array.from({ length: 4 }, () => []); edges.forEach(([u, v]) => adj[u].push(v));
    const matchR = Array(8).fill(-1);
    let attempts = 0, matching = 0;
    const matchingEdges = () => matchR.map((u, v) => u >= 0 ? edgeKey(u, v) : null).filter(Boolean);
    const snapshot = (label, activeNode = -1, activeEdge = null) => push(label, 'graph', { nodes, edges, directed: false, activeNode, activeEdge, pathEdges: matchingEdges() }, [activeNode >= 0 && activeNode < 4 ? nodes[activeNode].label : '--', attempts, matching], `MATCHED ${matching}`);
    function augment(u, seen) {
      for (const v of adj[u]) {
        if (seen[v]) continue;
        seen[v] = true; attempts++;
        snapshot(`尝试 ${nodes[u].label}-${nodes[v].label}`, u, edgeKey(u, v));
        if (matchR[v] < 0 || augment(matchR[v], seen)) { matchR[v] = u; snapshot('增广路径更新匹配', u, edgeKey(u, v)); return true; }
      }
      return false;
    }
    snapshot('准备逐个匹配左侧节点');
    for (let u = 0; u < 4; u++) { if (augment(u, Array(8).fill(false))) matching++; snapshot(`${nodes[u].label} 处理完成`, u); }
    snapshot('最大二分匹配完成');
  }

  function buildAho() {
    const patterns = $('input-a').value.split(/[,，]+/).map((v) => v.trim().toLowerCase()).filter(Boolean).slice(0, 8);
    const text = $('input-b').value.toLowerCase().slice(0, 40);
    if (!patterns.length || !text) throw new Error('请输入模式串和文本');
    const nodes = [{ id: 0, ch: '∅', parent: -1, fail: 0, next: {}, out: [] }];
    let matches = [];
    const snapshot = (label, current = 0, textIndex = -1, activeFail = null) => push(label, 'trie', { trie: clone(nodes), current, text, textIndex, matches: clone(matches), activeFail }, [nodes.length, matches.length, textIndex < 0 ? '--' : textIndex], `PATTERNS ${patterns.join(' · ')}`);
    for (const pattern of patterns) {
      let state = 0;
      for (const ch of pattern) {
        if (nodes[state].next[ch] === undefined) { const id = nodes.length; nodes[state].next[ch] = id; nodes.push({ id, ch, parent: state, fail: 0, next: {}, out: [] }); }
        state = nodes[state].next[ch];
        snapshot(`插入字符 ${ch}`, state);
      }
      nodes[state].out.push(pattern);
      snapshot(`记录模式串 ${pattern}`, state);
    }
    const queue = [];
    Object.values(nodes[0].next).forEach((id) => { nodes[id].fail = 0; queue.push(id); });
    while (queue.length) {
      const r = queue.shift();
      for (const [ch, u] of Object.entries(nodes[r].next)) {
        queue.push(u);
        let f = nodes[r].fail;
        while (f && nodes[f].next[ch] === undefined) f = nodes[f].fail;
        if (nodes[f].next[ch] !== undefined && nodes[f].next[ch] !== u) f = nodes[f].next[ch];
        nodes[u].fail = f;
        nodes[u].out.push(...nodes[f].out);
        snapshot(`建立字符 ${ch} 的失败指针`, u, -1, [u, f]);
      }
    }
    let state = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      while (state && nodes[state].next[ch] === undefined) state = nodes[state].fail;
      if (nodes[state].next[ch] !== undefined) state = nodes[state].next[ch];
      for (const pattern of nodes[state].out) matches.push({ pattern, end: i });
      snapshot(nodes[state].out.length ? `匹配：${nodes[state].out.join(', ')}` : `扫描字符 ${ch}`, state, i);
    }
    snapshot('多模式匹配完成', state, text.length - 1);
  }

  function buildRabinKarp() {
    const text = $('input-a').value.toUpperCase().slice(0, 42), pattern = $('input-b').value.toUpperCase().slice(0, 16);
    if (!text || !pattern || pattern.length > text.length) throw new Error('模式串不能为空且不能长于文本');
    const base = 256, mod = 101, m = pattern.length;
    let high = 1, patternHash = 0, windowHash = 0, hashHits = 0, result = -1;
    for (let i = 0; i < m - 1; i++) high = (high * base) % mod;
    for (let i = 0; i < m; i++) { patternHash = (patternHash * base + pattern.charCodeAt(i)) % mod; windowHash = (windowHash * base + text.charCodeAt(i)) % mod; }
    for (let start = 0; start <= text.length - m; start++) {
      const equalHash = patternHash === windowHash;
      if (equalHash) hashHits++;
      const exact = equalHash && text.slice(start, start + m) === pattern;
      if (exact) result = start;
      push(exact ? `在索引 ${start} 找到模式串` : equalHash ? '哈希相同，逐字符校验失败' : `窗口移动到索引 ${start}`, 'string', { text, pattern, start, patternHash, windowHash, exact, result }, [start, hashHits, result < 0 ? '--' : result], `PATTERN HASH ${patternHash} · WINDOW HASH ${windowHash}`);
      if (exact) break;
      if (start < text.length - m) {
        windowHash = (base * (windowHash - text.charCodeAt(start) * high) + text.charCodeAt(start + m)) % mod;
        if (windowHash < 0) windowHash += mod;
      }
    }
    if (result < 0) push('文本中不存在模式串', 'string', { text, pattern, start: text.length - m, patternHash, windowHash, exact: false, result }, [text.length - m + 1, hashHits, '未找到'], 'SEARCH COMPLETE');
  }

  function buildEditDistance() {
    const a = $('input-a').value.toUpperCase().slice(0, 10), b = $('input-b').value.toUpperCase().slice(0, 10);
    if (!a || !b) throw new Error('两个字符串都不能为空');
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i ? (j ? 0 : i) : j));
    const rows = ['∅', ...a], cols = ['∅', ...b];
    let cells = 0;
    push('初始化边界代价', 'matrix', { matrix: clone(matrix), rowLabels: rows, colLabels: cols, active: null, path: [] }, [0, 0, 0], 'INSERT / DELETE COST');
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      cells++;
      push(cost ? `比较 ${a[i - 1]} 与 ${b[j - 1]}，选择最小操作` : `字符 ${a[i - 1]} 相同`, 'matrix', { matrix: clone(matrix), rowLabels: rows, colLabels: cols, active: [i, j], path: [] }, [cells, matrix[i][j], matrix[a.length][b.length]], `CELL [${i}, ${j}]`);
    }
    const path = [];
    let i = a.length, j = b.length;
    while (i || j) {
      path.push([i, j]);
      if (i && j && matrix[i][j] === matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { i--; j--; }
      else if (i && matrix[i][j] === matrix[i - 1][j] + 1) i--;
      else j--;
    }
    path.push([0, 0]);
    push(`编辑距离为 ${matrix[a.length][b.length]}`, 'matrix', { matrix: clone(matrix), rowLabels: rows, colLabels: cols, active: null, path }, [cells, matrix[a.length][b.length], matrix[a.length][b.length]], 'BACKTRACK COMPLETE');
  }

  function buildLis() {
    const arr = parseNumbers($('input-a').value, 26);
    if (arr.length < 2) throw new Error('请输入至少两个整数');
    const tails = [], tailIndices = [], prev = Array(arr.length).fill(-1);
    let comparisons = 0;
    push('准备最小尾值数组', 'lis', { arr, tails: [], current: -1, lisIndices: [] }, [0, 0, 0], 'TAILS');
    for (let i = 0; i < arr.length; i++) {
      let left = 0, right = tails.length;
      while (left < right) { const mid = (left + right) >> 1; comparisons++; if (tails[mid] < arr[i]) left = mid + 1; else right = mid; }
      if (left > 0) prev[i] = tailIndices[left - 1];
      tails[left] = arr[i]; tailIndices[left] = i;
      push(`把 ${arr[i]} 放到 tails[${left}]`, 'lis', { arr, tails: [...tails], current: i, position: left, lisIndices: [] }, [i + 1, comparisons, tails.length], `BINARY POSITION ${left}`);
    }
    const lisIndices = [];
    for (let p = tailIndices[tails.length - 1]; p >= 0; p = prev[p]) lisIndices.push(p);
    lisIndices.reverse();
    push(`最长递增子序列长度为 ${lisIndices.length}`, 'lis', { arr, tails: [...tails], current: -1, position: -1, lisIndices }, [arr.length, comparisons, lisIndices.length], `LIS [${lisIndices.map((i) => arr[i]).join(', ')}]`);
  }

  function buildHuffman() {
    const text = $('input-a').value.slice(0, 50);
    if (!text) throw new Error('请输入待编码文本');
    const frequencies = new Map();
    for (const ch of text) frequencies.set(ch, (frequencies.get(ch) || 0) + 1);
    let nextId = 0;
    let queue = [...frequencies].map(([char, freq]) => ({ id: nextId++, char: char === ' ' ? '空格' : char, freq, left: null, right: null }));
    const sortQueue = () => queue.sort((a, b) => a.freq - b.freq || a.id - b.id);
    sortQueue();
    let merges = 0;
    const snapshot = (label, tree = null) => {
      const bits = tree ? Object.entries(makeCodes(tree)).reduce((sum, [char, code]) => sum + frequencies.get(char === '空格' ? ' ' : char) * code.length, 0) : 0;
      push(label, 'huffman', { queue: clone(queue), tree: clone(tree) }, [frequencies.size, merges, bits || '--'], `QUEUE ${queue.map((n) => `${n.char || '•'}:${n.freq}`).join(' · ')}`);
    };
    function makeCodes(root) { const out = {}; (function walk(node, code) { if (!node.left && !node.right) out[node.char] = code || '0'; else { walk(node.left, code + '0'); walk(node.right, code + '1'); } })(root, ''); return out; }
    snapshot('建立字符频率优先队列');
    while (queue.length > 1) {
      sortQueue(); const left = queue.shift(), right = queue.shift();
      const parent = { id: nextId++, char: '', freq: left.freq + right.freq, left, right };
      queue.push(parent); sortQueue(); merges++;
      snapshot(`合并 ${left.char || '节点'} 与 ${right.char || '节点'}`, parent);
    }
    const root = queue[0], codes = makeCodes(root);
    const totalBits = [...text].reduce((sum, ch) => sum + codes[ch === ' ' ? '空格' : ch].length, 0);
    push('Huffman 编码树构建完成', 'huffman', { queue: clone(queue), tree: clone(root), codes }, [frequencies.size, merges, totalBits], Object.entries(codes).map(([ch, code]) => `${ch}:${code}`).join(' · '));
  }

  function buildBTree() {
    const values = [...new Set(parseNumbers($('input-a').value, 20))];
    if (values.length < 3) throw new Error('请输入至少三个不同整数');
    const t = 2;
    let root = { keys: [], children: [], leaf: true };
    let inserted = 0;
    const countNodes = (node) => 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
    const treeHeight = (node) => node.leaf ? 1 : 1 + treeHeight(node.children[0]);
    const snapshot = (label, activeKey = null) => push(label, 'btree', { tree: clone(root), activeKey }, [countNodes(root), treeHeight(root), inserted], `MIN DEGREE ${t}`);
    function splitChild(parent, index) {
      const full = parent.children[index], right = { keys: full.keys.splice(t), children: [], leaf: full.leaf }, promoted = full.keys.pop();
      if (!full.leaf) right.children = full.children.splice(t);
      parent.keys.splice(index, 0, promoted); parent.children.splice(index + 1, 0, right);
      snapshot(`满节点分裂，提升键 ${promoted}`, promoted);
    }
    function insertNonFull(node, key) {
      let i = node.keys.length - 1;
      if (node.leaf) {
        node.keys.push(key);
        while (i >= 0 && node.keys[i] > key) { node.keys[i + 1] = node.keys[i]; i--; }
        node.keys[i + 1] = key; inserted++;
        snapshot(`把 ${key} 插入叶节点`, key);
      } else {
        while (i >= 0 && key < node.keys[i]) i--;
        i++;
        snapshot(`沿键区间下降查找 ${key}`, key);
        if (node.children[i].keys.length === 2 * t - 1) { splitChild(node, i); if (key > node.keys[i]) i++; }
        insertNonFull(node.children[i], key);
      }
    }
    snapshot('初始化空 B 树');
    for (const key of values) {
      if (root.keys.length === 2 * t - 1) { const next = { keys: [], children: [root], leaf: false }; root = next; splitChild(root, 0); }
      insertNonFull(root, key);
    }
    snapshot('B 树插入序列完成');
  }

  function buildSkipList() {
    const values = [...new Set(parseNumbers($('input-a').value, 20))].sort((a, b) => a - b);
    const target = Math.round(Number($('input-b').value));
    if (values.length < 3 || !Number.isFinite(target)) throw new Error('请输入有效插入序列和查找目标');
    const levels = Array.from({ length: 5 }, () => []);
    let comparisons = 0;
    const levelFor = (value) => { let hash = Math.imul(value ^ 0x9e3779b9, 2654435761) >>> 0, level = 0; while (level < 4 && (hash & 3) === 0) { level++; hash >>>= 2; } return level; };
    values.forEach((value, index) => {
      const top = levelFor(value);
      for (let level = 0; level <= top; level++) levels[level].push(value);
      push(`插入 ${value}，塔高 ${top + 1}`, 'skip', { levels: clone(levels), active: value, level: top, visited: [] }, [index + 1, top + 1, comparisons], `HEIGHT ${top + 1}`);
    });
    const visited = [];
    let current = -Infinity;
    for (let level = levels.length - 1; level >= 0; level--) {
      for (const value of levels[level]) {
        if (value <= current) continue;
        comparisons++; visited.push([level, value]);
        push(value < target ? `第 ${level + 1} 层向右越过 ${value}` : `第 ${level + 1} 层比较 ${value}`, 'skip', { levels: clone(levels), active: value, level, visited: clone(visited) }, [values.length, level + 1, comparisons], `TARGET ${target}`);
        if (value < target) current = value; else break;
      }
    }
    push(values.includes(target) ? `找到目标 ${target}` : `目标 ${target} 不存在`, 'skip', { levels: clone(levels), active: target, level: 0, visited: clone(visited), found: values.includes(target) }, [values.length, 1, comparisons], values.includes(target) ? 'FOUND' : 'NOT FOUND');
  }

  function buildBloom() {
    const items = $('input-a').value.split(/[,，]+/).map((v) => v.trim().toLowerCase()).filter(Boolean).slice(0, 12), query = $('input-b').value.trim().toLowerCase();
    if (!items.length || !query) throw new Error('请输入插入项目和查询项目');
    const size = 32, bits = Array(size).fill(0);
    const hashes = (text) => {
      let a = 5381, b = 0, c = 2166136261;
      for (const ch of text) { const code = ch.charCodeAt(0); a = ((a << 5) + a + code) >>> 0; b = (Math.imul(b, 31) + code) >>> 0; c = Math.imul(c ^ code, 16777619) >>> 0; }
      return [a % size, b % size, c % size];
    };
    let calls = 0;
    for (const item of items) for (const position of hashes(item)) {
      bits[position] = 1; calls++;
      push(`插入 ${item}：置位 ${position}`, 'bloom', { bits: [...bits], active: [position], item, phase: 'insert' }, [bits.filter(Boolean).length, calls, '--'], `HASH → ${position}`);
    }
    const positions = hashes(query), checked = [];
    let possible = true;
    for (const position of positions) {
      checked.push(position); calls++;
      if (!bits[position]) possible = false;
      push(`查询 ${query}：检查位 ${position}`, 'bloom', { bits: [...bits], active: [...checked], item: query, phase: 'query', possible }, [bits.filter(Boolean).length, calls, possible ? '可能存在' : '一定不存在'], `BIT[${position}] = ${bits[position]}`);
    }
    push(possible ? `${query} 可能存在（允许误判）` : `${query} 一定不存在`, 'bloom', { bits: [...bits], active: positions, item: query, phase: 'done', possible }, [bits.filter(Boolean).length, calls, possible ? '可能存在' : '一定不存在'], possible ? 'POSSIBLY PRESENT' : 'DEFINITELY ABSENT');
  }

  function buildSparse() {
    const arr = parseNumbers($('input-a').value, 18), range = parseNumbers($('input-b').value, 2);
    if (arr.length < 2 || range.length < 2) throw new Error('请输入数组和查询区间');
    let [left, right] = range; left = Math.max(0, Math.min(arr.length - 1, left)); right = Math.max(left, Math.min(arr.length - 1, right));
    const levels = Math.floor(Math.log2(arr.length)) + 1, table = Array.from({ length: levels }, () => Array(arr.length).fill(null));
    table[0] = [...arr];
    let cells = arr.length;
    push('第 0 层保存原数组', 'sparse', { table: clone(table), active: [0, -1], arr, query: [left, right] }, [cells, '--', '--'], 'LENGTH 1');
    for (let k = 1; k < levels; k++) for (let i = 0; i + (1 << k) <= arr.length; i++) {
      table[k][i] = Math.min(table[k - 1][i], table[k - 1][i + (1 << (k - 1))]); cells++;
      push(`构建长度 ${1 << k} 的区间`, 'sparse', { table: clone(table), active: [k, i], arr, query: [left, right] }, [cells, k, '--'], `MIN [${i}, ${i + (1 << k) - 1}]`);
    }
    const k = Math.floor(Math.log2(right - left + 1)), second = right - (1 << k) + 1, result = Math.min(table[k][left], table[k][second]);
    push(`查询最小值为 ${result}`, 'sparse', { table: clone(table), active: null, blocks: [[k, left], [k, second]], arr, query: [left, right] }, [cells, k, result], `BLOCKS [${left}, ${left + (1 << k) - 1}] + [${second}, ${right}]`);
  }

  function buildQuadtree() {
    const count = Math.max(8, Math.min(40, Math.round(Number($('input-a').value) || 28)));
    let seed = 20260816;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const allPoints = Array.from({ length: count }, (_, id) => ({ id, x: .05 + random() * .9, y: .08 + random() * .82 }));
    function partition(points, box, depth = 0, rects = []) {
      rects.push(box);
      if (points.length <= 3 || depth >= 5) return rects;
      const mx = box.x + box.w / 2, my = box.y + box.h / 2;
      const boxes = [{ x: box.x, y: box.y, w: box.w / 2, h: box.h / 2 }, { x: mx, y: box.y, w: box.w / 2, h: box.h / 2 }, { x: box.x, y: my, w: box.w / 2, h: box.h / 2 }, { x: mx, y: my, w: box.w / 2, h: box.h / 2 }];
      boxes.forEach((child) => partition(points.filter((p) => p.x >= child.x && p.x <= child.x + child.w && p.y >= child.y && p.y <= child.y + child.h), child, depth + 1, rects));
      return rects;
    }
    for (let i = 1; i <= allPoints.length; i++) {
      const points = allPoints.slice(0, i), rects = partition(points, { x: 0, y: 0, w: 1, h: 1 });
      push(`插入空间点 ${i}`, 'quadtree', { points, rects, active: i - 1, query: null, found: [] }, [i, rects.length, 0], `POINT ${i}`);
    }
    const query = { x: .28, y: .24, w: .46, h: .46 }, found = allPoints.filter((p) => p.x >= query.x && p.x <= query.x + query.w && p.y >= query.y && p.y <= query.y + query.h).map((p) => p.id);
    push(`范围查询命中 ${found.length} 个点`, 'quadtree', { points: allPoints, rects: partition(allPoints, { x: 0, y: 0, w: 1, h: 1 }), active: -1, query, found }, [count, partition(allPoints, { x: 0, y: 0, w: 1, h: 1 }).length, found.length], 'RANGE QUERY');
  }

  function buildSieve() {
    const limit = Math.max(30, Math.min(150, Math.round(Number($('input-a').value) || 100))), prime = Array(limit + 1).fill(true);
    prime[0] = prime[1] = false;
    let marked = 0;
    push('初始化候选整数', 'sieve', { prime: [...prime], limit, current: -1, active: -1 }, ['--', 0, 0], `2..${limit}`);
    for (let p = 2; p * p <= limit; p++) if (prime[p]) {
      for (let multiple = p * p; multiple <= limit; multiple += p) if (prime[multiple]) {
        prime[multiple] = false; marked++;
        push(`用质数 ${p} 标记合数 ${multiple}`, 'sieve', { prime: [...prime], limit, current: p, active: multiple }, [p, marked, prime.slice(2).filter(Boolean).length], `${multiple} = ${p} × ${multiple / p}`);
      }
    }
    push(`筛得 ${prime.slice(2).filter(Boolean).length} 个质数`, 'sieve', { prime: [...prime], limit, current: -1, active: -1, done: true }, ['--', marked, prime.slice(2).filter(Boolean).length], 'PRIME SIEVE COMPLETE');
  }

  const builders = {
    'counting-sort': buildCounting, 'radix-sort': buildRadix, 'shell-sort': buildShell, 'bellman-ford': buildBellmanFord,
    'floyd-warshall': buildFloyd, 'tarjan-scc': buildTarjan, 'bridges-articulation': buildBridges, 'edmonds-karp': buildFlow,
    'bipartite-matching': buildMatching, 'aho-corasick': buildAho, 'rabin-karp': buildRabinKarp, 'edit-distance': buildEditDistance,
    'longest-increasing-subsequence': buildLis, 'huffman-coding': buildHuffman, 'b-tree': buildBTree, 'skip-list': buildSkipList,
    'bloom-filter': buildBloom, 'sparse-table': buildSparse, 'quadtree': buildQuadtree, 'sieve-of-eratosthenes': buildSieve
  };

  function refreshPalette() {
    const style = getComputedStyle(document.body);
    palette = Object.fromEntries(['bg', 'panel', 'panel-2', 'text', 'muted', 'line', 'accent', 'accent-2', 'good', 'danger', 'ink'].map((name) => [name, style.getPropertyValue(`--${name}`).trim()]));
  }

  function clear() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = palette.bg; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = palette.line; ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 80) { ctx.beginPath(); ctx.moveTo(x, 100); ctx.lineTo(x, height - 50); ctx.stroke(); }
    for (let y = 140; y < height; y += 80) { ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(width - 20, y); ctx.stroke(); }
  }

  function label(text, x, y, color = palette.muted, align = 'left', font = '11px ui-monospace, Consolas, monospace') {
    ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(String(text), x, y);
  }

  function rounded(x, y, w, h, fill, stroke = palette.line, radius = 5) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.stroke();
  }

  function drawRow(values, y, options = {}) {
    const n = Math.max(1, values.length), padding = options.padding || 38, gap = 5, cell = Math.max(18, Math.min(56, (width - padding * 2 - gap * (n - 1)) / n)), total = cell * n + gap * (n - 1), start = (width - total) / 2;
    values.forEach((value, index) => {
      const active = options.active === index, selected = options.selected?.includes(index), empty = value === null || value === undefined;
      rounded(start + index * (cell + gap), y, cell, options.height || 46, selected ? palette.good : active ? palette['accent-2'] : palette.panel, active ? palette['accent-2'] : selected ? palette.good : palette.line);
      label(empty ? '·' : value, start + index * (cell + gap) + cell / 2, y + (options.height || 46) / 2, active ? palette.ink : empty ? palette.muted : palette.text, 'center', '500 11px ui-monospace, Consolas, monospace');
      if (options.indices) label(index, start + index * (cell + gap) + cell / 2, y + (options.height || 46) + 14, palette.muted, 'center');
    });
    return { start, cell, gap };
  }

  function renderCounting(q) {
    label('INPUT', 28, 145); drawRow(q.arr, 162, { active: q.current, indices: true });
    label('OUTPUT', 28, 270); drawRow(q.output, 287, { active: q.outIndex, indices: true });
    label(q.phase === 'prefix' ? 'PREFIX COUNTS' : 'COUNT BUCKETS', 28, 405);
    drawRow(q.counts, 422, { active: q.bucket, height: 42 });
  }

  function renderRadix(q) {
    label('CURRENT ARRAY', 28, 145); drawRow(q.arr, 164, { active: q.current, indices: true });
    const bucketWidth = Math.max(26, Math.min(64, (width - 70) / 10 - 5)), start = (width - (bucketWidth * 10 + 5 * 9)) / 2;
    label('DIGIT BUCKETS', 28, 300);
    for (let i = 0; i < 10; i++) {
      const active = q.digit === i; rounded(start + i * (bucketWidth + 5), 323, bucketWidth, 150, active ? palette['accent-2'] : palette.panel, active ? palette['accent-2'] : palette.line);
      label(i, start + i * (bucketWidth + 5) + bucketWidth / 2, 342, active ? palette.ink : palette.accent, 'center');
      q.buckets[i].slice(-5).forEach((value, row) => label(value, start + i * (bucketWidth + 5) + bucketWidth / 2, 370 + row * 20, active ? palette.ink : palette.text, 'center'));
    }
  }

  function renderArray(q) {
    const arr = q.arr, max = Math.max(...arr.map(Math.abs), 1), baseY = Math.min(height - 105, 555), top = 170, gap = 5, barWidth = Math.max(10, Math.min(48, (width - 70 - gap * (arr.length - 1)) / arr.length)), total = barWidth * arr.length + gap * (arr.length - 1), start = (width - total) / 2;
    arr.forEach((value, index) => {
      const barHeight = Math.max(18, Math.abs(value) / max * (baseY - top - 32)), active = index === q.current, other = index === q.other, selected = q.sorted?.includes(index);
      rounded(start + index * (barWidth + gap), baseY - barHeight, barWidth, barHeight, selected ? palette.good : active ? palette['accent-2'] : other ? palette.danger : palette.accent, 'transparent', 3);
      label(value, start + index * (barWidth + gap) + barWidth / 2, baseY + 15, palette.text, 'center');
      if (q.gap > 0) label(index % q.gap, start + index * (barWidth + gap) + barWidth / 2, baseY + 34, palette.muted, 'center');
    });
    if (q.held !== undefined) { rounded(28, 150, 92, 42, palette['accent-2'], palette['accent-2']); label(`KEY ${q.held}`, 74, 171, palette.ink, 'center'); }
  }

  function drawArrow(x1, y1, x2, y2, color, directed) {
    const angle = Math.atan2(y2 - y1, x2 - x1), sx = x1 + Math.cos(angle) * 27, sy = y1 + Math.sin(angle) * 27, ex = x2 - Math.cos(angle) * 27, ey = y2 - Math.sin(angle) * 27;
    ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    if (directed) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - Math.cos(angle - .55) * 8, ey - Math.sin(angle - .55) * 8); ctx.lineTo(ex - Math.cos(angle + .55) * 8, ey - Math.sin(angle + .55) * 8); ctx.closePath(); ctx.fill(); }
  }

  function renderGraph(q) {
    const top = 105, available = Math.max(360, height - 180), positions = q.nodes.map((node) => ({ x: 42 + node.x * (width - 84), y: top + node.y * available }));
    q.edges.forEach((edge) => {
      const [u, v, weight] = edge, key = q.directed ? edgeKey(u, v) : undirectedKey(u, v), active = q.activeEdge === key, path = q.pathEdges?.includes(key), bridge = q.bridgeEdges?.includes(key), danger = q.dangerEdge === key;
      const color = danger ? palette.danger : bridge ? palette.danger : path ? palette.good : active ? palette['accent-2'] : palette.line;
      ctx.lineWidth = danger || bridge || path ? 4 : active ? 3 : 1.5;
      drawArrow(positions[u].x, positions[u].y, positions[v].x, positions[v].y, color, q.directed);
      const edgeLabel = q.edgeLabels?.[edgeKey(u, v)] ?? weight;
      if (edgeLabel !== undefined) { const mx = (positions[u].x + positions[v].x) / 2, my = (positions[u].y + positions[v].y) / 2; rounded(mx - 17, my - 10, 34, 20, palette.bg, 'transparent', 3); label(edgeLabel, mx, my, active ? palette['accent-2'] : palette.muted, 'center'); }
    });
    positions.forEach((position, index) => {
      const active = q.activeNode === index, art = q.articulationNodes?.includes(index), component = q.components?.[index] ?? -1;
      ctx.beginPath(); ctx.arc(position.x, position.y, 23, 0, Math.PI * 2);
      ctx.fillStyle = art ? palette.danger : component >= 0 ? [palette.good, palette.accent, palette['accent-2'], palette.danger][component % 4] : active ? palette['accent-2'] : palette.panel;
      ctx.fill(); ctx.strokeStyle = active ? palette['accent-2'] : art ? palette.danger : palette.accent; ctx.lineWidth = active || art ? 4 : 1.5; ctx.stroke();
      label(q.nodes[index].label, position.x, position.y, active || art || component >= 0 ? palette.ink : palette.text, 'center', '500 12px ui-monospace, Consolas, monospace');
      if (q.nodeValues) { const value = q.nodeValues[index]; label(Number.isFinite(value) ? value : value === Infinity ? '∞' : value, position.x, position.y + 37, palette.muted, 'center'); }
    });
  }

  function renderMatrix(q) {
    const rows = q.matrix.length, cols = q.matrix[0].length, top = 140, cell = Math.max(24, Math.min(90, (width - 72) / cols, (height - top - 75) / rows)), left = (width - cols * cell) / 2;
    q.colLabels.forEach((value, col) => label(value, left + col * cell + cell / 2, top - 18, palette.accent, 'center', '500 11px ui-monospace, Consolas, monospace'));
    q.rowLabels.forEach((value, row) => label(value, left - 20, top + row * cell + cell / 2, palette.accent, 'center', '500 11px ui-monospace, Consolas, monospace'));
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const active = q.active?.[0] === row && q.active?.[1] === col, via = q.k === row || q.k === col, path = q.path?.some(([r, c]) => r === row && c === col);
      const x = left + col * cell, y = top + row * cell;
      rounded(x, y, cell - 2, cell - 2, path ? palette.good : active ? palette['accent-2'] : via ? palette['panel-2'] : palette.panel, active ? palette['accent-2'] : path ? palette.good : palette.line, 3);
      const value = q.matrix[row][col]; label(Number.isFinite(value) ? value : '∞', x + (cell - 2) / 2, y + (cell - 2) / 2, active || path ? palette.ink : palette.text, 'center');
    }
  }

  function renderString(q) {
    label('TEXT', 28, 180); const row = drawRow([...q.text], 198, { indices: true });
    const startX = row.start + q.start * (row.cell + row.gap);
    ctx.strokeStyle = q.exact ? palette.good : q.patternHash === q.windowHash ? palette['accent-2'] : palette.accent; ctx.lineWidth = 3; ctx.strokeRect(startX - 2, 194, q.pattern.length * (row.cell + row.gap) - row.gap + 4, 54);
    label('PATTERN', 28, 315); drawRow([...q.pattern], 333);
    rounded(28, 445, Math.min(300, width - 56), 52, palette.panel, palette.line);
    label(`PATTERN HASH  ${q.patternHash}`, 44, 462, palette.muted);
    label(`WINDOW HASH   ${q.windowHash}`, 44, 482, q.patternHash === q.windowHash ? palette['accent-2'] : palette.text);
  }

  function trieLayout(nodes) {
    const children = nodes.map(() => []); nodes.forEach((node) => { if (node.parent >= 0) children[node.parent].push(node.id); });
    const positions = Array(nodes.length); let leaf = 0, maxDepth = 0;
    function walk(id, depth) { maxDepth = Math.max(maxDepth, depth); if (!children[id].length) positions[id] = { unit: leaf++, depth }; else { children[id].forEach((child) => walk(child, depth + 1)); positions[id] = { unit: children[id].reduce((sum, child) => sum + positions[child].unit, 0) / children[id].length, depth }; } }
    walk(0, 0); const denom = Math.max(1, leaf - 1);
    return positions.map((p) => ({ x: 45 + p.unit / denom * (width - 90), y: 145 + p.depth / Math.max(1, maxDepth) * (height - 270) }));
  }

  function renderTrie(q) {
    const positions = trieLayout(q.trie);
    q.trie.forEach((node) => { if (node.parent >= 0) { const a = positions[node.parent], b = positions[node.id]; ctx.lineWidth = 1.5; drawArrow(a.x, a.y, b.x, b.y, palette.line, false); } });
    q.trie.forEach((node) => { if (node.id && node.fail !== node.parent && node.fail !== node.id) { const a = positions[node.id], b = positions[node.fail]; ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = q.activeFail?.[0] === node.id ? palette['accent-2'] : palette.danger; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore(); } });
    q.trie.forEach((node) => { const p = positions[node.id], active = q.current === node.id; ctx.beginPath(); ctx.arc(p.x, p.y, node.id ? 16 : 20, 0, Math.PI * 2); ctx.fillStyle = node.out.length ? palette.good : active ? palette['accent-2'] : palette.panel; ctx.fill(); ctx.strokeStyle = active ? palette['accent-2'] : node.out.length ? palette.good : palette.accent; ctx.lineWidth = active ? 4 : 1.5; ctx.stroke(); label(node.ch, p.x, p.y, active || node.out.length ? palette.ink : palette.text, 'center'); });
    if (q.text) { const chars = [...q.text], max = Math.min(chars.length, Math.max(8, Math.floor((width - 50) / 24))), start = Math.max(0, Math.min(chars.length - max, q.textIndex - Math.floor(max / 2))), visible = chars.slice(start, start + max); label('TEXT STREAM', 28, height - 90); drawRow(visible, height - 72, { active: q.textIndex < 0 ? -1 : q.textIndex - start }); }
  }

  function renderLis(q) {
    label('SOURCE ARRAY', 28, 170); drawRow(q.arr, 188, { active: q.current, selected: q.lisIndices, indices: true });
    label('MINIMUM TAILS', 28, 330); drawRow(q.tails, 348, { active: q.position, indices: true });
    if (q.lisIndices?.length) label(`LIS  ${q.lisIndices.map((i) => q.arr[i]).join(' → ')}`, 28, 475, palette.good);
  }

  function treeLeaves(node) { return node && !node.left && !node.right ? 1 : node ? treeLeaves(node.left) + treeLeaves(node.right) : 0; }
  function renderHuffman(q) {
    label('PRIORITY QUEUE', 28, 140);
    q.queue.slice(0, 10).forEach((node, index) => { const x = 28 + index * Math.min(76, (width - 60) / Math.max(1, q.queue.length)); rounded(x, 158, 64, 40, palette.panel, palette.line); label(`${node.char || '•'}:${node.freq}`, x + 32, 178, palette.text, 'center'); });
    if (!q.tree) return;
    const leaves = Math.max(1, treeLeaves(q.tree)); let order = 0; const positions = new Map();
    function layout(node, depth) { if (!node.left && !node.right) positions.set(node.id, { x: 50 + order++ / Math.max(1, leaves - 1) * (width - 100), y: 280 + depth * 72 }); else { layout(node.left, depth + 1); layout(node.right, depth + 1); positions.set(node.id, { x: (positions.get(node.left.id).x + positions.get(node.right.id).x) / 2, y: 280 + depth * 72 }); } }
    layout(q.tree, 0);
    (function edges(node) { const a = positions.get(node.id); for (const [child, bit] of [[node.left, '0'], [node.right, '1']]) if (child) { const b = positions.get(child.id); drawArrow(a.x, a.y, b.x, b.y, palette.line, false); label(bit, (a.x + b.x) / 2, (a.y + b.y) / 2 - 8, palette.accent, 'center'); edges(child); } })(q.tree);
    (function nodes(node) { const p = positions.get(node.id); ctx.beginPath(); ctx.arc(p.x, p.y, 19, 0, Math.PI * 2); ctx.fillStyle = node.char ? palette.good : palette.panel; ctx.fill(); ctx.strokeStyle = node.char ? palette.good : palette.accent; ctx.stroke(); label(node.char || node.freq, p.x, p.y, node.char ? palette.ink : palette.text, 'center'); if (node.left) { nodes(node.left); nodes(node.right); } })(q.tree);
  }

  function btreeLevels(root) { const levels = [], queue = [[root, 0]]; while (queue.length) { const [node, depth] = queue.shift(); (levels[depth] ||= []).push(node); node.children.forEach((child) => queue.push([child, depth + 1])); } return levels; }
  function renderBTree(q) {
    const levels = btreeLevels(q.tree), pos = new Map();
    levels.forEach((nodes, depth) => nodes.forEach((node, index) => pos.set(node, { x: (index + 1) / (nodes.length + 1) * width, y: 175 + depth * 120 })));
    function findClonePosition(node) { for (const [candidate, p] of pos) if (candidate === node) return p; return null; }
    for (const [node, p] of pos) node.children.forEach((child) => { const cp = findClonePosition(child); if (cp) drawArrow(p.x, p.y, cp.x, cp.y, palette.line, false); });
    for (const [node, p] of pos) { const cell = 38, total = Math.max(1, node.keys.length) * cell; rounded(p.x - total / 2, p.y - 20, total, 40, palette.panel, palette.accent); node.keys.forEach((key, index) => { const active = key === q.activeKey; if (active) { ctx.fillStyle = palette['accent-2']; ctx.fillRect(p.x - total / 2 + index * cell, p.y - 19, cell, 38); } label(key, p.x - total / 2 + index * cell + cell / 2, p.y, active ? palette.ink : palette.text, 'center'); }); }
  }

  function renderSkip(q) {
    const levels = q.levels, all = levels[0], gap = Math.max(42, Math.min(72, (width - 90) / Math.max(1, all.length))), start = 50;
    for (let level = levels.length - 1; level >= 0; level--) {
      const y = 155 + (levels.length - 1 - level) * 82;
      label(`L${level}`, 20, y + 20, palette.accent);
      ctx.strokeStyle = palette.line; ctx.beginPath(); ctx.moveTo(start, y + 20); ctx.lineTo(width - 35, y + 20); ctx.stroke();
      levels[level].forEach((value) => { const index = all.indexOf(value), x = start + index * gap, active = value === q.active && level === q.level, visited = q.visited?.some(([l, v]) => l === level && v === value); rounded(x, y, 36, 40, active ? palette['accent-2'] : visited ? palette.good : palette.panel, active ? palette['accent-2'] : visited ? palette.good : palette.line); label(value, x + 18, y + 20, active || visited ? palette.ink : palette.text, 'center'); });
    }
  }

  function renderBloom(q) {
    label('BIT ARRAY · 32 CELLS', 28, 160);
    const cols = width < 520 ? 8 : 16, cell = Math.min(52, (width - 70) / cols - 5), rows = Math.ceil(q.bits.length / cols), start = (width - (cell + 5) * cols + 5) / 2;
    q.bits.forEach((bit, index) => { const row = Math.floor(index / cols), col = index % cols, active = q.active.includes(index), x = start + col * (cell + 5), y = 188 + row * 72; rounded(x, y, cell, 45, active ? palette['accent-2'] : bit ? palette.good : palette.panel, active ? palette['accent-2'] : bit ? palette.good : palette.line); label(bit, x + cell / 2, y + 21, active || bit ? palette.ink : palette.muted, 'center'); label(index, x + cell / 2, y + 58, palette.muted, 'center'); });
    label(`${q.phase.toUpperCase()} · ${q.item}`, 28, 188 + rows * 72 + 30, q.possible === false ? palette.danger : palette.accent);
  }

  function renderSparse(q) {
    const rows = q.table.length, cols = q.arr.length, left = 48, top = 145, cellW = Math.max(22, Math.min(50, (width - left - 24) / cols)), cellH = Math.max(42, Math.min(62, (height - top - 85) / rows));
    for (let row = 0; row < rows; row++) {
      label(`2^${row}`, left - 22, top + row * cellH + cellH / 2, palette.accent, 'center');
      for (let col = 0; col < cols; col++) {
        const value = q.table[row][col], active = q.active?.[0] === row && q.active?.[1] === col, block = q.blocks?.some(([r, c]) => r === row && c === col), x = left + col * cellW, y = top + row * cellH;
        rounded(x, y, cellW - 2, cellH - 2, block ? palette.good : active ? palette['accent-2'] : value === null ? palette.bg : palette.panel, block ? palette.good : active ? palette['accent-2'] : palette.line, 3);
        label(value === null ? '·' : value, x + (cellW - 2) / 2, y + (cellH - 2) / 2, active || block ? palette.ink : value === null ? palette.muted : palette.text, 'center');
      }
    }
  }

  function renderQuadtree(q) {
    const x0 = 34, y0 = 125, w = width - 68, h = height - 190;
    q.rects.forEach((rect, index) => { ctx.strokeStyle = index ? palette.line : palette.accent; ctx.lineWidth = index ? 1 : 2; ctx.strokeRect(x0 + rect.x * w, y0 + rect.y * h, rect.w * w, rect.h * h); });
    if (q.query) { ctx.fillStyle = colorWithAlpha(palette['accent-2'], .15); ctx.fillRect(x0 + q.query.x * w, y0 + q.query.y * h, q.query.w * w, q.query.h * h); ctx.strokeStyle = palette['accent-2']; ctx.lineWidth = 2; ctx.strokeRect(x0 + q.query.x * w, y0 + q.query.y * h, q.query.w * w, q.query.h * h); }
    q.points.forEach((point) => { const active = point.id === q.active, found = q.found.includes(point.id); ctx.beginPath(); ctx.arc(x0 + point.x * w, y0 + point.y * h, active ? 7 : 4, 0, Math.PI * 2); ctx.fillStyle = found ? palette.good : active ? palette['accent-2'] : palette.accent; ctx.fill(); });
  }

  function colorWithAlpha(color, alpha) { if (color.startsWith('#')) { const hex = color.slice(1), value = hex.length === 3 ? hex.split('').map((v) => v + v).join('') : hex; return `rgba(${parseInt(value.slice(0, 2), 16)},${parseInt(value.slice(2, 4), 16)},${parseInt(value.slice(4, 6), 16)},${alpha})`; } return color; }

  function renderSieve(q) {
    const values = Array.from({ length: q.limit - 1 }, (_, i) => i + 2), cols = width < 520 ? 8 : 12, cell = Math.max(28, Math.min(48, (width - 70) / cols - 5)), rows = Math.ceil(values.length / cols), totalH = rows * (cell + 6), startY = Math.max(125, (height - totalH) / 2), startX = (width - (cell + 5) * cols + 5) / 2;
    values.forEach((value, index) => { const row = Math.floor(index / cols), col = index % cols, active = value === q.active, current = value === q.current, isPrime = q.prime[value], x = startX + col * (cell + 5), y = startY + row * (cell + 6); rounded(x, y, cell, cell, active ? palette.danger : current ? palette['accent-2'] : isPrime ? palette.good : palette.panel, active ? palette.danger : current ? palette['accent-2'] : isPrime ? palette.good : palette.line, 3); label(value, x + cell / 2, y + cell / 2, active || current || isPrime ? palette.ink : palette.muted, 'center'); });
  }

  const renderers = { counting: renderCounting, radix: renderRadix, array: renderArray, graph: renderGraph, matrix: renderMatrix, string: renderString, trie: renderTrie, lis: renderLis, huffman: renderHuffman, btree: renderBTree, skip: renderSkip, bloom: renderBloom, sparse: renderSparse, quadtree: renderQuadtree, sieve: renderSieve };

  function updateUi() {
    const state = steps[stepIndex];
    if (!state) return;
    $('status').textContent = state.label;
    state.metrics.forEach((value, index) => { $(`metric-${index + 1}`).textContent = value; });
    $('note').textContent = `${state.note || cfg.eye} · STEP ${stepIndex + 1} / ${steps.length}`;
    $('play').textContent = running ? '暂停' : stepIndex === steps.length - 1 ? '重播' : '播放';
  }

  function build() {
    $('error').textContent = '';
    steps = [];
    try { builders[slug](); }
    catch (error) { $('error').textContent = error.message; return false; }
    if (!steps.length) { $('error').textContent = '未生成可视化步骤'; return false; }
    stepIndex = 0; running = false; lastTick = 0; updateUi(); return true;
  }

  function stepOnce() {
    if (stepIndex < steps.length - 1) stepIndex++;
    else running = false;
    updateUi();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height; dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); refreshPalette();
  }

  function frame(time) {
    if (running && (lastTick === 0 || time - lastTick > 520 / speed)) { stepOnce(); lastTick = time; }
    clear(); const state = steps[stepIndex]; if (state && renderers[state.kind]) renderers[state.kind](state);
    requestAnimationFrame(frame);
  }

  $('apply').addEventListener('click', build);
  $('reset').addEventListener('click', () => { $('input-a').value = cfg.a; if (cfg.bLabel) $('input-b').value = cfg.b; if (cfg.options) $('option').selectedIndex = 0; build(); });
  $('step').addEventListener('click', () => { running = false; if (stepIndex === steps.length - 1) build(); stepOnce(); });
  $('play').addEventListener('click', () => { if (stepIndex === steps.length - 1) build(); running = !running; lastTick = 0; updateUi(); });
  $('speed').addEventListener('input', (event) => { speed = Number(event.target.value); $('speed-value').textContent = `${speed.toFixed(1)}x`; });
  addEventListener('resize', resize);

  setUpPage(); resize(); build(); requestAnimationFrame(frame);
})();
