def solve(data):
    steps = int(data["steps"])
    xs = 0.0
    for _ in range(steps):
        g = 2.0 * (xs - 3.0)
        xs -= 0.1 * g
    xm = 0.0
    v = 0.0
    for _ in range(steps):
        g = 2.0 * (xm - 3.0)
        v = 0.9 * v + 0.1 * g
        xm -= v
    return {"sgd_x": round(xs, 6), "momentum_x": round(xm, 6)}
