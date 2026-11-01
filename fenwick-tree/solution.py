def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    tree = [0] * (n + 1)

    def add(i, v):
        i += 1
        while i <= n:
            tree[i] += v
            i += i & (-i)

    def prefix(i):
        i += 1
        total = 0
        while i > 0:
            total += tree[i]
            i -= i & (-i)
        return total

    for i, v in enumerate(nums):
        add(i, v)
    out = []
    for op in data["ops"]:
        if op[0] == "add":
            add(op[1], op[2])
        else:
            out.append(prefix(op[1]))
    return out
