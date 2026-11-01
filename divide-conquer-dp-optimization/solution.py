def solve(data):
    array = [int(v) for v in data["array"]]
    n = len(array)
    k = int(data["k"])
    prefix = [0]
    for v in array:
        prefix.append(prefix[-1] + v)

    def cost(i, j):
        total = prefix[j] - prefix[i]
        return total * total

    INF = float("inf")
    dp = [cost(0, j) for j in range(n + 1)]
    dp[0] = 0
    for seg in range(2, k + 1):
        new_dp = [INF] * (n + 1)
        new_dp[0] = 0

        def compute(lo, hi, opt_lo, opt_hi):
            if lo > hi:
                return
            mid = (lo + hi) // 2
            best = INF
            best_opt = opt_lo
            for split in range(opt_lo, min(mid, opt_hi) + 1):
                if dp[split] == INF:
                    continue
                candidate = dp[split] + cost(split, mid)
                if candidate < best:
                    best = candidate
                    best_opt = split
            new_dp[mid] = best
            compute(lo, mid - 1, opt_lo, best_opt)
            compute(mid + 1, hi, best_opt, opt_hi)

        compute(1, n, 0, n - 1)
        dp = new_dp
    return dp[n]
