def solve(data):
    n = int(data["n"])
    queries = list(data["queries"])
    if not queries:
        return []
    max_time = max(q[0] for q in queries)
    span_edges = {}

    def add_edge(node, lo, hi, l, r, edge):
        if r < lo or hi < l:
            return
        if l <= lo and hi <= r:
            span_edges.setdefault(node, []).append(edge)
            return
        mid = (lo + hi) // 2
        add_edge(2 * node, lo, mid, l, r, edge)
        add_edge(2 * node + 1, mid + 1, hi, l, r, edge)

    for u, v, l, r in data["edges"]:
        add_edge(1, 0, max_time, l, r, (u, v))

    parent = list(range(n))
    size = [1] * n
    history = []

    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x

    def union(a, b):
        a, b = find(a), find(b)
        if a == b:
            return
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        history.append(b)

    ids_by_time = {}
    pairs_by_time = {}
    for i, (t, u, v) in enumerate(queries):
        ids_by_time.setdefault(t, []).append(i)
        pairs_by_time.setdefault(t, []).append((u, v))
    out = [None] * len(queries)

    def dfs(node, lo, hi):
        snap = len(history)
        for u, v in span_edges.get(node, ()):
            union(u, v)
        if lo == hi:
            for idx, (u, v) in zip(ids_by_time.get(lo, ()), pairs_by_time.get(lo, ())):
                out[idx] = find(u) == find(v)
        else:
            mid = (lo + hi) // 2
            dfs(2 * node, lo, mid)
            dfs(2 * node + 1, mid + 1, hi)
        while len(history) > snap:
            b = history.pop()
            size[parent[b]] -= size[b]
            parent[b] = b

    dfs(1, 0, max_time)
    return out
