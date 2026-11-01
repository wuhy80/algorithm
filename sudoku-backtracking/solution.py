def solve(data):
    grid = [list(row) for row in data["grid"]]
    n = len(grid)
    box = max(1, int(n ** 0.5))

    def initial_valid():
        for r in range(n):
            for c in range(n):
                value = grid[r][c]
                if value == 0:
                    continue
                for i in range(n):
                    if i != c and grid[r][i] == value:
                        return False
                    if i != r and grid[i][c] == value:
                        return False
                br, bc = r - r % box, c - c % box
                for i in range(br, br + box):
                    for j in range(bc, bc + box):
                        if (i, j) != (r, c) and grid[i][j] == value:
                            return False
        return True

    def placeable(r, c, value):
        for i in range(n):
            if grid[r][i] == value or grid[i][c] == value:
                return False
        br, bc = r - r % box, c - c % box
        for i in range(br, br + box):
            for j in range(bc, bc + box):
                if grid[i][j] == value:
                    return False
        return True

    def backtrack():
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    for value in range(1, n + 1):
                        if placeable(r, c, value):
                            grid[r][c] = value
                            result = backtrack()
                            if result is not None:
                                return result
                            grid[r][c] = 0
                    return None
        return [row[:] for row in grid]

    if not initial_valid():
        return None
    return backtrack()
