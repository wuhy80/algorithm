# 数论变换 NTT

## 算法是什么

在有限域中执行正逆蝶形变换，精确计算整数多项式卷积。

## 解决什么问题

避免浮点误差地快速完成大整数或多项式卷积。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(n log n)

## 先修内容

[快速傅里叶变换](https://github.com/wuhy80/algorithm/tree/main/fft/)、[快速模幂](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/ntt/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/ntt/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
