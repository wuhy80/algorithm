# 图的表示 Graph Representations

## 算法是什么

在边列表、邻接表和邻接矩阵之间逐步转换同一张图

## 解决什么问题

根据稀疏度和算法访问模式选择合适的图存储方式。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

邻接表空间 O(V+E)，邻接矩阵空间 O(V²)

## 先修内容

[集合与映射](https://github.com/wuhy80/algorithm/tree/main/set-map-adt/)、[二维数组与矩阵](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/graph-representations/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/graph-representations/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
