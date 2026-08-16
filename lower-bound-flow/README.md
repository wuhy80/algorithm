# 有上下界网络流 Lower-bound Flow

## 算法是什么

消去边下界并用超级源汇检查节点流量需求

## 解决什么问题

求解每条边都有最小和最大容量限制的可行流与最大流。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

一次或常数次最大流计算

## 先修内容

[Dinic](https://github.com/wuhy80/algorithm/tree/main/dinic/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/lower-bound-flow/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/lower-bound-flow/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
