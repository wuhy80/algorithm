const categoryProblem = {
  '查找、排序与算法技巧':'在序列、区间或数据流中减少无效扫描，把重复工作变成可复用的顺序、边界或统计信息。',
  '图算法、网络流与回溯':'在节点与边构成的关系网络中回答可达性、顺序、最短代价、连通结构或资源分配问题。',
  '回溯、博弈与约束求解':'系统枚举决策空间，并利用约束、上下界或对手最优行为尽早排除不可能的分支。',
  '字符串算法':'利用字符序列的前缀、后缀、周期和重复结构，避免在每个位置重新比较相同内容。',
  '动态规划与序列':'把具有重叠子问题的全局目标拆成状态，保存局部答案并按依赖顺序完成转移。',
  '贪心、调度与编码':'在可以证明局部最优选择不会破坏全局最优的前提下，逐步固定决策。',
  '数据结构':'为一组高频操作设计存储布局与维护字段，让查询和更新达到需要的复杂度。',
  '高级查询与树分解':'把复杂路径、区间、时间或版本问题拆成可快速合并的小块，并控制更新影响范围。',
  '空间数据结构':'按照空间位置递归划分对象，减少几何查询时必须检查的候选数量。',
  '计算几何':'把连续空间关系转化为方向、叉积、顺序和局部邻接等可精确判断的离散事件。',
  '数论、变换与线性代数':'利用整数结构、代数恒等式或基变换，把直接计算改写成更小或更容易组合的问题。',
  '压缩算法':'利用符号频率、重复片段或上下文结构，用更短表示保存信息并保证能够恢复或近似恢复。',
  '生成、优化与模拟':'让简单局部规则反复作用于系统状态，观察涌现结果或迭代逼近较优解。'
};

const familyProblem = {
  array:'在连续序列中正确处理下标、边界、局部更新与顺序扫描，并避免不必要的数据搬移。',
  binarySearch:'在有序数据或单调判定上定位目标、边界或第一个满足条件的位置。',
  sorting:'按照比较键建立全序，同时权衡稳定性、额外空间、最坏时间和数据分布。',
  pointer:'通过只向前移动的边界维护候选区间，把重复枚举压缩为一次扫描。',
  randomized:'用可证明的概率规则进行采样、打乱或候选选择，并控制期望复杂度与分布偏差。',
  linked:'通过节点引用组织非连续数据，使已知位置的插入、删除和重连只影响局部节点。',
  stackQueue:'用受限的进入和离开顺序管理尚未完成的任务、边界或依赖关系。',
  hash:'把键映射到有限桶或位状态，在允许冲突处理的前提下实现快速成员与键值查询。',
  tree:'表达层级关系，并让一个节点的问题能够由若干子树的结果递归合并。',
  balancedTree:'动态维护有序集合，并通过局部修复把树高或访问路径稳定在对数级。',
  rangeQuery:'在同一批数据上高效回答多次区间查询或更新，避免每个操作重新扫描完整范围。',
  graphTraversal:'系统访问图中的节点与边，回答可达性、层次、遍历顺序或基础结构判定。',
  shortestPath:'在带权或具有特殊边权的图中，求起点到目标的最小路径代价并恢复路径。',
  spanningTree:'用最小总边权连接无向图的全部节点，同时保证选边集合始终无环。',
  connectivity:'识别图中的连通块、关键边、关键点、环或可以相互到达的强连通结构。',
  flow:'在容量和守恒约束下分配网络资源，并求最大流、最小费用、割或可行环流。',
  matching:'选择互不共享端点的边完成配对或指派，并通过增广重新安排局部选择。',
  backtracking:'枚举决策树中的可行方案，在前缀已经不可能成功时立即剪枝并撤销状态。',
  constraint:'维护变量取值域并传播约束，在冲突时回溯，以寻找或证明不存在满足全部条件的赋值。',
  dynamicProgramming:'把重叠子问题压缩为有限状态，按依赖关系复用局部答案得到计数、可行性或最优值。',
  dpOptimization:'在状态定义不变的前提下利用决策单调性或代数结构减少转移候选。',
  stringMatch:'在文本中定位模式、前缀或重复关系，并复用已经比较成功的字符信息。',
  stringIndex:'为文本建立后缀或自动机索引，使大量子串、重复和词典序查询能够共享结构。',
  palindrome:'利用中心对称和已知回文边界判断、计数或维护回文子串。',
  greedy:'在有安全选择证明的前提下永久固定局部决策，避免枚举全部组合。',
  numberTheory:'利用整除、素因子、同余与指数结构求解大整数上的精确关系。',
  transform:'通过变换、消元或快速幂复用子结构，加速卷积、线性递推和方程求解。',
  compression:'发现频率偏斜或重复结构，生成可唯一解码且通常更短的数据表示。',
  geometry:'用精确的方向和顺序判断点、线与多边形之间的包含、相交、距离和边界关系。',
  spatial:'按空间边界组织对象，在查询时一次排除整片不可能相关的区域。',
  simulation:'按照局部规则同步更新大量单元或个体，研究系统随参数和时间的演化。'
};

const complexityBySlug = {
  'insertion-sort':'时间最好 O(n)，平均 / 最坏 O(n²)；原地实现额外空间 O(1)。',
  'heap-sort':'建堆 O(n)，排序 O(n log n)；额外空间 O(1)。',
  'binary-search':'时间 O(log n)；迭代实现额外空间 O(1)。',
  'merge-sort':'时间 O(n log n)；数组实现通常需要 O(n) 辅助空间。',
  'sliding-window':'每个元素至多进出窗口一次，典型时间 O(n)；空间取决于窗口状态。',
  'radix-sort':'时间 O(d(n+k))，d 为位数、k 为每一位的取值范围；空间 O(n+k)。',
  'counting-sort':'时间与空间均为 O(n+k)，k 为值域大小。',
  'quick-sort':'平均 O(n log n)，最坏 O(n²)；递归栈平均 O(log n)。',
  'quickselect':'平均 O(n)，最坏 O(n²)；原地分区额外空间 O(1)。',
  'bubble-sort':'平均 / 最坏 O(n²)，已有序时可提前结束到 O(n)；空间 O(1)。',
  'two-pointers':'指针单调移动时通常 O(n)，额外空间 O(1)。',
  'bucket-sort':'分布均匀时平均 O(n+k)，最坏 O(n²)；空间 O(n+k)。',
  'shell-sort':'复杂度取决于增量序列，常见最坏上界 O(n²)；空间 O(1)。',
  'linear-search':'最好 O(1)，平均 / 最坏 O(n)；空间 O(1)。',
  'selection-sort':'时间始终 O(n²)，交换次数 O(n)；空间 O(1)。',
  'bipartite-matching':'增广路基础实现 O(VE)，空间 O(V+E)。',
  'bridges-articulation':'一次 Tarjan DFS，时间 O(V+E)，空间 O(V)。',
  'bfs':'邻接表实现时间 O(V+E)，空间 O(V)。',
  'eulerian-path':'Hierholzer 算法时间 O(V+E)，空间 O(V+E)。',
  'dfs':'邻接表实现时间 O(V+E)，递归或显式栈空间 O(V)。',
  'topological-sort':'时间 O(V+E)，空间 O(V)。',
  'hungarian-algorithm':'经典方阵实现时间 O(n³)，空间 O(n²)。',
  'lowest-common-ancestor':'二进制提升预处理 O(n log n)，单次查询 O(log n)，空间 O(n log n)。',
  'min-cost-max-flow':'使用势能与最短路时典型 O(FE log V)，F 为增广次数或总流量尺度。',
  'astar-pathfinding':'取决于启发函数；使用堆时每次扩展涉及 O(log V)，最坏仍可能检查整个状态空间。',
  'bellman-ford':'时间 O(VE)，空间 O(V)。',
  'dijkstra':'邻接表和二叉堆实现 O((V+E) log V)，空间 O(V+E)。',
  'dinic':'一般图上界 O(V²E)，单位容量网络通常更快；空间 O(V+E)。',
  'edmonds-karp':'时间 O(VE²)，空间 O(V+E)。',
  'floyd-warshall':'时间 O(V³)，空间 O(V²)。',
  'hopcroft-karp':'时间 O(E√V)，空间 O(V+E)。',
  'johnson-algorithm':'稀疏图典型 O(VE log V)，空间 O(V+E)。',
  'kruskal-mst':'排序边 O(E log E)，并查集合并近似 O(Eα(V))。',
  'prim-mst':'邻接表与堆实现 O(E log V)，空间 O(V+E)。',
  'tarjan-scc':'一次 DFS，时间 O(V+E)，空间 O(V)。',
  'tower-of-hanoi':'移动次数 2ⁿ-1，时间 O(2ⁿ)，递归栈 O(n)。',
  'knights-tour':'最坏为指数级搜索，启发式排序可显著减少实际分支；栈深度 O(n²)。',
  'sudoku-backtracking':'最坏指数级，若有 m 个空格可粗略记为 O(9^m)；栈深度 O(m)。',
  'graph-coloring':'k 种颜色时最坏 O(k^V)，空间 O(V)。',
  'dancing-links':'最坏指数级；单次覆盖 / 恢复与被移除节点数成正比。',
  'n-queens':'最坏接近 O(n!)，位集合实现空间 O(n)。',
  'suffix-array-lcp':'倍增构造通常 O(n log n)，Kasai 求 LCP 为 O(n)，空间 O(n)。',
  'regex-matching':'二维 DP 时间 O(nm)，空间 O(nm)，可滚动优化。',
  'aho-corasick':'构建 O(模式总长×字母转移代价)，匹配 O(文本长+匹配数)。',
  'boyer-moore':'平均常出现次线性扫描，经典最坏上界 O(nm)；预处理 O(m+字符集)。',
  'kmp-search':'前缀表 O(m)，匹配 O(n)，总时间 O(n+m)，空间 O(m)。',
  'manacher':'时间 O(n)，空间 O(n)。',
  'rabin-karp':'平均 O(n+m)，哈希碰撞频繁时最坏 O(nm)；空间 O(1) 或 O(m)。',
  'z-algorithm':'时间 O(n)，空间 O(n)。',
  'knapsack-dp':'容量为 W 时典型时间 O(nW)，一维优化空间 O(W)。',
  'edit-distance':'时间 O(nm)，空间 O(nm)，只求距离可优化到 O(min(n,m))。',
  'weighted-interval-scheduling':'排序 O(n log n)，DP 与前驱查询 O(n log n)，空间 O(n)。',
  'matrix-chain-multiplication':'区间 DP 时间 O(n³)，空间 O(n²)。',
  'coin-change':'金额为 A、硬币数为 n 时典型 O(nA)，空间 O(A)。',
  'traveling-salesman-bitmask':'时间 O(n²2ⁿ)，空间 O(n2ⁿ)。',
  'tree-dp':'通常每个节点和每条边处理常数次，时间 O(n)，空间 O(n)。',
  'digit-dp':'约 O(位数×状态数×数位取值)，记忆化空间与状态数同阶。',
  'subset-sum':'目标和为 S 时伪多项式时间 O(nS)，空间可优化到 O(S)。',
  'longest-increasing-subsequence':'耐心排序方法 O(n log n)，保存前驱恢复序列需 O(n)。',
  'longest-common-subsequence':'时间 O(nm)，空间 O(nm)，只求长度可滚动优化。',
  'kadane':'时间 O(n)，额外空间 O(1)。',
  'union-find':'按秩合并与路径压缩后，单次操作摊还 O(α(n))，空间 O(n)。',
  'monotonic-stack-queue':'每个元素至多入栈 / 队和出栈 / 队一次，总时间 O(n)，空间 O(n)。',
  'heap-priority-queue':'取最值 O(1)，插入 / 删除最值 O(log n)，建堆 O(n)。',
  'queue':'入队 / 出队 / 查看队首 O(1)，空间 O(n)。',
  'binary-search-tree':'平均操作 O(log n)，退化时 O(n)，空间 O(n)。',
  'hash-table':'平均插入 / 删除 / 查询 O(1)，最坏 O(n)，空间 O(n)。',
  'red-black-tree':'查询、插入、删除均 O(log n)，空间 O(n)。',
  'persistent-segment-tree':'每次更新 / 查询 O(log n)，每个版本新增 O(log n) 节点。',
  'lazy-segment-tree':'区间更新 / 查询 O(log n)，建树 O(n)，空间 O(n)。',
  'linked-list':'已知节点的局部插入 / 删除 O(1)，查找 O(n)，空间 O(n)。',
  'splay-tree':'单次最坏 O(n)，连续操作摊还 O(log n)，空间 O(n)。',
  'fenwick-tree':'单点更新与前缀查询 O(log n)，建表 O(n) 或 O(n log n)，空间 O(n)。',
  'deque':'两端插入 / 删除 O(1)，空间 O(n)。',
  'skip-list':'期望查询 / 插入 / 删除 O(log n)，最坏 O(n)，空间 O(n)。',
  'sparse-table':'预处理 O(n log n)，幂等区间查询 O(1)，空间 O(n log n)。',
  'segment-tree':'建树 O(n)，单点更新与区间查询 O(log n)，空间 O(n)。',
  'stack':'压栈 / 弹栈 / 查看栈顶 O(1)，空间 O(n)。',
  'avl-tree':'查询、插入、删除 O(log n)，旋转 O(1)，空间 O(n)。',
  'b-tree':'查询、插入、删除 O(log_B n) 次节点访问，空间 O(n)。',
  'b-plus-tree':'查询、插入、删除 O(log_B n)，范围扫描 O(log_B n+k)。',
  'bloom-filter':'插入和查询 O(k)，k 为哈希函数数；空间 O(m)，存在假阳性。',
  'lru-cache':'哈希表加双向链表后，get / put 平均 O(1)，空间 O(capacity)。',
  'treap':'期望查询、插入、删除 O(log n)，最坏 O(n)，空间 O(n)。',
  'trie':'插入 / 查询 O(L)，L 为键长；空间与全部前缀节点数同阶。',
  'quadtree':'平衡分布下查询近似 O(log n+k)，最坏 O(n)，空间 O(n)。',
  'kd-tree':'平均查询 O(log n+k)，高维或退化时 O(n)，空间 O(n)。',
  'r-tree':'平均查询与树高及候选重叠有关，最坏 O(n)，空间 O(n)。',
  'point-in-polygon':'射线法对 n 条边时间 O(n)，额外空间 O(1)。',
  'sweep-line-intersection':'典型 O((n+k) log n)，k 为交点数，空间 O(n+k)。',
  'convex-hull':'排序加单调链时间 O(n log n)，空间 O(n)。',
  'rotating-calipers':'凸包已知后通常 O(h)，h 为凸包点数。',
  'closest-pair':'分治算法时间 O(n log n)，空间 O(n)。',
  'delaunay-triangulation':'常见实现期望 O(n log n)，输出规模 O(n)。',
  'voronoi-relaxation':'每轮由 Voronoi 构造和质心计算主导，常见约 O(n log n)，总成本乘迭代轮数。',
  'sieve-of-eratosthenes':'时间 O(n log log n)，空间 O(n)。',
  'fourier-epicycles':'直接离散傅里叶变换 O(n²)，使用 FFT 可降为 O(n log n)。',
  'fft':'时间 O(n log n)，空间 O(n)。',
  'modular-exponentiation':'时间 O(log exponent)，额外空间 O(1)。',
  'euclidean-algorithm':'时间 O(log min(a,b))，空间 O(1)。',
  'euler-totient':'单个数试除计算 O(√n)，筛法批量计算 O(n log log n) 量级。',
  'chinese-remainder-theorem':'合并 k 个同余式通常 O(k log M)，取决于大整数运算。',
  'miller-rabin':'每个底数 O(log³ n) 位运算量级，固定底数可确定判断 64 位整数。',
  'arithmetic-coding':'编码 / 解码与符号数近似线性，模型维护成本取决于频率结构。',
  'huffman-coding':'建树 O(k log k)，编码 / 解码 O(n)，空间 O(k)。',
  'lz77':'朴素窗口匹配最坏 O(nW)，工程实现借助索引可显著加速；输出与匹配数成正比。',
  'lzw':'使用哈希字典时编码 / 解码期望 O(n)，空间与字典大小同阶。',
  'wave-function-collapse':'成本取决于网格、候选模式数与传播次数，最坏会因回溯呈指数增长。',
  'reaction-diffusion':'每轮更新 O(网格单元数)，空间 O(网格单元数)。',
  'game-of-life':'每一代 O(rows×cols)，双缓冲空间 O(rows×cols)。',
  'particle-swarm':'每轮 O(粒子数×维度)，空间 O(粒子数×维度)。',
  'maze-generation':'常见生成算法时间 O(网格单元数)，空间 O(网格单元数)。',
  'genetic-rockets':'每代 O(种群规模×基因长度)，总成本再乘迭代代数。',
  'ant-colony':'每轮约 O(蚂蚁数×构造路径成本)，总成本乘迭代轮数。',
  'boids':'朴素邻居检查 O(n²)，使用空间哈希或网格可接近 O(n)。',
  'n-body':'直接两两计算 O(n²)，Barnes-Hut 可近似到 O(n log n)。',
  'flow-field':'场构建通常 O(网格单元数)，每个个体沿场查询 O(1)。'
};

const profiles = {
  array: {
    title:'连续序列与下标模型',
    mental:'把数据想成一排有编号的格子。真正重要的不是“循环写法”，而是每次操作会读取哪些格子、修改哪些格子，以及下标是否仍处在合法范围内。',
    baseline:'最直接的办法通常是从头扫描或复制整个序列。优化来自单调移动下标、保存前缀信息，或只维护受影响的局部区间。',
    invariant:'已经越过的下标都已得到最终处理；尚未处理的后缀不会被错误地当作答案。任何读写都满足 0 ≤ index < length。',
    steps:['明确数组长度、下标含义和输入是否有序','根据当前下标读取或更新状态','只移动必要的边界，不重复处理已完成区域','在边界相遇或扫描结束时输出结果'],
    pseudo:'state = initialize(array)\nfor index in valid_indices(array):\n    observe(array[index])\n    update(state, index)\nreturn summarize(state)',
    pitfalls:['把长度 n 误当作最后一个合法下标','原地修改后继续使用已经失效的位置','没有区分值域、下标范围和答案范围'],
    use:'输入天然是线性序列，操作依赖相邻项、前后缀或连续区间。', avoid:'需要频繁在中间插入删除，或键查询比顺序访问更重要。'
  },
  binarySearch: {
    title:'有序性与答案边界', mental:'二分不是“猜中点”，而是维护一个一定包含答案的区间，并用单调条件排除一半。区间定义比模板本身更重要。',
    baseline:'线性扫描可以找到答案，但没有利用“条件一旦成立，之后持续成立”的单调性。二分把 O(n) 次检查压缩为 O(log n)。',
    invariant:'每轮开始时答案仍在候选区间内；被排除的部分已经由单调条件证明不可能。区间采用闭区间还是半开区间必须始终一致。',
    steps:['确认数据或判定函数具有单调性','选定 [left,right] 或 [left,right) 的统一语义','检查 mid 并保留仍可能包含答案的一半','循环结束后按区间语义解释边界位置'],
    pseudo:'left = 0; right = n\nwhile left < right:\n    mid = left + (right-left)//2\n    if feasible(mid): right = mid\n    else: left = mid + 1\nreturn left',
    pitfalls:['循环条件和边界更新来自不同模板，造成死循环','找到相等值就返回，因而无法处理第一个 / 最后一个位置','判定函数并不单调却强行二分'],
    use:'输入有序，或答案可以转化为“是否可行”的单调判定。', avoid:'数据频繁变化且维持有序的成本高，或目标条件没有单调性。'
  },
  sorting: {
    title:'比较、分区与有序区间', mental:'排序算法的差别不在最终结果，而在“每一步能确认哪一部分已经有序”。盯住有序区、未处理区和临时区即可读懂动画。',
    baseline:'暴力做法会反复比较同一对元素。更好的算法通过分治、堆结构、自然有序段或更好的增量减少无效比较。',
    invariant:'每轮结束后，算法声称的有序区域必须真的有序；跨区域元素的相对关系必须满足下一轮能够继续合并或扩展。',
    steps:['确定本算法维护的有序区或分区边界','执行比较并按规则交换、移动或合并','扩大已经有序或已经归位的范围','直到所有元素都进入最终顺序'],
    pseudo:'prepare(array)\nwhile exists_unsorted_region:\n    choose_key_or_partition()\n    rearrange_current_region()\n    certify_more_elements_sorted()\nreturn array',
    pitfalls:['只验证结果有序，没有检查稳定性和原地性要求','比较器不满足传递性','忽略重复元素导致分区不收缩'],
    use:'需要获得全序、排名、去重前置顺序或后续二分能力。', avoid:'只需要第 k 小、局部 Top-K 或值域很小，此时完整比较排序可能多做工作。'
  },
  pointer: {
    title:'单调指针与一次扫描', mental:'让两个边界各自只朝一个方向移动。只要能证明被越过的元素以后不必再看，总工作量就从双重循环降为线性。',
    baseline:'枚举所有区间或元素对通常需要 O(n²)。单调移动指针利用顺序关系，一次排除一批不可能组合。',
    invariant:'窗口或两个指针之间的区域始终满足当前定义；左指针越过的起点已经得到完整结论。',
    steps:['定义左右指针和它们围成区域的含义','扩展一个边界直到条件变化','收缩另一个边界恢复不变量','在每次有效状态下更新答案'],
    pseudo:'left = 0\nfor right in range(n):\n    add(array[right])\n    while window_is_invalid():\n        remove(array[left]); left += 1\n    update_answer(left, right)',
    pitfalls:['窗口状态在左边界移动时没有同步删除','指针可能回退，复杂度就不再是 O(n)','没有说明何时更新答案，漏掉边界情况'],
    use:'连续区间条件可增量维护，或有序数组中的成对关系具有单调性。', avoid:'条件依赖区间内部复杂重排，移除一个元素无法快速恢复状态。'
  },
  randomized: {
    title:'随机选择与概率保证', mental:'随机算法不要求每次路径相同，而要求每个候选拥有正确概率，并能证明最终分布或期望复杂度。',
    baseline:'先保存全部数据再随机选择很直接，却可能浪费内存；固定枢轴或固定顺序也容易遇到构造出的最坏输入。',
    invariant:'处理前 i 个候选后，当前样本对这 i 个候选满足目标概率；随机数范围和交换位置必须没有偏差。',
    steps:['定义随机变量和希望得到的分布','逐个处理候选并计算替换或交换概率','使用无偏随机整数更新状态','用计数实验检查分布而不是检查单次结果'],
    pseudo:'state = initial_random_state()\nfor i, item in stream:\n    j = uniform_integer(valid_range(i))\n    if should_replace(j): update(state, item, j)\nreturn state',
    pitfalls:['使用取模把随机数映射到范围而引入偏差','把一次运行结果当作正确性证据','没有固定种子，导致测试不可复现'],
    use:'输入顺序不可控、需要抽样 / 打乱，或希望用随机化避免系统性最坏输入。', avoid:'业务要求完全确定输出，且不能接受概率误差或不可复现路径。'
  },
  linked: {
    title:'节点引用与局部重连', mental:'链式结构不搬动元素，而是改变节点之间的引用。画出修改前后的前驱、当前节点、后继，比背代码更可靠。',
    baseline:'数组中间编辑需要移动后缀。链表用额外指针换取局部编辑能力，但失去了按下标直接访问。',
    invariant:'从头节点沿 next 必须恰好访问每个有效节点；双向结构还要求 node.next.prev === node，循环结构必须最终回到头节点。',
    steps:['找到需要修改位置的前驱或目标节点','先保存即将断开的引用','按安全顺序连接新节点或跳过旧节点','更新头尾引用并检查链路完整性'],
    pseudo:'previous = locate_predecessor(position)\nnext = previous.next\nprevious.next = new_node\nnew_node.next = next\nrepair_head_tail_or_prev_links()',
    pitfalls:['覆盖 next 以后才尝试寻找后继，造成链路丢失','删除头尾时忘记更新外部引用','循环链表遍历没有停止条件'],
    use:'频繁局部插入删除，且操作位置可通过节点引用获得。', avoid:'高频按下标随机访问，或内存局部性对性能至关重要。'
  },
  stackQueue: {
    title:'受限访问顺序', mental:'栈和队列的力量来自“限制”：栈只暴露最近元素，队列只暴露最早元素。先问元素何时进入、何时有资格离开。',
    baseline:'每次从普通数组中寻找“下一项”容易重复扫描。受限容器把待处理顺序显式编码进数据结构。',
    invariant:'容器中的元素正好是已经发现但尚未完成的任务；弹出顺序严格遵守 LIFO、FIFO 或单调规则。',
    steps:['遇到新任务时按规则压栈或入队','查看栈顶 / 队首决定下一步','完成条件满足后弹出或出队','容器为空时确认所有待处理状态已结束'],
    pseudo:'container = empty\npush_initial_state(container)\nwhile container not empty:\n    current = take_next(container)\n    for next in expand(current):\n        if eligible(next): add(container, next)',
    pitfalls:['把入队时标记访问写成出队时标记，产生大量重复状态','弹栈前没有检查空栈','单调结构没有处理相等元素策略'],
    use:'任务有明确的最近优先、最早优先或单调淘汰顺序。', avoid:'需要任意位置访问，或下一项由复杂优先级决定，此时应使用其他结构。'
  },
  hash: {
    title:'键、哈希值与冲突', mental:'哈希表先把键映射到桶，再在桶内确认真正的键。O(1) 是平均承诺，不是“不比较”。',
    baseline:'线性表按键查找需要 O(n)。哈希通过可重复计算的桶位置缩小候选集合。',
    invariant:'相等的键必须得到相同哈希位置；冲突解决过程不能让仍存在的键变得不可达；扩容后所有键都按新容量重新散列。',
    steps:['规范化键并计算哈希值','映射到桶或初始槽位','按链式或开放寻址规则解决冲突','在负载过高时扩容并重新散列'],
    pseudo:'index = hash(key) mod capacity\nwhile slot[index] is occupied by another key:\n    index = probe_next(index)\ninsert_or_update(slot[index], key, value)',
    pitfalls:['直接把哈希值当唯一键，忽略碰撞','开放寻址删除后直接置空，截断后续探测链','扩容时只复制数组而没有重新散列'],
    use:'高频按键查询、去重、计数或缓存，且不需要维持键的排序。', avoid:'必须支持有序遍历、范围查询，或键的哈希质量无法保证。'
  },
  tree: {
    title:'递归子树与层级关系', mental:'树的关键是每个节点都把同类问题交给若干子树。先明确函数对“一棵以 node 为根的树”返回什么。',
    baseline:'把层级数据摊平成数组会丢失父子关系，很多查询需要反复扫描。树把递归结构直接编码在连接关系里。',
    invariant:'递归处理 node 时，其参数完整描述当前子树；返回时该子树的答案已经完成，且不会依赖尚未处理的兄弟子树。',
    steps:['定义节点、孩子和递归函数的返回值','处理空节点或叶子节点基例','递归取得各子树结果','在当前节点合并并返回'],
    pseudo:'solve(node):\n    if node is null: return base\n    child_results = [solve(child) for child in node.children]\n    answer = combine(node, child_results)\n    return answer',
    pitfalls:['递归函数的定义在不同层发生变化','只处理左右孩子却忽略空节点','树输入其实含环，递归无法终止'],
    use:'数据天然是层级结构，答案可由子树结果合并。', avoid:'关系是一般图且存在多父节点或环，除非额外维护 visited。'
  },
  balancedTree: {
    title:'局部维护与全局高度', mental:'平衡树并不是每次把整棵树整理完美，而是在更新路径上修复少量局部结构，同时维持一个足以约束高度的不变量。',
    baseline:'普通搜索树可能因有序输入退化成链表。平衡信息、随机优先级或节点分裂让树高保持对数级。',
    invariant:'搜索键序不变；旋转、分裂或合并前后的中序序列相同；每个节点的高度、颜色、大小等增强字段与孩子一致。',
    steps:['按搜索顺序定位更新位置','沿路径回溯并重算增强字段','检测违反的平衡条件','执行旋转、分裂、合并或重着色恢复不变量'],
    pseudo:'root = bst_update(root, key)\nfor node on path_to_root:\n    pull(node)\n    if balance_is_broken(node):\n        node = repair_with_local_transform(node)\nreturn root',
    pitfalls:['旋转后忘记更新父指针或增强字段','只修复当前节点，没有继续向上回溯','把不同平衡树的规则混合使用'],
    use:'既要动态有序集合，又要稳定的对数级查询和更新。', avoid:'只做静态批量查询，排序数组通常更简单且局部性更好。'
  },
  rangeQuery: {
    title:'区间分解与可合并摘要', mental:'不要为每次查询重扫整个区间。预先为标准区间保存摘要，把任意查询拆成少量标准块再合并。',
    baseline:'直接查询 O(n)，直接区间更新也可能 O(n)。树形分解、分块或前缀结构在预处理、查询、更新之间做权衡。',
    invariant:'每个节点或块保存的摘要准确对应其覆盖区间；父摘要等于孩子摘要的 combine；懒标记代表尚未下推但已经作用于整段的更新。',
    steps:['定义区间摘要以及 combine 是否满足结合律','构建标准区间或块的摘要','查询时选择完全覆盖的块并合并','更新时只修改受影响路径并重算祖先'],
    pseudo:'query(node, left, right):\n    if node.range inside query: return node.summary\n    push_lazy_if_needed(node)\n    return combine(query(left_child), query(right_child))',
    pitfalls:['区间端点一个用闭区间、另一个用半开区间','combine 不满足需要的代数性质','懒标记组合顺序错误'],
    use:'同一数据上有大量区间查询，或查询与更新交替出现。', avoid:'只有一次查询，预处理成本反而更高。'
  },
  graphTraversal: {
    title:'图搜索与访问状态', mental:'图算法先解决“同一节点可能被多条路径到达”。visited 不是优化细节，而是避免重复与死循环的正确性条件。',
    baseline:'从每个起点尝试所有路径会反复进入同一子图。BFS / DFS 让每个节点和每条边只被系统处理有限次数。',
    invariant:'已完成节点不会再次展开；容器中的节点已经发现但尚未完成；每条被接受的树边都连接已发现区域与新节点。',
    steps:['由边构建邻接关系并确定有向性','初始化起点、visited 与栈 / 队列','取出节点并检查相邻边','发现新节点时记录来源、层数或颜色'],
    pseudo:'frontier = [start]; visited = {start}\nwhile frontier not empty:\n    node = take(frontier)\n    for next in graph[node]:\n        if next not in visited:\n            visited.add(next); add(frontier, next)',
    pitfalls:['无向图把父边误判为环','有向边被错误地双向加入','在错误时机标记 visited 导致重复入队'],
    use:'可达性、连通分量、无权最短路、遍历顺序或图结构判定。', avoid:'边带不同权重且目标是最小代价，需要最短路算法。'
  },
  shortestPath: {
    title:'距离估计与边松弛', mental:'dist[v] 是目前已知的最好上界。每次松弛都在问：经过 u 到 v，是否能让这个上界更小？',
    baseline:'枚举所有路径会指数爆炸。最短路算法利用边权条件和处理顺序，只保留到每个节点的最佳已知状态。',
    invariant:'dist 始终是某条已发现路径的长度；前驱数组与 dist 同步；当算法宣称节点“已固定”时，必须满足相应边权前提。',
    steps:['把起点距离设为 0，其余设为无穷','按算法规则选择下一批待处理节点','对出边执行 dist[v] > dist[u]+w 的松弛','用前驱恢复路径并检查边权适用条件'],
    pseudo:'dist[start] = 0\nwhile exists_candidate:\n    u = choose_candidate()\n    for (u, v, weight) in outgoing_edges(u):\n        if dist[v] > dist[u] + weight:\n            dist[v] = dist[u] + weight; parent[v] = u',
    pitfalls:['Dijkstra 输入含负权边','更新距离后没有更新优先队列或允许过期条目','距离加法发生溢出'],
    use:'需要单源、多源或全源最小路径代价，并且边权满足所选算法前提。', avoid:'只关心连通性，普通 BFS / DFS 更直接。'
  },
  spanningTree: {
    title:'安全边与连通分量', mental:'最小生成树不是最短路。它要用 V-1 条边连接所有节点，并让总权重最小；核心是每次加入一条可以证明安全的边。',
    baseline:'枚举所有 V-1 条边组合不可行。割性质和环性质让算法能局部决定某条最轻边是否安全。',
    invariant:'已选边始终无环；每次加入后连通分量减少或已连接集合扩大；选择符合割性质。',
    steps:['初始化每个节点为独立分量或选择起点','按权重或跨割候选顺序检查边','只接受连接不同分量的安全边','选满 V-1 条边后验证连通与总权重'],
    pseudo:'chosen = []\nfor edge in safe_edge_order:\n    if edge connects different components:\n        chosen.add(edge); merge_components(edge)\n    if len(chosen) == V-1: break',
    pitfalls:['把有向图直接输入 MST','忘记检查图不连通时得到的是生成森林','混淆路径最短与总边权最小'],
    use:'无向带权网络的最低连接成本，如布线、道路和聚类。', avoid:'需要从指定起点到各点的路径最短。'
  },
  connectivity: {
    title:'DFS 时间戳与连通结构', mental:'进入时间 dfn 记录“何时第一次看到”，low 记录“子树最早能绕回哪里”。两者的比较揭示桥、割点和强连通块。',
    baseline:'删除每条边或节点后重新跑连通性测试代价很高。一次 DFS 可以把所有局部结构同时识别出来。',
    invariant:'完成子树时 low 已经综合树边与返边；栈中保存尚未归属最终分量的节点或边。',
    steps:['按 DFS 顺序设置 dfn 与 low','递归处理树边并吸收孩子 low','用返边更新 low','根据 low 与 dfn 的关系弹栈或标记关键边 / 节点'],
    pseudo:'dfs(u, parent):\n    dfn[u] = low[u] = ++time\n    for v in graph[u]:\n        process_tree_or_back_edge(u, v)\n        low[u] = min(low[u], reachable_time(v))\n    emit_component_if_boundary(u)',
    pitfalls:['无向图没有用边编号区分父边和平行边','low 更新时混用 dfn[v] 与 low[v]','弹栈边界多弹或少弹一个元素'],
    use:'需要桥、割点、强连通分量、双连通分量或缩点结构。', avoid:'图持续动态变化，静态 DFS 结果会频繁失效。'
  },
  flow: {
    title:'残量网络与可撤销选择', mental:'流量不是一次决定。残量网络中的反向边表示“以后可以撤销当前选择并改走别处”，这正是网络流能修正局部决策的原因。',
    baseline:'逐条路径贪心发送流可能堵住后续更优组合。残量边允许算法重新分配已发送流量。',
    invariant:'每条边满足容量上下界；除源汇外流量守恒；正向与反向残量容量保持一致。',
    steps:['建立正向容量边和容量为 0 的反向边','在残量网络寻找增广路或层次网络','沿路径发送瓶颈流并更新双向残量','没有可增广路径时读取最大流或费用'],
    pseudo:'while path_exists_in_residual_graph():\n    delta = minimum_residual_on_path()\n    for edge in path:\n        edge.residual -= delta\n        edge.reverse.residual += delta\n    answer += delta',
    pitfalls:['只更新正向边，没有更新反向残量','把原容量、当前流量和残量混为一个字段','费用流中存在负费用却没有正确势能或负环处理'],
    use:'容量分配、二分匹配、割、运输、上下界和最小费用问题。', avoid:'问题没有守恒结构，或只是普通最短路径。'
  },
  matching: {
    title:'交替路与匹配增广', mental:'匹配要求每个端点至多属于一条已选边。增广路通过“未匹配边、已匹配边”交替出现，一次翻转让匹配数增加 1。',
    baseline:'看到一条可用边就立即配对会阻塞后续选择。交替路允许重新安排已有匹配。',
    invariant:'当前边集始终是合法匹配；沿增广路翻转后，中间节点仍恰好匹配一次，两个端点从未匹配变为匹配。',
    steps:['维护每个节点当前匹配对象','从未匹配节点搜索交替路','找到未匹配终点后回溯翻转边状态','重复直到不存在增广路'],
    pseudo:'for free_vertex in left_side:\n    clear_search_marks()\n    if find_augmenting_path(free_vertex):\n        matching_size += 1\nreturn matching',
    pitfalls:['一次搜索中 visited 的作用域错误','翻转路径时只更新一侧匹配','把一般图匹配当作二分图匹配处理'],
    use:'人员任务分配、配对、指派和可行对应关系。', avoid:'一个节点可以分配多个单位，需要流模型或 b-matching。'
  },
  backtracking: {
    title:'选择、递归与撤销', mental:'回溯就是在决策树上做 DFS。代码骨架永远围绕三件事：做选择、进入下一层、撤销选择。难点是定义路径和可选列表。',
    baseline:'生成全部候选再检查会把大量明显非法的前缀也扩展到底。约束应尽可能早地用于剪枝。',
    invariant:'进入递归函数时，path 是一个合法前缀；choices 恰好是当前仍可用的选择；返回前共享状态恢复原样。',
    steps:['定义 path、choices 和结束条件','遍历当前可选决策','做选择并同步约束状态','递归后撤销所有本层修改'],
    pseudo:'backtrack(path, choices):\n    if is_complete(path): emit(path); return\n    for choice in choices:\n        if not valid(path, choice): continue\n        make(choice); backtrack(path, next_choices); undo(choice)',
    pitfalls:['忘记撤销一个辅助数组或计数器','把结果保存为 path 引用，之后被继续修改','剪枝条件虽然快但不保证安全，误删正确答案'],
    use:'需要枚举排列、组合、棋盘布局或满足约束的全部 / 任一解。', avoid:'状态高度重叠且只需最优值，动态规划通常更合适。'
  },
  constraint: {
    title:'约束传播与搜索剪枝', mental:'先传播必然结论，再对仍不确定的变量分支。一个好求解器把“冲突越早暴露越好”作为核心目标。',
    baseline:'给每个变量枚举全部取值会产生指数笛卡尔积。传播利用局部约束持续缩小变量域。',
    invariant:'每个变量域只包含尚未被现有约束排除的值；每次分支返回时域和赋值完整恢复。',
    steps:['定义变量、取值域和约束','传播单位条件或弧一致性','选择仍未决定的变量和候选值','冲突时回滚，完整赋值时输出解'],
    pseudo:'solve(domains):\n    if not propagate(domains): return failure\n    if all_assigned(domains): return solution\n    variable = choose_variable(domains)\n    for value in order_values(variable):\n        if solve(assign_copy(variable, value)): return solution',
    pitfalls:['传播删除值后没有把相关约束重新入队','回溯只恢复赋值，没有恢复变量域','启发式改变搜索顺序时破坏正确性'],
    use:'SAT、数独、图着色、精确覆盖和一般约束满足问题。', avoid:'问题具有可直接利用的多项式专用算法。'
  },
  dynamicProgramming: {
    title:'状态、选择与转移', mental:'动态规划先定义“dp 表里的一个格子到底代表什么”，再写转移。若状态定义说不清，代码通常只是碰巧通过样例。',
    baseline:'纯递归会重复求相同子问题。记忆化自顶向下缓存，递推自底向上按依赖顺序填表。',
    invariant:'计算 dp[state] 时，它依赖的状态已经正确；dp 的维度包含了做出未来决策所需的全部历史信息。',
    steps:['用一句话定义 dp[state] 的语义','列出当前状态可以做的选择','从更小或已完成状态写出转移','设置基例并按依赖顺序计算答案'],
    pseudo:'initialize(dp, base_cases)\nfor state in dependency_order:\n    for choice in legal_choices(state):\n        dp[state] = better(dp[state], transition(dp, state, choice))\nreturn dp[target_state]',
    pitfalls:['状态缺少必要信息，导致相同下标实际不是同一子问题','遍历方向错误，读到本轮刚更新的值','不可达状态没有用正确的无穷 / 空值初始化'],
    use:'问题有最优子结构和重叠子问题，且状态数量可控。', avoid:'子问题几乎不重叠，分治或回溯更自然。'
  },
  dpOptimization: {
    title:'转移结构与状态加速', mental:'DP 优化不是改变答案，而是利用决策点单调性、代价结构、卷积或数据结构，减少“每个状态枚举所有前驱”的成本。',
    baseline:'朴素转移通常是状态数乘候选数。优化前必须先写出正确的慢 DP，并找出真正的瓶颈维度。',
    invariant:'优化结构返回的候选集合必须覆盖朴素转移中的最优决策；任何删去的候选都要有数学证明。',
    steps:['写出未优化状态定义和完整转移','识别单调性、可分离代价或代数变换','维护候选决策的数据结构','与小规模朴素 DP 对拍验证'],
    pseudo:'slow_transition = min_or_sum_over_all_previous_states\nprove_structure(slow_transition)\nmaintain_only_relevant_candidates()\nfor state in order:\n    dp[state] = query_candidates(state)\n    insert_new_candidate(state)',
    pitfalls:['未经证明就假设最优决策单调','优化后状态更新顺序改变，候选包含未来信息','只测大数据速度，没有与朴素算法对拍'],
    use:'正确 DP 已经明确，但转移枚举成为性能瓶颈。', avoid:'状态定义本身错误，或输入规模根本不需要复杂优化。'
  },
  stringMatch: {
    title:'对齐、前后缀与跳转', mental:'字符串匹配的重复工作来自失配后重新比较已经知道相等的字符。预处理模式串，就是提前计算失配时应该跳到哪里。',
    baseline:'朴素匹配在每个起点重新从模式头比较，最坏会重复检查同一文本字符很多次。',
    invariant:'扫描到文本位置 i 时，状态记录了模式串与当前文本后缀的最长匹配长度；跳转后这段已知匹配仍然成立。',
    steps:['预处理模式串的边界、坏字符或哈希信息','从左到右扫描文本并维护匹配状态','失配时利用预处理跳转而不是清零重来','达到模式长度时记录匹配并继续'],
    pseudo:'prepare(pattern)\nstate = 0\nfor char in text:\n    while state cannot accept char:\n        state = fallback(state)\n    state = advance(state, char)\n    if state == pattern.length: emit_match()',
    pitfalls:['前缀表含义混用“长度”和“下标”','找到匹配后没有回退，漏掉重叠匹配','哈希相等时完全不做碰撞处理'],
    use:'单模式 / 多模式查找、重复片段、边界和前缀关系。', avoid:'只查询一次很短文本，朴素实现可能更清楚。'
  },
  stringIndex: {
    title:'后缀、自动机与全文索引', mental:'把所有子串问题转化为“后缀的公共前缀”或“自动机上的路径”。昂贵的结构只构建一次，之后复用大量查询。',
    baseline:'为每个查询枚举所有子串需要 O(n²) 存储甚至更高时间。索引结构共享重复前缀和后缀。',
    invariant:'每个状态、节点或排序位置代表一组定义明确的子串；转移保持字符扩展语义，链接保持最长真后缀关系。',
    steps:['确定索引表示的是前缀、后缀还是等价子串集合','按字符或倍增长度增量构建结构','维护链接、排名或区间边界','把查询转成路径、区间或公共前缀操作'],
    pseudo:'index = build_index(text)\nstate = index.start\nfor char in query:\n    state = index.transition(state, char)\n    if state is missing: return no_match\nreturn decode_answer(state)',
    pitfalls:['终止符与普通字符顺序处理不一致','状态克隆 / 后缀链接更新不完整','构建复杂度高，却只做一次简单查询'],
    use:'同一文本上有大量子串、重复、词典序或全文检索查询。', avoid:'文本很短且查询很少。'
  },
  palindrome: {
    title:'中心对称与回文边界', mental:'回文由中心和半径决定。优化算法复用已经计算出的最右回文区间，把对称位置的信息镜像到当前点。',
    baseline:'从每个中心向两侧扩展最坏 O(n²)。利用最右边界可以跳过已知必然相等的部分。',
    invariant:'当前最右回文区间内的字符关系已经确定；镜像半径在不越过右边界时可以安全复用。',
    steps:['统一奇偶回文表示或使用双指针','确定当前中心的初始半径','在必要位置继续向外比较','更新最右边界和答案'],
    pseudo:'for center in transformed_text:\n    radius[center] = mirrored_known_radius(center)\n    while can_expand(center, radius[center]): radius[center] += 1\n    update_rightmost_palindrome(center)\nreturn best_radius',
    pitfalls:['奇数和偶数长度下标换算错误','规范化文本后忘记映射回原下标','镜像半径超过最右边界仍直接复用'],
    use:'最长回文、回文计数、回文前后缀和回文结构查询。', avoid:'只判断一个字符串是否回文，双指针更简单。'
  },
  greedy: {
    title:'局部选择与交换论证', mental:'贪心代码往往很短，难点全在证明。需要说明任何最优解都能交换成包含当前选择的最优解。',
    baseline:'枚举所有选择组合可以得到最优解但代价指数级。贪心利用问题结构永久固定一个局部决策。',
    invariant:'已选择部分可以扩展为某个全局最优解；当前候选顺序保证被跳过项以后不可能比已选项更合适。',
    steps:['找出可比较的局部选择标准','按该标准排序或维护最优候选','选择不破坏可行性的候选','用交换论证、割性质或领先性质证明安全'],
    pseudo:'candidates = order_by_greedy_key(items)\nanswer = []\nfor item in candidates:\n    if feasible(answer, item):\n        answer.add(item)\nreturn answer',
    pitfalls:['凭直觉选择“看起来最好”但没有交换论证','排序键相同的边界处理破坏可行性','问题实际需要回看决策，贪心无法撤销'],
    use:'能证明局部安全选择，常见于区间、调度、编码和最小生成树。', avoid:'局部选择会影响未来价值且不存在交换性质。'
  },
  numberTheory: {
    title:'整数结构与模运算', mental:'数论算法不断把大问题变成更小但等价的问题。整除、余数、素因子和同余关系是主要状态。',
    baseline:'逐个尝试所有整数通常忽略了因子成对、余数递减或指数二进制分解等结构。',
    invariant:'每次变换保持原问题的解集或目标值；模运算的等价关系在加、减、乘中保持一致。',
    steps:['明确整数范围、符号与模数前提','利用整除或同余性质缩小问题','重复执行可证明等价的递推','处理溢出、负余数和不存在解的情况'],
    pseudo:'state = normalize(input)\nwhile not base_case(state):\n    state = equivalent_smaller_state(state)\nanswer = reconstruct_or_return(state)\nverify_number_theory_preconditions(answer)',
    pitfalls:['语言的负数取模语义与数学定义不同','中间乘法先溢出再取模','没有检查互质、奇素数等算法前提'],
    use:'素数、因子、最大公约数、同余、离散对数和大指数。', avoid:'输入是浮点近似量，整数等价关系不再成立。'
  },
  transform: {
    title:'换一个基底看计算', mental:'变换算法把原空间中昂贵的组合运算，映射成另一个空间中的逐点简单运算，再通过逆变换回到原问题。',
    baseline:'直接卷积或矩阵运算常有二次、三次复杂度。分治和代数结构可以复用大量重复子表达式。',
    invariant:'正变换和逆变换使用一致的归一化与根；每层蝶形操作只组合互不重叠的子问题。',
    steps:['把输入补齐到算法要求的长度或维度','按分治结构执行正变换','在变换域逐点完成目标运算','执行逆变换并处理舍入 / 取模'],
    pseudo:'size = pad_to_supported_size(input)\nA = forward_transform(a, size)\nB = forward_transform(b, size)\nC = pointwise_combine(A, B)\nreturn inverse_transform(C)',
    pitfalls:['逆变换忘记除以长度或取逆元','单位根阶数不满足长度要求','浮点 FFT 舍入导致整数误差'],
    use:'卷积、多项式乘法、周期信号和线性系统。', avoid:'数据很短，直接算法常数更小。'
  },
  compression: {
    title:'重复、概率与可逆表示', mental:'压缩不是让信息消失，而是给常见结构更短表示、少见结构更长表示。解码器必须只凭压缩流和约定恢复状态。',
    baseline:'固定长度保存每个符号没有利用频率偏斜和重复片段。压缩算法建立模型、字典或引用来减少冗余。',
    invariant:'编码器和解码器在每个位置拥有一致的模型 / 字典；码字可唯一解析；引用只指向已经可恢复的数据。',
    steps:['分析符号频率或可重复片段','选择码字、区间或字典引用','按顺序输出可唯一解析的标记','使用同一规则解码并逐项校验原文'],
    pseudo:'model = initialize()\nfor symbol_or_phrase in input:\n    token = encode_with_model(symbol_or_phrase, model)\n    output(token)\n    update(model, symbol_or_phrase)\nassert decode(output) == input',
    pitfalls:['编码端和解码端更新字典时机不一致','没有保存解码所需的模型信息','只比较压缩后字节数，忽略元数据开销'],
    use:'数据存在频率偏斜、连续重复、重复短语或上下文规律。', avoid:'数据已经接近随机或已经压缩，再压缩常会变大。'
  },
  geometry: {
    title:'方向、顺序与退化情况', mental:'几何算法尽量避免依赖斜率和角度浮点值，而使用叉积、点积和有序事件表达方向关系。',
    baseline:'枚举所有点对、边对或区域组合通常是二次甚至更高。排序和局部邻接能显著减少候选。',
    invariant:'点和事件按约定顺序处理；叉积符号的方向定义始终一致；边界上的共线、重合和端点情况有明确归属。',
    steps:['规范化坐标与精度策略','把几何关系转成叉积 / 点积或扫描事件','按坐标、极角或拓扑顺序处理','单独验证共线、重复点和边界点'],
    pseudo:'events = sort_geometric_events(objects)\nstate = empty_active_structure()\nfor event in events:\n    update_active_geometry(state, event)\n    test_only_relevant_neighbors(state, event)\nreturn geometric_answer(state)',
    pitfalls:['用浮点 == 判断共线或重合','叉积参数顺序改变导致符号反向','只测试一般位置，漏掉重复点和端点相交'],
    use:'点、线、多边形、距离、包含、相交和空间划分。', avoid:'问题本质是离散图关系，不需要引入坐标误差。'
  },
  spatial: {
    title:'空间分区与候选剪枝', mental:'空间索引的目标不是直接给答案，而是快速排除不可能相关的大块区域，只对少量候选做精确测试。',
    baseline:'每次查询检查全部对象是 O(n)。递归空间分区用包围区域把对象分组。',
    invariant:'每个节点的包围区域覆盖其全部对象 / 子节点；若查询与包围区域不相交，整棵子树都可安全跳过。',
    steps:['选择划分轴、象限或包围盒策略','递归分配对象并计算节点边界','查询时先测试节点边界','只进入可能相交的子节点并精确检查叶对象'],
    pseudo:'query(node, region):\n    if not intersects(node.bounds, region): return\n    if node is leaf: test_objects(node.objects)\n    else:\n        for child in node.children: query(child, region)',
    pitfalls:['对象跨分区时被遗漏或重复存储失控','树退化但没有重建策略','包围盒更新后父节点边界未同步'],
    use:'范围查询、最近邻、碰撞检测、视锥裁剪和地理对象索引。', avoid:'维度很高或数据极小，线性扫描可能更稳定。'
  },
  simulation: {
    title:'局部规则、同步更新与涌现', mental:'模拟要区分“读取上一帧”和“写入下一帧”。局部规则很简单，但大量个体同步迭代后会形成整体行为。',
    baseline:'只看最终图像难以判断实现是否正确。应逐帧检查状态更新、边界条件、随机性和数值稳定性。',
    invariant:'一帧内所有更新读取同一个旧状态；参数范围受控；能量、数量或概率等应守恒的量按模型保持。',
    steps:['初始化状态、参数和随机种子','基于旧状态计算每个单元 / 个体的局部影响','把结果写入新状态并统一交换缓冲','记录指标并检查稳定性与边界行为'],
    pseudo:'state = initialize(seed, parameters)\nrepeat until stopped:\n    next = empty_state()\n    for entity in state:\n        next[entity] = local_rule(entity, state, parameters)\n    state = next; render(state)',
    pitfalls:['原地更新让后处理对象读到新状态','时间步过大导致数值发散','没有固定随机种子，无法复现实验'],
    use:'群体行为、物理近似、元启发式优化、元胞自动机和生成系统。', avoid:'存在成熟的精确算法且必须给出可证明最优解。'
  }
};

const slugSets = {
  binarySearch:new Set(['binary-search','binary-search-boundaries','coordinate-compression']),
  sorting:new Set(['insertion-sort','heap-sort','merge-sort','quick-sort','bubble-sort','shell-sort','selection-sort','counting-sort','radix-sort','bucket-sort','introsort','timsort','external-merge-sort','inversion-count']),
  pointer:new Set(['sliding-window','two-pointers','floyd-cycle-detection','merge-intervals','matrix-traversal']),
  randomized:new Set(['reservoir-sampling','fisher-yates-shuffle','quickselect','median-of-medians','meet-in-the-middle']),
  linked:new Set(['linked-list','doubly-linked-list','circular-linked-list','rope']),
  stackQueue:new Set(['stack','queue','deque','circular-buffer','monotonic-stack-queue','parentheses-matching']),
  hash:new Set(['hash-table','set-map-adt','open-addressing-hash-table','bloom-filter','lru-cache','bitset-bitmap','frequency-counting']),
  tree:new Set(['binary-tree-basics','n-ary-tree','binary-search-tree','trie','radix-tree','cartesian-tree']),
  balancedTree:new Set(['red-black-tree','avl-tree','splay-tree','treap','b-tree','b-plus-tree','order-statistic-tree','pairing-heap','heap-priority-queue','skip-list','persistent-trie']),
  array:new Set(['dynamic-array','static-array','matrix-2d-array','array-operations','string-builder']),
  rangeQuery:new Set(['prefix-sum','difference-array','fenwick-tree','segment-tree','lazy-segment-tree','persistent-segment-tree','sparse-table','interval-tree','sqrt-decomposition','mo-algorithm','wavelet-matrix','disjoint-sparse-table','merge-sort-tree','li-chao-tree','segment-tree-beats']),
  shortestPath:new Set(['dijkstra','bellman-ford','floyd-warshall','astar-pathfinding','zero-one-bfs','bidirectional-bfs','dag-shortest-path','johnson-algorithm','grid-search']),
  spanningTree:new Set(['kruskal-mst','prim-mst','boruvka-mst','chu-liu-edmonds']),
  connectivity:new Set(['tarjan-scc','kosaraju-scc','bridges-articulation','biconnected-components','connected-components','undirected-cycle-detection','directed-cycle-detection','two-sat','stoer-wagner-min-cut','gomory-hu-tree','union-find','rollback-union-find','offline-dynamic-connectivity']),
  flow:new Set(['dinic','edmonds-karp','push-relabel','min-cost-max-flow','lower-bound-flow']),
  matching:new Set(['bipartite-matching','hopcroft-karp','hungarian-algorithm','blossom-matching','stable-marriage']),
  graphTraversal:new Set(['bfs','dfs','topological-sort','eulerian-path','bipartite-check','flood-fill','graph-representations']),
  treeGraph:new Set(['lowest-common-ancestor','tree-diameter','tree-isomorphism-ahu','preorder-traversal','inorder-traversal','postorder-traversal','level-order-traversal','tree-properties','heavy-light-decomposition','centroid-decomposition','euler-tour-tree','link-cut-tree','dsu-on-tree']),
  constraint:new Set(['dpll-sat','ac3-constraint-propagation','dancing-links','graph-coloring','sudoku-backtracking']),
  palindrome:new Set(['manacher','palindromic-tree','palindrome-check']),
  stringIndex:new Set(['suffix-tree','suffix-array-lcp','suffix-automaton','aho-corasick','fm-index','duval-lyndon-factorization','booth-minimum-rotation']),
  stringMatch:new Set(['regex-matching','boyer-moore','kmp-search','rabin-karp','z-algorithm','rolling-hash','naive-string-search','anagram-check','longest-common-prefix']),
  dpOptimization:new Set(['divide-conquer-dp-optimization','knuth-optimization','convex-hull-trick','profile-dp','sos-dp']),
  backtracking:new Set(['tower-of-hanoi','knights-tour','n-queens','branch-and-bound','minimax-alpha-beta','recursion-call-stack','permutation-generation','combination-generation','subset-enumeration','parentheses-generation']),
  transform:new Set(['fft','ntt','fourier-epicycles','gaussian-elimination','matrix-exponentiation']),
};

export function classifyEntry(entry) {
  for (const [profile, slugs] of Object.entries(slugSets)) if (slugs.has(entry.slug)) return profile === 'treeGraph' ? 'tree' : profile;
  if (entry.category === '动态规划与序列') return 'dynamicProgramming';
  if (entry.category === '贪心、调度与编码') return 'greedy';
  if (entry.category === '字符串算法') return 'stringMatch';
  if (entry.category === '回溯、博弈与约束求解') return 'backtracking';
  if (entry.category === '图算法、网络流与回溯') return 'graphTraversal';
  if (entry.category === '数据结构' || entry.category === '高级查询与树分解') return 'rangeQuery';
  if (entry.category === '空间数据结构') return 'spatial';
  if (entry.category === '计算几何') return 'geometry';
  if (entry.category === '数论、变换与线性代数') return 'numberTheory';
  if (entry.category === '压缩算法') return 'compression';
  if (entry.category === '生成、优化与模拟') return 'simulation';
  return 'array';
}

export function problemForEntry(entry) {
  if (entry.problem && !entry.problem.includes('更一般地说，它要解决的是')) return entry.problem;
  const profile = classifyEntry(entry);
  return `${entry.summary}。${familyProblem[profile] || categoryProblem[entry.category]}`;
}

export function complexityForEntry(entry) {
  return entry.complexity || complexityBySlug[entry.slug] || '复杂度取决于状态数量、每次状态转移成本和所用底层数据结构；分析时应分别统计预处理、单次操作与额外空间。';
}

function markdownLinks(entries) {
  return entries.length ? entries.map((item) => `[${item.name}](${item.source})`).join('、') : '暂无强制关联项。';
}

function relatedEntries(entry, catalog) {
  const prerequisites = (entry.prerequisites || []).map((slug) => catalog.find((item) => item.slug === slug)).filter(Boolean);
  const next = catalog.filter((item) => (item.prerequisites || []).includes(entry.slug)).slice(0, 4);
  const sameFamily = catalog.filter((item) => item.slug !== entry.slug && classifyEntry(item) === classifyEntry(entry) && !prerequisites.includes(item) && !next.includes(item)).slice(0, 4);
  return { prerequisites, next, sameFamily };
}

function learningQuestions(entry, profile) {
  return [
    `不看代码，你能否用一句话说清 **${entry.name}** 在每一步维护的状态？`,
    `如果删除“${profile.invariant.split('；')[0]}”这个条件，能构造一个最小反例吗？`,
    `把演示输入缩小到 3 到 6 个元素，能否在纸上预测下一帧再点击“单步”？`,
    `当前复杂度的主导项来自哪里？换一种底层数据结构后会怎样变化？`
  ];
}

export function buildLearningGuide(entry, catalog, prerequisiteMarkdown) {
  const profileName = classifyEntry(entry);
  const profile = profiles[profileName];
  const problem = problemForEntry(entry);
  const complexity = complexityForEntry(entry);
  const related = relatedEntries(entry, catalog);
  const steps = profile.steps.map((step, index) => `${index + 1}. ${step}${index === 1 ? `。在本算法中，对应演示动作是：${entry.summary}` : ''}`).join('\n');
  const pitfalls = profile.pitfalls.map((item) => `- ${item}`).join('\n');
  const questions = learningQuestions(entry, profile).map((item) => `- ${item}`).join('\n');
  return `# ${entry.name}

> ${entry.summary}

## 先抓住一句话

**${entry.name}** 属于“${profile.title}”这一类问题。先不要急着背实现：它的核心任务是：${problem}

学习时只盯住两件事：**当前状态表示什么**，以及**这一步为什么可以排除其他可能**。演示中的颜色、指针、队列、区间或节点变化，都是这两个问题的可视化表达。

## 为什么需要它

${profile.baseline}

${entry.summary}。这句话里的动作不是界面效果，而是算法正确性的关键过程。把它拆开看，可以得到“输入约束 → 状态变化 → 不变量仍成立 → 答案范围缩小”这条主线。

## 心智模型

${profile.mental}

面对新题时，不要先问“该套哪个模板”，先问：

1. 输入中有什么结构可以利用，例如有序性、连续区间、树形依赖、图的边或重复子问题？
2. 当前保存的状态是否足以决定下一步？
3. 哪些候选已经可以被严格证明不可能，因而永远不用再看？

## 核心不变量

> ${profile.invariant}

所谓不变量，就是算法每一步开始和结束时都必须为真的事实。调试 **${entry.name}** 时，最有效的方法不是盯着最终答案，而是在每次单步后检查这条不变量。只要某一帧不再满足它，错误通常就在上一帧的边界更新、状态转移或数据结构维护中。

## 算法步骤

${steps}

演示把这些步骤保存为一系列状态快照。先单步执行，确认自己能预测下一帧，再使用连续播放。若只看动画而不预测，容易记住颜色变化，却没有真正掌握决策依据。

## 框架伪代码

下面的伪代码刻意忽略页面绘制和工程细节，只保留这类算法最值得迁移的骨架：

\`\`\`text
${profile.pseudo}
\`\`\`

把伪代码映射到本目录的 \`app.js\` 时，可以按“解析输入 → 初始化状态 → 生成每一步 → 更新指标 → Canvas 绘制”的顺序阅读。算法逻辑负责决定状态，绘图逻辑只负责把状态呈现出来，两者不要混在一起理解。

## 跟着演示手算

1. 打开页面后先暂停，抄下初始输入，并写出你认为最重要的状态变量。
2. 点击一次“单步”前，先根据不变量预测哪些值、节点、边或区间会改变。
3. 对照状态栏观察“${entry.summary}”是否正在发生，并解释为什么没有选择其他候选。
4. 到达终态后只改一个边界条件，例如空输入、重复值、极端顺序、断开的图或最小规模，再重新运行。
5. 最后尝试不看动画，只根据伪代码复现同一过程；能独立写出状态变化才算真正掌握。

## 复杂度怎么分析

**结论：${complexity}**

不要只背大 O。分析时分三步：先数一共有多少个状态或元素，再数每个状态被处理多少次，最后把排序、堆操作、哈希查询、递归深度或额外表格单独计入。若算法具有摊还或期望复杂度，还要说明“总成本如何分摊”或“随机性假设是什么”。

## 常见错误

${pitfalls}
- 只用默认样例验证，没有测试空结构、单元素、重复值、断开输入或最大边界。
- 把演示中的视觉位置当作算法状态；真正应该验证的是数据、索引、距离、计数或引用关系。

## 什么时候使用

适合：${profile.use}

不适合：${profile.avoid}选择算法时应同时考虑输入规模、数据是否动态变化、是否需要恢复具体方案，以及最坏情况是否可以接受。

## 与其他算法的联系

- 先修内容：${entry.prerequisites.length ? prerequisiteMarkdown(entry) : '无硬性先修要求，可以直接从本页的最小示例开始。'}
- 直接后续：${markdownLinks(related.next)}
- 同类比较：${markdownLinks(related.sameFamily)}

学习顺序建议是：先用先修算法理解基础状态，再比较同类算法在“前提、维护信息、复杂度、是否可恢复答案”上的差异，最后进入把本算法作为组件的后续主题。

## 自测问题

${questions}

## 文件与运行

- \`index.html\`：演示页面结构
- \`styles.css\`：响应式界面样式
- \`app.js\`：算法实现、步骤生成和 Canvas 绘制
- \`README.md\`：本学习指南

## 在线查看

- [打开演示](${entry.demo})
- [查看源码](${entry.source})
- [返回算法目录](https://wuhy80.github.io/algorithm/)
`;
}

export const learningGuideHeadings = [
  '## 先抓住一句话','## 为什么需要它','## 心智模型','## 核心不变量','## 算法步骤','## 框架伪代码',
  '## 跟着演示手算','## 复杂度怎么分析','## 常见错误','## 什么时候使用','## 与其他算法的联系','## 自测问题','## 文件与运行','## 在线查看'
];
