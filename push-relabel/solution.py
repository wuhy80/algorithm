def solve(data):
    n = int(data["n"])
    capacity = [[0] * n for _ in range(n)]
    for u, v, c in data["edges"]:
        capacity[int(u)][int(v)] += int(c)
    source = int(data["source"])
    sink = int(data["sink"])
    height = [0] * n
    excess = [0] * n
    height[source] = n
    for v in range(n):
        if capacity[source][v] > 0:
            excess[v] = capacity[source][v]
            excess[source] -= capacity[source][v]
            capacity[v][source] += capacity[source][v]
            capacity[source][v] = 0
    queue = [v for v in range(n) if v not in (source, sink) and excess[v] > 0]
    in_queue = set(queue)
    head = 0
    while head < len(queue):
        u = queue[head]
        head += 1
        in_queue.discard(u)
        while excess[u] > 0:
            pushed = False
            for v in range(n):
                if capacity[u][v] > 0 and height[u] == height[v] + 1:
                    amount = min(excess[u], capacity[u][v])
                    capacity[u][v] -= amount
                    capacity[v][u] += amount
                    excess[u] -= amount
                    excess[v] += amount
                    pushed = True
                    if v not in (source, sink) and v not in in_queue:
                        queue.append(v)
                        in_queue.add(v)
                    if excess[u] == 0:
                        break
            if excess[u] == 0:
                break
            lowest = None
            for v in range(n):
                if capacity[u][v] > 0:
                    if lowest is None or height[v] < lowest:
                        lowest = height[v]
            height[u] = lowest + 1
    return excess[sink]
