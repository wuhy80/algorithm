def solve(data):
    n = int(data["n"])
    weights = [[0] * n for _ in range(n)]
    for u, v, w in data["edges"]:
        weights[int(u)][int(v)] += int(w)
        weights[int(v)][int(u)] += int(w)
    active = list(range(n))
    best = None
    for _ in range(n - 1):
        first = active[0]
        in_set = {first}
        sel = {u: weights[first][u] for u in active[1:]}
        prev = first
        last = first
        while len(in_set) < len(active):
            pick = None
            pick_val = None
            for u in active:
                if u in in_set:
                    continue
                val = sel.get(u, 0)
                if pick is None or val > pick_val:
                    pick = u
                    pick_val = val
            in_set.add(pick)
            for u in active:
                if u not in in_set:
                    sel[u] = sel.get(u, 0) + weights[pick][u]
            prev = last
            last = pick
        cut = sel.get(last, 0)
        if best is None or cut < best:
            best = cut
        active.remove(last)
        for u in active:
            if u != prev:
                weights[prev][u] += weights[last][u]
                weights[u][prev] += weights[u][last]
    return best
