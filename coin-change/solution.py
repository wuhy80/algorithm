def solve(data):
    amount = data["amount"]
    inf = amount + 1
    dp = [0] + [inf] * amount
    for current in range(1, amount + 1):
        for coin in data["coins"]:
            if coin <= current:
                dp[current] = min(dp[current], dp[current - coin] + 1)
    return -1 if dp[amount] == inf else dp[amount]
