def solve(data):
    words = data["words"]
    queries = data["queries"]
    pairs = []
    for word in words:
        h1 = 0
        h2 = 0
        for ch in word:
            h1 = (h1 * 131 + ord(ch)) % 1000000007
            h2 = (h2 * 137 + ord(ch)) % 998244353
        pairs.append((h1, h2))
    out = []
    for i, j in queries:
        a, b = words[i], words[j]
        if pairs[i] == pairs[j] and a == b:
            out.append(True)
        else:
            out.append(False)
    return out
