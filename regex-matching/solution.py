def solve(data):
    pattern = data["pattern"]
    text = data["text"]
    n, m = len(text), len(pattern)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(2, m + 1):
        if pattern[j - 1] == "*":
            dp[0][j] = dp[0][j - 2]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            pc = pattern[j - 1]
            if pc == "*":
                if j >= 2 and dp[i][j - 2]:
                    dp[i][j] = True
                elif j >= 2 and (pattern[j - 2] == "." or pattern[j - 2] == text[i - 1]) and dp[i - 1][j]:
                    dp[i][j] = True
            elif pc == "." or pc == text[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[n][m]
