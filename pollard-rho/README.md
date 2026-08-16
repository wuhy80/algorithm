# Pollard-Rho 因数分解

## 算法是什么

在模 n 伪随机游走中使用快慢指针，通过差值的 GCD 发现非平凡因子。

## 解决什么问题

高效分解试除法难以处理的大合数，常与 Miller-Rabin 配合。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

期望 O(n^(1/4))

## 先修内容

[Miller-Rabin](https://github.com/wuhy80/algorithm/tree/main/miller-rabin/)、[Floyd](https://github.com/wuhy80/algorithm/tree/main/floyd-cycle-detection/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/pollard-rho/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/pollard-rho/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
