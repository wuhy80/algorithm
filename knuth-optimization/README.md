# Knuth 优化

## 算法是什么

利用相邻区间最优分割点的夹逼关系缩小枚举范围

## 解决什么问题

把满足四边形不等式的区间 DP 从 O(n³) 优化到 O(n²)。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n²)

## 先修内容

[矩阵链乘法](https://github.com/wuhy80/algorithm/tree/main/matrix-chain-multiplication/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/knuth-optimization/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/knuth-optimization/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
