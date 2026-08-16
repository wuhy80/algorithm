# Gomory-Hu 全局割树

## 算法是什么

执行 V-1 次最小割并调整父关系，用一棵树编码全部点对最小割。

## 解决什么问题

紧凑表示无向带权图任意两点之间的最小割值。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

V-1 次最大流

## 先修内容

[Stoer-Wagner](https://github.com/wuhy80/algorithm/tree/main/stoer-wagner-min-cut/)、[Dinic](https://github.com/wuhy80/algorithm/tree/main/dinic/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/gomory-hu-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/gomory-hu-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
