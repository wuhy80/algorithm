def solve(data):
    nums = list(data["nums"])
    n = len(nums)
    limit = 2 * max(1, n.bit_length())

    def insertion(lo, hi):
        for i in range(lo + 1, hi + 1):
            value = nums[i]
            j = i - 1
            while j >= lo and nums[j] > value:
                nums[j + 1] = nums[j]
                j -= 1
            nums[j + 1] = value

    def heapsort(lo, hi):
        size = hi - lo + 1

        def sift(start, end):
            root = start
            while root * 2 + 1 <= end:
                child = root * 2 + 1
                if child + 1 <= end and nums[lo + child] < nums[lo + child + 1]:
                    child += 1
                if nums[lo + root] < nums[lo + child]:
                    nums[lo + root], nums[lo + child] = nums[lo + child], nums[lo + root]
                    root = child
                else:
                    return

        end = size - 1
        start = (size - 2) // 2
        while start >= 0:
            sift(start, end)
            start -= 1
        while end > 0:
            nums[lo], nums[lo + end] = nums[lo + end], nums[lo]
            end -= 1
            sift(0, end)

    def partition(lo, hi):
        mid = (lo + hi) // 2
        a, b, c = nums[lo], nums[mid], nums[hi]
        pivot = sorted([a, b, c])[1]
        i = lo
        for j in range(lo, hi + 1):
            if nums[j] < pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        return i

    def quick(lo, hi, depth):
        while lo < hi:
            if hi - lo + 1 <= 16:
                insertion(lo, hi)
                return
            if depth == 0:
                heapsort(lo, hi)
                return
            depth -= 1
            split = partition(lo, hi)
            quick(lo, split - 1, depth)
            lo = split

    quick(0, n - 1, limit)
    return nums
