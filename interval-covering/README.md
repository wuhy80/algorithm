# 区间覆盖 Interval Covering

## 算法是什么

每轮从可衔接区间中选择右端点最远者，展示覆盖边界推进与缺口。

## 解决什么问题

使用尽量少的给定区间完整覆盖目标范围。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n log n)

## 先修内容

[活动选择](https://github.com/wuhy80/algorithm/tree/main/activity-selection/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/interval-covering/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/interval-covering/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
