import math


def solve(data):
    points = [float(v) for v in data["points"]]
    n = len(points)
    out = []
    for k in range(n):
        re = 0.0
        im = 0.0
        for t, v in enumerate(points):
            ang = -2.0 * math.pi * k * t / n
            re += v * math.cos(ang)
            im += v * math.sin(ang)
        out.append([round(re), round(im)])
    return out
