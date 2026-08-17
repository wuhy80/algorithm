def solve(data):
    values = list(data)

    def sift(root, size):
        while root * 2 + 1 < size:
            child = root * 2 + 1
            if child + 1 < size and values[child] < values[child + 1]:
                child += 1
            if values[root] >= values[child]:
                return
            values[root], values[child] = values[child], values[root]
            root = child

    for root in range(len(values) // 2 - 1, -1, -1):
        sift(root, len(values))
    for end in range(len(values) - 1, 0, -1):
        values[0], values[end] = values[end], values[0]
        sift(0, end)
    return values
