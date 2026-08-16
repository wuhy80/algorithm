# Floyd 快慢指针判环

## 算法是什么

快慢指针在链表中以不同速度前进，相遇后同步定位环入口。

## 解决什么问题

以常数额外空间判断链表或状态转移序列是否存在环并找到入口。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n) 时间 / O(1) 空间

## 先修内容

[链表](https://github.com/wuhy80/algorithm/tree/main/linked-list/)、[双指针](https://github.com/wuhy80/algorithm/tree/main/two-pointers/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/floyd-cycle-detection/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/floyd-cycle-detection/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
