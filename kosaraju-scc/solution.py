def solve(data):
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
