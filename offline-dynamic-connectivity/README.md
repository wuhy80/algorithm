# 离线动态连通性 Offline Dynamic Connectivity

## 算法是什么

时间线段树配合可回滚并查集处理边的增删与查询

## 解决什么问题

在已知全部操作的情况下回答动态图任意时刻的连通性。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

约 O((Q + K) log Q log V)

## 先修内容

[可回滚并查集](https://github.com/wuhy80/algorithm/tree/main/rollback-union-find/)、[线段树](https://github.com/wuhy80/algorithm/tree/main/segment-tree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/offline-dynamic-connectivity/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/offline-dynamic-connectivity/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
