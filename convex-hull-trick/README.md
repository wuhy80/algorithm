# 斜率优化 Convex Hull Trick

## 算法是什么

把线性或二次 DP 转移转换成直线最值查询

## 解决什么问题

优化具有单调斜率或单调查询点的 DP 线性转移。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

单调条件下 O(n)，一般动态结构 O(n log n)

## 先修内容

[Kadane](https://github.com/wuhy80/algorithm/tree/main/kadane/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/convex-hull-trick/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/convex-hull-trick/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
