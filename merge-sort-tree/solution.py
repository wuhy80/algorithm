import bisect


def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    seg = [[] for _ in range(4 * n)]

    def build(node, lo, hi):
        if lo == hi:
            seg[node] = [nums[lo]]
            return
        mid = (lo + hi) // 2
        build(2 * node, lo, mid)
        build(2 * node + 1, mid + 1, hi)
        a, b = seg[2 * node], seg[2 * node + 1]
        merged = []
        i = j = 0
        while i < len(a) and j < len(b):
            if a[i] <= b[j]:
                merged.append(a[i])
                i += 1
            else:
                merged.append(b[j])
                j += 1
        merged.extend(a[i:])
        merged.extend(b[j:])
        seg[node] = merged

    build(1, 0, n - 1)
    out = []
    for l, r, x in data["queries"]:
        count = 0
        stack = [(1, 0, n - 1)]
        while stack:
            node, lo, hi = stack.pop()
            if r < lo or hi < l:
                continue
            if l <= lo and hi <= r:
                count += bisect.bisect_right(seg[node], x)
                continue
            mid = (lo + hi) // 2
            stack.append((2 * node, lo, mid))
            stack.append((2 * node + 1, mid + 1, hi))
        out.append(count)
    return out
