def solve(data):
    points = [(float(p[0]), float(p[1])) for p in data["points"]]
    capacity = int(data["capacity"])
    stats = {"leaf_count": 0, "total_nodes": 0, "max_depth": 0}

    def build(bounds, pts, depth):
        stats["total_nodes"] += 1
        stats["max_depth"] = max(stats["max_depth"], depth)
        if len(pts) <= capacity:
            stats["leaf_count"] += 1
            return
        minx, miny, maxx, maxy = bounds
        cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
        quadrants = [[] for _ in range(4)]
        for x, y in pts:
            idx = (1 if x >= cx else 0) * 2 + (1 if y >= cy else 0)
            quadrants[idx].append((x, y))
        sub_bounds = [
            (minx, miny, cx, cy),
            (minx, cy, cx, maxy),
            (cx, miny, maxx, cy),
            (cx, cy, maxx, maxy),
        ]
        for qb, qp in zip(sub_bounds, quadrants):
            if qp:
                build(qb, qp, depth + 1)

    build(tuple(float(v) for v in data["bounds"]), points, 0)
    return stats
