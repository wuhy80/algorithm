def solve(data):
    n = int(data["n"])
    colors = list(data["colors"])
    root = int(data["root"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    post = []
    parent = {root: -1}
    stack = [(root, False)]
    while stack:
        u, done = stack.pop()
        if done:
            post.append(u)
            continue
        stack.append((u, True))
        for v in adj[u]:
            if v != parent[u]:
                parent[v] = u
                stack.append((v, False))
    sets = [None] * n
    ans = [0] * n
    for u in post:
        children = [v for v in adj[u] if v != parent[u]]
        big = None
        big_len = -1
        for v in children:
            if len(sets[v]) > big_len:
                big_len = len(sets[v])
                big = v
        if big is None:
            sets[u] = {colors[u]}
        else:
            merged = sets[big]
            sets[big] = None
            merged.add(colors[u])
            for v in children:
                if v == big:
                    continue
                merged.update(sets[v])
                sets[v] = None
            sets[u] = merged
        ans[u] = len(sets[u])
    return ans
