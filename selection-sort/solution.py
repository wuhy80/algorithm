def solve(data):
    values = list(data)
    for start in range(len(values)):
        minimum = start
        for index in range(start + 1, len(values)):
            if values[index] < values[minimum]:
                minimum = index
        values[start], values[minimum] = values[minimum], values[start]
    return values
