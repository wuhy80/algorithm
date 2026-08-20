from collections import deque

def solve(data):
    n = data["n"]
    graph = [[] for _ in range(n)]
    def add_edge(left, right, capacity, cost):
        graph[left].append([right, capacity, cost, len(graph[right])])
        graph[right].append([left, 0, -cost, len(graph[left]) - 1])
    for left, right, capacity, cost in data["edges"]:
        add_edge(left, right, capacity, cost)
    source, sink = data["source"], data["sink"]
    flow = total_cost = 0
    while True:
        distance = [10**18] * n
        previous = [None] * n
        distance[source] = 0
        queue = deque([source]); in_queue = [False] * n; in_queue[source] = True
        while queue:
            node = queue.popleft(); in_queue[node] = False
            for index, (neighbor, capacity, cost, _) in enumerate(graph[node]):
                if capacity <= 0 or distance[neighbor] <= distance[node] + cost:
                    continue
                distance[neighbor] = distance[node] + cost
                previous[neighbor] = (node, index)
                if not in_queue[neighbor]:
                    queue.append(neighbor); in_queue[neighbor] = True
        if previous[sink] is None:
            break
        amount = 10**18; node = sink
        while node != source:
            parent, index = previous[node]
            amount = min(amount, graph[parent][index][1]); node = parent
        node = sink
        while node != source:
            parent, index = previous[node]
            edge = graph[parent][index]
            reverse = edge[3]
            edge[1] -= amount
            graph[node][reverse][1] += amount
            total_cost += amount * edge[2]
            node = parent
        flow += amount
    return [flow, total_cost]
