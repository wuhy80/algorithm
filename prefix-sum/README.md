# 前缀和 Prefix Sum

## 算法是什么

逐项建立前缀累计值，并用两个前缀值之差常数时间回答区间和。

## 解决什么问题

预处理静态数组，使大量区间求和查询从线性扫描降为常数时间。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n) 预处理 / O(1) 查询

## 先修内容

无硬性先修要求，建议先熟悉页面中使用的基础数据结构。

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/prefix-sum/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/prefix-sum/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
