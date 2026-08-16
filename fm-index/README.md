# FM-index

## 算法是什么

基于 BWT、C 表与 Occ 计数执行反向全文检索

## 解决什么问题

在接近压缩文本大小的空间内完成大规模全文模式匹配。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

查询 O(pattern length)，空间接近压缩文本

## 先修内容

[Burrows-Wheeler](https://github.com/wuhy80/algorithm/tree/main/burrows-wheeler-transform/)、[后缀数组与](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/fm-index/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/fm-index/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
