def solve(data):
    def centroids(n, edges):
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        if n == 1:
            return [0]
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
        for u in reversed(order):
            p = parent[u]
            if p != -1:
                sz[p] += sz[u]
        best = []
        best_val = None
        for u in range(n):
            mx = n - sz[u]
            for v in adj[u]:
                if v != parent[u] and sz[v] > mx:
                    mx = sz[v]
            if best_val is None or mx < best_val:
                best_val = mx
                best = [u]
            elif mx == best_val:
                best.append(u)
        return best

    def ahu_form(n, edges, root):
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        labels = [None] * n
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
        for u in reversed(order):
            child_labels = sorted(labels[v] for v in adj[u] if v != parent[u])
            labels[u] = "(" + "".join(child_labels) + ")"
        return labels[root]

    info_a = data["treeA"]
    info_b = data["treeB"]
    n_a, n_b = int(info_a["n"]), int(info_b["n"])
    if n_a != n_b:
        return False
    for ra in centroids(n_a, info_a["edges"]):
        form_a = ahu_form(n_a, info_a["edges"], ra)
        for rb in centroids(n_b, info_b["edges"]):
            if form_a == ahu_form(n_b, info_b["edges"], rb):
                return True
    return False
