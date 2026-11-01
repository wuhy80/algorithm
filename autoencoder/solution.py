import math

def sig(t):
    if t >= 0:
        return 1.0 / (1.0 + math.exp(-t))
    e = math.exp(t)
    return e / (1.0 + e)

def solve(data):
    x = data["input"]
    we, be = data["w_enc"], data["b_enc"]
    wd, bd = data["w_dec"], data["b_dec"]
    code = []
    for row, bj in zip(we, be):
        code.append(sig(sum(row[i] * x[i] for i in range(len(x))) + bj))
    recon = []
    for row, bj in zip(wd, bd):
        recon.append(sig(sum(row[j] * code[j] for j in range(len(code))) + bj))
    err = sum((recon[i] - x[i]) ** 2 for i in range(len(x))) / len(x)
    return {
        "code": [round(c, 6) for c in code],
        "reconstruction": [round(r, 6) for r in recon],
        "reconstruction_error": round(err, 6),
    }
