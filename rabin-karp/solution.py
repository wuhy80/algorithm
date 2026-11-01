def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    n, m = len(text), len(pattern)
    if m == 0 or m > n:
        return []
    base = 131
    modulus = 1000000007
    pattern_hash = 0
    for ch in pattern:
        pattern_hash = (pattern_hash * base + ord(ch)) % modulus
    top_power = pow(base, m - 1, modulus)
    window_hash = 0
    for ch in text[:m]:
        window_hash = (window_hash * base + ord(ch)) % modulus
    out = []
    for start in range(n - m + 1):
        if window_hash == pattern_hash and text[start:start + m] == pattern:
            out.append(start)
        if start + m < n:
            window_hash = ((window_hash - ord(text[start]) * top_power) * base + ord(text[start + m])) % modulus
    return out
