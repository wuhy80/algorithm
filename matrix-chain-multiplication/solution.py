def solve(data):
    dimensions = data
    count = len(dimensions) - 1
    if count <= 1:
        return 0
    dp = [[0] * count for _ in range(count)]
    for length in range(2, count + 1):
        for left in range(count - length + 1):
            right = left + length - 1
            best = 10**30
            for middle in range(left, right):
                cost = dp[left][middle] + dp[middle + 1][right]
                cost += dimensions[left] * dimensions[middle + 1] * dimensions[right + 1]
                best = min(best, cost)
            dp[left][right] = best
    return dp[0][count - 1]
