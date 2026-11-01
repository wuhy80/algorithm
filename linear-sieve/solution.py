def solve(data):
    n = int(data["n"])
    spf = [0] * (n + 1)
    primes = []
    for i in range(2, n + 1):
        if spf[i] == 0:
            spf[i] = i
            primes.append(i)
        for p in primes:
            if p > spf[i] or i * p > n:
                break
            spf[i * p] = p
    out = []
    for m in data["queries"]:
        out.append(spf[int(m)] if int(m) >= 2 else None)
    return {"count": len(primes), "spf": out}
