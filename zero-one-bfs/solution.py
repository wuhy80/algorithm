from collections import deque

def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    start, target = tuple(data["start"]), tuple(data["target"])
    inf = 10**9
    distance = [[inf] * cols for _ in range(rows)]
    distance[start[0]][start[1]] = 0
    queue = deque([start])
    while queue:
        row, col = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = row + dr, col + dc
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            cost = grid[nr][nc]
            candidate = distance[row][col] + cost
            if candidate >= distance[nr][nc]:
                continue
            distance[nr][nc] = candidate
            if cost == 0:
                queue.appendleft((nr, nc))
            else:
                queue.append((nr, nc))
    answer = distance[target[0]][target[1]]
    return -1 if answer == inf else answer
