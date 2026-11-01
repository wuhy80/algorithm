def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[u].append(v)
        adj[v].append(u)
    removed = [False] * n
    cparent = [-1] * n
    order = []

    def process(start, cpar):
        comp = [start]
        parent_of = {start: -1}
        qi = 0
        while qi < len(comp):
            u = comp[qi]
            qi += 1
            for v in adj[u]:
                if not removed[v] and v not in parent_of:
                    parent_of[v] = u
                    comp.append(v)
        total = len(comp)
        sz = {u: 1 for u in comp}
        for u in reversed(comp):
            p = parent_of[u]
            if p != -1:
                sz[p] += sz[u]
        centroid = start
        while True:
            moved = False
            for v in adj[centroid]:
                if removed[v] or v == parent_of.get(centroid, -1):
                    continue
                if sz[v] * 2 > total:
                    centroid = v
                    moved = True
                    break
            if moved:
                continue
            p = parent_of.get(centroid, -1)
            if p != -1 and (total - sz[centroid]) * 2 > total:
                centroid = p
                continue
            break
        cparent[centroid] = cpar
        order.append(centroid)
        removed[centroid] = True
        for v in adj[centroid]:
            if not removed[v]:
                process(v, centroid)

    process(0, -1)
    return {"order": order, "parent": cparent}
