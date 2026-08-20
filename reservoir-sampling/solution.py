def solve(data):
    stream, k = data["stream"], int(data["k"])
    reservoir = list(stream[:k])
    state = int(data["seed"]) & 0xffffffff
    for index in range(k, len(stream)):
        state = (state * 1664525 + 1013904223) & 0xffffffff
        chosen = state % (index + 1)
        if chosen < k:
            reservoir[chosen] = stream[index]
    return reservoir
