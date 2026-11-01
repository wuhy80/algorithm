def solve(data):
    lo = int(data["lo"])
    hi = int(data["hi"])
    limit = int(hi ** 0.5) + 1
    base_is_composite = [False] * (limit + 1)
    base_primes = []
    for p in range(2, limit + 1):
        if not base_is_composite[p]:
            base_primes.append(p)
            for multiple in range(p * p, limit + 1, p):
                base_is_composite[multiple] = True
    size = hi - lo + 1
    marked = [False] * size
    for p in base_primes:
        start = max(p * p, ((lo + p - 1) // p) * p)
        for multiple in range(start, hi + 1, p):
            marked[multiple - lo] = True
    count = 0
    for offset in range(size):
        value = lo + offset
        if value >= 2 and not marked[offset]:
            count += 1
    return count
