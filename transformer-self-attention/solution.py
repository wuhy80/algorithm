import math

def solve(data):
    q, k, v = data["q"], data["k"], data["v"]
    n = len(q)
    d = len(q[0])
    scale = math.sqrt(d)
    att_raw = []
    att = []
    for i in range(n):
        scores = []
        for j in range(n):
            s = sum(q[i][t] * k[j][t] for t in range(d)) / scale
            scores.append(s)
        mx = max(scores)
        exps = [math.exp(s - mx) for s in scores]
        total = sum(exps)
        raw = [e / total for e in exps]
        att_raw.append(raw)
        att.append([round(a, 6) for a in raw])
    out = []
    ncols = len(v[0])
    for i in range(n):
        row = []
        for c in range(ncols):
            s = sum(att_raw[i][j] * v[j][c] for j in range(n))
            row.append(round(s, 6))
        out.append(row)
    return {"attention": att, "output": out}
