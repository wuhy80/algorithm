# 折半搜索 Meet-in-the-Middle

## 算法是什么

把指数枚举拆成两半并组合两侧结果

## 解决什么问题

将子集和、背包和密码搜索等 O(2^n) 问题降低到约 O(2^(n/2))。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

时间和空间通常为 O(2^(n/2))

## 先修内容

[子集和](https://github.com/wuhy80/algorithm/tree/main/subset-sum/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/meet-in-the-middle/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/meet-in-the-middle/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
