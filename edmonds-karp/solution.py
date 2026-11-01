def solve(data):
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
