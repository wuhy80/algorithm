(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const parts = decodeURIComponent(location.pathname).split('/').filter(Boolean);
  const slug = parts.at(-1) === 'index.html' ? parts.at(-2) : parts.at(-1);

  const configs = {
    'static-array': { title:'静态数组', mono:'SA', eye:'STRUCTURE / STATIC ARRAY', aLabel:'整数元素（最多 24 个）', a:'8,3,5,1,9,2', bLabel:'更新下标,新值', b:'3,13', metrics:['当前操作','数组长度','目标值'], principle:'元素占据连续且固定的存储单元，下标可以直接换算为偏移地址。', complexity:'ACCESS / UPDATE O(1) · SEARCH O(N)' },
    'matrix-2d-array': { title:'二维数组与矩阵', mono:'2D', eye:'STRUCTURE / MATRIX', theme:'theme-violet', aLabel:'矩阵（分号分行）', a:'1,2,3;4,5,6;7,8,9', bLabel:'更新 行,列,新值', b:'1,2,42', metrics:['当前单元','线性偏移','元素总和'], principle:'行优先存储把坐标 (r,c) 映射为偏移 r×列数+c，同时保留二维视图。', complexity:'ACCESS / UPDATE O(1) · TRAVERSE O(RC)' },
    'doubly-linked-list': { title:'双向链表', mono:'DL', eye:'STRUCTURE / DOUBLY LINKED LIST', theme:'theme-green', aLabel:'操作（分号分隔）', a:'pushBack 4;pushBack 8;pushFront 2;insert 2 6;remove 8', metrics:['当前操作','指针修改','节点数量'], principle:'每个节点同时保存前驱和后继，局部修改两侧指针即可完成插入或删除。', complexity:'KNOWN-NODE INSERT / REMOVE O(1)' },
    'circular-linked-list': { title:'循环链表', mono:'CL', eye:'STRUCTURE / CIRCULAR LIST', theme:'theme-rose', aLabel:'操作（append / rotate / remove）', a:'append 4;append 8;append 15;rotate 2;remove 8;append 16', metrics:['当前操作','头节点','节点数量'], principle:'尾节点的 next 指回头节点，移动头引用即可让环形序列轮转。', complexity:'APPEND O(1) WITH TAIL · ROTATE O(K)' },
    'binary-tree-basics': { title:'二叉树基础', mono:'BT', eye:'STRUCTURE / BINARY TREE', theme:'theme-amber', aLabel:'层序节点（null 表示空）', a:'8,4,12,2,6,10,14', bLabel:'查找值', b:'6', metrics:['当前节点','待访问节点','目标深度'], principle:'层序数组中节点 i 的孩子位于 2i+1 与 2i+2，显式节点则通过左右引用连接。', complexity:'BUILD / SEARCH O(N)' },
    'n-ary-tree': { title:'多叉树', mono:'NT', eye:'STRUCTURE / N-ARY TREE', theme:'theme-violet', aLabel:'父,子边（分号分隔）', a:'A,B;A,C;A,D;B,E;B,F;D,G', bLabel:'统计指定节点的后代', b:'D', metrics:['当前节点','子节点数','后代数量'], principle:'每个节点保存可变长度的孩子列表，递归遍历会覆盖整个子树。', complexity:'BUILD / TRAVERSE O(N)' },
    'set-map-adt': { title:'集合与映射 ADT', mono:'SM', eye:'STRUCTURE / SET AND MAP', theme:'theme-green', aLabel:'操作（add / set / has / get / delete）', a:'set apple 3;set banana 2;add apple;has banana;delete banana', metrics:['当前操作','集合大小','映射条目'], principle:'集合表达唯一成员，映射表达键到值的关联；哈希实现通常提供平均常数时间操作。', complexity:'AVERAGE INSERT / DELETE / LOOKUP O(1)' },
    'open-addressing-hash-table': { title:'开放寻址哈希表', mono:'OH', eye:'STRUCTURE / OPEN ADDRESSING', theme:'theme-rose', aLabel:'插入整数键', a:'19,27,35,10,18', bLabel:'容量,查询键', b:'8,18', metrics:['当前键','探测次数','查询槽位'], principle:'发生冲突时继续探测同一数组中的后续槽位，查询必须沿相同探测序列进行。', complexity:'AVERAGE O(1) · WORST O(N)' },
    'graph-representations': { title:'图的表示', mono:'GR', eye:'STRUCTURE / GRAPH STORAGE', theme:'theme-amber', aLabel:'无向边 u,v（分号分隔）', a:'A,B;A,C;B,D;C,D;C,E', bLabel:'查看节点度数', b:'A', metrics:['当前表示','存储单元','目标度数'], principle:'边列表适合顺序处理，邻接表适合稀疏图，邻接矩阵适合常数时间判断边。', complexity:'LIST O(V+E) SPACE · MATRIX O(V²)' },
    'string-builder': { title:'字符串构建器', mono:'SB', eye:'STRUCTURE / MUTABLE TEXT BUFFER', theme:'theme-violet', aLabel:'初始字符串', a:'ALGORITHM', bLabel:'编辑操作（分号分隔）', b:'insert 5 _FAST_;delete 0 1;append !', metrics:['当前操作','缓冲容量','结果长度'], principle:'可变字符缓冲区保留额外容量，避免每次追加都复制整个不可变字符串。', complexity:'APPEND AMORTIZED O(1) · MIDDLE EDIT O(N)' },
    'array-operations': { title:'数组基本操作', mono:'AO', eye:'ARRAY / FUNDAMENTAL OPERATIONS', theme:'theme-green', aLabel:'整数数组', a:'4,8,15,16,23,42', bLabel:'操作（insert / update / delete）', b:'insert 2 9;update 4 17;delete 1', metrics:['当前操作','移动元素','数组长度'], principle:'下标访问直接定位；中间插入和删除必须移动后续元素以维持连续顺序。', complexity:'ACCESS O(1) · INSERT / DELETE O(N)' },
    'binary-search-boundaries': { title:'二分边界查找', mono:'BB', eye:'SEARCH / LOWER AND UPPER BOUND', theme:'theme-rose', aLabel:'非递减整数数组', a:'1,2,2,2,4,5,5,8', bLabel:'目标值', b:'2', metrics:['当前边界','比较次数','出现次数'], principle:'在半开区间 [lo,hi) 中分别寻找第一个 ≥target 与第一个 >target 的位置。', complexity:'LOWER / UPPER BOUND O(LOG N)' },
    'merge-intervals': { title:'合并区间', mono:'MI', eye:'INTERVAL / SORT AND SWEEP', theme:'theme-amber', aLabel:'区间 start,end（分号分隔）', a:'1,3;2,6;8,10;9,12;15,18', metrics:['当前区间','已合并数量','结果区间数'], principle:'按起点排序后，只需比较当前区间与结果末尾区间是否重叠。', complexity:'SORT O(N LOG N) · SWEEP O(N)' },
    'frequency-counting': { title:'频率统计', mono:'FC', eye:'COUNTING / HASH MAP', theme:'theme-violet', aLabel:'元素（逗号分隔）', a:'pear,apple,pear,orange,apple,pear', bLabel:'查询元素', b:'pear', metrics:['当前元素','不同元素','查询频次'], principle:'以元素为键、出现次数为值，扫描时把对应计数递增。', complexity:'AVERAGE TIME O(N) · SPACE O(K)' },
    'matrix-traversal': { title:'矩阵遍历', mono:'MX', eye:'MATRIX / TRAVERSAL ORDER', theme:'theme-green', aLabel:'矩阵（分号分行）', a:'1,2,3;4,5,6;7,8,9', bLabel:'顺序 row / column / spiral', b:'spiral', metrics:['当前坐标','当前值','已访问数量'], principle:'不同遍历顺序改变访问路径，但都会恰好覆盖矩阵中的每个单元格。', complexity:'TIME O(RC) · EXTRA SPACE O(1)' },
    'preorder-traversal': { title:'二叉树前序遍历', mono:'PRE', eye:'TREE / ROOT LEFT RIGHT', theme:'theme-rose', aLabel:'层序节点（null 表示空）', a:'8,4,12,2,6,10,14', metrics:['当前节点','递归深度','访问序列'], principle:'先访问根，再递归遍历左子树和右子树。', complexity:'TIME O(N) · STACK O(H)' },
    'inorder-traversal': { title:'二叉树中序遍历', mono:'IN', eye:'TREE / LEFT ROOT RIGHT', theme:'theme-amber', aLabel:'层序节点（null 表示空）', a:'8,4,12,2,6,10,14', metrics:['当前节点','递归深度','访问序列'], principle:'先递归左子树，再访问根，最后递归右子树；搜索树会得到递增序列。', complexity:'TIME O(N) · STACK O(H)' },
    'postorder-traversal': { title:'二叉树后序遍历', mono:'POST', eye:'TREE / LEFT RIGHT ROOT', theme:'theme-violet', aLabel:'层序节点（null 表示空）', a:'8,4,12,2,6,10,14', metrics:['当前节点','递归深度','访问序列'], principle:'先完成左右子树，再访问根节点，因此父节点可以合并两个子问题结果。', complexity:'TIME O(N) · STACK O(H)' },
    'level-order-traversal': { title:'二叉树层序遍历', mono:'LV', eye:'TREE / BREADTH FIRST', theme:'theme-green', aLabel:'层序节点（null 表示空）', a:'8,4,12,2,6,10,14', metrics:['当前节点','队列长度','访问序列'], principle:'队列保持下一层待访问节点，使节点严格按深度从小到大出队。', complexity:'TIME O(N) · QUEUE O(W)' },
    'tree-properties': { title:'二叉树性质', mono:'TP', eye:'TREE / STRUCTURAL PROPERTIES', theme:'theme-rose', aLabel:'层序节点（null 表示空）', a:'8,4,12,2,6,10,14', metrics:['已完成子树','树高度','叶子数量'], principle:'后序递归从孩子向父节点汇总节点数、高度、叶子数和平衡性。', complexity:'ONE POSTORDER PASS · O(N)' },
    'connected-components': { title:'无向图连通分量', mono:'CC', eye:'GRAPH / CONNECTED COMPONENTS', theme:'theme-amber', aLabel:'无向边 u,v（分号分隔）', a:'A,B;B,C;D,E;F,G;G,H', metrics:['当前节点','已访问节点','分量数量'], principle:'每次从未访问节点开始一次 DFS，恰好发现一个新的连通分量。', complexity:'DFS FOREST · O(V + E)' },
    'undirected-cycle-detection': { title:'无向图环检测', mono:'UC', eye:'GRAPH / UNDIRECTED CYCLE', theme:'theme-violet', aLabel:'无向边 u,v（分号分隔）', a:'A,B;B,C;C,A;C,D;D,E', metrics:['当前边','已访问节点','检测结果'], principle:'DFS 遇到已访问且不是当前父节点的邻居时，就发现了一条构成环的返边。', complexity:'DFS · O(V + E)' },
    'directed-cycle-detection': { title:'有向图环检测', mono:'DC', eye:'GRAPH / DIRECTED CYCLE', theme:'theme-green', aLabel:'有向边 u,v（分号分隔）', a:'A,B;B,C;C,A;C,D', metrics:['当前节点','递归栈节点','检测结果'], principle:'灰色节点仍在递归栈中，指向灰色节点的边就是有向环的返祖边。', complexity:'THREE-COLOR DFS · O(V + E)' },
    'bipartite-check': { title:'二分图判定', mono:'BP', eye:'GRAPH / TWO COLORING', theme:'theme-rose', aLabel:'无向边 u,v（分号分隔）', a:'A,B;B,C;C,D;D,A;A,E;C,E', metrics:['当前节点','已染色节点','是否二分图'], principle:'沿每条边给相邻节点染相反颜色；同色相邻意味着不存在合法二分。', complexity:'BFS COLORING · O(V + E)' },
    'flood-fill': { title:'洪水填充', mono:'FF', eye:'GRID / FLOOD FILL', theme:'theme-amber', aLabel:'数字网格（分号分行）', a:'1,1,1;1,1,0;1,0,1', bLabel:'起点行,列,新颜色', b:'1,1,2', metrics:['当前单元','队列长度','填充数量'], principle:'从起点出发，只把四邻域中仍为原颜色的单元加入队列。', complexity:'TIME / SPACE O(RC)' },
    'grid-search': { title:'网格搜索', mono:'GS', eye:'GRID / SHORTEST PATH BFS', theme:'theme-violet', aLabel:'网格行（S 起点、T 终点、# 障碍）', a:'S..#;.#..;...#;##.T', metrics:['当前单元','搜索前沿','最短步数'], principle:'无权网格中的每个可通行单元都是图节点，BFS 第一次到达终点即得到最短路。', complexity:'BFS · O(RC)' },
    'naive-string-search': { title:'朴素字符串匹配', mono:'NS', eye:'STRING / NAIVE SEARCH', theme:'theme-green', aLabel:'文本', a:'abracadabra', bLabel:'模式串', b:'abra', metrics:['对齐位置','字符比较','匹配次数'], principle:'把模式串依次对齐文本的每个可能起点，并从头逐字符比较。', complexity:'WORST O((N-M+1)M)' },
    'palindrome-check': { title:'回文判断', mono:'PC', eye:'STRING / TWO POINTERS', theme:'theme-rose', aLabel:'待判断文本', a:'A man, a plan, a canal: Panama', metrics:['比较位置','已比较对数','是否回文'], principle:'规范化文本后，左右指针成对比较并同时向中间收缩。', complexity:'TIME O(N) · SPACE O(N)' },
    'anagram-check': { title:'变位词判断', mono:'AN', eye:'STRING / CHARACTER COUNTS', theme:'theme-amber', aLabel:'第一个字符串', a:'listen', bLabel:'第二个字符串', b:'silent', metrics:['当前字符','非零计数','是否变位词'], principle:'第一个字符串增加字符计数，第二个字符串减少；最终全为零才是变位词。', complexity:'TIME O(N + M) · SPACE O(K)' },
    'longest-common-prefix': { title:'最长公共前缀', mono:'LP', eye:'STRING / COMMON PREFIX', theme:'theme-violet', aLabel:'单词（逗号分隔）', a:'flower,flow,flight', metrics:['当前列','已比较字符','公共前缀'], principle:'以最短单词为上界逐列比较，首个不一致位置之前就是公共前缀。', complexity:'TIME O(S) · SPACE O(1)' },
    'recursion-call-stack': { title:'递归与调用栈', mono:'RC', eye:'RECURSION / CALL STACK', theme:'theme-green', aLabel:'计算 n!（1-10）', a:'5', metrics:['当前栈帧','调用栈深度','返回结果'], principle:'递归调用先保存未完成的栈帧，命中基例后再从最深层逐层返回。', complexity:'FACTORIAL DEMO · TIME / STACK O(N)' },
    'fibonacci-memoization': { title:'斐波那契记忆化', mono:'FM', eye:'DP / MEMOIZED RECURSION', theme:'theme-rose', aLabel:'计算 F(n)（2-30）', a:'10', metrics:['当前子问题','缓存命中','F(n)'], principle:'每个 F(k) 只在首次访问时递归计算，之后直接从缓存读取。', complexity:'TIME O(N) · SPACE O(N)' },
    'climbing-stairs': { title:'爬楼梯动态规划', mono:'CS', eye:'DP / ONE DIMENSION', theme:'theme-amber', aLabel:'台阶数（1-40）', a:'8', metrics:['当前台阶','前两项状态','方案数量'], principle:'到达第 i 阶的最后一步来自 i-1 或 i-2，因此方案数是前两项之和。', complexity:'TIME O(N) · SPACE O(1)' },
    'grid-path-dp': { title:'网格路径动态规划', mono:'GP', eye:'DP / GRID PATHS', theme:'theme-violet', aLabel:'网格 行,列', a:'4,5', bLabel:'障碍 行,列（分号分隔）', b:'1,1;2,3', metrics:['当前单元','已填状态','路径数量'], principle:'非障碍单元的路径数等于上方与左侧路径数之和。', complexity:'TIME / SPACE O(RC)' },
    'permutation-generation': { title:'排列生成', mono:'PG', eye:'BACKTRACK / PERMUTATIONS', theme:'theme-green', aLabel:'互异元素（逗号分隔，最多 7 个）', a:'A,B,C', metrics:['当前选择','递归深度','排列数量'], principle:'每层选择一个尚未使用的元素，递归返回时撤销选择。', complexity:'OUTPUT O(N·N!) · STACK O(N)' },
    'combination-generation': { title:'组合生成', mono:'CG', eye:'BACKTRACK / COMBINATIONS', theme:'theme-rose', aLabel:'互异元素（逗号分隔，最多 12 个）', a:'A,B,C,D,E', bLabel:'选择数量 K', b:'3', metrics:['当前组合','递归深度','组合数量'], principle:'下一层只从当前下标之后选择，既避免重复顺序，也可按剩余数量提前剪枝。', complexity:'OUTPUT O(C(N,K)·K)' },
    'subset-enumeration': { title:'子集枚举', mono:'SE', eye:'BACKTRACK / POWER SET', theme:'theme-amber', aLabel:'互异元素（逗号分隔，最多 12 个）', a:'A,B,C,D', metrics:['当前决策','递归深度','子集数量'], principle:'每个元素只有选与不选两个分支，n 层决策树共有 2ⁿ 个叶子。', complexity:'OUTPUT O(N·2^N) · STACK O(N)' },
    'parentheses-generation': { title:'合法括号生成', mono:'PG', eye:'BACKTRACK / BALANCED PARENTHESES', theme:'theme-violet', aLabel:'括号对数（1-7）', a:'3', metrics:['当前前缀','未闭合括号','合法序列数'], principle:'左括号未用完时可以加入；只有右括号已用数量小于左括号时才能闭合。', complexity:'CATALAN OUTPUT · STACK O(N)' },
    'parentheses-matching': { title:'括号匹配', mono:'PM', eye:'STACK / DELIMITER MATCHING', theme:'theme-green', aLabel:'含括号字符串', a:'{[()()]}', metrics:['当前字符','栈深度','匹配结果'], principle:'左括号压栈；右括号必须与栈顶同类并弹出，结束时栈必须为空。', complexity:'TIME O(N) · STACK O(N)' }
  };

  const cfg = configs[slug];
  if (!cfg) throw new Error(`Unknown foundation-batch demo: ${slug}`);

  let steps = [];
  let stepIndex = 0;
  let running = false;
  let speed = 1;
  let lastTick = 0;
  let width = 1;
  let height = 1;
  let dpr = 1;
  let palette = {};

  const must = (condition, message) => { if (!condition) throw new Error(message); };
  const metric = (value) => value === Infinity ? '∞' : value === -Infinity ? '-∞' : String(value);
  const groups = (text) => text.split(';').map((item) => item.trim()).filter(Boolean);
  const numbers = (text) => text.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  const tokens = (text) => text.split(',').map((item) => item.trim()).filter(Boolean);

  function push(label, metrics, view = {}, note = '') {
    steps.push({ label, metrics: metrics.map(metric), view, note });
  }

  function parseMatrix(text, numeric = true) {
    const matrix = groups(text).map((row) => row.split(',').map((item) => {
      const value = item.trim();
      return numeric ? Number(value) : value;
    }));
    must(matrix.length && matrix[0].length, '请输入有效矩阵');
    must(matrix.every((row) => row.length === matrix[0].length), '矩阵每行列数必须一致');
    if (numeric) must(matrix.every((row) => row.every(Number.isFinite)), '矩阵只能包含数字');
    must(matrix.length <= 12 && matrix[0].length <= 12, '矩阵不能超过 12×12');
    return matrix;
  }

  function parseEdges(text) {
    const edges = groups(text).map((row) => row.split(',').map((item) => item.trim()));
    must(edges.length && edges.every((edge) => edge.length === 2 && edge[0] && edge[1]), '边格式应为 u,v;u,v');
    must(edges.length <= 40, '边数量不能超过 40');
    return edges;
  }

  function graphFromEdges(edges, directed = false) {
    const nodes = [...new Set(edges.flat())];
    const adjacency = Object.fromEntries(nodes.map((node) => [node, []]));
    for (const [from, to] of edges) {
      adjacency[from].push(to);
      if (!directed) adjacency[to].push(from);
    }
    return { nodes, edges, adjacency, directed };
  }

  function parseBinaryTree(text) {
    const raw = tokens(text);
    must(raw.length && raw.length <= 31, '请输入 1 到 31 个层序节点');
    const values = raw.map((value) => /^(null|#)$/i.test(value) ? null : value);
    must(values[0] !== null, '根节点不能为空');
    const nodes = [];
    const edges = [];
    const levels = {};
    for (let index = 0; index < values.length; index++) {
      if (values[index] === null) continue;
      const id = String(index);
      nodes.push(id);
      levels[id] = Math.floor(Math.log2(index + 1));
      if (index > 0) {
        const parent = String(Math.floor((index - 1) / 2));
        must(values[Number(parent)] !== null, `节点 ${values[index]} 的父节点为空`);
        edges.push([parent, id]);
      }
    }
    const labels = Object.fromEntries(nodes.map((id) => [id, values[Number(id)]]));
    const children = Object.fromEntries(nodes.map((id) => [id, []]));
    edges.forEach(([parent, child]) => children[parent].push(child));
    return { nodes, edges, levels, labels, children, values };
  }

  function treeView(tree, activeNodes = [], doneNodes = [], extra = {}) {
    return { graph:{ nodes:tree.nodes, edges:tree.edges, levels:tree.levels, labels:tree.labels, directed:true }, activeNodes, doneNodes, ...extra };
  }

  function buildStaticArray() {
    const values = numbers($('input-a').value).map(Math.round);
    const [index, nextValue] = numbers($('input-b').value).map(Math.round);
    must(values.length && values.length <= 24, '请输入 1 到 24 个整数');
    must(index >= 0 && index < values.length && Number.isFinite(nextValue), '更新下标或新值无效');
    const memory = Array(values.length).fill('·');
    push('分配固定连续空间', ['ALLOCATE', values.length, '--'], { values:memory }, 'FIXED CAPACITY');
    values.forEach((value, i) => {
      memory[i] = value;
      push(`写入下标 ${i}`, [`WRITE [${i}]`, values.length, value], { values:[...memory], selected:[i] }, `ADDRESS BASE + ${i} × WORD`);
    });
    push(`读取下标 ${index}`, [`READ [${index}]`, values.length, values[index]], { values:[...values], selected:[index] }, 'DIRECT INDEX ACCESS');
    values[index] = nextValue;
    push(`原地更新下标 ${index}`, [`UPDATE [${index}]`, values.length, values[index]], { values:[...values], selected:[index] }, 'NO RESIZE OR SHIFT');
  }

  function buildMatrix2d() {
    const matrix = parseMatrix($('input-a').value);
    const [row, col, value] = numbers($('input-b').value).map(Math.round);
    must(row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length && Number.isFinite(value), '更新坐标或新值无效');
    let sum = 0;
    for (let r = 0; r < matrix.length; r++) for (let c = 0; c < matrix[0].length; c++) {
      sum += matrix[r][c];
      push(`访问单元 (${r},${c})`, [`(${r},${c})`, r * matrix[0].length + c, sum], { matrix:matrix.map((line) => [...line]), active:[r,c] }, 'ROW-MAJOR OFFSET');
    }
    sum += value - matrix[row][col];
    matrix[row][col] = value;
    push(`更新单元 (${row},${col})`, [`(${row},${col})`, row * matrix[0].length + col, sum], { matrix, active:[row,col] }, 'CONSTANT-TIME UPDATE');
  }

  function buildDoublyLinkedList() {
    const operations = groups($('input-a').value);
    must(operations.length, '请输入链表操作');
    const list = [];
    let pointerChanges = 0;
    const view = (selected = []) => ({ values:[...list], selected, links:'double' });
    for (const raw of operations) {
      const [command, first, second] = raw.split(/\s+/);
      const value = Number(first);
      if (command === 'pushBack') { must(Number.isFinite(value), `操作无效：${raw}`); list.push(value); pointerChanges += list.length === 1 ? 2 : 4; }
      else if (command === 'pushFront') { must(Number.isFinite(value), `操作无效：${raw}`); list.unshift(value); pointerChanges += list.length === 1 ? 2 : 4; }
      else if (command === 'insert') { const index = Math.round(value), next = Number(second); must(index >= 0 && index <= list.length && Number.isFinite(next), `操作无效：${raw}`); list.splice(index, 0, next); pointerChanges += 4; }
      else if (command === 'remove') { const index = list.indexOf(value); must(index >= 0, `节点 ${value} 不存在`); list.splice(index, 1); pointerChanges += list.length ? 4 : 2; }
      else throw new Error(`未知操作：${command}`);
      must(list.length <= 20, '节点数量不能超过 20');
      push(`执行 ${raw}`, [raw, pointerChanges, list.length], view(list.length ? [Math.max(0, Math.min(list.length - 1, list.indexOf(value)))] : []), 'UPDATE PREV AND NEXT');
    }
  }

  function buildCircularLinkedList() {
    const operations = groups($('input-a').value);
    const list = [];
    for (const raw of operations) {
      const [command, token] = raw.split(/\s+/);
      const value = Number(token);
      if (command === 'append') { must(Number.isFinite(value), `操作无效：${raw}`); list.push(value); }
      else if (command === 'rotate') { must(Number.isInteger(value) && value >= 0, `操作无效：${raw}`); for (let i = 0; i < value && list.length; i++) list.push(list.shift()); }
      else if (command === 'remove') { const index = list.indexOf(value); must(index >= 0, `节点 ${value} 不存在`); list.splice(index, 1); }
      else throw new Error(`未知操作：${command}`);
      must(list.length <= 20, '节点数量不能超过 20');
      push(`执行 ${raw}`, [raw, list[0] ?? '--', list.length], { values:[...list], selected:list.length ? [0] : [], circular:true }, 'TAIL.NEXT = HEAD');
    }
  }

  function buildBinaryTreeBasics() {
    const tree = parseBinaryTree($('input-a').value);
    const target = $('input-b').value.trim();
    must(target, '请输入查找值');
    const built = [];
    for (const node of tree.nodes) {
      built.push(node);
      push(`连接节点 ${tree.labels[node]}`, [tree.labels[node], built.length, '--'], treeView(tree, [node], built), 'PARENT / LEFT / RIGHT');
    }
    const queue = [['0', 0]];
    const visited = [];
    let found = -1;
    while (queue.length) {
      const [node, depth] = queue.shift();
      visited.push(node);
      if (tree.labels[node] === target) { found = depth; push(`找到目标 ${target}`, [target, queue.length, found], treeView(tree, [node], visited), 'BREADTH-FIRST SEARCH'); break; }
      tree.children[node].forEach((child) => queue.push([child, depth + 1]));
      push(`检查节点 ${tree.labels[node]}`, [tree.labels[node], queue.length, '--'], treeView(tree, [node], visited), `DEPTH ${depth}`);
    }
    must(found >= 0, `未找到节点 ${target}`);
  }

  function buildNaryTree() {
    const edges = parseEdges($('input-a').value);
    const graph = graphFromEdges(edges, true);
    const indegree = Object.fromEntries(graph.nodes.map((node) => [node, 0]));
    edges.forEach(([, child]) => indegree[child]++);
    const roots = graph.nodes.filter((node) => indegree[node] === 0);
    must(roots.length === 1 && edges.length === graph.nodes.length - 1, '输入必须是一棵有根树');
    const levels = { [roots[0]]:0 };
    const queue = [roots[0]];
    for (let i = 0; i < queue.length; i++) for (const child of graph.adjacency[queue[i]]) { must(levels[child] === undefined, '输入包含环或重复父节点'); levels[child] = levels[queue[i]] + 1; queue.push(child); }
    must(queue.length === graph.nodes.length, '树中存在不可达节点');
    const target = $('input-b').value.trim();
    must(levels[target] !== undefined, `节点 ${target} 不存在`);
    const done = [];
    let descendants = 0;
    function walk(node, insideTarget = false) {
      const inside = insideTarget || node === target;
      done.push(node);
      if (node !== target && inside) descendants++;
      push(`访问节点 ${node}`, [node, graph.adjacency[node].length, descendants], { graph:{ nodes:graph.nodes, edges, levels, directed:true }, activeNodes:[node], doneNodes:[...done] }, 'N-ARY CHILD LIST');
      for (const child of graph.adjacency[node]) walk(child, inside);
    }
    function count(node) { let total = 0; for (const child of graph.adjacency[node]) total += 1 + count(child); return total; }
    walk(roots[0]);
    descendants = count(target);
    push(`节点 ${target} 的子树统计完成`, [target, graph.adjacency[target].length, descendants], { graph:{ nodes:graph.nodes, edges, levels, directed:true }, activeNodes:[target], doneNodes:graph.nodes }, 'DESCENDANTS EXCLUDE ROOT');
  }

  function buildSetMap() {
    const operations = groups($('input-a').value);
    const set = new Set();
    const map = new Map();
    for (const raw of operations) {
      const [command, key, value] = raw.split(/\s+/);
      must(key, `操作无效：${raw}`);
      let detail = '';
      if (command === 'add') { set.add(key); detail = `set.has(${key}) = true`; }
      else if (command === 'set') { must(value !== undefined, `操作无效：${raw}`); set.add(key); map.set(key, value); detail = `${key} → ${value}`; }
      else if (command === 'has') detail = `${key}: ${set.has(key)}`;
      else if (command === 'get') detail = `${key} → ${map.get(key) ?? 'undefined'}`;
      else if (command === 'delete') { set.delete(key); map.delete(key); detail = `removed ${key}`; }
      else throw new Error(`未知操作：${command}`);
      const lines = [...set].map((item) => `${item}${map.has(item) ? ` → ${map.get(item)}` : ''}`);
      push(`执行 ${raw}`, [detail, set.size, map.size], { lines:lines.length ? lines : ['∅'] }, 'SET MEMBERS / MAP ENTRIES');
    }
  }

  function buildOpenAddressing() {
    const keys = numbers($('input-a').value).map(Math.round);
    const [capacityRaw, query] = numbers($('input-b').value).map(Math.round);
    const capacity = Math.max(4, Math.min(32, capacityRaw));
    must(keys.length && keys.length < capacity && new Set(keys).size === keys.length && Number.isFinite(query), '键必须互异、数量小于容量，并提供查询键');
    const table = Array(capacity).fill('·');
    const hash = (key) => ((key % capacity) + capacity) % capacity;
    for (const key of keys) {
      let index = hash(key);
      let probes = 1;
      while (table[index] !== '·') { push(`键 ${key} 在槽位 ${index} 冲突`, [key, probes, '--'], { values:[...table], selected:[index] }, 'LINEAR PROBE'); index = (index + 1) % capacity; probes++; must(probes <= capacity, '哈希表已满'); }
      table[index] = key;
      push(`把键 ${key} 放入槽位 ${index}`, [key, probes, '--'], { values:[...table], selected:[index] }, `LOAD ${(keys.indexOf(key) + 1) / capacity}`);
    }
    let index = hash(query);
    let probes = 1;
    while (table[index] !== '·' && table[index] !== query && probes <= capacity) { push(`查询 ${query} 探测槽位 ${index}`, [query, probes, '--'], { values:[...table], selected:[index] }, 'FOLLOW SAME PROBE SEQUENCE'); index = (index + 1) % capacity; probes++; }
    const found = table[index] === query ? index : -1;
    push(found >= 0 ? `在槽位 ${found} 找到 ${query}` : `键 ${query} 不存在`, [query, probes, found], { values:[...table], selected:found >= 0 ? [found] : [] }, 'LOOKUP COMPLETE');
  }

  function buildGraphRepresentations() {
    const edges = parseEdges($('input-a').value);
    const graph = graphFromEdges(edges);
    const target = $('input-b').value.trim();
    must(graph.adjacency[target], `节点 ${target} 不存在`);
    push('读取边列表', ['EDGE LIST', edges.length * 2, graph.adjacency[target].length], { lines:edges.map(([u,v]) => `${u} — ${v}`) }, 'STORE PAIRS');
    push('构造邻接表', ['ADJ LIST', graph.nodes.length + edges.length * 2, graph.adjacency[target].length], { lines:graph.nodes.map((node) => `${node}: ${graph.adjacency[node].join(', ')}`) }, 'SPARSE GRAPH STORAGE');
    const matrix = graph.nodes.map((u) => graph.nodes.map((v) => graph.adjacency[u].includes(v) ? 1 : 0));
    push('构造邻接矩阵', ['ADJ MATRIX', graph.nodes.length ** 2, graph.adjacency[target].length], { matrix, rowLabels:graph.nodes, colLabels:graph.nodes }, 'CONSTANT-TIME EDGE TEST');
  }

  function buildStringBuilder() {
    const initial = $('input-a').value;
    const operations = groups($('input-b').value);
    must(initial.length <= 80, '初始字符串不能超过 80 个字符');
    const buffer = [...initial];
    let capacity = Math.max(8, 2 ** Math.ceil(Math.log2(Math.max(1, buffer.length))));
    push('载入初始字符缓冲区', ['INIT', capacity, buffer.length], { values:[...buffer] }, 'MUTABLE CHARACTER BUFFER');
    for (const raw of operations) {
      const [command, first, second] = raw.split(/\s+/);
      if (command === 'append') buffer.push(first ?? '');
      else if (command === 'insert') { const index = Number(first); must(Number.isInteger(index) && index >= 0 && index <= buffer.length && second !== undefined, `操作无效：${raw}`); buffer.splice(index, 0, ...second); }
      else if (command === 'delete') { const index = Number(first), count = Number(second); must(Number.isInteger(index) && Number.isInteger(count) && index >= 0 && count >= 0, `操作无效：${raw}`); buffer.splice(index, count); }
      else throw new Error(`未知操作：${command}`);
      while (buffer.length > capacity) capacity *= 2;
      must(buffer.length <= 96, '结果字符串不能超过 96 个字符');
      push(`执行 ${raw}`, [raw, capacity, buffer.length], { lines:[buffer.join('')], values:buffer.slice(0, 48) }, 'EDIT SHARED BUFFER');
    }
  }

  function buildArrayOperations() {
    const array = numbers($('input-a').value).map(Math.round);
    const operations = groups($('input-b').value);
    must(array.length && array.length <= 30, '请输入 1 到 30 个整数');
    let moved = 0;
    push('读取数组', ['READ', 0, array.length], { values:[...array] }, 'CONTIGUOUS STORAGE');
    for (const raw of operations) {
      const [command, a, b] = raw.split(/\s+/);
      const index = Number(a);
      if (command === 'insert') { const value = Number(b); must(Number.isInteger(index) && index >= 0 && index <= array.length && Number.isFinite(value), `操作无效：${raw}`); moved += array.length - index; array.splice(index, 0, value); }
      else if (command === 'update') { const value = Number(b); must(Number.isInteger(index) && index >= 0 && index < array.length && Number.isFinite(value), `操作无效：${raw}`); array[index] = value; }
      else if (command === 'delete') { must(Number.isInteger(index) && index >= 0 && index < array.length, `操作无效：${raw}`); moved += array.length - index - 1; array.splice(index, 1); }
      else throw new Error(`未知操作：${command}`);
      push(`执行 ${raw}`, [raw, moved, array.length], { values:[...array], selected:index < array.length ? [index] : [] }, 'SHIFT SUFFIX WHEN LENGTH CHANGES');
    }
  }

  function buildBinaryBoundaries() {
    const array = numbers($('input-a').value);
    const target = Number($('input-b').value);
    must(array.length && array.every((value, index) => !index || value >= array[index - 1]) && Number.isFinite(target), '数组必须非递减，目标必须是数字');
    let comparisons = 0;
    function boundary(upper) {
      let low = 0;
      let high = array.length;
      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        comparisons++;
        const goRight = upper ? array[mid] <= target : array[mid] < target;
        push(`${upper ? 'upper' : 'lower'}: 比较下标 ${mid}`, [`${low}-${high}`, comparisons, '--'], { values:[...array], selected:[mid], range:[low, Math.max(low, high - 1)] }, goRight ? 'MOVE LOW RIGHT' : 'MOVE HIGH LEFT');
        if (goRight) low = mid + 1; else high = mid;
      }
      return low;
    }
    const lower = boundary(false);
    const upper = boundary(true);
    push(`目标 ${target} 的边界为 [${lower},${upper})`, [`${lower},${upper}`, comparisons, upper - lower], { values:[...array], range:lower < upper ? [lower,upper - 1] : undefined }, 'COUNT = UPPER - LOWER');
  }

  function buildMergeIntervals() {
    const intervals = groups($('input-a').value).map((row) => numbers(row));
    must(intervals.length && intervals.every((range) => range.length === 2 && range[0] <= range[1]), '区间格式或端点无效');
    intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const merged = [];
    for (const interval of intervals) {
      if (!merged.length || interval[0] > merged.at(-1)[1]) merged.push([...interval]);
      else merged.at(-1)[1] = Math.max(merged.at(-1)[1], interval[1]);
      push(
        `扫描区间 [${interval}]`,
        [`[${interval}]`, merged.length, merged.length],
        { lines:merged.map(([start,end]) => `[${start}, ${end}]`) },
        interval === intervals.at(-1) ? 'MERGE COMPLETE' : 'OVERLAP WITH LAST RESULT?',
      );
    }
  }

  function buildFrequencyCounting() {
    const items = tokens($('input-a').value);
    const target = $('input-b').value.trim();
    must(items.length && items.length <= 80 && target, '请输入元素与查询值');
    const counts = new Map();
    for (const item of items) {
      counts.set(item, (counts.get(item) || 0) + 1);
      const lines = [...counts].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key,count]) => `${key}: ${count}`);
      push(`统计 ${item}`, [item, counts.size, counts.get(target) || 0], { lines }, 'INCREMENT HASH COUNTER');
    }
  }

  function buildMatrixTraversal() {
    const matrix = parseMatrix($('input-a').value);
    const mode = $('input-b').value.trim().toLowerCase();
    const order = [];
    if (mode === 'row') for (let r = 0; r < matrix.length; r++) for (let c = 0; c < matrix[0].length; c++) order.push([r,c]);
    else if (mode === 'column') for (let c = 0; c < matrix[0].length; c++) for (let r = 0; r < matrix.length; r++) order.push([r,c]);
    else if (mode === 'spiral') {
      let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
      while (top <= bottom && left <= right) {
        for (let c = left; c <= right; c++) order.push([top,c]); top++;
        for (let r = top; r <= bottom; r++) order.push([r,right]); right--;
        if (top <= bottom) { for (let c = right; c >= left; c--) order.push([bottom,c]); bottom--; }
        if (left <= right) { for (let r = bottom; r >= top; r--) order.push([r,left]); left++; }
      }
    } else throw new Error('遍历顺序必须是 row、column 或 spiral');
    const visited = [];
    order.forEach(([row,col], index) => {
      visited.push(`${row},${col}`);
      push(`访问 (${row},${col})`, [`(${row},${col})`, matrix[row][col], index + 1], { matrix, active:[row,col], visited:[...visited] }, mode.toUpperCase());
    });
  }

  function buildTreeTraversal(order) {
    const tree = parseBinaryTree($('input-a').value);
    const visited = [];
    function walk(node, depth) {
      if (!node) return;
      const [left, right] = tree.children[node];
      if (order === 'pre') visit(node, depth);
      if (left) walk(left, depth + 1);
      if (order === 'in') visit(node, depth);
      if (right) walk(right, depth + 1);
      if (order === 'post') visit(node, depth);
    }
    function visit(node, depth) {
      visited.push(node);
      push(`访问节点 ${tree.labels[node]}`, [tree.labels[node], depth, visited.map((id) => tree.labels[id]).join(',')], treeView(tree, [node], [...visited]), `${order.toUpperCase()}ORDER`);
    }
    walk('0', 0);
  }

  function buildPreorder() { buildTreeTraversal('pre'); }
  function buildInorder() { buildTreeTraversal('in'); }
  function buildPostorder() { buildTreeTraversal('post'); }

  function buildLevelOrder() {
    const tree = parseBinaryTree($('input-a').value);
    const queue = ['0'];
    const visited = [];
    while (queue.length) {
      const node = queue.shift();
      visited.push(node);
      tree.children[node].forEach((child) => queue.push(child));
      push(`节点 ${tree.labels[node]} 出队`, [tree.labels[node], queue.length, visited.map((id) => tree.labels[id]).join(',')], treeView(tree, [node], [...visited]), `QUEUE ${queue.map((id) => tree.labels[id]).join(', ') || 'EMPTY'}`);
    }
  }

  function buildTreeProperties() {
    const tree = parseBinaryTree($('input-a').value);
    const done = [];
    let leaves = 0;
    function inspect(node) {
      if (!node) return { size:0, height:0, balanced:true };
      const [left, right] = tree.children[node];
      const a = inspect(left);
      const b = inspect(right);
      const result = { size:a.size + b.size + 1, height:Math.max(a.height,b.height) + 1, balanced:a.balanced && b.balanced && Math.abs(a.height-b.height) <= 1 };
      if (!left && !right) leaves++;
      done.push(node);
      push(`汇总节点 ${tree.labels[node]}`, [done.length, result.height, leaves], treeView(tree, [node], [...done]), `SIZE ${result.size} · ${result.balanced ? 'BALANCED' : 'UNBALANCED'}`);
      return result;
    }
    inspect('0');
  }

  function buildConnectedComponents() {
    const graph = graphFromEdges(parseEdges($('input-a').value));
    const visited = new Set();
    const componentOf = {};
    let components = 0;
    for (const start of graph.nodes) {
      if (visited.has(start)) continue;
      components++;
      const stack = [start];
      while (stack.length) {
        const node = stack.pop();
        if (visited.has(node)) continue;
        visited.add(node);
        componentOf[node] = components;
        graph.adjacency[node].forEach((next) => { if (!visited.has(next)) stack.push(next); });
        push(`分量 ${components} 访问 ${node}`, [node, visited.size, components], { graph, activeNodes:[node], doneNodes:[...visited], nodeColors:{...componentOf}, colorMode:'components' }, 'DFS FOREST');
      }
    }
  }

  function buildUndirectedCycle() {
    const graph = graphFromEdges(parseEdges($('input-a').value));
    const visited = new Set();
    let cycle = null;
    function dfs(node, parent) {
      visited.add(node);
      for (const next of graph.adjacency[node]) {
        push(`检查边 ${node}—${next}`, [`${node}—${next}`, visited.size, cycle ? '有环' : '检查中'], { graph, activeNodes:[node,next], doneNodes:[...visited], activeEdges:[[node,next]] }, next === parent ? 'PARENT EDGE' : 'DFS EDGE');
        if (next === parent) continue;
        if (visited.has(next)) { cycle = [node,next]; return true; }
        if (dfs(next, node)) return true;
      }
      return false;
    }
    for (const node of graph.nodes) if (!visited.has(node) && dfs(node, null)) break;
    push(cycle ? `发现成环边 ${cycle[0]}—${cycle[1]}` : '图中没有环', [cycle ? cycle.join('—') : '--', visited.size, cycle ? '有环' : '无环'], { graph, activeNodes:cycle || [], doneNodes:[...visited], activeEdges:cycle ? [cycle] : [] }, 'CYCLE CHECK COMPLETE');
  }

  function buildDirectedCycle() {
    const graph = graphFromEdges(parseEdges($('input-a').value), true);
    const color = Object.fromEntries(graph.nodes.map((node) => [node, 0]));
    let cycle = null;
    function dfs(node) {
      color[node] = 1;
      push(`节点 ${node} 进入递归栈`, [node, Object.values(color).filter((x) => x === 1).length, '检查中'], { graph, activeNodes:[node], nodeColors:{...color}, colorMode:'state' }, 'GRAY = ACTIVE');
      for (const next of graph.adjacency[node]) {
        if (color[next] === 1) { cycle = [node,next]; return true; }
        if (color[next] === 0 && dfs(next)) return true;
      }
      color[node] = 2;
      push(`节点 ${node} 完成`, [node, Object.values(color).filter((x) => x === 1).length, '检查中'], { graph, doneNodes:Object.keys(color).filter((key) => color[key] === 2), nodeColors:{...color}, colorMode:'state' }, 'BLACK = FINISHED');
      return false;
    }
    for (const node of graph.nodes) if (color[node] === 0 && dfs(node)) break;
    push(cycle ? `发现返祖边 ${cycle[0]}→${cycle[1]}` : '有向图无环', [cycle ? cycle.join('→') : '--', Object.values(color).filter((x) => x === 1).length, cycle ? '有环' : '无环'], { graph, activeNodes:cycle || [], activeEdges:cycle ? [cycle] : [], nodeColors:{...color}, colorMode:'state' }, 'THREE-COLOR CHECK COMPLETE');
  }

  function buildBipartite() {
    const graph = graphFromEdges(parseEdges($('input-a').value));
    const color = {};
    let valid = true;
    let conflict = null;
    for (const start of graph.nodes) {
      if (color[start] !== undefined) continue;
      color[start] = 0;
      const queue = [start];
      while (queue.length && valid) {
        const node = queue.shift();
        for (const next of graph.adjacency[node]) {
          if (color[next] === undefined) { color[next] = 1 - color[node]; queue.push(next); }
          else if (color[next] === color[node]) { valid = false; conflict = [node,next]; break; }
        }
        push(`给节点 ${node} 染色`, [node, Object.keys(color).length, valid ? '检查中' : '否'], { graph, activeNodes:[node], activeEdges:conflict ? [conflict] : [], nodeColors:{...color}, colorMode:'partition' }, `COLOR ${color[node]}`);
      }
      if (!valid) break;
    }
    push(valid ? '所有边均连接异色节点' : `边 ${conflict.join('—')} 发生同色冲突`, [conflict ? conflict.join('—') : '--', Object.keys(color).length, valid ? '是' : '否'], { graph, activeNodes:conflict || [], activeEdges:conflict ? [conflict] : [], nodeColors:{...color}, colorMode:'partition' }, 'BIPARTITE CHECK COMPLETE');
  }

  function buildFloodFill() {
    const matrix = parseMatrix($('input-a').value);
    const [startRow, startCol, newColor] = numbers($('input-b').value).map(Math.round);
    must(startRow >= 0 && startRow < matrix.length && startCol >= 0 && startCol < matrix[0].length && Number.isFinite(newColor), '起点或新颜色无效');
    const oldColor = matrix[startRow][startCol];
    const queue = [[startRow,startCol]];
    const seen = new Set([`${startRow},${startCol}`]);
    let filled = 0;
    while (queue.length) {
      const [row,col] = queue.shift();
      matrix[row][col] = newColor;
      filled++;
      for (const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const r = row + dr, c = col + dc, key = `${r},${c}`;
        if (r >= 0 && r < matrix.length && c >= 0 && c < matrix[0].length && !seen.has(key) && matrix[r][c] === oldColor) { seen.add(key); queue.push([r,c]); }
      }
      push(`填充单元 (${row},${col})`, [`(${row},${col})`, queue.length, filled], { matrix:matrix.map((line) => [...line]), active:[row,col], visited:[...seen] }, `COLOR ${oldColor} → ${newColor}`);
    }
  }

  function buildGridSearch() {
    const matrix = groups($('input-a').value).map((row) => [...row]);
    must(matrix.length && matrix.every((row) => row.length === matrix[0].length) && matrix.length <= 20 && matrix[0].length <= 20, '网格行长度必须一致且不超过 20×20');
    let start = null, target = null;
    matrix.forEach((row, r) => row.forEach((cell, c) => { if (cell === 'S') start = [r,c]; if (cell === 'T') target = [r,c]; }));
    must(start && target, '网格必须各包含一个 S 和 T');
    const queue = [start];
    const distance = new Map([[start.join(','), 0]]);
    const parent = new Map();
    let found = null;
    for (let head = 0; head < queue.length; head++) {
      const [row,col] = queue[head];
      const key = `${row},${col}`;
      if (row === target[0] && col === target[1]) { found = key; break; }
      for (const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const r = row + dr, c = col + dc, next = `${r},${c}`;
        if (r >= 0 && r < matrix.length && c >= 0 && c < matrix[0].length && matrix[r][c] !== '#' && !distance.has(next)) { distance.set(next, distance.get(key) + 1); parent.set(next, key); queue.push([r,c]); }
      }
      push(`扩展单元 (${row},${col})`, [`(${row},${col})`, queue.length - head - 1, '--'], { matrix, active:[row,col], visited:[...distance.keys()] }, 'BFS FRONTIER');
    }
    must(found, '终点不可达');
    const path = [];
    for (let key = found; key; key = parent.get(key)) path.push(key);
    push(`找到长度为 ${distance.get(found)} 的最短路径`, [found, 0, distance.get(found)], { matrix, active:target, visited:[...distance.keys()], path }, 'FIRST ARRIVAL IS SHORTEST');
  }

  function buildNaiveStringSearch() {
    const text = $('input-a').value;
    const pattern = $('input-b').value;
    must(pattern.length && pattern.length <= text.length, '模式串不能为空且不能长于文本');
    let comparisons = 0;
    let matches = 0;
    for (let start = 0; start + pattern.length <= text.length; start++) {
      let matched = 0;
      while (matched < pattern.length) {
        comparisons++;
        push(`对齐 ${start}，比较第 ${matched} 个字符`, [start, comparisons, matches], { lines:[text, `${' '.repeat(start)}${pattern}`, `${' '.repeat(start + matched)}^`] }, text[start + matched] === pattern[matched] ? 'CHARACTER MATCH' : 'MISMATCH');
        if (text[start + matched] !== pattern[matched]) break;
        matched++;
      }
      if (matched === pattern.length) matches++;
    }
    push(`匹配完成，共 ${matches} 处`, ['DONE', comparisons, matches], { lines:[text, `pattern: ${pattern}`] }, 'NAIVE SEARCH COMPLETE');
  }

  function buildPalindrome() {
    const original = $('input-a').value;
    const normalized = [...original.toLowerCase()].filter((char) => /[\p{L}\p{N}]/u.test(char));
    must(normalized.length, '请输入至少一个字母或数字');
    let left = 0, right = normalized.length - 1, pairs = 0, valid = true;
    while (left < right) {
      valid = normalized[left] === normalized[right];
      pairs++;
      push(`比较下标 ${left} 与 ${right}`, [`${left},${right}`, pairs, valid ? '检查中' : '否'], { values:[...normalized], selected:[left,right] }, `${normalized[left]} ${valid ? '=' : '≠'} ${normalized[right]}`);
      if (!valid) break;
      left++; right--;
    }
    push(valid ? '双指针在中心相遇' : '发现不相等字符', [`${left},${right}`, pairs, valid ? '是' : '否'], { values:[...normalized], selected:left <= right ? [left,right] : [] }, 'PALINDROME CHECK COMPLETE');
  }

  function buildAnagram() {
    const first = [...$('input-a').value.toLowerCase()].filter((char) => /[\p{L}\p{N}]/u.test(char));
    const second = [...$('input-b').value.toLowerCase()].filter((char) => /[\p{L}\p{N}]/u.test(char));
    must(first.length && second.length, '请输入两个非空字符串');
    const counts = new Map();
    const record = (char, delta, phase) => {
      counts.set(char, (counts.get(char) || 0) + delta);
      if (counts.get(char) === 0) counts.delete(char);
      push(`${phase}字符 ${char}`, [char, counts.size, '检查中'], { lines:[...counts].map(([key,value]) => `${key}: ${value}`) }, delta > 0 ? 'INCREMENT' : 'DECREMENT');
    };
    first.forEach((char) => record(char, 1, '加入'));
    second.forEach((char) => record(char, -1, '抵消'));
    const valid = counts.size === 0;
    push(valid ? '全部字符计数归零' : '仍有非零字符计数', ['DONE', counts.size, valid ? '是' : '否'], { lines:counts.size ? [...counts].map(([key,value]) => `${key}: ${value}`) : ['all counts = 0'] }, 'ANAGRAM CHECK COMPLETE');
  }

  function buildLongestCommonPrefix() {
    const words = tokens($('input-a').value);
    must(words.length >= 2 && words.length <= 20, '请输入 2 到 20 个单词');
    const shortest = Math.min(...words.map((word) => word.length));
    let prefix = '';
    let comparisons = 0;
    for (let index = 0; index < shortest; index++) {
      const char = words[0][index];
      let same = true;
      for (let word = 1; word < words.length; word++) { comparisons++; if (words[word][index] !== char) { same = false; break; } }
      push(`比较第 ${index} 列`, [index, comparisons, same ? prefix + char : prefix], { lines:words.map((word) => `${word}\n${' '.repeat(index)}^`) }, same ? 'ALL CHARACTERS EQUAL' : 'FIRST MISMATCH');
      if (!same) break;
      prefix += char;
    }
    push(`最长公共前缀为 ${prefix || '空串'}`, ['DONE', comparisons, prefix], { lines:words, values:[...prefix] }, 'COMMON PREFIX COMPLETE');
  }

  function buildRecursionCallStack() {
    const n = Math.round(Number($('input-a').value));
    must(n >= 1 && n <= 10, 'n 必须在 1 到 10 之间');
    const stack = [];
    function factorial(value) {
      stack.push(`factorial(${value})`);
      push(`调用 factorial(${value})`, [value, stack.length, '--'], { lines:[...stack] }, value === 1 ? 'BASE CASE' : 'PUSH FRAME');
      if (value === 1) { stack.pop(); return 1; }
      const result = value * factorial(value - 1);
      push(`factorial(${value}) 返回 ${result}`, [value, stack.length, result], { lines:[...stack, `${value} × ${result / value} = ${result}`] }, 'POP FRAME');
      stack.pop();
      return result;
    }
    const result = factorial(n);
    push(`计算 ${n}! 完成`, [0, 0, result], { lines:[`${n}! = ${result}`] }, 'CALL STACK EMPTY');
  }

  function buildFibonacciMemoization() {
    const n = Math.round(Number($('input-a').value));
    must(n >= 2 && n <= 30, 'n 必须在 2 到 30 之间');
    const memo = new Map([[0,0],[1,1]]);
    let hits = 0;
    function fibonacci(value) {
      if (memo.has(value)) { hits++; push(`缓存命中 F(${value})`, [value, hits, memo.get(value)], { values:Array.from({length:n + 1}, (_, i) => memo.has(i) ? memo.get(i) : '·'), selected:[value] }, 'MEMO HIT'); return memo.get(value); }
      push(`展开子问题 F(${value})`, [value, hits, '--'], { values:Array.from({length:n + 1}, (_, i) => memo.has(i) ? memo.get(i) : '·'), selected:[value] }, 'RECURSE F(N-1) + F(N-2)');
      const result = fibonacci(value - 1) + fibonacci(value - 2);
      memo.set(value, result);
      push(`缓存 F(${value}) = ${result}`, [value, hits, result], { values:Array.from({length:n + 1}, (_, i) => memo.has(i) ? memo.get(i) : '·'), selected:[value] }, 'STORE ONCE');
      return result;
    }
    const result = fibonacci(n);
    push(`F(${n}) 计算完成`, [n, hits, result], { values:Array.from({length:n + 1}, (_, i) => memo.get(i)) }, 'LINEAR NUMBER OF SUBPROBLEMS');
  }

  function buildClimbingStairs() {
    const n = Math.round(Number($('input-a').value));
    must(n >= 1 && n <= 40, '台阶数必须在 1 到 40 之间');
    let previous = 1, current = 1;
    push('站在第 0 阶', [0, '1,1', 1], { values:[1] }, 'DP[0] = 1');
    for (let step = 1; step <= n; step++) {
      const next = step === 1 ? 1 : previous + current;
      if (step > 1) previous = current;
      current = next;
      push(`计算第 ${step} 阶`, [step, `${previous},${current}`, current], { values:Array.from({length:step + 1}, (_, i) => i === step ? current : '·'), selected:[step] }, 'DP[I] = DP[I-1] + DP[I-2]');
    }
  }

  function buildGridPathDp() {
    const [rows, cols] = numbers($('input-a').value).map(Math.round);
    must(rows >= 1 && rows <= 12 && cols >= 1 && cols <= 12, '网格尺寸必须在 1 到 12 之间');
    const obstacles = new Set(groups($('input-b').value).map((item) => {
      const [row,col] = numbers(item).map(Math.round);
      must(row >= 0 && row < rows && col >= 0 && col < cols, `障碍坐标无效：${item}`);
      return `${row},${col}`;
    }));
    must(!obstacles.has('0,0') && !obstacles.has(`${rows - 1},${cols - 1}`), '起点和终点不能是障碍');
    const dp = Array.from({length:rows}, () => Array(cols).fill(0));
    let filled = 0;
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const key = `${row},${col}`;
      if (!obstacles.has(key)) dp[row][col] = row === 0 && col === 0 ? 1 : (dp[row - 1]?.[col] || 0) + (dp[row][col - 1] || 0);
      filled++;
      const display = dp.map((line, r) => line.map((value, c) => obstacles.has(`${r},${c}`) ? '×' : value));
      push(`填入状态 (${row},${col})`, [`(${row},${col})`, filled, dp[row][col]], { matrix:display, active:[row,col] }, obstacles.has(key) ? 'OBSTACLE' : 'FROM TOP + LEFT');
    }
    push('终点路径统计完成', [`(${rows - 1},${cols - 1})`, filled, dp.at(-1).at(-1)], { matrix:dp.map((line, r) => line.map((value, c) => obstacles.has(`${r},${c}`) ? '×' : value)), active:[rows - 1,cols - 1] }, 'GRID DP COMPLETE');
  }

  function uniqueItems(max) {
    const items = tokens($('input-a').value);
    must(items.length && items.length <= max && new Set(items).size === items.length, `请输入不超过 ${max} 个互异元素`);
    return items;
  }

  function buildPermutations() {
    const items = uniqueItems(7);
    const used = Array(items.length).fill(false);
    const path = [];
    let count = 0;
    function search() {
      if (path.length === items.length) { count++; push(`输出排列 ${path.join('')}`, [path.at(-1), path.length, count], { lines:[path.join(' ')], values:items, selected:items.map((_,i) => used[i] ? i : -1).filter((i) => i >= 0) }, 'EMIT PERMUTATION'); return; }
      for (let index = 0; index < items.length; index++) if (!used[index]) {
        used[index] = true; path.push(items[index]);
        push(`选择 ${items[index]}`, [items[index], path.length, count], { lines:[path.join(' ')], values:items, selected:items.map((_,i) => used[i] ? i : -1).filter((i) => i >= 0) }, 'CHOOSE');
        search();
        path.pop(); used[index] = false;
      }
    }
    search();
    push('全排列生成完成', ['DONE', 0, count], { lines:[`${items.length}! = ${count}`] }, 'BACKTRACK COMPLETE');
  }

  function buildCombinations() {
    const items = uniqueItems(12);
    const size = Math.round(Number($('input-b').value));
    must(size >= 0 && size <= items.length, 'K 必须位于 0 到元素数量之间');
    const path = [];
    let count = 0;
    function search(start) {
      if (path.length === size) { count++; push(`输出组合 ${path.join('') || '∅'}`, [path.join(''), path.length, count], { lines:[path.join(' ') || '∅'] }, 'EMIT COMBINATION'); return; }
      for (let index = start; index <= items.length - (size - path.length); index++) {
        path.push(items[index]);
        push(`选择 ${items[index]}`, [path.join(''), path.length, count], { values:items, selected:path.map((item) => items.indexOf(item)), lines:[path.join(' ')] }, 'INCREASING INDEX');
        search(index + 1);
        path.pop();
      }
    }
    search(0);
    push('组合生成完成', ['DONE', 0, count], { lines:[`C(${items.length},${size}) = ${count}`] }, 'BACKTRACK COMPLETE');
  }

  function buildSubsets() {
    const items = uniqueItems(12);
    const path = [];
    let count = 0;
    function search(index) {
      if (index === items.length) { count++; push(`输出子集 ${path.join('') || '∅'}`, [path.join('') || '∅', index, count], { lines:[path.join(' ') || '∅'] }, 'LEAF DECISION'); return; }
      push(`不选择 ${items[index]}`, [`skip ${items[index]}`, index + 1, count], { values:items, selected:path.map((item) => items.indexOf(item)) }, 'EXCLUDE BRANCH');
      search(index + 1);
      path.push(items[index]);
      push(`选择 ${items[index]}`, [`take ${items[index]}`, index + 1, count], { values:items, selected:path.map((item) => items.indexOf(item)) }, 'INCLUDE BRANCH');
      search(index + 1);
      path.pop();
    }
    search(0);
    push('幂集枚举完成', ['DONE', 0, count], { lines:[`2^${items.length} = ${count}`] }, 'BACKTRACK COMPLETE');
  }

  function buildParenthesesGeneration() {
    const pairs = Math.round(Number($('input-a').value));
    must(pairs >= 1 && pairs <= 7, '括号对数必须在 1 到 7 之间');
    let count = 0;
    function search(prefix, open, close) {
      if (prefix.length === pairs * 2) { count++; push(`输出 ${prefix}`, [prefix, open - close, count], { lines:[prefix] }, 'VALID SEQUENCE'); return; }
      if (open < pairs) { push(`加入左括号：${prefix}(`, [`${prefix}(`, open + 1 - close, count], { lines:[`${prefix}(`] }, 'OPEN < N'); search(`${prefix}(`, open + 1, close); }
      if (close < open) { push(`加入右括号：${prefix})`, [`${prefix})`, open - close - 1, count], { lines:[`${prefix})`] }, 'CLOSE < OPEN'); search(`${prefix})`, open, close + 1); }
    }
    search('', 0, 0);
    push('合法括号生成完成', ['DONE', 0, count], { lines:[`Catalan(${pairs}) = ${count}`] }, 'PRUNED BACKTRACK COMPLETE');
  }

  function buildParenthesesMatching() {
    const text = $('input-a').value;
    const opening = new Set(['(','[','{']);
    const partner = { ')':'(', ']':'[', '}':'{' };
    const stack = [];
    let valid = true;
    for (let index = 0; index < text.length; index++) {
      const char = text[index];
      if (opening.has(char)) stack.push(char);
      else if (partner[char]) { if (stack.at(-1) === partner[char]) stack.pop(); else valid = false; }
      else continue;
      push(`读取字符 ${char}`, [char, stack.length, valid ? '检查中' : '非法'], { values:[...text], selected:[index], lines:[`stack: ${stack.join(' ') || '∅'}`] }, opening.has(char) ? 'PUSH OPENING' : valid ? 'POP MATCHED OPENING' : 'MISMATCH');
      if (!valid) break;
    }
    valid = valid && stack.length === 0;
    push(valid ? '所有括号正确配对' : '括号未正确闭合', ['DONE', stack.length, valid ? '合法' : '非法'], { lines:[`stack: ${stack.join(' ') || '∅'}`] }, 'DELIMITER CHECK COMPLETE');
  }

  const builders = {
    'static-array':buildStaticArray,
    'matrix-2d-array':buildMatrix2d,
    'doubly-linked-list':buildDoublyLinkedList,
    'circular-linked-list':buildCircularLinkedList,
    'binary-tree-basics':buildBinaryTreeBasics,
    'n-ary-tree':buildNaryTree,
    'set-map-adt':buildSetMap,
    'open-addressing-hash-table':buildOpenAddressing,
    'graph-representations':buildGraphRepresentations,
    'string-builder':buildStringBuilder,
    'array-operations':buildArrayOperations,
    'binary-search-boundaries':buildBinaryBoundaries,
    'merge-intervals':buildMergeIntervals,
    'frequency-counting':buildFrequencyCounting,
    'matrix-traversal':buildMatrixTraversal,
    'preorder-traversal':buildPreorder,
    'inorder-traversal':buildInorder,
    'postorder-traversal':buildPostorder,
    'level-order-traversal':buildLevelOrder,
    'tree-properties':buildTreeProperties,
    'connected-components':buildConnectedComponents,
    'undirected-cycle-detection':buildUndirectedCycle,
    'directed-cycle-detection':buildDirectedCycle,
    'bipartite-check':buildBipartite,
    'flood-fill':buildFloodFill,
    'grid-search':buildGridSearch,
    'naive-string-search':buildNaiveStringSearch,
    'palindrome-check':buildPalindrome,
    'anagram-check':buildAnagram,
    'longest-common-prefix':buildLongestCommonPrefix,
    'recursion-call-stack':buildRecursionCallStack,
    'fibonacci-memoization':buildFibonacciMemoization,
    'climbing-stairs':buildClimbingStairs,
    'grid-path-dp':buildGridPathDp,
    'permutation-generation':buildPermutations,
    'combination-generation':buildCombinations,
    'subset-enumeration':buildSubsets,
    'parentheses-generation':buildParenthesesGeneration,
    'parentheses-matching':buildParenthesesMatching
  };

  function setUpPage() {
    document.body.className = cfg.theme || '';
    $('title').textContent = cfg.title;
    $('monogram').textContent = cfg.mono;
    $('eyebrow').textContent = cfg.eye;
    $('primary-label').textContent = cfg.aLabel;
    $('input-a').value = cfg.a;
    $('secondary-label').textContent = cfg.bLabel || '';
    $('input-b').value = cfg.b || '';
    $('secondary-wrap').hidden = !cfg.bLabel;
    $('option-wrap').hidden = true;
    cfg.metrics.forEach((label, index) => $(`metric-label-${index + 1}`).textContent = label);
    $('principle').textContent = cfg.principle;
    $('complexity').textContent = cfg.complexity;
    document.title = `${cfg.title} · Algorithm Lab`;
    canvas.setAttribute('aria-label', `${cfg.title} 执行状态`);
  }

  function refreshPalette() {
    const style = getComputedStyle(document.body);
    palette = {
      bg:style.getPropertyValue('--bg').trim(), panel:style.getPropertyValue('--panel').trim(),
      panel2:style.getPropertyValue('--panel-2').trim(), text:style.getPropertyValue('--text').trim(),
      muted:style.getPropertyValue('--muted').trim(), line:style.getPropertyValue('--line').trim(),
      accent:style.getPropertyValue('--accent').trim(), accent2:style.getPropertyValue('--accent-2').trim(),
      good:style.getPropertyValue('--good').trim(), danger:style.getPropertyValue('--danger').trim()
    };
  }

  function rounded(x, y, w, h, fill, stroke = palette.line, radius = 5) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.stroke();
  }

  function label(text, x, y, color = palette.text, align = 'left', font = '12px ui-monospace,Consolas,monospace') {
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.font = font; ctx.fillText(String(text), x, y);
  }

  function edgeKey(edge) { return `${edge[0]}|${edge[1]}`; }

  function renderGraph(view, top, pad, usable) {
    const graph = view.graph;
    const areaHeight = Math.max(250, height - top - 80);
    const positions = {};
    if (graph.levels) {
      const levels = [...new Set(Object.values(graph.levels))].sort((a,b) => a - b);
      for (const level of levels) {
        const nodes = graph.nodes.filter((node) => graph.levels[node] === level);
        nodes.forEach((node, index) => { positions[node] = { x:pad + usable * (index + 1) / (nodes.length + 1), y:top + 30 + level * Math.min(92, (areaHeight - 60) / Math.max(1, levels.length - 1)) }; });
      }
    } else {
      const radius = Math.min(usable * 0.34, areaHeight * 0.38);
      graph.nodes.forEach((node, index) => { const angle = -Math.PI / 2 + index * Math.PI * 2 / graph.nodes.length; positions[node] = { x:pad + usable / 2 + Math.cos(angle) * radius, y:top + areaHeight / 2 + Math.sin(angle) * radius }; });
    }
    const activeEdges = new Set((view.activeEdges || []).flatMap((edge) => [edgeKey(edge), edgeKey([edge[1],edge[0]])]));
    for (const edge of graph.edges) {
      const from = positions[edge[0]], to = positions[edge[1]];
      if (!from || !to) continue;
      const active = activeEdges.has(edgeKey(edge));
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.strokeStyle = active ? palette.accent2 : palette.line; ctx.lineWidth = active ? 3 : 1.5; ctx.stroke();
      if (graph.directed) {
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const x = to.x - Math.cos(angle) * 24, y = to.y - Math.sin(angle) * 24;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(angle - 0.55) * 8, y - Math.sin(angle - 0.55) * 8); ctx.lineTo(x - Math.cos(angle + 0.55) * 8, y - Math.sin(angle + 0.55) * 8); ctx.closePath(); ctx.fillStyle = active ? palette.accent2 : palette.muted; ctx.fill();
      }
    }
    const active = new Set(view.activeNodes || []);
    const done = new Set(view.doneNodes || []);
    for (const node of graph.nodes) {
      const point = positions[node];
      const category = view.nodeColors?.[node];
      let categoryFill;
      if (view.colorMode === 'components' && category !== undefined) categoryFill = [palette.accent, palette.good, palette.accent2][(Number(category) - 1) % 3];
      else if (view.colorMode === 'partition' && category !== undefined) categoryFill = category ? palette.accent : palette.good;
      else if (view.colorMode === 'state' && category !== undefined) categoryFill = category === 0 ? palette.panel2 : category === 1 ? palette.accent2 : palette.muted;
      const fill = active.has(node) ? palette.accent2 : categoryFill || (done.has(node) ? palette.accent : palette.panel2);
      ctx.beginPath(); ctx.arc(point.x, point.y, 21, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = active.has(node) ? palette.text : palette.line; ctx.lineWidth = active.has(node) ? 2 : 1; ctx.stroke();
      label(graph.labels?.[node] ?? node, point.x, point.y, active.has(node) || done.has(node) || category !== undefined ? palette.bg : palette.text, 'center');
    }
  }

  function render() {
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, width, height);
    const state = steps[stepIndex];
    if (!state) return;
    const view = state.view || {};
    const top = 120;
    const pad = Math.max(24, width * 0.05);
    const usable = width - pad * 2;
    if (view.graph) renderGraph(view, top, pad, usable);
    if (view.matrix) {
      const matrix = view.matrix;
      const rows = matrix.length;
      const cols = Math.max(...matrix.map((row) => row.length));
      const cell = Math.min(58, usable / Math.max(1, cols), Math.max(28, (height - top - 90) / Math.max(1, rows)));
      const x = pad + Math.max(0, (usable - cols * cell) / 2);
      const y = top + 12;
      const visited = new Set(view.visited || []);
      const path = new Set(view.path || []);
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
        const active = view.active?.[0] === row && view.active?.[1] === col;
        const key = `${row},${col}`;
        const fill = active ? palette.accent2 : path.has(key) ? palette.good : visited.has(key) ? palette.accent : palette.panel2;
        rounded(x + col * cell, y + row * cell, cell - 4, cell - 4, fill);
        label(matrix[row]?.[col] ?? '', x + col * cell + (cell - 4) / 2, y + row * cell + (cell - 4) / 2, active || visited.has(key) || path.has(key) ? palette.bg : palette.text, 'center', `${cell < 38 ? 10 : 12}px ui-monospace,Consolas,monospace`);
      }
    }
    if (view.values) {
      const values = view.values.slice(0, 48);
      const cols = Math.max(1, Math.min(values.length, Math.floor(usable / 52)));
      const cell = Math.min(52, usable / cols);
      values.forEach((value, index) => {
        const row = Math.floor(index / cols), col = index % cols;
        const x = pad + col * cell, y = top + row * 52;
        const selected = view.selected?.includes(index);
        const inRange = view.range && index >= view.range[0] && index <= view.range[1];
        rounded(x, y, cell - 5, 42, selected ? palette.accent : inRange ? palette.accent2 : palette.panel2);
        label(value, x + (cell - 5) / 2, y + 21, selected || inRange ? palette.bg : palette.text, 'center');
        if (index < cols) label(index, x + (cell - 5) / 2, y + 48, palette.muted, 'center', '9px ui-monospace,Consolas,monospace');
      });
      if (view.circular && values.length > 1) label('尾节点 next → 头节点', pad, top + Math.ceil(values.length / cols) * 52 + 18, palette.accent);
      if (view.links === 'double') label('HEAD ⇄ prev / next ⇄ TAIL', pad, top + Math.ceil(values.length / cols) * 52 + 18, palette.accent);
    }
    if (view.lines) {
      const lines = view.lines.slice(0, 18);
      const start = view.values ? Math.min(height - 220, top + 180) : top;
      const lineHeight = Math.min(34, Math.max(24, (height - start - 90) / Math.max(1, lines.length)));
      lines.forEach((line, index) => {
        rounded(pad, start + index * lineHeight, usable, lineHeight - 5, index === lines.length - 1 ? palette.panel2 : palette.panel);
        label(String(line).replace(/\n/g, ' · '), pad + 13, start + index * lineHeight + (lineHeight - 5) / 2, index === lines.length - 1 ? palette.accent : palette.text);
      });
    }
    if (!view.graph && !view.values && !view.lines && !view.matrix) label(state.note || cfg.eye, pad, top, palette.accent);
  }

  function updateUi() {
    const state = steps[stepIndex];
    if (!state) return;
    $('status').textContent = state.label;
    state.metrics.forEach((value, index) => $(`metric-${index + 1}`).textContent = value);
    $('note').textContent = `${state.note || cfg.eye} · STEP ${stepIndex + 1} / ${steps.length}`;
    $('play').textContent = running ? '暂停' : stepIndex === steps.length - 1 ? '重播' : '播放';
  }

  function build() {
    steps = [];
    $('error').textContent = '';
    try { builders[slug](); }
    catch (error) { $('error').textContent = error.message; return false; }
    if (!steps.length) { $('error').textContent = '未生成执行步骤'; return false; }
    stepIndex = 0;
    running = false;
    lastTick = 0;
    updateUi();
    return true;
  }

  function stepOnce() {
    if (stepIndex < steps.length - 1) stepIndex++;
    else running = false;
    updateUi();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    refreshPalette();
  }

  function frame(time) {
    if (running && (lastTick === 0 || time - lastTick > 520 / speed)) { stepOnce(); lastTick = time; }
    render();
    requestAnimationFrame(frame);
  }

  $('apply').addEventListener('click', build);
  $('reset').addEventListener('click', () => { $('input-a').value = cfg.a; $('input-b').value = cfg.b || ''; build(); });
  $('step').addEventListener('click', () => { running = false; if (stepIndex === steps.length - 1) build(); stepOnce(); });
  $('play').addEventListener('click', () => { if (stepIndex === steps.length - 1) build(); running = !running; lastTick = 0; updateUi(); });
  $('speed').addEventListener('input', (event) => { speed = Number(event.target.value); $('speed-value').textContent = `${speed.toFixed(1)}x`; });
  addEventListener('resize', resize);

  setUpPage();
  resize();
  build();
  requestAnimationFrame(frame);
})();
