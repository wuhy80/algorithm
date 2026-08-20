def solve(data):
    capacity = data["capacity"]
    dp = [0] * (capacity + 1)
    for weight, value in zip(data["weights"], data["values"]):
        for current in range(capacity, weight - 1, -1):
            dp[current] = max(dp[current], dp[current - weight] + value)
    return dp[capacity]
