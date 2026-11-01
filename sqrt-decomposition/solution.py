def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n == 0:
        return []
    block = max(1, int(n ** 0.5))
    block_count = (n + block - 1) // block
    block_sum = [0] * block_count
    block_lazy = [0] * block_count
    for b in range(block_count):
        total = 0
        for i in range(b * block, min(n, (b + 1) * block)):
            total += nums[i]
        block_sum[b] = total

    def range_add(l, r, v):
        b1, b2 = l // block, r // block
        if b1 == b2:
            for i in range(l, r + 1):
                nums[i] += v
            block_sum[b1] += v * (r - l + 1)
            return
        for i in range(l, (b1 + 1) * block):
            nums[i] += v
        block_sum[b1] += v * ((b1 + 1) * block - l)
        for b in range(b1 + 1, b2):
            block_lazy[b] += v
            block_sum[b] += v * min(block, n - b * block)
        for i in range(b2 * block, r + 1):
            nums[i] += v
        block_sum[b2] += v * (r - b2 * block + 1)

    def range_sum(l, r):
        b1, b2 = l // block, r // block
        total = 0
        if b1 == b2:
            for i in range(l, r + 1):
                total += nums[i] + block_lazy[b1]
            return total
        for i in range(l, (b1 + 1) * block):
            total += nums[i] + block_lazy[b1]
        for b in range(b1 + 1, b2):
            total += block_sum[b]
        for i in range(b2 * block, r + 1):
            total += nums[i] + block_lazy[b2]
        return total

    out = []
    for op in data["ops"]:
        if op[0] == "add":
            range_add(op[1], op[2], op[3])
        else:
            out.append(range_sum(op[1], op[2]))
    return out
