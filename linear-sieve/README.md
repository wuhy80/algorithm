# 欧拉线性筛 Linear Sieve

## 算法是什么

记录最小质因子，让每个合数仅被筛除一次。

## 解决什么问题

在线性时间生成给定上限内全部质数及每个整数的最小质因子。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n)

## 先修内容

[埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/linear-sieve/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/linear-sieve/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
