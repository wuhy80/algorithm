# 八叉树 Octree

## 算法是什么

容量超限的三维立方体沿三个坐标轴同时二分，递归形成八个子体素。

## 解决什么问题

索引三维点云、体素与空间对象，并剪枝范围和邻近查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

平均 O(log n) 插入与查询

## 先修内容

[四叉树](https://github.com/wuhy80/algorithm/tree/main/quadtree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/octree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/octree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
