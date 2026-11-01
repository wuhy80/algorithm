def solve(data):
    n = int(data["n"])
    results = []
    current = []

    def backtrack(open_count, close_count):
        if len(current) == 2 * n:
            results.append("".join(current))
            return
        if open_count < n:
            current.append("(")
            backtrack(open_count + 1, close_count)
            current.pop()
        if close_count < open_count:
            current.append(")")
            backtrack(open_count, close_count + 1)
            current.pop()

    backtrack(0, 0)
    return results
