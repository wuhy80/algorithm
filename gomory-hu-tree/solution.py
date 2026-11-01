from collections import deque


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
