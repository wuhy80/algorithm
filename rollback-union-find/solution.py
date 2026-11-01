def solve(data):
    n = int(data["n"])
    parent = list(range(n))
    size = [1] * n
    history = []
    checkpoints = []

    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x

    out = []
    for op in data["ops"]:
        kind = op[0]
        if kind == "union":
            a, b = find(op[1]), find(op[2])
            if a == b:
                continue
            if size[a] < size[b]:
                a, b = b, a
            parent[b] = a
            size[a] += size[b]
            history.append(b)
        elif kind == "connected":
            out.append(find(op[1]) == find(op[2]))
        elif kind == "checkpoint":
            checkpoints.append(len(history))
        else:
            target = checkpoints.pop() if checkpoints else 0
            while len(history) > target:
                b = history.pop()
                size[parent[b]] -= size[b]
                parent[b] = b
    return out
