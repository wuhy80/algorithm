def solve(data):
    s = data["s"]
    n = len(s)
    if n <= 1:
        return 0
    doubled = s + s
    i, j, k = 0, 1, 0
    while i < n and j < n and k < n:
        a = doubled[i + k]
        b = doubled[j + k]
        if a == b:
            k += 1
        elif a > b:
            i = i + k + 1
            if i <= j:
                i = j + 1
            k = 0
        else:
            j = j + k + 1
            if j <= i:
                j = i + 1
            k = 0
    return min(i, j)
