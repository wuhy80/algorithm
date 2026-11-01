import math


def solve(data):
    positions = [[float(p[0]), float(p[1])] for p in data["positions"]]
    velocities = [[float(v[0]), float(v[1])] for v in data["velocities"]]
    radius = float(data["radius"])
    max_speed = float(data["max_speed"])
    count = len(positions)
    new_velocities = []
    for i in range(count):
        vx, vy = velocities[i]
        neighbors = [j for j in range(count) if j != i and math.dist(positions[i], positions[j]) <= radius]
        if neighbors:
            align_x = sum(velocities[j][0] for j in neighbors) / len(neighbors)
            align_y = sum(velocities[j][1] for j in neighbors) / len(neighbors)
            center_x = sum(positions[j][0] for j in neighbors) / len(neighbors)
            center_y = sum(positions[j][1] for j in neighbors) / len(neighbors)
            vx += 0.05 * (align_x - vx)
            vy += 0.05 * (align_y - vy)
            vx += 0.005 * (center_x - positions[i][0])
            vy += 0.005 * (center_y - positions[i][1])
            for j in neighbors:
                dist = math.dist(positions[i], positions[j])
                if 0 < dist < 2:
                    push = (2 - dist) / 2
                    vx += (positions[i][0] - positions[j][0]) / dist * push * 1.5
                    vy += (positions[i][1] - positions[j][1]) / dist * push * 1.5
        speed = math.hypot(vx, vy)
        if speed > max_speed:
            vx = vx / speed * max_speed
            vy = vy / speed * max_speed
        new_velocities.append([vx, vy])
    new_positions = [[positions[i][0] + new_velocities[i][0], positions[i][1] + new_velocities[i][1]] for i in range(count)]
    return {
        "velocities": [[round(v[0], 3), round(v[1], 3)] for v in new_velocities],
        "positions": [[round(p[0], 3), round(p[1], 3)] for p in new_positions],
    }
