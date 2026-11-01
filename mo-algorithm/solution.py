def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    queries = list(data["queries"])
    if not queries or n == 0:
        return [0] * len(queries)
    block = max(1, int(n ** 0.5))
    order = sorted(
        range(len(queries)),
        key=lambda i: (
            queries[i][0] // block,
            queries[i][1] if (queries[i][0] // block) % 2 == 0 else -queries[i][1],
        ),
    )
    count = {}
    cur_l, cur_r = 0, -1
    distinct = 0
    out = [0] * len(queries)
    for i in order:
        l, r = queries[i]
        while cur_r < r:
            cur_r += 1
            v = nums[cur_r]
            c = count.get(v, 0)
            if c == 0:
                distinct += 1
            count[v] = c + 1
        while cur_r > r:
            v = nums[cur_r]
            c = count[v] - 1
            count[v] = c
            if c == 0:
                distinct -= 1
            cur_r -= 1
        while cur_l < l:
            v = nums[cur_l]
            c = count[v] - 1
            count[v] = c
            if c == 0:
                distinct -= 1
            cur_l += 1
        while cur_l > l:
            cur_l -= 1
            v = nums[cur_l]
            c = count.get(v, 0)
            if c == 0:
                distinct += 1
            count[v] = c + 1
        out[i] = distinct
    return out
