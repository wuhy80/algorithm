# 开放寻址哈希表 Open Addressing

## 算法是什么

可视化线性探测、哈希冲突、墓碑删除与负载因子

## 解决什么问题

在单个数组内解决哈希冲突，以接近常数时间维护键集合且无需链式节点。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

平均插入 / 查询 O(1)，最坏 O(n)，空间 O(capacity)

## 先修内容

[哈希表](https://github.com/wuhy80/algorithm/tree/main/hash-table/)、[静态数组](https://github.com/wuhy80/algorithm/tree/main/static-array/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/open-addressing-hash-table/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/open-addressing-hash-table/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
