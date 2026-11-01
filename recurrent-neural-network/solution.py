import math

def solve(data):
    wx, wh, b = data["wx"], data["wh"], data["b"]
    seq = data["sequence"]
    hdim = len(b)
    h = [0.0] * hdim
    states = []
    for x in seq:
        nxt = []
        for j in range(hdim):
            s = b[j]
            for i in range(len(x)):
                s += wx[j][i] * x[i]
            for k in range(hdim):
                s += wh[j][k] * h[k]
            nxt.append(math.tanh(s))
        h = nxt
        states.append([round(v, 6) for v in h])
    return {"states": states}
