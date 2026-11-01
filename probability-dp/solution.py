def solve(data):
    n = int(data["n"])
    m = int(data["m"])
    prob = [0.0] * n
    prob[0] = 1.0
    for _ in range(m):
        nxt = [0.0] * n
        for j in range(n):
            if prob[j] == 0.0:
                continue
            nxt[(j + 1) % n] += prob[j] / 2.0
            nxt[(j - 1) % n] += prob[j] / 2.0
        prob = nxt
    return round(prob[0], 6)
