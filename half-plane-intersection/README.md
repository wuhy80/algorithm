# 半平面交 Half-Plane Intersection

## 算法是什么

逐个用线性不等式边界裁剪凸多边形，保留可行区域并生成交点。

## 解决什么问题

求多个线性半平面的公共凸区域及其面积。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

增量裁剪 O(hv)

## 先修内容

[凸包](https://github.com/wuhy80/algorithm/tree/main/convex-hull/)、[点在多边形内](https://github.com/wuhy80/algorithm/tree/main/point-in-polygon/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/half-plane-intersection/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/half-plane-intersection/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
