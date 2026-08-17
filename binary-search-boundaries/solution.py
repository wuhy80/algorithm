def solve(data):
    nums, target = data["nums"], data["target"]

    def lower(value):
        left, right = 0, len(nums)
        while left < right:
            middle = (left + right) // 2
            if nums[middle] < value:
                left = middle + 1
            else:
                right = middle
        return left

    first = lower(target)
    if first == len(nums) or nums[first] != target:
        return [-1, -1]
    return [first, lower(target + 1) - 1]
