# Wavelet Matrix

## 算法是什么

逐位稳定划分数列并映射查询区间，演示范围第 K 小的下降过程。

## 解决什么问题

在静态整数序列上高效完成区间第 K 小、频次和秩查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(log σ) 每次查询

## 先修内容

[归并排序](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)、[平方根分解](https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/wavelet-matrix/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/wavelet-matrix/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
