# 平方根分解 Sqrt Decomposition

## 算法是什么

数组按约 √n 大小分块，整块聚合与边缘扫描共同完成查询。

## 解决什么问题

以简单分块支持数组区间查询和单点更新。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(√n) 每次操作

## 先修内容

无硬性先修要求，建议先熟悉页面中使用的基础数据结构。

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/sqrt-decomposition/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
