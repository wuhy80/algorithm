# 网格路径动态规划 Grid Path DP

## 算法是什么

按行填表并累加来自上方和左侧的无障碍路径数

## 解决什么问题

只能向右或向下移动时，统计网格起点到终点避开障碍的路径数量。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(rows × cols)，空间 O(rows × cols)

## 先修内容

[二维数组与矩阵](https://github.com/wuhy80/algorithm/tree/main/matrix-2d-array/)、[爬楼梯动态规划](https://github.com/wuhy80/algorithm/tree/main/climbing-stairs/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/grid-path-dp/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/grid-path-dp/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
