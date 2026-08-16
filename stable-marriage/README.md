# 稳定婚姻匹配 Gale-Shapley

## 算法是什么

自由提议者依偏好提议，接收者始终保留当前更偏好的匹配。

## 解决什么问题

为两组带偏好顺序的参与者寻找不存在阻塞对的稳定匹配。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n²)

## 先修内容

[二分图最大匹配](https://github.com/wuhy80/algorithm/tree/main/bipartite-matching/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/stable-marriage/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/stable-marriage/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
