# 笛卡尔树 Cartesian Tree

## 算法是什么

单调栈维护右脊，使中序次序等于原数组且节点同时满足最小堆序。

## 解决什么问题

把序列顺序与堆优先级结合，用于 RMQ、区间结构和后缀算法。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n) 构建

## 先修内容

[单调栈](https://github.com/wuhy80/algorithm/tree/main/monotonic-stack-queue/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/cartesian-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/cartesian-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
