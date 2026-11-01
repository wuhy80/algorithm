def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    order = []
    parent = [-1] * n
    stack = [0]
    visited = [False] * n
    visited[0] = True
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                parent[v] = u
                stack.append(v)
    sz = [1] * n
    down = [0] * n
    for u in reversed(order):
        p = parent[u]
        if p != -1:
            sz[p] += sz[u]
            down[p] += down[u] + sz[u]
    ans = [0] * n
    ans[0] = down[0]
    for u in order:
        if u == 0:
            continue
        ans[u] = ans[parent[u]] + (n - sz[u]) - sz[u]
    return ans
