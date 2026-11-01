def solve(data):
    x = 0
    modulus = 1
    for r, m in data["equations"]:
        r = int(r) % int(m)
        # x + k*modulus ≡ r (mod m)
        diff = (r - x) % m
        # 求 k ≡ diff * modulus^{-1} (mod m)
        inv = 1
        a, b = modulus % m, m
        old_s, s = 1, 0
        old_r2, r2 = a, b
        while r2:
            q = old_r2 // r2
            old_r2, r2 = r2, old_r2 - q * r2
            old_s, s = s, old_s - q * s
        inv = old_s % m
        k = diff * inv % m
        x = x + k * modulus
        modulus *= m
    return {"x": x % modulus, "modulus": modulus}
