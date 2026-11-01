def solve(data):
    points = [(float(p[0]), float(p[1])) for p in data["points"]]
    xmin, ymin, xmax, ymax = data["bounds"]
    iterations = int(data["iterations"])
    BIG = 1e6
    poly = [
        [max(xmin, -BIG), max(ymin, -BIG)],
        [min(xmax, BIG), max(ymin, -BIG)],
        [min(xmax, BIG), min(ymax, BIG)],
        [max(xmin, -BIG), min(ymax, BIG)],
    ]

    def clip(poly, a, b, c):
        if not poly:
            return []
        res = []
        m = len(poly)
        for k in range(m):
            px, py = poly[k]
            qx, qy = poly[(k + 1) % m]
            fp = a * px + b * py - c
            fq = a * qx + b * qy - c
            if fp <= 1e-9:
                res.append([px, py])
            if (fp < -1e-9 and fq > 1e-9) or (fp > 1e-9 and fq < -1e-9):
                t = fp / (fp - fq)
                res.append([px + (qx - px) * t, py + (qy - py) * t])
        return res

    def centroid(poly, fallback):
        area = 0.0
        cx = 0.0
        cy = 0.0
        m = len(poly)
        for k in range(m):
            x1, y1 = poly[k]
            x2, y2 = poly[(k + 1) % m]
            cr = x1 * y2 - x2 * y1
            area += cr
            cx += (x1 + x2) * cr
            cy += (y1 + y2) * cr
        if abs(area) < 1e-9:
            return fallback
        return (cx / (3.0 * area), cy / (3.0 * area))

    sites = list(points)
    for _ in range(iterations):
        moved = []
        for i, (xi, yi) in enumerate(sites):
            cell = [list(v) for v in poly]
            for j, (xj, yj) in enumerate(sites):
                if j == i:
                    continue
                a = 2 * (xj - xi)
                b = 2 * (yj - yi)
                c = xj * xj + yj * yj - xi * xi - yi * yi
                cell = clip(cell, a, b, c)
            gx, gy = centroid(cell, (xi, yi))
            moved.append((round(gx, 3), round(gy, 3)))
        sites = moved
    return [[x, y] for x, y in sites]
