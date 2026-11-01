def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    values = sorted(set(nums))
    rank = {v: i for i, v in enumerate(values)}
    bits = max(1, (len(values) - 1).bit_length())
    cur = [rank[v] for v in nums]
    layers = []
    for b in range(bits - 1, -1, -1):
        bit_arr = [(x >> b) & 1 for x in cur]
        zeros = [0]
        for v in bit_arr:
            zeros.append(zeros[-1] + (1 - v))
        layers.append((bit_arr, zeros))
        zero_total = zeros[-1]
        nxt = [0] * n
        zi = 0
        oi = zero_total
        for i, v in enumerate(bit_arr):
            if v == 0:
                nxt[zi] = cur[i]
                zi += 1
            else:
                nxt[oi] = cur[i]
                oi += 1
        cur = nxt
    out = []
    for l, r, k in data["queries"]:
        lo, hi = l, r + 1
        k -= 1
        for bit_arr, zeros in layers:
            zero_total = zeros[-1]
            zeros_in = zeros[hi] - zeros[lo]
            if k < zeros_in:
                lo, hi = zeros[lo], zeros[hi]
            else:
                k -= zeros_in
                lo = zero_total + (lo - zeros[lo])
                hi = zero_total + (hi - zeros[hi])
        out.append(values[cur[lo]])
    return out
