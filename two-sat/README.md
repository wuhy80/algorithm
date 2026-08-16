# 2-SAT

## 算法是什么

将二元子句转成蕴含图，通过 Tarjan 强连通分量判定可满足性。

## 解决什么问题

判断每个子句最多含两个文字的布尔公式是否存在满足赋值。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(V + E)

## 先修内容

[Tarjan](https://github.com/wuhy80/algorithm/tree/main/tarjan-scc/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/two-sat/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/two-sat/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
