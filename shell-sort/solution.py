def solve(data):
    values = list(data)
    gap = len(values) // 2
    while gap:
        for start in range(gap):
            for index in range(start + gap, len(values), gap):
                key = values[index]
                cursor = index - gap
                while cursor >= start and values[cursor] > key:
                    values[cursor + gap] = values[cursor]
                    cursor -= gap
                values[cursor + gap] = key
        gap //= 2
    return values
