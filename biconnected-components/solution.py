import sys


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
