def solve(data):
    values = list(data["nums"])
    state = int(data["seed"]) & 0xffffffff
    for index in range(len(values) - 1, 0, -1):
        state = (state * 1664525 + 1013904223) & 0xffffffff
        chosen = state % (index + 1)
        values[index], values[chosen] = values[chosen], values[index]
    return values
