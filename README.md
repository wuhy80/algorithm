# 算法可视化实验室

这个仓库按算法划分目录。每个目录包含独立实现、可运行演示和算法说明，彼此之间没有运行依赖。所有演示都以实时动画呈现算法过程，并支持动态调节关键参数。

## 算法目录

| 算法 | 动画表现 | 状态 | 演示 |
| --- | --- | --- | --- |
| [Boids 群鸟算法](./boids/) | 鸟群实时聚合、分离、同步、避障和鼠标交互 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/boids/) |
| [蚁群优化 Ant Colony Optimization](./ant-colony/) | 蚂蚁探索路径、信息素沉积与挥发、最短路线逐渐显现 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/ant-colony/) |
| [A* 寻路 A* Pathfinding](./astar-pathfinding/) | 搜索前沿扩张、代价变化、障碍编辑与最终路径回溯 | 已上线 | [打开演示](https://wuhy80.github.io/algorithm/astar-pathfinding/) |
| 粒子群优化 Particle Swarm Optimization | 粒子在目标函数地形中移动并逐步汇聚到最优区域 | 待实现 | - |
| 遗传火箭 Genetic Rockets | 多代火箭飞向目标，展示选择、交叉、变异和适应度进化 | 待实现 | - |
| N 体引力 N-body Simulation | 星体受引力运动、形成轨道与拖尾，并展示空间分区加速 | 待实现 | - |
| 反应扩散 Reaction-Diffusion | Gray-Scott 模型实时生长斑点、条纹和有机纹理 | 待实现 | - |
| 波函数坍缩 Wave Function Collapse | 网格按最低熵逐格坍缩，约束向周围持续传播 | 待实现 | - |
| Perlin 噪声流场 Flow Field | 大量粒子沿连续噪声向量场流动并留下动态轨迹 | 待实现 | - |
| 迷宫生成 Maze Generation | 墙体逐步开凿形成迷宫，并动态展示寻路过程 | 待实现 | - |
| 傅里叶旋轮 Fourier Epicycles | 多级旋转向量逐步重建并绘制复杂轮廓 | 待实现 | - |
| 康威生命游戏 Conway's Game of Life | 细胞在离散规则下繁衍、消亡并产生复杂结构 | 待实现 | - |
| Voronoi 与 Lloyd 松弛 | 泰森多边形随控制点移动，并逐步趋向均匀分布 | 待实现 | - |

## 演示原则

- 展示算法的演化过程，而不只是最终结果或静态图表。
- 使用 Canvas 或 WebGL 支撑大量动态元素和稳定帧率。
- 提供关键参数、暂停、重置和直接画布交互。
- 同时适配桌面与移动端，并保持算法实现可独立阅读。
- 实时展示与算法有关的性能或状态指标，不添加无意义的数据面板。

## 目录约定

新增算法时，在仓库根目录下建立单独目录，并至少包含：

- `README.md`：算法原理、解决的问题、复杂度和使用方式。
- 算法实现：核心逻辑与必要的界面文件。
- 可运行入口：能够独立启动或直接打开的示例。

## 链接约定

首页中的链接统一遵循以下规则：

- 算法名称链接到仓库内的源码目录，例如 `./boids/`。
- “打开演示”链接到完整的 GitHub Pages 地址，例如 `https://wuhy80.github.io/algorithm/boids/`。
- 新算法的目录名同时作为 Pages 路径，格式为 `https://wuhy80.github.io/algorithm/<算法目录>/`。
- 尚未实现的占位项不创建失效链接；实现完成后再同时补充源码和演示链接。

GitHub Pages 从 `main` 分支根目录发布，因此每个算法目录中的 `index.html` 都会自动成为该算法的在线演示入口。
