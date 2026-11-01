const example = (input, output, explanation = '') => ({ input, output, explanation });

export const problemBatchFGraph = {
  dinic: {
    statement: '用 Dinic 算法求网络最大流：BFS 分层、DFS 沿层图多路增广（当前弧优化），重复直到汇点不可达。返回最大流值。允许重边（容量累加）。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v, cap], ...], "source": 起点, "sink": 终点}，节点编号 0..n-1。',
    output: '返回最大流值（整数）。',
    constraints: ['2 <= n <= 50', '1 <= edges.length <= 500', '0 <= cap <= 10^4', 'source ≠ sink'],
    examples: [
      example({ n: 4, edges: [[0, 1, 3], [0, 2, 2], [1, 2, 1], [1, 3, 2], [2, 3, 3]], source: 0, sink: 3 }, 5),
    ],
    tests: [
      example({ n: 2, edges: [[0, 1, 7]], source: 0, sink: 1 }, 7),
      example({ n: 3, edges: [[0, 1, 1], [1, 2, 1]], source: 0, sink: 2 }, 1),
      example({ n: 4, edges: [[0, 1, 10], [1, 2, 0], [2, 3, 10]], source: 0, sink: 3 }, 0),
      example({ n: 6, edges: [[0, 1, 16], [0, 2, 13], [1, 3, 12], [2, 1, 4], [3, 2, 9], [2, 4, 14], [4, 3, 7], [3, 5, 20], [4, 5, 4]], source: 0, sink: 5 }, 23),
    ],
    insights: ['分层图是 Dinic 的骨架：一次 BFS 定层，一次 DFS 在层图上找尽所有增广路，每阶段最短路长度至少加一，阶段数 O(V)。', '当前弧优化保证每个节点在单阶段内被摊还扫完，单阶段复杂度 O(VE)。'],
    pitfalls: ['反向边的容量要随增广同步增加，漏掉会堵死后续增广。', 'DFS 回溯后不推进当前弧会退化成指数级重复尝试。'],
    solution: `def solve(data):
    n = int(data["n"])
    graph = [[] for _ in range(n)]

    def add_edge(u, v, cap):
        graph[u].append([v, cap, len(graph[v])])
        graph[v].append([u, 0, len(graph[u]) - 1])

    for u, v, c in data["edges"]:
        add_edge(int(u), int(v), int(c))
    source = int(data["source"])
    sink = int(data["sink"])
    flow = 0
    while True:
        level = [-1] * n
        level[source] = 0
        queue = [source]
        while queue:
            nxt = []
            for u in queue:
                for edge in graph[u]:
                    v, cap, _ = edge
                    if cap > 0 and level[v] == -1:
                        level[v] = level[u] + 1
                        nxt.append(v)
            queue = nxt
        if level[sink] == -1:
            break
        cursor = [0] * n

        def dfs(u, limit):
            if u == sink:
                return limit
            while cursor[u] < len(graph[u]):
                edge = graph[u][cursor[u]]
                v, cap, rev = edge
                if cap > 0 and level[v] == level[u] + 1:
                    pushed = dfs(v, min(limit, cap))
                    if pushed > 0:
                        edge[1] -= pushed
                        graph[v][rev][1] += pushed
                        return pushed
                cursor[u] += 1
            return 0

        while True:
            pushed = dfs(source, float("inf"))
            if pushed == 0:
                break
            flow += pushed
    return flow
`,
  },

  'edmonds-karp': {
    statement: '用 Edmonds–Karp 算法求网络最大流：每次 BFS 找一条边数最少的增广路，沿路推流，直到无增广路。返回最大流值。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v, cap], ...], "source": 起点, "sink": 终点}。',
    output: '返回最大流值（整数）。',
    constraints: ['2 <= n <= 30', '1 <= edges.length <= 200', '0 <= cap <= 10^4'],
    examples: [
      example({ n: 4, edges: [[0, 1, 3], [0, 2, 2], [1, 2, 1], [1, 3, 2], [2, 3, 3]], source: 0, sink: 3 }, 5),
    ],
    tests: [
      example({ n: 5, edges: [[0, 1, 10], [0, 2, 10], [1, 3, 4], [1, 4, 8], [2, 4, 9], [3, 4, 10]], source: 0, sink: 4 }, 19),
      example({ n: 2, edges: [[0, 1, 1], [0, 1, 1]], source: 0, sink: 1 }, 2),
      example({ n: 3, edges: [[0, 1, 5]], source: 0, sink: 2 }, 0),
    ],
    insights: ['只选「边数最短」的增广路是 Edmonds–Karp 的全部精髓——这一条让每条边作为关键边至多 O(V) 次，总复杂度 O(VE²)。', '残量网络用容量矩阵的反向容量表达增广的撤销，路径瓶颈就是最小值。'],
    pitfalls: ['重边容量要累加到矩阵再跑，逐条边独立增广会丢流。', '反向容量增加后 BFS 必须把它视为可行边，否则流无法回流。'],
    solution: `def solve(data):
    n = int(data["n"])
    capacity = [[0] * n for _ in range(n)]
    for u, v, c in data["edges"]:
        capacity[int(u)][int(v)] += int(c)
    source = int(data["source"])
    sink = int(data["sink"])
    flow = 0
    while True:
        parent = [-1] * n
        parent[source] = source
        queue = [source]
        while queue and parent[sink] == -1:
            nxt = []
            for u in queue:
                for v in range(n):
                    if parent[v] == -1 and capacity[u][v] > 0:
                        parent[v] = u
                        nxt.append(v)
            queue = nxt
        if parent[sink] == -1:
            break
        bottleneck = float("inf")
        v = sink
        while v != source:
            u = parent[v]
            bottleneck = min(bottleneck, capacity[u][v])
            v = u
        v = sink
        while v != source:
            u = parent[v]
            capacity[u][v] -= bottleneck
            capacity[v][u] += bottleneck
            v = u
        flow += bottleneck
    return flow
`,
  },

  'push-relabel': {
    statement: '用预流推进（Push–Relabel，FIFO 队列版）求最大流：源点先向邻居满灌形成预流，活跃节点（有盈余）要么沿高度差 1 的边推进，要么抬升高度（重标），直到无活跃节点。返回最大流值。',
    input: 'data 为 {"n": 节点数, "edges": [[u, v, cap], ...], "source": 起点, "sink": 终点}。',
    output: '返回最大流值（整数）。',
    constraints: ['2 <= n <= 30', '1 <= edges.length <= 200', '0 <= cap <= 10^4'],
    examples: [
      example({ n: 4, edges: [[0, 1, 3], [0, 2, 2], [1, 2, 1], [1, 3, 2], [2, 3, 3]], source: 0, sink: 3 }, 5),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1, 10], [1, 3, 4], [0, 2, 10], [2, 3, 4]], source: 0, sink: 3 }, 8),
      example({ n: 2, edges: [[0, 1, 4]], source: 0, sink: 1 }, 4),
      example({ n: 5, edges: [[0, 1, 5], [0, 2, 5], [1, 3, 5], [2, 3, 5], [3, 4, 5]], source: 0, sink: 4 }, 5),
    ],
    insights: ['高度函数是推进的通行证：只允许从高 h 流向 h-1，重标把被卡住的活跃点抬到「能流的最低高度 + 1」，循环必然终止。', '预流允许中间节点暂时超载——盈余最终要么流向汇点、要么经重标退回源点，两者都不会凭空消失。'],
    pitfalls: ['初始化时源点的出边要满灌并把反向容量补满，漏掉反向容量会算少流。', '活跃节点入队要去重，重复处理同一节点不影响正确性但可能拖慢甚至放大实现复杂度。'],
    solution: `def solve(data):
    n = int(data["n"])
    capacity = [[0] * n for _ in range(n)]
    for u, v, c in data["edges"]:
        capacity[int(u)][int(v)] += int(c)
    source = int(data["source"])
    sink = int(data["sink"])
    height = [0] * n
    excess = [0] * n
    height[source] = n
    for v in range(n):
        if capacity[source][v] > 0:
            excess[v] = capacity[source][v]
            excess[source] -= capacity[source][v]
            capacity[v][source] += capacity[source][v]
            capacity[source][v] = 0
    queue = [v for v in range(n) if v not in (source, sink) and excess[v] > 0]
    in_queue = set(queue)
    head = 0
    while head < len(queue):
        u = queue[head]
        head += 1
        in_queue.discard(u)
        while excess[u] > 0:
            pushed = False
            for v in range(n):
                if capacity[u][v] > 0 and height[u] == height[v] + 1:
                    amount = min(excess[u], capacity[u][v])
                    capacity[u][v] -= amount
                    capacity[v][u] += amount
                    excess[u] -= amount
                    excess[v] += amount
                    pushed = True
                    if v not in (source, sink) and v not in in_queue:
                        queue.append(v)
                        in_queue.add(v)
                    if excess[u] == 0:
                        break
            if excess[u] == 0:
                break
            lowest = None
            for v in range(n):
                if capacity[u][v] > 0:
                    if lowest is None or height[v] < lowest:
                        lowest = height[v]
            height[u] = lowest + 1
    return excess[sink]
`,
  },

  'hopcroft-karp': {
    statement: '用 Hopcroft–Karp 算法求二分图最大匹配：BFS 分层找最短增广路集、DFS 沿层图增广，反复直到找不到增广路。返回最大匹配数。',
    input: 'data 为 {"left": 左部点数, "right": 右部点数, "edges": [[l, r], ...]}，编号从 0 开始。',
    output: '返回最大匹配数（整数）。',
    constraints: ['1 <= left, right <= 100', '1 <= edges.length <= 1000'],
    examples: [
      example({ left: 3, right: 3, edges: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]] }, 3),
    ],
    tests: [
      example({ left: 2, right: 2, edges: [[0, 0], [0, 1]] }, 1),
      example({ left: 4, right: 4, edges: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 3]] }, 4),
      example({ left: 2, right: 2, edges: [] }, 0),
      example({ left: 3, right: 2, edges: [[0, 0], [1, 0], [2, 0], [2, 1]] }, 2),
    ],
    insights: ['Hopcroft–Karp 的层图把「一条条找增广路」升级为「一轮找一批互不相交的最短增广路」，轮数 O(√E)。', 'DFS 中把已失败的左点距离清 -1，保证同一轮内不重复走死路。'],
    pitfalls: ['BFS 的 found 标记要在遇到未匹配右点时设置，而不是只看队列空。', '右部点没有距离，层间跳转靠匹配边从右部回到左部。'],
    solution: `from collections import deque


def solve(data):
    nl = int(data["left"])
    nr = int(data["right"])
    adj = [[] for _ in range(nl)]
    for l, r in data["edges"]:
        adj[int(l)].append(int(r))
    match_l = [-1] * nl
    match_r = [-1] * nr

    def bfs():
        dist = [-1] * nl
        queue = deque()
        for u in range(nl):
            if match_l[u] == -1:
                dist[u] = 0
                queue.append(u)
        found = False
        while queue:
            u = queue.popleft()
            for v in adj[u]:
                w = match_r[v]
                if w == -1:
                    found = True
                elif dist[w] == -1:
                    dist[w] = dist[u] + 1
                    queue.append(w)
        return found, dist

    def dfs(u, dist):
        for v in adj[u]:
            w = match_r[v]
            if w == -1 or (dist[w] == dist[u] + 1 and dfs(w, dist)):
                match_l[u] = v
                match_r[v] = u
                return True
        dist[u] = -1
        return False

    matching = 0
    while True:
        found, dist = bfs()
        if not found:
            break
        for u in range(nl):
            if match_l[u] == -1 and dfs(u, dist):
                matching += 1
    return matching
`,
  },

  'blossom-matching': {
    statement: '用带花树（Blossom）算法求一般图最大匹配：交替树沿非匹配边扩张、遇奇环收缩为花（lca 求基点、双路径标记），增广后展开。返回最大匹配数。',
    input: 'data 为 {"n": 点数, "edges": [[u, v], ...]}，无重边无自环。',
    output: '返回最大匹配数（整数）。',
    constraints: ['2 <= n <= 20', '1 <= edges.length <= 60'],
    examples: [
      example({ n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] }, 2, '五元环最大匹配为 2'),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] }, 2),
      example({ n: 6, edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3]] }, 3),
      example({ n: 3, edges: [[0, 1]] }, 1),
      example({ n: 5, edges: [[0, 1], [2, 3], [3, 4], [4, 2]] }, 2),
    ],
    insights: ['奇环是二分图增广理论失效的根源：收缩成花后，环上任意一点都能作为「可增广出口」，花当作一个超级点继续长树。', '基点（lca）统一花的所有节点，展开时沿双路径回代即可完成增广。'],
    pitfalls: ['判断「跳过」要同时排除同基点与匹配边两种情形，漏一个会把匹配边当增广边。', '花的标记要落在 base 上而不是原节点上，展开重标时才不会漏环内节点。'],
    solution: `def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[int(u)].append(int(v))
        adj[int(v)].append(int(u))
    match = [-1] * n
    p = [-1] * n
    base = list(range(n))
    used = [False] * n
    blossom = [False] * n

    def lca(a, b):
        seen = [False] * n
        while True:
            a = base[a]
            seen[a] = True
            if match[a] == -1:
                break
            a = p[match[a]]
        while True:
            b = base[b]
            if seen[b]:
                return b
            b = p[match[b]]

    def mark_path(v, b, child):
        while base[v] != b:
            blossom[base[v]] = True
            blossom[base[match[v]]] = True
            p[v] = child
            child = match[v]
            v = p[match[v]]

    def find_path(root):
        for i in range(n):
            used[i] = False
            p[i] = -1
            base[i] = i
        used[root] = True
        queue = [root]
        head = 0
        while head < len(queue):
            v = queue[head]
            head += 1
            for to in adj[v]:
                if base[v] == base[to] or match[v] == to:
                    continue
                if to == root or (match[to] != -1 and p[match[to]] != -1):
                    cur_base = lca(v, to)
                    for i in range(n):
                        blossom[i] = False
                    mark_path(v, cur_base, to)
                    mark_path(to, cur_base, v)
                    for u in range(n):
                        if blossom[base[u]]:
                            base[u] = cur_base
                            if not used[u]:
                                used[u] = True
                                queue.append(u)
                elif p[to] == -1:
                    p[to] = v
                    if match[to] == -1:
                        u = to
                        while u != -1:
                            pv = p[u]
                            ppv = match[pv]
                            match[u] = pv
                            match[pv] = u
                            u = ppv
                        return True
                    else:
                        used[match[to]] = True
                        queue.append(match[to])
        return False

    result = 0
    for v in range(n):
        if match[v] == -1 and find_path(v):
            result += 1
    return result
`,
  },

  'chu-liu-edmonds': {
    statement: '用 Chu–Liu/Edmonds 算法求以 root 为根的最小树形图（每个节点恰有一条入边、root 除外，全部节点从 root 可达）：每点先取最小入边，检测到环则收缩为超级节点（入环边权减去环上该点入边权），递归求解后展开。返回最小总代价；不存在树形图返回 null。',
    input: 'data 为 {"n": 点数, "edges": [[u, v, w], ...], "root": 根}。',
    output: '返回最小总代价（整数）或 null。',
    constraints: ['2 <= n <= 8', '1 <= edges.length <= 20', '0 <= w <= 100'],
    examples: [
      example({ n: 3, edges: [[0, 1, 5], [0, 2, 6], [1, 2, 1], [2, 1, 2]], root: 0 }, 6, '0→1(5) + 1→2(1) 是最小树形图'),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1, 1], [0, 2, 2], [1, 3, 3], [2, 3, 1]], root: 0 }, 4),
      example({ n: 3, edges: [[0, 1, 2], [1, 2, 3]], root: 2 }, null),
      example({ n: 4, edges: [[0, 1, 4], [1, 2, 1], [2, 1, 1], [2, 3, 5], [0, 3, 10]], root: 0 }, 10),
      example({ n: 5, edges: [[0, 1, 1], [1, 2, 2], [2, 3, 3], [3, 4, 4], [0, 4, 20], [4, 1, 1]], root: 0 }, 10),
    ],
    insights: ['每个点先贪心拿最小入边：若这些边构成树形图，它就是最优——因为任何树形图每个点至少一条入边。', '环的处理是精髓：环上每个点都被「环边」覆盖，外部入环边只需比较「省下的环代价」，权值改写 w − cost_in[v] 正是这笔账。'],
    pitfalls: ['收缩时环内点互指的边要删除，入环边要减权、出环边原样保留。', '不存在树形图的判据是「某非根点没有任何入边」，收缩后同样适用。'],
    solution: `def solve(data):
    n0 = int(data["n"])
    root0 = int(data["root"])
    edges0 = [(int(u), int(v), int(w), None) for u, v, w in data["edges"]]

    def solve_rec(count, edges, root, super_id, next_id):
        pred = {}
        for u, v, w, deeper in edges:
            if u == v or v == root:
                continue
            if v not in pred or w < pred[v][1]:
                pred[v] = (u, w, deeper)
        if len(pred) < count - 1:
            return None
        color = {}
        cycle = None
        for start in list(pred.keys()):
            if color.get(start):
                continue
            path = []
            u = start
            while u in pred and not color.get(u):
                color[u] = True
                path.append(u)
                u = pred[u][0]
            if u in pred and color.get(u) and u in path:
                cycle = path[path.index(u):]
                break
        if cycle is None:
            return [(u, v, w, deeper) for v, (u, w, deeper) in pred.items()]
        merged_id = next_id
        cycle_set = set(cycle)
        cost_in = {v: pred[v][1] for v in cycle}
        new_edges = []
        for u, v, w, deeper in edges:
            if u == v:
                continue
            in_u = u in cycle_set
            in_v = v in cycle_set
            if in_u and in_v:
                continue
            if in_v:
                new_edges.append((u, merged_id, w - cost_in[v], (u, v, w, deeper)))
            elif in_u:
                new_edges.append((merged_id, v, w, deeper))
            else:
                new_edges.append((u, v, w, deeper))
        sub = solve_rec(count - len(cycle) + 1, new_edges, root, merged_id, next_id + 1)
        if sub is None:
            return None
        enter = None
        for e in sub:
            if e[1] == merged_id:
                enter = e
                break
        before = enter[3]
        v_star = before[1]
        chosen = [e for e in sub if e[1] != merged_id]
        chosen.append(before)
        for v in cycle:
            if v != v_star:
                u, w, deeper = pred[v]
                chosen.append((u, v, w, deeper))
        return chosen

    result = solve_rec(n0, edges0, root0, None, n0)
    if result is None:
        return None
    return sum(e[2] for e in result)
`,
  },

  'gomory-hu-tree': {
    statement: '用 Gusfield 算法构建 Gomory–Hu 树：n-1 次最大流，每次在 (v, parent[v]) 之间求流，流值即树边权；随后按残量图可达性把「与 v 同侧」的后续节点改挂到 v 下。返回 n-1 条树边 [min(u,v), max(u,v), w] 按字典序排序。',
    input: 'data 为 {"n": 点数, "edges": [[u, v, cap], ...]}，无向容量。',
    output: '返回 [[min, max, w], ...] 二维数组（n-1 条，按 [min, max] 字典序）。',
    constraints: ['2 <= n <= 8', '1 <= edges.length <= 20', '0 <= cap <= 100'],
    examples: [
      example({ n: 4, edges: [[0, 1, 3], [1, 2, 2], [2, 3, 4], [3, 0, 1], [0, 2, 2]] }, [[0, 1, 5], [0, 2, 5], [2, 3, 5]]),
    ],
    tests: [
      example({ n: 3, edges: [[0, 1, 1], [1, 2, 1], [0, 2, 1]] }, [[0, 1, 2], [0, 2, 2]]),
      example({ n: 2, edges: [[0, 1, 9]] }, [[0, 1, 9]]),
      example({ n: 5, edges: [[0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 4, 5], [4, 0, 5]] }, [[0, 1, 10], [0, 2, 10], [0, 3, 10], [0, 4, 10]]),
    ],
    insights: ['Gusfield 版的聪明之处：不需要真的把收缩图存下来——n-1 次最大流的流值直接就是树的边权，残量图可达性决定挂树方向。', '树上任意两点路径的最小边权 = 原图中它们的最小割，这棵树把 O(n²) 个割压缩成 n-1 条边。'],
    pitfalls: ['可达性要在残量图上从 v 出发 BFS，与「是否同侧」的判断一致才不会挂错方向。', '无向边在最大流里按两个方向的容量对称处理。'],
    solution: `from collections import deque


def solve(data):
    n = int(data["n"])
    capacity = [[0] * n for _ in range(n)]
    for u, v, c in data["edges"]:
        capacity[int(u)][int(v)] += int(c)
        capacity[int(v)][int(u)] += int(c)

    def maxflow(source, sink):
        cap = [row[:] for row in capacity]
        flow = 0
        while True:
            parent = [-1] * n
            parent[source] = source
            queue = deque([source])
            while queue and parent[sink] == -1:
                u = queue.popleft()
                for v in range(n):
                    if parent[v] == -1 and cap[u][v] > 0:
                        parent[v] = u
                        queue.append(v)
            if parent[sink] == -1:
                break
            bottleneck = float("inf")
            v = sink
            while v != source:
                u = parent[v]
                bottleneck = min(bottleneck, cap[u][v])
                v = u
            v = sink
            while v != source:
                u = parent[v]
                cap[u][v] -= bottleneck
                cap[v][u] += bottleneck
                v = u
            flow += bottleneck
        reach = [False] * n
        reach[source] = True
        queue = deque([source])
        while queue:
            u = queue.popleft()
            for v in range(n):
                if not reach[v] and cap[u][v] > 0:
                    reach[v] = True
                    queue.append(v)
        return flow, reach

    parent = [0] * n
    tree_edges = [None] * n
    for v in range(1, n):
        flow, reach = maxflow(v, parent[v])
        tree_edges[v] = flow
        for u in range(v + 1, n):
            if parent[u] == parent[v] and reach[u]:
                parent[u] = v
    out = []
    for v in range(1, n):
        a, b = min(v, parent[v]), max(v, parent[v])
        out.append([a, b, tree_edges[v]])
    return sorted(out)
`,
  },

  'stoer-wagner-min-cut': {
    statement: '用 Stoer–Wagner 算法求无向带权图的全局最小割：每阶段做最大 adjacency 搜索（依次并入与已选集合连接权重最大的点），最后并入的点与外界的连接权重即「本阶段割」，记录后把该点合并到前一点，重复 n-1 个阶段，取最小值。并列最大连接权重时取编号最小者。返回最小割权重。',
    input: 'data 为 {"n": 点数, "edges": [[u, v, w], ...]}，无向图。',
    output: '返回最小割权重（整数）。',
    constraints: ['2 <= n <= 12', '1 <= edges.length <= 40', '0 <= w <= 100'],
    examples: [
      example({ n: 4, edges: [[0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 0, 5], [0, 2, 1]] }, 5, '割 {1}|其余 的权重 2+3=5 是全局最小'),
    ],
    tests: [
      example({ n: 2, edges: [[0, 1, 7]] }, 7),
      example({ n: 3, edges: [[0, 1, 1], [1, 2, 1], [0, 2, 1]] }, 2),
      example({ n: 5, edges: [[0, 1, 2], [1, 2, 2], [2, 3, 2], [3, 4, 2], [4, 0, 2], [0, 2, 9], [1, 3, 9]] }, 4, '割 {4}|其余 的权重 2+2=4'),
      example({ n: 4, edges: [[0, 1, 3], [1, 2, 3], [2, 3, 3], [3, 0, 3]] }, 6),
    ],
    insights: ['「本阶段割」的正确性：最后并入的点与集合外界的连接权重，恰好等于把该点单独划出去的割值——MAS 顺序保证它不劣于任何涉及它的割。', '合并用「权重叠加」实现收缩，缩点后的自环无意义直接丢弃。'],
    pitfalls: ['并列权重时固定取编号最小者，否则割值虽然相同但过程不稳定。', '阶段数是 n-1 而不是 n：最后一个阶段只剩一个点，没有割可言。'],
    solution: `def solve(data):
    n = int(data["n"])
    weights = [[0] * n for _ in range(n)]
    for u, v, w in data["edges"]:
        weights[int(u)][int(v)] += int(w)
        weights[int(v)][int(u)] += int(w)
    active = list(range(n))
    best = None
    for _ in range(n - 1):
        first = active[0]
        in_set = {first}
        sel = {u: weights[first][u] for u in active[1:]}
        prev = first
        last = first
        while len(in_set) < len(active):
            pick = None
            pick_val = None
            for u in active:
                if u in in_set:
                    continue
                val = sel.get(u, 0)
                if pick is None or val > pick_val:
                    pick = u
                    pick_val = val
            in_set.add(pick)
            for u in active:
                if u not in in_set:
                    sel[u] = sel.get(u, 0) + weights[pick][u]
            prev = last
            last = pick
        cut = sel.get(last, 0)
        if best is None or cut < best:
            best = cut
        active.remove(last)
        for u in active:
            if u != prev:
                weights[prev][u] += weights[last][u]
                weights[u][prev] += weights[u][last]
    return best
`,
  },

  'johnson-algorithm': {
    statement: '用 Johnson 算法回答含负权边（无负环）图上的多组点对最短路：先跑一轮以虚拟源出发的 Bellman–Ford 求势函数 h，再用 Dijkstra 配合势函数 w + h[u] - h[v] 逐查询求解，最后还原真实距离。返回每个查询的距离（不可达为 null）。',
    input: 'data 为 {"n": 点数, "edges": [[u, v, w], ...], "queries": [[s, t], ...]}，w 可为负，保证无负环。',
    output: '返回 {"distances": {"s,t": 距离或 null}}，键为 "s,t"。',
    constraints: ['2 <= n <= 50', '1 <= edges.length <= 200', '-100 <= w <= 100', '1 <= queries.length <= 50'],
    examples: [
      example({ n: 3, edges: [[0, 1, 4], [1, 2, -2], [0, 2, 5]], queries: [[0, 2], [2, 0]] }, { distances: { "0,2": 2, "2,0": null } }, '0→1→2 比 0→2 短'),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1, 1], [1, 2, -5], [2, 3, 2], [0, 3, 10]], queries: [[0, 3], [1, 3]] }, { distances: { "0,3": -2, "1,3": -3 } }),
      example({ n: 2, edges: [[0, 1, 3]], queries: [[1, 0], [0, 1]] }, { distances: { "1,0": null, "0,1": 3 } }),
      example({ n: 3, edges: [[0, 1, -1], [1, 2, 2], [0, 2, 5]], queries: [[1, 0]] }, { distances: { "1,0": null } }),
    ],
    insights: ['势函数 h 把负权「垫平」：新边权 w + h[u] - h[v] 非负且路径单调可逆，Dijkstra 因此合法，最后减回 h 差还原真距离。', '虚拟源到所有点连 0 权边，一轮 Bellman–Ford 同时完成负环检测与势函数初始化。'],
    pitfalls: ['Bellman–Ford 第 n 轮仍有松弛说明有负环，本题约定不出现但仍要写保护。', '还原真实距离时势差的方向是 h[t] - h[s]，写反会得到对称的错误值。'],
    solution: `import heapq


def solve(data):
    n = int(data["n"])
    edges = [(int(u), int(v), int(w)) for u, v, w in data["edges"]]
    h = [0] * n
    for _ in range(n):
        updated = False
        for u, v, w in edges:
            if h[u] + w < h[v]:
                h[v] = h[u] + w
                updated = True
        if not updated:
            break
    distances = {}
    for s, t in data["queries"]:
        s, t = int(s), int(t)
        dist = [None] * n
        dist[s] = 0
        heap = [(0, s)]
        while heap:
            d, u = heapq.heappop(heap)
            if dist[u] is not None and d > dist[u]:
                continue
            for eu, ev, ew in edges:
                if eu != u:
                    continue
                nd = d + ew + h[u] - h[ev]
                if dist[ev] is None or nd < dist[ev]:
                    dist[ev] = nd
                    heapq.heappush(heap, (nd, ev))
        if dist[t] is None:
            distances[f"{s},{t}"] = None
        else:
            distances[f"{s},{t}"] = dist[t] - h[s] + h[t]
    return {"distances": distances}
`,
  },

  'lower-bound-flow': {
    statement: '判断带下界的 s-t 流是否存在：每条边有流量下界 lo 与容量 hi。做法：加一条 sink→source 的无穷容量边把 s-t 流问题转成循环流，再建超源 S（向每条边的起点补 lo）与超汇 T（从每条边的终点抽 lo），可行当且仅当 S 到 T 的最大流饱和所有 S 的出边。',
    input: 'data 为 {"n": 点数, "edges": [[u, v, lo, hi], ...], "source": s, "sink": t}。',
    output: '返回布尔值（是否存在满足所有下界的可行流）。',
    constraints: ['2 <= n <= 20', '1 <= edges.length <= 100', '0 <= lo <= hi <= 10^4', 'source ≠ sink'],
    examples: [
      example({ n: 3, edges: [[0, 1, 2, 4], [1, 2, 1, 3]], source: 0, sink: 2 }, true, '流 2 同时落在 0→1 的 [2,4] 与 1→2 的 [1,3] 内'),
    ],
    tests: [
      example({ n: 2, edges: [[0, 1, 1, 5]], source: 0, sink: 1 }, true),
      example({ n: 2, edges: [[0, 1, 6, 5]], source: 0, sink: 1 }, false),
      example({ n: 4, edges: [[0, 1, 1, 5], [1, 3, 1, 5], [0, 2, 2, 4], [2, 3, 2, 4]], source: 0, sink: 3 }, true),
    ],
    insights: ['下界转化的本质是「先预付 lo 再给 hi-lo 的自由度」：每条边先强制流 lo，进出不平衡由超源超汇找平，循环流可行当且仅当补流满灌。', 'sink→source 的无穷边把「s-t 流」变成「循环流」，是网络流问题之间互相归约的常用桥。'],
    pitfalls: ['超源连的是边的起点（补流出量缺口），超汇连的是边的终点，方向接反判据会完全颠倒。', 'lo > hi 的边直接不可行。'],
    solution: `from collections import deque


def solve(data):
    n = int(data["n"])
    total = n + 2
    super_s, super_t = n, n + 1
    capacity = [[0] * total for _ in range(total)]
    source = int(data["source"])
    sink = int(data["sink"])
    for u, v, lo, hi in data["edges"]:
        u, v, lo, hi = int(u), int(v), int(lo), int(hi)
        if lo > hi:
            return False
        capacity[u][v] += hi - lo
        capacity[super_s][v] += lo
        capacity[u][super_t] += lo
    capacity[sink][source] += 10 ** 9
    required = sum(capacity[super_s])

    def maxflow():
        flow = 0
        while True:
            parent = [-1] * total
            parent[super_s] = super_s
            queue = deque([super_s])
            while queue and parent[super_t] == -1:
                u = queue.popleft()
                for v in range(total):
                    if parent[v] == -1 and capacity[u][v] > 0:
                        parent[v] = u
                        queue.append(v)
            if parent[super_t] == -1:
                return flow
            bottleneck = float("inf")
            v = super_t
            while v != super_s:
                u = parent[v]
                bottleneck = min(bottleneck, capacity[u][v])
                v = u
            v = super_t
            while v != super_s:
                u = parent[v]
                capacity[u][v] -= bottleneck
                capacity[v][u] += bottleneck
                v = u
            flow += bottleneck

    return maxflow() >= required
`,
  },

  'kosaraju-scc': {
    statement: '用 Kosaraju 算法求有向图的强连通分量：第一遍在原图上按完成时间记录顺序，第二遍在反图上按逆完成序 DFS，每个新树即一个 SCC。返回 {"count": 分量个数, "sizes": 各分量大小（降序）}。',
    input: 'data 为 {"n": 点数, "edges": [[u, v], ...]}。',
    output: '返回 {"count": 整数, "sizes": 整数数组（降序）}。',
    constraints: ['1 <= n <= 100', '0 <= edges.length <= 500'],
    examples: [
      example({ n: 5, edges: [[0, 1], [1, 2], [2, 0], [3, 4]] }, { count: 3, sizes: [3, 1, 1] }, '0-1-2 成环，3、4 各自独立'),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1], [1, 0], [2, 3]] }, { count: 3, sizes: [2, 1, 1] }),
      example({ n: 3, edges: [] }, { count: 3, sizes: [1, 1, 1] }),
      example({ n: 6, edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3]] }, { count: 2, sizes: [3, 3] }),
    ],
    insights: ['两遍 DFS 的正确性来自「反图上从 finish 最晚的点出发恰好收拢一个 SCC」——完成时间序在反图中与 SCC 的汇聚方向一致。', '迭代实现避免链式图爆栈，按邻接表原始顺序压栈保证确定性。'],
    pitfalls: ['第二遍必须按第一遍的完成时间「从晚到早」处理，顺序错了会把多个 SCC 揉成一团。', '孤立点也是 SCC，不能漏计。'],
    solution: `def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    radj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[int(u)].append(int(v))
        radj[int(v)].append(int(u))
    visited = [False] * n
    order = []
    for start in range(n):
        if visited[start]:
            continue
        stack = [(start, 0)]
        visited[start] = True
        while stack:
            u, idx = stack[-1]
            if idx < len(adj[u]):
                stack[-1] = (u, idx + 1)
                v = adj[u][idx]
                if not visited[v]:
                    visited[v] = True
                    stack.append((v, 0))
            else:
                order.append(u)
                stack.pop()
    assigned = [-1] * n
    sizes = []
    for root in reversed(order):
        if assigned[root] != -1:
            continue
        size = 0
        comp_stack = [root]
        assigned[root] = len(sizes)
        while comp_stack:
            u = comp_stack.pop()
            size += 1
            for v in radj[u]:
                if assigned[v] == -1:
                    assigned[v] = len(sizes)
                    comp_stack.append(v)
        sizes.append(size)
    return {"count": len(sizes), "sizes": sorted(sizes, reverse=True)}
`,
  },

  'biconnected-components': {
    statement: '用 Tarjan 算法求无向图的双连通分量（BCC）：维护边栈，回边用 dfn 更新 low，dfn[u] <= low[v] 时弹出栈内直至当前边的所有边构成一个 BCC。返回 {"count": 分量个数, "sizes": 各 BCC 的边数（降序）}。',
    input: 'data 为 {"n": 点数, "edges": [[u, v], ...]}，无重边无自环。',
    output: '返回 {"count": 整数, "sizes": 整数数组（降序，按每个 BCC 含有的边数）}。',
    constraints: ['1 <= n <= 60', '0 <= edges.length <= 150'],
    examples: [
      example({ n: 5, edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4]] }, { count: 3, sizes: [3, 1, 1] }, '三角形是一个 BCC，两条桥边各自是独立 BCC'),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 3]] }, { count: 3, sizes: [1, 1, 1] }),
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 0]] }, { count: 1, sizes: [5] }),
      example({ n: 6, edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]] }, { count: 2, sizes: [3, 3] }),
    ],
    insights: ['low[v] 记录 v 经树边与回边能触及的最早时间戳；low[v] >= dfn[u] 说明 v 的子树与外界只靠 (u,v) 相连——此刻栈中边恰好构成一个 BCC。', '边栈（而非点栈）保证割点可以同时属于多个 BCC，这与 SCC 的处理有本质区别。'],
    pitfalls: ['回边要按「边编号」跳过来时的那条边，按父节点跳过在有重边时会漏边（本题无重边但写法要正确）。', '孤立点不构成 BCC，不在统计内。'],
    solution: `import sys


def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for idx, (u, v) in enumerate(data["edges"]):
        adj[int(u)].append((int(v), idx))
        adj[int(v)].append((int(u), idx))
    sys.setrecursionlimit(10000)
    dfn = [-1] * n
    low = [0] * n
    timer = [0]
    edge_stack = []
    sizes = []

    def dfs(u, parent_edge):
        dfn[u] = low[u] = timer[0]
        timer[0] += 1
        for v, eid in adj[u]:
            if eid == parent_edge:
                continue
            if dfn[v] == -1:
                edge_stack.append((u, v))
                dfs(v, eid)
                low[u] = min(low[u], low[v])
                if low[v] >= dfn[u]:
                    size = 0
                    while True:
                        a, b = edge_stack.pop()
                        size += 1
                        if (a, b) == (u, v):
                            break
                    sizes.append(size)
            elif dfn[v] < dfn[u]:
                edge_stack.append((u, v))
                low[u] = min(low[u], dfn[v])

    for start in range(n):
        if dfn[start] == -1:
            dfs(start, -1)
    return {"count": len(sizes), "sizes": sorted(sizes, reverse=True)}
`,
  },

  'dag-shortest-path': {
    statement: '在有向无环图（DAG）上求单源最短路：先拓扑排序，再按拓扑序松弛每条边一次即可（O(V+E)）。返回距离数组（从 source 出发，不可达为 null）。',
    input: 'data 为 {"n": 点数, "edges": [[u, v, w], ...], "source": 起点}。',
    output: '返回长度 n 的数组，元素为整数或 null。',
    constraints: ['1 <= n <= 100', '0 <= edges.length <= 500', '-100 <= w <= 100', '输入保证是 DAG'],
    examples: [
      example({ n: 4, edges: [[0, 1, 3], [0, 2, 1], [2, 1, 1], [1, 3, 4]], source: 0 }, [0, 2, 1, 6], '0→2→1→3 优于 0→1→3'),
    ],
    tests: [
      example({ n: 3, edges: [[0, 1, 5], [1, 2, -3]], source: 0 }, [0, 5, 2]),
      example({ n: 2, edges: [[1, 0, 2]], source: 0 }, [0, null]),
      example({ n: 5, edges: [[0, 1, 2], [0, 2, 9], [1, 3, 1], [2, 3, 1], [3, 4, 1]], source: 0 }, [0, 2, 9, 3, 4]),
    ],
    insights: ['DAG 上最短路不需要优先队列：拓扑序保证松弛 u 时 u 的所有入边都已处理完，每条边只松弛一次。', '不可达点保持 null，松弛时跳过 dist 为 null 的源点。'],
    pitfalls: ['拓扑排序用入度归零法，顺序只依赖拓扑关系而非节点编号。', '负权边在 DAG 上完全合法——这正是 DAG 最短路优于 Dijkstra 的地方。'],
    solution: `def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    indegree = [0] * n
    for u, v, w in data["edges"]:
        adj[int(u)].append((int(v), int(w)))
        indegree[int(v)] += 1
    queue = [i for i in range(n) if indegree[i] == 0]
    order = []
    while queue:
        u = queue.pop()
        order.append(u)
        for v, w in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    dist = [None] * n
    dist[int(data["source"])] = 0
    for u in order:
        if dist[u] is None:
            continue
        for v, w in adj[u]:
            candidate = dist[u] + w
            if dist[v] is None or candidate < dist[v]:
                dist[v] = candidate
    return dist
`,
  },

  'undirected-cycle-detection': {
    statement: '判断无向图是否有环：用并查集依次合并每条边的两端，若两端已同根则出现环。返回布尔值。',
    input: 'data 为 {"n": 点数, "edges": [[u, v], ...]}。',
    output: '返回布尔值。',
    constraints: ['1 <= n <= 100', '0 <= edges.length <= 300'],
    examples: [
      example({ n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, true),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 3]] }, false),
      example({ n: 2, edges: [[0, 0]] }, true),
      example({ n: 5, edges: [[0, 1], [1, 2], [3, 4], [2, 3]] }, false),
    ],
    insights: ['无向图环检测与并查集天然契合：树边合并两个不同集合，某条边的两端已连通时它就是多余的回边。', '自环 (u, u) 一进来就同根，天然被判定为环。'],
    pitfalls: ['并查集合并前必须先 find 两端，直接比较父数组会误判。'],
    solution: `def solve(data):
    n = int(data["n"])
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x

    for u, v in data["edges"]:
        ru, rv = find(int(u)), find(int(v))
        if ru == rv:
            return True
        parent[ru] = rv
    return False
`,
  },

  'directed-cycle-detection': {
    statement: '判断有向图是否有环：三色标记 DFS（白未访问、灰在当前递归栈、黑已完成），访问到灰色节点即存在环。返回布尔值。',
    input: 'data 为 {"n": 点数, "edges": [[u, v], ...]}。',
    output: '返回布尔值。',
    constraints: ['1 <= n <= 100', '0 <= edges.length <= 500'],
    examples: [
      example({ n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, true),
    ],
    tests: [
      example({ n: 4, edges: [[0, 1], [1, 2], [1, 3]] }, false),
      example({ n: 3, edges: [[0, 1], [1, 2], [0, 2]] }, false),
      example({ n: 2, edges: [[0, 1], [1, 0]] }, true),
      example({ n: 1, edges: [[0, 0]] }, true),
    ],
    insights: ['有向图不能像无向图那样用「访问过」判环——两条汇聚路径不构成环；只有回到当前递归栈中的灰色节点才是真回边。', '黑色节点可以直接跳过，这同时保证了整体 O(V+E)。'],
    pitfalls: ['递归返回后要把节点染黑（出栈），忘记染黑会让交叉边被误判为回边。'],
    solution: `def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[int(u)].append(int(v))
    color = [0] * n

    def dfs(u):
        color[u] = 1
        for v in adj[u]:
            if color[v] == 1:
                return True
            if color[v] == 0 and dfs(v):
                return True
        color[u] = 2
        return False

    for u in range(n):
        if color[u] == 0 and dfs(u):
            return True
    return False
`,
  },

  'bipartite-check': {
    statement: '判断无向图是否为二分图：BFS 染色，相邻节点颜色必须相反，冲突则不是二分图。返回布尔值。',
    input: 'data 为 {"n": 点数, "edges": [[u, v], ...]}。',
    output: '返回布尔值。',
    constraints: ['1 <= n <= 100', '0 <= edges.length <= 500'],
    examples: [
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 3], [3, 0]] }, true, '四元环是二分图'),
    ],
    tests: [
      example({ n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, false),
      example({ n: 2, edges: [[0, 1]] }, true),
      example({ n: 5, edges: [] }, true),
      example({ n: 4, edges: [[0, 1], [1, 2], [2, 0]] }, false),
    ],
    insights: ['二分图等价于「无奇环」：BFS 按层染色时同层节点颜色相同，奇环会让某一层内出现一条同色边。', '图可能不连通，每个连通分量都要单独染色。'],
    pitfalls: ['起点颜色可以随意定，冲突只发生在「已染色且颜色相同」的邻接上。', '自环让节点与自己相邻，必然非二分图。'],
    solution: `from collections import deque


def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[int(u)].append(int(v))
        adj[int(v)].append(int(u))
    color = [-1] * n
    for start in range(n):
        if color[start] != -1:
            continue
        color[start] = 0
        queue = deque([start])
        while queue:
            u = queue.popleft()
            for v in adj[u]:
                if color[v] == -1:
                    color[v] = color[u] ^ 1
                    queue.append(v)
                elif color[v] == color[u]:
                    return False
    return True
`,
  },

  'grid-search': {
    statement: '在 0/1 网格（0 为空地、1 为障碍）上用 BFS 求起点到终点的最短步数（上下左右四方向移动）。返回最短步数；不可达返回 -1。',
    input: 'data 为 {"grid": 二维 0/1 数组, "start": [r, c], "target": [r, c]}。',
    output: '返回整数（步数或 -1）；起点即终点时为 0。',
    constraints: ['1 <= rows, cols <= 100', 'start 与 target 都在网格内且为空地'],
    examples: [
      example({ grid: [[0, 0, 0], [1, 1, 0], [0, 0, 0]], start: [0, 0], target: [2, 2] }, 4),
    ],
    tests: [
      example({ grid: [[0]], start: [0, 0], target: [0, 0] }, 0),
      example({ grid: [[0, 1], [1, 0]], start: [0, 0], target: [1, 1] }, -1),
      example({ grid: [[0, 0], [0, 0]], start: [0, 0], target: [1, 1] }, 2),
      example({ grid: [[0, 1, 0], [0, 0, 0], [0, 1, 0]], start: [0, 0], target: [2, 2] }, 4),
    ],
    insights: ['网格 BFS 的层序就是距离：第一次到达终点时的层数即最短步数，无需比较取舍。', 'visited 标记在入队时打（而不是出队时），否则同一格会重复入队拖慢速度。'],
    pitfalls: ['起点与终点重合直接返回 0，不要进入 BFS 循环。', '障碍格绝不入队，终点若被障碍围死返回 -1。'],
    solution: `from collections import deque


def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    sr, sc = int(data["start"][0]), int(data["start"][1])
    tr, tc = int(data["target"][0]), int(data["target"][1])
    if (sr, sc) == (tr, tc):
        return 0
    visited = [[False] * cols for _ in range(rows)]
    visited[sr][sc] = True
    queue = deque([(sr, sc, 0)])
    while queue:
        r, c, d = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] == 0:
                if (nr, nc) == (tr, tc):
                    return d + 1
                visited[nr][nc] = True
                queue.append((nr, nc, d + 1))
    return -1
`,
  },
};
