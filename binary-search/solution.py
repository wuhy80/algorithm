def solve(data):
    nums, target = data["nums"], data["target"]
    left, right = 0, len(nums) - 1
    while left <= right:
        middle = left + (right - left) // 2
        if nums[middle] == target:
            return middle
        if nums[middle] < target:
            left = middle + 1
        else:
            right = middle - 1
    return -1
