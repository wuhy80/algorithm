# 组合生成 Combination Generation

## 算法是什么

用起始下标剪去顺序重复并生成固定大小组合

## 解决什么问题

从 n 个互异元素中枚举所有大小为 k 的无序选择。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

输出规模 O(C(n,k)·k)，递归空间 O(k)

## 先修内容

[递归与调用栈](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/combination-generation/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/combination-generation/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
