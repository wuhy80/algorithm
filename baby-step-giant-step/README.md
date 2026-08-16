# Baby-Step Giant-Step 离散对数

## 算法是什么

把指数拆成约 √m 的婴儿步与巨人步，并用哈希表寻找相遇值。

## 解决什么问题

求解模意义下 a^x≡b 的离散对数。

## 核心思路

演示会把算法的关键状态拆成可单步执行的快照，并同步显示当前步骤、核心指标和结构变化。可以修改左侧输入参数后重新生成过程。

## 复杂度

O(√m) 时间与空间

## 先修内容

[快速模幂](https://github.com/wuhy80/algorithm/tree/main/modular-exponentiation/)、[扩展欧几里得](https://github.com/wuhy80/algorithm/tree/main/extended-euclidean/)

## 文件

- `index.html`：演示页面结构
- `styles.css`：响应式界面样式
- `app.js`：算法实现、步骤生成和 Canvas 绘制
- `README.md`：本说明

## 在线查看

- [打开演示](https://wuhy80.github.io/algorithm/baby-step-giant-step/)
- [查看源码](https://github.com/wuhy80/algorithm/tree/main/baby-step-giant-step/)
- [返回算法目录](https://wuhy80.github.io/algorithm/)
