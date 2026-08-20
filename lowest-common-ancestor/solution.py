from collections import deque

def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right); graph[right].append(left)
    parent = [-1] * n
    depth = [-1] * n
    root = data["root"]
    depth[root] = 0
    queue = deque([root])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if depth[neighbor] != -1:
                continue
            parent[neighbor] = node; depth[neighbor] = depth[node] + 1
            queue.append(neighbor)
    p, q = data["p"], data["q"]
    if depth[p] == -1 or depth[q] == -1:
        return -1
    while depth[p] > depth[q]:
        p = parent[p]
    while depth[q] > depth[p]:
        q = parent[q]
    while p != q:
        p, q = parent[p], parent[q]
    return p
