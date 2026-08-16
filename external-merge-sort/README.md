# 外部归并排序 External Merge Sort

## 算法是什么

内存分块生成有序 Run，再使用多路归并顺序读写外存

## 解决什么问题

排序无法一次放入内存的文件、日志和数据库记录。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

I/O 复杂度 O((N/B) log_(M/B)(N/B))

## 先修内容

[归并排序](https://github.com/wuhy80/algorithm/tree/main/merge-sort/)、[堆与优先队列](https://github.com/wuhy80/algorithm/tree/main/heap-priority-queue/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/external-merge-sort/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/external-merge-sort/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
