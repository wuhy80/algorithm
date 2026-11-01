def solve(data):
    stones = [int(v) for v in data["stones"]]
    n = len(stones)
    if n == 1:
        return 0
    prefix = [0]
    for v in stones:
        prefix.append(prefix[-1] + v)

    def cost(i, j):
        return prefix[j + 1] - prefix[i]

    INF = float("inf")
    dp = [[0] * n for _ in range(n)]
    opt = [[0] * n for _ in range(n)]
    for i in range(n):
        opt[i][i] = i
    for length in range(2, n + 1):
        for i in range(0, n - length + 1):
            j = i + length - 1
            dp[i][j] = INF
            lo = opt[i][j - 1]
            hi = opt[i + 1][j] if i + 1 < j else j - 1
            for split in range(lo, hi + 1):
                candidate = dp[i][split] + dp[split + 1][j] + cost(i, j)
                if candidate < dp[i][j]:
                    dp[i][j] = candidate
                    opt[i][j] = split
    return dp[0][n - 1]
