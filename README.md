# Algorithm Visualization Lab

一个面向算法与数据结构学习的交互式可视化集合。当前包含 **254** 个独立演示，每个算法单独存放在自己的目录中，可直接在 GitHub Pages 运行。

- [打开可视化目录](https://wuhy80.github.io/algorithm/)
- 算法名称链接到对应 GitHub 源码目录
- “打开演示”链接直接进入对应 Pages 地址
- 每个目录的 README 都提供问题驱动的详细学习指南、伪代码、复杂度推导和自测问题

## 学习路径

| 阶段 | 目标 | 数量 |
| --- | --- | ---: |
| 1. 基础操作与核心思想 | 建立查找、排序、线性结构、树、图遍历与神经元基础 | 81 |
| 2. 常用范式与组合技巧 | 掌握贪心、动态规划、字符串、图算法与梯度训练 | 91 |
| 3. 进阶算法与工程结构 | 进入高级数据结构、几何、数论及 CNN、RNN、注意力等专用架构 | 46 |
| 4. 专项高级算法 | 研究复杂匹配、树分解、自动机、生成模型与动态模拟 | 36 |

## 目录统计

- 查找、排序与算法技巧：32 项
- 图算法、网络流与回溯：46 项
- 回溯、博弈与约束求解：15 项
- 字符串算法：19 项
- 动态规划与序列：22 项
- 贪心、调度与编码：5 项
- 数据结构：45 项
- 高级查询与树分解：14 项
- 空间数据结构：5 项
- 计算几何：8 项
- 数论、变换与线性代数：17 项
- 压缩算法：6 项
- 生成、优化与模拟：10 项
- 机器学习与神经网络：10 项

## 查找、排序与算法技巧

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [插入排序 Insertion Sort](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/) | 暂存当前键值、右移较大元素并插入有序前缀 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/insertion-sort/) |
| [差分数组 Difference Array](https://github.com/wuhy80/algorithm/tree/main/difference-array/) | 区间更新只修改两个差分边界，最后通过前缀累加恢复完整数组。 | 基础 | [前缀和 Prefix Sum](https://github.com/wuhy80/algorithm/tree/main/prefix-sum/) | [打开演示](https://wuhy80.github.io/algorithm/difference-array/) |
| [堆排序 Heap Sort](https://github.com/wuhy80/algorithm/tree/main/heap-sort/) | 最大堆构建、堆顶提取、向下调整及有序后缀增长 | 进阶 | [堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | [打开演示](https://wuhy80.github.io/algorithm/heap-sort/) |
| [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | 有序数组的左右边界持续收缩，中点比较与命中过程逐步高亮 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/binary-search/) |
| [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | 数组递归拆分，左右有序段逐项比较并重新合并 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/merge-sort/) |
| [滑动窗口 Sliding Window](https://github.com/wuhy80/algorithm/tree/main/sliding-window/) | 固定窗口逐格滑动，复用移出与移入元素更新区间和 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/sliding-window/) |
| [基数排序 Radix Sort](https://github.com/wuhy80/algorithm/tree/main/radix-sort/) | 按当前数位稳定分桶并逐轮收集形成有序序列 | 进阶 | [计数排序 Counting Sort](https://github.com/wuhy80/algorithm/tree/main/counting-sort/) | [打开演示](https://wuhy80.github.io/algorithm/radix-sort/) |
| [计数排序 Counting Sort](https://github.com/wuhy80/algorithm/tree/main/counting-sort/) | 频次统计、前缀累计和稳定回写输出数组 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/counting-sort/) |
| [快速排序 Quick Sort](https://github.com/wuhy80/algorithm/tree/main/quick-sort/) | 基准选择、双指针扫描、分区交换与递归区间展开 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/quick-sort/) |
| [快速选择 Quickselect](https://github.com/wuhy80/algorithm/tree/main/quickselect/) | 基准分区后只深入目标秩所在一侧，逐步锁定第 K 小元素 | 进阶 | [快速排序 Quick Sort](https://github.com/wuhy80/algorithm/tree/main/quick-sort/) | [打开演示](https://wuhy80.github.io/algorithm/quickselect/) |
| [冒泡排序 Bubble Sort](https://github.com/wuhy80/algorithm/tree/main/bubble-sort/) | 相邻元素逐对比较、交换，最大值逐轮浮向数组末端 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/bubble-sort/) |
| [前缀和 Prefix Sum](https://github.com/wuhy80/algorithm/tree/main/prefix-sum/) | 逐项建立前缀累计值，并用两个前缀值之差常数时间回答区间和。 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/prefix-sum/) |
| [双指针 Two Pointers](https://github.com/wuhy80/algorithm/tree/main/two-pointers/) | 有序数组左右指针根据当前和单调收缩搜索区间 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/two-pointers/) |
| [水塘抽样 Reservoir Sampling](https://github.com/wuhy80/algorithm/tree/main/reservoir-sampling/) | 单遍读取数据流，以递减概率替换固定容量水塘中的随机位置。 | 进阶 | [Fisher-Yates 洗牌](https://github.com/wuhy80/algorithm/tree/main/fisher-yates-shuffle/) | [打开演示](https://wuhy80.github.io/algorithm/reservoir-sampling/) |
| [桶排序 Bucket Sort](https://github.com/wuhy80/algorithm/tree/main/bucket-sort/) | 元素按值域分桶、桶内排序并依序合并输出 | 进阶 | [计数排序 Counting Sort](https://github.com/wuhy80/algorithm/tree/main/counting-sort/) | [打开演示](https://wuhy80.github.io/algorithm/bucket-sort/) |
| [希尔排序 Shell Sort](https://github.com/wuhy80/algorithm/tree/main/shell-sort/) | Gap 分组插入、远距离移动以及间隔逐步收缩 | 进阶 | [插入排序 Insertion Sort](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/) | [打开演示](https://wuhy80.github.io/algorithm/shell-sort/) |
| [线性查找 Linear Search](https://github.com/wuhy80/algorithm/tree/main/linear-search/) | 探针从左向右逐项比较，并保留已扫描区域和最终命中位置 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/linear-search/) |
| [选择排序 Selection Sort](https://github.com/wuhy80/algorithm/tree/main/selection-sort/) | 扫描未排序区间、记录最小值并交换到区间起点 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/selection-sort/) |
| [Fisher-Yates 洗牌](https://github.com/wuhy80/algorithm/tree/main/fisher-yates-shuffle/) | 从尾到头在未固定区间均匀选择元素交换，使用种子复现每一步。 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/fisher-yates-shuffle/) |
| [Floyd 快慢指针判环](https://github.com/wuhy80/algorithm/tree/main/floyd-cycle-detection/) | 快慢指针在链表中以不同速度前进，相遇后同步定位环入口。 | 基础 | [链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/)、[双指针 Two Pointers](https://github.com/wuhy80/algorithm/tree/main/two-pointers/) | [打开演示](https://wuhy80.github.io/algorithm/floyd-cycle-detection/) |
| [坐标压缩 Coordinate Compression](https://github.com/wuhy80/algorithm/tree/main/coordinate-compression/) | 排序去重后把稀疏值映射为保持相对次序的紧凑编号 | 基础 | [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | [打开演示](https://wuhy80.github.io/algorithm/coordinate-compression/) |
| [逆序对统计 Inversion Count](https://github.com/wuhy80/algorithm/tree/main/inversion-count/) | 在归并排序合并阶段累计跨区间逆序对 | 进阶 | [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | [打开演示](https://wuhy80.github.io/algorithm/inversion-count/) |
| [中位数的中位数 Median of Medians](https://github.com/wuhy80/algorithm/tree/main/median-of-medians/) | 用五元组中位数构造确定性选择枢轴 | 高级 | [快速选择 Quickselect](https://github.com/wuhy80/algorithm/tree/main/quickselect/) | [打开演示](https://wuhy80.github.io/algorithm/median-of-medians/) |
| [折半搜索 Meet-in-the-Middle](https://github.com/wuhy80/algorithm/tree/main/meet-in-the-middle/) | 把指数枚举拆成两半并组合两侧结果 | 进阶 | [子集和 Subset Sum](https://github.com/wuhy80/algorithm/tree/main/subset-sum/) | [打开演示](https://wuhy80.github.io/algorithm/meet-in-the-middle/) |
| [内省排序 Introsort](https://github.com/wuhy80/algorithm/tree/main/introsort/) | 快速排序过深时切换堆排序，小区间使用插入排序 | 进阶 | [快速排序 Quick Sort](https://github.com/wuhy80/algorithm/tree/main/quick-sort/)、[堆排序 Heap Sort](https://github.com/wuhy80/algorithm/tree/main/heap-sort/)、[插入排序 Insertion Sort](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/) | [打开演示](https://wuhy80.github.io/algorithm/introsort/) |
| [Timsort](https://github.com/wuhy80/algorithm/tree/main/timsort/) | 利用自然有序 Run 并按不变量执行稳定归并 | 进阶 | [插入排序 Insertion Sort](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/)、[归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | [打开演示](https://wuhy80.github.io/algorithm/timsort/) |
| [外部归并排序 External Merge Sort](https://github.com/wuhy80/algorithm/tree/main/external-merge-sort/) | 内存分块生成有序 Run，再使用多路归并顺序读写外存 | 进阶 | [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)、[堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | [打开演示](https://wuhy80.github.io/algorithm/external-merge-sort/) |
| [数组基本操作 Array Operations](https://github.com/wuhy80/algorithm/tree/main/array-operations/) | 动态展示访问、更新、插入和删除导致的元素移动 | 基础 | [静态数组 Static Array](https://github.com/wuhy80/algorithm/tree/main/static-array/) | [打开演示](https://wuhy80.github.io/algorithm/array-operations/) |
| [二分边界查找 Binary Search Boundaries](https://github.com/wuhy80/algorithm/tree/main/binary-search-boundaries/) | 并列展示 lower bound 与 upper bound 的半开区间收缩 | 基础 | [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | [打开演示](https://wuhy80.github.io/algorithm/binary-search-boundaries/) |
| [合并区间 Merge Intervals](https://github.com/wuhy80/algorithm/tree/main/merge-intervals/) | 排序区间后逐个判断重叠并扩展当前覆盖范围 | 基础 | [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | [打开演示](https://wuhy80.github.io/algorithm/merge-intervals/) |
| [频率统计 Frequency Counting](https://github.com/wuhy80/algorithm/tree/main/frequency-counting/) | 逐项更新哈希计数表并高亮当前最高频元素 | 基础 | [集合与映射 ADT Set / Map](https://github.com/wuhy80/algorithm/tree/main/set-map-adt/) | [打开演示](https://wuhy80.github.io/algorithm/frequency-counting/) |
| [矩阵遍历 Matrix Traversal](https://github.com/wuhy80/algorithm/tree/main/matrix-traversal/) | 支持按行、按列和螺旋三种顺序逐格访问矩阵 | 基础 | [二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | [打开演示](https://wuhy80.github.io/algorithm/matrix-traversal/) |

## 图算法、网络流与回溯

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [0-1 BFS](https://github.com/wuhy80/algorithm/tree/main/zero-one-bfs/) | 双端队列按边权把节点加入队首或队尾，逐边展示距离松弛。 | 进阶 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[双端队列 Deque](https://github.com/wuhy80/algorithm/tree/main/deque/) | [打开演示](https://wuhy80.github.io/algorithm/zero-one-bfs/) |
| [2-SAT](https://github.com/wuhy80/algorithm/tree/main/two-sat/) | 将二元子句转成蕴含图，通过 Tarjan 强连通分量判定可满足性。 | 高级 | [Tarjan 强连通分量](https://github.com/wuhy80/algorithm/tree/main/tarjan-scc/) | [打开演示](https://wuhy80.github.io/algorithm/two-sat/) |
| [二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/) | 交替增广路径搜索与已有匹配重新安排 | 进阶 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/bipartite-matching/) |
| [割点与桥](https://github.com/wuhy80/algorithm/tree/main/bridges-articulation/) | DFS 树回溯、Lowlink 更新及关键节点与边判定 | 高级 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/bridges-articulation/) |
| [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | 队列驱动搜索前沿逐层扩张，并重建起点到目标的最短步数路径 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/bfs/) |
| [欧拉路径 Eulerian Path](https://github.com/wuhy80/algorithm/tree/main/eulerian-path/) | Hierholzer 栈沿未使用边深入并在回退时构造完整路径 | 进阶 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/eulerian-path/) |
| [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | 栈与递归路径持续深入，遇到末路后回退探索其他分支 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/dfs/) |
| [双向 BFS Bidirectional BFS](https://github.com/wuhy80/algorithm/tree/main/bidirectional-bfs/) | 起点与终点两侧轮流扩张较小前沿，并在相遇后拼接最短路径。 | 进阶 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | [打开演示](https://wuhy80.github.io/algorithm/bidirectional-bfs/) |
| [拓扑排序 Topological Sort](https://github.com/wuhy80/algorithm/tree/main/topological-sort/) | 入度归零、队列变化、依赖边删除和有向环检测 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/topological-sort/) |
| [匈牙利算法 Hungarian](https://github.com/wuhy80/algorithm/tree/main/hungarian-algorithm/) | 成本矩阵行列归约、零元素覆盖与最优一一指派 | 高级 | [二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/) | [打开演示](https://wuhy80.github.io/algorithm/hungarian-algorithm/) |
| [最近公共祖先 LCA](https://github.com/wuhy80/algorithm/tree/main/lowest-common-ancestor/) | 查询节点先对齐深度，再同步提升到最近公共祖先 | 进阶 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/lowest-common-ancestor/) |
| [最小费用最大流](https://github.com/wuhy80/algorithm/tree/main/min-cost-max-flow/) | 最低费用增广路、瓶颈流量和累计费用同步更新 | 高级 | [Bellman-Ford 最短路径](https://github.com/wuhy80/algorithm/tree/main/bellman-ford/)、[Edmonds-Karp 最大流](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/) | [打开演示](https://wuhy80.github.io/algorithm/min-cost-max-flow/) |
| [A* 寻路 A* Pathfinding](https://github.com/wuhy80/algorithm/tree/main/astar-pathfinding/) | 搜索前沿扩张、代价变化、障碍编辑与最终路径回溯 | 进阶 | [Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | [打开演示](https://wuhy80.github.io/algorithm/astar-pathfinding/) |
| [Bellman-Ford 最短路径](https://github.com/wuhy80/algorithm/tree/main/bellman-ford/) | 全边多轮松弛、负权边传播以及负权环检测 | 进阶 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | [打开演示](https://wuhy80.github.io/algorithm/bellman-ford/) |
| [Blossom 一般图匹配](https://github.com/wuhy80/algorithm/tree/main/blossom-matching/) | 在交替森林中搜索增广路，遇到奇环时执行花缩并。 | 高级 | [二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/) | [打开演示](https://wuhy80.github.io/algorithm/blossom-matching/) |
| [Borůvka 最小生成树](https://github.com/wuhy80/algorithm/tree/main/boruvka-mst/) | 所有连通分量同时选择最轻出边，批量合并并构建最小生成树。 | 高级 | [Kruskal 最小生成树](https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/)、[并查集 Union-Find](https://github.com/wuhy80/algorithm/tree/main/union-find/) | [打开演示](https://wuhy80.github.io/algorithm/boruvka-mst/) |
| [Chu-Liu/Edmonds 有向最小生成树](https://github.com/wuhy80/algorithm/tree/main/chu-liu-edmonds/) | 选择最轻入边并缩并有向环，通过重标边权继续构造根向最小树形图。 | 高级 | [Kruskal 最小生成树](https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/)、[Tarjan 强连通分量](https://github.com/wuhy80/algorithm/tree/main/tarjan-scc/) | [打开演示](https://wuhy80.github.io/algorithm/chu-liu-edmonds/) |
| [Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | 固定当前最短节点、逐边松弛距离并回溯最终路径 | 基础 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | [打开演示](https://wuhy80.github.io/algorithm/dijkstra/) |
| [Dinic 最大流](https://github.com/wuhy80/algorithm/tree/main/dinic/) | BFS 分层图、DFS 阻塞流与多路径增广过程 | 高级 | [Edmonds-Karp 最大流](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/)、[广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | [打开演示](https://wuhy80.github.io/algorithm/dinic/) |
| [Edmonds-Karp 最大流](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/) | BFS 增广路径、瓶颈流量与残量网络更新 | 进阶 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | [打开演示](https://wuhy80.github.io/algorithm/edmonds-karp/) |
| [Floyd-Warshall 全源最短路径](https://github.com/wuhy80/algorithm/tree/main/floyd-warshall/) | 逐个允许中转点并动态更新节点对距离矩阵 | 进阶 | [Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | [打开演示](https://wuhy80.github.io/algorithm/floyd-warshall/) |
| [Gomory-Hu 全局割树](https://github.com/wuhy80/algorithm/tree/main/gomory-hu-tree/) | 执行 V-1 次最小割并调整父关系，用一棵树编码全部点对最小割。 | 高级 | [Stoer-Wagner 全局最小割](https://github.com/wuhy80/algorithm/tree/main/stoer-wagner-min-cut/)、[Dinic 最大流](https://github.com/wuhy80/algorithm/tree/main/dinic/) | [打开演示](https://wuhy80.github.io/algorithm/gomory-hu-tree/) |
| [Hopcroft-Karp 匹配](https://github.com/wuhy80/algorithm/tree/main/hopcroft-karp/) | 交替图分层并在同一阶段扩展多条最短增广路 | 高级 | [二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/)、[广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | [打开演示](https://wuhy80.github.io/algorithm/hopcroft-karp/) |
| [Johnson 全源最短路](https://github.com/wuhy80/algorithm/tree/main/johnson-algorithm/) | Bellman-Ford 势能重标与逐源 Dijkstra 距离计算 | 高级 | [Bellman-Ford 最短路径](https://github.com/wuhy80/algorithm/tree/main/bellman-ford/)、[Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | [打开演示](https://wuhy80.github.io/algorithm/johnson-algorithm/) |
| [Kruskal 最小生成树](https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/) | 按权重检查边，并用并查集接受或拒绝形成环的边 | 进阶 | [并查集 Union-Find](https://github.com/wuhy80/algorithm/tree/main/union-find/) | [打开演示](https://wuhy80.github.io/algorithm/kruskal-mst/) |
| [Prim 最小生成树](https://github.com/wuhy80/algorithm/tree/main/prim-mst/) | 从树内节点向外扩张，每轮选择最轻割边 | 进阶 | [Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | [打开演示](https://wuhy80.github.io/algorithm/prim-mst/) |
| [Push-Relabel 最大流](https://github.com/wuhy80/algorithm/tree/main/push-relabel/) | 维护预流、节点余量和高度标号，反复执行推流或重标。 | 高级 | [Dinic 最大流](https://github.com/wuhy80/algorithm/tree/main/dinic/)、[Edmonds-Karp 最大流](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/) | [打开演示](https://wuhy80.github.io/algorithm/push-relabel/) |
| [Stoer-Wagner 全局最小割](https://github.com/wuhy80/algorithm/tree/main/stoer-wagner-min-cut/) | 逐阶段执行最大邻接搜索，记录割权并缩并最后两个顶点。 | 高级 | [Edmonds-Karp 最大流](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/) | [打开演示](https://wuhy80.github.io/algorithm/stoer-wagner-min-cut/) |
| [Tarjan 强连通分量](https://github.com/wuhy80/algorithm/tree/main/tarjan-scc/) | DFS 时间戳、Lowlink、栈变化与分量弹出着色 | 高级 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/tarjan-scc/) |
| [Kosaraju 强连通分量](https://github.com/wuhy80/algorithm/tree/main/kosaraju-scc/) | 按完成序在原图和转置图执行两遍 DFS | 进阶 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/kosaraju-scc/) |
| [双连通分量 Biconnected Components](https://github.com/wuhy80/algorithm/tree/main/biconnected-components/) | 利用 dfn、low 和边栈分解点双连通与边双连通结构 | 高级 | [割点与桥](https://github.com/wuhy80/algorithm/tree/main/bridges-articulation/) | [打开演示](https://wuhy80.github.io/algorithm/biconnected-components/) |
| [DAG 最短路径](https://github.com/wuhy80/algorithm/tree/main/dag-shortest-path/) | 按拓扑序对有向无环图中的每条边执行一次松弛 | 进阶 | [拓扑排序 Topological Sort](https://github.com/wuhy80/algorithm/tree/main/topological-sort/) | [打开演示](https://wuhy80.github.io/algorithm/dag-shortest-path/) |
| [树的直径 Tree Diameter](https://github.com/wuhy80/algorithm/tree/main/tree-diameter/) | 两次 BFS 或 DFS 找到树上最长简单路径 | 基础 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | [打开演示](https://wuhy80.github.io/algorithm/tree-diameter/) |
| [有上下界网络流 Lower-bound Flow](https://github.com/wuhy80/algorithm/tree/main/lower-bound-flow/) | 消去边下界并用超级源汇检查节点流量需求 | 高级 | [Dinic 最大流](https://github.com/wuhy80/algorithm/tree/main/dinic/) | [打开演示](https://wuhy80.github.io/algorithm/lower-bound-flow/) |
| [AHU 树同构](https://github.com/wuhy80/algorithm/tree/main/tree-isomorphism-ahu/) | 寻找树中心并递归排序子树编码，生成无根树规范形式 | 高级 | [树形 DP Tree DP](https://github.com/wuhy80/algorithm/tree/main/tree-dp/) | [打开演示](https://wuhy80.github.io/algorithm/tree-isomorphism-ahu/) |
| [二叉树前序遍历 Preorder Traversal](https://github.com/wuhy80/algorithm/tree/main/preorder-traversal/) | 按照根、左、右的顺序展开递归栈与访问序列 | 基础 | [二叉树基础 Binary Tree Basics](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/)、[递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/preorder-traversal/) |
| [二叉树中序遍历 Inorder Traversal](https://github.com/wuhy80/algorithm/tree/main/inorder-traversal/) | 按照左、根、右的顺序展示递归展开与节点访问 | 基础 | [二叉树基础 Binary Tree Basics](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/)、[递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/inorder-traversal/) |
| [二叉树后序遍历 Postorder Traversal](https://github.com/wuhy80/algorithm/tree/main/postorder-traversal/) | 按照左、右、根的顺序演示子树完成后再处理父节点 | 基础 | [二叉树基础 Binary Tree Basics](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/)、[递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/postorder-traversal/) |
| [二叉树层序遍历 Level Order Traversal](https://github.com/wuhy80/algorithm/tree/main/level-order-traversal/) | 显示队列入队出队并逐层访问二叉树节点 | 基础 | [二叉树基础 Binary Tree Basics](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/)、[队列 Queue](https://github.com/wuhy80/algorithm/tree/main/queue/) | [打开演示](https://wuhy80.github.io/algorithm/level-order-traversal/) |
| [二叉树性质 Tree Properties](https://github.com/wuhy80/algorithm/tree/main/tree-properties/) | 一次后序遍历计算节点数、高度、叶子数与平衡性 | 基础 | [二叉树基础 Binary Tree Basics](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/)、[二叉树后序遍历 Postorder Traversal](https://github.com/wuhy80/algorithm/tree/main/postorder-traversal/) | [打开演示](https://wuhy80.github.io/algorithm/tree-properties/) |
| [无向图连通分量 Connected Components](https://github.com/wuhy80/algorithm/tree/main/connected-components/) | 从未访问节点启动 DFS 并用不同颜色标记每个连通块 | 基础 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/)、[图的表示 Graph Representations](https://github.com/wuhy80/algorithm/tree/main/graph-representations/) | [打开演示](https://wuhy80.github.io/algorithm/connected-components/) |
| [无向图环检测 Undirected Cycle Detection](https://github.com/wuhy80/algorithm/tree/main/undirected-cycle-detection/) | 在 DFS 中区分父边与已访问邻居并标出成环边 | 基础 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/)、[图的表示 Graph Representations](https://github.com/wuhy80/algorithm/tree/main/graph-representations/) | [打开演示](https://wuhy80.github.io/algorithm/undirected-cycle-detection/) |
| [有向图环检测 Directed Cycle Detection](https://github.com/wuhy80/algorithm/tree/main/directed-cycle-detection/) | 用白灰黑三色状态识别 DFS 递归栈中的返祖边 | 基础 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/)、[图的表示 Graph Representations](https://github.com/wuhy80/algorithm/tree/main/graph-representations/) | [打开演示](https://wuhy80.github.io/algorithm/directed-cycle-detection/) |
| [二分图判定 Bipartite Check](https://github.com/wuhy80/algorithm/tree/main/bipartite-check/) | 通过 BFS 交替染色并展示产生冲突的同色边 | 基础 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[图的表示 Graph Representations](https://github.com/wuhy80/algorithm/tree/main/graph-representations/) | [打开演示](https://wuhy80.github.io/algorithm/bipartite-check/) |
| [洪水填充 Flood Fill](https://github.com/wuhy80/algorithm/tree/main/flood-fill/) | 从起点向四邻域扩散并逐格替换同色连通区域 | 基础 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | [打开演示](https://wuhy80.github.io/algorithm/flood-fill/) |
| [网格搜索 Grid Search](https://github.com/wuhy80/algorithm/tree/main/grid-search/) | 把可通行单元格视为图节点并用 BFS 寻找最短路径 | 基础 | [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | [打开演示](https://wuhy80.github.io/algorithm/grid-search/) |

## 回溯、博弈与约束求解

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [汉诺塔 Tower of Hanoi](https://github.com/wuhy80/algorithm/tree/main/tower-of-hanoi/) | 递归分解圆盘搬运，展示全部 2ⁿ-1 次合法移动 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/tower-of-hanoi/) |
| [骑士巡游 Knight's Tour](https://github.com/wuhy80/algorithm/tree/main/knights-tour/) | Warnsdorff 候选排序、骑士跳步与回溯撤销 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/knights-tour/) |
| [数独回溯 Sudoku Backtracking](https://github.com/wuhy80/algorithm/tree/main/sudoku-backtracking/) | 候选数字尝试、约束冲突、错误分支撤销与完整解生成 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/sudoku-backtracking/) |
| [图着色回溯 Graph Coloring](https://github.com/wuhy80/algorithm/tree/main/graph-coloring/) | 节点逐色尝试、相邻冲突判断与失败分支撤销 | 进阶 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/graph-coloring/) |
| [舞蹈链 Dancing Links](https://github.com/wuhy80/algorithm/tree/main/dancing-links/) | 精确覆盖矩阵选列、覆盖、恢复与 Algorithm X 解路径 | 高级 | [数独回溯 Sudoku Backtracking](https://github.com/wuhy80/algorithm/tree/main/sudoku-backtracking/) | [打开演示](https://wuhy80.github.io/algorithm/dancing-links/) |
| [Minimax 与 Alpha-Beta 剪枝](https://github.com/wuhy80/algorithm/tree/main/minimax-alpha-beta/) | 在 MAX/MIN 博弈树中回传效用，并在 α≥β 时跳过不可能影响结果的分支。 | 进阶 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/minimax-alpha-beta/) |
| [N 皇后 N-Queens](https://github.com/wuhy80/algorithm/tree/main/n-queens/) | 皇后逐行尝试摆放，冲突位置高亮并动态展示撤销回溯 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/n-queens/) |
| [分支限界法 Branch and Bound](https://github.com/wuhy80/algorithm/tree/main/branch-and-bound/) | 用乐观界剪除不可能优于当前解的组合搜索分支 | 进阶 | [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | [打开演示](https://wuhy80.github.io/algorithm/branch-and-bound/) |
| [DPLL SAT 求解](https://github.com/wuhy80/algorithm/tree/main/dpll-sat/) | 结合单位传播、纯文字消除与变量分支求解 CNF | 高级 | [2-SAT](https://github.com/wuhy80/algorithm/tree/main/two-sat/) | [打开演示](https://wuhy80.github.io/algorithm/dpll-sat/) |
| [AC-3 约束传播](https://github.com/wuhy80/algorithm/tree/main/ac3-constraint-propagation/) | 反复修订变量取值域直到所有二元约束达到弧一致 | 高级 | [图着色回溯 Graph Coloring](https://github.com/wuhy80/algorithm/tree/main/graph-coloring/) | [打开演示](https://wuhy80.github.io/algorithm/ac3-constraint-propagation/) |
| [递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | 用阶乘逐层展示函数入栈、基例命中和返回值出栈 | 基础 | [栈 Stack](https://github.com/wuhy80/algorithm/tree/main/stack/) | [打开演示](https://wuhy80.github.io/algorithm/recursion-call-stack/) |
| [排列生成 Permutation Generation](https://github.com/wuhy80/algorithm/tree/main/permutation-generation/) | 通过选择未使用元素、递归深入和撤销选择生成全排列 | 基础 | [递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/permutation-generation/) |
| [组合生成 Combination Generation](https://github.com/wuhy80/algorithm/tree/main/combination-generation/) | 用起始下标剪去顺序重复并生成固定大小组合 | 基础 | [递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/combination-generation/) |
| [子集枚举 Subset Enumeration](https://github.com/wuhy80/algorithm/tree/main/subset-enumeration/) | 对每个元素展示选与不选两个分支并输出幂集 | 基础 | [递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/subset-enumeration/) |
| [合法括号生成 Parentheses Generation](https://github.com/wuhy80/algorithm/tree/main/parentheses-generation/) | 按左右括号计数约束剪枝并生成全部合法序列 | 进阶 | [括号匹配 Parentheses Matching](https://github.com/wuhy80/algorithm/tree/main/parentheses-matching/)、[递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/parentheses-generation/) |

## 字符串算法

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [后缀树 Suffix Tree](https://github.com/wuhy80/algorithm/tree/main/suffix-tree/) | 把所有后缀插入压缩 Trie，在部分匹配位置切分边并共享公共前缀。 | 高级 | [后缀数组与 LCP](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/)、[后缀自动机 Suffix Automaton](https://github.com/wuhy80/algorithm/tree/main/suffix-automaton/) | [打开演示](https://wuhy80.github.io/algorithm/suffix-tree/) |
| [后缀数组与 LCP](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/) | 倍增排序全部后缀并计算相邻后缀最长公共前缀 | 进阶 | [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | [打开演示](https://wuhy80.github.io/algorithm/suffix-array-lcp/) |
| [后缀自动机 Suffix Automaton](https://github.com/wuhy80/algorithm/tree/main/suffix-automaton/) | 逐字符扩展状态、后缀链接与转移，必要时创建克隆状态。 | 高级 | [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/)、[KMP 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/kmp-search/) | [打开演示](https://wuhy80.github.io/algorithm/suffix-automaton/) |
| [回文树 Eertree](https://github.com/wuhy80/algorithm/tree/main/palindromic-tree/) | 每个节点表示一种不同回文，动态维护最长回文后缀链接。 | 高级 | [Manacher 最长回文](https://github.com/wuhy80/algorithm/tree/main/manacher/)、[Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/) | [打开演示](https://wuhy80.github.io/algorithm/palindromic-tree/) |
| [正则匹配 DP](https://github.com/wuhy80/algorithm/tree/main/regex-matching/) | 二维状态处理普通字符、点通配符与星号重复规则 | 进阶 | [编辑距离 Edit Distance](https://github.com/wuhy80/algorithm/tree/main/edit-distance/) | [打开演示](https://wuhy80.github.io/algorithm/regex-matching/) |
| [Aho-Corasick 多模式匹配](https://github.com/wuhy80/algorithm/tree/main/aho-corasick/) | Trie 插入、失败指针建立以及一次文本扫描中的多模式命中 | 进阶 | [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/)、[KMP 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/kmp-search/) | [打开演示](https://wuhy80.github.io/algorithm/aho-corasick/) |
| [Booth 最小表示法](https://github.com/wuhy80/algorithm/tree/main/booth-minimum-rotation/) | 在双倍字符串中比较两个候选起点，一次失配排除一整段候选。 | 高级 | [KMP 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/kmp-search/)、[双指针 Two Pointers](https://github.com/wuhy80/algorithm/tree/main/two-pointers/) | [打开演示](https://wuhy80.github.io/algorithm/booth-minimum-rotation/) |
| [Boyer-Moore 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/boyer-moore/) | 从模式串尾部比较，坏字符失配时跨越无效对齐 | 进阶 | [线性查找 Linear Search](https://github.com/wuhy80/algorithm/tree/main/linear-search/) | [打开演示](https://wuhy80.github.io/algorithm/boyer-moore/) |
| [KMP 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/kmp-search/) | 构建 LPS 前缀表，失配时移动模式串而不回退文本指针 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/kmp-search/) |
| [Manacher 最长回文](https://github.com/wuhy80/algorithm/tree/main/manacher/) | 分隔符变换、镜像半径复用与最长回文区间扩展 | 进阶 | [滑动窗口 Sliding Window](https://github.com/wuhy80/algorithm/tree/main/sliding-window/) | [打开演示](https://wuhy80.github.io/algorithm/manacher/) |
| [Rabin-Karp 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/rabin-karp/) | 文本窗口滑动、滚动哈希更新和哈希碰撞校验 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/rabin-karp/) |
| [Z 算法 Z Algorithm](https://github.com/wuhy80/algorithm/tree/main/z-algorithm/) | 维护最右 Z Box，复用镜像结果计算全部前缀匹配长度 | 进阶 | [KMP 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/kmp-search/) | [打开演示](https://wuhy80.github.io/algorithm/z-algorithm/) |
| [字符串滚动哈希 Rolling Hash](https://github.com/wuhy80/algorithm/tree/main/rolling-hash/) | 预处理前缀哈希和幂，常数时间提取任意子串指纹 | 进阶 | [Rabin-Karp 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/rabin-karp/) | [打开演示](https://wuhy80.github.io/algorithm/rolling-hash/) |
| [Duval / Lyndon 分解](https://github.com/wuhy80/algorithm/tree/main/duval-lyndon-factorization/) | 线性构造字符串唯一的非增 Lyndon 因子序列 | 高级 | [Booth 最小表示法](https://github.com/wuhy80/algorithm/tree/main/booth-minimum-rotation/) | [打开演示](https://wuhy80.github.io/algorithm/duval-lyndon-factorization/) |
| [FM-index](https://github.com/wuhy80/algorithm/tree/main/fm-index/) | 基于 BWT、C 表与 Occ 计数执行反向全文检索 | 高级 | [Burrows-Wheeler 变换 BWT](https://github.com/wuhy80/algorithm/tree/main/burrows-wheeler-transform/)、[后缀数组与 LCP](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/) | [打开演示](https://wuhy80.github.io/algorithm/fm-index/) |
| [朴素字符串匹配 Naive String Search](https://github.com/wuhy80/algorithm/tree/main/naive-string-search/) | 逐个对齐模式串并逐字符比较每个候选窗口 | 基础 | [静态数组 Static Array](https://github.com/wuhy80/algorithm/tree/main/static-array/) | [打开演示](https://wuhy80.github.io/algorithm/naive-string-search/) |
| [回文判断 Palindrome Check](https://github.com/wuhy80/algorithm/tree/main/palindrome-check/) | 双指针从两端向中间移动并比较规范化字符 | 基础 | [双指针 Two Pointers](https://github.com/wuhy80/algorithm/tree/main/two-pointers/) | [打开演示](https://wuhy80.github.io/algorithm/palindrome-check/) |
| [变位词判断 Anagram Check](https://github.com/wuhy80/algorithm/tree/main/anagram-check/) | 统计两个字符串的字符频率并逐项抵消比较 | 基础 | [频率统计 Frequency Counting](https://github.com/wuhy80/algorithm/tree/main/frequency-counting/) | [打开演示](https://wuhy80.github.io/algorithm/anagram-check/) |
| [最长公共前缀 Longest Common Prefix](https://github.com/wuhy80/algorithm/tree/main/longest-common-prefix/) | 逐列比较一组单词并停止在第一个不一致字符 | 基础 | [朴素字符串匹配 Naive String Search](https://github.com/wuhy80/algorithm/tree/main/naive-string-search/) | [打开演示](https://wuhy80.github.io/algorithm/longest-common-prefix/) |

## 动态规划与序列

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | 状态表逐格比较选与不选，并回溯最优物品组合 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/knapsack-dp/) |
| [编辑距离 Edit Distance](https://github.com/wuhy80/algorithm/tree/main/edit-distance/) | 插入、删除、替换状态转移与最优编辑路径回溯 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/edit-distance/) |
| [带权区间调度](https://github.com/wuhy80/algorithm/tree/main/weighted-interval-scheduling/) | 兼容前驱查找、选择/跳过比较和最优任务集合回溯 | 进阶 | [活动选择 Activity Selection](https://github.com/wuhy80/algorithm/tree/main/activity-selection/) | [打开演示](https://wuhy80.github.io/algorithm/weighted-interval-scheduling/) |
| [矩阵链乘法](https://github.com/wuhy80/algorithm/tree/main/matrix-chain-multiplication/) | 区间长度递增、断点枚举和最少标量乘法代价更新 | 进阶 | [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | [打开演示](https://wuhy80.github.io/algorithm/matrix-chain-multiplication/) |
| [零钱兑换 Coin Change](https://github.com/wuhy80/algorithm/tree/main/coin-change/) | 金额状态从更小金额转移并记录最少硬币数 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/coin-change/) |
| [旅行商位压 DP](https://github.com/wuhy80/algorithm/tree/main/traveling-salesman-bitmask/) | 已访问城市位掩码、终点状态扩展与最短回路重建 | 高级 | [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | [打开演示](https://wuhy80.github.io/algorithm/traveling-salesman-bitmask/) |
| [树形 DP Tree DP](https://github.com/wuhy80/algorithm/tree/main/tree-dp/) | 后序合并子树的不选/选择状态并求最大权独立集 | 高级 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/tree-dp/) |
| [数位 DP Digit DP](https://github.com/wuhy80/algorithm/tree/main/digit-dp/) | 上界约束、数位状态分支和记忆化计数表更新 | 高级 | [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | [打开演示](https://wuhy80.github.io/algorithm/digit-dp/) |
| [子集和 Subset Sum](https://github.com/wuhy80/algorithm/tree/main/subset-sum/) | 逐元素从高到低更新可达和并判断目标状态 | 进阶 | [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | [打开演示](https://wuhy80.github.io/algorithm/subset-sum/) |
| [最长递增子序列 LIS](https://github.com/wuhy80/algorithm/tree/main/longest-increasing-subsequence/) | 最小尾值数组、二分替换和递增子序列重建 | 进阶 | [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | [打开演示](https://wuhy80.github.io/algorithm/longest-increasing-subsequence/) |
| [最长公共子序列 LCS](https://github.com/wuhy80/algorithm/tree/main/longest-common-subsequence/) | 二维状态表填充并沿最优路径回溯公共子序列 | 进阶 | [编辑距离 Edit Distance](https://github.com/wuhy80/algorithm/tree/main/edit-distance/) | [打开演示](https://wuhy80.github.io/algorithm/longest-common-subsequence/) |
| [Kadane 最大子数组](https://github.com/wuhy80/algorithm/tree/main/kadane/) | 在重新开始和延续前缀间选择，持续更新最大连续和 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/kadane/) |
| [换根动态规划 Rerooting DP](https://github.com/wuhy80/algorithm/tree/main/rerooting-dp/) | 从一个根的答案沿边转移，线性求出所有根状态 | 高级 | [树形 DP Tree DP](https://github.com/wuhy80/algorithm/tree/main/tree-dp/) | [打开演示](https://wuhy80.github.io/algorithm/rerooting-dp/) |
| [轮廓线动态规划 Profile DP](https://github.com/wuhy80/algorithm/tree/main/profile-dp/) | 用位掩码保存扫描边界状态，逐格转移网格铺放方案 | 高级 | [旅行商位压 DP](https://github.com/wuhy80/algorithm/tree/main/traveling-salesman-bitmask/) | [打开演示](https://wuhy80.github.io/algorithm/profile-dp/) |
| [SOS DP](https://github.com/wuhy80/algorithm/tree/main/sos-dp/) | 逐位执行子集 Zeta 变换，一次计算所有状态的子集聚合 | 高级 | [子集和 Subset Sum](https://github.com/wuhy80/algorithm/tree/main/subset-sum/) | [打开演示](https://wuhy80.github.io/algorithm/sos-dp/) |
| [概率动态规划 Probability DP](https://github.com/wuhy80/algorithm/tree/main/probability-dp/) | 把状态值解释为概率分布并按随机事件转移 | 进阶 | [零钱兑换 Coin Change](https://github.com/wuhy80/algorithm/tree/main/coin-change/) | [打开演示](https://wuhy80.github.io/algorithm/probability-dp/) |
| [分治 DP 优化 Divide-and-Conquer DP Optimization](https://github.com/wuhy80/algorithm/tree/main/divide-conquer-dp-optimization/) | 利用最优决策点单调性分治限制转移范围 | 高级 | [矩阵链乘法](https://github.com/wuhy80/algorithm/tree/main/matrix-chain-multiplication/) | [打开演示](https://wuhy80.github.io/algorithm/divide-conquer-dp-optimization/) |
| [Knuth 优化](https://github.com/wuhy80/algorithm/tree/main/knuth-optimization/) | 利用相邻区间最优分割点的夹逼关系缩小枚举范围 | 高级 | [矩阵链乘法](https://github.com/wuhy80/algorithm/tree/main/matrix-chain-multiplication/) | [打开演示](https://wuhy80.github.io/algorithm/knuth-optimization/) |
| [斜率优化 Convex Hull Trick](https://github.com/wuhy80/algorithm/tree/main/convex-hull-trick/) | 把线性或二次 DP 转移转换成直线最值查询 | 高级 | [Kadane 最大子数组](https://github.com/wuhy80/algorithm/tree/main/kadane/) | [打开演示](https://wuhy80.github.io/algorithm/convex-hull-trick/) |
| [斐波那契记忆化 Fibonacci Memoization](https://github.com/wuhy80/algorithm/tree/main/fibonacci-memoization/) | 展示递归子问题、缓存命中以及重复计算被消除的过程 | 基础 | [递归与调用栈 Recursion Call Stack](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/) | [打开演示](https://wuhy80.github.io/algorithm/fibonacci-memoization/) |
| [爬楼梯动态规划 Climbing Stairs](https://github.com/wuhy80/algorithm/tree/main/climbing-stairs/) | 逐阶合并前两级方案数并展示一维 DP 状态 | 基础 | [斐波那契记忆化 Fibonacci Memoization](https://github.com/wuhy80/algorithm/tree/main/fibonacci-memoization/) | [打开演示](https://wuhy80.github.io/algorithm/climbing-stairs/) |
| [网格路径动态规划 Grid Path DP](https://github.com/wuhy80/algorithm/tree/main/grid-path-dp/) | 按行填表并累加来自上方和左侧的无障碍路径数 | 基础 | [二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/)、[爬楼梯动态规划 Climbing Stairs](https://github.com/wuhy80/algorithm/tree/main/climbing-stairs/) | [打开演示](https://wuhy80.github.io/algorithm/grid-path-dp/) |

## 贪心、调度与编码

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [分数背包 Fractional Knapsack](https://github.com/wuhy80/algorithm/tree/main/fractional-knapsack/) | 按单位重量价值排序，动态展示完整装入与最后一个物品的分数装入。 | 进阶 | [活动选择 Activity Selection](https://github.com/wuhy80/algorithm/tree/main/activity-selection/) | [打开演示](https://wuhy80.github.io/algorithm/fractional-knapsack/) |
| [活动选择 Activity Selection](https://github.com/wuhy80/algorithm/tree/main/activity-selection/) | 按结束时间排序并选择互不冲突的活动，动态展示候选判断与已选集合。 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/activity-selection/) |
| [区间覆盖 Interval Covering](https://github.com/wuhy80/algorithm/tree/main/interval-covering/) | 每轮从可衔接区间中选择右端点最远者，展示覆盖边界推进与缺口。 | 进阶 | [活动选择 Activity Selection](https://github.com/wuhy80/algorithm/tree/main/activity-selection/) | [打开演示](https://wuhy80.github.io/algorithm/interval-covering/) |
| [任务序列调度 Job Sequencing](https://github.com/wuhy80/algorithm/tree/main/job-sequencing/) | 按收益降序把任务放入截止期限前最晚空闲时隙。 | 进阶 | [活动选择 Activity Selection](https://github.com/wuhy80/algorithm/tree/main/activity-selection/) | [打开演示](https://wuhy80.github.io/algorithm/job-sequencing/) |
| [稳定婚姻匹配 Gale-Shapley](https://github.com/wuhy80/algorithm/tree/main/stable-marriage/) | 自由提议者依偏好提议，接收者始终保留当前更偏好的匹配。 | 进阶 | [二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/) | [打开演示](https://wuhy80.github.io/algorithm/stable-marriage/) |

## 数据结构

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [并查集 Union-Find](https://github.com/wuhy80/algorithm/tree/main/union-find/) | 父指针查找、按秩合并、路径压缩和连通性判断 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/union-find/) |
| [单调栈 Monotonic Stack](https://github.com/wuhy80/algorithm/tree/main/monotonic-stack-queue/) | 递减栈进出过程与右侧首个更大值确定 | 进阶 | [栈 Stack](https://github.com/wuhy80/algorithm/tree/main/stack/)、[双端队列 Deque](https://github.com/wuhy80/algorithm/tree/main/deque/) | [打开演示](https://wuhy80.github.io/algorithm/monotonic-stack-queue/) |
| [笛卡尔树 Cartesian Tree](https://github.com/wuhy80/algorithm/tree/main/cartesian-tree/) | 单调栈维护右脊，使中序次序等于原数组且节点同时满足最小堆序。 | 进阶 | [单调栈 Monotonic Stack](https://github.com/wuhy80/algorithm/tree/main/monotonic-stack-queue/) | [打开演示](https://wuhy80.github.io/algorithm/cartesian-tree/) |
| [堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | 插入上浮、提取堆顶和替换后的向下调整 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/heap-priority-queue/) |
| [队列 Queue](https://github.com/wuhy80/algorithm/tree/main/queue/) | 循环数组中的入队、出队以及 Head / Tail 指针移动 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/queue/) |
| [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | 插入与查找路径逐层下降，删除后树结构重新连接 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/binary-search-tree/) |
| [哈希表 Hash Table](https://github.com/wuhy80/algorithm/tree/main/hash-table/) | 哈希定位、碰撞链扫描以及键值插入、查找和删除 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/hash-table/) |
| [红黑树 Red-Black Tree](https://github.com/wuhy80/algorithm/tree/main/red-black-tree/) | 插入后的颜色修复、叔节点判断及左右旋转 | 进阶 | [AVL 平衡树](https://github.com/wuhy80/algorithm/tree/main/avl-tree/) | [打开演示](https://wuhy80.github.io/algorithm/red-black-tree/) |
| [可持久化线段树](https://github.com/wuhy80/algorithm/tree/main/persistent-segment-tree/) | 新旧版本路径复制、未修改子树共享与区间和比较 | 高级 | [线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) | [打开演示](https://wuhy80.github.io/algorithm/persistent-segment-tree/) |
| [懒标记线段树](https://github.com/wuhy80/algorithm/tree/main/lazy-segment-tree/) | 区间递归覆盖、懒标记暂存和节点区间和更新 | 进阶 | [线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) | [打开演示](https://wuhy80.github.io/algorithm/lazy-segment-tree/) |
| [链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/) | 节点插入、删除、查找与 next 指针重新连接 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/linked-list/) |
| [区间树 Interval Tree](https://github.com/wuhy80/algorithm/tree/main/interval-tree/) | 按中心点划分区间，查询时剪去不可能与目标相交的子树。 | 进阶 | [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | [打开演示](https://wuhy80.github.io/algorithm/interval-tree/) |
| [伸展树 Splay Tree](https://github.com/wuhy80/algorithm/tree/main/splay-tree/) | Zig、Zig-Zig、Zig-Zag 旋转把访问目标提升到根 | 高级 | [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | [打开演示](https://wuhy80.github.io/algorithm/splay-tree/) |
| [树状数组 Fenwick Tree](https://github.com/wuhy80/algorithm/tree/main/fenwick-tree/) | lowbit 覆盖范围以及查询、更新索引的跳转路径 | 进阶 | [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | [打开演示](https://wuhy80.github.io/algorithm/fenwick-tree/) |
| [双端队列 Deque](https://github.com/wuhy80/algorithm/tree/main/deque/) | 队首与队尾的插入删除操作及边界元素变化 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/deque/) |
| [跳表 Skip List](https://github.com/wuhy80/algorithm/tree/main/skip-list/) | 多层稀疏索引插入、向右跳跃与逐层下降查找 | 进阶 | [链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/) | [打开演示](https://wuhy80.github.io/algorithm/skip-list/) |
| [稀疏表 Sparse Table](https://github.com/wuhy80/algorithm/tree/main/sparse-table/) | 2 的幂次区间预处理以及双区间块常数时间查询 | 进阶 | [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | [打开演示](https://wuhy80.github.io/algorithm/sparse-table/) |
| [线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) | 区间递归分解、完整覆盖节点选择和单点更新传播 | 进阶 | [二分查找 Binary Search](https://github.com/wuhy80/algorithm/tree/main/binary-search/) | [打开演示](https://wuhy80.github.io/algorithm/segment-tree/) |
| [栈 Stack](https://github.com/wuhy80/algorithm/tree/main/stack/) | 元素压栈、出栈、查看栈顶以及 Overflow / Underflow 状态 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/stack/) |
| [AVL 平衡树](https://github.com/wuhy80/algorithm/tree/main/avl-tree/) | 插入后计算平衡因子，通过 LL、RR、LR、RL 旋转恢复平衡 | 进阶 | [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | [打开演示](https://wuhy80.github.io/algorithm/avl-tree/) |
| [B 树 B-Tree](https://github.com/wuhy80/algorithm/tree/main/b-tree/) | 多键节点插入、满节点分裂和中间键向上提升 | 进阶 | [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | [打开演示](https://wuhy80.github.io/algorithm/b-tree/) |
| [B+ 树 B+ Tree](https://github.com/wuhy80/algorithm/tree/main/b-plus-tree/) | 叶节点插入分裂、父级分隔键和叶链连接 | 进阶 | [B 树 B-Tree](https://github.com/wuhy80/algorithm/tree/main/b-tree/) | [打开演示](https://wuhy80.github.io/algorithm/b-plus-tree/) |
| [Bloom Filter](https://github.com/wuhy80/algorithm/tree/main/bloom-filter/) | 多哈希映射、位数组置位和概率成员查询 | 进阶 | [哈希表 Hash Table](https://github.com/wuhy80/algorithm/tree/main/hash-table/) | [打开演示](https://wuhy80.github.io/algorithm/bloom-filter/) |
| [LRU 缓存](https://github.com/wuhy80/algorithm/tree/main/lru-cache/) | 访问命中、最近使用顺序移动与容量淘汰 | 进阶 | [哈希表 Hash Table](https://github.com/wuhy80/algorithm/tree/main/hash-table/)、[链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/) | [打开演示](https://wuhy80.github.io/algorithm/lru-cache/) |
| [Treap 随机平衡树](https://github.com/wuhy80/algorithm/tree/main/treap/) | BST 插入、随机优先级比较与旋转恢复堆序 | 高级 | [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | [打开演示](https://wuhy80.github.io/algorithm/treap/) |
| [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/) | 字符路径共享、单词终点、插入、查找、删除及前缀判断 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/trie/) |
| [动态数组 Dynamic Array](https://github.com/wuhy80/algorithm/tree/main/dynamic-array/) | 展示连续存储、容量扩张与尾部追加的摊还成本 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/dynamic-array/) |
| [循环缓冲区 Circular Buffer](https://github.com/wuhy80/algorithm/tree/main/circular-buffer/) | 首尾索引通过取模循环移动，在固定数组内完成队列操作 | 基础 | [队列 Queue](https://github.com/wuhy80/algorithm/tree/main/queue/) | [打开演示](https://wuhy80.github.io/algorithm/circular-buffer/) |
| [位集与位图 Bitset / Bitmap](https://github.com/wuhy80/algorithm/tree/main/bitset-bitmap/) | 用机器字的单个位表达布尔状态并执行批量位运算 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/bitset-bitmap/) |
| [顺序统计树 Order Statistic Tree](https://github.com/wuhy80/algorithm/tree/main/order-statistic-tree/) | 在平衡搜索树节点维护子树规模，支持动态秩查询 | 高级 | [红黑树 Red-Black Tree](https://github.com/wuhy80/algorithm/tree/main/red-black-tree/) | [打开演示](https://wuhy80.github.io/algorithm/order-statistic-tree/) |
| [配对堆 Pairing Heap](https://github.com/wuhy80/algorithm/tree/main/pairing-heap/) | 通过 meld 和两遍配对合并实现简洁的可并堆 | 高级 | [堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | [打开演示](https://wuhy80.github.io/algorithm/pairing-heap/) |
| [Patricia / Radix Tree](https://github.com/wuhy80/algorithm/tree/main/radix-tree/) | 把 Trie 的单孩子路径压缩为字符串边以减少节点 | 进阶 | [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/) | [打开演示](https://wuhy80.github.io/algorithm/radix-tree/) |
| [Rope 字符串结构](https://github.com/wuhy80/algorithm/tree/main/rope/) | 用平衡树组织字符串块，局部拆分和连接完成大文本编辑 | 高级 | [AVL 平衡树](https://github.com/wuhy80/algorithm/tree/main/avl-tree/) | [打开演示](https://wuhy80.github.io/algorithm/rope/) |
| [持久化 Trie Persistent Trie](https://github.com/wuhy80/algorithm/tree/main/persistent-trie/) | 路径复制生成 Trie 历史版本，未修改分支保持共享 | 高级 | [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/)、[可持久化线段树](https://github.com/wuhy80/algorithm/tree/main/persistent-segment-tree/) | [打开演示](https://wuhy80.github.io/algorithm/persistent-trie/) |
| [静态数组 Static Array](https://github.com/wuhy80/algorithm/tree/main/static-array/) | 逐格展示连续内存、下标访问与定长数组的原地更新 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/static-array/) |
| [二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | 把行列坐标映射到二维网格并动态展示单元格更新 | 基础 | [静态数组 Static Array](https://github.com/wuhy80/algorithm/tree/main/static-array/) | [打开演示](https://wuhy80.github.io/algorithm/matrix-2d-array/) |
| [双向链表 Doubly Linked List](https://github.com/wuhy80/algorithm/tree/main/doubly-linked-list/) | 同步展示 prev 与 next 指针以及双向插入、删除过程 | 基础 | [链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/) | [打开演示](https://wuhy80.github.io/algorithm/doubly-linked-list/) |
| [循环链表 Circular Linked List](https://github.com/wuhy80/algorithm/tree/main/circular-linked-list/) | 让尾节点重新指向头节点并演示环形轮转与删除 | 基础 | [链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/) | [打开演示](https://wuhy80.github.io/algorithm/circular-linked-list/) |
| [二叉树基础 Binary Tree Basics](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/) | 按层序数组构造二叉树并展示父子关系与节点定位 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/binary-tree-basics/) |
| [多叉树 N-ary Tree](https://github.com/wuhy80/algorithm/tree/main/n-ary-tree/) | 通过父子边构造任意分支数量的树并统计指定子树 | 基础 | [二叉树基础 Binary Tree Basics](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/) | [打开演示](https://wuhy80.github.io/algorithm/n-ary-tree/) |
| [集合与映射 ADT Set / Map](https://github.com/wuhy80/algorithm/tree/main/set-map-adt/) | 演示唯一键集合、键值映射及增删查操作的语义差异 | 基础 | [静态数组 Static Array](https://github.com/wuhy80/algorithm/tree/main/static-array/) | [打开演示](https://wuhy80.github.io/algorithm/set-map-adt/) |
| [开放寻址哈希表 Open Addressing](https://github.com/wuhy80/algorithm/tree/main/open-addressing-hash-table/) | 可视化线性探测、哈希冲突、墓碑删除与负载因子 | 进阶 | [哈希表 Hash Table](https://github.com/wuhy80/algorithm/tree/main/hash-table/)、[静态数组 Static Array](https://github.com/wuhy80/algorithm/tree/main/static-array/) | [打开演示](https://wuhy80.github.io/algorithm/open-addressing-hash-table/) |
| [图的表示 Graph Representations](https://github.com/wuhy80/algorithm/tree/main/graph-representations/) | 在边列表、邻接表和邻接矩阵之间逐步转换同一张图 | 基础 | [集合与映射 ADT Set / Map](https://github.com/wuhy80/algorithm/tree/main/set-map-adt/)、[二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | [打开演示](https://wuhy80.github.io/algorithm/graph-representations/) |
| [字符串构建器 String Builder](https://github.com/wuhy80/algorithm/tree/main/string-builder/) | 以可变字符缓冲区演示插入、删除、追加与容量增长 | 基础 | [动态数组 Dynamic Array](https://github.com/wuhy80/algorithm/tree/main/dynamic-array/) | [打开演示](https://wuhy80.github.io/algorithm/string-builder/) |
| [括号匹配 Parentheses Matching](https://github.com/wuhy80/algorithm/tree/main/parentheses-matching/) | 逐字符压栈与配对出栈并定位首个非法括号 | 基础 | [栈 Stack](https://github.com/wuhy80/algorithm/tree/main/stack/) | [打开演示](https://wuhy80.github.io/algorithm/parentheses-matching/) |

## 高级查询与树分解

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [点分治 Centroid Decomposition](https://github.com/wuhy80/algorithm/tree/main/centroid-decomposition/) | 反复寻找重心、移除重心并递归处理各个剩余连通块。 | 高级 | [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | [打开演示](https://wuhy80.github.io/algorithm/centroid-decomposition/) |
| [可回滚并查集 Rollback DSU](https://github.com/wuhy80/algorithm/tree/main/rollback-union-find/) | 记录每次合并修改，通过快照按相反顺序恢复父节点与集合大小。 | 高级 | [并查集 Union-Find](https://github.com/wuhy80/algorithm/tree/main/union-find/) | [打开演示](https://wuhy80.github.io/algorithm/rollback-union-find/) |
| [莫队算法 Mo’s Algorithm](https://github.com/wuhy80/algorithm/tree/main/mo-algorithm/) | 分块重排离线区间查询，展示左右指针增删元素和答案维护。 | 高级 | [平方根分解 Sqrt Decomposition](https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/) | [打开演示](https://wuhy80.github.io/algorithm/mo-algorithm/) |
| [平方根分解 Sqrt Decomposition](https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/) | 数组按约 √n 大小分块，整块聚合与边缘扫描共同完成查询。 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/sqrt-decomposition/) |
| [重链剖分 Heavy-Light Decomposition](https://github.com/wuhy80/algorithm/tree/main/heavy-light-decomposition/) | 按最大子树划分重链，并把树上路径拆成少量连续区间求和。 | 高级 | [最近公共祖先 LCA](https://github.com/wuhy80/algorithm/tree/main/lowest-common-ancestor/)、[线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) | [打开演示](https://wuhy80.github.io/algorithm/heavy-light-decomposition/) |
| [Euler Tour Tree](https://github.com/wuhy80/algorithm/tree/main/euler-tour-tree/) | 把树的进入/退出事件存入隐式 Treap，通过序列切分合并移动整棵子树。 | 高级 | [Treap 随机平衡树](https://github.com/wuhy80/algorithm/tree/main/treap/)、[树形 DP Tree DP](https://github.com/wuhy80/algorithm/tree/main/tree-dp/) | [打开演示](https://wuhy80.github.io/algorithm/euler-tour-tree/) |
| [Link-Cut Tree](https://github.com/wuhy80/algorithm/tree/main/link-cut-tree/) | 通过 Access、Makeroot 与 Splay 动态维护首选路径和路径聚合值。 | 高级 | [伸展树 Splay Tree](https://github.com/wuhy80/algorithm/tree/main/splay-tree/)、[重链剖分 Heavy-Light Decomposition](https://github.com/wuhy80/algorithm/tree/main/heavy-light-decomposition/) | [打开演示](https://wuhy80.github.io/algorithm/link-cut-tree/) |
| [Wavelet Matrix](https://github.com/wuhy80/algorithm/tree/main/wavelet-matrix/) | 逐位稳定划分数列并映射查询区间，演示范围第 K 小的下降过程。 | 高级 | [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)、[平方根分解 Sqrt Decomposition](https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/) | [打开演示](https://wuhy80.github.io/algorithm/wavelet-matrix/) |
| [不相交稀疏表 Disjoint Sparse Table](https://github.com/wuhy80/algorithm/tree/main/disjoint-sparse-table/) | 按最高不同位组合左右预计算段，实现通用结合运算静态查询 | 高级 | [稀疏表 Sparse Table](https://github.com/wuhy80/algorithm/tree/main/sparse-table/) | [打开演示](https://wuhy80.github.io/algorithm/disjoint-sparse-table/) |
| [归并排序树 Merge Sort Tree](https://github.com/wuhy80/algorithm/tree/main/merge-sort-tree/) | 线段树节点保存有序子数组，以二分回答区间顺序统计 | 高级 | [线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/)、[归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | [打开演示](https://wuhy80.github.io/algorithm/merge-sort-tree/) |
| [Li Chao Tree](https://github.com/wuhy80/algorithm/tree/main/li-chao-tree/) | 在线维护直线集合并查询指定横坐标的最优值 | 高级 | [斜率优化 Convex Hull Trick](https://github.com/wuhy80/algorithm/tree/main/convex-hull-trick/) | [打开演示](https://wuhy80.github.io/algorithm/li-chao-tree/) |
| [Segment Tree Beats](https://github.com/wuhy80/algorithm/tree/main/segment-tree-beats/) | 维护最大值、次大值和计数，批量执行区间 chmin | 高级 | [懒标记线段树](https://github.com/wuhy80/algorithm/tree/main/lazy-segment-tree/) | [打开演示](https://wuhy80.github.io/algorithm/segment-tree-beats/) |
| [DSU on Tree](https://github.com/wuhy80/algorithm/tree/main/dsu-on-tree/) | 保留重子树统计并把小集合合并进大集合 | 高级 | [树形 DP Tree DP](https://github.com/wuhy80/algorithm/tree/main/tree-dp/) | [打开演示](https://wuhy80.github.io/algorithm/dsu-on-tree/) |
| [离线动态连通性 Offline Dynamic Connectivity](https://github.com/wuhy80/algorithm/tree/main/offline-dynamic-connectivity/) | 时间线段树配合可回滚并查集处理边的增删与查询 | 高级 | [可回滚并查集 Rollback DSU](https://github.com/wuhy80/algorithm/tree/main/rollback-union-find/)、[线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) | [打开演示](https://wuhy80.github.io/algorithm/offline-dynamic-connectivity/) |

## 空间数据结构

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [八叉树 Octree](https://github.com/wuhy80/algorithm/tree/main/octree/) | 容量超限的三维立方体沿三个坐标轴同时二分，递归形成八个子体素。 | 高级 | [四叉树 Quadtree](https://github.com/wuhy80/algorithm/tree/main/quadtree/) | [打开演示](https://wuhy80.github.io/algorithm/octree/) |
| [四叉树 Quadtree](https://github.com/wuhy80/algorithm/tree/main/quadtree/) | 二维区域递归四分、点插入和矩形范围查询 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/quadtree/) |
| [BVH 层次包围盒](https://github.com/wuhy80/algorithm/tree/main/bounding-volume-hierarchy/) | 按最长轴中分对象并递归建立包围盒，查询时跳过不相交分支。 | 高级 | [KD 树 K-D Tree](https://github.com/wuhy80/algorithm/tree/main/kd-tree/) | [打开演示](https://wuhy80.github.io/algorithm/bounding-volume-hierarchy/) |
| [KD 树 K-D Tree](https://github.com/wuhy80/algorithm/tree/main/kd-tree/) | 交替坐标轴中位划分、最近邻搜索与空间剪枝 | 进阶 | [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | [打开演示](https://wuhy80.github.io/algorithm/kd-tree/) |
| [R 树 R-Tree](https://github.com/wuhy80/algorithm/tree/main/r-tree/) | 空间矩形插入、最小包围盒分组和范围查询 | 高级 | [B 树 B-Tree](https://github.com/wuhy80/algorithm/tree/main/b-tree/) | [打开演示](https://wuhy80.github.io/algorithm/r-tree/) |

## 计算几何

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [半平面交 Half-Plane Intersection](https://github.com/wuhy80/algorithm/tree/main/half-plane-intersection/) | 逐个用线性不等式边界裁剪凸多边形，保留可行区域并生成交点。 | 高级 | [凸包 Convex Hull](https://github.com/wuhy80/algorithm/tree/main/convex-hull/)、[点在多边形内](https://github.com/wuhy80/algorithm/tree/main/point-in-polygon/) | [打开演示](https://wuhy80.github.io/algorithm/half-plane-intersection/) |
| [点在多边形内](https://github.com/wuhy80/algorithm/tree/main/point-in-polygon/) | 水平射线逐边求交并按交点奇偶实时判定 | 进阶 | [凸包 Convex Hull](https://github.com/wuhy80/algorithm/tree/main/convex-hull/) | [打开演示](https://wuhy80.github.io/algorithm/point-in-polygon/) |
| [扫描线线段交点](https://github.com/wuhy80/algorithm/tree/main/sweep-line-intersection/) | 端点事件、活动线段集合与交点逐步发现 | 进阶 | [堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | [打开演示](https://wuhy80.github.io/algorithm/sweep-line-intersection/) |
| [凸包 Convex Hull](https://github.com/wuhy80/algorithm/tree/main/convex-hull/) | 按坐标排序、叉积判断、栈弹出及上下凸包合并 | 基础 | [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | [打开演示](https://wuhy80.github.io/algorithm/convex-hull/) |
| [旋转卡壳 Rotating Calipers](https://github.com/wuhy80/algorithm/tree/main/rotating-calipers/) | 凸包边与对踵点同步推进并求最远点对 | 进阶 | [凸包 Convex Hull](https://github.com/wuhy80/algorithm/tree/main/convex-hull/) | [打开演示](https://wuhy80.github.io/algorithm/rotating-calipers/) |
| [最近点对 Closest Pair](https://github.com/wuhy80/algorithm/tree/main/closest-pair/) | 点集分治、中线条带候选和最近距离持续收缩 | 进阶 | [归并排序 Merge Sort](https://github.com/wuhy80/algorithm/tree/main/merge-sort/) | [打开演示](https://wuhy80.github.io/algorithm/closest-pair/) |
| [Delaunay 三角剖分](https://github.com/wuhy80/algorithm/tree/main/delaunay-triangulation/) | 新点插入、坏三角形移除与空腔边界重建 | 高级 | [凸包 Convex Hull](https://github.com/wuhy80/algorithm/tree/main/convex-hull/) | [打开演示](https://wuhy80.github.io/algorithm/delaunay-triangulation/) |
| [Voronoi 与 Lloyd 松弛](https://github.com/wuhy80/algorithm/tree/main/voronoi-relaxation/) | 泰森多边形随控制点移动，并逐步趋向均匀分布 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/voronoi-relaxation/) |

## 数论、变换与线性代数

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/) | 当前质数选取、倍数标记与质数集合逐步收敛 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/sieve-of-eratosthenes/) |
| [分段筛 Segmented Sieve](https://github.com/wuhy80/algorithm/tree/main/segmented-sieve/) | 先生成 √R 内基础质数，再仅标记目标区间中的对应倍数。 | 进阶 | [埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/) | [打开演示](https://wuhy80.github.io/algorithm/segmented-sieve/) |
| [傅里叶旋轮 Fourier Epicycles](https://github.com/wuhy80/algorithm/tree/main/fourier-epicycles/) | 多级旋转向量逐步重建并绘制复杂轮廓 | 进阶 | [快速傅里叶变换 FFT](https://github.com/wuhy80/algorithm/tree/main/fft/) | [打开演示](https://wuhy80.github.io/algorithm/fourier-epicycles/) |
| [高斯消元 Gaussian Elimination](https://github.com/wuhy80/algorithm/tree/main/gaussian-elimination/) | 通过部分选主元、行归一化和逐列消元得到行最简形与唯一解。 | 进阶 | [矩阵快速幂 Matrix Exponentiation](https://github.com/wuhy80/algorithm/tree/main/matrix-exponentiation/) | [打开演示](https://wuhy80.github.io/algorithm/gaussian-elimination/) |
| [矩阵快速幂 Matrix Exponentiation](https://github.com/wuhy80/algorithm/tree/main/matrix-exponentiation/) | 按指数二进制位重复平方方阵，并在置位时乘入结果矩阵。 | 进阶 | [快速模幂 Modular Exponentiation](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/) | [打开演示](https://wuhy80.github.io/algorithm/matrix-exponentiation/) |
| [快速傅里叶变换 FFT](https://github.com/wuhy80/algorithm/tree/main/fft/) | 位逆序排列、分层蝶形合并和频域幅度生成 | 高级 | [矩阵快速幂 Matrix Exponentiation](https://github.com/wuhy80/algorithm/tree/main/matrix-exponentiation/) | [打开演示](https://wuhy80.github.io/algorithm/fft/) |
| [快速模幂 Modular Exponentiation](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/) | 指数二进制位读取、底数平方和模结果累积 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/modular-exponentiation/) |
| [扩展欧几里得 Extended Euclidean](https://github.com/wuhy80/algorithm/tree/main/extended-euclidean/) | 求余迭代同时更新 Bézout 系数，持续验证线性组合恒等式。 | 进阶 | [欧几里得算法 Euclidean](https://github.com/wuhy80/algorithm/tree/main/euclidean-algorithm/) | [打开演示](https://wuhy80.github.io/algorithm/extended-euclidean/) |
| [欧几里得算法 Euclidean](https://github.com/wuhy80/algorithm/tree/main/euclidean-algorithm/) | 商余数等式迭代、参数替换和最大公约数收敛 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/euclidean-algorithm/) |
| [欧拉函数筛 Totient](https://github.com/wuhy80/algorithm/tree/main/euler-totient/) | 质数识别、倍数 φ 值批量更新与目标结果收敛 | 进阶 | [埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/) | [打开演示](https://wuhy80.github.io/algorithm/euler-totient/) |
| [欧拉线性筛 Linear Sieve](https://github.com/wuhy80/algorithm/tree/main/linear-sieve/) | 记录最小质因子，让每个合数仅被筛除一次。 | 基础 | [埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/) | [打开演示](https://wuhy80.github.io/algorithm/linear-sieve/) |
| [数论变换 NTT](https://github.com/wuhy80/algorithm/tree/main/ntt/) | 在有限域中执行正逆蝶形变换，精确计算整数多项式卷积。 | 高级 | [快速傅里叶变换 FFT](https://github.com/wuhy80/algorithm/tree/main/fft/)、[快速模幂 Modular Exponentiation](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/) | [打开演示](https://wuhy80.github.io/algorithm/ntt/) |
| [质因数分解 Prime Factorization](https://github.com/wuhy80/algorithm/tree/main/prime-factorization/) | 从最小质因子开始反复试除，持续缩小剩余整数并输出标准分解。 | 基础 | [埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/) | [打开演示](https://wuhy80.github.io/algorithm/prime-factorization/) |
| [中国剩余定理 CRT](https://github.com/wuhy80/algorithm/tree/main/chinese-remainder-theorem/) | 部分模数、乘法逆元与同余方程逐项合并 | 进阶 | [扩展欧几里得 Extended Euclidean](https://github.com/wuhy80/algorithm/tree/main/extended-euclidean/) | [打开演示](https://wuhy80.github.io/algorithm/chinese-remainder-theorem/) |
| [Baby-Step Giant-Step 离散对数](https://github.com/wuhy80/algorithm/tree/main/baby-step-giant-step/) | 把指数拆成约 √m 的婴儿步与巨人步，并用哈希表寻找相遇值。 | 高级 | [快速模幂 Modular Exponentiation](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/)、[扩展欧几里得 Extended Euclidean](https://github.com/wuhy80/algorithm/tree/main/extended-euclidean/) | [打开演示](https://wuhy80.github.io/algorithm/baby-step-giant-step/) |
| [Miller-Rabin 素性测试](https://github.com/wuhy80/algorithm/tree/main/miller-rabin/) | n-1 分解、模幂底数测试与合数见证识别 | 高级 | [快速模幂 Modular Exponentiation](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/) | [打开演示](https://wuhy80.github.io/algorithm/miller-rabin/) |
| [Pollard-Rho 因数分解](https://github.com/wuhy80/algorithm/tree/main/pollard-rho/) | 在模 n 伪随机游走中使用快慢指针，通过差值的 GCD 发现非平凡因子。 | 高级 | [Miller-Rabin 素性测试](https://github.com/wuhy80/algorithm/tree/main/miller-rabin/)、[Floyd 快慢指针判环](https://github.com/wuhy80/algorithm/tree/main/floyd-cycle-detection/) | [打开演示](https://wuhy80.github.io/algorithm/pollard-rho/) |

## 压缩算法

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [算术编码 Arithmetic Coding](https://github.com/wuhy80/algorithm/tree/main/arithmetic-coding/) | 符号概率驱动 low/high 编码区间持续收缩 | 高级 | [Huffman 编码](https://github.com/wuhy80/algorithm/tree/main/huffman-coding/) | [打开演示](https://wuhy80.github.io/algorithm/arithmetic-coding/) |
| [游程编码 Run-Length Encoding](https://github.com/wuhy80/algorithm/tree/main/run-length-encoding/) | 把连续相同字符合并成符号与重复长度，动态显示游程形成。 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/run-length-encoding/) |
| [Burrows-Wheeler 变换 BWT](https://github.com/wuhy80/algorithm/tree/main/burrows-wheeler-transform/) | 生成并排序循环旋转，提取最后一列和主索引展示字符聚集。 | 高级 | [后缀数组与 LCP](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/) | [打开演示](https://wuhy80.github.io/algorithm/burrows-wheeler-transform/) |
| [Huffman 编码](https://github.com/wuhy80/algorithm/tree/main/huffman-coding/) | 字符频率队列、最低频节点合并和前缀编码树生成 | 进阶 | [堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | [打开演示](https://wuhy80.github.io/algorithm/huffman-coding/) |
| [LZ77 压缩](https://github.com/wuhy80/algorithm/tree/main/lz77/) | 搜索窗口、最长重复匹配与距离长度令牌输出 | 进阶 | [滑动窗口 Sliding Window](https://github.com/wuhy80/algorithm/tree/main/sliding-window/) | [打开演示](https://wuhy80.github.io/algorithm/lz77/) |
| [LZW 压缩](https://github.com/wuhy80/algorithm/tree/main/lzw/) | 短语词典动态扩展和编码编号依次输出 | 进阶 | [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/) | [打开演示](https://wuhy80.github.io/algorithm/lzw/) |

## 生成、优化与模拟

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [波函数坍缩 Wave Function Collapse](https://github.com/wuhy80/algorithm/tree/main/wave-function-collapse/) | 网格按最低熵逐格坍缩，约束向周围持续传播 | 高级 | 无 | [打开演示](https://wuhy80.github.io/algorithm/wave-function-collapse/) |
| [反应扩散 Reaction-Diffusion](https://github.com/wuhy80/algorithm/tree/main/reaction-diffusion/) | Gray-Scott 模型实时生长斑点、条纹和有机纹理 | 高级 | 无 | [打开演示](https://wuhy80.github.io/algorithm/reaction-diffusion/) |
| [康威生命游戏 Conway's Game of Life](https://github.com/wuhy80/algorithm/tree/main/game-of-life/) | 细胞在离散规则下繁衍、消亡并产生复杂结构 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/game-of-life/) |
| [粒子群优化 Particle Swarm Optimization](https://github.com/wuhy80/algorithm/tree/main/particle-swarm/) | 粒子在目标函数地形中移动并逐步汇聚到最优区域 | 高级 | [遗传火箭 Genetic Rockets](https://github.com/wuhy80/algorithm/tree/main/genetic-rockets/) | [打开演示](https://wuhy80.github.io/algorithm/particle-swarm/) |
| [迷宫生成 Maze Generation](https://github.com/wuhy80/algorithm/tree/main/maze-generation/) | 墙体逐步开凿形成迷宫，并动态展示寻路过程 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/maze-generation/) |
| [遗传火箭 Genetic Rockets](https://github.com/wuhy80/algorithm/tree/main/genetic-rockets/) | 多代火箭飞向目标，展示选择、交叉、变异和适应度进化 | 高级 | 无 | [打开演示](https://wuhy80.github.io/algorithm/genetic-rockets/) |
| [蚁群优化 Ant Colony Optimization](https://github.com/wuhy80/algorithm/tree/main/ant-colony/) | 蚂蚁探索路径、信息素沉积与挥发、最短路线逐渐显现 | 高级 | [Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | [打开演示](https://wuhy80.github.io/algorithm/ant-colony/) |
| [Boids 群鸟算法](https://github.com/wuhy80/algorithm/tree/main/boids/) | 鸟群实时聚合、分离、同步、避障和鼠标交互 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/boids/) |
| [N 体引力 N-body Simulation](https://github.com/wuhy80/algorithm/tree/main/n-body/) | 星体受引力运动、形成轨道与拖尾，并展示引力积分过程 | 高级 | 无 | [打开演示](https://wuhy80.github.io/algorithm/n-body/) |
| [Perlin 噪声流场 Flow Field](https://github.com/wuhy80/algorithm/tree/main/flow-field/) | 大量粒子沿连续噪声向量场流动并留下动态轨迹 | 进阶 | 无 | [打开演示](https://wuhy80.github.io/algorithm/flow-field/) |

## 机器学习与神经网络

| 算法 / 数据结构 | 动画表现 | 难度 | 先修内容 | 演示 |
| --- | --- | --- | --- | --- |
| [激活函数 Activation Functions](https://github.com/wuhy80/algorithm/tree/main/activation-functions/) | 同步绘制 Sigmoid、Tanh、ReLU 与 Leaky ReLU 的输出和局部导数 | 基础 | 无 | [打开演示](https://wuhy80.github.io/algorithm/activation-functions/) |
| [感知机分类 Perceptron](https://github.com/wuhy80/algorithm/tree/main/perceptron-classifier/) | 逐样本检查误分类并更新权重，观察二维决策边界如何旋转和平移 | 基础 | [激活函数 Activation Functions](https://github.com/wuhy80/algorithm/tree/main/activation-functions/) | [打开演示](https://wuhy80.github.io/algorithm/perceptron-classifier/) |
| [神经网络前向传播 Forward Pass](https://github.com/wuhy80/algorithm/tree/main/neural-network-forward-pass/) | 沿连接逐层计算加权和、偏置与激活值，展示输入如何变成预测 | 进阶 | [激活函数 Activation Functions](https://github.com/wuhy80/algorithm/tree/main/activation-functions/)、[二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | [打开演示](https://wuhy80.github.io/algorithm/neural-network-forward-pass/) |
| [反向传播 Backpropagation](https://github.com/wuhy80/algorithm/tree/main/backpropagation/) | 在小型网络上交替展示前向预测、损失、梯度回传与参数更新 | 进阶 | [神经网络前向传播 Forward Pass](https://github.com/wuhy80/algorithm/tree/main/neural-network-forward-pass/) | [打开演示](https://wuhy80.github.io/algorithm/backpropagation/) |
| [神经网络优化器 Optimizers](https://github.com/wuhy80/algorithm/tree/main/optimizer-comparison/) | 在同一狭长损失面上比较 SGD、Momentum 与 Adam 的参数更新轨迹 | 进阶 | [反向传播 Backpropagation](https://github.com/wuhy80/algorithm/tree/main/backpropagation/) | [打开演示](https://wuhy80.github.io/algorithm/optimizer-comparison/) |
| [卷积神经网络 CNN](https://github.com/wuhy80/algorithm/tree/main/convolutional-neural-network/) | 让卷积核滑过像素网格，逐格显示乘加过程、感受野和特征图 | 进阶 | [神经网络前向传播 Forward Pass](https://github.com/wuhy80/algorithm/tree/main/neural-network-forward-pass/)、[二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | [打开演示](https://wuhy80.github.io/algorithm/convolutional-neural-network/) |
| [循环神经网络 RNN](https://github.com/wuhy80/algorithm/tree/main/recurrent-neural-network/) | 按时间展开隐藏状态，观察新输入与历史记忆如何共同生成当前表示 | 进阶 | [神经网络前向传播 Forward Pass](https://github.com/wuhy80/algorithm/tree/main/neural-network-forward-pass/) | [打开演示](https://wuhy80.github.io/algorithm/recurrent-neural-network/) |
| [Transformer 自注意力 Self-Attention](https://github.com/wuhy80/algorithm/tree/main/transformer-self-attention/) | 逐查询词生成注意力热力图，观察缩放点积与温度如何重新分配上下文权重 | 高级 | [神经网络前向传播 Forward Pass](https://github.com/wuhy80/algorithm/tree/main/neural-network-forward-pass/)、[二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/) | [打开演示](https://wuhy80.github.io/algorithm/transformer-self-attention/) |
| [自动编码器 Autoencoder](https://github.com/wuhy80/algorithm/tree/main/autoencoder/) | 把带噪像素压缩进低维瓶颈，再重建图像并实时观察重建误差 | 高级 | [反向传播 Backpropagation](https://github.com/wuhy80/algorithm/tree/main/backpropagation/)、[神经网络优化器 Optimizers](https://github.com/wuhy80/algorithm/tree/main/optimizer-comparison/) | [打开演示](https://wuhy80.github.io/algorithm/autoencoder/) |
| [生成对抗网络 GAN](https://github.com/wuhy80/algorithm/tree/main/generative-adversarial-network/) | 让生成器分布与判别器交替博弈，动态观察真假密度和两类损失 | 高级 | [反向传播 Backpropagation](https://github.com/wuhy80/algorithm/tree/main/backpropagation/)、[神经网络优化器 Optimizers](https://github.com/wuhy80/algorithm/tree/main/optimizer-comparison/) | [打开演示](https://wuhy80.github.io/algorithm/generative-adversarial-network/) |

## 目录规范

每个算法目录至少包含：

- `index.html`：页面结构
- `styles.css`：独立样式
- `app.js`：算法实现与动画逻辑
- `README.md`：算法说明、问题定义和复杂度

根目录的 `catalog.json` 是首页和文档的统一数据源。更新清单后运行：

```powershell
node scripts/generate-readme.mjs
```
