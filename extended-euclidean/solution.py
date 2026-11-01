def solve(data):
    a = int(data["a"])
    b = int(data["b"])
    original = a
    sign = 1
    if a < 0:
        sign = -1
        a = -a
    old_r, r = a, b
    old_s, s = 1, 0
    while r:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
    g = old_r
    x = old_s * sign
    if b == 0:
        return {"g": g, "x": sign, "y": 0}
    x %= b // g
    y = (g - original * x) // b
    return {"g": g, "x": x, "y": y}
