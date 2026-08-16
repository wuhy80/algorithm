# 双连通分量 Biconnected Components

## 算法是什么

利用 dfn、low 和边栈分解点双连通与边双连通结构

## 解决什么问题

识别无向图中的脆弱连接、割点块结构和可靠通信区域。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(V + E)

## 先修内容

[割点与桥](https://github.com/wuhy80/algorithm/tree/main/bridges-articulation/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/biconnected-components/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/biconnected-components/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
