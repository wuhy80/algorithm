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
    w1 = [row[:] for row in data["weights1"]]
    b1 = data["bias1"][:]
    w2 = [row[:] for row in data["weights2"]]
    b2 = data["bias2"][:]
    label = data["label"]
    lr = float(data["lr"])
    nin = len(x)
    nhid = len(w1)
    nout = len(w2)
    h_pre = []
    for j in range(nhid):
        h_pre.append(sum(w1[j][i] * x[i] for i in range(nin)) + b1[j])
    h = [p if p > 0 else 0.0 for p in h_pre]
    o = []
    for k in range(nout):
        pre = sum(w2[k][j] * h[j] for j in range(nhid)) + b2[k]
        o.append(sig(pre))
    d_out = [(o[k] - label[k]) * o[k] * (1.0 - o[k]) / nout for k in range(nout)]
    new_w2 = []
    new_b2 = []
    for k in range(nout):
        new_w2.append([w2[k][j] - lr * d_out[k] * h[j] for j in range(nhid)])
        new_b2.append(b2[k] - lr * d_out[k])
    new_w1 = []
    new_b1 = []
    for j in range(nhid):
        back = sum(d_out[k] * w2[k][j] for k in range(nout))
        gate = 1.0 if h_pre[j] > 0 else 0.0
        dh = back * gate
        new_w1.append([w1[j][i] - lr * dh * x[i] for i in range(nin)])
        new_b1.append(b1[j] - lr * dh)
    return {
        "weights1": r6(new_w1),
        "bias1": r6(new_b1),
        "weights2": r6(new_w2),
        "bias2": r6(new_b2),
    }
