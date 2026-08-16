# 水塘抽样 Reservoir Sampling

## 算法是什么

单遍读取数据流，以递减概率替换固定容量水塘中的随机位置。

## 解决什么问题

从未知长度或无法全部保存的数据流中等概率抽取 k 个样本。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n) 时间 / O(k) 空间

## 先修内容

[Fisher-Yates](https://github.com/wuhy80/algorithm/tree/main/fisher-yates-shuffle/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/reservoir-sampling/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/reservoir-sampling/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
