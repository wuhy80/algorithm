def solve(data):
    n = int(data["n"])
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            e = 0
            while n % d == 0:
                n //= d
                e += 1
            factors.append([d, e])
        d += 1 if d == 2 else 2
    if n > 1:
        factors.append([n, 1])
    return factors
