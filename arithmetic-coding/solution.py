from fractions import Fraction


def solve(data):
    freqs = data["freqs"]
    alphabet = sorted(freqs)
    total = sum(freqs[s] for s in alphabet)
    bounds = {}
    acc = Fraction(0)
    for s in alphabet:
        bounds[s] = (acc, acc + Fraction(freqs[s], total))
        acc = bounds[s][1]
    if data["mode"] == "encode":
        low, high = Fraction(0), Fraction(1)
        for ch in data["message"]:
            width = high - low
            lo, hi = bounds[ch]
            high = low + width * hi
            low = low + width * lo
        return {"low": [low.numerator, low.denominator], "high": [high.numerator, high.denominator]}
    num, den = data["value"]
    value = Fraction(num, den)
    length = int(data["length"])
    message = []
    for _ in range(length):
        for s in alphabet:
            lo, hi = bounds[s]
            if lo <= value < hi:
                message.append(s)
                value = (value - lo) / (hi - lo)
                break
    return message
