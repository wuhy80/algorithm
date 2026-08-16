# 不相交稀疏表 Disjoint Sparse Table

## 算法是什么

按最高不同位组合左右预计算段，实现通用结合运算静态查询

## 解决什么问题

对不可重复但满足结合律的运算实现静态区间 O(1) 查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

构建 O(n log n)，查询 O(1)

## 先修内容

[稀疏表](https://github.com/wuhy80/algorithm/tree/main/sparse-table/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/disjoint-sparse-table/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/disjoint-sparse-table/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
