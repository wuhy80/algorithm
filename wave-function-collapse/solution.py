def solve(data):
    cols = int(data["cols"])
    rows = int(data["rows"])
    state = int(data["seed"]) & 0xffffffff
    tiles = list(range(4))
    grid = [[None] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            candidates = list(tiles)
            if r > 0:
                above = grid[r - 1][c]
                below_of_above = (above >> 2) & 1
                candidates = [t for t in candidates if (t & 1) == below_of_above]
            if c > 0:
                left = grid[r][c - 1]
                right_of_left = (left >> 1) & 1
                candidates = [t for t in candidates if ((t >> 3) & 1) == right_of_left]
            if not candidates:
                return [[-1] * cols for _ in range(rows)]
            state = (state * 1664525 + 1013904223) & 0xffffffff
            grid[r][c] = candidates[state % len(candidates)]
    return grid
