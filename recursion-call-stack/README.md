# 递归与调用栈 Recursion Call Stack

## 算法是什么

用阶乘逐层展示函数入栈、基例命中和返回值出栈

## 解决什么问题

理解递归函数如何把未完成状态保存在调用栈，并在基例后反向合并结果。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

阶乘示例时间 O(n)，调用栈空间 O(n)

## 先修内容

[栈](https://github.com/wuhy80/algorithm/tree/main/stack/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/recursion-call-stack/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
