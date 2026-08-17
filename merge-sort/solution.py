def solve(data):
    def merge_sort(values):
        if len(values) <= 1:
            return values
        middle = len(values) // 2
        left = merge_sort(values[:middle])
        right = merge_sort(values[middle:])
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i]); i += 1
            else:
                result.append(right[j]); j += 1
        return result + left[i:] + right[j:]
    return merge_sort(list(data))
