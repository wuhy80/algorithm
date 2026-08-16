# Timsort

## 算法是什么

利用自然有序 Run 并按不变量执行稳定归并

## 解决什么问题

高效排序包含局部有序结构的真实数据，并保持稳定性。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

最好 O(n)，最坏 O(n log n)，空间 O(n)

## 先修内容

[插入排序](https://github.com/wuhy80/algorithm/tree/main/insertion-sort/)、[归并排序](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/timsort/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/timsort/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
