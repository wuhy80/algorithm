# 差分数组 Difference Array

## 算法是什么

区间更新只修改两个差分边界，最后通过前缀累加恢复完整数组。

## 解决什么问题

高效处理大量离线区间加法，再一次性生成更新后的数组。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(1) 更新 / O(n) 恢复

## 先修内容

[前缀和](https://github.com/wuhy80/algorithm/tree/main/prefix-sum/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/difference-array/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/difference-array/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
