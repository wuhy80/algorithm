from collections import deque


def solve(data):
    nums = list(data["nums"])
    k = int(data["k"])
    dq = deque()
    out = []
    for i, value in enumerate(nums):
        while dq and nums[dq[-1]] <= value:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out
