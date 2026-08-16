# 配对堆 Pairing Heap

## 算法是什么

通过 meld 和两遍配对合并实现简洁的可并堆

## 解决什么问题

为需要频繁合并优先队列和 decrease-key 的图算法提供实用堆结构。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

meld O(1)，delete-min 摊还 O(log n)

## 先修内容

[堆与优先队列](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/pairing-heap/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/pairing-heap/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
