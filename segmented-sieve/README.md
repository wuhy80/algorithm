# 分段筛 Segmented Sieve

## 算法是什么

先生成 √R 内基础质数，再仅标记目标区间中的对应倍数。

## 解决什么问题

在不保存 1 到 R 全部状态的情况下筛选大区间内的质数。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O((R-L+1) log log R)

## 先修内容

[埃拉托斯特尼筛法](https://github.com/wuhy80/algorithm/tree/main/sieve-of-eratosthenes/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/segmented-sieve/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/segmented-sieve/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
