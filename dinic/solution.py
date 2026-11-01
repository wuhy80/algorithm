def solve(data):
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
