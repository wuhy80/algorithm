# Li Chao Tree

## 算法是什么

在线维护直线集合并查询指定横坐标的最优值

## 解决什么问题

处理直线斜率和查询顺序均不单调的动态最值问题。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

插入和查询 O(log coordinate range)

## 先修内容

[斜率优化](https://github.com/wuhy80/algorithm/tree/main/convex-hull-trick/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/li-chao-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/li-chao-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
