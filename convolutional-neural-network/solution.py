def solve(data):
    inp = data["input"]
    ker = data["kernel"]
    ih, iw = len(inp), len(inp[0])
    kh, kw = len(ker), len(ker[0])
    out = []
    for i in range(ih - kh + 1):
        row = []
        for j in range(iw - kw + 1):
            s = 0.0
            for ki in range(kh):
                for kj in range(kw):
                    s += inp[i + ki][j + kj] * ker[ki][kj]
            row.append(round(s, 6))
        out.append(row)
    return out
