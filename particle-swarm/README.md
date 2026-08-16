# 粒子群优化 Particle Swarm Optimization

粒子群优化（PSO）是一种受鸟群协同行为启发的连续优化算法。每个粒子代表一个候选解，并同时参考自己的历史最优位置与整个群体发现的最优位置调整速度。

```text
v = ωv + c₁r₁(pBest - x) + c₂r₂(gBest - x)
x = x + v
```

## 解决什么问题

PSO 常用于连续函数优化、控制器参数整定、工程设计、特征选择和神经网络超参数搜索。它不需要目标函数的梯度，但在复杂多峰问题中可能过早收敛到局部最优。

## 本演示

- 在 Rastrigin、Ackley、Himmelblau 和 Sphere 函数地形上实时运行。
- 展示粒子速度尾迹、全局最优位置、迭代次数与群体离散度。
- 支持调节粒子数量、速度上限、惯性权重、个体认知和群体协同权重。
- 点击画布可向指定区域重新投放部分粒子，观察群体如何重新搜索。

## 文件

```text
particle-swarm/
├── index.html
├── styles.css
├── app.js
└── README.md
```

直接打开 `index.html` 即可运行。
