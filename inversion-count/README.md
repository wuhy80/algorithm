# 逆序对统计 Inversion Count

## 算法是什么

在归并排序合并阶段累计跨区间逆序对

## 解决什么问题

衡量序列无序程度，并解决排列距离、排名差异和交换次数问题。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(n log n)，空间 O(n)

## 先修内容

[归并排序](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/inversion-count/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/inversion-count/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
