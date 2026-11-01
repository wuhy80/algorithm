def solve(data):
    pts = data["points"]
    n = len(pts)
    if n < 3:
        return []
    minx = min(p[0] for p in pts)
    maxx = max(p[0] for p in pts)
    miny = min(p[1] for p in pts)
    maxy = max(p[1] for p in pts)
    dmax = max(maxx - minx, maxy - miny, 1) * 10
    midx = (minx + maxx) / 2
    midy = (miny + maxy) / 2
    all_pts = [(float(p[0]), float(p[1])) for p in pts]
    all_pts.append((midx - dmax, midy - dmax))
    all_pts.append((midx + dmax, midy - dmax))
    all_pts.append((midx, midy + dmax))
    triangles = [(n, n + 1, n + 2)]

    def in_circle(tri, px, py):
        ax, ay = all_pts[tri[0]]
        bx, by = all_pts[tri[1]]
        cx, cy = all_pts[tri[2]]
        adx, ady = ax - px, ay - py
        bdx, bdy = bx - px, by - py
        cdx, cdy = cx - px, cy - py
        adet = adx * adx + ady * ady
        bdet = bdx * bdx + bdy * bdy
        cdet = cdx * cdx + cdy * cdy
        det = adx * (bdy * cdet - bdet * cdy) - ady * (bdx * cdet - bdet * cdx) + adet * (bdx * cdy - bdy * cdx)
        return det > 1e-12

    for i in range(n):
        px, py = all_pts[i]
        bad = [t for t in triangles if in_circle(t, px, py)]
        bad_set = set(bad)
        edge_count = {}
        edge_direction = {}
        for t in bad:
            for a, b in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
                key = (a, b) if a < b else (b, a)
                edge_count[key] = edge_count.get(key, 0) + 1
                edge_direction[key] = (a, b)
        triangles = [t for t in triangles if t not in bad_set]
        for key, cnt in edge_count.items():
            if cnt == 1:
                a, b = edge_direction[key]
                triangles.append((a, b, i))
    result = sorted(sorted(t) for t in triangles if all(v < n for v in t))
    return result
