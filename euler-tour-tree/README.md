# Euler Tour Tree

## 算法是什么

把树的进入/退出事件存入隐式 Treap，通过序列切分合并移动整棵子树。

## 解决什么问题

在动态森林中支持子树剪切、重新连接、连通性和聚合查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

每次操作 O(log n)

## 先修内容

[Treap](https://github.com/wuhy80/algorithm/tree/main/treap/)、[树形](https://github.com/wuhy80/algorithm/tree/main/tree-dp/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/euler-tour-tree/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/euler-tour-tree/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
