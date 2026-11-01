import math

def sig(t):
    if t >= 0:
        return 1.0 / (1.0 + math.exp(-t))
    e = math.exp(t)
    return e / (1.0 + e)

def r6(v):
    if isinstance(v, list):
        return [r6(x) for x in v]
    return round(v, 6)

def solve(data):
    x = data["input"]
    hidden = []
    for row, bj in zip(data["weights1"], data["bias1"]):
        pre = sum(row[i] * x[i] for i in range(len(x))) + bj
        hidden.append(pre if pre > 0 else 0.0)
    output = []
    for row, bj in zip(data["weights2"], data["bias2"]):
        pre = sum(row[j] * hidden[j] for j in range(len(hidden))) + bj
        output.append(sig(pre))
    return {"hidden": r6(hidden), "output": r6(output)}
