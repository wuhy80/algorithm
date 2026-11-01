def solve(data):
    grid = [list(row) for row in data["grid"]]
    rows, cols = len(grid), len(grid[0])
    generations = int(data["generations"])
    for _ in range(generations):
        nxt = [[0] * cols for _ in range(rows)]
        for r in range(rows):
            for c in range(cols):
                count = 0
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        if dr == 0 and dc == 0:
                            continue
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols:
                            count += grid[nr][nc]
                if grid[r][c] == 1:
                    nxt[r][c] = 1 if count in (2, 3) else 0
                else:
                    nxt[r][c] = 1 if count == 3 else 0
        grid = nxt
    return grid
