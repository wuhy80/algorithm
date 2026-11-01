def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)

    def bfs(start):
        dist = [-1] * n
        dist[start] = 0
        queue = [start]
        qi = 0
        far = start
        while qi < len(queue):
            u = queue[qi]
            qi += 1
            if dist[u] > dist[far]:
                far = u
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    queue.append(v)
        return far, dist[far]

    a, _ = bfs(0)
    b, d = bfs(a)
    return {"length": d, "ends": sorted([a, b])}
