# 二叉树后序遍历 Postorder Traversal

## 算法是什么

按照左、右、根的顺序演示子树完成后再处理父节点

## 解决什么问题

先获得两个子树结果再处理根，适合释放树、计算子树值和表达式求值。

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

- [打开演示](https://wuhy80.github.io/algorithm/postorder-traversal/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/postorder-traversal/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
