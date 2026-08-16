# 字符串滚动哈希 Rolling Hash

## 算法是什么

预处理前缀哈希和幂，常数时间提取任意子串指纹

## 解决什么问题

快速比较子串、检测重复、匹配模式并支持回文和最长公共前缀查询。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

预处理 O(n)，子串哈希 O(1)

## 先修内容

[Rabin-Karp](https://github.com/wuhy80/algorithm/tree/main/rabin-karp/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/rolling-hash/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/rolling-hash/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
