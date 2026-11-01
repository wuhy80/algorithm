def solve(data):
    n = int(data["n"])
    k = int(data["k"])
    results = []
    current = []

    def backtrack(start):
        if len(current) == k:
            results.append(current[:])
            return
        if n - start + 1 < k - len(current):
            return
        for value in range(start, n + 1):
            current.append(value)
            backtrack(value + 1)
            current.pop()

    backtrack(1)
    return results
