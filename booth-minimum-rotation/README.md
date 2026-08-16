# Booth 最小表示法

## 算法是什么

在双倍字符串中比较两个候选起点，一次失配排除一整段候选。

## 解决什么问题

在线性时间寻找循环字符串的字典序最小旋转表示。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n)

## 先修内容

[KMP](https://github.com/wuhy80/algorithm/tree/main/kmp-search/)、[双指针](https://github.com/wuhy80/algorithm/tree/main/two-pointers/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/booth-minimum-rotation/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/booth-minimum-rotation/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
