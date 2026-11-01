def solve(data):
    rows = int(data["rows"])
    cols = int(data["cols"])
    steps = int(data["steps"])
    F, k, Du, Dv, dt = 0.055, 0.062, 0.16, 0.08, 1.0
    U = [[0.0] * cols for _ in range(rows)]
    V = [[0.25] * cols for _ in range(rows)]
    for r in range(rows // 2 - 1, rows // 2 + 1):
        for c in range(cols // 2 - 1, cols // 2 + 1):
            U[r][c] = 0.5
    for _ in range(steps):
        new_u = [row[:] for row in U]
        new_v = [row[:] for row in V]
        for r in range(1, rows - 1):
            for c in range(1, cols - 1):
                lap_u = U[r - 1][c] + U[r + 1][c] + U[r][c - 1] + U[r][c + 1] - 4.0 * U[r][c]
                lap_v = V[r - 1][c] + V[r + 1][c] + V[r][c - 1] + V[r][c + 1] - 4.0 * V[r][c]
                uvv = U[r][c] * V[r][c] * V[r][c]
                new_u[r][c] = U[r][c] + dt * (Du * lap_u - uvv + F * (1.0 - U[r][c]))
                new_v[r][c] = V[r][c] + dt * (Dv * lap_v + uvv - (F + k) * V[r][c])
        U, V = new_u, new_v
    return [[round(U[r][c], 3) for c in range(cols)] for r in range(rows)]
