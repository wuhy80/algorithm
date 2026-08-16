# 算法可视化实验室

这个仓库以实时动画拆解算法和数据结构。每个项目都保存在独立目录中，包含可直接运行的网页演示、核心实现和中文 README，彼此之间没有运行依赖。

算法名称链接到 GitHub 源码目录；“打开演示”链接到可以直接体验的 GitHub Pages 页面。

## 查找与排序

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

## 图算法与回溯

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/) | 队列驱动搜索前沿逐层扩张，并重建起点到目标的最短步数路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/bfs/) |
| [深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/) | 栈与递归路径持续深入，遇到末路后回退探索其他分支 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/dfs/) |
| [Dijkstra 最短路径](https://github.com/wuhy80/algorithm/tree/main/dijkstra/) | 固定当前最短节点、逐边松弛距离并回溯最终路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/dijkstra/) |
| [Prim 最小生成树](https://github.com/wuhy80/algorithm/tree/main/prim-mst/) | 从树内节点向外扩张，每轮选择最轻割边 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/prim-mst/) |
| [Kruskal 最小生成树](https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/) | 按权重检查边，并用并查集接受或拒绝形成环的边 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/kruskal-mst/) |
| [拓扑排序 Topological Sort](https://github.com/wuhy80/algorithm/tree/main/topological-sort/) | 入度归零、队列变化、依赖边删除和有向环检测 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/topological-sort/) |
| [N 皇后 N-Queens](https://github.com/wuhy80/algorithm/tree/main/n-queens/) | 皇后逐行尝试摆放，冲突位置高亮并动态展示撤销回溯 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/n-queens/) |
| [数独回溯 Sudoku Backtracking](https://github.com/wuhy80/algorithm/tree/main/sudoku-backtracking/) | 候选数字尝试、约束冲突、错误分支撤销与完整解生成 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/sudoku-backtracking/) |

## 字符串与动态规划

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [KMP 字符串匹配](https://github.com/wuhy80/algorithm/tree/main/kmp-search/) | 构建 LPS 前缀表，失配时移动模式串而不回退文本指针 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/kmp-search/) |
| [0/1 背包 Knapsack](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/) | 状态表逐格比较选与不选，并回溯最优物品组合 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/knapsack-dp/) |
| [最长公共子序列 LCS](https://github.com/wuhy80/algorithm/tree/main/longest-common-subsequence/) | 二维状态表填充并沿最优路径回溯公共子序列 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/longest-common-subsequence/) |

## 数据结构

| 数据结构 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [栈 Stack](https://github.com/wuhy80/algorithm/tree/main/stack/) | 元素压栈、出栈、查看栈顶以及 Overflow / Underflow 状态 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/stack/) |
| [队列 Queue](https://github.com/wuhy80/algorithm/tree/main/queue/) | 循环数组中的入队、出队以及 Head / Tail 指针移动 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/queue/) |
| [链表 Linked List](https://github.com/wuhy80/algorithm/tree/main/linked-list/) | 节点插入、删除、查找与 next 指针重新连接 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/linked-list/) |
| [二叉搜索树 Binary Search Tree](https://github.com/wuhy80/algorithm/tree/main/binary-search-tree/) | 插入与查找路径逐层下降，删除后树结构重新连接 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/binary-search-tree/) |
| [AVL 平衡树](https://github.com/wuhy80/algorithm/tree/main/avl-tree/) | 插入后计算平衡因子，通过 LL、RR、LR、RL 旋转恢复平衡 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/avl-tree/) |
| [红黑树 Red-Black Tree](https://github.com/wuhy80/algorithm/tree/main/red-black-tree/) | 插入后的颜色修复、叔节点判断及左右旋转 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/red-black-tree/) |
| [堆与优先队列 Heap](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/) | 插入上浮、提取堆顶和替换后的向下调整 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/heap-priority-queue/) |
| [哈希表 Hash Table](https://github.com/wuhy80/algorithm/tree/main/hash-table/) | 哈希定位、碰撞链扫描以及键值插入、查找和删除 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/hash-table/) |
| [Trie 前缀树](https://github.com/wuhy80/algorithm/tree/main/trie/) | 字符路径共享、单词终点、插入、查找、删除及前缀判断 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/trie/) |
| [线段树 Segment Tree](https://github.com/wuhy80/algorithm/tree/main/segment-tree/) | 区间递归分解、完整覆盖节点选择和单点更新传播 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/segment-tree/) |
| [树状数组 Fenwick Tree](https://github.com/wuhy80/algorithm/tree/main/fenwick-tree/) | lowbit 覆盖范围以及查询、更新索引的跳转路径 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/fenwick-tree/) |
| [并查集 Union-Find](https://github.com/wuhy80/algorithm/tree/main/union-find/) | 父指针查找、按秩合并、路径压缩和连通性判断 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/union-find/) |

## 计算几何

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [凸包 Convex Hull](https://github.com/wuhy80/algorithm/tree/main/convex-hull/) | 按坐标排序、叉积判断、栈弹出及上下凸包合并 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/convex-hull/) |
| [Voronoi 与 Lloyd 松弛](https://github.com/wuhy80/algorithm/tree/main/voronoi-relaxation/) | 泰森多边形随控制点移动，并逐步趋向均匀分布 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/voronoi-relaxation/) |

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

1. 从线性查找、二分查找和基础排序理解比较、交换、分治与递归。
2. 通过栈、队列、链表掌握线性数据结构的状态变化。
3. 使用 BFS、DFS、最短路、生成树和回溯理解图搜索与约束。
4. 进入 BST、AVL、红黑树、Trie、线段树和树状数组，学习索引、平衡和区间维护。
5. 通过 KMP、背包和 LCS 掌握字符串预处理与动态规划状态转移。
6. 最后探索计算几何、图优化、群体智能、生成系统与物理模拟。

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
