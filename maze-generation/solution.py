def solve(data):
    rows = int(data["rows"])
    cols = int(data["cols"])
    state = int(data["seed"]) & 0xffffffff
    height, width = 2 * rows + 1, 2 * cols + 1
    grid = [[1] * width for _ in range(height)]
    grid[1][1] = 0
    visited = [[False] * cols for _ in range(rows)]
    visited[0][0] = True
    stack = [(0, 0)]
    directions = ((-1, 0), (1, 0), (0, -1), (0, 1))
    while stack:
        r, c = stack[-1]
        candidates = []
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                candidates.append((nr, nc, dr, dc))
        if not candidates:
            stack.pop()
            continue
        state = (state * 1664525 + 1013904223) & 0xffffffff
        nr, nc, dr, dc = candidates[state % len(candidates)]
        grid[2 * r + 1 + dr][2 * c + 1 + dc] = 0
        grid[2 * nr + 1][2 * nc + 1] = 0
        visited[nr][nc] = True
        stack.append((nr, nc))
    return grid
