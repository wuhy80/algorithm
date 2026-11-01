import bisect


def solve(data):
    intervals = [(int(s), int(e), int(w), i) for i, (s, e, w) in enumerate(data["intervals"])]
    order = sorted(intervals, key=lambda x: (x[1], x[0], x[3]))
    n = len(order)
    ends = [x[1] for x in order]
    dp = [0] * (n + 1)
    take = [False] * n
    for idx, (s, e, w, original) in enumerate(order):
        p = bisect.bisect_right(ends, s, 0, idx)
        take_from = w + dp[p]
        skip = dp[idx]
        if take_from > skip:
            dp[idx + 1] = take_from
            take[idx] = True
        else:
            dp[idx + 1] = skip
    chosen = []
    idx = n - 1
    while idx >= 0:
        if take[idx]:
            chosen.append(order[idx][3])
            s = order[idx][0]
            idx = bisect.bisect_right(ends, s, 0, idx) - 1
        else:
            idx -= 1
    return {"total": dp[n], "chosen": sorted(chosen)}
