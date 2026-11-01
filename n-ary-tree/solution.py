def solve(data):
    parent = [int(p) for p in data["parent"]]
    n = len(parent)
    root = parent.index(-1)
    children = [[] for _ in range(n)]
    for i, p in enumerate(parent):
        if p != -1:
            children[p].append(i)
    depth = [0] * n
    order = []
    queue = [root]
    head = 0
    while head < len(queue):
        u = queue[head]
        head += 1
        order.append(u)
        for v in children[u]:
            depth[v] = depth[u] + 1
            queue.append(v)
    size = [1] * n
    for u in reversed(order):
        p = parent[u]
        if p != -1:
            size[p] += size[u]
    return {"depth": depth, "subtree_size": size}
