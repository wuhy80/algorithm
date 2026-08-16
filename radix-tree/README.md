# Patricia / Radix Tree

## 算法是什么

把 Trie 的单孩子路径压缩为字符串边以减少节点

## 解决什么问题

紧凑存储字符串键、网络前缀和路由表，同时保持按前缀检索能力。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

插入和查询 O(key length)

## 先修内容

[Trie](https://github.com/wuhy80/algorithm/tree/main/trie/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/radix-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/radix-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
