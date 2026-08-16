# 高斯消元 Gaussian Elimination

## 算法是什么

通过部分选主元、行归一化和逐列消元得到行最简形与唯一解。

## 解决什么问题

求解线性方程组、计算秩并判断解的存在性。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n³)

## 先修内容

[矩阵快速幂](https://github.com/wuhy80/algorithm/tree/main/matrix-exponentiation/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/gaussian-elimination/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/gaussian-elimination/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
