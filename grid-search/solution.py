from collections import deque


def solve(data):
    grid = data["grid"]
    rows, cols = len(grid), len(grid[0])
    sr, sc = int(data["start"][0]), int(data["start"][1])
    tr, tc = int(data["target"][0]), int(data["target"][1])
    if (sr, sc) == (tr, tc):
        return 0
    visited = [[False] * cols for _ in range(rows)]
    visited[sr][sc] = True
    queue = deque([(sr, sc, 0)])
    while queue:
        r, c, d = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] == 0:
                if (nr, nc) == (tr, tc):
                    return d + 1
                visited[nr][nc] = True
                queue.append((nr, nc, d + 1))
    return -1
