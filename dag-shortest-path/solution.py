def solve(data):
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
