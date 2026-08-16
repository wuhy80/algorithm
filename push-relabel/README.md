# Push-Relabel 最大流

## 算法是什么

维护预流、节点余量和高度标号，反复执行推流或重标。

## 解决什么问题

求容量网络从源点到汇点的最大可行流。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(V²E)

## 先修内容

[Dinic](https://github.com/wuhy80/algorithm/tree/main/dinic/)、[Edmonds-Karp](https://github.com/wuhy80/algorithm/tree/main/edmonds-karp/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/push-relabel/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/push-relabel/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
