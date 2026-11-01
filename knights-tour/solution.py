def solve(data):
    n = int(data["n"])
    sr, sc = int(data["start"][0]), int(data["start"][1])
    moves = ((1, 2), (2, 1), (2, -1), (1, -2), (-1, -2), (-2, -1), (-2, 1), (-1, 2))

    def onward(r, c):
        count = 0
        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                count += 1
        return count

    visited = [[False] * n for _ in range(n)]
    tour = []
    r, c = sr, sc
    for step in range(n * n):
        visited[r][c] = True
        tour.append([r, c])
        best = None
        best_count = 9
        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                count = onward(nr, nc)
                if count < best_count:
                    best_count = count
                    best = (nr, nc)
        if best is None:
            break
        r, c = best
    if len(tour) == n * n:
        return tour
    return None
