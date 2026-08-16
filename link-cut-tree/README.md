# Link-Cut Tree

## 算法是什么

通过 Access、Makeroot 与 Splay 动态维护首选路径和路径聚合值。

## 解决什么问题

在动态森林中以对数摊还时间支持连接、断边和路径查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

每次操作摊还 O(log n)

## 先修内容

[伸展树](https://github.com/wuhy80/algorithm/tree/main/splay-tree/)、[重链剖分](https://github.com/wuhy80/algorithm/tree/main/heavy-light-decomposition/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/link-cut-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/link-cut-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
