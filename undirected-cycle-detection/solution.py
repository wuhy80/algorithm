def solve(data):
    n = int(data["n"])
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x

    for u, v in data["edges"]:
        ru, rv = find(int(u)), find(int(v))
        if ru == rv:
            return True
        parent[ru] = rv
    return False
