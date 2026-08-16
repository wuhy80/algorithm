# 莫队算法 Mo’s Algorithm

## 算法是什么

分块重排离线区间查询，展示左右指针增删元素和答案维护。

## 解决什么问题

在可快速增删元素时批量回答静态数组的离线区间查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O((n + q)√n)

## 先修内容

[平方根分解](https://github.com/wuhy80/algorithm/tree/main/sqrt-decomposition/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/mo-algorithm/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/mo-algorithm/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
