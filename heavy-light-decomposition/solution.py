def solve(data):
    n = int(data["n"])
    root = int(data["root"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    parent = [-1] * n
    order = []
    stack = [root]
    visited = [False] * n
    visited[root] = True
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                parent[v] = u
                stack.append(v)
    size = [1] * n
    heavy = [-1] * n
    for u in reversed(order):
        total = 1
        best = -1
        best_size = 0
        for v in adj[u]:
            if v == parent[u]:
                continue
            total += size[v]
            if size[v] > best_size:
                best_size = size[v]
                best = v
        size[u] = total
        heavy[u] = best
    head = [0] * n
    pos = [0] * n
    is_heavy = [False] * n
    for u in order:
        p = parent[u]
        if p != -1 and heavy[p] == u:
            is_heavy[u] = True
    timer = 0
    for u in order:
        if u == root or not is_heavy[u]:
            v = u
            while v != -1:
                head[v] = u
                pos[v] = timer
                timer += 1
                v = heavy[v]
    return {"parent": parent, "size": size, "heavy": heavy, "head": head, "pos": pos}
