def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    table = [list(nums)]
    k = 1
    while (1 << k) <= n:
        prev = table[k - 1]
        half = 1 << (k - 1)
        table.append([min(prev[i], prev[i + half]) for i in range(n - (1 << k) + 1)])
        k += 1
    out = []
    for l, r in data["queries"]:
        level = (r - l + 1).bit_length() - 1
        out.append(min(table[level][l], table[level][r - (1 << level) + 1]))
    return out
