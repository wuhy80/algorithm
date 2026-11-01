def solve(data):
    points = [tuple(float(v) for v in p) for p in data["points"]]
    capacity = int(data["capacity"])
    stats = {"leaf_count": 0, "total_nodes": 0, "max_depth": 0}

    def build(bounds, pts, depth):
        stats["total_nodes"] += 1
        stats["max_depth"] = max(stats["max_depth"], depth)
        if len(pts) <= capacity:
            stats["leaf_count"] += 1
            return
        minx, miny, minz, maxx, maxy, maxz = bounds
        cx, cy, cz = (minx + maxx) / 2, (miny + maxy) / 2, (minz + maxz) / 2
        octants = [[] for _ in range(8)]
        for x, y, z in pts:
            idx = (1 if x >= cx else 0) * 4 + (1 if y >= cy else 0) * 2 + (1 if z >= cz else 0)
            octants[idx].append((x, y, z))
        sub_bounds = [
            (minx, miny, minz, cx, cy, cz),
            (minx, miny, cz, cx, cy, maxz),
            (minx, cy, minz, cx, maxy, cz),
            (minx, cy, cz, cx, maxy, maxz),
            (cx, miny, minz, maxx, cy, cz),
            (cx, miny, cz, maxx, cy, maxz),
            (cx, cy, minz, maxx, maxy, cz),
            (cx, cy, cz, maxx, maxy, maxz),
        ]
        for qb, qp in zip(sub_bounds, octants):
            if qp:
                build(qb, qp, depth + 1)

    build(tuple(float(v) for v in data["bounds"]), points, 0)
    return stats
