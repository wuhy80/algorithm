def solve(data):
    n = int(data["n"])
    values = list(data["values"])
    root = int(data["root"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    order = []
    parent = {root: -1}
    stack = [root]
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if v not in parent:
                parent[v] = u
                stack.append(v)
    tin = [0] * n
    for i, u in enumerate(order):
        tin[u] = i
    size = [1] * n
    subtree_sum = list(values)
    for u in reversed(order):
        p = parent[u]
        if p != -1:
            size[p] += size[u]
            subtree_sum[p] += subtree_sum[u]
    tout = [0] * n
    for u in range(n):
        tout[u] = tin[u] + size[u] - 1
    return {"tin": tin, "tout": tout, "subtree_sum": subtree_sum}
