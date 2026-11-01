def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    tree = [0] * (2 * n) if n else []
    for i in range(n):
        tree[n + i] = nums[i]
    for i in range(n - 1, 0, -1):
        tree[i] = tree[2 * i] + tree[2 * i + 1]
    out = []
    for op in data["ops"]:
        if op[0] == "update":
            pos = op[1] + n
            tree[pos] = op[2]
            pos >>= 1
            while pos:
                tree[pos] = tree[2 * pos] + tree[2 * pos + 1]
                pos >>= 1
        else:
            left = op[1] + n
            right = op[2] + n + 1
            total = 0
            while left < right:
                if left & 1:
                    total += tree[left]
                    left += 1
                if right & 1:
                    right -= 1
                    total += tree[right]
                left >>= 1
                right >>= 1
            out.append(total)
    return out
