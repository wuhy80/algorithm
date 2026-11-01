def solve(data):
    n = int(data["n"])
    results = []
    for k in range(n + 1):
        current = []

        def backtrack(start):
            if len(current) == k:
                results.append(current[:])
                return
            for value in range(start, n + 1):
                current.append(value)
                backtrack(value + 1)
                current.pop()

        backtrack(1)
    return results
