# 合并区间 Merge Intervals

## 算法是什么

排序区间后逐个判断重叠并扩展当前覆盖范围

## 解决什么问题

把相互重叠的时间段或数值范围合并为最少的不相交区间。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

排序 O(n log n)，扫描 O(n)

## 先修内容

[归并排序](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/merge-intervals/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/merge-intervals/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
