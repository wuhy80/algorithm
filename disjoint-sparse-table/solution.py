def solve(data):
    words = list(data["words"])
    n = len(words)
    if n == 0:
        return []
    levels = {}
    j = 0
    while (1 << j) < n:
        size = 1 << (j + 1)
        suf = [None] * n
        pre = [None] * n
        start = 0
        while start < n:
            end = min(start + size, n)
            mid = start + (size >> 1)
            if mid < end:
                acc = ""
                for i in range(mid - 1, start - 1, -1):
                    acc = words[i] + acc
                    suf[i] = acc
                acc = ""
                for i in range(mid, end):
                    acc = acc + words[i]
                    pre[i] = acc
            start += size
        levels[j] = (suf, pre)
        j += 1
    out = []
    for l, r in data["queries"]:
        if l == r:
            out.append(words[l])
            continue
        j = (l ^ r).bit_length() - 1
        suf, pre = levels[j]
        out.append(suf[l] + pre[r])
    return out
