def solve(data):
    pts = data["points"]
    n = len(pts)
    if n == 1:
        return {"diameter2": 0}
    order = sorted(range(n), key=lambda i: (pts[i][0], pts[i][1], i))

    def cross(o, a, b):
        return (pts[a][0] - pts[o][0]) * (pts[b][1] - pts[o][1]) - (pts[a][1] - pts[o][1]) * (pts[b][0] - pts[o][0])

    lower = []
    for i in order:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], i) <= 0:
            lower.pop()
        lower.append(i)
    upper = []
    for i in reversed(order):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], i) <= 0:
            upper.pop()
        upper.append(i)
    hull = lower[:-1] + upper[:-1]
    m = len(hull)
    if m == 1:
        return {"diameter2": 0}
    if m == 2:
        a, b = hull
        return {"diameter2": (pts[a][0] - pts[b][0]) ** 2 + (pts[a][1] - pts[b][1]) ** 2}
    best = 0
    j = 1
    for i in range(m):
        ni = (i + 1) % m
        ex = pts[ni][0] - pts[i][0]
        ey = pts[ni][1] - pts[i][1]
        while True:
            nj = (j + 1) % m
            cj = abs(ex * (pts[hull[j]][1] - pts[i][1]) - ey * (pts[hull[j]][0] - pts[i][0]))
            cnj = abs(ex * (pts[hull[nj]][1] - pts[i][1]) - ey * (pts[hull[nj]][0] - pts[i][0]))
            if cnj > cj:
                j = nj
            else:
                break
        for a in (hull[i], hull[ni]):
            b = hull[j]
            d = (pts[a][0] - pts[b][0]) ** 2 + (pts[a][1] - pts[b][1]) ** 2
            if d > best:
                best = d
    return {"diameter2": best}
