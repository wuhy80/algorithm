# 活动选择 Activity Selection

## 算法是什么

按结束时间排序并选择互不冲突的活动，动态展示候选判断与已选集合。

## 解决什么问题

从一组起止时间已知的活动中选择数量最多的互不重叠活动。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n log n)

## 先修内容

无硬性先修要求，建议先熟悉页面中使用的基础数据结构。

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/activity-selection/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/activity-selection/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
