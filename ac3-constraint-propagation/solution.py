from collections import deque


def solve(data):
    num_vars = int(data["num_vars"])
    domains = [list(d) for d in data["domains"]]
    neighbors = {}
    allowed = {}
    for x, y, pairs in data["constraints"]:
        x, y = int(x), int(y)
        pairs = [(int(a), int(b)) for a, b in pairs]
        allowed[(x, y)] = set(pairs)
        neighbors.setdefault(x, set()).add(y)
        neighbors.setdefault(y, set()).add(x)

    def compatible(x, a, y, b):
        if (x, y) in allowed:
            return (a, b) in allowed[(x, y)]
        return (b, a) in allowed.get((y, x), set())

    queue = deque()
    for x, y in allowed:
        queue.append((x, y))
        queue.append((y, x))
    consistent = True
    while queue:
        x, y = queue.popleft()
        revised = False
        for a in list(domains[x]):
            if not any(compatible(x, a, y, b) for b in domains[y]):
                domains[x].remove(a)
                revised = True
                if not domains[x]:
                    consistent = False
                    queue.clear()
                    break
        if not consistent:
            break
        if revised:
            for z in neighbors.get(x, ()):
                if z != y:
                    queue.append((z, x))
    return {"domains": [list(d) for d in domains], "consistent": consistent}
