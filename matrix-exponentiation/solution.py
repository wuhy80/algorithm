def solve(data):
    modulus = int(data["modulus"])
    k = len(data["matrix"])
    base = [[v % modulus for v in row] for row in data["matrix"]]
    exponent = int(data["exponent"])
    result = [[1 % modulus if i == j else 0 for j in range(k)] for i in range(k)]

    def multiply(a, b):
        out = [[0] * k for _ in range(k)]
        for r in range(k):
            for c in range(k):
                total = 0
                for t in range(k):
                    total += a[r][t] * b[t][c]
                out[r][c] = total % modulus
        return out

    while exponent:
        if exponent & 1:
            result = multiply(result, base)
        base = multiply(base, base)
        exponent >>= 1
    return result
