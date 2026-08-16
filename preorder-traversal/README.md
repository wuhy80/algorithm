# 二叉树前序遍历 Preorder Traversal

## 算法是什么

按照根、左、右的顺序展开递归栈与访问序列

## 解决什么问题

先处理父节点再处理子树，适合复制树、序列化和前缀表达式。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间 O(n)，递归空间 O(h)

## 先修内容

[二叉树基础](https://github.com/wuhy80/algorithm/tree/main/binary-tree-basics/)、[递归与调用栈](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/preorder-traversal/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/preorder-traversal/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
