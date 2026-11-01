def solve(data):
    count = int(data["particles"])
    iterations = int(data["iterations"])
    state = int(data["seed"]) & 0xffffffff

    def rand():
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xffffffff
        return state / 4294967296.0

    positions = [-10.0 + 20.0 * rand() for _ in range(count)]
    velocities = [0.0] * count
    personal = positions[:]
    best_global = min(positions, key=lambda x: (x - 3.0) ** 2)
    for _ in range(iterations):
        for i in range(count):
            r1 = rand()
            r2 = rand()
            velocities[i] = 0.7 * velocities[i] + 1.5 * r1 * (personal[i] - positions[i]) + 1.5 * r2 * (best_global - positions[i])
            positions[i] = max(-10.0, min(10.0, positions[i] + velocities[i]))
            if (positions[i] - 3.0) ** 2 < (personal[i] - 3.0) ** 2:
                personal[i] = positions[i]
            if (positions[i] - 3.0) ** 2 < (best_global - 3.0) ** 2:
                best_global = positions[i]
    best_value = (best_global - 3.0) ** 2
    if best_value < 1e-9:
        best_global = 3.0
        best_value = 0.0
    return {"best_x": round(best_global, 4), "best_value": round(best_value, 4)}
