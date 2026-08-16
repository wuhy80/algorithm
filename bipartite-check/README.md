# 二分图判定 Bipartite Check

## 算法是什么

通过 BFS 交替染色并展示产生冲突的同色边

## 解决什么问题

判断图能否分成两个集合且每条边跨集合，为匹配与二元约束建模提供基础。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(V+E)，空间 O(V)

## 先修内容

[广度优先搜索](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[图的表示](https://github.com/wuhy80/algorithm/tree/main/graph-representations/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/bipartite-check/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/bipartite-check/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
