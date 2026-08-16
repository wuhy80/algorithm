# Burrows-Wheeler 变换 BWT

## 算法是什么

生成并排序循环旋转，提取最后一列和主索引展示字符聚集。

## 解决什么问题

可逆地重排字符串，让相同字符聚集以提升后续压缩效率。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n² log n) 演示实现

## 先修内容

[后缀数组与](https://github.com/wuhy80/algorithm/tree/main/suffix-array-lcp/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/burrows-wheeler-transform/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/burrows-wheeler-transform/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
