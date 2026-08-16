# Segment Tree Beats

## 算法是什么

维护最大值、次大值和计数，批量执行区间 chmin

## 解决什么问题

支持普通懒标记无法直接处理的区间取最小值、取最大值与聚合查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

典型区间 chmin / sum 摊还 O(log² n)

## 先修内容

[懒标记线段树](https://github.com/wuhy80/algorithm/tree/main/lazy-segment-tree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/segment-tree-beats/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/segment-tree-beats/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
