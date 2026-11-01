def solve(data):
    text = data["text"] + "$"
    n = len(text)
    rotations = sorted(text[i:] + text[:i] for i in range(n))
    bwt = "".join(rot[-1] for rot in rotations)
    alphabet = sorted(set(text))
    first = sorted(bwt)
    count_less = {}
    for c in alphabet:
        count_less[c] = sum(1 for ch in first if ch < c)
    occ = [{c: 0 for c in alphabet}]
    for ch in bwt:
        row = dict(occ[-1])
        row[ch] += 1
        occ.append(row)
    pattern = data["pattern"]
    top, bottom = 0, n - 1
    for ch in reversed(pattern):
        if ch not in count_less:
            return {"bwt": bwt, "occurrences": 0}
        top = count_less[ch] + occ[top][ch]
        bottom = count_less[ch] + occ[bottom + 1][ch] - 1
        if top > bottom:
            return {"bwt": bwt, "occurrences": 0}
    return {"bwt": bwt, "occurrences": bottom - top + 1}
