def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    NEG = float("-inf")
    mx = [NEG] * (4 * n)
    cnt = [0] * (4 * n)
    second = [NEG] * (4 * n)
    lazy = [None] * (4 * n)

    def pull(node):
        a, b = 2 * node, 2 * node + 1
        if mx[a] == mx[b]:
            mx[node] = mx[a]
            cnt[node] = cnt[a] + cnt[b]
            second[node] = max(second[a], second[b])
        elif mx[a] > mx[b]:
            mx[node] = mx[a]
            cnt[node] = cnt[a]
            second[node] = max(second[a], mx[b])
        else:
            mx[node] = mx[b]
            cnt[node] = cnt[b]
            second[node] = max(second[b], mx[a])

    def build(node, lo, hi):
        if lo == hi:
            mx[node] = nums[lo]
            cnt[node] = 1
            return
        mid = (lo + hi) // 2
        build(2 * node, lo, mid)
        build(2 * node + 1, mid + 1, hi)
        pull(node)

    def push_down(node):
        if lazy[node] is None:
            return
        apply_chmin(2 * node, lazy[node])
        apply_chmin(2 * node + 1, lazy[node])
        lazy[node] = None

    def apply_chmin(node, x):
        if x >= mx[node]:
            return
        if second[node] < x:
            mx[node] = x
            lazy[node] = x if lazy[node] is None else min(lazy[node], x)
            return
        push_down(node)
        apply_chmin(2 * node, x)
        apply_chmin(2 * node + 1, x)
        pull(node)

    def chmin(node, lo, hi, l, r, x):
        if r < lo or hi < l or x >= mx[node]:
            return
        if l <= lo and hi <= r:
            apply_chmin(node, x)
            return
        push_down(node)
        mid = (lo + hi) // 2
        chmin(2 * node, lo, mid, l, r, x)
        chmin(2 * node + 1, mid + 1, hi, l, r, x)
        pull(node)

    def query_max(node, lo, hi, l, r):
        if r < lo or hi < l:
            return NEG
        if l <= lo and hi <= r:
            return mx[node]
        push_down(node)
        mid = (lo + hi) // 2
        return max(query_max(2 * node, lo, mid, l, r), query_max(2 * node + 1, mid + 1, hi, l, r))

    build(1, 0, n - 1)
    out = []
    for op in data["ops"]:
        if op[0] == "chmin":
            chmin(1, 0, n - 1, op[1], op[2], op[3])
        else:
            out.append(query_max(1, 0, n - 1, op[1], op[2]))
    return out
