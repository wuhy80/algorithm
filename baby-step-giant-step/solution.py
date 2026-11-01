def solve(data):
    modulus = int(data["modulus"])
    base = int(data["base"]) % modulus
    target = int(data["target"]) % modulus
    if target == 1 % modulus:
        return 0
    if base == 0:
        return 1 if target == 0 else -1
    step = int(modulus ** 0.5) + 1
    table = {}
    baby = 1
    for j in range(step):
        table[target * baby % modulus] = j
        baby = baby * base % modulus
    giant = 1
    for i in range(1, step + 1):
        giant = giant * baby % modulus
        if giant in table:
            return i * step - table[giant]
    return -1
