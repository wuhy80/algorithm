import heapq

def solve(data):
    graph = [[] for _ in range(data["n"])]
    for left, right, weight in data["edges"]:
        graph[left].append((weight, right))
        graph[right].append((weight, left))
    visited = [False] * data["n"]
    heap, total, used = [(0, 0)], 0, 0
    while heap:
        weight, node = heapq.heappop(heap)
        if visited[node]:
            continue
        visited[node] = True
        total += weight
        used += 1
        for next_weight, neighbor in graph[node]:
            if not visited[neighbor]:
                heapq.heappush(heap, (next_weight, neighbor))
    return total if used == data["n"] else -1
