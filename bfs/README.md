# BFS 广度优先搜索

广度优先搜索（Breadth-First Search，BFS）从一个起点出发，先访问距离为 1 的所有节点，再访问距离为 2、3……的节点。它使用先进先出队列保存已经发现但尚未展开的节点，因此会像水波一样逐层向外扩展。

## 解决什么问题

- 无权图中的最短路径与最少跳数问题。
- 社交网络中的关系层级、好友推荐和传播范围。
- 网格地图中的最短步数寻路。
- 网络爬取、依赖分析和有限深度探索。
- 判断图的连通性、计算节点层级和二分图检测。

只要所有边的代价相同，BFS 第一次到达某个节点时经过的边数就是最少的。边权不同则应使用 Dijkstra 或 A* 等算法。

## 算法原理

```text
enqueue(start)
mark start as discovered

while queue is not empty:
    current = dequeue()
    visit(current)
    for each neighbor of current:
        if neighbor is undiscovered:
            mark neighbor as discovered
            enqueue(neighbor)
```

节点必须在入队时标记为已发现，而不是出队时才标记，否则同一个节点可能被多个父节点重复加入队列。

## 复杂度

使用邻接表时，每个节点最多入队一次，每条边最多从两个方向各检查一次：

- 时间复杂度：`O(V + E)`。
- 空间复杂度：`O(V)`，用于访问标记、层级和队列。

其中 `V` 是节点数，`E` 是边数。若使用邻接矩阵，检查邻接点会使时间复杂度变为 `O(V²)`。

## 演示内容

- 动态调整节点数与额外连边密度，并生成新的连通图。
- 点击任意节点切换 BFS 起点。
- 播放、暂停、单步和重置完整遍历。
- 调整每秒执行步骤数。
- 用不同颜色区分未访问、队列中、当前和已访问节点。
- 实时显示访问数、队列长度、当前层级、访问顺序与帧率。

## 文件结构

```text
bfs/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## 使用方式

项目零依赖，直接用浏览器打开 `index.html` 即可，也可作为 GitHub Pages 静态页面发布。
