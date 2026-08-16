# 内省排序 Introsort

## 算法是什么

快速排序过深时切换堆排序，小区间使用插入排序

## 解决什么问题

结合快速排序的平均性能与堆排序的最坏 O(n log n) 保证。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

最坏 O(n log n)，原地排序

## 先修内容

[快速排序](https://github.com/wuhy80/algorithm/tree/main/quick-sort/)、[堆排序](https://github.com/wuhy80/algorithm/tree/main/heap-sort/)、[插入排序](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/introsort/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/introsort/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
