const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchFSpatial = {
  "game-of-life": {
    statement: "实现康威生命游戏：B3/S23 规则（死格恰有 3 个活邻居复活；活格邻居为 2 或 3 存活，否则死亡），边界外视为死格，逐代同步更新。返回迭代指定代数后的网格。",
    input: "data 为 {\"grid\": 0/1 二维数组, \"generations\": 非负整数}。",
    output: "返回 0/1 二维数组（与输入同尺寸）。",
    constraints: ["1 <= rows, cols <= 30","0 <= generations <= 50"],
    examples: [
      example({"grid":[[0,1,0],[0,1,0],[0,1,0]],"generations":1}, [[0,0,0],[1,1,1],[0,0,0]], "blinker 闪烁体旋转 90°")
    ],
    tests: [
      example({"grid":[[0,1,0],[0,1,0],[0,1,0]],"generations":2}, [[0,1,0],[0,1,0],[0,1,0]]),
      example({"grid":[[1,1],[1,1]],"generations":5}, [[1,1],[1,1]]),
      example({"grid":[[0,0],[0,0]],"generations":3}, [[0,0],[0,0]]),
      example({"grid":[[1,0,0],[0,0,0],[0,0,0]],"generations":1}, [[0,0,0],[0,0,0],[0,0,0]])
    ],
    insights: ["同步更新是不变量：所有格子依据同一代的邻居计数同时变化，边写边改会把信息污染到同代邻居。","B3/S23 的三条规则拼起来就是「邻居计数为 3 复活、为 2 保持」，一个表达式即可完成。"],
    pitfalls: ["边界格的邻居数按出界为死处理，不要取模回绕（那是环形世界）。","代数为 0 时直接返回原网格。"],
    solution: `def solve(data):
    grid = [list(row) for row in data["grid"]]
    rows, cols = len(grid), len(grid[0])
    generations = int(data["generations"])
    for _ in range(generations):
        nxt = [[0] * cols for _ in range(rows)]
        for r in range(rows):
            for c in range(cols):
                count = 0
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        if dr == 0 and dc == 0:
                            continue
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols:
                            count += grid[nr][nc]
                if grid[r][c] == 1:
                    nxt[r][c] = 1 if count in (2, 3) else 0
                else:
                    nxt[r][c] = 1 if count == 3 else 0
        grid = nxt
    return grid
`,
  },
  "maze-generation": {
    statement: "用随机深度优先（递归回溯）生成迷宫：棋盘由 (2·rows+1)×(2·cols+1) 的 0/1 网格表示（1 为墙、0 为通路），从单元 (0,0) 出发，每次用 LCG（state = (state × 1664525 + 1013904223) mod 2^32）从未访问邻居中随机选一个，打通中间墙并递归前进。返回最终网格。",
    input: "data 为 {\"rows\": 单元行数, \"cols\": 单元列数, \"seed\": 非负整数}。",
    output: "返回 (2·rows+1)×(2·cols+1) 的 0/1 网格。",
    constraints: ["1 <= rows, cols <= 12","0 <= seed < 2^32"],
    examples: [
      example({"rows":1,"cols":1,"seed":1}, [[1,1,1],[1,0,1],[1,1,1]])
    ],
    tests: [
      example({"rows":2,"cols":2,"seed":7}, [[1,1,1,1,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]),
      example({"rows":3,"cols":3,"seed":42}, [[1,1,1,1,1,1,1],[1,0,0,0,1,0,1],[1,1,1,0,1,0,1],[1,0,1,0,0,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]]),
      example({"rows":1,"cols":3,"seed":5}, [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]])
    ],
    insights: ["递归回溯生成的迷宫是「完美迷宫」：任意两单元间恰有一条通路——生成树的一一对应关系保证了这一点。","打通的是单元之间的墙格（坐标为奇偶交错处），单元本身永远保持为 0。"],
    pitfalls: ["网格坐标是 2r+1、2c+1，与单元坐标的换算写错会打通到边界外。","邻居顺序的随机性由 LCG 驱动，任何用内置 random 的实现都会与期望不一致。"],
    solution: `def solve(data):
    rows = int(data["rows"])
    cols = int(data["cols"])
    state = int(data["seed"]) & 0xffffffff
    height, width = 2 * rows + 1, 2 * cols + 1
    grid = [[1] * width for _ in range(height)]
    grid[1][1] = 0
    visited = [[False] * cols for _ in range(rows)]
    visited[0][0] = True
    stack = [(0, 0)]
    directions = ((-1, 0), (1, 0), (0, -1), (0, 1))
    while stack:
        r, c = stack[-1]
        candidates = []
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                candidates.append((nr, nc, dr, dc))
        if not candidates:
            stack.pop()
            continue
        state = (state * 1664525 + 1013904223) & 0xffffffff
        nr, nc, dr, dc = candidates[state % len(candidates)]
        grid[2 * r + 1 + dr][2 * c + 1 + dc] = 0
        grid[2 * nr + 1][2 * nc + 1] = 0
        visited[nr][nc] = True
        stack.append((nr, nc))
    return grid
`,
  },
  "wave-function-collapse": {
    statement: "实现简化版波函数坍缩（WFC）：每格的候选集初始为瓦片 {0,1,2,3}，瓦片 t 的四边插座为上 t&1、右 t&2、下 t&4、左 t&8。约束：与上邻共享边上「当前上插座 == 上邻下插座」、与左邻「当前左插座 == 左邻右插座」。扫描顺序从左到右、从上到下，逐格在候选集中用 LCG 随机取一个瓦片；候选耗尽返回全 -1 网格。返回瓦片编号网格。",
    input: "data 为 {\"cols\": 列数, \"rows\": 行数, \"seed\": 非负整数}。",
    output: "返回 rows×cols 的瓦片编号网格；冲突时返回全 -1 网格。",
    constraints: ["1 <= cols, rows <= 6","0 <= seed < 2^32"],
    examples: [
      example({"cols":2,"rows":1,"seed":3}, [[-1,-1]])
    ],
    tests: [
      example({"cols":1,"rows":1,"seed":9}, [[0]]),
      example({"cols":3,"rows":1,"seed":11}, [[-1,-1,-1]]),
      example({"cols":2,"rows":2,"seed":21}, [[0,3],[0,2]]),
      example({"cols":3,"rows":3,"seed":77}, [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]])
    ],
    insights: ["WFC 的传播是约束满足的局部推理：一格坍缩后，邻居的候选集立即被插座约束过滤，熵最小的格优先坍缩可以推迟冲突。","本题把「随机」固定为 LCG 序列，因此整个过程与普通回溯一样完全可复现。"],
    pitfalls: ["插座匹配的方向：当前上边对上邻的下边，位运算取错边会整盘矛盾。","候选耗尽按题约返回全 -1 网格，不要死循环回溯。"],
    solution: `def solve(data):
    cols = int(data["cols"])
    rows = int(data["rows"])
    state = int(data["seed"]) & 0xffffffff
    tiles = list(range(4))
    grid = [[None] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            candidates = list(tiles)
            if r > 0:
                above = grid[r - 1][c]
                below_of_above = (above >> 2) & 1
                candidates = [t for t in candidates if (t & 1) == below_of_above]
            if c > 0:
                left = grid[r][c - 1]
                right_of_left = (left >> 1) & 1
                candidates = [t for t in candidates if ((t >> 3) & 1) == right_of_left]
            if not candidates:
                return [[-1] * cols for _ in range(rows)]
            state = (state * 1664525 + 1013904223) & 0xffffffff
            grid[r][c] = candidates[state % len(candidates)]
    return grid
`,
  },
  "reaction-diffusion": {
    statement: "实现 Gray–Scott 反应扩散的数值模拟：参数 F = 0.055、k = 0.062、Du = 0.16（U 的扩散）、Dv = 0.08、dt = 1.0，初值 V 全 0.25、U 全 0，中央 4×4 方块 U = 0.5，边界采用固定值（不更新）。迭代指定步数后返回 U 网格（round 到 3 位小数）。",
    input: "data 为 {\"rows\": 行数, \"cols\": 列数, \"steps\": 非负整数}，rows, cols ≥ 6。",
    output: "返回 rows×cols 浮点网格（round 3）。",
    constraints: ["6 <= rows, cols <= 12","0 <= steps <= 20"],
    examples: [
      example({"rows":6,"cols":6,"steps":0}, [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0.5,0.5,0,0],[0,0,0.5,0.5,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]])
    ],
    tests: [
      example({"rows":6,"cols":6,"steps":1}, [[0,0,0,0,0,0],[0,0.055,0.135,0.135,0.055,0],[0,0.135,0.336,0.336,0.135,0],[0,0.135,0.336,0.336,0.135,0],[0,0.055,0.135,0.135,0.055,0],[0,0,0,0,0,0]]),
      example({"rows":6,"cols":6,"steps":2}, [[0,0,0,0,0,0],[0,0.112,0.174,0.174,0.112,0],[0,0.174,0.287,0.287,0.174,0],[0,0.174,0.287,0.287,0.174,0],[0,0.112,0.174,0.174,0.112,0],[0,0,0,0,0,0]]),
      example({"rows":6,"cols":6,"steps":5}, [[0,0,0,0,0,0],[0,0.162,0.211,0.211,0.162,0],[0,0.211,0.28,0.28,0.211,0],[0,0.211,0.28,0.28,0.211,0],[0,0.162,0.211,0.211,0.162,0],[0,0,0,0,0,0]])
    ],
    insights: ["反应扩散的每一步 = 扩散（拉普拉斯）+ 反应（U、V 相互转化）+ 损耗（F、k），参数的组合决定图案是斑纹还是孔洞。","拉普拉斯用五点差分离散化，边界取固定值意味着「外界环境不变」——图案在边界处会稳定下来。"],
    pitfalls: ["U、V 必须基于同一代的值同步更新，边算边写会让扩散不对称。","round 到 3 位后再比较，1e-9 级浮点抖动才不会放大成失败。"],
    solution: `def solve(data):
    rows = int(data["rows"])
    cols = int(data["cols"])
    steps = int(data["steps"])
    F, k, Du, Dv, dt = 0.055, 0.062, 0.16, 0.08, 1.0
    U = [[0.0] * cols for _ in range(rows)]
    V = [[0.25] * cols for _ in range(rows)]
    for r in range(rows // 2 - 1, rows // 2 + 1):
        for c in range(cols // 2 - 1, cols // 2 + 1):
            U[r][c] = 0.5
    for _ in range(steps):
        new_u = [row[:] for row in U]
        new_v = [row[:] for row in V]
        for r in range(1, rows - 1):
            for c in range(1, cols - 1):
                lap_u = U[r - 1][c] + U[r + 1][c] + U[r][c - 1] + U[r][c + 1] - 4.0 * U[r][c]
                lap_v = V[r - 1][c] + V[r + 1][c] + V[r][c - 1] + V[r][c + 1] - 4.0 * V[r][c]
                uvv = U[r][c] * V[r][c] * V[r][c]
                new_u[r][c] = U[r][c] + dt * (Du * lap_u - uvv + F * (1.0 - U[r][c]))
                new_v[r][c] = V[r][c] + dt * (Dv * lap_v + uvv - (F + k) * V[r][c])
        U, V = new_u, new_v
    return [[round(U[r][c], 3) for c in range(cols)] for r in range(rows)]
`,
  },
  "particle-swarm": {
    statement: "实现一维粒子群优化（PSO）最小化 f(x) = (x - 3)²：粒子初始位置由 LCG 均匀取自 [-10, 10]、初速 0；每代 v = 0.7v + 1.5·r1·(pbest - x) + 1.5·r2·(gbest - x)（r1、r2 为相邻两个 LCG 抽样的 [0,1) 值），x = clamp(x + v, -10, 10)。返回 {\"best_x\": round 4, \"best_value\": round 4}。",
    input: "data 为 {\"particles\": 粒子数, \"iterations\": 迭代代数, \"seed\": 非负整数}。",
    output: "返回 {\"best_x\": 浮点, \"best_value\": 浮点}（各 round 4）。",
    constraints: ["1 <= particles <= 30","1 <= iterations <= 50","0 <= seed < 2^32"],
    examples: [
      example({"particles":1,"iterations":1,"seed":100000}, {"best_x":9.8262,"best_value":46.5972})
    ],
    tests: [
      example({"particles":5,"iterations":10,"seed":1}, {"best_x":3.0164,"best_value":0.0003}),
      example({"particles":3,"iterations":1,"seed":42}, {"best_x":1.5456,"best_value":2.1152}),
      example({"particles":10,"iterations":20,"seed":777}, {"best_x":2.9997,"best_value":0})
    ],
    insights: ["PSO 没有「梯度」：每个粒子被自己的历史最优（认知项）与全局最优（社会项）拉扯，惯性权重平衡探索与开发。","f(x) = (x-3)² 的全局最优在 3，迭代次数越多 best_value 越逼近 0。"],
    pitfalls: ["位置要 clamp 回 [-10, 10]，飞出边界的粒子不再参与最优竞争。","r1、r2 每代每粒子重新抽样且顺序固定，随机流错位结果就不同。"],
    solution: `def solve(data):
    count = int(data["particles"])
    iterations = int(data["iterations"])
    state = int(data["seed"]) & 0xffffffff

    def rand():
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xffffffff
        return state / 4294967296.0

    positions = [-10.0 + 20.0 * rand() for _ in range(count)]
    velocities = [0.0] * count
    personal = positions[:]
    best_global = min(positions, key=lambda x: (x - 3.0) ** 2)
    for _ in range(iterations):
        for i in range(count):
            r1 = rand()
            r2 = rand()
            velocities[i] = 0.7 * velocities[i] + 1.5 * r1 * (personal[i] - positions[i]) + 1.5 * r2 * (best_global - positions[i])
            positions[i] = max(-10.0, min(10.0, positions[i] + velocities[i]))
            if (positions[i] - 3.0) ** 2 < (personal[i] - 3.0) ** 2:
                personal[i] = positions[i]
            if (positions[i] - 3.0) ** 2 < (best_global - 3.0) ** 2:
                best_global = positions[i]
    best_value = (best_global - 3.0) ** 2
    if best_value < 1e-9:
        best_global = 3.0
        best_value = 0.0
    return {"best_x": round(best_global, 4), "best_value": round(best_value, 4)}
`,
  },
  "ant-colony": {
    statement: "用蚁群算法（ACS 简化版）解 TSP：信息素初值 1，蚂蚁按「信息素^1 × (1/距离)^3」轮盘选下一城（LCG 驱动），每轮结束后所有边信息素乘 0.5 并按「经过的蚂蚁各加 1/路径长」蒸发补充。返回 {\"tour\": 最优路径（从城市 0 出发）, \"length\": 路径长}。",
    input: "data 为 {\"dist\": n×n 对称距离矩阵, \"ants\": 蚂蚁数, \"iterations\": 迭代代数, \"seed\": 非负整数}，n ≤ 6。",
    output: "返回 {\"tour\": 城市编号数组（含回到起点的 n+1 项）, \"length\": 数值（round 4）}。",
    constraints: ["3 <= n <= 6","1 <= ants <= 10","1 <= iterations <= 20","0 <= seed < 2^32"],
    examples: [
      example({"dist":[[0,1,2],[1,0,1],[2,1,0]],"ants":2,"iterations":3,"seed":5}, {"tour":[0,1,2,0],"length":4}, "三角形最优回路 0→1→2→0")
    ],
    tests: [
      example({"dist":[[0,2,9,10],[1,0,6,4],[15,7,0,8],[6,3,12,0]],"ants":5,"iterations":10,"seed":3}, {"tour":[0,1,2,3,0],"length":22}),
      example({"dist":[[0,1,1,1],[1,0,1,1],[1,1,0,1],[1,1,1,0]],"ants":4,"iterations":5,"seed":9}, {"tour":[0,1,2,3,0],"length":4}),
      example({"dist":[[0,3,4],[3,0,5],[4,5,0]],"ants":3,"iterations":5,"seed":12}, {"tour":[0,1,2,0],"length":12})
    ],
    insights: ["信息素是「群体记忆」：好的路径被更多蚂蚁走过、得到更多增强，正反馈让整群逐渐收敛；蒸发防止过早锁死。","轮盘选择按「信息素 × 启发式」加权，随机性由 LCG 保证可复现——这是元启发式进入题库的前提。"],
    pitfalls: ["每轮所有蚂蚁都要重建完整路径，路径长计算别漏「回到起点」的收尾边。","tour 以城市 0 开头并以 0 结尾，长度是 round 后的浮点。"],
    solution: `def solve(data):
    dist = data["dist"]
    n = len(dist)
    ants = int(data["ants"])
    iterations = int(data["iterations"])
    state = int(data["seed"]) & 0xffffffff

    def rand():
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xffffffff
        return state / 4294967296.0

    pheromone = [[1.0] * n for _ in range(n)]
    best_tour = None
    best_length = None
    for _ in range(iterations):
        all_tours = []
        for _ in range(ants):
            start_city = 0
            visited = [False] * n
            visited[0] = True
            tour = [start_city]
            current = 0
            for _ in range(n - 1):
                weights = []
                for nxt in range(n):
                    if visited[nxt]:
                        weights.append(0.0)
                    else:
                        weights.append(pheromone[current][nxt] * (1.0 / max(dist[current][nxt], 1e-9)) ** 3)
                total = sum(weights)
                pick = rand() * total
                acc = 0.0
                chosen = n - 1
                for idx, w in enumerate(weights):
                    acc += w
                    if w > 0 and acc >= pick:
                        chosen = idx
                        break
                visited[chosen] = True
                tour.append(chosen)
                current = chosen
            tour.append(0)
            length = sum(dist[tour[i]][tour[i + 1]] for i in range(n))
            all_tours.append((tour, length))
        for i in range(n):
            for j in range(n):
                pheromone[i][j] *= 0.5
        for tour, length in all_tours:
            deposit = 1.0 / length
            for i in range(n):
                a, b = tour[i], tour[i + 1]
                pheromone[a][b] += deposit
                pheromone[b][a] += deposit
        for tour, length in all_tours:
            if best_length is None or length < best_length:
                best_length = length
                best_tour = tour
    return {"tour": best_tour, "length": round(best_length, 4)}
`,
  },
  "genetic-rockets": {
    statement: "用一维遗传算法让数值逼近目标：种群初始由 LCG 均匀取自 [-10, 10]，适应度 = 距目标的绝对差（越小越好）；每代按适应度升序取前一半做亲代，相邻两个亲代以算术平均交叉产生子代，再以概率 0.3 加 ±0.5·LCG 的变异。返回 {\"best\": round 4}（最终种群中最接近 target 的个体）。",
    input: "data 为 {\"population\": 种群大小（偶数）, \"generations\": 代数, \"seed\": 非负整数, \"target\": 目标值}。",
    output: "返回 {\"best\": 浮点（round 4）}。",
    constraints: ["2 <= population <= 20 且为偶数","1 <= generations <= 30","-10 <= target <= 10"],
    examples: [
      example({"population":4,"generations":1,"seed":5,"target":3}, {"best":4.6417})
    ],
    tests: [
      example({"population":6,"generations":10,"seed":1,"target":0}, {"best":0.0072}),
      example({"population":8,"generations":15,"seed":42,"target":-7}, {"best":-7.1877}),
      example({"population":10,"generations":20,"seed":7,"target":9}, {"best":8.9979})
    ],
    insights: ["遗传算法的进化压力来自选择：只有适应度前一半的个体能繁殖，交叉混合双亲、变异注入新基因，共同把种群拉向目标。","精英保留（亲代直接进入下一代）保证最优值单调不降，这也是收敛速度可预期的原因。"],
    pitfalls: ["亲代两两配对产生 population/2 个子代，加上保留的亲代恰好恢复种群规模。","变异幅度与概率写死在 statement 中，实现不一致结果就不同。"],
    solution: `def solve(data):
    population_size = int(data["population"])
    generations = int(data["generations"])
    state = int(data["seed"]) & 0xffffffff
    target = float(data["target"])

    def rand():
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xffffffff
        return state / 4294967296.0

    population = [-10.0 + 20.0 * rand() for _ in range(population_size)]
    for _ in range(generations):
        population.sort(key=lambda x: abs(x - target))
        parents = population[:population_size // 2]
        offspring = []
        for i in range(0, len(parents) - 1, 2):
            child = (parents[i] + parents[i + 1]) / 2.0
            if rand() < 0.3:
                child += (rand() - 0.5)
            offspring.append(child)
        while len(offspring) + len(parents) < population_size:
            offspring.append(parents[0])
        population = parents + offspring
    best = min(population, key=lambda x: abs(x - target))
    if abs(best - target) < 1e-9:
        best = target
    return {"best": round(best, 4)}
`,
  },
  "boids": {
    statement: "实现 Boids 群体行为的一帧更新：对每个个体，在半径 radius 内的邻居（不含自己）上应用三条规则——分离（远离过近者，距离 < 2 时按比例推开，权重 1.5）、对齐（向邻居平均速度靠拢，权重 0.05）、聚集（指向邻居质心，权重 0.005），速度 clamp 到 max_speed，位置 = 位置 + 新速度（round 3）。",
    input: "data 为 {\"positions\": [[x, y], ...], \"velocities\": [[vx, vy], ...], \"radius\": 正数, \"max_speed\": 正数}。",
    output: "返回 {\"velocities\": round 3 二维数组, \"positions\": round 3 二维数组}。",
    constraints: ["1 <= len(positions) <= 20","-50 <= 坐标 <= 50","0 < radius <= 50","0 < max_speed <= 10"],
    examples: [
      example({"positions":[[0,0]],"velocities":[[1,0]],"radius":5,"max_speed":2}, {"velocities":[[1,0]],"positions":[[1,0]]}, "无邻居时保持原速")
    ],
    tests: [
      example({"positions":[[0,0],[1,0]],"velocities":[[1,0],[0,1]],"radius":5,"max_speed":10}, {"velocities":[[0.205,0.05],[0.795,0.95]],"positions":[[0.205,0.05],[1.795,0.95]]}),
      example({"positions":[[0,0],[0.5,0]],"velocities":[[1,0],[1,0]],"radius":5,"max_speed":10}, {"velocities":[[-0.123,0],[2.123,0]],"positions":[[-0.123,0],[2.623,0]]}),
      example({"positions":[[0,0],[3,0]],"velocities":[[1,0],[1,0]],"radius":1,"max_speed":10}, {"velocities":[[1,0],[1,0]],"positions":[[1,0],[4,0]]})
    ],
    insights: ["三条规则各有方向：分离防碰撞、对齐统一航向、聚集防散伙——权重比例决定群体是「鸟群」还是「虫群」。","邻居判定用固定半径圆而不是全群，计算量 O(n²) 但行为更贴近局部感知。"],
    pitfalls: ["分离规则只在距离小于 2 时生效，与邻居判定半径是两个阈值。","速度 clamp 在更新后做，位置由 clamp 后的速度推进。"],
    solution: `import math


def solve(data):
    positions = [[float(p[0]), float(p[1])] for p in data["positions"]]
    velocities = [[float(v[0]), float(v[1])] for v in data["velocities"]]
    radius = float(data["radius"])
    max_speed = float(data["max_speed"])
    count = len(positions)
    new_velocities = []
    for i in range(count):
        vx, vy = velocities[i]
        neighbors = [j for j in range(count) if j != i and math.dist(positions[i], positions[j]) <= radius]
        if neighbors:
            align_x = sum(velocities[j][0] for j in neighbors) / len(neighbors)
            align_y = sum(velocities[j][1] for j in neighbors) / len(neighbors)
            center_x = sum(positions[j][0] for j in neighbors) / len(neighbors)
            center_y = sum(positions[j][1] for j in neighbors) / len(neighbors)
            vx += 0.05 * (align_x - vx)
            vy += 0.05 * (align_y - vy)
            vx += 0.005 * (center_x - positions[i][0])
            vy += 0.005 * (center_y - positions[i][1])
            for j in neighbors:
                dist = math.dist(positions[i], positions[j])
                if 0 < dist < 2:
                    push = (2 - dist) / 2
                    vx += (positions[i][0] - positions[j][0]) / dist * push * 1.5
                    vy += (positions[i][1] - positions[j][1]) / dist * push * 1.5
        speed = math.hypot(vx, vy)
        if speed > max_speed:
            vx = vx / speed * max_speed
            vy = vy / speed * max_speed
        new_velocities.append([vx, vy])
    new_positions = [[positions[i][0] + new_velocities[i][0], positions[i][1] + new_velocities[i][1]] for i in range(count)]
    return {
        "velocities": [[round(v[0], 3), round(v[1], 3)] for v in new_velocities],
        "positions": [[round(p[0], 3), round(p[1], 3)] for p in new_positions],
    }
`,
  },
  "n-body": {
    statement: "实现 N 体引力模拟的一步（半隐式欧拉）：每对天体按万有引力 F = G·m1·m2/r² 相互吸引（坐标差为 r 向量），先累计加速度更新速度，再用新速度更新位置。返回更新后的 {\"velocities\": round 6, \"positions\": round 6}。",
    input: "data 为 {\"positions\": [[x, y], ...], \"velocities\": [[vx, vy], ...], \"masses\": [...], \"dt\": 正数, \"G\": 正数}。",
    output: "返回 {\"velocities\": round 6, \"positions\": round 6}。",
    constraints: ["1 <= n <= 10","|坐标| <= 100","0.01 <= dt <= 1","两两距离 ≥ 0.5"],
    examples: [
      example({"positions":[[0,0]],"velocities":[[1,0]],"masses":[5],"dt":0.5,"G":1}, {"velocities":[[1,0]],"positions":[[0.5,0]]}, "单天体不受力，匀速运动")
    ],
    tests: [
      example({"positions":[[0,0],[10,0]],"velocities":[[0,0],[0,0]],"masses":[100,1],"dt":0.1,"G":1}, {"velocities":[[0.001,0],[-0.1,0]],"positions":[[0.0001,0],[9.99,0]]}),
      example({"positions":[[0,0],[2,0]],"velocities":[[0,-1],[0,1]],"masses":[50,50],"dt":0.01,"G":1}, {"velocities":[[0.125,-1],[-0.125,1]],"positions":[[0.00125,-0.01],[1.99875,0.01]]}),
      example({"positions":[[0,0],[1,1],[-1,1]],"velocities":[[0,0],[0,0],[0,0]],"masses":[10,10,10],"dt":0.5,"G":1}, {"velocities":[[0,3.535534],[-3.017767,-1.767767],[3.017767,-1.767767]],"positions":[[0,1.767767],[-0.508883,0.116117],[0.508883,0.116117]]})
    ],
    insights: ["成对引力满足牛顿第三定律：计算加速度时用对称累加（i 得到 j 的负贡献），既省一半计算又保证动量守恒。","半隐式欧拉「先更新速度、再用新速度更新位置」比显式欧拉稳定得多——轨道模拟的入门标配。"],
    pitfalls: ["除以 r³ 得到方向向量，r² 直接当分母会丢方向信息。","自身不产生引力，双循环从 j = i+1 开始成对计算。"],
    solution: `import math


def solve(data):
    positions = [[float(p[0]), float(p[1])] for p in data["positions"]]
    velocities = [[float(v[0]), float(v[1])] for v in data["velocities"]]
    masses = [float(m) for m in data["masses"]]
    dt = float(data["dt"])
    G = float(data["G"])
    n = len(positions)
    ax = [0.0] * n
    ay = [0.0] * n
    for i in range(n):
        for j in range(i + 1, n):
            dx = positions[j][0] - positions[i][0]
            dy = positions[j][1] - positions[i][1]
            r2 = dx * dx + dy * dy
            r = math.sqrt(r2)
            if r == 0:
                continue
            f = G * masses[i] * masses[j] / (r2 * r)
            ax[i] += f * dx / masses[i]
            ay[i] += f * dy / masses[i]
            ax[j] -= f * dx / masses[j]
            ay[j] -= f * dy / masses[j]
    for i in range(n):
        velocities[i][0] += ax[i] * dt
        velocities[i][1] += ay[i] * dt
        positions[i][0] += velocities[i][0] * dt
        positions[i][1] += velocities[i][1] * dt
    return {
        "velocities": [[round(v[0], 6), round(v[1], 6)] for v in velocities],
        "positions": [[round(p[0], 6), round(p[1], 6)] for p in positions],
    }
`,
  },
  "flow-field": {
    statement: "在 0/1 网格（0 可走、1 障碍）上从 target 做反向 BFS 得到距离场，每个可走格输出「通往距离更小的相邻格」的方向 [dr, dc]（四方向，取方向表顺序第一个严格更近者）；target 格输出 [0, 0]，障碍与不可达格输出 null。返回方向场网格。",
    input: "data 为 {\"grid\": 0/1 二维数组, \"target\": [r, c]}。",
    output: "返回同尺寸网格，元素为 [dr, dc]、[0, 0] 或 null。",
    constraints: ["1 <= rows, cols <= 30","target 为可走格"],
    examples: [
      example({"grid":[[0,0],[0,0]],"target":[1,1]}, [[[1,0],[1,0]],[[0,1],[0,0]]])
    ],
    tests: [
      example({"grid":[[0]],"target":[0,0]}, [[[0,0]]]),
      example({"grid":[[0,0,0]],"target":[0,2]}, [[[0,1],[0,1],[0,0]]]),
      example({"grid":[[0,1],[0,0]],"target":[1,1]}, [[[1,0],null],[[0,1],[0,0]]]),
      example({"grid":[[0,0],[0,0]],"target":[0,0]}, [[[0,0],[0,-1]],[[-1,0],[-1,0]]])
    ],
    insights: ["流场是「反向 BFS + 逐格取梯度」：距离场每格只存一个数，方向即任一距离更小的邻居——寻路的查询从此 O(1)。","四方向按固定顺序取第一个更近者，保证输出唯一确定。"],
    pitfalls: ["障碍格与 BFS 不可达格都要输出 null，漏一类判题就挂。","方向是 [dr, dc] 行列增量，不是 [dc, dr]，写反会让箭头转向。"],
    solution: `from collections import deque


def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    tr, tc = int(data["target"][0]), int(data["target"][1])
    dist = [[None] * cols for _ in range(rows)]
    dist[tr][tc] = 0
    queue = deque([(tr, tc)])
    while queue:
        r, c = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and dist[nr][nc] is None:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    field = [[None] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1 or dist[r][c] is None:
                continue
            if (r, c) == (tr, tc):
                field[r][c] = [0, 0]
                continue
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] is not None and dist[nr][nc] < dist[r][c]:
                    field[r][c] = [dr, dc]
                    break
    return field
`,
  },
  "quadtree": {
    statement: "实现四叉树点插入统计：根节点覆盖给定矩形边界，节点内点数超过 capacity 时以当前边界中心分为四个象限（点按 x >= cx、y >= cy 归入四象限，子边界随之收缩）。返回 {\"leaf_count\": 叶节点数, \"total_nodes\": 节点总数, \"max_depth\": 最大深度（根为 0）}。",
    input: "data 为 {\"points\": [[x, y], ...], \"bounds\": [minx, miny, maxx, maxy], \"capacity\": 正整数}，点互不相同且都在边界内。",
    output: "返回 {\"leaf_count\": 整数, \"total_nodes\": 整数, \"max_depth\": 整数}。",
    constraints: ["1 <= len(points) <= 60","点互不相同","1 <= capacity <= 8"],
    examples: [
      example({"points":[[1,1],[9,9]],"bounds":[0,0,10,10],"capacity":1}, {"leaf_count":2,"total_nodes":3,"max_depth":1})
    ],
    tests: [
      example({"points":[[1,1]],"bounds":[0,0,10,10],"capacity":4}, {"leaf_count":1,"total_nodes":1,"max_depth":0}),
      example({"points":[[1,1],[2,2],[3,3],[4,4],[5,5]],"bounds":[0,0,10,10],"capacity":2}, {"leaf_count":3,"total_nodes":5,"max_depth":2})
    ],
    insights: ["四叉树的分裂由「容量阈值」驱动：超容时以中心切四象限，点按坐标归入对应子节点——空间查询从此只需走一条路径。","深度即「定位一个点需要的比较次数」，对均匀分布点集是 O(log n)。"],
    pitfalls: ["象限归属用 >= 中心 归入高侧，边界上的点必须有唯一归属。","点重合会无限分裂，本题以「点互不相同」排除。"],
    solution: `def solve(data):
    points = [(float(p[0]), float(p[1])) for p in data["points"]]
    capacity = int(data["capacity"])
    stats = {"leaf_count": 0, "total_nodes": 0, "max_depth": 0}

    def build(bounds, pts, depth):
        stats["total_nodes"] += 1
        stats["max_depth"] = max(stats["max_depth"], depth)
        if len(pts) <= capacity:
            stats["leaf_count"] += 1
            return
        minx, miny, maxx, maxy = bounds
        cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
        quadrants = [[] for _ in range(4)]
        for x, y in pts:
            idx = (1 if x >= cx else 0) * 2 + (1 if y >= cy else 0)
            quadrants[idx].append((x, y))
        sub_bounds = [
            (minx, miny, cx, cy),
            (minx, cy, cx, maxy),
            (cx, miny, maxx, cy),
            (cx, cy, maxx, maxy),
        ]
        for qb, qp in zip(sub_bounds, quadrants):
            if qp:
                build(qb, qp, depth + 1)

    build(tuple(float(v) for v in data["bounds"]), points, 0)
    return stats
`,
  },
  "octree": {
    statement: "实现八叉树点插入统计：根节点覆盖给定长方体，节点内点数超过 capacity 时以中心分为八个卦限（点按 x、y、z 与中心比较归入，3 位索引），子边界随之收缩。返回 {\"leaf_count\": 叶节点数, \"total_nodes\": 节点总数, \"max_depth\": 最大深度（根为 0）}。",
    input: "data 为 {\"points\": [[x, y, z], ...], \"bounds\": [minx, miny, minz, maxx, maxy, maxz], \"capacity\": 正整数}，点互不相同。",
    output: "返回 {\"leaf_count\": 整数, \"total_nodes\": 整数, \"max_depth\": 整数}。",
    constraints: ["1 <= len(points) <= 40","点互不相同","1 <= capacity <= 4"],
    examples: [
      example({"points":[[1,1,1],[2,2,2]],"bounds":[0,0,0,10,10,10],"capacity":1}, {"leaf_count":2,"total_nodes":5,"max_depth":3}, "两点同卦限需继续分裂到分开为止")
    ],
    tests: [
      example({"points":[[5,5,5]],"bounds":[0,0,0,10,10,10],"capacity":2}, {"leaf_count":1,"total_nodes":1,"max_depth":0}),
      example({"points":[[1,1,1],[9,9,9]],"bounds":[0,0,0,10,10,10],"capacity":1}, {"leaf_count":2,"total_nodes":3,"max_depth":1}),
      example({"points":[[1,1,1],[2,2,2],[3,3,3],[4,4,4],[5,5,5]],"bounds":[0,0,0,10,10,10],"capacity":2}, {"leaf_count":3,"total_nodes":5,"max_depth":2})
    ],
    insights: ["八叉树是四叉树的三维推广：每次分裂产生 8 个卦限，索引用 3 个比较位拼成 0..7——体素场景的空间索引标准做法。","「点互不相同」保证分裂必然收敛：边界不断缩小，两个不同的点终会落进不同卦限。"],
    pitfalls: ["卦限索引的三个比较位与子边界切分要一一对应，顺序错乱会让点「失踪」。","同象限继续分裂时边界要跟着子块收缩，沿用父边界会死循环。"],
    solution: `def solve(data):
    points = [tuple(float(v) for v in p) for p in data["points"]]
    capacity = int(data["capacity"])
    stats = {"leaf_count": 0, "total_nodes": 0, "max_depth": 0}

    def build(bounds, pts, depth):
        stats["total_nodes"] += 1
        stats["max_depth"] = max(stats["max_depth"], depth)
        if len(pts) <= capacity:
            stats["leaf_count"] += 1
            return
        minx, miny, minz, maxx, maxy, maxz = bounds
        cx, cy, cz = (minx + maxx) / 2, (miny + maxy) / 2, (minz + maxz) / 2
        octants = [[] for _ in range(8)]
        for x, y, z in pts:
            idx = (1 if x >= cx else 0) * 4 + (1 if y >= cy else 0) * 2 + (1 if z >= cz else 0)
            octants[idx].append((x, y, z))
        sub_bounds = [
            (minx, miny, minz, cx, cy, cz),
            (minx, miny, cz, cx, cy, maxz),
            (minx, cy, minz, cx, maxy, cz),
            (minx, cy, cz, cx, maxy, maxz),
            (cx, miny, minz, maxx, cy, cz),
            (cx, miny, cz, maxx, cy, maxz),
            (cx, cy, minz, maxx, maxy, cz),
            (cx, cy, cz, maxx, maxy, maxz),
        ]
        for qb, qp in zip(sub_bounds, octants):
            if qp:
                build(qb, qp, depth + 1)

    build(tuple(float(v) for v in data["bounds"]), points, 0)
    return stats
`,
  },
  "kd-tree": {
    statement: "实现 k-d 树最近邻查询：按深度交替以 x、y 轴构建（排序后取下中位为节点，左闭右开分治），查询时先下潜再按「到分割面距离」剪枝回溯，最近并列取原始下标最小者。返回每个查询点的 [最近邻下标, 距离平方]。",
    input: "data 为 {\"points\": [[x, y], ...], \"queries\": [[x, y], ...]}，点互不相同。",
    output: "返回 [[index, dist2], ...] 与 queries 等长。",
    constraints: ["1 <= len(points) <= 200","1 <= queries.length <= 100","-10^6 <= 坐标 <= 10^6"],
    examples: [
      example({"points":[[2,3],[5,4],[9,6],[4,7],[8,1],[7,2]],"queries":[[9,2],[5,5]]}, [[4,2],[1,1]])
    ],
    tests: [
      example({"points":[[1,1]],"queries":[[2,2],[0,0]]}, [[0,2],[0,2]]),
      example({"points":[[0,0],[10,10]],"queries":[[4,4],[8,8],[6,6]]}, [[0,32],[1,8],[1,32]]),
      example({"points":[[1,1],[2,2],[3,3]],"queries":[[2,3]]}, [[1,1]])
    ],
    insights: ["k-d 树把空间按轴交替二分，查询时「先到包含查询点的一侧，再用分割面距离剪掉另一侧」——均匀点集下平均 O(log n)。","回溯的剪枝判据是「圆到分割面的距离平方 < 当前最优」，相等时不能剪（对面可能有并列更优者，本题按 (dist2, 下标) 破平）。"],
    pitfalls: ["下中位的划分要保持「左子树全部 ≤ 节点」才能用分割面剪枝。","并列最近时按下标最小者输出，比较键写成 (dist2, index)。"],
    solution: `def solve(data):
    pts = [(p[0], p[1]) for p in data["points"]]
    n = len(pts)
    nodes = []

    def build(indices, depth):
        if not indices:
            return -1
        axis = depth % 2
        ordered = sorted(indices, key=lambda i: (pts[i][axis], i))
        mid = len(ordered) // 2
        node_id = len(nodes)
        nodes.append({"point": ordered[mid], "left": -1, "right": -1, "axis": axis})
        left = build(ordered[:mid], depth + 1)
        right = build(ordered[mid + 1:], depth + 1)
        nodes[node_id]["left"] = left
        nodes[node_id]["right"] = right
        return node_id

    root = build(list(range(n)), 0)
    out = []
    for qx, qy in data["queries"]:
        qx, qy = qx, qy
        best = {"dist2": None, "index": None}

        def visit(node_id):
            if node_id == -1:
                return
            node = nodes[node_id]
            px, py = pts[node["point"]]
            d2 = (px - qx) ** 2 + (py - qy) ** 2
            if best["dist2"] is None or (d2, node["point"]) < (best["dist2"], best["index"]):
                best["dist2"] = d2
                best["index"] = node["point"]
            axis = node["axis"]
            diff = (qx - px) if axis == 0 else (qy - py)
            near, far = (node["left"], node["right"]) if diff < 0 else (node["right"], node["left"])
            visit(near)
            if best["dist2"] is None or diff * diff <= best["dist2"]:
                visit(far)

        visit(root)
        out.append([best["index"], best["dist2"]])
    return out
`,
  },
  "r-tree": {
    statement: "用 STR（Sort-Tile-Recursive）批量装载 R 树的叶层：点按 x 排序后切成 ceil(N/capacity) 个竖条（每条 capacity 个点），条内按 y 排序、每 capacity 个点组成一个叶节点，输出每个叶节点的包围盒 [minx, miny, maxx, maxy]（按构建顺序）。",
    input: "data 为 {\"points\": [[x, y], ...], \"capacity\": 正整数}。",
    output: "返回 {\"leaves\": [[minx, miny, maxx, maxy], ...], \"leaf_count\": 整数}。",
    constraints: ["1 <= len(points) <= 100","1 <= capacity <= 10","点互不相同"],
    examples: [
      example({"points":[[1,1],[2,2],[10,10],[11,11]],"capacity":2}, {"leaves":[[1,1,2,2],[10,10,11,11]],"leaf_count":2})
    ],
    tests: [
      example({"points":[[3,3]],"capacity":2}, {"leaves":[[3,3,3,3]],"leaf_count":1}),
      example({"points":[[5,1],[1,5],[4,4],[2,2],[6,6]],"capacity":2}, {"leaves":[[1,2,2,5],[4,1,5,4],[6,6,6,6]],"leaf_count":3}),
      example({"points":[[1,1],[2,2],[3,3],[4,4],[5,5]],"capacity":5}, {"leaves":[[1,1,5,5]],"leaf_count":1})
    ],
    insights: ["STR 的两段排序让叶节点的包围盒又小又方：先按 x 切竖条保证条间不重叠，条内按 y 聚簇使每个叶覆盖紧凑的点群。","装载一次完成、无需逐条插入——静态数据的 R 树构建方式，查询性能优于逐点插入。"],
    pitfalls: ["每条恰好 capacity 个点，条数是 ceil(N/capacity)，最后一条可能不满。","包围盒用条内点的真实坐标 min/max，不是条的逻辑边界。"],
    solution: `import math


def solve(data):
    points = [(p[0], p[1]) for p in data["points"]]
    capacity = int(data["capacity"])
    n = len(points)
    by_x = sorted(points, key=lambda p: (p[0], p[1]))
    slices = [by_x[i * capacity:(i + 1) * capacity] for i in range(math.ceil(n / capacity))]
    leaves = []
    for slice_pts in slices:
        by_y = sorted(slice_pts, key=lambda p: (p[1], p[0]))
        for start in range(0, len(by_y), capacity):
            group = by_y[start:start + capacity]
            xs = [p[0] for p in group]
            ys = [p[1] for p in group]
            leaves.append([min(xs), min(ys), max(xs), max(ys)])
    return {"leaves": leaves, "leaf_count": len(leaves)}
`,
  },
  "bounding-volume-hierarchy": {
    statement: "构建二维包围盒层次结构（BVH）：每个节点取自身盒集合的包围盒，沿「最长轴」按盒中心排序后在中点分裂（左半 len//2），单盒即叶。返回 {\"leaf_boxes\": DFS 先序的叶包围盒, \"internal_nodes\": 内部节点数, \"root_bounds\": 根包围盒}。",
    input: "data 为 {\"boxes\": [[minx, miny, maxx, maxy], ...]}。",
    output: "返回 {\"leaf_boxes\": 二维数组（DFS 先序）, \"internal_nodes\": 整数, \"root_bounds\": [minx, miny, maxx, maxy]}。",
    constraints: ["1 <= len(boxes) <= 40","minx <= maxx, miny <= maxy"],
    examples: [
      example({"boxes":[[0,0,1,1],[10,0,11,1],[0,10,1,11],[10,10,11,11]]}, {"leaf_boxes":[[0,0,1,1],[0,10,1,11],[10,0,11,1],[10,10,11,11]],"internal_nodes":3,"root_bounds":[0,0,11,11]})
    ],
    tests: [
      example({"boxes":[[5,5,6,6]]}, {"leaf_boxes":[[5,5,6,6]],"internal_nodes":0,"root_bounds":[5,5,6,6]}),
      example({"boxes":[[0,0,1,1],[20,20,21,21]]}, {"leaf_boxes":[[0,0,1,1],[20,20,21,21]],"internal_nodes":1,"root_bounds":[0,0,21,21]}),
      example({"boxes":[[0,0,2,2],[1,1,3,3],[10,10,11,11],[12,12,13,13],[20,20,21,21]]}, {"leaf_boxes":[[0,0,2,2],[1,1,3,3],[10,10,11,11],[12,12,13,13],[20,20,21,21]],"internal_nodes":4,"root_bounds":[0,0,21,21]})
    ],
    insights: ["BVH 的分裂策略决定查询效率：沿最长轴分裂让子盒尽量方正，「中心排序 + 中点分割」保证树平衡（深度 O(log n)）。","叶的 DFS 先序即「空间局部性序」：相邻叶在数组中也相邻，遍历缓存友好。"],
    pitfalls: ["最长轴并列时约定取 x 轴，排序并列时按原始下标稳定处理。","内部节点数 = 总节点数 - 叶数，n 个叶恰有 n-1 个内部节点。"],
    solution: `def solve(data):
    boxes = [tuple(b) for b in data["boxes"]]
    leaf_boxes = []
    internal = [0]

    def bounds_of(indices):
        xs0 = [boxes[i][0] for i in indices]
        ys0 = [boxes[i][1] for i in indices]
        xs1 = [boxes[i][2] for i in indices]
        ys1 = [boxes[i][3] for i in indices]
        return (min(xs0), min(ys0), max(xs1), max(ys1))

    def build(indices):
        if len(indices) == 1:
            leaf_boxes.append(list(boxes[indices[0]]))
            return
        internal[0] += 1
        bounds = bounds_of(indices)
        dx = bounds[2] - bounds[0]
        dy = bounds[3] - bounds[1]
        axis = 0 if dx >= dy else 1
        ordered = sorted(indices, key=lambda i: ((boxes[i][0] + boxes[i][2]) / 2 if axis == 0 else (boxes[i][1] + boxes[i][3]) / 2, i))
        mid = len(ordered) // 2
        build(ordered[:mid])
        build(ordered[mid:])

    build(list(range(len(boxes))))
    return {
        "leaf_boxes": leaf_boxes,
        "internal_nodes": internal[0],
        "root_bounds": list(bounds_of(list(range(len(boxes))))),
    }
`,
  },
};
