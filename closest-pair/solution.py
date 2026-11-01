def solve(data):
    pts = data["points"]
    n = len(pts)
    if n < 2:
        return {"distance2": None, "pair": []}
    order = sorted(range(n), key=lambda i: (pts[i][0], pts[i][1], i))

    def dist2(i, j):
        dx = pts[i][0] - pts[j][0]
        dy = pts[i][1] - pts[j][1]
        return dx * dx + dy * dy

    best = None

    def rec(lo, hi):
        nonlocal best
        if hi - lo <= 3:
            for a in range(lo, hi):
                for b in range(a + 1, hi):
                    d = dist2(order[a], order[b])
                    if best is None or d < best:
                        best = d
            return
        mid = (lo + hi) // 2
        rec(lo, mid)
        rec(mid, hi)
        midx = pts[order[mid]][0]
        strip = [order[k] for k in range(lo, hi) if (pts[order[k]][0] - midx) ** 2 < best]
        strip.sort(key=lambda i: (pts[i][1], pts[i][0], i))
        for a in range(len(strip)):
            for b in range(a + 1, len(strip)):
                if (pts[strip[b]][1] - pts[strip[a]][1]) ** 2 >= best:
                    break
                d = dist2(strip[a], strip[b])
                if d < best:
                    best = d

    rec(0, n)
    pair = None
    xs = order
    for a in range(n):
        i = xs[a]
        for b in range(a + 1, n):
            j = xs[b]
            dx = pts[j][0] - pts[i][0]
            if dx * dx > best:
                break
            if dist2(i, j) == best:
                cand = (i, j) if i < j else (j, i)
                if pair is None or cand < pair:
                    pair = cand
    return {"distance2": best, "pair": [pair[0], pair[1]]}
