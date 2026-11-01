def solve(data):
    pts = data["points"]
    n = len(pts)
    order = sorted(range(n), key=lambda i: (pts[i][0], pts[i][1], i))
    if n <= 2:
        return order

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
    start = min(range(len(hull)), key=lambda k: (pts[hull[k]][1], pts[hull[k]][0], hull[k]))
    return hull[start:] + hull[:start]
