def solve(data):
    out = []
    for q in data["queries"]:
        m = int(q)
        result = m
        n = m
        p = 2
        while p * p <= n:
            if n % p == 0:
                while n % p == 0:
                    n //= p
                result -= result // p
            p += 1 if p == 2 else 2
        if n > 1:
            result -= result // n
        out.append(result)
    return out
