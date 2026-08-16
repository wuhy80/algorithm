# SOS DP

## 算法是什么

逐位执行子集 Zeta 变换，一次计算所有状态的子集聚合

## 解决什么问题

高效求每个掩码所有子集或超集上的和、计数和最值。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n × 2^n)

## 先修内容

[子集和](https://github.com/wuhy80/algorithm/tree/main/subset-sum/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/sos-dp/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/sos-dp/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
