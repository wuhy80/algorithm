def solve(data):
    n = data["n"]
    if data["start"] == data["target"]:
        return 0
    graph = [[] for _ in range(n)]
    for left, right in data["edges"]:
        graph[left].append(right); graph[right].append(left)
    front, back = {data["start"]}, {data["target"]}
    distance_front = {data["start"]: 0}
    distance_back = {data["target"]: 0}
    while front and back:
        if len(front) > len(back):
            front, back = back, front
            distance_front, distance_back = distance_back, distance_front
        next_front = set()
        for node in front:
            for neighbor in graph[node]:
                if neighbor in distance_front:
                    continue
                if neighbor in distance_back:
                    return distance_front[node] + 1 + distance_back[neighbor]
                distance_front[neighbor] = distance_front[node] + 1
                next_front.add(neighbor)
        front = next_front
    return -1
