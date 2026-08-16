# 后缀自动机 Suffix Automaton

## 算法是什么

逐字符扩展状态、后缀链接与转移，必要时创建克隆状态。

## 解决什么问题

以线性规模结构表示一个字符串的全部子串并回答子串问题。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n)

## 先修内容

[Trie](https://github.com/wuhy80/algorithm/tree/main/trie/)、[KMP](https://github.com/wuhy80/algorithm/tree/main/kmp-search/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/suffix-automaton/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/suffix-automaton/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
