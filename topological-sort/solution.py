import heapq

def solve(data):
    graph = {node: [] for node in data["nodes"]}
    indegree = {node: 0 for node in data["nodes"]}
    for start, end in data["edges"]:
        graph[start].append(end); indegree[end] += 1
    heap = [node for node in data["nodes"] if indegree[node] == 0]
    heapq.heapify(heap); order = []
    while heap:
        node = heapq.heappop(heap); order.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0: heapq.heappush(heap, neighbor)
    return order if len(order) == len(data["nodes"]) else []
