# 持久化 Trie Persistent Trie

## 算法是什么

路径复制生成 Trie 历史版本，未修改分支保持共享

## 解决什么问题

查询任意历史时刻的字符串前缀、异或最值或版本差分。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

每次更新和查询 O(key length)

## 先修内容

[Trie](https://github.com/wuhy80/algorithm/tree/main/trie/)、[可持久化线段树](https://github.com/wuhy80/algorithm/tree/main/persistent-segment-tree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/persistent-trie/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/persistent-trie/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
