# Minimax 与 Alpha-Beta 剪枝

## 算法是什么

在 MAX/MIN 博弈树中回传效用，并在 α≥β 时跳过不可能影响结果的分支。

## 解决什么问题

在双人零和完全信息博弈中选择最优行动并减少需要评估的状态。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

最坏 O(b^d)，理想剪枝 O(b^(d/2))

## 先修内容

[深度优先搜索](https://github.com/wuhy80/algorithm/tree/main/dfs/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/minimax-alpha-beta/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/minimax-alpha-beta/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
