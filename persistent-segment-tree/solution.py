def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    left = [0]
    right = [0]
    total = [0]

    def build(lo, hi):
        idx = len(total)
        left.append(0)
        right.append(0)
        total.append(0)
        if lo == hi:
            total[idx] = nums[lo]
            return idx
        mid = (lo + hi) // 2
        l = build(lo, mid)
        r = build(mid + 1, hi)
        left[idx] = l
        right[idx] = r
        total[idx] = total[l] + total[r]
        return idx

    versions = [build(0, n - 1)]

    def update(node, lo, hi, pos, v):
        idx = len(total)
        left.append(left[node])
        right.append(right[node])
        total.append(total[node])
        if lo == hi:
            total[idx] = v
            return idx
        mid = (lo + hi) // 2
        if pos <= mid:
            left[idx] = update(left[node], lo, mid, pos, v)
        else:
            right[idx] = update(right[node], mid + 1, hi, pos, v)
        total[idx] = total[left[idx]] + total[right[idx]]
        return idx

    def query(node, lo, hi, l, r):
        if node == 0 or r < lo or hi < l:
            return 0
        if l <= lo and hi <= r:
            return total[node]
        mid = (lo + hi) // 2
        return query(left[node], lo, mid, l, r) + query(right[node], mid + 1, hi, l, r)

    out = []
    for op in data["ops"]:
        if op[0] == "update":
            versions.append(update(versions[op[1]], 0, n - 1, op[2], op[3]))
        else:
            out.append(query(versions[op[1]], 0, n - 1, op[2], op[3]))
    return out
