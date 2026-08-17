def solve(data):
    nums, k = data["nums"], data["k"]
    if not nums or k == 0:
        return 0
    current = sum(nums[:k])
    best = current
    for right in range(k, len(nums)):
        current += nums[right] - nums[right - k]
        best = max(best, current)
    return best
