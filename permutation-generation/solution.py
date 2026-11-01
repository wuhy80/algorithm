def solve(data):
    nums = sorted(data["nums"])
    n = len(nums)
    used = [False] * n
    results = []
    current = []

    def backtrack():
        if len(current) == n:
            results.append(current[:])
            return
        for i in range(n):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            used[i] = True
            current.append(nums[i])
            backtrack()
            current.pop()
            used[i] = False

    backtrack()
    return results
