# AC-3 约束传播

## 算法是什么

反复修订变量取值域直到所有二元约束达到弧一致

## 解决什么问题

在搜索前缩减数独、图着色、排程等约束满足问题的候选空间。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

经典上界 O(E d³)

## 先修内容

[图着色回溯](https://github.com/wuhy80/algorithm/tree/main/graph-coloring/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/ac3-constraint-propagation/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/ac3-constraint-propagation/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
