def solve(data):
    s = data["s"]
    n = len(s)
    if n == 0:
        return {"sa": [], "lcp": []}
    rank = [ord(c) for c in s]
    sa = list(range(n))
    k = 1
    while True:
        def key(i):
            return (rank[i], rank[i + k] if i + k < n else -1)
        sa.sort(key=key)
        new_rank = [0] * n
        for idx in range(1, n):
            new_rank[sa[idx]] = new_rank[sa[idx - 1]] + (1 if key(sa[idx]) != key(sa[idx - 1]) else 0)
        rank = new_rank
        if rank[sa[-1]] == n - 1:
            break
        k <<= 1
    pos_in_sa = [0] * n
    for r, suffix in enumerate(sa):
        pos_in_sa[suffix] = r
    lcp = [0] * n
    h = 0
    for i in range(n):
        if pos_in_sa[i] > 0:
            j = sa[pos_in_sa[i] - 1]
            while i + h < n and j + h < n and s[i + h] == s[j + h]:
                h += 1
            lcp[pos_in_sa[i]] = h
            if h:
                h -= 1
        else:
            h = 0
    return {"sa": sa, "lcp": lcp}
