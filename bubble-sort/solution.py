def solve(data):
    values = list(data)
    for end in range(len(values) - 1, 0, -1):
        changed = False
        for index in range(end):
            if values[index] > values[index + 1]:
                values[index], values[index + 1] = values[index + 1], values[index]
                changed = True
        if not changed:
            break
    return values
