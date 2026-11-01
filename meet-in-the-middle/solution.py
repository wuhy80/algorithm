import bisect


def solve(data):
    nums = [int(v) for v in data["nums"]]
    target = int(data["target"])
    half = len(nums) // 2
    left = nums[:half]
    right = nums[half:]

    def subset_sums(arr):
        sums = [0]
        for value in arr:
            sums += [s + value for s in sums]
        return sums

    left_sums = subset_sums(left)
    right_sums = sorted(subset_sums(right))
    total = 0
    for s in left_sums:
        lo = bisect.bisect_left(right_sums, target - s)
        hi = bisect.bisect_right(right_sums, target - s)
        total += hi - lo
    return total
