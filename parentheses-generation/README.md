# 合法括号生成 Parentheses Generation

## 算法是什么

按左右括号计数约束剪枝并生成全部合法序列

## 解决什么问题

生成 n 对括号的所有合法嵌套方式，演示基于不变量的回溯剪枝。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

输出规模为第 n 个 Catalan 数，递归空间 O(n)

## 先修内容

[括号匹配](https://github.com/wuhy80/algorithm/tree/main/parentheses-matching/)、[递归与调用栈](https://github.com/wuhy80/algorithm/tree/main/recursion-call-stack/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/parentheses-generation/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/parentheses-generation/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
