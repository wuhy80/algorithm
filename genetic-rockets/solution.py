def solve(data):
    population_size = int(data["population"])
    generations = int(data["generations"])
    state = int(data["seed"]) & 0xffffffff
    target = float(data["target"])

    def rand():
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xffffffff
        return state / 4294967296.0

    population = [-10.0 + 20.0 * rand() for _ in range(population_size)]
    for _ in range(generations):
        population.sort(key=lambda x: abs(x - target))
        parents = population[:population_size // 2]
        offspring = []
        for i in range(0, len(parents) - 1, 2):
            child = (parents[i] + parents[i + 1]) / 2.0
            if rand() < 0.3:
                child += (rand() - 0.5)
            offspring.append(child)
        while len(offspring) + len(parents) < population_size:
            offspring.append(parents[0])
        population = parents + offspring
    best = min(population, key=lambda x: abs(x - target))
    if abs(best - target) < 1e-9:
        best = target
    return {"best": round(best, 4)}
