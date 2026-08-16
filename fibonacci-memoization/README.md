# 斐波那契记忆化 Fibonacci Memoization

## 算法是什么

展示递归子问题、缓存命中以及重复计算被消除的过程

## 解决什么问题

通过缓存已经求出的子问题，把指数递归降为线性时间。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(n)，空间 O(n)

## 先修内容

[递归与调用栈](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/fibonacci-memoization/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/fibonacci-memoization/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
