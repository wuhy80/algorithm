# 频率统计 Frequency Counting

## 算法是什么

逐项更新哈希计数表并高亮当前最高频元素

## 解决什么问题

统计离散元素出现次数，支持众数、分组、直方图和重复检测。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

平均时间 O(n)，额外空间 O(k)

## 先修内容

[集合与映射](https://github.com/wuhy80/algorithm/tree/main/set-map-adt/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/frequency-counting/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/frequency-counting/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
