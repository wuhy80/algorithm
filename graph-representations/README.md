# 图的表示 Graph Representations

> 在边列表、邻接表和邻接矩阵之间逐步转换同一张图

## 先抓住一句话

**图的表示 Graph Representations** 属于图数据建模基础。它比较边列表、邻接表和邻接矩阵的存储成本与访问方式。

学习时只盯住两件事：**当前状态表示什么**，以及**这一步为什么可以排除其他可能**。演示中的颜色、指针、队列、区间或节点变化，都是这两个问题的可视化表达。

## 为什么需要它

同一张图可以用不同结构表示，选择会直接影响枚举邻边、判断某条边是否存在以及内存占用。

表示转换必须保留顶点集合、边方向、权重和平行边语义，不能只保证画面看起来相同。

## 心智模型

边列表按边组织数据；邻接表按起点聚合邻边；邻接矩阵用二维下标直接表示顶点对关系。

面对新题时，不要先问“该套哪个模板”，先问：

1. 输入中有什么结构可以利用，例如有序性、连续区间、树形依赖、图的边或重复子问题？
2. 当前保存的状态是否足以决定下一步？
3. 哪些候选已经可以被严格证明不可能，因而永远不用再看？

## 核心不变量

> 三种表示必须编码同一组顶点和边；有向边只写入规定方向，无向边在邻接结构中对称出现，但仍代表一条逻辑边。

所谓不变量，就是算法每一步开始和结束时都必须为真的事实。调试 **图的表示 Graph Representations** 时，最有效的方法不是盯着最终答案，而是在每次单步后检查这条不变量。只要某一帧不再满足它，错误通常就在上一帧的边界更新、状态转移或数据结构维护中。

## 算法步骤

1. 规范化顶点编号，并读取每条边的端点、方向和可选权重。
2. 边列表直接保存边记录。
3. 邻接表把边追加到起点列表；无向图还要追加反向邻接项。
4. 邻接矩阵在对应单元格记录存在性、数量或权重。

演示把这些步骤保存为一系列状态快照。先单步执行，确认自己能预测下一帧，再使用连续播放。若只看动画而不预测，容易记住颜色变化，却没有真正掌握决策依据。

## 框架伪代码

下面的伪代码刻意忽略页面绘制和工程细节，只保留这类算法最值得迁移的骨架：

```text
for edge (u, v, weight):
    edge_list.append((u, v, weight))
    adjacency_list[u].append((v, weight))
    adjacency_matrix[u][v] = weight
    if graph is undirected:
        adjacency_list[v].append((u, weight))
        adjacency_matrix[v][u] = weight
```

把伪代码映射到本目录的 `app.js` 时，可以按“解析输入 → 初始化状态 → 生成每一步 → 更新指标 → Canvas 绘制”的顺序阅读。算法逻辑负责决定状态，绘图逻辑只负责把状态呈现出来，两者不要混在一起理解。

## 跟着演示手算

1. 打开页面后先暂停，抄下初始输入，并写出你认为最重要的状态变量。
2. 点击一次“单步”前，先根据不变量预测哪些值、节点、边或区间会改变。
3. 对照状态栏观察“在边列表、邻接表和邻接矩阵之间逐步转换同一张图”是否正在发生，并解释为什么没有选择其他候选。
4. 到达终态后只改一个边界条件，例如空输入、重复值、极端顺序、断开的图或最小规模，再重新运行。
5. 最后尝试不看动画，只根据伪代码复现同一过程；能独立写出状态变化才算真正掌握。

## 复杂度怎么分析

**结论：邻接表空间 O(V+E)，邻接矩阵空间 O(V²)**

不要只背大 O。分析时分三步：先数一共有多少个状态或元素，再数每个状态被处理多少次，最后把排序、堆操作、哈希查询、递归深度或额外表格单独计入。若算法具有摊还或期望复杂度，还要说明“总成本如何分摊”或“随机性假设是什么”。

## 常见错误

- 有向边被错误地双向加入，改变可达关系。
- 用单个矩阵值表示平行边时没有明确覆盖、求和还是取最小权重。
- 只从边收集顶点，漏掉没有任何边的孤立顶点。
- 只用默认样例验证，没有测试空结构、单元素、重复值、断开输入或最大边界。
- 把演示中的视觉位置当作算法状态；真正应该验证的是数据、索引、距离、计数或引用关系。

## 什么时候使用

适合：邻接表适合稀疏图和邻边遍历，邻接矩阵适合稠密图和 O(1) 边查询，边列表适合逐边算法与输入输出。

不适合：不存在一种表示对所有操作都最优；应根据图的稀疏度、更新方式和算法访问模式选择。

## 与其他算法的联系

- 先修内容：[集合与映射 ADT Set / Map](https://github.com/wuhy80/algorithm/tree/main/set-map-adt/)、[二维数组与矩阵 2D Array](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/)
- 直接后续：[无向图连通分量 Connected Components](https://github.com/wuhy80/algorithm/tree/main/connected-components/)、[无向图环检测 Undirected Cycle Detection](https://github.com/wuhy80/algorithm/tree/main/undirected-cycle-detection/)、[有向图环检测 Directed Cycle Detection](https://github.com/wuhy80/algorithm/tree/main/directed-cycle-detection/)、[二分图判定 Bipartite Check](https://github.com/wuhy80/algorithm/tree/main/bipartite-check/)
- 同类比较：[广度优先搜索 BFS](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[深度优先搜索 DFS](https://github.com/wuhy80/algorithm/tree/main/dfs/)、[静态数组 Static Array](https://github.com/wuhy80/algorithm/tree/main/static-array/)、[集合与映射 ADT](https://github.com/wuhy80/algorithm/tree/main/set-map-adt/)

学习顺序建议是：先用先修算法理解基础状态，再比较同类算法在“前提、维护信息、复杂度、是否可恢复答案”上的差异，最后进入把本算法作为组件的后续主题。

## 自测问题

- 不看代码，你能否用一句话说清 **图的表示 Graph Representations** 在每一步维护的状态？
- 对稀疏图和稠密图，邻接表与邻接矩阵的空间和边查询成本分别是什么？
- 把演示输入缩小到 3 到 6 个元素，能否在纸上预测下一帧再点击“单步”？
- 当前复杂度的主导项来自哪里？换一种底层数据结构后会怎样变化？

## 实现判定细节

- 邻接矩阵适合稠密图和 O(1) 判边，但空间固定为 O(V²)；邻接表按实际边数存储，更适合遍历稀疏图。
- 无向边在邻接表中通常保存两个方向，但逻辑边数仍只增加一次；需要删除或识别平行边时应保存边编号。
- 带权图的邻接项应同时保存终点与权重，不能把 `0` 既当作“无边”又当作合法零权边。
- 算法复杂度中的 O(V+E) 默认建立在邻接表上；若换成邻接矩阵，扫描所有邻居会变成 O(V²)。

## 文件与运行

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本学习指南

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/graph-representations/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/graph-representations/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
