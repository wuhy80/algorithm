def solve(data):
    raw = {}
    for a, b in data["lines"]:
        a, b = int(a), int(b)
        if a not in raw or b < raw[a]:
            raw[a] = b
    lines = sorted(raw.items(), key=lambda kv: -kv[0])
    hull = []
    for a3, b3 in lines:
        while len(hull) >= 2:
            a1, b1 = hull[-2]
            a2, b2 = hull[-1]
            if (b2 - b1) * (a2 - a3) >= (b3 - b2) * (a1 - a2):
                hull.pop()
            else:
                break
        if hull and hull[-1][0] == a3:
            if hull[-1][1] <= b3:
                continue
            hull.pop()
        hull.append((a3, b3))

    def query(x):
        lo, hi = 0, len(hull) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            a1, b1 = hull[mid]
            a2, b2 = hull[mid + 1]
            if (b2 - b1) >= x * (a1 - a2):
                hi = mid
            else:
                lo = mid + 1
        a, b = hull[lo]
        return a * x + b

    return [query(int(x)) for x in data["queries"]]
