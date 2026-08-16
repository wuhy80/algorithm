# 分支限界法 Branch and Bound

## 算法是什么

用乐观界剪除不可能优于当前解的组合搜索分支

## 解决什么问题

精确求解背包、旅行商、调度和整数规划等组合优化问题。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

最坏指数时间，实际性能取决于上界质量

## 先修内容

[0/1](https://github.com/wuhy80/algorithm/tree/main/knapsack-dp/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/branch-and-bound/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/branch-and-bound/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
