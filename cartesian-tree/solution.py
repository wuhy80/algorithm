def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    parent = [-1] * n
    stack = []
    for i in range(n):
        last = -1
        while stack and nums[stack[-1]] > nums[i]:
            last = stack.pop()
        if stack:
            parent[i] = stack[-1]
        if last != -1:
            parent[last] = i
        stack.append(i)
    return parent
