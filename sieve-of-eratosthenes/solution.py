def solve(data):
    n = int(data["n"])
    if n < 2:
        return {"count": 0, "primes_last10": []}
    is_composite = [False] * (n + 1)
    primes = []
    for p in range(2, n + 1):
        if not is_composite[p]:
            primes.append(p)
            for multiple in range(p * p, n + 1, p):
                is_composite[multiple] = True
    return {"count": len(primes), "primes_last10": primes[-10:]}
