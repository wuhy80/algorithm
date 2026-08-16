# 位集与位图 Bitset / Bitmap

## 算法是什么

用机器字的单个位表达布尔状态并执行批量位运算

## 解决什么问题

紧凑保存大规模布尔集合，并快速完成成员测试、交并差和状态压缩。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

单点操作 O(1)，批量集合操作 O(n / word size)

## 先修内容

无硬性先修要求，建议先熟悉页面中使用的基础数据结构。

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/bitset-bitmap/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/bitset-bitmap/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
