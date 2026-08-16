# 点分治 Centroid Decomposition

## 算法是什么

反复寻找重心、移除重心并递归处理各个剩余连通块。

## 解决什么问题

将树分层分解为深度 O(log n) 的重心树以处理全局路径问题。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n log n)

## 先修内容

[深度优先搜索](https://github.com/wuhy80/algorithm/tree/main/dfs/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/centroid-decomposition/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/centroid-decomposition/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
