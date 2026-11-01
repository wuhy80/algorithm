def solve(data):
    dist = data["dist"]
    n = len(dist)
    full = 1 << n
    INF = float("inf")
    dp = [[INF] * n for _ in range(full)]
    dp[1][0] = 0
    for subset in range(1, full):
        if not subset & 1:
            continue
        for last in range(n):
            if dp[subset][last] == INF or not subset & (1 << last):
                continue
            for nxt in range(1, n):
                if subset & (1 << nxt):
                    continue
                new_subset = subset | (1 << nxt)
                candidate = dp[subset][last] + dist[last][nxt]
                if candidate < dp[new_subset][nxt]:
                    dp[new_subset][nxt] = candidate
    best = min(dp[full - 1][j] + dist[j][0] for j in range(1, n)) if n > 1 else 0
    return best
