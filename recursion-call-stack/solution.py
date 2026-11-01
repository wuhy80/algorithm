def solve(data):
    n = int(data["n"])
    mode = data["mode"]
    calls = [0]
    depth = [0]
    max_depth = [0]

    def rec(k):
        calls[0] += 1
        depth[0] += 1
        if depth[0] > max_depth[0]:
            max_depth[0] = depth[0]
        if mode == "factorial":
            value = 1 if k == 0 else k * rec(k - 1)
        else:
            value = 1 if k <= 1 else rec(k - 1) + rec(k - 2)
        depth[0] -= 1
        return value

    value = rec(n)
    return {"value": value, "calls": calls[0], "max_depth": max_depth[0]}
