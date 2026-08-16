# 网格搜索 Grid Search

## 算法是什么

把可通行单元格视为图节点并用 BFS 寻找最短路径

## 解决什么问题

在带障碍的二维网格中判断可达性并寻找起点到终点的最少步数。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(rows × cols)，空间 O(rows × cols)

## 先修内容

[广度优先搜索](https://github.com/wuhy80/algorithm/tree/main/bfs/)、[二维数组与矩阵](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/grid-search/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/grid-search/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
