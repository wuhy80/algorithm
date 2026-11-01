def solve(data):
    base = int(data["base"]) % int(data["modulus"])
    exponent = int(data["exponent"])
    modulus = int(data["modulus"])
    result = 1 % modulus
    while exponent:
        if exponent & 1:
            result = result * base % modulus
        base = base * base % modulus
        exponent >>= 1
    return result
