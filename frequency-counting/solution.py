def solve(data):
    counts, order = {}, []
    for value in data:
        if value not in counts:
            counts[value] = 0
            order.append(value)
        counts[value] += 1
    return [[value, counts[value]] for value in order]
