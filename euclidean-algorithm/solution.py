def solve(data):
    a = int(data["a"])
    b = int(data["b"])
    if a == 0 or b == 0:
        return {"gcd": a + b, "quotients": [], "steps": 0}
    quotients = []
    big, small = max(a, b), min(a, b)
    steps = 0
    while small:
        quotients.append(big // small)
        big, small = small, big % small
        steps += 1
    return {"gcd": big, "quotients": quotients, "steps": steps}
