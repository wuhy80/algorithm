def solve(data):
    dist = data["dist"]
    n = len(dist)
    ants = int(data["ants"])
    iterations = int(data["iterations"])
    state = int(data["seed"]) & 0xffffffff

    def rand():
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xffffffff
        return state / 4294967296.0

    pheromone = [[1.0] * n for _ in range(n)]
    best_tour = None
    best_length = None
    for _ in range(iterations):
        all_tours = []
        for _ in range(ants):
            start_city = 0
            visited = [False] * n
            visited[0] = True
            tour = [start_city]
            current = 0
            for _ in range(n - 1):
                weights = []
                for nxt in range(n):
                    if visited[nxt]:
                        weights.append(0.0)
                    else:
                        weights.append(pheromone[current][nxt] * (1.0 / max(dist[current][nxt], 1e-9)) ** 3)
                total = sum(weights)
                pick = rand() * total
                acc = 0.0
                chosen = n - 1
                for idx, w in enumerate(weights):
                    acc += w
                    if w > 0 and acc >= pick:
                        chosen = idx
                        break
                visited[chosen] = True
                tour.append(chosen)
                current = chosen
            tour.append(0)
            length = sum(dist[tour[i]][tour[i + 1]] for i in range(n))
            all_tours.append((tour, length))
        for i in range(n):
            for j in range(n):
                pheromone[i][j] *= 0.5
        for tour, length in all_tours:
            deposit = 1.0 / length
            for i in range(n):
                a, b = tour[i], tour[i + 1]
                pheromone[a][b] += deposit
                pheromone[b][a] += deposit
        for tour, length in all_tours:
            if best_length is None or length < best_length:
                best_length = length
                best_tour = tour
    return {"tour": best_tour, "length": round(best_length, 4)}
