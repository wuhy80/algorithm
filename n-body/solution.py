import math


def solve(data):
    positions = [[float(p[0]), float(p[1])] for p in data["positions"]]
    velocities = [[float(v[0]), float(v[1])] for v in data["velocities"]]
    masses = [float(m) for m in data["masses"]]
    dt = float(data["dt"])
    G = float(data["G"])
    n = len(positions)
    ax = [0.0] * n
    ay = [0.0] * n
    for i in range(n):
        for j in range(i + 1, n):
            dx = positions[j][0] - positions[i][0]
            dy = positions[j][1] - positions[i][1]
            r2 = dx * dx + dy * dy
            r = math.sqrt(r2)
            if r == 0:
                continue
            f = G * masses[i] * masses[j] / (r2 * r)
            ax[i] += f * dx / masses[i]
            ay[i] += f * dy / masses[i]
            ax[j] -= f * dx / masses[j]
            ay[j] -= f * dy / masses[j]
    for i in range(n):
        velocities[i][0] += ax[i] * dt
        velocities[i][1] += ay[i] * dt
        positions[i][0] += velocities[i][0] * dt
        positions[i][1] += velocities[i][1] * dt
    return {
        "velocities": [[round(v[0], 6), round(v[1], 6)] for v in velocities],
        "positions": [[round(p[0], 6), round(p[1], 6)] for p in positions],
    }
