const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchC = {
  'bucket-sort': {
    statement: '给定一组实数，使用桶排序返回非递减结果。桶内排序也要通过局部插入过程完成。',
    input: 'data 为实数数组，可以包含负数和重复值。',
    output: '返回新的升序数组。',
    constraints: ['0 <= n <= 10^4'],
    examples: [example([0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51], [0.23, 0.25, 0.32, 0.42, 0.47, 0.51, 0.52])],
    tests: [example([], []), example([3.0], [3.0]), example([-1.5, 0, -1.5, 2.2], [-1.5, -1.5, 0, 2.2])],
    insights: ['先按值域把元素分散到若干桶，再让每个桶只负责自己的局部有序性；桶的顺序和桶内顺序共同决定全局顺序。'],
    pitfalls: ['最大值必须落入最后一个桶；值域跨度为 0 时不能除以 0。'],
    solution: `def solve(data):
    values = list(data)
    if len(values) < 2:
        return values
    low, high = min(values), max(values)
    bucket_count = max(1, int(len(values) ** 0.5))
    width = (high - low) / bucket_count if high != low else 1.0
    buckets = [[] for _ in range(bucket_count)]
    for value in values:
        index = min(bucket_count - 1, int((value - low) / width)) if high != low else 0
        buckets[index].append(value)
    result = []
    for bucket in buckets:
        for value in bucket:
            cursor = len(result)
            result.append(value)
            while cursor > 0 and result[cursor - 1] > value:
                result[cursor] = result[cursor - 1]
                cursor -= 1
            result[cursor] = value
    return result
`,
  },

  'fisher-yates-shuffle': {
    statement: '使用 Fisher-Yates 算法按给定种子生成数组的确定性随机排列。',
    input: 'data 为 {"nums": [...], "seed": 非负整数}。',
    output: '返回打乱后的新数组。',
    constraints: ['0 <= len(nums) <= 10^4'],
    examples: [example({ nums: [1, 2, 3, 4, 5], seed: 7 }, [1, 3, 5, 2, 4])],
    tests: [example({ nums: [], seed: 1 }, []), example({ nums: [1], seed: 9 }, [1]), example({ nums: [1, 2, 3], seed: 0 }, [3, 1, 2])],
    insights: ['从后往前处理位置 i，在 [0,i] 中等概率选择一个 j 并交换；每一轮都把一个最终位置封存。'],
    pitfalls: ['随机下标范围必须包含 i；只向前交换或使用固定 j 会造成排列偏差。'],
    solution: `def solve(data):
    values = list(data["nums"])
    state = int(data["seed"]) & 0xffffffff
    for index in range(len(values) - 1, 0, -1):
        state = (state * 1664525 + 1013904223) & 0xffffffff
        chosen = state % (index + 1)
        values[index], values[chosen] = values[chosen], values[index]
    return values
`,
  },

  'reservoir-sampling': {
    statement: '从未知长度的数据流中等概率保留 k 个元素，返回给定确定性随机源下的水塘内容。',
    input: 'data 为 {"stream": [...], "k": int, "seed": 非负整数}。',
    output: '返回长度 min(k, len(stream)) 的样本数组。',
    constraints: ['0 <= k <= len(stream) <= 10^4'],
    examples: [example({ stream: [10, 20, 30, 40, 50], k: 3, seed: 7 }, [10, 20, 50])],
    tests: [example({ stream: [1, 2], k: 0, seed: 1 }, []), example({ stream: [1, 2], k: 5, seed: 1 }, [1, 2]), example({ stream: [1, 2, 3, 4], k: 2, seed: 0 }, [1, 3])],
    insights: ['第 i 个元素到来时，以 k/(i+1) 的概率进入水塘，并随机替换已有位置；这样每个已见元素保持相同入选概率。'],
    pitfalls: ['i 从 k 开始而不是从 0 开始；替换位置必须覆盖整个水塘 [0,k)。'],
    solution: `def solve(data):
    stream, k = data["stream"], int(data["k"])
    reservoir = list(stream[:k])
    state = int(data["seed"]) & 0xffffffff
    for index in range(k, len(stream)):
        state = (state * 1664525 + 1013904223) & 0xffffffff
        chosen = state % (index + 1)
        if chosen < k:
            reservoir[chosen] = stream[index]
    return reservoir
`,
  },

  'floyd-cycle-detection': {
    statement: '给定每个下标指向下一个下标的函数图，从 start 出发判断是否有环，并返回环入口下标。-1 表示终止。',
    input: 'data 为 {"next": [下标或 -1], "start": int}。',
    output: '有环返回入口下标，否则返回 -1。',
    constraints: ['next[i] 为 -1 或合法下标'],
    examples: [example({ next: [1, 2, 3, 1], start: 0 }, 1)],
    tests: [example({ next: [-1], start: 0 }, -1), example({ next: [0], start: 0 }, 0), example({ next: [1, 2, -1], start: 0 }, -1)],
    insights: ['快指针每次走两步、慢指针每次走一步；相遇只说明存在环，再让一个指针回到起点，同速前进即可找到入口。'],
    pitfalls: ['推进快指针前要检查两次跳跃都没有到 -1；相遇点不是环入口。'],
    solution: `def solve(data):
    links, start = data["next"], data["start"]
    slow = fast = start
    while fast != -1 and links[fast] != -1:
        slow = links[slow]
        fast = links[links[fast]]
        if slow == fast:
            cursor = start
            while cursor != slow:
                cursor = links[cursor]
                slow = links[slow]
            return cursor
    return -1
`,
  },

  'bidirectional-bfs': {
    statement: '在无向无权图中，使用双向 BFS 返回 start 到 target 的最短边数。',
    input: 'data 为 {"n": int, "edges": [[u,v], ...], "start": int, "target": int}。',
    output: '返回最短边数；不可达时返回 -1。',
    constraints: ['0 <= u,v < n', '边为无向边'],
    examples: [example({ n: 6, edges: [[0, 1], [1, 2], [2, 5], [0, 3], [3, 4], [4, 5]], start: 0, target: 5 }, 3)],
    tests: [example({ n: 1, edges: [], start: 0, target: 0 }, 0), example({ n: 3, edges: [[0, 1]], start: 0, target: 2 }, -1)],
    insights: ['从起点和终点同时扩散，第一次相遇时两侧的层数之和就是候选距离；每次扩展较小的一侧可减少边界。'],
    pitfalls: ['visited 集合必须区分两侧；相遇节点的距离应使用两侧距离相加。'],
    solution: `def solve(data):
    n = data["n"]
    if data["start"] == data["target"]:
        return 0
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right); graph[right].append(left)
    front, back = {data["start"]}, {data["target"]}
    distance_front = {data["start"]: 0}
    distance_back = {data["target"]: 0}
    while front and back:
        if len(front) > len(back):
            front, back = back, front
            distance_front, distance_back = distance_back, distance_front
        next_front = set()
        for node in front:
            for neighbor in graph[node]:
                if neighbor in distance_front:
                    continue
                if neighbor in distance_back:
                    return distance_front[node] + 1 + distance_back[neighbor]
                distance_front[neighbor] = distance_front[node] + 1
                next_front.add(neighbor)
        front = next_front
    return -1
`,
  },

  'eulerian-path': {
    statement: '给定有向图，寻找一条恰好使用每条边一次的欧拉路径；不存在时返回空数组。',
    input: 'data 为 {"n": int, "edges": [[u,v], ...]}。',
    output: '返回顶点序列；若存在 m 条边，结果长度为 m+1。',
    constraints: ['允许平行边；顶点编号为 0..n-1'],
    examples: [example({ n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, [0, 1, 2, 0])],
    tests: [example({ n: 1, edges: [] }, [0]), example({ n: 3, edges: [[0, 1], [0, 2], [1, 0]] }, [0, 1, 0, 2]), example({ n: 3, edges: [[0, 1], [2, 1]] }, [])],
    insights: ['Hierholzer 算法沿未使用边深入，走到无边时回退并把顶点加入答案；回退顺序反转后得到欧拉路径。'],
    pitfalls: ['必须检查入度和出度条件，并确认结果确实使用了全部边；只找到一条局部游走不够。'],
    solution: `def solve(data):
    n, edges = data["n"], data["edges"]
    out_degree = [0] * n
    in_degree = [0] * n
    graph = [[] for _ in range(n)]
    for left, right in edges:
        graph[left].append(right)
        out_degree[left] += 1; in_degree[right] += 1
    starts = [node for node in range(n) if out_degree[node] == in_degree[node] + 1]
    ends = [node for node in range(n) if in_degree[node] == out_degree[node] + 1]
    if starts and (len(starts) != 1 or len(ends) != 1):
        return []
    if not starts and any(in_degree[node] != out_degree[node] for node in range(n)):
        return []
    if starts:
        start = starts[0]
    else:
        start = next((node for node in range(n) if out_degree[node]), 0)
    for adjacency in graph:
        adjacency.sort(reverse=True)
    stack, path = [start], []
    while stack:
        node = stack[-1]
        if graph[node]:
            stack.append(graph[node].pop())
        else:
            path.append(stack.pop())
    path.reverse()
    return path if len(path) == len(edges) + 1 else []
`,
  },

  'bipartite-matching': {
    statement: '给定二分图左部和右部的边，返回最大匹配的边数。',
    input: 'data 为 {"left": 左部节点数, "right": 右部节点数, "edges": [[u,v], ...]}。',
    output: '返回最大匹配基数。',
    constraints: ['0 <= u < left, 0 <= v < right'],
    examples: [example({ left: 3, right: 3, edges: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 0] ] }, 3)],
    tests: [example({ left: 0, right: 3, edges: [] }, 0), example({ left: 2, right: 2, edges: [[0, 0], [0, 1]] }, 1), example({ left: 2, right: 2, edges: [[0, 0], [1, 1]] }, 2)],
    insights: ['尝试为每个左节点寻找增广路；若当前右节点已有匹配，就递归把原匹配者改道。每找到一条增广路，匹配数增加一。'],
    pitfalls: ['一次 DFS 中要记录本轮已访问的右节点，避免在同一条增广路上循环。'],
    solution: `def solve(data):
    graph = [[] for _ in range(data["left"])]
    for left, right in data["edges"]:
        graph[left].append(right)
    matched = [-1] * data["right"]

    def augment(left, visited):
        for right in graph[left]:
            if visited[right]:
                continue
            visited[right] = True
            if matched[right] == -1 or augment(matched[right], visited):
                matched[right] = left
                return True
        return False

    return sum(augment(left, [False] * data["right"]) for left in range(data["left"]))
`,
  },

  'bridges-articulation': {
    statement: '在无向图中找出所有桥和割点。桥删除后会增加连通分量，割点删除后会增加连通分量。',
    input: 'data 为 {"n": int, "edges": [[u,v], ...]}。',
    output: '返回 {"bridges": [[u,v], ...], "articulation": [节点...]}; 桥端点按小到大排列。',
    constraints: ['图可以不连通，允许无向边'],
    examples: [example({ n: 5, edges: [[0, 1], [1, 2], [1, 3], [3, 4]] }, { bridges: [[0, 1], [1, 2], [1, 3], [3, 4]], articulation: [1, 3] })],
    tests: [example({ n: 1, edges: [] }, { bridges: [], articulation: [] }), example({ n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, { bridges: [], articulation: [] })],
    insights: ['dfn 记录首次访问时间，low 记录子树能回到的最早祖先；若 low[child] > dfn[parent]，父子边就是桥。'],
    pitfalls: ['无向边的反向边不能当作回边处理；根节点成为割点的条件是 DFS 子树数大于 1。'],
    solution: `def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    for edge_id, (left, right) in enumerate(data["edges"]):
        graph[left].append((right, edge_id)); graph[right].append((left, edge_id))
    order = [-1] * n
    low = [0] * n
    articulation = set()
    bridges = []
    timer = 0

    def visit(node, parent_edge):
        nonlocal timer
        order[node] = low[node] = timer; timer += 1
        children = 0
        for neighbor, edge_id in graph[node]:
            if edge_id == parent_edge:
                continue
            if order[neighbor] == -1:
                children += 1
                visit(neighbor, edge_id)
                low[node] = min(low[node], low[neighbor])
                if parent_edge != -1 and low[neighbor] >= order[node]:
                    articulation.add(node)
                if low[neighbor] > order[node]:
                    bridges.append(sorted([node, neighbor]))
            else:
                low[node] = min(low[node], order[neighbor])
        if parent_edge == -1 and children > 1:
            articulation.add(node)

    for node in range(n):
        if order[node] == -1:
            visit(node, -1)
    return {"bridges": sorted(bridges), "articulation": sorted(articulation)}
`,
  },

  'lowest-common-ancestor': {
    statement: '给定一棵无向树和根节点，返回节点 p、q 的最近公共祖先。',
    input: 'data 为 {"n": int, "edges": [[u,v], ...], "root": int, "p": int, "q": int}。',
    output: '返回最近公共祖先节点；节点不在同一棵树时返回 -1。',
    constraints: ['edges 构成树或森林'],
    examples: [example({ n: 7, edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], root: 0, p: 3, q: 4 }, 1)],
    tests: [example({ n: 1, edges: [], root: 0, p: 0, q: 0 }, 0), example({ n: 3, edges: [[0, 1], [1, 2]], root: 0, p: 0, q: 2 }, 0)],
    insights: ['先从 root 建立 parent 和 depth，再把较深节点提升到同一深度，最后同步向上直到两个节点相等。'],
    pitfalls: ['p 或 q 不可达时不能默认返回 root；提升深度时要保留 parent 的 -1 边界。'],
    solution: `from collections import deque

def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right); graph[right].append(left)
    parent = [-1] * n
    depth = [-1] * n
    root = data["root"]
    depth[root] = 0
    queue = deque([root])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if depth[neighbor] != -1:
                continue
            parent[neighbor] = node; depth[neighbor] = depth[node] + 1
            queue.append(neighbor)
    p, q = data["p"], data["q"]
    if depth[p] == -1 or depth[q] == -1:
        return -1
    while depth[p] > depth[q]:
        p = parent[p]
    while depth[q] > depth[p]:
        q = parent[q]
    while p != q:
        p, q = parent[p], parent[q]
    return p
`,
  },

  'astar-pathfinding': {
    statement: '在 0/1 网格中从 start 走到 target，使用 Manhattan 启发式返回最短步数；1 表示障碍物。',
    input: 'data 为 {"grid": [[0,1,...]], "start": [r,c], "target": [r,c]}。',
    output: '返回最短步数；不可达时返回 -1。',
    constraints: ['只能上下左右移动，0 <= r,c < 网格边界'],
    examples: [example({ grid: [[0, 0, 0], [1, 1, 0], [0, 0, 0]], start: [0, 0], target: [2, 2] }, 4)],
    tests: [example({ grid: [[0]], start: [0, 0], target: [0, 0] }, 0), example({ grid: [[0, 1], [1, 0]], start: [0, 0], target: [1, 1] }, -1)],
    insights: ['f = g + h，g 是已走步数，h 是到目标的 Manhattan 下界；在四方向等代价网格中 h 不高估，因此优先扩展最有希望的状态。'],
    pitfalls: ['障碍物不能入队；旧堆项出队时要和 best_g 比较，不能重复扩展过期状态。'],
    solution: `import heapq

def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    start, target = tuple(data["start"]), tuple(data["target"])
    if grid[start[0]][start[1]] or grid[target[0]][target[1]]:
        return -1
    def heuristic(node):
        return abs(node[0] - target[0]) + abs(node[1] - target[1])
    best = {start: 0}
    heap = [(heuristic(start), 0, start)]
    while heap:
        _, cost, node = heapq.heappop(heap)
        if cost != best[node]:
            continue
        if node == target:
            return cost
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            neighbor = (node[0] + dr, node[1] + dc)
            if not (0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols):
                continue
            if grid[neighbor[0]][neighbor[1]]:
                continue
            candidate = cost + 1
            if candidate < best.get(neighbor, 10**9):
                best[neighbor] = candidate
                heapq.heappush(heap, (candidate + heuristic(neighbor), candidate, neighbor))
    return -1
`,
  },

  'boruvka-mst': {
    statement: '给定无向带权图，使用 Borůvka 算法返回最小生成树总权重；图不连通时返回 -1。',
    input: 'data 为 {"n": int, "edges": [[u,v,w], ...]}。',
    output: '返回最小生成树总权重或 -1。',
    constraints: ['允许平行边，边权可为负数'],
    examples: [example({ n: 4, edges: [[0, 1, 1], [0, 2, 4], [1, 2, 2], [1, 3, 5], [2, 3, 1]] }, 4)],
    tests: [example({ n: 1, edges: [] }, 0), example({ n: 3, edges: [[0, 1, 1]] }, -1)],
    insights: ['每轮为每个连通分量选择最便宜的外连边；这些边可以同时安全加入，连通分量数量至少减半。'],
    pitfalls: ['同一轮多个分量可能选择同一条边，合并前必须再次检查根是否相同。'],
    solution: `def solve(data):
    n = data["n"]
    parent = list(range(n))
    size = [1] * n
    def find(node):
        while parent[node] != node:
            parent[node] = parent[parent[node]]; node = parent[node]
        return node
    total, components = 0, n
    while components > 1:
        cheapest = [None] * n
        for left, right, weight in data["edges"]:
            root_left, root_right = find(left), find(right)
            if root_left == root_right:
                continue
            if cheapest[root_left] is None or weight < cheapest[root_left][2]:
                cheapest[root_left] = (left, right, weight)
            if cheapest[root_right] is None or weight < cheapest[root_right][2]:
                cheapest[root_right] = (left, right, weight)
        merged = False
        for edge in cheapest:
            if edge is None:
                continue
            left, right, weight = edge
            root_left, root_right = find(left), find(right)
            if root_left == root_right:
                continue
            if size[root_left] < size[root_right]:
                root_left, root_right = root_right, root_left
            parent[root_right] = root_left; size[root_left] += size[root_right]
            total += weight; components -= 1; merged = True
        if not merged:
            return -1
    return total
`,
  },

  'tarjan-scc': {
    statement: '给定有向图，使用 Tarjan 算法返回所有强连通分量。',
    input: 'data 为 {"n": int, "edges": [[u,v], ...]}。',
    output: '返回排序后的组件数组，每个组件内部升序。',
    constraints: ['允许自环和平行边'],
    examples: [example({ n: 5, edges: [[0, 1], [1, 0], [1, 2], [2, 3], [3, 2], [3, 4]] }, [[0, 1], [2, 3], [4]])],
    tests: [example({ n: 1, edges: [] }, [[0]]), example({ n: 3, edges: [[0, 1], [1, 2]] }, [[0], [1], [2]])],
    insights: ['dfn 与 lowlink 描述节点能回到的最早栈节点；当 low[node] == dfn[node] 时，node 就是一个 SCC 的栈根。'],
    pitfalls: ['只对“仍在栈中”的邻居更新 low；已经弹出的组件不能再参与回边计算。'],
    solution: `def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right)
    dfn = [-1] * n; low = [0] * n; stack = []; on_stack = [False] * n
    timer = 0; components = []
    def visit(node):
        nonlocal timer
        dfn[node] = low[node] = timer; timer += 1
        stack.append(node); on_stack[node] = True
        for neighbor in graph[node]:
            if dfn[neighbor] == -1:
                visit(neighbor); low[node] = min(low[node], low[neighbor])
            elif on_stack[neighbor]:
                low[node] = min(low[node], dfn[neighbor])
        if low[node] == dfn[node]:
            component = []
            while True:
                current = stack.pop(); on_stack[current] = False; component.append(current)
                if current == node:
                    break
            components.append(sorted(component))
    for node in range(n):
        if dfn[node] == -1:
            visit(node)
    return sorted(components)
`,
  },

  'two-sat': {
    statement: '给定若干形如 (a 或 b) 的二元子句，判断是否存在满足所有子句的布尔赋值。正数 x 表示变量 x，负数 -x 表示其否定。',
    input: 'data 为 {"variables": int, "clauses": [[literal,literal], ...]}。',
    output: '可满足返回 true，否则返回 false。',
    constraints: ['变量编号从 1 开始'],
    examples: [example({ variables: 2, clauses: [[1, 2], [-1, 2], [1, -2]] }, true)],
    tests: [example({ variables: 1, clauses: [[1, 1], [-1, -1]] }, false), example({ variables: 2, clauses: [] }, true), example({ variables: 2, clauses: [[1, -2], [-1, 2]] }, true)],
    insights: ['把 (a∨b) 转成 ¬a→b 与 ¬b→a；若某变量和它的否定落在同一个 SCC，二者互相推出，问题不可满足。'],
    pitfalls: ['literal 到节点的映射和取反必须一致；空子句应立即判定为不可满足。'],
    solution: `def solve(data):
    variables = data["variables"]
    graph = [[] for _ in range(variables * 2)]
    def node(literal):
        variable = abs(literal) - 1
        return 2 * variable + (0 if literal > 0 else 1)
    for first, second in data["clauses"]:
        if first == 0 or second == 0:
            return False
        left, right = node(first), node(second)
        graph[left ^ 1].append(right); graph[right ^ 1].append(left)
    index = 0; stack = []; on_stack = [False] * len(graph)
    dfn = [-1] * len(graph); low = [0] * len(graph); component = [-1] * len(graph)
    def visit(current):
        nonlocal index
        dfn[current] = low[current] = index; index += 1
        stack.append(current); on_stack[current] = True
        for neighbor in graph[current]:
            if dfn[neighbor] == -1:
                visit(neighbor); low[current] = min(low[current], low[neighbor])
            elif on_stack[neighbor]:
                low[current] = min(low[current], dfn[neighbor])
        if low[current] == dfn[current]:
            while True:
                popped = stack.pop(); on_stack[popped] = False; component[popped] = current
                if popped == current:
                    break
    for current in range(len(graph)):
        if dfn[current] == -1:
            visit(current)
    return all(component[2 * variable] != component[2 * variable + 1] for variable in range(variables))
`,
  },

  'graph-coloring': {
    statement: '判断无向图能否用不超过 k 种颜色着色，使相邻节点颜色不同。',
    input: 'data 为 {"n": int, "edges": [[u,v], ...], "k": int}。',
    output: '存在合法着色返回 true，否则返回 false。',
    constraints: ['0 <= n <= 12', '边为无向边'],
    examples: [example({ n: 4, edges: [[0, 1], [1, 2], [2, 3], [3, 0]], k: 2 }, true)],
    tests: [example({ n: 1, edges: [], k: 1 }, true), example({ n: 3, edges: [[0, 1], [1, 2], [0, 2]], k: 2 }, false), example({ n: 0, edges: [], k: 0 }, true)],
    insights: ['回溯按节点分配颜色，只给当前节点尝试与已着色邻居不冲突的颜色；选择顺序优先处理度数大的节点可更早剪枝。'],
    pitfalls: ['自环在 k>0 时也不可着色；撤销颜色后必须恢复状态。'],
    solution: `def solve(data):
    n, k = data["n"], data["k"]
    if n == 0:
        return True
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        if left == right:
            return False
        graph[left].append(right); graph[right].append(left)
    colors = [-1] * n
    order = sorted(range(n), key=lambda node: len(graph[node]), reverse=True)
    def search(position):
        if position == n:
            return True
        node = order[position]
        forbidden = {colors[neighbor] for neighbor in graph[node] if colors[neighbor] != -1}
        for color in range(k):
            if color in forbidden:
                continue
            colors[node] = color
            if search(position + 1):
                return True
        colors[node] = -1
        return False
    return search(0)
`,
  },

  'subset-sum': {
    statement: '判断数组中是否存在一个子集，其元素和恰好等于 target；每个元素最多使用一次。',
    input: 'data 为 {"nums": [整数], "target": int}。',
    output: '存在返回 true，否则返回 false。',
    constraints: ['0 <= len(nums) <= 200', '元素可以为负数'],
    examples: [example({ nums: [3, 34, 4, 12, 5, 2], target: 9 }, true)],
    tests: [example({ nums: [], target: 0 }, true), example({ nums: [1, 2, 4], target: 6 }, true), example({ nums: [1, 2, 4], target: 5 }, true), example({ nums: [2, 4], target: 3 }, false)],
    insights: ['处理每个数时，把“之前能达到的和”整体平移并与原集合合并；集合本身就是可达状态的压缩表示。'],
    pitfalls: ['元素只能使用一次，必须从旧集合生成新集合；直接原地扩展会重复使用当前元素。'],
    solution: `def solve(data):
    reachable = {0}
    for value in data["nums"]:
        reachable |= {current + value for current in reachable}
        if data["target"] in reachable:
            return True
    return data["target"] in reachable
`,
  },

  'matrix-chain-multiplication': {
    statement: '给定矩阵链的维度 p0,p1,...,pn，求完全加括号所需的最少标量乘法次数。',
    input: 'data 为维度数组，例如 [10,30,5,60] 表示 10×30、30×5、5×60。',
    output: '返回最少乘法次数。',
    constraints: ['2 <= len(data) <= 100'],
    examples: [example([10, 30, 5, 60], 4500)],
    tests: [example([5, 10], 0), example([10, 20, 30], 6000), example([40, 20, 30, 10, 30], 26000)],
    insights: ['dp[left][right] 表示矩阵 left 到 right 的最优代价，最后一次乘法选择分割点 middle，枚举所有可能的最后一步。'],
    pitfalls: ['维度数组长度比矩阵数量多一；代价是 p[left] * p[middle+1] * p[right+1]。'],
    solution: `def solve(data):
    dimensions = data
    count = len(dimensions) - 1
    if count <= 1:
        return 0
    dp = [[0] * count for _ in range(count)]
    for length in range(2, count + 1):
        for left in range(count - length + 1):
            right = left + length - 1
            best = 10**30
            for middle in range(left, right):
                cost = dp[left][middle] + dp[middle + 1][right]
                cost += dimensions[left] * dimensions[middle + 1] * dimensions[right + 1]
                best = min(best, cost)
            dp[left][right] = best
    return dp[0][count - 1]
`,
  },

  'tree-dp': {
    statement: '给定带权树，选择若干节点使任意相邻节点不能同时选择，返回最大权重和。',
    input: 'data 为 {"n": int, "edges": [[u,v], ...], "weights": [int]}。',
    output: '返回最大独立集权重。',
    constraints: ['edges 构成树或森林，权重可以为负数'],
    examples: [example({ n: 5, edges: [[0, 1], [0, 2], [1, 3], [1, 4]], weights: [3, 2, 1, 4, 5] }, 12)],
    tests: [example({ n: 0, edges: [], weights: [] }, 0), example({ n: 1, edges: [], weights: [7] }, 7), example({ n: 3, edges: [[0, 1], [1, 2]], weights: [-2, 5, 4] }, 5)],
    insights: ['对每棵子树维护“选当前节点”和“不选当前节点”两个状态；选了当前节点就不能选孩子，否则孩子可取两者最大值。'],
    pitfalls: ['森林需要从每个未访问节点启动 DFS；负权节点不应被强制选择。'],
    solution: `def solve(data):
    n = data["n"]
    if n == 0:
        return 0
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right); graph[right].append(left)
    visited = [False] * n
    def visit(node):
        visited[node] = True
        take = data["weights"][node]
        skip = 0
        for neighbor in graph[node]:
            if visited[neighbor]:
                continue
            child_take, child_skip = visit(neighbor)
            take += child_skip
            skip += max(child_take, child_skip)
        return take, skip
    answer = 0
    for node in range(n):
        if not visited[node]:
            take, skip = visit(node)
            answer += max(0, take, skip)
    return answer
`,
  },

  'min-cost-max-flow': {
    statement: '给定带容量和单位费用的有向网络，求从 source 到 sink 的最大流及其最小总费用。',
    input: 'data 为 {"n": int, "edges": [[u,v,capacity,cost], ...], "source": int, "sink": int}。',
    output: '返回 [最大流, 对应最小费用]。',
    constraints: ['容量为非负整数；不存在负费用环影响最优解'],
    examples: [example({ n: 4, edges: [[0, 1, 2, 1], [0, 2, 1, 2], [1, 2, 1, 0], [1, 3, 1, 3], [2, 3, 2, 1]], source: 0, sink: 3 }, [3, 9])],
    tests: [example({ n: 1, edges: [], source: 0, sink: 0 }, [0, 0]), example({ n: 3, edges: [[0, 1, 1, 5]], source: 0, sink: 2 }, [0, 0])],
    insights: ['每次在残量网络中找当前最便宜的 s-t 路并沿瓶颈增广；反向边让后续路径可以撤销早期的局部选择。'],
    pitfalls: ['反向边费用必须取相反数；路径不存在时停止，不能把不可达距离当成 0。'],
    solution: `from collections import deque

def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    def add_edge(left, right, capacity, cost):
        graph[left].append([right, capacity, cost, len(graph[right])])
        graph[right].append([left, 0, -cost, len(graph[left]) - 1])
    for left, right, capacity, cost in data["edges"]:
        add_edge(left, right, capacity, cost)
    source, sink = data["source"], data["sink"]
    flow = total_cost = 0
    while True:
        distance = [10**18] * n
        previous = [None] * n
        distance[source] = 0
        queue = deque([source]); in_queue = [False] * n; in_queue[source] = True
        while queue:
            node = queue.popleft(); in_queue[node] = False
            for index, (neighbor, capacity, cost, _) in enumerate(graph[node]):
                if capacity <= 0 or distance[neighbor] <= distance[node] + cost:
                    continue
                distance[neighbor] = distance[node] + cost
                previous[neighbor] = (node, index)
                if not in_queue[neighbor]:
                    queue.append(neighbor); in_queue[neighbor] = True
        if previous[sink] is None:
            break
        amount = 10**18; node = sink
        while node != source:
            parent, index = previous[node]
            amount = min(amount, graph[parent][index][1]); node = parent
        node = sink
        while node != source:
            parent, index = previous[node]
            edge = graph[parent][index]
            reverse = edge[3]
            edge[1] -= amount
            graph[node][reverse][1] += amount
            total_cost += amount * edge[2]
            node = parent
        flow += amount
    return [flow, total_cost]
`,
  },

  'hungarian-algorithm': {
    statement: '给定 n×n 成本矩阵，为每个工人分配一个不同任务，返回最小总成本。',
    input: 'data 为方阵 cost，其中 cost[i][j] 是工人 i 执行任务 j 的成本。',
    output: '返回最小分配成本。',
    constraints: ['0 <= n <= 50'],
    examples: [example([[4, 1, 3], [2, 0, 5], [3, 2, 2]], 5)],
    tests: [example([], 0), example([[7]], 7), example([[1, 2], [2, 1]], 2)],
    insights: ['维护行、列势函数与当前匹配；每次把一个新行接入等价的最短增广路，势函数保证 reduced cost 非负。'],
    pitfalls: ['算法模板使用 1-based 下标；增广完成后要沿 way 链更新整条匹配，而不是只替换最后一列。'],
    solution: `def solve(data):
    cost = data
    n = len(cost)
    if n == 0:
        return 0
    u = [0] * (n + 1)
    v = [0] * (n + 1)
    match = [0] * (n + 1)
    for row in range(1, n + 1):
        match[0] = row
        column = 0
        minimum = [10**18] * (n + 1)
        used = [False] * (n + 1)
        way = [0] * (n + 1)
        while True:
            used[column] = True
            current_row = match[column]
            delta, next_column = 10**18, 0
            for candidate in range(1, n + 1):
                if used[candidate]:
                    continue
                reduced = cost[current_row - 1][candidate - 1] - u[current_row] - v[candidate]
                if reduced < minimum[candidate]:
                    minimum[candidate] = reduced; way[candidate] = column
                if minimum[candidate] < delta:
                    delta, next_column = minimum[candidate], candidate
            for candidate in range(n + 1):
                if used[candidate]:
                    u[match[candidate]] += delta
                    v[candidate] -= delta
                else:
                    minimum[candidate] -= delta
            column = next_column
            if match[column] == 0:
                break
        while True:
            previous = way[column]
            match[column] = match[previous]
            column = previous
            if column == 0:
                break
    assignment = [0] * n
    for column in range(1, n + 1):
        assignment[match[column] - 1] = column - 1
    return sum(cost[row][assignment[row]] for row in range(n))
`,
  },
};
