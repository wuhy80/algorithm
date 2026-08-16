# 算法可视化实验室

这个仓库以实时动画拆解算法和数据结构，目前包含 117 个独立演示。每个项目都保存在独立目录中，包含可直接运行的网页演示、核心实现和中文 README，彼此之间没有运行依赖。

算法名称链接到 GitHub 源码目录；“打开演示”链接到可以直接体验的 GitHub Pages 页面。

## 查找、排序与算法技巧

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [线性查找 Linear Search](https://github.com/wuhy80/algorithm/tree/main/linear-search/) | 探针从左向右逐项比较，并保留已扫描区域和最终命中位置 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/linear-search/) |
| [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | 有序数组的左右边界持续收缩，中点比较与命中过程逐步高亮 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/binary-search/) |
| [冒泡排序 Bubble Sort](https://github.com/wuhy80/algorithm/tree/main/bubble-sort/) | 相邻元素逐对比较、交换，最大值逐轮浮向数组末端 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bubble-sort/) |
| [选择排序 Selection Sort](https://github.com/wuhy80/algorithm/tree/main/selection-sort/) | 扫描未排序区间、记录最小值并交换到区间起点 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/selection-sort/) |
| [插入排序 Insertion Sort](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/) | 暂存当前键值、右移较大元素并插入有序前缀 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/insertion-sort/) |
| [快速排序 Quick Sort](https://github.com/wuhy80/algorithm/tree/main/quick-sort/) | 基准选择、双指针扫描、分区交换与递归区间展开 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/quick-sort/) |
| [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | 数组递归拆分，左右有序段逐项比较并重新合并 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/merge-sort/) |
| [堆排序 Heap Sort](https://github.com/wuhy80/algorithm/tree/main/heap-sort/) | 最大堆构建、堆顶提取、向下调整及有序后缀增长 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/heap-sort/) |
| [计数排序 Counting Sort](https://github.com/wuhy80/algorithm/tree/main/counting-sort/) | 频次统计、前缀累计和稳定回写输出数组 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/counting-sort/) |
| [基数排序 Radix Sort](https://github.com/wuhy80/algorithm/tree/main/radix-sort/) | 按当前数位稳定分桶并逐轮收集形成有序序列 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/radix-sort/) |
| [希尔排序 Shell Sort](https://github.com/wuhy80/algorithm/tree/main/shell-sort/) | Gap 分组插入、远距离移动以及间隔逐步收缩 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/shell-sort/) |
| [桶排序 Bucket Sort](https://github.com/wuhy80/algorithm/tree/main/bucket-sort/) | 元素按值域分桶、桶内排序并依序合并输出 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bucket-sort/) |
| [快速选择 Quickselect](https://github.com/wuhy80/algorithm/tree/main/quickselect/) | 基准分区后只深入目标秩所在一侧，逐步锁定第 K 小元素 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/quickselect/) |
| [双指针 Two Pointers](https://github.com/wuhy80/algorithm/tree/main/two-pointers/) | 有序数组左右指针根据当前和单调收缩搜索区间 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/two-pointers/) |
| [滑动窗口 Sliding Window](https://github.com/wuhy80/algorithm/tree/main/sliding-window/) | 固定窗口逐格滑动，复用移出与移入元素更新区间和 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/sliding-window/) |

## 图算法、网络流与回溯

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | 队列驱动搜索前沿逐层扩张，并重建起点到目标的最短步数路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bfs/) |
| [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | 栈与递归路径持续深入，遇到末路后回退探索其他分支 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/dfs/) |
| [Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | 固定当前最短节点、逐边松弛距离并回溯最终路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/dijkstra/) |
| [Bellman-Ford 最短路径](https://github.com/wuhy80/algorithm/tree/main/bellman-ford/) | 全边多轮松弛、负权边传播以及负权环检测 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bellman-ford/) |
| [Floyd-Warshall 全源最短路径](https://github.com/wuhy80/algorithm/tree/main/floyd-warshall/) | 逐个允许中转点并动态更新节点对距离矩阵 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/floyd-warshall/) |
| [Prim 最小生成树](https://github.com/wuhy80/algorithm/tree/main/prim-mst/) | 从树内节点向外扩张，每轮选择最轻割边 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/prim-mst/) |
| [Kruskal 最小生成树](https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/) | 按权重检查边，并用并查集接受或拒绝形成环的边 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/kruskal-mst/) |
| [拓扑排序 Topological Sort](https://github.com/wuhy80/algorithm/tree/main/topological-sort/) | 入度归零、队列变化、依赖边删除和有向环检测 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/topological-sort/) |
| [Tarjan 强连通分量](https://github.com/wuhy80/algorithm/tree/main/tarjan-scc/) | DFS 时间戳、Lowlink、栈变化与分量弹出着色 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/tarjan-scc/) |
| [割点与桥](https://github.com/wuhy80/algorithm/tree/main/bridges-articulation/) | DFS 树回溯、Lowlink 更新及关键节点与边判定 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bridges-articulation/) |
| [Edmonds-Karp 最大流](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/) | BFS 增广路径、瓶颈流量与残量网络更新 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/edmonds-karp/) |
| [二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/) | 交替增广路径搜索与已有匹配重新安排 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bipartite-matching/) |
| [N 皇后 N-Queens](https://github.com/wuhy80/algorithm/tree/main/n-queens/) | 皇后逐行尝试摆放，冲突位置高亮并动态展示撤销回溯 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/n-queens/) |
| [数独回溯 Sudoku Backtracking](https://github.com/wuhy80/algorithm/tree/main/sudoku-backtracking/) | 候选数字尝试、约束冲突、错误分支撤销与完整解生成 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/sudoku-backtracking/) |
| [欧拉路径 Eulerian Path](https://github.com/wuhy80/algorithm/tree/main/eulerian-path/) | Hierholzer 栈沿未使用边深入并在回退时构造完整路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/eulerian-path/) |
| [最近公共祖先 LCA](https://github.com/wuhy80/algorithm/tree/main/lowest-common-ancestor/) | 查询节点先对齐深度，再同步提升到最近公共祖先 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/lowest-common-ancestor/) |
| [匈牙利算法 Hungarian](https://github.com/wuhy80/algorithm/tree/main/hungarian-algorithm/) | 成本矩阵行列归约、零元素覆盖与最优一一指派 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/hungarian-algorithm/) |
| [图着色回溯 Graph Coloring](https://github.com/wuhy80/algorithm/tree/main/graph-coloring/) | 节点逐色尝试、相邻冲突判断与失败分支撤销 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/graph-coloring/) |
| [Dinic 最大流](https://github.com/wuhy80/algorithm/tree/main/dinic/) | BFS 分层图、DFS 阻塞流与多路径增广过程 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/dinic/) |
| [最小费用最大流](https://github.com/wuhy80/algorithm/tree/main/min-cost-max-flow/) | 最低费用增广路、瓶颈流量和累计费用同步更新 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/min-cost-max-flow/) |
| [Hopcroft-Karp 匹配](https://github.com/wuhy80/algorithm/tree/main/hopcroft-karp/) | 交替图分层并在同一阶段扩展多条最短增广路 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/hopcroft-karp/) |
| [Johnson 全源最短路](https://github.com/wuhy80/algorithm/tree/main/johnson-algorithm/) | Bellman-Ford 势能重标与逐源 Dijkstra 距离计算 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/johnson-algorithm/) |
| [汉诺塔 Tower of Hanoi](https://github.com/wuhy80/algorithm/tree/main/tower-of-hanoi/) | 递归分解圆盘搬运，展示全部 2ⁿ-1 次合法移动 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/tower-of-hanoi/) |
| [骑士巡游 Knight's Tour](https://github.com/wuhy80/algorithm/tree/main/knights-tour/) | Warnsdorff 候选排序、骑士跳步与回溯撤销 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/knights-tour/) |
| [舞蹈链 Dancing Links](https://github.com/wuhy80/algorithm/tree/main/dancing-links/) | 精确覆盖矩阵选列、覆盖、恢复与 Algorithm X 解路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/dancing-links/) |

## 字符串算法

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [KMP 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/kmp-search/) | 构建 LPS 前缀表，失配时移动模式串而不回退文本指针 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/kmp-search/) |
| [Aho-Corasick 多模式匹配](https://github.com/wuhy80/algorithm/tree/main/aho-corasick/) | Trie 插入、失败指针建立以及一次文本扫描中的多模式命中 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/aho-corasick/) |
| [Rabin-Karp 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/rabin-karp/) | 文本窗口滑动、滚动哈希更新和哈希碰撞校验 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/rabin-karp/) |
| [Boyer-Moore 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/boyer-moore/) | 从模式串尾部比较，坏字符失配时跨越无效对齐 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/boyer-moore/) |
| [Z 算法 Z Algorithm](https://github.com/wuhy80/algorithm/tree/main/z-algorithm/) | 维护最右 Z Box，复用镜像结果计算全部前缀匹配长度 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/z-algorithm/) |
| [Manacher 最长回文](https://github.com/wuhy80/algorithm/tree/main/manacher/) | 分隔符变换、镜像半径复用与最长回文区间扩展 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/manacher/) |
| [后缀数组与 LCP](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/) | 倍增排序全部后缀并计算相邻后缀最长公共前缀 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/suffix-array-lcp/) |
| [正则匹配 DP](https://github.com/wuhy80/algorithm/tree/main/regex-matching/) | 二维状态处理普通字符、点通配符与星号重复规则 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/regex-matching/) |

## 动态规划与序列

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | 状态表逐格比较选与不选，并回溯最优物品组合 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/knapsack-dp/) |
| [最长公共子序列 LCS](https://github.com/wuhy80/algorithm/tree/main/longest-common-subsequence/) | 二维状态表填充并沿最优路径回溯公共子序列 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/longest-common-subsequence/) |
| [编辑距离 Edit Distance](https://github.com/wuhy80/algorithm/tree/main/edit-distance/) | 插入、删除、替换状态转移与最优编辑路径回溯 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/edit-distance/) |
| [最长递增子序列 LIS](https://github.com/wuhy80/algorithm/tree/main/longest-increasing-subsequence/) | 最小尾值数组、二分替换和递增子序列重建 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/longest-increasing-subsequence/) |
| [零钱兑换 Coin Change](https://github.com/wuhy80/algorithm/tree/main/coin-change/) | 金额状态从更小金额转移并记录最少硬币数 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/coin-change/) |
| [Kadane 最大子数组](https://github.com/wuhy80/algorithm/tree/main/kadane/) | 在重新开始和延续前缀间选择，持续更新最大连续和 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/kadane/) |
| [矩阵链乘法](https://github.com/wuhy80/algorithm/tree/main/matrix-chain-multiplication/) | 区间长度递增、断点枚举和最少标量乘法代价更新 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/matrix-chain-multiplication/) |
| [旅行商位压 DP](https://github.com/wuhy80/algorithm/tree/main/traveling-salesman-bitmask/) | 已访问城市位掩码、终点状态扩展与最短回路重建 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/traveling-salesman-bitmask/) |
| [带权区间调度](https://github.com/wuhy80/algorithm/tree/main/weighted-interval-scheduling/) | 兼容前驱查找、选择/跳过比较和最优任务集合回溯 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/weighted-interval-scheduling/) |
| [子集和 Subset Sum](https://github.com/wuhy80/algorithm/tree/main/subset-sum/) | 逐元素从高到低更新可达和并判断目标状态 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/subset-sum/) |
| [数位 DP Digit DP](https://github.com/wuhy80/algorithm/tree/main/digit-dp/) | 上界约束、数位状态分支和记忆化计数表更新 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/digit-dp/) |
| [树形 DP Tree DP](https://github.com/wuhy80/algorithm/tree/main/tree-dp/) | 后序合并子树的不选/选择状态并求最大权独立集 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/tree-dp/) |

## 贪心、调度与编码

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [Huffman 编码](https://github.com/wuhy80/algorithm/tree/main/huffman-coding/) | 字符频率队列、最低频节点合并和前缀编码树生成 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/huffman-coding/) |

## 数据结构

| 数据结构 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [栈 Stack](https://github.com/wuhy80/algorithm/tree/main/stack/) | 元素压栈、出栈、查看栈顶以及 Overflow / Underflow 状态 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/stack/) |
| [队列 Queue](https://github.com/wuhy80/algorithm/tree/main/queue/) | 循环数组中的入队、出队以及 Head / Tail 指针移动 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/queue/) |
| [链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/) | 节点插入、删除、查找与 next 指针重新连接 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/linked-list/) |
| [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | 插入与查找路径逐层下降，删除后树结构重新连接 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/binary-search-tree/) |
| [AVL 平衡树](https://github.com/wuhy80/algorithm/tree/main/avl-tree/) | 插入后计算平衡因子，通过 LL、RR、LR、RL 旋转恢复平衡 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/avl-tree/) |
| [红黑树 Red-Black Tree](https://github.com/wuhy80/algorithm/tree/main/red-black-tree/) | 插入后的颜色修复、叔节点判断及左右旋转 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/red-black-tree/) |
| [B 树 B-Tree](https://github.com/wuhy80/algorithm/tree/main/b-tree/) | 多键节点插入、满节点分裂和中间键向上提升 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/b-tree/) |
| [堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | 插入上浮、提取堆顶和替换后的向下调整 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/heap-priority-queue/) |
| [哈希表 Hash Table](https://github.com/wuhy80/algorithm/tree/main/hash-table/) | 哈希定位、碰撞链扫描以及键值插入、查找和删除 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/hash-table/) |
| [跳表 Skip List](https://github.com/wuhy80/algorithm/tree/main/skip-list/) | 多层稀疏索引插入、向右跳跃与逐层下降查找 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/skip-list/) |
| [Bloom Filter](https://github.com/wuhy80/algorithm/tree/main/bloom-filter/) | 多哈希映射、位数组置位和概率成员查询 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bloom-filter/) |
| [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/) | 字符路径共享、单词终点、插入、查找、删除及前缀判断 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/trie/) |
| [线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) | 区间递归分解、完整覆盖节点选择和单点更新传播 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/segment-tree/) |
| [树状数组 Fenwick Tree](https://github.com/wuhy80/algorithm/tree/main/fenwick-tree/) | lowbit 覆盖范围以及查询、更新索引的跳转路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/fenwick-tree/) |
| [稀疏表 Sparse Table](https://github.com/wuhy80/algorithm/tree/main/sparse-table/) | 2 的幂次区间预处理以及双区间块常数时间查询 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/sparse-table/) |
| [并查集 Union-Find](https://github.com/wuhy80/algorithm/tree/main/union-find/) | 父指针查找、按秩合并、路径压缩和连通性判断 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/union-find/) |
| [双端队列 Deque](https://github.com/wuhy80/algorithm/tree/main/deque/) | 队首与队尾的插入删除操作及边界元素变化 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/deque/) |
| [LRU 缓存](https://github.com/wuhy80/algorithm/tree/main/lru-cache/) | 访问命中、最近使用顺序移动与容量淘汰 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/lru-cache/) |
| [懒标记线段树](https://github.com/wuhy80/algorithm/tree/main/lazy-segment-tree/) | 区间递归覆盖、懒标记暂存和节点区间和更新 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/lazy-segment-tree/) |
| [B+ 树 B+ Tree](https://github.com/wuhy80/algorithm/tree/main/b-plus-tree/) | 叶节点插入分裂、父级分隔键和叶链连接 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/b-plus-tree/) |
| [Treap 随机平衡树](https://github.com/wuhy80/algorithm/tree/main/treap/) | BST 插入、随机优先级比较与旋转恢复堆序 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/treap/) |
| [伸展树 Splay Tree](https://github.com/wuhy80/algorithm/tree/main/splay-tree/) | Zig、Zig-Zig、Zig-Zag 旋转把访问目标提升到根 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/splay-tree/) |
| [单调栈 Monotonic Stack](https://github.com/wuhy80/algorithm/tree/main/monotonic-stack-queue/) | 递减栈进出过程与右侧首个更大值确定 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/monotonic-stack-queue/) |
| [可持久化线段树](https://github.com/wuhy80/algorithm/tree/main/persistent-segment-tree/) | 新旧版本路径复制、未修改子树共享与区间和比较 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/persistent-segment-tree/) |

## 空间数据结构

| 数据结构 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [四叉树 Quadtree](https://github.com/wuhy80/algorithm/tree/main/quadtree/) | 二维区域递归四分、点插入和矩形范围查询 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/quadtree/) |
| [KD 树 K-D Tree](https://github.com/wuhy80/algorithm/tree/main/kd-tree/) | 交替坐标轴中位划分、最近邻搜索与空间剪枝 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/kd-tree/) |
| [R 树 R-Tree](https://github.com/wuhy80/algorithm/tree/main/r-tree/) | 空间矩形插入、最小包围盒分组和范围查询 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/r-tree/) |

## 计算几何

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [凸包 Convex Hull](https://github.com/wuhy80/algorithm/tree/main/convex-hull/) | 按坐标排序、叉积判断、栈弹出及上下凸包合并 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/convex-hull/) |
| [Voronoi 与 Lloyd 松弛](https://github.com/wuhy80/algorithm/tree/main/voronoi-relaxation/) | 泰森多边形随控制点移动，并逐步趋向均匀分布 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/voronoi-relaxation/) |
| [最近点对 Closest Pair](https://github.com/wuhy80/algorithm/tree/main/closest-pair/) | 点集分治、中线条带候选和最近距离持续收缩 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/closest-pair/) |
| [扫描线线段交点](https://github.com/wuhy80/algorithm/tree/main/sweep-line-intersection/) | 端点事件、活动线段集合与交点逐步发现 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/sweep-line-intersection/) |
| [Delaunay 三角剖分](https://github.com/wuhy80/algorithm/tree/main/delaunay-triangulation/) | 新点插入、坏三角形移除与空腔边界重建 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/delaunay-triangulation/) |
| [点在多边形内](https://github.com/wuhy80/algorithm/tree/main/point-in-polygon/) | 水平射线逐边求交并按交点奇偶实时判定 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/point-in-polygon/) |
| [旋转卡壳 Rotating Calipers](https://github.com/wuhy80/algorithm/tree/main/rotating-calipers/) | 凸包边与对踵点同步推进并求最远点对 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/rotating-calipers/) |

## 数论与基础计算

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/) | 当前质数选取、倍数标记与质数集合逐步收敛 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/sieve-of-eratosthenes/) |
| [欧几里得算法 Euclidean](https://github.com/wuhy80/algorithm/tree/main/euclidean-algorithm/) | 商余数等式迭代、参数替换和最大公约数收敛 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/euclidean-algorithm/) |
| [快速模幂 Modular Exponentiation](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/) | 指数二进制位读取、底数平方和模结果累积 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/modular-exponentiation/) |
| [快速傅里叶变换 FFT](https://github.com/wuhy80/algorithm/tree/main/fft/) | 位逆序排列、分层蝶形合并和频域幅度生成 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/fft/) |
| [Miller-Rabin 素性测试](https://github.com/wuhy80/algorithm/tree/main/miller-rabin/) | n-1 分解、模幂底数测试与合数见证识别 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/miller-rabin/) |
| [中国剩余定理 CRT](https://github.com/wuhy80/algorithm/tree/main/chinese-remainder-theorem/) | 部分模数、乘法逆元与同余方程逐项合并 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/chinese-remainder-theorem/) |
| [欧拉函数筛 Totient](https://github.com/wuhy80/algorithm/tree/main/euler-totient/) | 质数识别、倍数 φ 值批量更新与目标结果收敛 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/euler-totient/) |

## 压缩算法

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [LZ77 压缩](https://github.com/wuhy80/algorithm/tree/main/lz77/) | 搜索窗口、最长重复匹配与距离长度令牌输出 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/lz77/) |
| [LZW 压缩](https://github.com/wuhy80/algorithm/tree/main/lzw/) | 短语词典动态扩展和编码编号依次输出 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/lzw/) |
| [算术编码 Arithmetic Coding](https://github.com/wuhy80/algorithm/tree/main/arithmetic-coding/) | 符号概率驱动 low/high 编码区间持续收缩 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/arithmetic-coding/) |

## 生成、优化与模拟

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [Boids 群鸟算法](https://github.com/wuhy80/algorithm/tree/main/boids/) | 鸟群实时聚合、分离、同步、避障和鼠标交互 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/boids/) |
| [蚁群优化 Ant Colony Optimization](https://github.com/wuhy80/algorithm/tree/main/ant-colony/) | 蚂蚁探索路径、信息素沉积与挥发、最短路线逐渐显现 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/ant-colony/) |
| [A* 寻路 A* Pathfinding](https://github.com/wuhy80/algorithm/tree/main/astar-pathfinding/) | 搜索前沿扩张、代价变化、障碍编辑与最终路径回溯 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/astar-pathfinding/) |
| [粒子群优化 Particle Swarm Optimization](https://github.com/wuhy80/algorithm/tree/main/particle-swarm/) | 粒子在目标函数地形中移动并逐步汇聚到最优区域 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/particle-swarm/) |
| [遗传火箭 Genetic Rockets](https://github.com/wuhy80/algorithm/tree/main/genetic-rockets/) | 多代火箭飞向目标，展示选择、交叉、变异和适应度进化 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/genetic-rockets/) |
| [N 体引力 N-body Simulation](https://github.com/wuhy80/algorithm/tree/main/n-body/) | 星体受引力运动、形成轨道与拖尾，并展示引力积分过程 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/n-body/) |
| [反应扩散 Reaction-Diffusion](https://github.com/wuhy80/algorithm/tree/main/reaction-diffusion/) | Gray-Scott 模型实时生长斑点、条纹和有机纹理 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/reaction-diffusion/) |
| [波函数坍缩 Wave Function Collapse](https://github.com/wuhy80/algorithm/tree/main/wave-function-collapse/) | 网格按最低熵逐格坍缩，约束向周围持续传播 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/wave-function-collapse/) |
| [Perlin 噪声流场 Flow Field](https://github.com/wuhy80/algorithm/tree/main/flow-field/) | 大量粒子沿连续噪声向量场流动并留下动态轨迹 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/flow-field/) |
| [迷宫生成 Maze Generation](https://github.com/wuhy80/algorithm/tree/main/maze-generation/) | 墙体逐步开凿形成迷宫，并动态展示寻路过程 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/maze-generation/) |
| [傅里叶旋轮 Fourier Epicycles](https://github.com/wuhy80/algorithm/tree/main/fourier-epicycles/) | 多级旋转向量逐步重建并绘制复杂轮廓 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/fourier-epicycles/) |
| [康威生命游戏 Conway's Game of Life](https://github.com/wuhy80/algorithm/tree/main/game-of-life/) | 细胞在离散规则下繁衍、消亡并产生复杂结构 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/game-of-life/) |

## 推荐学习路径

1. 从线性查找、二分查找、比较排序和非比较排序理解扫描、交换、分治、计数与分桶。
2. 通过栈、队列、链表掌握线性数据结构的状态变化。
3. 使用 BFS、DFS、最短路、生成树、强连通分量和回溯理解图搜索与连通性。
4. 通过最大流、二分图匹配和网络优化理解容量、残量与增广路径。
5. 进入 BST、AVL、红黑树、B 树、Trie、跳表和区间结构，学习索引、平衡与查询加速。
6. 通过 KMP、Aho-Corasick、编辑距离、背包、LCS 和 LIS 掌握字符串预处理与动态规划。
7. 最后探索编码、数论、空间索引、计算几何、群体智能、生成系统与物理模拟。

## 演示原则

- 展示算法的演化过程，而不只是最终结果或静态图表。
- 提供播放/暂停、单步执行、重置以及与算法相关的动态参数。
- 使用 Canvas 或高效 DOM 更新支撑动画，并实时展示关键状态指标。
- 同时适配桌面与移动端，交互控件保持键盘可访问。
- 每个目录都能独立运行和阅读，不依赖构建工具或后端服务。

## 目录约定

每个算法或数据结构目录至少包含：

- `index.html`：可以直接打开的演示入口。
- `styles.css`：独立界面样式。
- `app.js`：算法和动画实现。
- `README.md`：原理、解决的问题、复杂度和使用方式。

GitHub Pages 从 `main` 分支根目录发布，目录名同时作为在线演示路径：

```text
https://wuhy80.github.io/algorithm/<目录名>/
```
