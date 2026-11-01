from fractions import Fraction


def solve(data):
    segs = data["segments"]
    points = set()
    n = len(segs)
    for i in range(n):
        x1, y1, x2, y2 = segs[i]
        for j in range(i + 1, n):
            x3, y3, x4, y4 = segs[j]
            den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
            if den == 0:
                continue
            px = Fraction((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4), den)
            py = Fraction((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4), den)

            def on(xa, ya, xb, yb):
                return min(xa, xb) <= px <= max(xa, xb) and min(ya, yb) <= py <= max(ya, yb)

            if on(x1, y1, x2, y2) and on(x3, y3, x4, y4):
                points.add((px, py))
    return len(points)
