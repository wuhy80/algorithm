# 重链剖分 Heavy-Light Decomposition

## 算法是什么

按最大子树划分重链，并把树上路径拆成少量连续区间求和。

## 解决什么问题

把树路径查询转化为对数数量的序列区间查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n) 预处理 / O(log² n) 查询

## 先修内容

[最近公共祖先](https://github.com/wuhy80/algorithm/tree/main/lowest-common-ancestor/)、[线段树](https://github.com/wuhy80/algorithm/tree/main/segment-tree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/heavy-light-decomposition/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/heavy-light-decomposition/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
