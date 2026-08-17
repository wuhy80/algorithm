def solve(data):
    if not data or not data[0] or data[0][0] == 1:
        return 0
    dp = [0] * len(data[0])
    dp[0] = 1
    for row in data:
        for column, blocked in enumerate(row):
            if blocked:
                dp[column] = 0
            elif column:
                dp[column] += dp[column - 1]
    return dp[-1]
