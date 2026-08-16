# 分治 DP 优化 Divide-and-Conquer DP Optimization

## 算法是什么

利用最优决策点单调性分治限制转移范围

## 解决什么问题

把分组 DP 中每层 O(n²) 的转移降低到 O(n log n) 或 O(n)。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

常见 O(k n log n)

## 先修内容

[矩阵链乘法](https://github.com/wuhy80/algorithm/tree/main/matrix-chain-multiplication/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/divide-conquer-dp-optimization/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/divide-conquer-dp-optimization/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
