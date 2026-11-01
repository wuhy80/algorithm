def solve(data):
    LO, HI = -100, 100
    tree = [None] * (4 * (HI - LO + 1))

    def better(line, other, x):
        if line is None:
            return False
        if other is None:
            return True
        return line[0] * x + line[1] < other[0] * x + other[1]

    def insert(node, lo, hi, line):
        if line is None:
            return
        mid = (lo + hi) // 2
        if better(line, tree[node], mid):
            tree[node], line = line, tree[node]
        if lo == hi:
            return
        if better(line, tree[node], lo):
            insert(2 * node, lo, mid, line)
        else:
            insert(2 * node + 1, mid + 1, hi, line)

    def query(node, lo, hi, x):
        best = None
        if tree[node] is not None:
            best = tree[node][0] * x + tree[node][1]
        if lo == hi:
            return best
        mid = (lo + hi) // 2
        if x <= mid:
            child = query(2 * node, lo, mid, x)
        else:
            child = query(2 * node + 1, mid + 1, hi, x)
        if child is not None and (best is None or child < best):
            best = child
        return best

    for a, b in data["lines"]:
        insert(1, LO, HI, [a, b])
    return [query(1, LO, HI, x) for x in data["queries"]]
