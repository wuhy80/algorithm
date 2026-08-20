import heapq

def solve(data):
    graph = [[] for _ in range(data["n"])]
    for start, end, weight in data["edges"]:
        graph[start].append((end, weight))
    inf = 10**18
    distance = [inf] * data["n"]
    source, target = data["start"], data["target"]
    distance[source] = 0
    heap = [(0, source)]
    while heap:
        current, node = heapq.heappop(heap)
        if current != distance[node]:
            continue
        if node == target:
            return current
        for neighbor, weight in graph[node]:
            candidate = current + weight
            if candidate < distance[neighbor]:
                distance[neighbor] = candidate
                heapq.heappush(heap, (candidate, neighbor))
    return -1
