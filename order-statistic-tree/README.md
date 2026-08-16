# 顺序统计树 Order Statistic Tree

## 算法是什么

在平衡搜索树节点维护子树规模，支持动态秩查询

## 解决什么问题

在集合持续插入和删除时查询第 k 小元素或一个键的排名。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

平衡实现下插入、删除和秩查询均为 O(log n)

## 先修内容

[红黑树](https://github.com/wuhy80/algorithm/tree/main/red-black-tree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/order-statistic-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/order-statistic-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
