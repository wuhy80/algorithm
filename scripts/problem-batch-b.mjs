const example = (input, output, explanation = '') => ({ input, output, explanation });

function sortProblem(name, solution, examples = [example([5, 1, 4, 2, 8], [1, 2, 4, 5, 8])], tests = []) {
  return {
    statement: `给定一个整数数组，使用 ${name} 的核心过程返回升序结果。不能直接调用 sorted() 或 list.sort()。`,
    input: 'data 是长度为 n 的整数数组。',
    output: '返回一个新的升序数组，不修改调用方传入的数据。',
    constraints: ['0 <= n <= 10^4', '-10^6 <= data[i] <= 10^6'],
    examples,
    tests: [example([], []), example([3], [3]), ...tests],
    insights: ['先说清楚每一轮确定了哪一段有序区域，再实现局部操作。', '重复元素、空数组和已经有序的输入不能破坏不变量。'],
    pitfalls: ['直接调用内置排序会绕过本题要练习的状态变化。', '边界循环必须覆盖空数组和单元素数组。'],
    solution,
  };
}

export const problemBatchB = {
  'radix-sort': sortProblem('基数排序', `def solve(data):
    values = list(data)
    if not values:
        return []
    if any(value < 0 for value in values):
        raise ValueError('本题只接受非负整数')
    place = 1
    maximum = max(values)
    while maximum // place:
        buckets = [[] for _ in range(10)]
        for value in values:
            buckets[(value // place) % 10].append(value)
        values = [value for bucket in buckets for value in bucket]
        place *= 10
    return values
`, [example([170, 45, 75, 90, 802, 24, 2, 66], [2, 24, 45, 66, 75, 90, 170, 802])], [example([0, 10, 1, 100], [0, 1, 10, 100])]),

  'quickselect': {
    statement: '给定无序数组和 0-based 下标 k，使用快速选择返回第 k 小元素。',
    input: 'data 为 {"nums": [...], "k": int}。',
    output: '返回排序后下标 k 处的元素。',
    constraints: ['1 <= len(nums) <= 10^4', '0 <= k < len(nums)'],
    examples: [example({ nums: [7, 10, 4, 3, 20, 15], k: 2 }, 7)],
    tests: [example({ nums: [1], k: 0 }, 1), example({ nums: [3, 3, 1, 2], k: 1 }, 2), example({ nums: [-4, 0, -2, 8], k: 0 }, -4)],
    insights: ['partition 后，枢轴左侧都不大于它，右侧都不小于它；只递归包含 k 的一侧。'],
    pitfalls: ['k 是下标而不是第几个元素；重复值也必须让指针继续前进。'],
    solution: `def solve(data):
    values = list(data["nums"])
    k = data["k"]
    left, right = 0, len(values) - 1
    while left <= right:
        pivot = values[right]
        store = left
        for index in range(left, right):
            if values[index] <= pivot:
                values[store], values[index] = values[index], values[store]
                store += 1
        values[store], values[right] = values[right], values[store]
        if store == k:
            return values[store]
        if store < k:
            left = store + 1
        else:
            right = store - 1
    raise ValueError("k out of range")
`,
  },

  'shell-sort': sortProblem('希尔排序', `def solve(data):
    values = list(data)
    gap = len(values) // 2
    while gap:
        for start in range(gap):
            for index in range(start + gap, len(values), gap):
                key = values[index]
                cursor = index - gap
                while cursor >= start and values[cursor] > key:
                    values[cursor + gap] = values[cursor]
                    cursor -= gap
                values[cursor + gap] = key
        gap //= 2
    return values
`, [example([12, 34, 54, 2, 3], [2, 3, 12, 34, 54])]),

  'merge-intervals': {
    statement: '给定一组可能重叠的闭区间，合并所有相交或相邻的区间。',
    input: 'data 为 [[start,end], ...]，其中 start <= end。',
    output: '按起点升序返回互不重叠的合并区间。',
    constraints: ['0 <= 区间数 <= 10^4'],
    examples: [example([[1, 3], [2, 6], [8, 10], [9, 12]], [[1, 6], [8, 12]])],
    tests: [example([], []), example([[1, 4]], [[1, 4]]), example([[1, 2], [2, 3]], [[1, 3]]), example([[5, 7], [1, 2]], [[1, 2], [5, 7]])],
    insights: ['按左端点排序后，当前区间只需要和结果末尾比较；若 start <= last_end，两个区间可以合并。'],
    pitfalls: ['题目若把相邻区间视为可合并，条件应使用 <=；不要只判断严格重叠。'],
    solution: `def solve(data):
    intervals = sorted((left, right) for left, right in data)
    merged = []
    for left, right in intervals:
        if not merged or left > merged[-1][1] + 1:
            merged.append([left, right])
        else:
            merged[-1][1] = max(merged[-1][1], right)
    return merged
`,
  },

  'coordinate-compression': {
    statement: '将数组中的不同整数映射为从 0 开始的连续排名，并保留重复值的相同映射。',
    input: 'data 为整数数组。',
    output: '返回与 data 等长的压缩坐标数组。',
    constraints: ['0 <= n <= 10^5'],
    examples: [example([100, 20, 100, -5], [2, 1, 2, 0])],
    tests: [example([], []), example([7], [0]), example([3, 1, 2, 1], [2, 0, 1, 0])],
    insights: ['排序只用于建立“值 → rank”字典，真正转换时按原数组顺序查表。'],
    pitfalls: ['重复值必须共享 rank；不要直接用排序后的下标覆盖原顺序。'],
    solution: `def solve(data):
    ranks = {value: index for index, value in enumerate(sorted(set(data)))}
    return [ranks[value] for value in data]
`,
  },

  'inversion-count': {
    statement: '统计数组中满足 i < j 且 nums[i] > nums[j] 的逆序对数量。',
    input: 'data 为整数数组。',
    output: '返回逆序对总数。',
    constraints: ['0 <= n <= 2 * 10^4'],
    examples: [example([2, 4, 1, 3, 5], 3)],
    tests: [example([], 0), example([1], 0), example([3, 2, 1], 3), example([1, 1, 1], 0)],
    insights: ['归并两个有序半段时，若右侧元素先取出，它会和左侧当前剩余的全部元素形成逆序对。'],
    pitfalls: ['相等元素不是逆序对，比较应使用 > 而不是 >=；计数要用 64 位范围。'],
    solution: `def solve(data):
    values = list(data)
    temp = [0] * len(values)

    def merge_sort(left, right):
        if right - left <= 1:
            return 0
        middle = (left + right) // 2
        count = merge_sort(left, middle) + merge_sort(middle, right)
        i, j, cursor = left, middle, left
        while i < middle and j < right:
            if values[i] <= values[j]:
                temp[cursor] = values[i]; i += 1
            else:
                temp[cursor] = values[j]; j += 1
                count += middle - i
            cursor += 1
        while i < middle:
            temp[cursor] = values[i]; i += 1; cursor += 1
        while j < right:
            temp[cursor] = values[j]; j += 1; cursor += 1
        values[left:right] = temp[left:right]
        return count

    return merge_sort(0, len(values))
`,
  },

  'activity-selection': {
    statement: '从若干开始和结束时间中选择最多个互不重叠的活动。一个活动结束的时刻可以接上另一个活动。',
    input: 'data 为 [[start,end], ...]。',
    output: '返回最多可安排的活动数量。',
    constraints: ['0 <= 活动数 <= 10^4'],
    examples: [example([[1, 3], [2, 5], [4, 7], [6, 9], [8, 10]], 3)],
    tests: [example([], 0), example([[1, 2]], 1), example([[1, 4], [2, 3], [3, 5]], 2)],
    insights: ['每次选择当前能结束得最早的活动，为后续留下最大的可用时间窗口；交换论证保证这个贪心选择不劣于任何最优解。'],
    pitfalls: ['排序键是结束时间，不是持续时间或开始时间；兼容条件是 start >= last_end。'],
    solution: `def solve(data):
    count, last_end = 0, None
    for start, end in sorted(data, key=lambda item: item[1]):
        if last_end is None or start >= last_end:
            count += 1
            last_end = end
    return count
`,
  },

  'fractional-knapsack': {
    statement: '每件物品可以取任意比例，在容量限制内最大化总价值。',
    input: 'data 为 {"items": [[weight,value], ...], "capacity": number}。',
    output: '返回最大价值，允许小数。',
    constraints: ['weight > 0', 'capacity >= 0'],
    examples: [example({ items: [[10, 60], [20, 100], [30, 120]], capacity: 50 }, 240.0)],
    tests: [example({ items: [], capacity: 10 }, 0.0), example({ items: [[5, 10]], capacity: 2 }, 4.0), example({ items: [[2, 10], [3, 12]], capacity: 0 }, 0.0)],
    insights: ['按 value / weight 从高到低取，最后一件可以只取剩余容量的比例；密度最高的物品不会被低密度物品替换而变差。'],
    pitfalls: ['不能按绝对价值排序；容量不足时要取比例而不是整件丢弃。'],
    solution: `def solve(data):
    capacity = float(data["capacity"])
    total = 0.0
    for weight, value in sorted(data["items"], key=lambda item: item[1] / item[0], reverse=True):
        if capacity <= 0:
            break
        amount = min(float(weight), capacity)
        total += amount * value / weight
        capacity -= amount
    return total
`,
  },

  'n-queens': {
    statement: '在 n×n 棋盘放置 n 个皇后，使任意两个皇后不在同一行、同一列或同一条对角线上，返回方案数量。',
    input: 'data 为整数 n。',
    output: '返回合法摆放方案总数。',
    constraints: ['0 <= n <= 10'],
    examples: [example(4, 2)],
    tests: [example(0, 1), example(1, 1), example(2, 0), example(5, 10)],
    insights: ['按行放置，每一层只选择一个列；columns、diag1、diag2 三个集合把同列和两类对角线冲突压缩成 O(1) 判断。'],
    pitfalls: ['回溯返回上一行时必须撤销三个集合；两类对角线分别由 row-col 和 row+col 标识。'],
    solution: `def solve(data):
    n = int(data)
    columns, diag1, diag2 = set(), set(), set()

    def search(row):
        if row == n:
            return 1
        total = 0
        for column in range(n):
            if column in columns or row - column in diag1 or row + column in diag2:
                continue
            columns.add(column); diag1.add(row - column); diag2.add(row + column)
            total += search(row + 1)
            columns.remove(column); diag1.remove(row - column); diag2.remove(row + column)
        return total

    return search(0)
`,
  },

  'tower-of-hanoi': {
    statement: '把 n 个从小到大叠放的圆盘从柱 A 移到柱 C，每次只能移动一个盘且不能把大盘放在小盘上，返回移动序列。',
    input: 'data 为整数 n。',
    output: '返回形如 [["A","C"], ...] 的最少移动序列。',
    constraints: ['0 <= n <= 10'],
    examples: [example(2, [['A', 'B'], ['A', 'C'], ['B', 'C']])],
    tests: [example(0, []), example(1, [['A', 'C']])],
    insights: ['移动 n 个盘等价于先把 n-1 个盘移到辅助柱，再移动最大盘，最后把 n-1 个盘移到目标柱。'],
    pitfalls: ['递归参数的三根柱顺序不能混淆；n=0 应直接返回空序列。'],
    solution: `def solve(data):
    moves = []

    def move(count, source, auxiliary, target):
        if count == 0:
            return
        move(count - 1, source, target, auxiliary)
        moves.append([source, target])
        move(count - 1, auxiliary, source, target)

    move(int(data), "A", "B", "C")
    return moves
`,
  },

  'zero-one-bfs': {
    statement: '在只包含 0/1 边权的网格中，从起点走到终点，返回最小代价。0 表示不增加代价，1 表示增加 1。',
    input: 'data 为 {"grid": [[...]], "start": [r,c], "target": [r,c]}。',
    output: '返回最小路径代价；不可达时返回 -1。',
    constraints: ['网格非空，元素只为 0 或 1', '只能上下左右移动'],
    examples: [example({ grid: [[0, 1, 1], [0, 0, 1], [1, 0, 0]], start: [0, 0], target: [2, 2] }, 0)],
    tests: [example({ grid: [[0]], start: [0, 0], target: [0, 0] }, 0), example({ grid: [[1, 1], [1, 1]], start: [0, 0], target: [1, 1] }, 2)],
    insights: ['双端队列中，代价 0 的新状态放到队首，代价 1 的新状态放到队尾；因此队列始终按当前距离的非递减顺序处理。'],
    pitfalls: ['不能把它当成普通 BFS 忽略边权；松弛成功后才入队，避免无效重复。'],
    solution: `from collections import deque

def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    start, target = tuple(data["start"]), tuple(data["target"])
    inf = 10**9
    distance = [[inf] * cols for _ in range(rows)]
    distance[start[0]][start[1]] = 0
    queue = deque([start])
    while queue:
        row, col = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = row + dr, col + dc
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            cost = grid[nr][nc]
            candidate = distance[row][col] + cost
            if candidate >= distance[nr][nc]:
                continue
            distance[nr][nc] = candidate
            if cost == 0:
                queue.appendleft((nr, nc))
            else:
                queue.append((nr, nc))
    answer = distance[target[0]][target[1]]
    return -1 if answer == inf else answer
`,
  },

  'dijkstra': {
    statement: '给定非负加权有向图，求起点到目标点的最短距离。',
    input: 'data 为 {"n": 节点数, "edges": [[u,v,w], ...], "start": int, "target": int}。',
    output: '返回最短距离；不可达时返回 -1。',
    constraints: ['所有边权 w >= 0'],
    examples: [example({ n: 5, edges: [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5], [3, 4, 3]], start: 0, target: 4 }, 7)],
    tests: [example({ n: 1, edges: [], start: 0, target: 0 }, 0), example({ n: 3, edges: [[0, 1, 2]], start: 0, target: 2 }, -1)],
    insights: ['优先队列每次取出当前距离最小的未定节点；由于边权非负，这个距离一旦出队就是最终最短距离。'],
    pitfalls: ['允许重复的旧堆项，出队时用 distance != known 跳过；Dijkstra 不能处理负边。'],
    solution: `import heapq

def solve(data):
    graph = [[] for _ in range(data["n"])]
    for start, end, weight in data["edges"]:
        graph[start].append((end, weight))
    inf = 10**18
    distance = [inf] * data["n"]
    source, target = data["start"], data["target"]
    distance[source] = 0
    heap = [(0, source)]
    while heap:
        current, node = heapq.heappop(heap)
        if current != distance[node]:
            continue
        if node == target:
            return current
        for neighbor, weight in graph[node]:
            candidate = current + weight
            if candidate < distance[neighbor]:
                distance[neighbor] = candidate
                heapq.heappush(heap, (candidate, neighbor))
    return -1
`,
  },

  'bellman-ford': {
    statement: '给定允许负边但不含可达负环的有向图，求起点到目标点的最短距离。',
    input: 'data 为 {"n": 节点数, "edges": [[u,v,w], ...], "start": int, "target": int}。',
    output: '返回最短距离；不可达时返回 -1。',
    constraints: ['不存在从 start 可达的负权环'],
    examples: [example({ n: 4, edges: [[0, 1, 4], [0, 2, 5], [1, 2, -3], [2, 3, 4]], start: 0, target: 3 }, 5)],
    tests: [example({ n: 1, edges: [], start: 0, target: 0 }, 0), example({ n: 3, edges: [[0, 1, -2]], start: 0, target: 2 }, -1)],
    insights: ['第 i 轮松弛后，最多包含 i 条边的最短路已经正确；重复 n-1 轮覆盖所有简单路径。'],
    pitfalls: ['从不可达节点继续相加会污染答案；必须先判断 distance[u] 是否为无穷。'],
    solution: `def solve(data):
    n = data["n"]
    inf = 10**18
    distance = [inf] * n
    distance[data["start"]] = 0
    for _ in range(n - 1):
        changed = False
        for start, end, weight in data["edges"]:
            if distance[start] == inf:
                continue
            candidate = distance[start] + weight
            if candidate < distance[end]:
                distance[end] = candidate
                changed = True
        if not changed:
            break
    answer = distance[data["target"]]
    return -1 if answer == inf else answer
`,
  },

  'kruskal-mst': {
    statement: '给定无向连通带权图，使用 Kruskal 算法返回最小生成树的总权重。',
    input: 'data 为 {"n": 节点数, "edges": [[u,v,w], ...]}。',
    output: '返回最小生成树总权重；图不连通时返回 -1。',
    constraints: ['边为无向边，可能有平行边'],
    examples: [example({ n: 4, edges: [[0, 1, 1], [0, 2, 4], [1, 2, 2], [1, 3, 5], [2, 3, 1]] }, 4)],
    tests: [example({ n: 1, edges: [] }, 0), example({ n: 3, edges: [[0, 1, 1]] }, -1)],
    insights: ['按边权从小到大尝试，只有连接两个不同连通块的边才加入；并查集维护“是否已经连通”。'],
    pitfalls: ['同一连通块内的边会形成环，必须跳过；最后要检查加入边数是否为 n-1。'],
    solution: `def solve(data):
    parent = list(range(data["n"]))
    size = [1] * data["n"]

    def find(node):
        while parent[node] != node:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node

    total = used = 0
    for left, right, weight in sorted(data["edges"], key=lambda edge: edge[2]):
        root_left, root_right = find(left), find(right)
        if root_left == root_right:
            continue
        if size[root_left] < size[root_right]:
            root_left, root_right = root_right, root_left
        parent[root_right] = root_left
        size[root_left] += size[root_right]
        total += weight
        used += 1
    return total if used == data["n"] - 1 else -1
`,
  },

  'prim-mst': {
    statement: '给定无向连通带权图，使用 Prim 算法返回最小生成树的总权重。',
    input: 'data 为 {"n": 节点数, "edges": [[u,v,w], ...]}。',
    output: '返回最小生成树总权重；图不连通时返回 -1。',
    constraints: ['边为无向边，权重可以重复'],
    examples: [example({ n: 4, edges: [[0, 1, 1], [0, 2, 4], [1, 2, 2], [1, 3, 5], [2, 3, 1]] }, 4)],
    tests: [example({ n: 1, edges: [] }, 0), example({ n: 3, edges: [[0, 1, 1]] }, -1)],
    insights: ['维护已连接集合与跨越集合的最小边，每次把一个新节点吸收到生成树中。'],
    pitfalls: ['堆里可能有旧候选，加入节点前先检查 visited；图不连通时堆会提前为空。'],
    solution: `import heapq

def solve(data):
    graph = [[] for _ in range(data["n"])]
    for left, right, weight in data["edges"]:
        graph[left].append((weight, right))
        graph[right].append((weight, left))
    visited = [False] * data["n"]
    heap, total, used = [(0, 0)], 0, 0
    while heap:
        weight, node = heapq.heappop(heap)
        if visited[node]:
            continue
        visited[node] = True
        total += weight
        used += 1
        for next_weight, neighbor in graph[node]:
            if not visited[neighbor]:
                heapq.heappush(heap, (next_weight, neighbor))
    return total if used == data["n"] else -1
`,
  },

  'floyd-warshall': {
    statement: '给定带权图的邻接矩阵，计算任意两点之间的最短距离。-1 表示没有直接边，对角线表示 0。',
    input: 'data 为方阵 matrix；边权可为负但不存在负环。',
    output: '返回全源最短路矩阵，不可达位置仍为 -1。',
    constraints: ['1 <= n <= 100'],
    examples: [example([[0, 3, -1], [-1, 0, 2], [1, -1, 0]], [[0, 3, 5], [3, 0, 2], [1, 4, 0]])],
    tests: [example([[0]], [[0]]), example([[0, -1], [-1, 0]], [[0, -1], [-1, 0]])],
    insights: ['dp[k][i][j] 只需比较“不经过 k”和“经过 k”；原地更新时 k 层之前的值已经足够支撑当前转移。'],
    pitfalls: ['-1 是无穷而不是负权，参与加法前必须转换；不要把不可达路径当成 0。'],
    solution: `def solve(data):
    matrix = data
    n = len(matrix)
    inf = 10**18
    distance = [[inf if value == -1 else value for value in row] for row in matrix]
    for node in range(n):
        distance[node][node] = 0
    for middle in range(n):
        for left in range(n):
            if distance[left][middle] == inf:
                continue
            for right in range(n):
                candidate = distance[left][middle] + distance[middle][right]
                if candidate < distance[left][right]:
                    distance[left][right] = candidate
    return [[-1 if value == inf else value for value in row] for row in distance]
`,
  },

  'coin-change': {
    statement: '给定无限使用的硬币面额，求凑出 amount 所需的最少硬币数。无法凑出时返回 -1。',
    input: 'data 为 {"coins": [positive int], "amount": nonnegative int}。',
    output: '返回最少硬币数或 -1。',
    constraints: ['0 <= amount <= 10^4'],
    examples: [example({ coins: [1, 2, 5], amount: 11 }, 3)],
    tests: [example({ coins: [2], amount: 3 }, -1), example({ coins: [1], amount: 0 }, 0), example({ coins: [2, 5, 10, 1, 3], amount: 27 }, 4)],
    insights: ['dp[amount] 表示凑出该金额的最少硬币数；最后一枚硬币为 coin 时，转移到 dp[amount-coin]+1。'],
    pitfalls: ['不可达状态不能初始化为 0；amount=0 的基本情况是 0。'],
    solution: `def solve(data):
    amount = data["amount"]
    inf = amount + 1
    dp = [0] + [inf] * amount
    for current in range(1, amount + 1):
        for coin in data["coins"]:
            if coin <= current:
                dp[current] = min(dp[current], dp[current - coin] + 1)
    return -1 if dp[amount] == inf else dp[amount]
`,
  },

  'knapsack-dp': {
    statement: '每件物品最多选择一次，在容量限制内最大化总价值。',
    input: 'data 为 {"weights": [...], "values": [...], "capacity": int}。',
    output: '返回最大总价值。',
    constraints: ['weights 与 values 等长，weight > 0', '0 <= capacity <= 10^4'],
    examples: [example({ weights: [2, 3, 4], values: [3, 4, 5], capacity: 5 }, 7)],
    tests: [example({ weights: [], values: [], capacity: 5 }, 0), example({ weights: [6], values: [10], capacity: 5 }, 0), example({ weights: [1, 2, 3], values: [6, 10, 12], capacity: 5 }, 22)],
    insights: ['一维 dp[c] 表示当前处理物品后容量不超过 c 的最大价值；容量必须倒序更新，避免同一件物品被重复使用。'],
    pitfalls: ['正序更新会把 0/1 背包错误变成完全背包；不要把 weight 与 capacity 的含义混淆。'],
    solution: `def solve(data):
    capacity = data["capacity"]
    dp = [0] * (capacity + 1)
    for weight, value in zip(data["weights"], data["values"]):
        for current in range(capacity, weight - 1, -1):
            dp[current] = max(dp[current], dp[current - weight] + value)
    return dp[capacity]
`,
  },

  'edit-distance': {
    statement: '只允许插入、删除或替换一个字符，求把字符串 a 变成字符串 b 的最少操作数。',
    input: 'data 为 {"a": string, "b": string}。',
    output: '返回编辑距离。',
    constraints: ['0 <= len(a), len(b) <= 500'],
    examples: [example({ a: 'horse', b: 'ros' }, 3)],
    tests: [example({ a: '', b: 'abc' }, 3), example({ a: 'same', b: 'same' }, 0), example({ a: 'intention', b: 'execution' }, 5)],
    insights: ['dp[i][j] 表示前 i 个字符与前 j 个字符的距离；末尾相同就继承，否则取插入、删除、替换三者最小值再加一。'],
    pitfalls: ['空前缀的距离等于另一个前缀长度；压缩成一维时要保存左上角旧值。'],
    solution: `def solve(data):
    a, b = data["a"], data["b"]
    previous = list(range(len(b) + 1))
    for i, left_char in enumerate(a, 1):
        current = [i]
        for j, right_char in enumerate(b, 1):
            if left_char == right_char:
                current.append(previous[j - 1])
            else:
                current.append(1 + min(previous[j], current[-1], previous[j - 1]))
        previous = current
    return previous[-1]
`,
  },

  'longest-increasing-subsequence': {
    statement: '返回整数数组的最长严格递增子序列长度，子序列不要求连续。',
    input: 'data 为整数数组。',
    output: '返回 LIS 长度。',
    constraints: ['0 <= n <= 10^5'],
    examples: [example([10, 9, 2, 5, 3, 7, 101, 18], 4)],
    tests: [example([], 0), example([2, 2, 2], 1), example([1, 2, 3, 4], 4), example([4, 3, 2, 1], 1)],
    insights: ['tails[length-1] 保存长度为 length 的递增子序列可以达到的最小结尾；用 lower_bound 替换第一个 >= value 的位置。'],
    pitfalls: ['严格递增要用 lower_bound；若使用 upper_bound 会错误允许重复值。'],
    solution: `def solve(data):
    tails = []
    for value in data:
        left, right = 0, len(tails)
        while left < right:
            middle = (left + right) // 2
            if tails[middle] < value:
                left = middle + 1
            else:
                right = middle
        if left == len(tails):
            tails.append(value)
        else:
            tails[left] = value
    return len(tails)
`,
  },

  'longest-common-subsequence': {
    statement: '返回两个字符串的最长公共子序列长度。',
    input: 'data 为 {"a": string, "b": string}。',
    output: '返回 LCS 长度。',
    constraints: ['0 <= len(a), len(b) <= 500'],
    examples: [example({ a: 'abcde', b: 'ace' }, 3)],
    tests: [example({ a: '', b: 'abc' }, 0), example({ a: 'abc', b: 'abc' }, 3), example({ a: 'abc', b: 'def' }, 0)],
    insights: ['两个末尾字符相等时一起纳入；否则答案来自删除 a 末尾或删除 b 末尾的较大者。'],
    pitfalls: ['子序列允许跳过字符但不能改变顺序；不要误用最长公共子串的连续约束。'],
    solution: `def solve(data):
    a, b = data["a"], data["b"]
    row = [0] * (len(b) + 1)
    for left_char in a:
        diagonal = 0
        for j, right_char in enumerate(b, 1):
            above = row[j]
            if left_char == right_char:
                row[j] = diagonal + 1
            else:
                row[j] = max(row[j], row[j - 1])
            diagonal = above
    return row[-1]
`,
  },

  'kadane': {
    statement: '返回整数数组中连续非空子数组的最大和。',
    input: 'data 为整数数组。',
    output: '返回最大子数组和。',
    constraints: ['1 <= n <= 10^5'],
    examples: [example([-2, 1, -3, 4, -1, 2, 1, -5, 4], 6)],
    tests: [example([-5], -5), example([1, 2, 3], 6), example([-1, -2, -3], -1)],
    insights: ['以当前位置结尾的最优和只有两种选择：延续前一段，或从当前值重新开始；全局答案取所有结尾状态的最大值。'],
    pitfalls: ['全负数组不能把 best 初始化为 0；连续子数组不能跳过中间元素。'],
    solution: `def solve(data):
    if not data:
        return 0
    ending = best = data[0]
    for value in data[1:]:
        ending = max(value, ending + value)
        best = max(best, ending)
    return best
`,
  },
};
