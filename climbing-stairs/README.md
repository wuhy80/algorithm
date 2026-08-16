# 爬楼梯动态规划 Climbing Stairs

## 算法是什么

逐阶合并前两级方案数并展示一维 DP 状态

## 解决什么问题

每次走一阶或两阶时，统计到达第 n 阶的不同走法数量。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(n)，可优化到空间 O(1)

## 先修内容

[斐波那契记忆化](https://github.com/wuhy80/algorithm/tree/main/fibonacci-memoization/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/climbing-stairs/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/climbing-stairs/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
