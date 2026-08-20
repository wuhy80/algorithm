def solve(data):
    values = list(data)
    temp = [0] * len(values)

    def merge_sort(left, right):
        if right - left <= 1:
            return 0
        middle = (left + right) // 2
        count = merge_sort(left, middle) + merge_sort(middle, right)
        i, j, cursor = left, middle, left
        while i < middle and j < right:
            if values[i] <= values[j]:
                temp[cursor] = values[i]; i += 1
            else:
                temp[cursor] = values[j]; j += 1
                count += middle - i
            cursor += 1
        while i < middle:
            temp[cursor] = values[i]; i += 1; cursor += 1
        while j < right:
            temp[cursor] = values[j]; j += 1; cursor += 1
        values[left:right] = temp[left:right]
        return count

    return merge_sort(0, len(values))
