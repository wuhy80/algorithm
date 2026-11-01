def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    seg = [0] * (4 * n)
    lazy = [0] * (4 * n)

    def build(node, lo, hi):
        if lo == hi:
            seg[node] = nums[lo]
            return
        mid = (lo + hi) // 2
        build(2 * node, lo, mid)
        build(2 * node + 1, mid + 1, hi)
        seg[node] = seg[2 * node] + seg[2 * node + 1]

    def push_down(node, lo, mid, hi):
        if lazy[node]:
            left_len = mid - lo + 1
            right_len = hi - mid
            seg[2 * node] += lazy[node] * left_len
            lazy[2 * node] += lazy[node]
            seg[2 * node + 1] += lazy[node] * right_len
            lazy[2 * node + 1] += lazy[node]
            lazy[node] = 0

    def update(node, lo, hi, l, r, v):
        if r < lo or hi < l:
            return
        if l <= lo and hi <= r:
            seg[node] += v * (hi - lo + 1)
            lazy[node] += v
            return
        mid = (lo + hi) // 2
        push_down(node, lo, mid, hi)
        update(2 * node, lo, mid, l, r, v)
        update(2 * node + 1, mid + 1, hi, l, r, v)
        seg[node] = seg[2 * node] + seg[2 * node + 1]

    def query(node, lo, hi, l, r):
        if r < lo or hi < l:
            return 0
        if l <= lo and hi <= r:
            return seg[node]
        mid = (lo + hi) // 2
        push_down(node, lo, mid, hi)
        return query(2 * node, lo, mid, l, r) + query(2 * node + 1, mid + 1, hi, l, r)

    build(1, 0, n - 1)
    out = []
    for op in data["ops"]:
        if op[0] == "add":
            update(1, 0, n - 1, op[1], op[2], op[3])
        else:
            out.append(query(1, 0, n - 1, op[1], op[2]))
    return out
