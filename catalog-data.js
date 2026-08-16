// Generated from catalog.json. Do not edit directly.
window.ALGORITHM_CATALOG = [
  {
    "slug": "insertion-sort",
    "name": "插入排序 Insertion Sort",
    "category": "查找、排序与算法技巧",
    "summary": "暂存当前键值、右移较大元素并插入有序前缀",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/insertion-sort/",
    "demo": "https://wuhy80.github.io/algorithm/insertion-sort/"
  },
  {
    "slug": "difference-array",
    "name": "差分数组 Difference Array",
    "category": "查找、排序与算法技巧",
    "summary": "区间更新只修改两个差分边界，最后通过前缀累加恢复完整数组。",
    "problem": "高效处理大量离线区间加法，再一次性生成更新后的数组。",
    "complexity": "O(1) 更新 / O(n) 恢复",
    "difficulty": "基础",
    "stage": 2,
    "tags": [
      "数组",
      "区间更新",
      "前缀和"
    ],
    "prerequisites": [
      "prefix-sum"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/difference-array/",
    "demo": "https://wuhy80.github.io/algorithm/difference-array/"
  },
  {
    "slug": "heap-sort",
    "name": "堆排序 Heap Sort",
    "category": "查找、排序与算法技巧",
    "summary": "最大堆构建、堆顶提取、向下调整及有序后缀增长",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [
      "heap-priority-queue"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/heap-sort/",
    "demo": "https://wuhy80.github.io/algorithm/heap-sort/"
  },
  {
    "slug": "binary-search",
    "name": "二分查找 Binary Search",
    "category": "查找、排序与算法技巧",
    "summary": "有序数组的左右边界持续收缩，中点比较与命中过程逐步高亮",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/binary-search/",
    "demo": "https://wuhy80.github.io/algorithm/binary-search/"
  },
  {
    "slug": "merge-sort",
    "name": "归并排序 Merge Sort",
    "category": "查找、排序与算法技巧",
    "summary": "数组递归拆分，左右有序段逐项比较并重新合并",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/merge-sort/",
    "demo": "https://wuhy80.github.io/algorithm/merge-sort/"
  },
  {
    "slug": "sliding-window",
    "name": "滑动窗口 Sliding Window",
    "category": "查找、排序与算法技巧",
    "summary": "固定窗口逐格滑动，复用移出与移入元素更新区间和",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/sliding-window/",
    "demo": "https://wuhy80.github.io/algorithm/sliding-window/"
  },
  {
    "slug": "radix-sort",
    "name": "基数排序 Radix Sort",
    "category": "查找、排序与算法技巧",
    "summary": "按当前数位稳定分桶并逐轮收集形成有序序列",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [
      "counting-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/radix-sort/",
    "demo": "https://wuhy80.github.io/algorithm/radix-sort/"
  },
  {
    "slug": "counting-sort",
    "name": "计数排序 Counting Sort",
    "category": "查找、排序与算法技巧",
    "summary": "频次统计、前缀累计和稳定回写输出数组",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/counting-sort/",
    "demo": "https://wuhy80.github.io/algorithm/counting-sort/"
  },
  {
    "slug": "quick-sort",
    "name": "快速排序 Quick Sort",
    "category": "查找、排序与算法技巧",
    "summary": "基准选择、双指针扫描、分区交换与递归区间展开",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/quick-sort/",
    "demo": "https://wuhy80.github.io/algorithm/quick-sort/"
  },
  {
    "slug": "quickselect",
    "name": "快速选择 Quickselect",
    "category": "查找、排序与算法技巧",
    "summary": "基准分区后只深入目标秩所在一侧，逐步锁定第 K 小元素",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [
      "quick-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/quickselect/",
    "demo": "https://wuhy80.github.io/algorithm/quickselect/"
  },
  {
    "slug": "bubble-sort",
    "name": "冒泡排序 Bubble Sort",
    "category": "查找、排序与算法技巧",
    "summary": "相邻元素逐对比较、交换，最大值逐轮浮向数组末端",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bubble-sort/",
    "demo": "https://wuhy80.github.io/algorithm/bubble-sort/"
  },
  {
    "slug": "prefix-sum",
    "name": "前缀和 Prefix Sum",
    "category": "查找、排序与算法技巧",
    "summary": "逐项建立前缀累计值，并用两个前缀值之差常数时间回答区间和。",
    "problem": "预处理静态数组，使大量区间求和查询从线性扫描降为常数时间。",
    "complexity": "O(n) 预处理 / O(1) 查询",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "预处理",
      "区间查询"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/prefix-sum/",
    "demo": "https://wuhy80.github.io/algorithm/prefix-sum/"
  },
  {
    "slug": "two-pointers",
    "name": "双指针 Two Pointers",
    "category": "查找、排序与算法技巧",
    "summary": "有序数组左右指针根据当前和单调收缩搜索区间",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/two-pointers/",
    "demo": "https://wuhy80.github.io/algorithm/two-pointers/"
  },
  {
    "slug": "reservoir-sampling",
    "name": "水塘抽样 Reservoir Sampling",
    "category": "查找、排序与算法技巧",
    "summary": "单遍读取数据流，以递减概率替换固定容量水塘中的随机位置。",
    "problem": "从未知长度或无法全部保存的数据流中等概率抽取 k 个样本。",
    "complexity": "O(n) 时间 / O(k) 空间",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "随机化",
      "流式算法",
      "抽样"
    ],
    "prerequisites": [
      "fisher-yates-shuffle"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/reservoir-sampling/",
    "demo": "https://wuhy80.github.io/algorithm/reservoir-sampling/"
  },
  {
    "slug": "bucket-sort",
    "name": "桶排序 Bucket Sort",
    "category": "查找、排序与算法技巧",
    "summary": "元素按值域分桶、桶内排序并依序合并输出",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [
      "counting-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bucket-sort/",
    "demo": "https://wuhy80.github.io/algorithm/bucket-sort/"
  },
  {
    "slug": "shell-sort",
    "name": "希尔排序 Shell Sort",
    "category": "查找、排序与算法技巧",
    "summary": "Gap 分组插入、远距离移动以及间隔逐步收缩",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [
      "insertion-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/shell-sort/",
    "demo": "https://wuhy80.github.io/algorithm/shell-sort/"
  },
  {
    "slug": "linear-search",
    "name": "线性查找 Linear Search",
    "category": "查找、排序与算法技巧",
    "summary": "探针从左向右逐项比较，并保留已扫描区域和最终命中位置",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/linear-search/",
    "demo": "https://wuhy80.github.io/algorithm/linear-search/"
  },
  {
    "slug": "selection-sort",
    "name": "选择排序 Selection Sort",
    "category": "查找、排序与算法技巧",
    "summary": "扫描未排序区间、记录最小值并交换到区间起点",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数组",
      "算法技巧"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/selection-sort/",
    "demo": "https://wuhy80.github.io/algorithm/selection-sort/"
  },
  {
    "slug": "fisher-yates-shuffle",
    "name": "Fisher-Yates 洗牌",
    "category": "查找、排序与算法技巧",
    "summary": "从尾到头在未固定区间均匀选择元素交换，使用种子复现每一步。",
    "problem": "在线性时间内生成每种排列等概率出现的无偏随机排列。",
    "complexity": "O(n)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "随机化",
      "数组",
      "原地算法"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/fisher-yates-shuffle/",
    "demo": "https://wuhy80.github.io/algorithm/fisher-yates-shuffle/"
  },
  {
    "slug": "floyd-cycle-detection",
    "name": "Floyd 快慢指针判环",
    "category": "查找、排序与算法技巧",
    "summary": "快慢指针在链表中以不同速度前进，相遇后同步定位环入口。",
    "problem": "以常数额外空间判断链表或状态转移序列是否存在环并找到入口。",
    "complexity": "O(n) 时间 / O(1) 空间",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "链表",
      "双指针",
      "判环"
    ],
    "prerequisites": [
      "linked-list",
      "two-pointers"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/floyd-cycle-detection/",
    "demo": "https://wuhy80.github.io/algorithm/floyd-cycle-detection/"
  },
  {
    "slug": "zero-one-bfs",
    "name": "0-1 BFS",
    "category": "图算法、网络流与回溯",
    "summary": "双端队列按边权把节点加入队首或队尾，逐边展示距离松弛。",
    "problem": "在线性时间内求只有 0/1 边权图的单源最短路。",
    "complexity": "O(V + E)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图",
      "最短路",
      "双端队列"
    ],
    "prerequisites": [
      "bfs",
      "deque"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/zero-one-bfs/",
    "demo": "https://wuhy80.github.io/algorithm/zero-one-bfs/"
  },
  {
    "slug": "two-sat",
    "name": "2-SAT",
    "category": "图算法、网络流与回溯",
    "summary": "将二元子句转成蕴含图，通过 Tarjan 强连通分量判定可满足性。",
    "problem": "判断每个子句最多含两个文字的布尔公式是否存在满足赋值。",
    "complexity": "O(V + E)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "图",
      "逻辑",
      "强连通分量"
    ],
    "prerequisites": [
      "tarjan-scc"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/two-sat/",
    "demo": "https://wuhy80.github.io/algorithm/two-sat/"
  },
  {
    "slug": "bipartite-matching",
    "name": "二分图最大匹配",
    "category": "图算法、网络流与回溯",
    "summary": "交替增广路径搜索与已有匹配重新安排",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/",
    "demo": "https://wuhy80.github.io/algorithm/bipartite-matching/"
  },
  {
    "slug": "bridges-articulation",
    "name": "割点与桥",
    "category": "图算法、网络流与回溯",
    "summary": "DFS 树回溯、Lowlink 更新及关键节点与边判定",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bridges-articulation/",
    "demo": "https://wuhy80.github.io/algorithm/bridges-articulation/"
  },
  {
    "slug": "bfs",
    "name": "广度优先搜索 BFS",
    "category": "图算法、网络流与回溯",
    "summary": "队列驱动搜索前沿逐层扩张，并重建起点到目标的最短步数路径",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bfs/",
    "demo": "https://wuhy80.github.io/algorithm/bfs/"
  },
  {
    "slug": "eulerian-path",
    "name": "欧拉路径 Eulerian Path",
    "category": "图算法、网络流与回溯",
    "summary": "Hierholzer 栈沿未使用边深入并在回退时构造完整路径",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/eulerian-path/",
    "demo": "https://wuhy80.github.io/algorithm/eulerian-path/"
  },
  {
    "slug": "dfs",
    "name": "深度优先搜索 DFS",
    "category": "图算法、网络流与回溯",
    "summary": "栈与递归路径持续深入，遇到末路后回退探索其他分支",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dfs/",
    "demo": "https://wuhy80.github.io/algorithm/dfs/"
  },
  {
    "slug": "bidirectional-bfs",
    "name": "双向 BFS Bidirectional BFS",
    "category": "图算法、网络流与回溯",
    "summary": "起点与终点两侧轮流扩张较小前沿，并在相遇后拼接最短路径。",
    "problem": "在无权图中降低长路径搜索所需扩展的状态数量。",
    "complexity": "O(b^(d/2))",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图",
      "搜索",
      "最短路"
    ],
    "prerequisites": [
      "bfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bidirectional-bfs/",
    "demo": "https://wuhy80.github.io/algorithm/bidirectional-bfs/"
  },
  {
    "slug": "topological-sort",
    "name": "拓扑排序 Topological Sort",
    "category": "图算法、网络流与回溯",
    "summary": "入度归零、队列变化、依赖边删除和有向环检测",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/topological-sort/",
    "demo": "https://wuhy80.github.io/algorithm/topological-sort/"
  },
  {
    "slug": "hungarian-algorithm",
    "name": "匈牙利算法 Hungarian",
    "category": "图算法、网络流与回溯",
    "summary": "成本矩阵行列归约、零元素覆盖与最优一一指派",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "bipartite-matching"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/hungarian-algorithm/",
    "demo": "https://wuhy80.github.io/algorithm/hungarian-algorithm/"
  },
  {
    "slug": "lowest-common-ancestor",
    "name": "最近公共祖先 LCA",
    "category": "图算法、网络流与回溯",
    "summary": "查询节点先对齐深度，再同步提升到最近公共祖先",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/lowest-common-ancestor/",
    "demo": "https://wuhy80.github.io/algorithm/lowest-common-ancestor/"
  },
  {
    "slug": "min-cost-max-flow",
    "name": "最小费用最大流",
    "category": "图算法、网络流与回溯",
    "summary": "最低费用增广路、瓶颈流量和累计费用同步更新",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "bellman-ford",
      "edmonds-karp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/min-cost-max-flow/",
    "demo": "https://wuhy80.github.io/algorithm/min-cost-max-flow/"
  },
  {
    "slug": "astar-pathfinding",
    "name": "A* 寻路 A* Pathfinding",
    "category": "图算法、网络流与回溯",
    "summary": "搜索前沿扩张、代价变化、障碍编辑与最终路径回溯",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "模拟"
    ],
    "prerequisites": [
      "dijkstra"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/astar-pathfinding/",
    "demo": "https://wuhy80.github.io/algorithm/astar-pathfinding/"
  },
  {
    "slug": "bellman-ford",
    "name": "Bellman-Ford 最短路径",
    "category": "图算法、网络流与回溯",
    "summary": "全边多轮松弛、负权边传播以及负权环检测",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "bfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bellman-ford/",
    "demo": "https://wuhy80.github.io/algorithm/bellman-ford/"
  },
  {
    "slug": "blossom-matching",
    "name": "Blossom 一般图匹配",
    "category": "图算法、网络流与回溯",
    "summary": "在交替森林中搜索增广路，遇到奇环时执行花缩并。",
    "problem": "在非二分一般图中寻找最大基数匹配。",
    "complexity": "O(V³)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图",
      "匹配",
      "奇环"
    ],
    "prerequisites": [
      "bipartite-matching"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/blossom-matching/",
    "demo": "https://wuhy80.github.io/algorithm/blossom-matching/"
  },
  {
    "slug": "boruvka-mst",
    "name": "Borůvka 最小生成树",
    "category": "图算法、网络流与回溯",
    "summary": "所有连通分量同时选择最轻出边，批量合并并构建最小生成树。",
    "problem": "为连通带权无向图寻找总权重最小的生成树。",
    "complexity": "O(E log V)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "图",
      "最小生成树",
      "并查集"
    ],
    "prerequisites": [
      "kruskal-mst",
      "union-find"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/boruvka-mst/",
    "demo": "https://wuhy80.github.io/algorithm/boruvka-mst/"
  },
  {
    "slug": "chu-liu-edmonds",
    "name": "Chu-Liu/Edmonds 有向最小生成树",
    "category": "图算法、网络流与回溯",
    "summary": "选择最轻入边并缩并有向环，通过重标边权继续构造根向最小树形图。",
    "problem": "在带根有向图中寻找覆盖所有可达节点的最小权重树形图。",
    "complexity": "O(VE)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "图",
      "有向生成树",
      "缩点"
    ],
    "prerequisites": [
      "kruskal-mst",
      "tarjan-scc"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/chu-liu-edmonds/",
    "demo": "https://wuhy80.github.io/algorithm/chu-liu-edmonds/"
  },
  {
    "slug": "dijkstra",
    "name": "Dijkstra 最短路径",
    "category": "图算法、网络流与回溯",
    "summary": "固定当前最短节点、逐边松弛距离并回溯最终路径",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dijkstra/",
    "demo": "https://wuhy80.github.io/algorithm/dijkstra/"
  },
  {
    "slug": "dinic",
    "name": "Dinic 最大流",
    "category": "图算法、网络流与回溯",
    "summary": "BFS 分层图、DFS 阻塞流与多路径增广过程",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "edmonds-karp",
      "bfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dinic/",
    "demo": "https://wuhy80.github.io/algorithm/dinic/"
  },
  {
    "slug": "edmonds-karp",
    "name": "Edmonds-Karp 最大流",
    "category": "图算法、网络流与回溯",
    "summary": "BFS 增广路径、瓶颈流量与残量网络更新",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "bfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/",
    "demo": "https://wuhy80.github.io/algorithm/edmonds-karp/"
  },
  {
    "slug": "floyd-warshall",
    "name": "Floyd-Warshall 全源最短路径",
    "category": "图算法、网络流与回溯",
    "summary": "逐个允许中转点并动态更新节点对距离矩阵",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dijkstra"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/floyd-warshall/",
    "demo": "https://wuhy80.github.io/algorithm/floyd-warshall/"
  },
  {
    "slug": "gomory-hu-tree",
    "name": "Gomory-Hu 全局割树",
    "category": "图算法、网络流与回溯",
    "summary": "执行 V-1 次最小割并调整父关系，用一棵树编码全部点对最小割。",
    "problem": "紧凑表示无向带权图任意两点之间的最小割值。",
    "complexity": "V-1 次最大流",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图",
      "最小割",
      "树"
    ],
    "prerequisites": [
      "stoer-wagner-min-cut",
      "dinic"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/gomory-hu-tree/",
    "demo": "https://wuhy80.github.io/algorithm/gomory-hu-tree/"
  },
  {
    "slug": "hopcroft-karp",
    "name": "Hopcroft-Karp 匹配",
    "category": "图算法、网络流与回溯",
    "summary": "交替图分层并在同一阶段扩展多条最短增广路",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "bipartite-matching",
      "bfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/hopcroft-karp/",
    "demo": "https://wuhy80.github.io/algorithm/hopcroft-karp/"
  },
  {
    "slug": "johnson-algorithm",
    "name": "Johnson 全源最短路",
    "category": "图算法、网络流与回溯",
    "summary": "Bellman-Ford 势能重标与逐源 Dijkstra 距离计算",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "bellman-ford",
      "dijkstra"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/johnson-algorithm/",
    "demo": "https://wuhy80.github.io/algorithm/johnson-algorithm/"
  },
  {
    "slug": "kruskal-mst",
    "name": "Kruskal 最小生成树",
    "category": "图算法、网络流与回溯",
    "summary": "按权重检查边，并用并查集接受或拒绝形成环的边",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "union-find"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/",
    "demo": "https://wuhy80.github.io/algorithm/kruskal-mst/"
  },
  {
    "slug": "prim-mst",
    "name": "Prim 最小生成树",
    "category": "图算法、网络流与回溯",
    "summary": "从树内节点向外扩张，每轮选择最轻割边",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dijkstra"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/prim-mst/",
    "demo": "https://wuhy80.github.io/algorithm/prim-mst/"
  },
  {
    "slug": "push-relabel",
    "name": "Push-Relabel 最大流",
    "category": "图算法、网络流与回溯",
    "summary": "维护预流、节点余量和高度标号，反复执行推流或重标。",
    "problem": "求容量网络从源点到汇点的最大可行流。",
    "complexity": "O(V²E)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图",
      "网络流",
      "预流"
    ],
    "prerequisites": [
      "dinic",
      "edmonds-karp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/push-relabel/",
    "demo": "https://wuhy80.github.io/algorithm/push-relabel/"
  },
  {
    "slug": "stoer-wagner-min-cut",
    "name": "Stoer-Wagner 全局最小割",
    "category": "图算法、网络流与回溯",
    "summary": "逐阶段执行最大邻接搜索，记录割权并缩并最后两个顶点。",
    "problem": "在无向带权图中寻找权重最小的全局割。",
    "complexity": "O(V³)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图",
      "最小割",
      "缩点"
    ],
    "prerequisites": [
      "edmonds-karp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/stoer-wagner-min-cut/",
    "demo": "https://wuhy80.github.io/algorithm/stoer-wagner-min-cut/"
  },
  {
    "slug": "tarjan-scc",
    "name": "Tarjan 强连通分量",
    "category": "图算法、网络流与回溯",
    "summary": "DFS 时间戳、Lowlink、栈变化与分量弹出着色",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/tarjan-scc/",
    "demo": "https://wuhy80.github.io/algorithm/tarjan-scc/"
  },
  {
    "slug": "tower-of-hanoi",
    "name": "汉诺塔 Tower of Hanoi",
    "category": "回溯、博弈与约束求解",
    "summary": "递归分解圆盘搬运，展示全部 2ⁿ-1 次合法移动",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/tower-of-hanoi/",
    "demo": "https://wuhy80.github.io/algorithm/tower-of-hanoi/"
  },
  {
    "slug": "knights-tour",
    "name": "骑士巡游 Knight's Tour",
    "category": "回溯、博弈与约束求解",
    "summary": "Warnsdorff 候选排序、骑士跳步与回溯撤销",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/knights-tour/",
    "demo": "https://wuhy80.github.io/algorithm/knights-tour/"
  },
  {
    "slug": "sudoku-backtracking",
    "name": "数独回溯 Sudoku Backtracking",
    "category": "回溯、博弈与约束求解",
    "summary": "候选数字尝试、约束冲突、错误分支撤销与完整解生成",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/sudoku-backtracking/",
    "demo": "https://wuhy80.github.io/algorithm/sudoku-backtracking/"
  },
  {
    "slug": "graph-coloring",
    "name": "图着色回溯 Graph Coloring",
    "category": "回溯、博弈与约束求解",
    "summary": "节点逐色尝试、相邻冲突判断与失败分支撤销",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/graph-coloring/",
    "demo": "https://wuhy80.github.io/algorithm/graph-coloring/"
  },
  {
    "slug": "dancing-links",
    "name": "舞蹈链 Dancing Links",
    "category": "回溯、博弈与约束求解",
    "summary": "精确覆盖矩阵选列、覆盖、恢复与 Algorithm X 解路径",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "图"
    ],
    "prerequisites": [
      "sudoku-backtracking"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dancing-links/",
    "demo": "https://wuhy80.github.io/algorithm/dancing-links/"
  },
  {
    "slug": "minimax-alpha-beta",
    "name": "Minimax 与 Alpha-Beta 剪枝",
    "category": "回溯、博弈与约束求解",
    "summary": "在 MAX/MIN 博弈树中回传效用，并在 α≥β 时跳过不可能影响结果的分支。",
    "problem": "在双人零和完全信息博弈中选择最优行动并减少需要评估的状态。",
    "complexity": "最坏 O(b^d)，理想剪枝 O(b^(d/2))",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "博弈树",
      "搜索",
      "剪枝"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/minimax-alpha-beta/",
    "demo": "https://wuhy80.github.io/algorithm/minimax-alpha-beta/"
  },
  {
    "slug": "n-queens",
    "name": "N 皇后 N-Queens",
    "category": "回溯、博弈与约束求解",
    "summary": "皇后逐行尝试摆放，冲突位置高亮并动态展示撤销回溯",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "图"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/n-queens/",
    "demo": "https://wuhy80.github.io/algorithm/n-queens/"
  },
  {
    "slug": "suffix-tree",
    "name": "后缀树 Suffix Tree",
    "category": "字符串算法",
    "summary": "把所有后缀插入压缩 Trie，在部分匹配位置切分边并共享公共前缀。",
    "problem": "用线性规模索引表示全部后缀，支持快速子串、重复和匹配查询。",
    "complexity": "演示构建 O(n²)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "字符串",
      "压缩Trie",
      "后缀结构"
    ],
    "prerequisites": [
      "suffix-array-lcp",
      "suffix-automaton"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/suffix-tree/",
    "demo": "https://wuhy80.github.io/algorithm/suffix-tree/"
  },
  {
    "slug": "suffix-array-lcp",
    "name": "后缀数组与 LCP",
    "category": "字符串算法",
    "summary": "倍增排序全部后缀并计算相邻后缀最长公共前缀",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [
      "merge-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/",
    "demo": "https://wuhy80.github.io/algorithm/suffix-array-lcp/"
  },
  {
    "slug": "suffix-automaton",
    "name": "后缀自动机 Suffix Automaton",
    "category": "字符串算法",
    "summary": "逐字符扩展状态、后缀链接与转移，必要时创建克隆状态。",
    "problem": "以线性规模结构表示一个字符串的全部子串并回答子串问题。",
    "complexity": "O(n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "字符串",
      "自动机",
      "DAG"
    ],
    "prerequisites": [
      "trie",
      "kmp-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/suffix-automaton/",
    "demo": "https://wuhy80.github.io/algorithm/suffix-automaton/"
  },
  {
    "slug": "palindromic-tree",
    "name": "回文树 Eertree",
    "category": "字符串算法",
    "summary": "每个节点表示一种不同回文，动态维护最长回文后缀链接。",
    "problem": "在线性时间枚举和统计字符串中的所有不同回文子串。",
    "complexity": "O(n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "字符串",
      "回文",
      "树"
    ],
    "prerequisites": [
      "manacher",
      "trie"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/palindromic-tree/",
    "demo": "https://wuhy80.github.io/algorithm/palindromic-tree/"
  },
  {
    "slug": "regex-matching",
    "name": "正则匹配 DP",
    "category": "字符串算法",
    "summary": "二维状态处理普通字符、点通配符与星号重复规则",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [
      "edit-distance"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/regex-matching/",
    "demo": "https://wuhy80.github.io/algorithm/regex-matching/"
  },
  {
    "slug": "aho-corasick",
    "name": "Aho-Corasick 多模式匹配",
    "category": "字符串算法",
    "summary": "Trie 插入、失败指针建立以及一次文本扫描中的多模式命中",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [
      "trie",
      "kmp-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/aho-corasick/",
    "demo": "https://wuhy80.github.io/algorithm/aho-corasick/"
  },
  {
    "slug": "booth-minimum-rotation",
    "name": "Booth 最小表示法",
    "category": "字符串算法",
    "summary": "在双倍字符串中比较两个候选起点，一次失配排除一整段候选。",
    "problem": "在线性时间寻找循环字符串的字典序最小旋转表示。",
    "complexity": "O(n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "字符串",
      "循环表示",
      "双指针"
    ],
    "prerequisites": [
      "kmp-search",
      "two-pointers"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/booth-minimum-rotation/",
    "demo": "https://wuhy80.github.io/algorithm/booth-minimum-rotation/"
  },
  {
    "slug": "boyer-moore",
    "name": "Boyer-Moore 字符串匹配",
    "category": "字符串算法",
    "summary": "从模式串尾部比较，坏字符失配时跨越无效对齐",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [
      "linear-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/boyer-moore/",
    "demo": "https://wuhy80.github.io/algorithm/boyer-moore/"
  },
  {
    "slug": "kmp-search",
    "name": "KMP 字符串匹配",
    "category": "字符串算法",
    "summary": "构建 LPS 前缀表，失配时移动模式串而不回退文本指针",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/kmp-search/",
    "demo": "https://wuhy80.github.io/algorithm/kmp-search/"
  },
  {
    "slug": "manacher",
    "name": "Manacher 最长回文",
    "category": "字符串算法",
    "summary": "分隔符变换、镜像半径复用与最长回文区间扩展",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [
      "sliding-window"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/manacher/",
    "demo": "https://wuhy80.github.io/algorithm/manacher/"
  },
  {
    "slug": "rabin-karp",
    "name": "Rabin-Karp 字符串匹配",
    "category": "字符串算法",
    "summary": "文本窗口滑动、滚动哈希更新和哈希碰撞校验",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/rabin-karp/",
    "demo": "https://wuhy80.github.io/algorithm/rabin-karp/"
  },
  {
    "slug": "z-algorithm",
    "name": "Z 算法 Z Algorithm",
    "category": "字符串算法",
    "summary": "维护最右 Z Box，复用镜像结果计算全部前缀匹配长度",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串"
    ],
    "prerequisites": [
      "kmp-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/z-algorithm/",
    "demo": "https://wuhy80.github.io/algorithm/z-algorithm/"
  },
  {
    "slug": "knapsack-dp",
    "name": "0/1 背包 Knapsack",
    "category": "动态规划与序列",
    "summary": "状态表逐格比较选与不选，并回溯最优物品组合",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/",
    "demo": "https://wuhy80.github.io/algorithm/knapsack-dp/"
  },
  {
    "slug": "edit-distance",
    "name": "编辑距离 Edit Distance",
    "category": "动态规划与序列",
    "summary": "插入、删除、替换状态转移与最优编辑路径回溯",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/edit-distance/",
    "demo": "https://wuhy80.github.io/algorithm/edit-distance/"
  },
  {
    "slug": "weighted-interval-scheduling",
    "name": "带权区间调度",
    "category": "动态规划与序列",
    "summary": "兼容前驱查找、选择/跳过比较和最优任务集合回溯",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "activity-selection"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/weighted-interval-scheduling/",
    "demo": "https://wuhy80.github.io/algorithm/weighted-interval-scheduling/"
  },
  {
    "slug": "matrix-chain-multiplication",
    "name": "矩阵链乘法",
    "category": "动态规划与序列",
    "summary": "区间长度递增、断点枚举和最少标量乘法代价更新",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "knapsack-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/matrix-chain-multiplication/",
    "demo": "https://wuhy80.github.io/algorithm/matrix-chain-multiplication/"
  },
  {
    "slug": "coin-change",
    "name": "零钱兑换 Coin Change",
    "category": "动态规划与序列",
    "summary": "金额状态从更小金额转移并记录最少硬币数",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/coin-change/",
    "demo": "https://wuhy80.github.io/algorithm/coin-change/"
  },
  {
    "slug": "traveling-salesman-bitmask",
    "name": "旅行商位压 DP",
    "category": "动态规划与序列",
    "summary": "已访问城市位掩码、终点状态扩展与最短回路重建",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "knapsack-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/traveling-salesman-bitmask/",
    "demo": "https://wuhy80.github.io/algorithm/traveling-salesman-bitmask/"
  },
  {
    "slug": "tree-dp",
    "name": "树形 DP Tree DP",
    "category": "动态规划与序列",
    "summary": "后序合并子树的不选/选择状态并求最大权独立集",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/tree-dp/",
    "demo": "https://wuhy80.github.io/algorithm/tree-dp/"
  },
  {
    "slug": "digit-dp",
    "name": "数位 DP Digit DP",
    "category": "动态规划与序列",
    "summary": "上界约束、数位状态分支和记忆化计数表更新",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "knapsack-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/digit-dp/",
    "demo": "https://wuhy80.github.io/algorithm/digit-dp/"
  },
  {
    "slug": "subset-sum",
    "name": "子集和 Subset Sum",
    "category": "动态规划与序列",
    "summary": "逐元素从高到低更新可达和并判断目标状态",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "knapsack-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/subset-sum/",
    "demo": "https://wuhy80.github.io/algorithm/subset-sum/"
  },
  {
    "slug": "longest-increasing-subsequence",
    "name": "最长递增子序列 LIS",
    "category": "动态规划与序列",
    "summary": "最小尾值数组、二分替换和递增子序列重建",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "binary-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/longest-increasing-subsequence/",
    "demo": "https://wuhy80.github.io/algorithm/longest-increasing-subsequence/"
  },
  {
    "slug": "longest-common-subsequence",
    "name": "最长公共子序列 LCS",
    "category": "动态规划与序列",
    "summary": "二维状态表填充并沿最优路径回溯公共子序列",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [
      "edit-distance"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/longest-common-subsequence/",
    "demo": "https://wuhy80.github.io/algorithm/longest-common-subsequence/"
  },
  {
    "slug": "kadane",
    "name": "Kadane 最大子数组",
    "category": "动态规划与序列",
    "summary": "在重新开始和延续前缀间选择，持续更新最大连续和",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "动态规划"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/kadane/",
    "demo": "https://wuhy80.github.io/algorithm/kadane/"
  },
  {
    "slug": "fractional-knapsack",
    "name": "分数背包 Fractional Knapsack",
    "category": "贪心、调度与编码",
    "summary": "按单位重量价值排序，动态展示完整装入与最后一个物品的分数装入。",
    "problem": "在允许拆分物品时，让有限容量背包获得最大总价值。",
    "complexity": "O(n log n)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "贪心",
      "背包",
      "排序"
    ],
    "prerequisites": [
      "activity-selection"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/fractional-knapsack/",
    "demo": "https://wuhy80.github.io/algorithm/fractional-knapsack/"
  },
  {
    "slug": "activity-selection",
    "name": "活动选择 Activity Selection",
    "category": "贪心、调度与编码",
    "summary": "按结束时间排序并选择互不冲突的活动，动态展示候选判断与已选集合。",
    "problem": "从一组起止时间已知的活动中选择数量最多的互不重叠活动。",
    "complexity": "O(n log n)",
    "difficulty": "基础",
    "stage": 2,
    "tags": [
      "贪心",
      "区间",
      "调度"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/activity-selection/",
    "demo": "https://wuhy80.github.io/algorithm/activity-selection/"
  },
  {
    "slug": "interval-covering",
    "name": "区间覆盖 Interval Covering",
    "category": "贪心、调度与编码",
    "summary": "每轮从可衔接区间中选择右端点最远者，展示覆盖边界推进与缺口。",
    "problem": "使用尽量少的给定区间完整覆盖目标范围。",
    "complexity": "O(n log n)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "贪心",
      "区间",
      "覆盖"
    ],
    "prerequisites": [
      "activity-selection"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/interval-covering/",
    "demo": "https://wuhy80.github.io/algorithm/interval-covering/"
  },
  {
    "slug": "job-sequencing",
    "name": "任务序列调度 Job Sequencing",
    "category": "贪心、调度与编码",
    "summary": "按收益降序把任务放入截止期限前最晚空闲时隙。",
    "problem": "在单位时长和截止期限约束下安排任务，使总收益最大。",
    "complexity": "O(n²)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "贪心",
      "调度",
      "截止期限"
    ],
    "prerequisites": [
      "activity-selection"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/job-sequencing/",
    "demo": "https://wuhy80.github.io/algorithm/job-sequencing/"
  },
  {
    "slug": "stable-marriage",
    "name": "稳定婚姻匹配 Gale-Shapley",
    "category": "贪心、调度与编码",
    "summary": "自由提议者依偏好提议，接收者始终保留当前更偏好的匹配。",
    "problem": "为两组带偏好顺序的参与者寻找不存在阻塞对的稳定匹配。",
    "complexity": "O(n²)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "贪心",
      "匹配",
      "偏好"
    ],
    "prerequisites": [
      "bipartite-matching"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/stable-marriage/",
    "demo": "https://wuhy80.github.io/algorithm/stable-marriage/"
  },
  {
    "slug": "union-find",
    "name": "并查集 Union-Find",
    "category": "数据结构",
    "summary": "父指针查找、按秩合并、路径压缩和连通性判断",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/union-find/",
    "demo": "https://wuhy80.github.io/algorithm/union-find/"
  },
  {
    "slug": "monotonic-stack-queue",
    "name": "单调栈 Monotonic Stack",
    "category": "数据结构",
    "summary": "递减栈进出过程与右侧首个更大值确定",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "stack",
      "deque"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/monotonic-stack-queue/",
    "demo": "https://wuhy80.github.io/algorithm/monotonic-stack-queue/"
  },
  {
    "slug": "cartesian-tree",
    "name": "笛卡尔树 Cartesian Tree",
    "category": "数据结构",
    "summary": "单调栈维护右脊，使中序次序等于原数组且节点同时满足最小堆序。",
    "problem": "把序列顺序与堆优先级结合，用于 RMQ、区间结构和后缀算法。",
    "complexity": "O(n) 构建",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "树",
      "单调栈",
      "RMQ"
    ],
    "prerequisites": [
      "monotonic-stack-queue"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/cartesian-tree/",
    "demo": "https://wuhy80.github.io/algorithm/cartesian-tree/"
  },
  {
    "slug": "heap-priority-queue",
    "name": "堆与优先队列 Heap",
    "category": "数据结构",
    "summary": "插入上浮、提取堆顶和替换后的向下调整",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/",
    "demo": "https://wuhy80.github.io/algorithm/heap-priority-queue/"
  },
  {
    "slug": "queue",
    "name": "队列 Queue",
    "category": "数据结构",
    "summary": "循环数组中的入队、出队以及 Head / Tail 指针移动",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/queue/",
    "demo": "https://wuhy80.github.io/algorithm/queue/"
  },
  {
    "slug": "binary-search-tree",
    "name": "二叉搜索树 Binary Search Tree",
    "category": "数据结构",
    "summary": "插入与查找路径逐层下降，删除后树结构重新连接",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/",
    "demo": "https://wuhy80.github.io/algorithm/binary-search-tree/"
  },
  {
    "slug": "hash-table",
    "name": "哈希表 Hash Table",
    "category": "数据结构",
    "summary": "哈希定位、碰撞链扫描以及键值插入、查找和删除",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/hash-table/",
    "demo": "https://wuhy80.github.io/algorithm/hash-table/"
  },
  {
    "slug": "red-black-tree",
    "name": "红黑树 Red-Black Tree",
    "category": "数据结构",
    "summary": "插入后的颜色修复、叔节点判断及左右旋转",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "avl-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/red-black-tree/",
    "demo": "https://wuhy80.github.io/algorithm/red-black-tree/"
  },
  {
    "slug": "persistent-segment-tree",
    "name": "可持久化线段树",
    "category": "数据结构",
    "summary": "新旧版本路径复制、未修改子树共享与区间和比较",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "segment-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/persistent-segment-tree/",
    "demo": "https://wuhy80.github.io/algorithm/persistent-segment-tree/"
  },
  {
    "slug": "lazy-segment-tree",
    "name": "懒标记线段树",
    "category": "数据结构",
    "summary": "区间递归覆盖、懒标记暂存和节点区间和更新",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "segment-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/lazy-segment-tree/",
    "demo": "https://wuhy80.github.io/algorithm/lazy-segment-tree/"
  },
  {
    "slug": "linked-list",
    "name": "链表 Linked List",
    "category": "数据结构",
    "summary": "节点插入、删除、查找与 next 指针重新连接",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/linked-list/",
    "demo": "https://wuhy80.github.io/algorithm/linked-list/"
  },
  {
    "slug": "interval-tree",
    "name": "区间树 Interval Tree",
    "category": "数据结构",
    "summary": "按中心点划分区间，查询时剪去不可能与目标相交的子树。",
    "problem": "高效报告与给定点或范围重叠的全部区间。",
    "complexity": "O(n log n) 构建 / O(log n+k) 查询",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "树",
      "区间查询",
      "空间索引"
    ],
    "prerequisites": [
      "binary-search-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/interval-tree/",
    "demo": "https://wuhy80.github.io/algorithm/interval-tree/"
  },
  {
    "slug": "splay-tree",
    "name": "伸展树 Splay Tree",
    "category": "数据结构",
    "summary": "Zig、Zig-Zig、Zig-Zag 旋转把访问目标提升到根",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "binary-search-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/splay-tree/",
    "demo": "https://wuhy80.github.io/algorithm/splay-tree/"
  },
  {
    "slug": "fenwick-tree",
    "name": "树状数组 Fenwick Tree",
    "category": "数据结构",
    "summary": "lowbit 覆盖范围以及查询、更新索引的跳转路径",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "binary-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/fenwick-tree/",
    "demo": "https://wuhy80.github.io/algorithm/fenwick-tree/"
  },
  {
    "slug": "deque",
    "name": "双端队列 Deque",
    "category": "数据结构",
    "summary": "队首与队尾的插入删除操作及边界元素变化",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/deque/",
    "demo": "https://wuhy80.github.io/algorithm/deque/"
  },
  {
    "slug": "skip-list",
    "name": "跳表 Skip List",
    "category": "数据结构",
    "summary": "多层稀疏索引插入、向右跳跃与逐层下降查找",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "linked-list"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/skip-list/",
    "demo": "https://wuhy80.github.io/algorithm/skip-list/"
  },
  {
    "slug": "sparse-table",
    "name": "稀疏表 Sparse Table",
    "category": "数据结构",
    "summary": "2 的幂次区间预处理以及双区间块常数时间查询",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "binary-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/sparse-table/",
    "demo": "https://wuhy80.github.io/algorithm/sparse-table/"
  },
  {
    "slug": "segment-tree",
    "name": "线段树 Segment Tree",
    "category": "数据结构",
    "summary": "区间递归分解、完整覆盖节点选择和单点更新传播",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "binary-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/segment-tree/",
    "demo": "https://wuhy80.github.io/algorithm/segment-tree/"
  },
  {
    "slug": "stack",
    "name": "栈 Stack",
    "category": "数据结构",
    "summary": "元素压栈、出栈、查看栈顶以及 Overflow / Underflow 状态",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/stack/",
    "demo": "https://wuhy80.github.io/algorithm/stack/"
  },
  {
    "slug": "avl-tree",
    "name": "AVL 平衡树",
    "category": "数据结构",
    "summary": "插入后计算平衡因子，通过 LL、RR、LR、RL 旋转恢复平衡",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "binary-search-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/avl-tree/",
    "demo": "https://wuhy80.github.io/algorithm/avl-tree/"
  },
  {
    "slug": "b-tree",
    "name": "B 树 B-Tree",
    "category": "数据结构",
    "summary": "多键节点插入、满节点分裂和中间键向上提升",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "binary-search-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/b-tree/",
    "demo": "https://wuhy80.github.io/algorithm/b-tree/"
  },
  {
    "slug": "b-plus-tree",
    "name": "B+ 树 B+ Tree",
    "category": "数据结构",
    "summary": "叶节点插入分裂、父级分隔键和叶链连接",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "b-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/b-plus-tree/",
    "demo": "https://wuhy80.github.io/algorithm/b-plus-tree/"
  },
  {
    "slug": "bloom-filter",
    "name": "Bloom Filter",
    "category": "数据结构",
    "summary": "多哈希映射、位数组置位和概率成员查询",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "hash-table"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bloom-filter/",
    "demo": "https://wuhy80.github.io/algorithm/bloom-filter/"
  },
  {
    "slug": "lru-cache",
    "name": "LRU 缓存",
    "category": "数据结构",
    "summary": "访问命中、最近使用顺序移动与容量淘汰",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "hash-table",
      "linked-list"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/lru-cache/",
    "demo": "https://wuhy80.github.io/algorithm/lru-cache/"
  },
  {
    "slug": "treap",
    "name": "Treap 随机平衡树",
    "category": "数据结构",
    "summary": "BST 插入、随机优先级比较与旋转恢复堆序",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [
      "binary-search-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/treap/",
    "demo": "https://wuhy80.github.io/algorithm/treap/"
  },
  {
    "slug": "trie",
    "name": "Trie 前缀树",
    "category": "数据结构",
    "summary": "字符路径共享、单词终点、插入、查找、删除及前缀判断",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数据结构"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/trie/",
    "demo": "https://wuhy80.github.io/algorithm/trie/"
  },
  {
    "slug": "centroid-decomposition",
    "name": "点分治 Centroid Decomposition",
    "category": "高级查询与树分解",
    "summary": "反复寻找重心、移除重心并递归处理各个剩余连通块。",
    "problem": "将树分层分解为深度 O(log n) 的重心树以处理全局路径问题。",
    "complexity": "O(n log n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "树",
      "分治",
      "重心"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/centroid-decomposition/",
    "demo": "https://wuhy80.github.io/algorithm/centroid-decomposition/"
  },
  {
    "slug": "rollback-union-find",
    "name": "可回滚并查集 Rollback DSU",
    "category": "高级查询与树分解",
    "summary": "记录每次合并修改，通过快照按相反顺序恢复父节点与集合大小。",
    "problem": "支持撤销合并操作，服务离线动态连通性和分治搜索。",
    "complexity": "O(log n) 合并 / O(1) 单步回滚",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "并查集",
      "回滚",
      "动态连通性"
    ],
    "prerequisites": [
      "union-find"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/rollback-union-find/",
    "demo": "https://wuhy80.github.io/algorithm/rollback-union-find/"
  },
  {
    "slug": "mo-algorithm",
    "name": "莫队算法 Mo’s Algorithm",
    "category": "高级查询与树分解",
    "summary": "分块重排离线区间查询，展示左右指针增删元素和答案维护。",
    "problem": "在可快速增删元素时批量回答静态数组的离线区间查询。",
    "complexity": "O((n + q)√n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "离线算法",
      "分块",
      "区间查询"
    ],
    "prerequisites": [
      "sqrt-decomposition"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/mo-algorithm/",
    "demo": "https://wuhy80.github.io/algorithm/mo-algorithm/"
  },
  {
    "slug": "sqrt-decomposition",
    "name": "平方根分解 Sqrt Decomposition",
    "category": "高级查询与树分解",
    "summary": "数组按约 √n 大小分块，整块聚合与边缘扫描共同完成查询。",
    "problem": "以简单分块支持数组区间查询和单点更新。",
    "complexity": "O(√n) 每次操作",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数据结构",
      "分块",
      "区间查询"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/",
    "demo": "https://wuhy80.github.io/algorithm/sqrt-decomposition/"
  },
  {
    "slug": "heavy-light-decomposition",
    "name": "重链剖分 Heavy-Light Decomposition",
    "category": "高级查询与树分解",
    "summary": "按最大子树划分重链，并把树上路径拆成少量连续区间求和。",
    "problem": "把树路径查询转化为对数数量的序列区间查询。",
    "complexity": "O(n) 预处理 / O(log² n) 查询",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "树",
      "分解",
      "路径查询"
    ],
    "prerequisites": [
      "lowest-common-ancestor",
      "segment-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/heavy-light-decomposition/",
    "demo": "https://wuhy80.github.io/algorithm/heavy-light-decomposition/"
  },
  {
    "slug": "euler-tour-tree",
    "name": "Euler Tour Tree",
    "category": "高级查询与树分解",
    "summary": "把树的进入/退出事件存入隐式 Treap，通过序列切分合并移动整棵子树。",
    "problem": "在动态森林中支持子树剪切、重新连接、连通性和聚合查询。",
    "complexity": "每次操作 O(log n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "动态树",
      "欧拉序",
      "隐式Treap"
    ],
    "prerequisites": [
      "treap",
      "tree-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/euler-tour-tree/",
    "demo": "https://wuhy80.github.io/algorithm/euler-tour-tree/"
  },
  {
    "slug": "link-cut-tree",
    "name": "Link-Cut Tree",
    "category": "高级查询与树分解",
    "summary": "通过 Access、Makeroot 与 Splay 动态维护首选路径和路径聚合值。",
    "problem": "在动态森林中以对数摊还时间支持连接、断边和路径查询。",
    "complexity": "每次操作摊还 O(log n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "动态树",
      "Splay",
      "路径查询"
    ],
    "prerequisites": [
      "splay-tree",
      "heavy-light-decomposition"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/link-cut-tree/",
    "demo": "https://wuhy80.github.io/algorithm/link-cut-tree/"
  },
  {
    "slug": "wavelet-matrix",
    "name": "Wavelet Matrix",
    "category": "高级查询与树分解",
    "summary": "逐位稳定划分数列并映射查询区间，演示范围第 K 小的下降过程。",
    "problem": "在静态整数序列上高效完成区间第 K 小、频次和秩查询。",
    "complexity": "O(log σ) 每次查询",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "数据结构",
      "位运算",
      "秩查询"
    ],
    "prerequisites": [
      "merge-sort",
      "sqrt-decomposition"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/wavelet-matrix/",
    "demo": "https://wuhy80.github.io/algorithm/wavelet-matrix/"
  },
  {
    "slug": "octree",
    "name": "八叉树 Octree",
    "category": "空间数据结构",
    "summary": "容量超限的三维立方体沿三个坐标轴同时二分，递归形成八个子体素。",
    "problem": "索引三维点云、体素与空间对象，并剪枝范围和邻近查询。",
    "complexity": "平均 O(log n) 插入与查询",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "空间索引",
      "三维",
      "点云"
    ],
    "prerequisites": [
      "quadtree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/octree/",
    "demo": "https://wuhy80.github.io/algorithm/octree/"
  },
  {
    "slug": "quadtree",
    "name": "四叉树 Quadtree",
    "category": "空间数据结构",
    "summary": "二维区域递归四分、点插入和矩形范围查询",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "空间索引"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/quadtree/",
    "demo": "https://wuhy80.github.io/algorithm/quadtree/"
  },
  {
    "slug": "bounding-volume-hierarchy",
    "name": "BVH 层次包围盒",
    "category": "空间数据结构",
    "summary": "按最长轴中分对象并递归建立包围盒，查询时跳过不相交分支。",
    "problem": "加速光线追踪、碰撞检测和空间范围查询。",
    "complexity": "O(n log n) 构建",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "空间索引",
      "包围盒",
      "碰撞检测"
    ],
    "prerequisites": [
      "kd-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bounding-volume-hierarchy/",
    "demo": "https://wuhy80.github.io/algorithm/bounding-volume-hierarchy/"
  },
  {
    "slug": "kd-tree",
    "name": "KD 树 K-D Tree",
    "category": "空间数据结构",
    "summary": "交替坐标轴中位划分、最近邻搜索与空间剪枝",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "空间索引"
    ],
    "prerequisites": [
      "binary-search-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/kd-tree/",
    "demo": "https://wuhy80.github.io/algorithm/kd-tree/"
  },
  {
    "slug": "r-tree",
    "name": "R 树 R-Tree",
    "category": "空间数据结构",
    "summary": "空间矩形插入、最小包围盒分组和范围查询",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "空间索引"
    ],
    "prerequisites": [
      "b-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/r-tree/",
    "demo": "https://wuhy80.github.io/algorithm/r-tree/"
  },
  {
    "slug": "half-plane-intersection",
    "name": "半平面交 Half-Plane Intersection",
    "category": "计算几何",
    "summary": "逐个用线性不等式边界裁剪凸多边形，保留可行区域并生成交点。",
    "problem": "求多个线性半平面的公共凸区域及其面积。",
    "complexity": "增量裁剪 O(hv)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "计算几何",
      "凸多边形",
      "裁剪"
    ],
    "prerequisites": [
      "convex-hull",
      "point-in-polygon"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/half-plane-intersection/",
    "demo": "https://wuhy80.github.io/algorithm/half-plane-intersection/"
  },
  {
    "slug": "point-in-polygon",
    "name": "点在多边形内",
    "category": "计算几何",
    "summary": "水平射线逐边求交并按交点奇偶实时判定",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "计算几何"
    ],
    "prerequisites": [
      "convex-hull"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/point-in-polygon/",
    "demo": "https://wuhy80.github.io/algorithm/point-in-polygon/"
  },
  {
    "slug": "sweep-line-intersection",
    "name": "扫描线线段交点",
    "category": "计算几何",
    "summary": "端点事件、活动线段集合与交点逐步发现",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "计算几何"
    ],
    "prerequisites": [
      "heap-priority-queue"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/sweep-line-intersection/",
    "demo": "https://wuhy80.github.io/algorithm/sweep-line-intersection/"
  },
  {
    "slug": "convex-hull",
    "name": "凸包 Convex Hull",
    "category": "计算几何",
    "summary": "按坐标排序、叉积判断、栈弹出及上下凸包合并",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "计算几何"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/convex-hull/",
    "demo": "https://wuhy80.github.io/algorithm/convex-hull/"
  },
  {
    "slug": "rotating-calipers",
    "name": "旋转卡壳 Rotating Calipers",
    "category": "计算几何",
    "summary": "凸包边与对踵点同步推进并求最远点对",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "计算几何"
    ],
    "prerequisites": [
      "convex-hull"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/rotating-calipers/",
    "demo": "https://wuhy80.github.io/algorithm/rotating-calipers/"
  },
  {
    "slug": "closest-pair",
    "name": "最近点对 Closest Pair",
    "category": "计算几何",
    "summary": "点集分治、中线条带候选和最近距离持续收缩",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "计算几何"
    ],
    "prerequisites": [
      "merge-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/closest-pair/",
    "demo": "https://wuhy80.github.io/algorithm/closest-pair/"
  },
  {
    "slug": "delaunay-triangulation",
    "name": "Delaunay 三角剖分",
    "category": "计算几何",
    "summary": "新点插入、坏三角形移除与空腔边界重建",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "计算几何"
    ],
    "prerequisites": [
      "convex-hull"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/delaunay-triangulation/",
    "demo": "https://wuhy80.github.io/algorithm/delaunay-triangulation/"
  },
  {
    "slug": "voronoi-relaxation",
    "name": "Voronoi 与 Lloyd 松弛",
    "category": "计算几何",
    "summary": "泰森多边形随控制点移动，并逐步趋向均匀分布",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "计算几何"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/voronoi-relaxation/",
    "demo": "https://wuhy80.github.io/algorithm/voronoi-relaxation/"
  },
  {
    "slug": "sieve-of-eratosthenes",
    "name": "埃拉托斯特尼筛法",
    "category": "数论、变换与线性代数",
    "summary": "当前质数选取、倍数标记与质数集合逐步收敛",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数学"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/",
    "demo": "https://wuhy80.github.io/algorithm/sieve-of-eratosthenes/"
  },
  {
    "slug": "segmented-sieve",
    "name": "分段筛 Segmented Sieve",
    "category": "数论、变换与线性代数",
    "summary": "先生成 √R 内基础质数，再仅标记目标区间中的对应倍数。",
    "problem": "在不保存 1 到 R 全部状态的情况下筛选大区间内的质数。",
    "complexity": "O((R-L+1) log log R)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数论",
      "素数",
      "筛法"
    ],
    "prerequisites": [
      "sieve-of-eratosthenes"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/segmented-sieve/",
    "demo": "https://wuhy80.github.io/algorithm/segmented-sieve/"
  },
  {
    "slug": "fourier-epicycles",
    "name": "傅里叶旋轮 Fourier Epicycles",
    "category": "数论、变换与线性代数",
    "summary": "多级旋转向量逐步重建并绘制复杂轮廓",
    "difficulty": "进阶",
    "stage": 3,
    "tags": [
      "模拟"
    ],
    "prerequisites": [
      "fft"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/fourier-epicycles/",
    "demo": "https://wuhy80.github.io/algorithm/fourier-epicycles/"
  },
  {
    "slug": "gaussian-elimination",
    "name": "高斯消元 Gaussian Elimination",
    "category": "数论、变换与线性代数",
    "summary": "通过部分选主元、行归一化和逐列消元得到行最简形与唯一解。",
    "problem": "求解线性方程组、计算秩并判断解的存在性。",
    "complexity": "O(n³)",
    "difficulty": "进阶",
    "stage": 3,
    "tags": [
      "线性代数",
      "矩阵",
      "方程组"
    ],
    "prerequisites": [
      "matrix-exponentiation"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/gaussian-elimination/",
    "demo": "https://wuhy80.github.io/algorithm/gaussian-elimination/"
  },
  {
    "slug": "matrix-exponentiation",
    "name": "矩阵快速幂 Matrix Exponentiation",
    "category": "数论、变换与线性代数",
    "summary": "按指数二进制位重复平方方阵，并在置位时乘入结果矩阵。",
    "problem": "快速计算高次矩阵幂以及线性递推的第 n 项。",
    "complexity": "O(k³ log n)",
    "difficulty": "进阶",
    "stage": 3,
    "tags": [
      "矩阵",
      "快速幂",
      "线性递推"
    ],
    "prerequisites": [
      "modular-exponentiation"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/matrix-exponentiation/",
    "demo": "https://wuhy80.github.io/algorithm/matrix-exponentiation/"
  },
  {
    "slug": "fft",
    "name": "快速傅里叶变换 FFT",
    "category": "数论、变换与线性代数",
    "summary": "位逆序排列、分层蝶形合并和频域幅度生成",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "数学"
    ],
    "prerequisites": [
      "matrix-exponentiation"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/fft/",
    "demo": "https://wuhy80.github.io/algorithm/fft/"
  },
  {
    "slug": "modular-exponentiation",
    "name": "快速模幂 Modular Exponentiation",
    "category": "数论、变换与线性代数",
    "summary": "指数二进制位读取、底数平方和模结果累积",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数学"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/",
    "demo": "https://wuhy80.github.io/algorithm/modular-exponentiation/"
  },
  {
    "slug": "extended-euclidean",
    "name": "扩展欧几里得 Extended Euclidean",
    "category": "数论、变换与线性代数",
    "summary": "求余迭代同时更新 Bézout 系数，持续验证线性组合恒等式。",
    "problem": "同时求 gcd(a,b) 及满足 ax+by=gcd(a,b) 的整数系数。",
    "complexity": "O(log min(a,b))",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数论",
      "最大公约数",
      "模逆"
    ],
    "prerequisites": [
      "euclidean-algorithm"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/extended-euclidean/",
    "demo": "https://wuhy80.github.io/algorithm/extended-euclidean/"
  },
  {
    "slug": "euclidean-algorithm",
    "name": "欧几里得算法 Euclidean",
    "category": "数论、变换与线性代数",
    "summary": "商余数等式迭代、参数替换和最大公约数收敛",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数学"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/euclidean-algorithm/",
    "demo": "https://wuhy80.github.io/algorithm/euclidean-algorithm/"
  },
  {
    "slug": "euler-totient",
    "name": "欧拉函数筛 Totient",
    "category": "数论、变换与线性代数",
    "summary": "质数识别、倍数 φ 值批量更新与目标结果收敛",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数学"
    ],
    "prerequisites": [
      "sieve-of-eratosthenes"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/euler-totient/",
    "demo": "https://wuhy80.github.io/algorithm/euler-totient/"
  },
  {
    "slug": "linear-sieve",
    "name": "欧拉线性筛 Linear Sieve",
    "category": "数论、变换与线性代数",
    "summary": "记录最小质因子，让每个合数仅被筛除一次。",
    "problem": "在线性时间生成给定上限内全部质数及每个整数的最小质因子。",
    "complexity": "O(n)",
    "difficulty": "基础",
    "stage": 2,
    "tags": [
      "数论",
      "质数",
      "筛法"
    ],
    "prerequisites": [
      "sieve-of-eratosthenes"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/linear-sieve/",
    "demo": "https://wuhy80.github.io/algorithm/linear-sieve/"
  },
  {
    "slug": "ntt",
    "name": "数论变换 NTT",
    "category": "数论、变换与线性代数",
    "summary": "在有限域中执行正逆蝶形变换，精确计算整数多项式卷积。",
    "problem": "避免浮点误差地快速完成大整数或多项式卷积。",
    "complexity": "O(n log n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "数论",
      "多项式",
      "卷积"
    ],
    "prerequisites": [
      "fft",
      "modular-exponentiation"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/ntt/",
    "demo": "https://wuhy80.github.io/algorithm/ntt/"
  },
  {
    "slug": "prime-factorization",
    "name": "质因数分解 Prime Factorization",
    "category": "数论、变换与线性代数",
    "summary": "从最小质因子开始反复试除，持续缩小剩余整数并输出标准分解。",
    "problem": "把一个正整数唯一表示为若干质数幂的乘积。",
    "complexity": "O(√n)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "数论",
      "质数",
      "试除"
    ],
    "prerequisites": [
      "sieve-of-eratosthenes"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/prime-factorization/",
    "demo": "https://wuhy80.github.io/algorithm/prime-factorization/"
  },
  {
    "slug": "chinese-remainder-theorem",
    "name": "中国剩余定理 CRT",
    "category": "数论、变换与线性代数",
    "summary": "部分模数、乘法逆元与同余方程逐项合并",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "数学"
    ],
    "prerequisites": [
      "extended-euclidean"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/chinese-remainder-theorem/",
    "demo": "https://wuhy80.github.io/algorithm/chinese-remainder-theorem/"
  },
  {
    "slug": "baby-step-giant-step",
    "name": "Baby-Step Giant-Step 离散对数",
    "category": "数论、变换与线性代数",
    "summary": "把指数拆成约 √m 的婴儿步与巨人步，并用哈希表寻找相遇值。",
    "problem": "求解模意义下 a^x≡b 的离散对数。",
    "complexity": "O(√m) 时间与空间",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "数论",
      "离散对数",
      "哈希"
    ],
    "prerequisites": [
      "modular-exponentiation",
      "extended-euclidean"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/baby-step-giant-step/",
    "demo": "https://wuhy80.github.io/algorithm/baby-step-giant-step/"
  },
  {
    "slug": "miller-rabin",
    "name": "Miller-Rabin 素性测试",
    "category": "数论、变换与线性代数",
    "summary": "n-1 分解、模幂底数测试与合数见证识别",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "数学"
    ],
    "prerequisites": [
      "modular-exponentiation"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/miller-rabin/",
    "demo": "https://wuhy80.github.io/algorithm/miller-rabin/"
  },
  {
    "slug": "pollard-rho",
    "name": "Pollard-Rho 因数分解",
    "category": "数论、变换与线性代数",
    "summary": "在模 n 伪随机游走中使用快慢指针，通过差值的 GCD 发现非平凡因子。",
    "problem": "高效分解试除法难以处理的大合数，常与 Miller-Rabin 配合。",
    "complexity": "期望 O(n^(1/4))",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "数论",
      "随机化",
      "因数分解"
    ],
    "prerequisites": [
      "miller-rabin",
      "floyd-cycle-detection"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/pollard-rho/",
    "demo": "https://wuhy80.github.io/algorithm/pollard-rho/"
  },
  {
    "slug": "arithmetic-coding",
    "name": "算术编码 Arithmetic Coding",
    "category": "压缩算法",
    "summary": "符号概率驱动 low/high 编码区间持续收缩",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "压缩"
    ],
    "prerequisites": [
      "huffman-coding"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/arithmetic-coding/",
    "demo": "https://wuhy80.github.io/algorithm/arithmetic-coding/"
  },
  {
    "slug": "run-length-encoding",
    "name": "游程编码 Run-Length Encoding",
    "category": "压缩算法",
    "summary": "把连续相同字符合并成符号与重复长度，动态显示游程形成。",
    "problem": "无损压缩包含长连续重复值的文本、图像行或离散序列。",
    "complexity": "O(n)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "压缩",
      "游程",
      "字符串"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/run-length-encoding/",
    "demo": "https://wuhy80.github.io/algorithm/run-length-encoding/"
  },
  {
    "slug": "burrows-wheeler-transform",
    "name": "Burrows-Wheeler 变换 BWT",
    "category": "压缩算法",
    "summary": "生成并排序循环旋转，提取最后一列和主索引展示字符聚集。",
    "problem": "可逆地重排字符串，让相同字符聚集以提升后续压缩效率。",
    "complexity": "O(n² log n) 演示实现",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "字符串",
      "压缩",
      "后缀排序"
    ],
    "prerequisites": [
      "suffix-array-lcp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/burrows-wheeler-transform/",
    "demo": "https://wuhy80.github.io/algorithm/burrows-wheeler-transform/"
  },
  {
    "slug": "huffman-coding",
    "name": "Huffman 编码",
    "category": "压缩算法",
    "summary": "字符频率队列、最低频节点合并和前缀编码树生成",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "贪心"
    ],
    "prerequisites": [
      "heap-priority-queue"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/huffman-coding/",
    "demo": "https://wuhy80.github.io/algorithm/huffman-coding/"
  },
  {
    "slug": "lz77",
    "name": "LZ77 压缩",
    "category": "压缩算法",
    "summary": "搜索窗口、最长重复匹配与距离长度令牌输出",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "压缩"
    ],
    "prerequisites": [
      "sliding-window"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/lz77/",
    "demo": "https://wuhy80.github.io/algorithm/lz77/"
  },
  {
    "slug": "lzw",
    "name": "LZW 压缩",
    "category": "压缩算法",
    "summary": "短语词典动态扩展和编码编号依次输出",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "压缩"
    ],
    "prerequisites": [
      "trie"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/lzw/",
    "demo": "https://wuhy80.github.io/algorithm/lzw/"
  },
  {
    "slug": "wave-function-collapse",
    "name": "波函数坍缩 Wave Function Collapse",
    "category": "生成、优化与模拟",
    "summary": "网格按最低熵逐格坍缩，约束向周围持续传播",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/wave-function-collapse/",
    "demo": "https://wuhy80.github.io/algorithm/wave-function-collapse/"
  },
  {
    "slug": "reaction-diffusion",
    "name": "反应扩散 Reaction-Diffusion",
    "category": "生成、优化与模拟",
    "summary": "Gray-Scott 模型实时生长斑点、条纹和有机纹理",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/reaction-diffusion/",
    "demo": "https://wuhy80.github.io/algorithm/reaction-diffusion/"
  },
  {
    "slug": "game-of-life",
    "name": "康威生命游戏 Conway's Game of Life",
    "category": "生成、优化与模拟",
    "summary": "细胞在离散规则下繁衍、消亡并产生复杂结构",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/game-of-life/",
    "demo": "https://wuhy80.github.io/algorithm/game-of-life/"
  },
  {
    "slug": "particle-swarm",
    "name": "粒子群优化 Particle Swarm Optimization",
    "category": "生成、优化与模拟",
    "summary": "粒子在目标函数地形中移动并逐步汇聚到最优区域",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "模拟"
    ],
    "prerequisites": [
      "genetic-rockets"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/particle-swarm/",
    "demo": "https://wuhy80.github.io/algorithm/particle-swarm/"
  },
  {
    "slug": "maze-generation",
    "name": "迷宫生成 Maze Generation",
    "category": "生成、优化与模拟",
    "summary": "墙体逐步开凿形成迷宫，并动态展示寻路过程",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/maze-generation/",
    "demo": "https://wuhy80.github.io/algorithm/maze-generation/"
  },
  {
    "slug": "genetic-rockets",
    "name": "遗传火箭 Genetic Rockets",
    "category": "生成、优化与模拟",
    "summary": "多代火箭飞向目标，展示选择、交叉、变异和适应度进化",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/genetic-rockets/",
    "demo": "https://wuhy80.github.io/algorithm/genetic-rockets/"
  },
  {
    "slug": "ant-colony",
    "name": "蚁群优化 Ant Colony Optimization",
    "category": "生成、优化与模拟",
    "summary": "蚂蚁探索路径、信息素沉积与挥发、最短路线逐渐显现",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "模拟"
    ],
    "prerequisites": [
      "dijkstra"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/ant-colony/",
    "demo": "https://wuhy80.github.io/algorithm/ant-colony/"
  },
  {
    "slug": "boids",
    "name": "Boids 群鸟算法",
    "category": "生成、优化与模拟",
    "summary": "鸟群实时聚合、分离、同步、避障和鼠标交互",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/boids/",
    "demo": "https://wuhy80.github.io/algorithm/boids/"
  },
  {
    "slug": "n-body",
    "name": "N 体引力 N-body Simulation",
    "category": "生成、优化与模拟",
    "summary": "星体受引力运动、形成轨道与拖尾，并展示引力积分过程",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/n-body/",
    "demo": "https://wuhy80.github.io/algorithm/n-body/"
  },
  {
    "slug": "flow-field",
    "name": "Perlin 噪声流场 Flow Field",
    "category": "生成、优化与模拟",
    "summary": "大量粒子沿连续噪声向量场流动并留下动态轨迹",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "模拟"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/flow-field/",
    "demo": "https://wuhy80.github.io/algorithm/flow-field/"
  },
  {
    "slug": "dynamic-array",
    "name": "动态数组 Dynamic Array",
    "category": "数据结构",
    "summary": "展示连续存储、容量扩张与尾部追加的摊还成本",
    "problem": "在保持随机访问能力的同时，让线性数组可以按需增长。",
    "complexity": "访问 O(1) / 追加摊还 O(1) / 中间插入 O(n)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "线性结构",
      "摊还分析"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dynamic-array/",
    "demo": "https://wuhy80.github.io/algorithm/dynamic-array/"
  },
  {
    "slug": "circular-buffer",
    "name": "循环缓冲区 Circular Buffer",
    "category": "数据结构",
    "summary": "首尾索引通过取模循环移动，在固定数组内完成队列操作",
    "problem": "为流式数据、生产者消费者和固定容量队列提供无搬移的常数时间读写。",
    "complexity": "入队 / 出队 O(1)，空间 O(capacity)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "线性结构",
      "队列"
    ],
    "prerequisites": [
      "queue"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/circular-buffer/",
    "demo": "https://wuhy80.github.io/algorithm/circular-buffer/"
  },
  {
    "slug": "bitset-bitmap",
    "name": "位集与位图 Bitset / Bitmap",
    "category": "数据结构",
    "summary": "用机器字的单个位表达布尔状态并执行批量位运算",
    "problem": "紧凑保存大规模布尔集合，并快速完成成员测试、交并差和状态压缩。",
    "complexity": "单点操作 O(1)，批量集合操作 O(n / word size)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "位运算",
      "集合"
    ],
    "prerequisites": [],
    "source": "https://github.com/wuhy80/algorithm/tree/main/bitset-bitmap/",
    "demo": "https://wuhy80.github.io/algorithm/bitset-bitmap/"
  },
  {
    "slug": "order-statistic-tree",
    "name": "顺序统计树 Order Statistic Tree",
    "category": "数据结构",
    "summary": "在平衡搜索树节点维护子树规模，支持动态秩查询",
    "problem": "在集合持续插入和删除时查询第 k 小元素或一个键的排名。",
    "complexity": "平衡实现下插入、删除和秩查询均为 O(log n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "平衡树",
      "顺序统计"
    ],
    "prerequisites": [
      "red-black-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/order-statistic-tree/",
    "demo": "https://wuhy80.github.io/algorithm/order-statistic-tree/"
  },
  {
    "slug": "pairing-heap",
    "name": "配对堆 Pairing Heap",
    "category": "数据结构",
    "summary": "通过 meld 和两遍配对合并实现简洁的可并堆",
    "problem": "为需要频繁合并优先队列和 decrease-key 的图算法提供实用堆结构。",
    "complexity": "meld O(1)，delete-min 摊还 O(log n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "堆",
      "可并优先队列"
    ],
    "prerequisites": [
      "heap-priority-queue"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/pairing-heap/",
    "demo": "https://wuhy80.github.io/algorithm/pairing-heap/"
  },
  {
    "slug": "radix-tree",
    "name": "Patricia / Radix Tree",
    "category": "数据结构",
    "summary": "把 Trie 的单孩子路径压缩为字符串边以减少节点",
    "problem": "紧凑存储字符串键、网络前缀和路由表，同时保持按前缀检索能力。",
    "complexity": "插入和查询 O(key length)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "Trie",
      "前缀索引"
    ],
    "prerequisites": [
      "trie"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/radix-tree/",
    "demo": "https://wuhy80.github.io/algorithm/radix-tree/"
  },
  {
    "slug": "rope",
    "name": "Rope 字符串结构",
    "category": "数据结构",
    "summary": "用平衡树组织字符串块，局部拆分和连接完成大文本编辑",
    "problem": "避免在大型文本中插入、删除或拼接时反复复制完整字符串。",
    "complexity": "平衡实现下 split / concat / insert O(log n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "字符串结构",
      "编辑器"
    ],
    "prerequisites": [
      "avl-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/rope/",
    "demo": "https://wuhy80.github.io/algorithm/rope/"
  },
  {
    "slug": "disjoint-sparse-table",
    "name": "不相交稀疏表 Disjoint Sparse Table",
    "category": "高级查询与树分解",
    "summary": "按最高不同位组合左右预计算段，实现通用结合运算静态查询",
    "problem": "对不可重复但满足结合律的运算实现静态区间 O(1) 查询。",
    "complexity": "构建 O(n log n)，查询 O(1)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "区间查询",
      "静态结构"
    ],
    "prerequisites": [
      "sparse-table"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/disjoint-sparse-table/",
    "demo": "https://wuhy80.github.io/algorithm/disjoint-sparse-table/"
  },
  {
    "slug": "merge-sort-tree",
    "name": "归并排序树 Merge Sort Tree",
    "category": "高级查询与树分解",
    "summary": "线段树节点保存有序子数组，以二分回答区间顺序统计",
    "problem": "查询任意下标区间中小于某值的数量或静态第 k 小元素。",
    "complexity": "构建 O(n log n)，计数查询 O(log² n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "线段树",
      "二分查找"
    ],
    "prerequisites": [
      "segment-tree",
      "merge-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/merge-sort-tree/",
    "demo": "https://wuhy80.github.io/algorithm/merge-sort-tree/"
  },
  {
    "slug": "li-chao-tree",
    "name": "Li Chao Tree",
    "category": "高级查询与树分解",
    "summary": "在线维护直线集合并查询指定横坐标的最优值",
    "problem": "处理直线斜率和查询顺序均不单调的动态最值问题。",
    "complexity": "插入和查询 O(log coordinate range)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "线段树",
      "直线最值"
    ],
    "prerequisites": [
      "convex-hull-trick"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/li-chao-tree/",
    "demo": "https://wuhy80.github.io/algorithm/li-chao-tree/"
  },
  {
    "slug": "segment-tree-beats",
    "name": "Segment Tree Beats",
    "category": "高级查询与树分解",
    "summary": "维护最大值、次大值和计数，批量执行区间 chmin",
    "problem": "支持普通懒标记无法直接处理的区间取最小值、取最大值与聚合查询。",
    "complexity": "典型区间 chmin / sum 摊还 O(log² n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "线段树",
      "摊还分析"
    ],
    "prerequisites": [
      "lazy-segment-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/segment-tree-beats/",
    "demo": "https://wuhy80.github.io/algorithm/segment-tree-beats/"
  },
  {
    "slug": "persistent-trie",
    "name": "持久化 Trie Persistent Trie",
    "category": "数据结构",
    "summary": "路径复制生成 Trie 历史版本，未修改分支保持共享",
    "problem": "查询任意历史时刻的字符串前缀、异或最值或版本差分。",
    "complexity": "每次更新和查询 O(key length)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "持久化",
      "Trie"
    ],
    "prerequisites": [
      "trie",
      "persistent-segment-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/persistent-trie/",
    "demo": "https://wuhy80.github.io/algorithm/persistent-trie/"
  },
  {
    "slug": "coordinate-compression",
    "name": "坐标压缩 Coordinate Compression",
    "category": "查找、排序与算法技巧",
    "summary": "排序去重后把稀疏值映射为保持相对次序的紧凑编号",
    "problem": "把大值域或离散坐标转换为适合数组、树状数组和扫描线处理的连续范围。",
    "complexity": "预处理 O(n log n)，映射 O(log n) 或 O(1)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "离散化",
      "排序"
    ],
    "prerequisites": [
      "binary-search"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/coordinate-compression/",
    "demo": "https://wuhy80.github.io/algorithm/coordinate-compression/"
  },
  {
    "slug": "inversion-count",
    "name": "逆序对统计 Inversion Count",
    "category": "查找、排序与算法技巧",
    "summary": "在归并排序合并阶段累计跨区间逆序对",
    "problem": "衡量序列无序程度，并解决排列距离、排名差异和交换次数问题。",
    "complexity": "时间 O(n log n)，空间 O(n)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "分治",
      "归并排序"
    ],
    "prerequisites": [
      "merge-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/inversion-count/",
    "demo": "https://wuhy80.github.io/algorithm/inversion-count/"
  },
  {
    "slug": "median-of-medians",
    "name": "中位数的中位数 Median of Medians",
    "category": "查找、排序与算法技巧",
    "summary": "用五元组中位数构造确定性选择枢轴",
    "problem": "在最坏线性时间内选择第 k 小元素，避免快速选择退化。",
    "complexity": "最坏时间 O(n)，额外空间取决于实现",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "选择算法",
      "分治"
    ],
    "prerequisites": [
      "quickselect"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/median-of-medians/",
    "demo": "https://wuhy80.github.io/algorithm/median-of-medians/"
  },
  {
    "slug": "meet-in-the-middle",
    "name": "折半搜索 Meet-in-the-Middle",
    "category": "查找、排序与算法技巧",
    "summary": "把指数枚举拆成两半并组合两侧结果",
    "problem": "将子集和、背包和密码搜索等 O(2^n) 问题降低到约 O(2^(n/2))。",
    "complexity": "时间和空间通常为 O(2^(n/2))",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "搜索",
      "子集枚举"
    ],
    "prerequisites": [
      "subset-sum"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/meet-in-the-middle/",
    "demo": "https://wuhy80.github.io/algorithm/meet-in-the-middle/"
  },
  {
    "slug": "introsort",
    "name": "内省排序 Introsort",
    "category": "查找、排序与算法技巧",
    "summary": "快速排序过深时切换堆排序，小区间使用插入排序",
    "problem": "结合快速排序的平均性能与堆排序的最坏 O(n log n) 保证。",
    "complexity": "最坏 O(n log n)，原地排序",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "混合排序",
      "标准库"
    ],
    "prerequisites": [
      "quick-sort",
      "heap-sort",
      "insertion-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/introsort/",
    "demo": "https://wuhy80.github.io/algorithm/introsort/"
  },
  {
    "slug": "timsort",
    "name": "Timsort",
    "category": "查找、排序与算法技巧",
    "summary": "利用自然有序 Run 并按不变量执行稳定归并",
    "problem": "高效排序包含局部有序结构的真实数据，并保持稳定性。",
    "complexity": "最好 O(n)，最坏 O(n log n)，空间 O(n)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "混合排序",
      "稳定排序"
    ],
    "prerequisites": [
      "insertion-sort",
      "merge-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/timsort/",
    "demo": "https://wuhy80.github.io/algorithm/timsort/"
  },
  {
    "slug": "external-merge-sort",
    "name": "外部归并排序 External Merge Sort",
    "category": "查找、排序与算法技巧",
    "summary": "内存分块生成有序 Run，再使用多路归并顺序读写外存",
    "problem": "排序无法一次放入内存的文件、日志和数据库记录。",
    "complexity": "I/O 复杂度 O((N/B) log_(M/B)(N/B))",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "外存算法",
      "归并排序"
    ],
    "prerequisites": [
      "merge-sort",
      "heap-priority-queue"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/external-merge-sort/",
    "demo": "https://wuhy80.github.io/algorithm/external-merge-sort/"
  },
  {
    "slug": "branch-and-bound",
    "name": "分支限界法 Branch and Bound",
    "category": "回溯、博弈与约束求解",
    "summary": "用乐观界剪除不可能优于当前解的组合搜索分支",
    "problem": "精确求解背包、旅行商、调度和整数规划等组合优化问题。",
    "complexity": "最坏指数时间，实际性能取决于上界质量",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "组合优化",
      "剪枝"
    ],
    "prerequisites": [
      "knapsack-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/branch-and-bound/",
    "demo": "https://wuhy80.github.io/algorithm/branch-and-bound/"
  },
  {
    "slug": "kosaraju-scc",
    "name": "Kosaraju 强连通分量",
    "category": "图算法、网络流与回溯",
    "summary": "按完成序在原图和转置图执行两遍 DFS",
    "problem": "在线性时间内分解有向图的强连通分量，并与 Tarjan 方法形成互补理解。",
    "complexity": "O(V + E)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "强连通分量",
      "DFS"
    ],
    "prerequisites": [
      "dfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/kosaraju-scc/",
    "demo": "https://wuhy80.github.io/algorithm/kosaraju-scc/"
  },
  {
    "slug": "biconnected-components",
    "name": "双连通分量 Biconnected Components",
    "category": "图算法、网络流与回溯",
    "summary": "利用 dfn、low 和边栈分解点双连通与边双连通结构",
    "problem": "识别无向图中的脆弱连接、割点块结构和可靠通信区域。",
    "complexity": "O(V + E)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "Tarjan",
      "双连通"
    ],
    "prerequisites": [
      "bridges-articulation"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/biconnected-components/",
    "demo": "https://wuhy80.github.io/algorithm/biconnected-components/"
  },
  {
    "slug": "dag-shortest-path",
    "name": "DAG 最短路径",
    "category": "图算法、网络流与回溯",
    "summary": "按拓扑序对有向无环图中的每条边执行一次松弛",
    "problem": "在线性时间处理允许负权边的 DAG 最短路和关键路径问题。",
    "complexity": "O(V + E)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "最短路径",
      "DAG"
    ],
    "prerequisites": [
      "topological-sort"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dag-shortest-path/",
    "demo": "https://wuhy80.github.io/algorithm/dag-shortest-path/"
  },
  {
    "slug": "tree-diameter",
    "name": "树的直径 Tree Diameter",
    "category": "图算法、网络流与回溯",
    "summary": "两次 BFS 或 DFS 找到树上最长简单路径",
    "problem": "计算树网络的最大端到端距离、中心和最远节点。",
    "complexity": "O(n)",
    "difficulty": "基础",
    "stage": 1,
    "tags": [
      "树",
      "BFS"
    ],
    "prerequisites": [
      "bfs"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/tree-diameter/",
    "demo": "https://wuhy80.github.io/algorithm/tree-diameter/"
  },
  {
    "slug": "rerooting-dp",
    "name": "换根动态规划 Rerooting DP",
    "category": "动态规划与序列",
    "summary": "从一个根的答案沿边转移，线性求出所有根状态",
    "problem": "计算每个节点作为根时的子树、距离和或最优结构答案。",
    "complexity": "通常 O(n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "树形 DP",
      "换根"
    ],
    "prerequisites": [
      "tree-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/rerooting-dp/",
    "demo": "https://wuhy80.github.io/algorithm/rerooting-dp/"
  },
  {
    "slug": "dsu-on-tree",
    "name": "DSU on Tree",
    "category": "高级查询与树分解",
    "summary": "保留重子树统计并把小集合合并进大集合",
    "problem": "离线回答每个子树的颜色频次、众数和不同值数量。",
    "complexity": "常见实现 O(n log n) 或 O(n log² n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "树上查询",
      "启发式合并"
    ],
    "prerequisites": [
      "tree-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dsu-on-tree/",
    "demo": "https://wuhy80.github.io/algorithm/dsu-on-tree/"
  },
  {
    "slug": "offline-dynamic-connectivity",
    "name": "离线动态连通性 Offline Dynamic Connectivity",
    "category": "高级查询与树分解",
    "summary": "时间线段树配合可回滚并查集处理边的增删与查询",
    "problem": "在已知全部操作的情况下回答动态图任意时刻的连通性。",
    "complexity": "约 O((Q + K) log Q log V)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "动态图",
      "回滚"
    ],
    "prerequisites": [
      "rollback-union-find",
      "segment-tree"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/offline-dynamic-connectivity/",
    "demo": "https://wuhy80.github.io/algorithm/offline-dynamic-connectivity/"
  },
  {
    "slug": "lower-bound-flow",
    "name": "有上下界网络流 Lower-bound Flow",
    "category": "图算法、网络流与回溯",
    "summary": "消去边下界并用超级源汇检查节点流量需求",
    "problem": "求解每条边都有最小和最大容量限制的可行流与最大流。",
    "complexity": "一次或常数次最大流计算",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "网络流",
      "可行环流"
    ],
    "prerequisites": [
      "dinic"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/lower-bound-flow/",
    "demo": "https://wuhy80.github.io/algorithm/lower-bound-flow/"
  },
  {
    "slug": "tree-isomorphism-ahu",
    "name": "AHU 树同构",
    "category": "图算法、网络流与回溯",
    "summary": "寻找树中心并递归排序子树编码，生成无根树规范形式",
    "problem": "判断两棵节点标签无关的树是否具有完全相同的结构。",
    "complexity": "排序实现通常 O(n log n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "树",
      "规范编码"
    ],
    "prerequisites": [
      "tree-dp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/tree-isomorphism-ahu/",
    "demo": "https://wuhy80.github.io/algorithm/tree-isomorphism-ahu/"
  },
  {
    "slug": "profile-dp",
    "name": "轮廓线动态规划 Profile DP",
    "category": "动态规划与序列",
    "summary": "用位掩码保存扫描边界状态，逐格转移网格铺放方案",
    "problem": "处理窄网格上的多米诺铺砖、连通性计数和局部约束。",
    "complexity": "典型 O(rows × cols × 2^cols)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "状态压缩",
      "网格 DP"
    ],
    "prerequisites": [
      "traveling-salesman-bitmask"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/profile-dp/",
    "demo": "https://wuhy80.github.io/algorithm/profile-dp/"
  },
  {
    "slug": "sos-dp",
    "name": "SOS DP",
    "category": "动态规划与序列",
    "summary": "逐位执行子集 Zeta 变换，一次计算所有状态的子集聚合",
    "problem": "高效求每个掩码所有子集或超集上的和、计数和最值。",
    "complexity": "O(n × 2^n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "状态压缩",
      "子集变换"
    ],
    "prerequisites": [
      "subset-sum"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/sos-dp/",
    "demo": "https://wuhy80.github.io/algorithm/sos-dp/"
  },
  {
    "slug": "probability-dp",
    "name": "概率动态规划 Probability DP",
    "category": "动态规划与序列",
    "summary": "把状态值解释为概率分布并按随机事件转移",
    "problem": "计算骰子、随机游走、期望收益和有限状态随机过程的概率。",
    "complexity": "依状态空间与事件数量而定",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "概率",
      "动态规划"
    ],
    "prerequisites": [
      "coin-change"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/probability-dp/",
    "demo": "https://wuhy80.github.io/algorithm/probability-dp/"
  },
  {
    "slug": "divide-conquer-dp-optimization",
    "name": "分治 DP 优化 Divide-and-Conquer DP Optimization",
    "category": "动态规划与序列",
    "summary": "利用最优决策点单调性分治限制转移范围",
    "problem": "把分组 DP 中每层 O(n²) 的转移降低到 O(n log n) 或 O(n)。",
    "complexity": "常见 O(k n log n)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "DP 优化",
      "分治"
    ],
    "prerequisites": [
      "matrix-chain-multiplication"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/divide-conquer-dp-optimization/",
    "demo": "https://wuhy80.github.io/algorithm/divide-conquer-dp-optimization/"
  },
  {
    "slug": "knuth-optimization",
    "name": "Knuth 优化",
    "category": "动态规划与序列",
    "summary": "利用相邻区间最优分割点的夹逼关系缩小枚举范围",
    "problem": "把满足四边形不等式的区间 DP 从 O(n³) 优化到 O(n²)。",
    "complexity": "O(n²)",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "区间 DP",
      "DP 优化"
    ],
    "prerequisites": [
      "matrix-chain-multiplication"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/knuth-optimization/",
    "demo": "https://wuhy80.github.io/algorithm/knuth-optimization/"
  },
  {
    "slug": "convex-hull-trick",
    "name": "斜率优化 Convex Hull Trick",
    "category": "动态规划与序列",
    "summary": "把线性或二次 DP 转移转换成直线最值查询",
    "problem": "优化具有单调斜率或单调查询点的 DP 线性转移。",
    "complexity": "单调条件下 O(n)，一般动态结构 O(n log n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "DP 优化",
      "凸包"
    ],
    "prerequisites": [
      "kadane"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/convex-hull-trick/",
    "demo": "https://wuhy80.github.io/algorithm/convex-hull-trick/"
  },
  {
    "slug": "rolling-hash",
    "name": "字符串滚动哈希 Rolling Hash",
    "category": "字符串算法",
    "summary": "预处理前缀哈希和幂，常数时间提取任意子串指纹",
    "problem": "快速比较子串、检测重复、匹配模式并支持回文和最长公共前缀查询。",
    "complexity": "预处理 O(n)，子串哈希 O(1)",
    "difficulty": "进阶",
    "stage": 2,
    "tags": [
      "字符串哈希",
      "前缀"
    ],
    "prerequisites": [
      "rabin-karp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/rolling-hash/",
    "demo": "https://wuhy80.github.io/algorithm/rolling-hash/"
  },
  {
    "slug": "duval-lyndon-factorization",
    "name": "Duval / Lyndon 分解",
    "category": "字符串算法",
    "summary": "线性构造字符串唯一的非增 Lyndon 因子序列",
    "problem": "解决最小循环表示、重复结构分析和组合字符串问题。",
    "complexity": "O(n)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "Lyndon 单词",
      "最小表示"
    ],
    "prerequisites": [
      "booth-minimum-rotation"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/duval-lyndon-factorization/",
    "demo": "https://wuhy80.github.io/algorithm/duval-lyndon-factorization/"
  },
  {
    "slug": "fm-index",
    "name": "FM-index",
    "category": "字符串算法",
    "summary": "基于 BWT、C 表与 Occ 计数执行反向全文检索",
    "problem": "在接近压缩文本大小的空间内完成大规模全文模式匹配。",
    "complexity": "查询 O(pattern length)，空间接近压缩文本",
    "difficulty": "高级",
    "stage": 4,
    "tags": [
      "全文索引",
      "BWT"
    ],
    "prerequisites": [
      "burrows-wheeler-transform",
      "suffix-array-lcp"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/fm-index/",
    "demo": "https://wuhy80.github.io/algorithm/fm-index/"
  },
  {
    "slug": "dpll-sat",
    "name": "DPLL SAT 求解",
    "category": "回溯、博弈与约束求解",
    "summary": "结合单位传播、纯文字消除与变量分支求解 CNF",
    "problem": "判断一般布尔公式是否可满足，并输出一个满足赋值。",
    "complexity": "最坏 O(2^n)，传播可显著剪枝",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "SAT",
      "回溯"
    ],
    "prerequisites": [
      "two-sat"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/dpll-sat/",
    "demo": "https://wuhy80.github.io/algorithm/dpll-sat/"
  },
  {
    "slug": "ac3-constraint-propagation",
    "name": "AC-3 约束传播",
    "category": "回溯、博弈与约束求解",
    "summary": "反复修订变量取值域直到所有二元约束达到弧一致",
    "problem": "在搜索前缩减数独、图着色、排程等约束满足问题的候选空间。",
    "complexity": "经典上界 O(E d³)",
    "difficulty": "高级",
    "stage": 3,
    "tags": [
      "CSP",
      "约束传播"
    ],
    "prerequisites": [
      "graph-coloring"
    ],
    "source": "https://github.com/wuhy80/algorithm/tree/main/ac3-constraint-propagation/",
    "demo": "https://wuhy80.github.io/algorithm/ac3-constraint-propagation/"
  }
];
