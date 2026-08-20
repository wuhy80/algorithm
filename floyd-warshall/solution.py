def solve(data):
    matrix = data
    n = len(matrix)
    inf = 10**18
    distance = [[inf if value == -1 else value for value in row] for row in matrix]
    for node in range(n):
        distance[node][node] = 0
    for middle in range(n):
        for left in range(n):
            if distance[left][middle] == inf:
                continue
            for right in range(n):
                candidate = distance[left][middle] + distance[middle][right]
                if candidate < distance[left][right]:
                    distance[left][right] = candidate
    return [[-1 if value == inf else value for value in row] for row in distance]
