def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    n, m = len(text), len(pattern)
    bad = {}
    for idx, ch in enumerate(pattern):
        bad[ch] = idx
    comparisons = 0
    i = 0
    while i + m <= n:
        j = m - 1
        while j >= 0:
            comparisons += 1
            if text[i + j] != pattern[j]:
                break
            j -= 1
        if j < 0:
            return {"index": i, "comparisons": comparisons}
        shift = j - bad.get(text[i + j], -1)
        i += max(1, shift)
    return {"index": -1, "comparisons": comparisons}
