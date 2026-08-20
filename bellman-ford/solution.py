def solve(data):
    n = data["n"]
    inf = 10**18
    distance = [inf] * n
    distance[data["start"]] = 0
    for _ in range(n - 1):
        changed = False
        for start, end, weight in data["edges"]:
            if distance[start] == inf:
                continue
            candidate = distance[start] + weight
            if candidate < distance[end]:
                distance[end] = candidate
                changed = True
        if not changed:
            break
    answer = distance[data["target"]]
    return -1 if answer == inf else answer
