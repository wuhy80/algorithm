def solve(data):
    s = data["s"]
    if not s:
        return [0]
    t = "#" + "#".join(s) + "#"
    n = len(t)
    p = [0] * n
    center = right = 0
    for i in range(n):
        if i < right:
            p[i] = min(right - i, p[2 * center - i])
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        if i + p[i] > right:
            center = i
            right = i + p[i]
    return p
