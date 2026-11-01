def solve(data):
    s = data["s"]
    n = len(s)
    out = []
    i = 0
    while i < n:
        j = i + 1
        k = i
        while j < n and s[k] <= s[j]:
            if s[k] == s[j]:
                k += 1
            else:
                k = i
            j += 1
        while i <= k:
            out.append(j - k)
            i += j - k
    return out
