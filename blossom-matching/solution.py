def solve(data):
    n = int(data["n"])
    adj = [[] for _ in range(n)]
    for u, v in data["edges"]:
        adj[int(u)].append(int(v))
        adj[int(v)].append(int(u))
    match = [-1] * n
    p = [-1] * n
    base = list(range(n))
    used = [False] * n
    blossom = [False] * n

    def lca(a, b):
        seen = [False] * n
        while True:
            a = base[a]
            seen[a] = True
            if match[a] == -1:
                break
            a = p[match[a]]
        while True:
            b = base[b]
            if seen[b]:
                return b
            b = p[match[b]]

    def mark_path(v, b, child):
        while base[v] != b:
            blossom[base[v]] = True
            blossom[base[match[v]]] = True
            p[v] = child
            child = match[v]
            v = p[match[v]]

    def find_path(root):
        for i in range(n):
            used[i] = False
            p[i] = -1
            base[i] = i
        used[root] = True
        queue = [root]
        head = 0
        while head < len(queue):
            v = queue[head]
            head += 1
            for to in adj[v]:
                if base[v] == base[to] or match[v] == to:
                    continue
                if to == root or (match[to] != -1 and p[match[to]] != -1):
                    cur_base = lca(v, to)
                    for i in range(n):
                        blossom[i] = False
                    mark_path(v, cur_base, to)
                    mark_path(to, cur_base, v)
                    for u in range(n):
                        if blossom[base[u]]:
                            base[u] = cur_base
                            if not used[u]:
                                used[u] = True
                                queue.append(u)
                elif p[to] == -1:
                    p[to] = v
                    if match[to] == -1:
                        u = to
                        while u != -1:
                            pv = p[u]
                            ppv = match[pv]
                            match[u] = pv
                            match[pv] = u
                            u = ppv
                        return True
                    else:
                        used[match[to]] = True
                        queue.append(match[to])
        return False

    result = 0
    for v in range(n):
        if match[v] == -1 and find_path(v):
            result += 1
    return result
