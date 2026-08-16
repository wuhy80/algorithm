# 0-1 BFS

## 算法是什么

双端队列按边权把节点加入队首或队尾，逐边展示距离松弛。

## 解决什么问题

在线性时间内求只有 0/1 边权图的单源最短路。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(V + E)

## 先修内容

[广度优先搜索](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[双端队列](https://github.com/wuhy80/algorithm/tree/main/deque/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/zero-one-bfs/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/zero-one-bfs/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
