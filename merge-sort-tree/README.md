# 归并排序树 Merge Sort Tree

## 算法是什么

线段树节点保存有序子数组，以二分回答区间顺序统计

## 解决什么问题

查询任意下标区间中小于某值的数量或静态第 k 小元素。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

构建 O(n log n)，计数查询 O(log² n)

## 先修内容

[线段树](https://github.com/wuhy80/algorithm/tree/main/segment-tree/)、[归并排序](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/merge-sort-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/merge-sort-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
