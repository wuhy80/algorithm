def solve(data):
    values = list(data)
    for index in range(1, len(values)):
        key = values[index]
        cursor = index - 1
        while cursor >= 0 and values[cursor] > key:
            values[cursor + 1] = values[cursor]
            cursor -= 1
        values[cursor + 1] = key
    return values
