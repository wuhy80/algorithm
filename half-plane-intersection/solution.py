def solve(data):
    EPS = 1e-9
    BIG = 1e6
    poly = [[-BIG, -BIG], [BIG, -BIG], [BIG, BIG], [-BIG, BIG]]

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
            if fp <= EPS:
                res.append([px, py])
            if (fp < -EPS and fq > EPS) or (fp > EPS and fq < -EPS):
                t = fp / (fp - fq)
                res.append([px + (qx - px) * t, py + (qy - py) * t])
        return res

    for a, b, c in data["halfplanes"]:
        poly = clip(poly, a, b, c)
        if not poly:
            break
    area = 0.0
    m = len(poly)
    for k in range(m):
        x1, y1 = poly[k]
        x2, y2 = poly[(k + 1) % m]
        area += x1 * y2 - x2 * y1
    area = abs(area) / 2.0
    return {"nonempty": m >= 3 and area > EPS, "area": round(area, 3)}
