def solve(data):
    nums = list(data["nums"])
    k = int(data["k"])

    def select(arr, target):
        if len(arr) <= 5:
            return sorted(arr)[target]
        groups = [sorted(arr[i:i + 5])[len(arr[i:i + 5]) // 2] for i in range(0, len(arr), 5)]
        pivot = select(groups, len(groups) // 2)
        smaller = [v for v in arr if v < pivot]
        equal = [v for v in arr if v == pivot]
        larger = [v for v in arr if v > pivot]
        if target < len(smaller):
            return select(smaller, target)
        if target < len(smaller) + len(equal):
            return pivot
        return select(larger, target - len(smaller) - len(equal))

    return select(nums, k - 1)
