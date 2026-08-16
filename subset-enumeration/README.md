# 子集枚举 Subset Enumeration

## 算法是什么

对每个元素展示选与不选两个分支并输出幂集

## 解决什么问题

枚举集合的全部子集，为子集和、状态压缩和组合搜索提供基础。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(n·2ⁿ)，递归空间 O(n)

## 先修内容

[递归与调用栈](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/subset-enumeration/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/subset-enumeration/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
