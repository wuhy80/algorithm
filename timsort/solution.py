def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    if n < 2:
        return nums
    runs = []
    i = 0
    while i < n:
        run_start = i
        i += 1
        if i < n and nums[i] < nums[i - 1]:
            while i < n and nums[i] < nums[i - 1]:
                i += 1
            nums[run_start:i] = reversed(nums[run_start:i])
        while i < n and nums[i] >= nums[i - 1]:
            i += 1
        end = i
        while end - run_start < 32 and i < n:
            value = nums[i]
            j = i - 1
            while j >= run_start and nums[j] > value:
                nums[j + 1] = nums[j]
                j -= 1
            nums[j + 1] = value
            i += 1
            end = i
        runs.append((run_start, end))

    def merge(start, mid, end):
        left = nums[start:mid]
        right = nums[mid:end]
        i = j = 0
        k = start
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                nums[k] = left[i]
                i += 1
            else:
                nums[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            nums[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            nums[k] = right[j]
            j += 1
            k += 1

    while len(runs) > 1:
        start_a, end_a = runs[-2]
        start_b, end_b = runs[-1]
        merge(start_a, end_a, end_b)
        runs[-2:] = [(start_a, end_b)]
    return nums
