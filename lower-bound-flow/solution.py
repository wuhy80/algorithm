from collections import deque


def solve(data):
    n = int(data["n"])
    total = n + 2
    super_s, super_t = n, n + 1
    capacity = [[0] * total for _ in range(total)]
    source = int(data["source"])
    sink = int(data["sink"])
    for u, v, lo, hi in data["edges"]:
        u, v, lo, hi = int(u), int(v), int(lo), int(hi)
        if lo > hi:
            return False
        capacity[u][v] += hi - lo
        capacity[super_s][v] += lo
        capacity[u][super_t] += lo
    capacity[sink][source] += 10 ** 9
    required = sum(capacity[super_s])

    def maxflow():
        flow = 0
        while True:
            parent = [-1] * total
            parent[super_s] = super_s
            queue = deque([super_s])
            while queue and parent[super_t] == -1:
                u = queue.popleft()
                for v in range(total):
                    if parent[v] == -1 and capacity[u][v] > 0:
                        parent[v] = u
                        queue.append(v)
            if parent[super_t] == -1:
                return flow
            bottleneck = float("inf")
            v = super_t
            while v != super_s:
                u = parent[v]
                bottleneck = min(bottleneck, capacity[u][v])
                v = u
            v = super_t
            while v != super_s:
                u = parent[v]
                capacity[u][v] -= bottleneck
                capacity[v][u] += bottleneck
                v = u
            flow += bottleneck

    return maxflow() >= required
