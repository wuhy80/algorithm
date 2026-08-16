# 动态数组 Dynamic Array

## 算法是什么

展示连续存储、容量扩张与尾部追加的摊还成本

## 解决什么问题

在保持随机访问能力的同时，让线性数组可以按需增长。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

访问 O(1) / 追加摊还 O(1) / 中间插入 O(n)

## 先修内容

无硬性先修要求，建议先熟悉页面中使用的基础数据结构。

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/dynamic-array/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/dynamic-array/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
