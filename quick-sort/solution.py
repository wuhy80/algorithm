def solve(data):
    values = list(data)

    def quick(left, right):
        if left >= right:
            return
        pivot = values[(left + right) // 2]
        i, j = left, right
        while i <= j:
            while values[i] < pivot: i += 1
            while values[j] > pivot: j -= 1
            if i <= j:
                values[i], values[j] = values[j], values[i]
                i += 1; j -= 1
        quick(left, j)
        quick(i, right)

    quick(0, len(values) - 1)
    return values
