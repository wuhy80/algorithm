import math


def solve(data):
    points = [(p[0], p[1]) for p in data["points"]]
    capacity = int(data["capacity"])
    n = len(points)
    by_x = sorted(points, key=lambda p: (p[0], p[1]))
    slices = [by_x[i * capacity:(i + 1) * capacity] for i in range(math.ceil(n / capacity))]
    leaves = []
    for slice_pts in slices:
        by_y = sorted(slice_pts, key=lambda p: (p[1], p[0]))
        for start in range(0, len(by_y), capacity):
            group = by_y[start:start + capacity]
            xs = [p[0] for p in group]
            ys = [p[1] for p in group]
            leaves.append([min(xs), min(ys), max(xs), max(ys)])
    return {"leaves": leaves, "leaf_count": len(leaves)}
