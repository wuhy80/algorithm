# 循环缓冲区 Circular Buffer

## 算法是什么

首尾索引通过取模循环移动，在固定数组内完成队列操作

## 解决什么问题

为流式数据、生产者消费者和固定容量队列提供无搬移的常数时间读写。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

入队 / 出队 O(1)，空间 O(capacity)

## 先修内容

[队列](https://github.com/wuhy80/algorithm/tree/main/queue/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/circular-buffer/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/circular-buffer/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
