# Rope 字符串结构

## 算法是什么

用平衡树组织字符串块，局部拆分和连接完成大文本编辑

## 解决什么问题

避免在大型文本中插入、删除或拼接时反复复制完整字符串。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

平衡实现下 split / concat / insert O(log n)

## 先修内容

[AVL](https://github.com/wuhy80/algorithm/tree/main/avl-tree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/rope/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/rope/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
