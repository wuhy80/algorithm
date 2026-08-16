# 朴素字符串匹配 Naive String Search

## 算法是什么

逐个对齐模式串并逐字符比较每个候选窗口

## 解决什么问题

在文本中查找模式串的全部出现位置，并建立字符串匹配的基本模型。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

最坏时间 O((n-m+1)m)，空间 O(1)

## 先修内容

[静态数组](https://github.com/wuhy80/algorithm/tree/main/static-array/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/naive-string-search/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/naive-string-search/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
