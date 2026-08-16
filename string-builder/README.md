# 字符串构建器 String Builder

## 算法是什么

以可变字符缓冲区演示插入、删除、追加与容量增长

## 解决什么问题

避免不可变字符串在连续编辑和拼接时反复分配并复制完整内容。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

尾部追加摊还 O(1)，中间插入 / 删除 O(n)

## 先修内容

[动态数组](https://github.com/wuhy80/algorithm/tree/main/dynamic-array/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/string-builder/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/string-builder/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
