from collections import deque


def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    tr, tc = int(data["target"][0]), int(data["target"][1])
    dist = [[None] * cols for _ in range(rows)]
    dist[tr][tc] = 0
    queue = deque([(tr, tc)])
    while queue:
        r, c = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and dist[nr][nc] is None:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    field = [[None] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1 or dist[r][c] is None:
                continue
            if (r, c) == (tr, tc):
                field[r][c] = [0, 0]
                continue
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] is not None and dist[nr][nc] < dist[r][c]:
                    field[r][c] = [dr, dc]
                    break
    return field
