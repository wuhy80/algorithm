# BVH 层次包围盒

## 算法是什么

按最长轴中分对象并递归建立包围盒，查询时跳过不相交分支。

## 解决什么问题

加速光线追踪、碰撞检测和空间范围查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n log n) 构建

## 先修内容

[KD](https://github.com/wuhy80/algorithm/tree/main/kd-tree/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/bounding-volume-hierarchy/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/bounding-volume-hierarchy/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
