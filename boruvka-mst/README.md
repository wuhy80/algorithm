# Borůvka 最小生成树

## 算法是什么

所有连通分量同时选择最轻出边，批量合并并构建最小生成树。

## 解决什么问题

为连通带权无向图寻找总权重最小的生成树。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(E log V)

## 先修内容

[Kruskal](https://github.com/wuhy80/algorithm/tree/main/kruskal-mst/)、[并查集](https://github.com/wuhy80/algorithm/tree/main/union-find/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/boruvka-mst/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/boruvka-mst/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
