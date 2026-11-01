from collections import deque


def solve(data):
    nl = int(data["left"])
    nr = int(data["right"])
    adj = [[] for _ in range(nl)]
    for l, r in data["edges"]:
        adj[int(l)].append(int(r))
    match_l = [-1] * nl
    match_r = [-1] * nr

    def bfs():
        dist = [-1] * nl
        queue = deque()
        for u in range(nl):
            if match_l[u] == -1:
                dist[u] = 0
                queue.append(u)
        found = False
        while queue:
            u = queue.popleft()
            for v in adj[u]:
                w = match_r[v]
                if w == -1:
                    found = True
                elif dist[w] == -1:
                    dist[w] = dist[u] + 1
                    queue.append(w)
        return found, dist

    def dfs(u, dist):
        for v in adj[u]:
            w = match_r[v]
            if w == -1 or (dist[w] == dist[u] + 1 and dfs(w, dist)):
                match_l[u] = v
                match_r[v] = u
                return True
        dist[u] = -1
        return False

    matching = 0
    while True:
        found, dist = bfs()
        if not found:
            break
        for u in range(nl):
            if match_l[u] == -1 and dfs(u, dist):
                matching += 1
    return matching
