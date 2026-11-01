import heapq


def solve(data):
    n = int(data["n"])
    edges = [(int(u), int(v), int(w)) for u, v, w in data["edges"]]
    h = [0] * n
    for _ in range(n):
        updated = False
        for u, v, w in edges:
            if h[u] + w < h[v]:
                h[v] = h[u] + w
                updated = True
        if not updated:
            break
    distances = {}
    for s, t in data["queries"]:
        s, t = int(s), int(t)
        dist = [None] * n
        dist[s] = 0
        heap = [(0, s)]
        while heap:
            d, u = heapq.heappop(heap)
            if dist[u] is not None and d > dist[u]:
                continue
            for eu, ev, ew in edges:
                if eu != u:
                    continue
                nd = d + ew + h[u] - h[ev]
                if dist[ev] is None or nd < dist[ev]:
                    dist[ev] = nd
                    heapq.heappush(heap, (nd, ev))
        if dist[t] is None:
            distances[f"{s},{t}"] = None
        else:
            distances[f"{s},{t}"] = dist[t] - h[s] + h[t]
    return {"distances": distances}
